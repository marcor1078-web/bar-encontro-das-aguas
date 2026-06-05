const { json, methodAllowed, requireMercadoPagoConfig, mercadoPagoFetch } = require("./_helpers");

module.exports = async function handler(req, res) {
  if (!methodAllowed(req, res, ["GET"])) return;
  if (!requireMercadoPagoConfig(res)) return;

  const url = new URL(req.url, "https://bar-encontro-das-aguas.local");
  const orderId = url.searchParams.get("id");
  if (!orderId) {
    json(res, 400, { error: "missing_order_id" });
    return;
  }

  const result = await mercadoPagoFetch(`/v1/orders/${encodeURIComponent(orderId)}`);
  if (!result.ok) {
    json(res, result.status, { error: "mercado_pago_status_error", details: result.data });
    return;
  }

  json(res, 200, result.data);
};
