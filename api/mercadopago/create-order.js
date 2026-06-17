const {
  json,
  methodAllowed,
  readJson,
  requireMercadoPagoConfig,
  mercadoPagoFetch,
  mercadoPagoErrorMessage,
} = require("./_helpers");
const { randomUUID } = require("crypto");

function safeReference(value) {
  return String(value || `bar-${Date.now()}`)
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .slice(0, 64);
}

function paymentType(method) {
  if (method === "Pix") return "qr";
  if (method === "Debito") return "debit_card";
  if (method === "Credito") return "credit_card";
  return "";
}

module.exports = async function handler(req, res) {
  if (!methodAllowed(req, res, ["POST"])) return;
  const env = requireMercadoPagoConfig(res);
  if (!env) return;

  const body = await readJson(req);
  const amount = Number(body.amount || 0);
  if (!amount || amount <= 0) {
    json(res, 400, { error: "invalid_amount" });
    return;
  }
  const terminalId = String(body.terminalId || env.terminalId).trim();
  const requestedPrintMode = body.printOnTerminal || env.printOnTerminal || "seller_ticket";
  const printOnTerminal = requestedPrintMode === "buyer_ticket" ? "seller_ticket" : requestedPrintMode;

  const idempotencyKey = body.idempotencyKey || randomUUID();
  const payload = {
    type: "point",
    external_reference: safeReference(body.externalReference),
    expiration_time: body.expirationTime || "PT2M",
    transactions: {
      payments: [{ amount: amount.toFixed(2) }],
    },
    config: {
      point: {
        terminal_id: terminalId,
        print_on_terminal: printOnTerminal,
      },
    },
    description: body.description || "BAR ENCONTRO DAS AGUAS",
  };

  const defaultType = paymentType(body.paymentMethod);
  if (defaultType) {
    payload.config.payment_method = {
      default_type: defaultType,
    };
    if (defaultType === "credit_card" && env.defaultInstallments > 1) {
      payload.config.payment_method.default_installments = env.defaultInstallments;
      payload.config.payment_method.installments_cost = "seller";
    }
  }

  if (env.integratorId || env.platformId || env.sponsorId) {
    payload.integration_data = {};
    if (env.integratorId) payload.integration_data.integrator_id = env.integratorId;
    if (env.platformId) payload.integration_data.platform_id = env.platformId;
    if (env.sponsorId) payload.integration_data.sponsor = { id: env.sponsorId };
  }

  const result = await mercadoPagoFetch("/v1/orders", {
    method: "POST",
    headers: { "X-Idempotency-Key": idempotencyKey },
    body: JSON.stringify(payload),
  });

  if (!result.ok) {
    json(res, result.status, {
      error: "mercado_pago_order_error",
      message: mercadoPagoErrorMessage(result.data),
      details: result.data,
    });
    return;
  }

  json(res, 200, result.data);
};
