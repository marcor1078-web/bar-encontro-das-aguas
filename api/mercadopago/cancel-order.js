const {
  json,
  methodAllowed,
  readJson,
  requireMercadoPagoConfig,
  mercadoPagoFetch,
  mercadoPagoErrorMessage,
} = require("./_helpers");
const { randomUUID } = require("crypto");

module.exports = async function handler(req, res) {
  if (!methodAllowed(req, res, ["POST"])) return;
  if (!requireMercadoPagoConfig(res)) return;

  const body = await readJson(req);
  const orderId = String(body.id || "").trim();
  if (!orderId) {
    json(res, 400, { error: "missing_order_id", message: "Informe o ID da cobranca Mercado Pago." });
    return;
  }

  const result = await mercadoPagoFetch(`/v1/orders/${encodeURIComponent(orderId)}/cancel`, {
    method: "POST",
    headers: {
      "X-Idempotency-Key": body.idempotencyKey || randomUUID(),
      "x-allow-cancelable-status": "at_terminal",
    },
  });

  if (!result.ok) {
    json(res, result.status, {
      error: "mercado_pago_cancel_error",
      message: mercadoPagoErrorMessage(result.data),
      details: result.data,
    });
    return;
  }

  json(res, 200, result.data);
};
