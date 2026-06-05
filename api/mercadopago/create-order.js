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
        terminal_id: env.terminalId,
        print_on_terminal: env.printOnTerminal,
      },
    },
    description: body.description || "BAR ENCONTRO DAS AGUAS",
  };

  if (body.paymentMethod === "Credito" && env.defaultInstallments > 1) {
    payload.config.payment_method = {
      default_type: "credit_card",
      default_installments: env.defaultInstallments,
      installments_cost: "seller",
    };
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
