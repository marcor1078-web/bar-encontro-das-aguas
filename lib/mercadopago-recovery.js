const { randomUUID } = require("crypto");
const {
  json,
  methodAllowed,
  readJson,
  mercadoPagoEnv,
  mercadoPagoFetch,
  mercadoPagoErrorMessage,
} = require("./_helpers");

const SUPABASE_URL = process.env.SUPABASE_URL || "https://cuwzzrxstaxmzzzidzqv.supabase.co";
const PAYMENT_DETAILS_PREFIX = "PAYMENT_DETAILS:";

function bearerToken(req) {
  const header = String(req.headers.authorization || "");
  return header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
}

function queryValue(req, name) {
  if (req.query?.[name] !== undefined) return String(req.query[name] || "");
  try {
    return new URL(req.url || "/", "https://app.local").searchParams.get(name) || "";
  } catch {
    return "";
  }
}

function errorMessage(data) {
  if (typeof data?.message === "string") return data.message;
  if (typeof data?.error_description === "string") return data.error_description;
  if (typeof data?.error === "string") return data.error;
  return JSON.stringify(data || {}).slice(0, 500);
}

async function supabaseAdminFetch(path, options = {}) {
  const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text.slice(0, 500) };
  }
  return { ok: response.ok, status: response.status, data };
}

async function validateAdmin(req) {
  const accessToken = bearerToken(req);
  if (!accessToken) return { error: { status: 401, code: "missing_session", message: "Entre com a conta de administrador." } };
  const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!serviceRoleKey) return { error: { status: 501, code: "service_role_missing", message: "SUPABASE_SERVICE_ROLE_KEY nao configurada." } };

  const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: serviceRoleKey, Authorization: `Bearer ${accessToken}` },
  });
  const user = await userResponse.json().catch(() => ({}));
  if (!userResponse.ok || !user?.id) return { error: { status: 401, code: "invalid_session", message: "Sessao invalida. Entre novamente." } };

  const profileResult = await supabaseAdminFetch(
    `/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=id,name,role,active`,
  );
  const profile = Array.isArray(profileResult.data) ? profileResult.data[0] : null;
  if (!profileResult.ok || !profile || profile.role !== "admin" || profile.active === false) {
    return { error: { status: 403, code: "admin_required", message: "Somente o administrador pode recuperar vendas." } };
  }
  return { user, profile };
}

function validIsoDate(value) {
  const parsed = Date.parse(value || "");
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : "";
}

function paymentMethod(order) {
  const type = String(order?.config?.payment_method?.default_type || "").toLowerCase();
  if (type === "qr") return "Pix";
  if (type === "debit_card") return "Debito";
  if (type === "credit_card") return "Credito";
  return "Cartao";
}

function orderAmount(order) {
  const payments = order?.transactions?.payments;
  const paymentsTotal = Array.isArray(payments)
    ? payments.reduce((sum, payment) => sum + Number(payment.amount || payment.total_paid_amount || 0), 0)
    : 0;
  return Number(Number(paymentsTotal || order?.total_amount || order?.amount || 0).toFixed(2));
}

function orderRows(payload) {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.elements)) return payload.elements;
  return [];
}

function orderCandidate(order, accountKey) {
  return {
    orderId: String(order.id || ""),
    accountKey,
    externalReference: String(order.external_reference || ""),
    createdAt: order.created_date || order.date_created || order.last_updated_date || "",
    updatedAt: order.last_updated_date || order.date_last_updated || "",
    status: String(order.status || ""),
    statusDetail: String(order.status_detail || ""),
    amount: orderAmount(order),
    method: paymentMethod(order),
    installments: Math.max(1, Number(order?.config?.payment_method?.default_installments || 1)),
    terminalId: String(order?.config?.point?.terminal_id || ""),
    description: String(order.description || "Venda recuperada Mercado Pago").slice(0, 160),
  };
}

async function listAccountOrders(accountKey, begin, end) {
  if (!mercadoPagoEnv(accountKey).accessToken) return { orders: [], skipped: true };
  for (const includeType of [true, false]) {
    const orders = [];
    for (let page = 1; page <= 5; page += 1) {
      const params = new URLSearchParams({
        begin_date: begin,
        end_date: end,
        page: String(page),
        page_size: "100",
        sort_by: "created_date",
        sort_order: "asc",
      });
      if (includeType) params.set("type", "point");
      const result = await mercadoPagoFetch(`/v1/orders?${params}`, {}, accountKey);
      if (!result.ok) {
        if (includeType) break;
        return { orders: [], error: mercadoPagoErrorMessage(result.data) };
      }
      const pageRows = orderRows(result.data);
      orders.push(...pageRows);
      if (pageRows.length < 100) break;
    }
    if (orders.length || !includeType) return { orders };
  }
  return { orders: [] };
}

function referencesFromSales(sales) {
  const references = new Set();
  for (const sale of sales || []) {
    const payment = String(sale.payment || "");
    if (!payment.startsWith(PAYMENT_DETAILS_PREFIX)) continue;
    try {
      const details = JSON.parse(payment.slice(PAYMENT_DETAILS_PREFIX.length));
      for (const reference of details.providerReferences || []) {
        const orderId = String(reference.orderId || reference.reference || "").trim();
        if (orderId) references.add(orderId);
      }
    } catch {
      // Um pagamento antigo malformado nao deve impedir a conferencia dos demais.
    }
  }
  return references;
}

async function salesBetween(begin, end) {
  const query = new URLSearchParams({
    select: "id,created_at,total,payment,status",
    created_at: `gte.${begin}`,
    order: "created_at.asc",
  });
  query.append("created_at", `lt.${end}`);
  const result = await supabaseAdminFetch(`/rest/v1/sales?${query}`);
  if (!result.ok) throw new Error(errorMessage(result.data));
  return result.data || [];
}

async function findOrder(orderId, accountKey) {
  const result = await mercadoPagoFetch(`/v1/orders/${encodeURIComponent(orderId)}`, {}, accountKey);
  if (!result.ok) throw new Error(mercadoPagoErrorMessage(result.data));
  return result.data;
}

async function alreadyRecovered(orderId) {
  const filter = encodeURIComponent(`*${orderId}*`);
  const result = await supabaseAdminFetch(`/rest/v1/sales?select=id&payment=like.${filter}&limit=1`);
  if (!result.ok) throw new Error(errorMessage(result.data));
  return Array.isArray(result.data) && result.data.length > 0;
}

function encodedRecoveredPayment(candidate) {
  return `${PAYMENT_DETAILS_PREFIX}${JSON.stringify({
    payment: candidate.method,
    breakdown: [{ method: candidate.method, amount: candidate.amount, installments: candidate.installments }],
    cashReceived: 0,
    cashChange: 0,
    discount: { type: "none", value: 0, amount: 0 },
    paymentOrigin: "recovered_provider",
    manualReference: "Recuperada pela conciliacao do Mercado Pago",
    terminalLabel: candidate.terminalId,
    providerReferences: [
      {
        provider: "mercado_pago",
        reference: candidate.orderId,
        orderId: candidate.orderId,
        accountKey: candidate.accountKey,
        terminalId: candidate.terminalId,
        terminalLabel: candidate.terminalId,
        method: candidate.method,
        amount: candidate.amount,
        status: candidate.status,
        statusDetail: candidate.statusDetail,
        checkedAt: new Date().toISOString(),
      },
    ],
    splitPersonName: "",
    splitMode: "",
  })}`;
}

async function recoverOrder(candidate, userId) {
  const saleId = randomUUID();
  const saleResult = await supabaseAdminFetch("/rest/v1/sales", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      id: saleId,
      cashier_id: userId,
      client_id: null,
      table_id: null,
      payment: encodedRecoveredPayment(candidate),
      status: "Pagamento recuperado",
      service_fee: 0,
      total: candidate.amount,
      cost: 0,
      created_at: candidate.createdAt || new Date().toISOString(),
    }),
  });
  if (!saleResult.ok) throw new Error(errorMessage(saleResult.data));

  const itemResult = await supabaseAdminFetch("/rest/v1/sale_items", {
    method: "POST",
    body: JSON.stringify({
      id: randomUUID(),
      sale_id: saleId,
      product_id: null,
      name: candidate.description || "Venda recuperada Mercado Pago",
      qty: 1,
      price: candidate.amount,
      cost: 0,
    }),
  });
  if (!itemResult.ok) {
    await supabaseAdminFetch(`/rest/v1/sales?id=eq.${encodeURIComponent(saleId)}`, { method: "DELETE" });
    throw new Error(errorMessage(itemResult.data));
  }
  return saleId;
}

module.exports = async function handler(req, res) {
  if (!methodAllowed(req, res, ["GET", "POST"])) return;
  res.setHeader("Cache-Control", "no-store");

  const admin = await validateAdmin(req);
  if (admin.error) {
    json(res, admin.error.status, { error: admin.error.code, message: admin.error.message });
    return;
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await readJson(req);
      const orderId = String(body.orderId || "").trim();
      const accountKey = body.accountKey === "secondary" ? "secondary" : "primary";
      if (!orderId) throw new Error("Order do Mercado Pago nao informada.");
      if (await alreadyRecovered(orderId)) {
        json(res, 409, { error: "sale_already_registered", message: "Este pagamento ja esta registrado em Vendas." });
        return;
      }
      const order = await findOrder(orderId, accountKey);
      const candidate = orderCandidate(order, accountKey);
      if (!candidate.externalReference.startsWith("sale-")) {
        json(res, 409, { error: "not_app_order", message: "Esta cobranca nao foi criada pelo app." });
        return;
      }
      if (candidate.status !== "processed" || candidate.amount <= 0) {
        json(res, 409, { error: "payment_not_processed", message: "A cobranca nao esta aprovada no Mercado Pago." });
        return;
      }
      const saleId = await recoverOrder(candidate, admin.user.id);
      json(res, 200, { ok: true, saleId, candidate });
    } catch (error) {
      json(res, 500, { error: "recovery_failed", message: error.message || "Nao foi possivel recuperar a venda." });
    }
    return;
  }

  const begin = validIsoDate(queryValue(req, "begin"));
  const end = validIsoDate(queryValue(req, "end"));
  if (!begin || !end || Date.parse(end) <= Date.parse(begin)) {
    json(res, 400, { error: "invalid_period", message: "Periodo de conferencia invalido." });
    return;
  }

  try {
    const [sales, primaryResult, secondaryResult] = await Promise.all([
      salesBetween(begin, end),
      listAccountOrders("primary", begin, end),
      listAccountOrders("secondary", begin, end),
    ]);
    const registered = referencesFromSales(sales);
    const allOrders = [
      ...(primaryResult.orders || []).map((order) => orderCandidate(order, "primary")),
      ...(secondaryResult.orders || []).map((order) => orderCandidate(order, "secondary")),
    ];
    const processed = allOrders.filter(
      (order) => order.status === "processed" && order.amount > 0 && order.externalReference.startsWith("sale-"),
    );
    const missing = processed.filter((order) => !registered.has(order.orderId));
    json(res, 200, {
      begin,
      end,
      salesCount: sales.length,
      processedCount: processed.length,
      missing,
      accountErrors: [
        primaryResult.error ? { accountKey: "primary", message: primaryResult.error } : null,
        secondaryResult.error ? { accountKey: "secondary", message: secondaryResult.error } : null,
      ].filter(Boolean),
    });
  } catch (error) {
    json(res, 502, { error: "reconciliation_failed", message: error.message || "Falha ao conferir pagamentos." });
  }
};
