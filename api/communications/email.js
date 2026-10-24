const SUPABASE_URL = process.env.SUPABASE_URL || "https://cuwzzrxstaxmzzzidzqv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "sb_publishable_2tj3Ss6dNdlWJkDutRvZfQ_xdRKoR_t";

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(data));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 500_000) {
        reject(new Error("Payload muito grande."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("JSON invalido."));
      }
    });
    req.on("error", reject);
  });
}

function bearerToken(req) {
  const header = String(req.headers.authorization || "");
  return header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function cleanText(value, maxLength = 300) {
  return String(value ?? "").replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function cleanEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

async function validateUser(accessToken) {
  const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${accessToken}` },
  });
  const user = await userResponse.json().catch(() => ({}));
  if (!userResponse.ok || !user?.id) return null;

  const profileResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=id,role,permissions,active`,
    { headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${accessToken}` } },
  );
  const profiles = await profileResponse.json().catch(() => []);
  const profile = Array.isArray(profiles) ? profiles[0] : null;
  return profile && profile.active !== false ? profile : null;
}

function hasPermission(profile, allowed) {
  if (profile?.role === "admin") return true;
  const permissions = Array.isArray(profile?.permissions) ? profile.permissions : [];
  return allowed.some((permission) => permissions.includes(permission));
}

function businessHeader(data) {
  const business = data.business || {};
  const name = cleanText(business.name, 120) || "DISTRIBUIDORA ENCONTRO DAS AGUAS";
  const details = [cleanText(business.cnpj, 40), cleanText(business.address, 180)].filter(Boolean);
  return { name, details };
}

function saleReceiptMessage(data) {
  const { name, details } = businessHeader(data);
  const sale = data.sale || {};
  const items = Array.isArray(sale.items) ? sale.items.slice(0, 100) : [];
  const itemRows = items
    .map((item) => {
      const quantity = Math.max(0, Number(item.qty || 0));
      const price = Number(item.price || 0);
      return `<tr><td>${escapeHtml(quantity)}x ${escapeHtml(cleanText(item.name, 120))}</td><td style="text-align:right">${escapeHtml(
        money(quantity * price),
      )}</td></tr>`;
    })
    .join("");
  const plainItems = items
    .map((item) => `${Number(item.qty || 0)}x ${cleanText(item.name, 120)} - ${money(Number(item.qty || 0) * Number(item.price || 0))}`)
    .join("\n");
  const title = `Comprovante de venda - ${name}`;
  const infoRows = [
    ["Venda", cleanText(sale.id, 80)],
    ["Data", cleanText(sale.date, 80)],
    ["Operador", cleanText(sale.operator, 120)],
    ["Mesa", cleanText(sale.tableName, 80)],
    ["Cliente", cleanText(sale.customerName, 120)],
    ["Pagamento", cleanText(sale.payment, 160)],
  ].filter((entry) => entry[1]);
  const html = `
    <div style="font-family:Arial,sans-serif;color:#172033;max-width:680px;margin:auto">
      <h1 style="font-size:22px;margin-bottom:4px">${escapeHtml(name)}</h1>
      ${details.map((line) => `<div style="color:#526071;font-size:13px">${escapeHtml(line)}</div>`).join("")}
      <h2 style="font-size:17px;margin-top:24px">Comprovante de venda</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${infoRows.map(([label, value]) => `<tr><td style="padding:4px 0;color:#526071">${escapeHtml(label)}</td><td style="padding:4px 0;text-align:right"><strong>${escapeHtml(value)}</strong></td></tr>`).join("")}
      </table>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:18px">
        <thead><tr><th style="text-align:left;border-bottom:1px solid #d6dce5;padding:8px 0">Produto</th><th style="text-align:right;border-bottom:1px solid #d6dce5;padding:8px 0">Valor</th></tr></thead>
        <tbody>${itemRows || '<tr><td colspan="2">Venda sem produtos detalhados.</td></tr>'}</tbody>
      </table>
      <div style="font-size:20px;font-weight:700;text-align:right;border-top:2px solid #172033;margin-top:16px;padding-top:12px">Total: ${escapeHtml(money(sale.total))}</div>
      ${Number(sale.cashReceived || 0) > 0 ? `<div style="text-align:right;margin-top:6px">Recebido: ${escapeHtml(money(sale.cashReceived))} | Troco: ${escapeHtml(money(sale.cashChange))}</div>` : ""}
      ${cleanText(sale.footer, 240) ? `<p style="margin-top:24px;color:#526071">${escapeHtml(cleanText(sale.footer, 240))}</p>` : ""}
    </div>`;
  const text = [
    name,
    ...details,
    "",
    "COMPROVANTE DE VENDA",
    ...infoRows.map(([label, value]) => `${label}: ${value}`),
    "",
    plainItems || "Venda sem produtos detalhados.",
    "",
    `Total: ${money(sale.total)}`,
    Number(sale.cashReceived || 0) > 0 ? `Recebido: ${money(sale.cashReceived)} | Troco: ${money(sale.cashChange)}` : "",
    cleanText(sale.footer, 240),
  ].filter(Boolean).join("\n");
  return { subject: title, html, text };
}

function salesReportMessage(data) {
  const { name, details } = businessHeader(data);
  const report = data.report || {};
  const summary = report.summary || {};
  const paymentTotals = report.paymentTotals || {};
  const sales = Array.isArray(report.sales) ? report.sales.slice(0, 300) : [];
  const period = cleanText(report.period, 160) || "Periodo informado no aplicativo";
  const paymentRows = ["Pix", "Debito", "Credito", "Dinheiro", "Fiado"]
    .map((method) => `<tr><td style="padding:5px 0">${method}</td><td style="padding:5px 0;text-align:right"><strong>${escapeHtml(money(paymentTotals[method]))}</strong></td></tr>`)
    .join("");
  const salesRows = sales
    .map(
      (sale) => `<tr>
        <td style="padding:6px;border-bottom:1px solid #e5e7eb">${escapeHtml(cleanText(sale.date, 80))}</td>
        <td style="padding:6px;border-bottom:1px solid #e5e7eb">${escapeHtml(cleanText(sale.items, 400))}</td>
        <td style="padding:6px;border-bottom:1px solid #e5e7eb">${escapeHtml(cleanText(sale.payment, 160))}</td>
        <td style="padding:6px;border-bottom:1px solid #e5e7eb;text-align:right">${escapeHtml(money(sale.total))}</td>
      </tr>`,
    )
    .join("");
  const title = `Relatorio de vendas - ${period}`;
  const html = `
    <div style="font-family:Arial,sans-serif;color:#172033;max-width:900px;margin:auto">
      <h1 style="font-size:22px;margin-bottom:4px">${escapeHtml(name)}</h1>
      ${details.map((line) => `<div style="color:#526071;font-size:13px">${escapeHtml(line)}</div>`).join("")}
      <h2 style="font-size:18px;margin-top:24px">${escapeHtml(title)}</h2>
      <p style="color:#526071">Gerado em ${escapeHtml(cleanText(report.generatedAt, 80))} por ${escapeHtml(cleanText(report.operator, 120))}</p>
      <table style="width:100%;border-collapse:collapse;background:#f6f8fb;padding:12px">
        <tr><td style="padding:7px">Total recebido</td><td style="padding:7px;text-align:right"><strong>${escapeHtml(money(summary.received))}</strong></td></tr>
        <tr><td style="padding:7px">Fiado separado</td><td style="padding:7px;text-align:right"><strong>${escapeHtml(money(summary.fiado))}</strong></td></tr>
        <tr><td style="padding:7px">Total geral lancado</td><td style="padding:7px;text-align:right"><strong>${escapeHtml(money(summary.launched))}</strong></td></tr>
        <tr><td style="padding:7px">Quantidade de vendas</td><td style="padding:7px;text-align:right"><strong>${escapeHtml(Number(summary.count || 0))}</strong></td></tr>
      </table>
      <h3>Formas de pagamento</h3>
      <table style="width:100%;border-collapse:collapse">${paymentRows}</table>
      <h3 style="margin-top:24px">Vendas detalhadas</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead><tr><th style="text-align:left;padding:6px">Data</th><th style="text-align:left;padding:6px">Produtos</th><th style="text-align:left;padding:6px">Pagamento</th><th style="text-align:right;padding:6px">Total</th></tr></thead>
        <tbody>${salesRows || '<tr><td colspan="4">Nenhuma venda no periodo.</td></tr>'}</tbody>
      </table>
    </div>`;
  const text = [
    name,
    ...details,
    "",
    title.toUpperCase(),
    `Total recebido: ${money(summary.received)}`,
    `Fiado separado: ${money(summary.fiado)}`,
    `Total geral lancado: ${money(summary.launched)}`,
    `Quantidade de vendas: ${Number(summary.count || 0)}`,
    "",
    ...["Pix", "Debito", "Credito", "Dinheiro", "Fiado"].map((method) => `${method}: ${money(paymentTotals[method])}`),
    "",
    ...sales.map((sale) => `${cleanText(sale.date, 80)} | ${cleanText(sale.items, 400)} | ${cleanText(sale.payment, 160)} | ${money(sale.total)}`),
  ].join("\n");
  return { subject: `${title} - ${name}`, html, text };
}

async function sendEmail({ to, subject, html, text }) {
  const apiKey = String(process.env.RESEND_API_KEY || "").trim();
  const from = String(process.env.EMAIL_FROM || "").trim();
  if (!apiKey || !from) {
    return {
      ok: false,
      status: 501,
      data: {
        error: "email_not_configured",
        message: "Configure RESEND_API_KEY e EMAIL_FROM nas variaveis da Vercel.",
      },
    };
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      text,
      reply_to: cleanEmail(process.env.EMAIL_REPLY_TO) || undefined,
    }),
  });
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    json(res, 405, { error: "method_not_allowed" });
    return;
  }

  const accessToken = bearerToken(req);
  if (!accessToken) {
    json(res, 401, { error: "missing_session", message: "Entre com uma conta online para enviar e-mails." });
    return;
  }
  const profile = await validateUser(accessToken);
  if (!profile) {
    json(res, 401, { error: "invalid_session", message: "Sessao invalida. Entre novamente no app." });
    return;
  }

  let body;
  try {
    body = await readJson(req);
  } catch (error) {
    json(res, 400, { error: "invalid_request", message: error.message });
    return;
  }

  const type = String(body.type || "");
  let recipients = [];
  let message;
  if (type === "sale_receipt") {
    if (!hasPermission(profile, ["pos", "sales", "cash"])) {
      json(res, 403, { error: "permission_required", message: "Seu usuario nao pode enviar comprovantes de venda." });
      return;
    }
    const recipient = cleanEmail(body.recipient);
    if (!recipient) {
      json(res, 400, { error: "invalid_recipient", message: "Informe um e-mail valido para o cliente." });
      return;
    }
    recipients = [recipient];
    message = saleReceiptMessage(body);
  } else if (type === "sales_report") {
    if (!hasPermission(profile, ["reports", "cash"])) {
      json(res, 403, { error: "permission_required", message: "Seu usuario nao pode enviar relatorios." });
      return;
    }
    recipients = String(process.env.REPORT_EMAILS || "").split(",").map(cleanEmail).filter(Boolean).slice(0, 10);
    if (!recipients.length) {
      json(res, 501, {
        error: "report_recipients_not_configured",
        message: "Configure REPORT_EMAILS nas variaveis da Vercel com os e-mails que receberao os relatorios.",
      });
      return;
    }
    message = salesReportMessage(body);
  } else {
    json(res, 400, { error: "invalid_type", message: "Tipo de e-mail invalido." });
    return;
  }

  const sent = await sendEmail({ to: recipients, ...message });
  if (!sent.ok) {
    json(res, sent.status || 502, {
      error: sent.data?.name || sent.data?.error || "email_send_failed",
      message: sent.data?.message || "O servico de e-mail nao conseguiu enviar a mensagem.",
      details: sent.data,
    });
    return;
  }
  json(res, 200, { ok: true, id: sent.data?.id || "", recipients: recipients.length });
};
