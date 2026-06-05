const { json, methodAllowed, requireMercadoPagoAccessToken, mercadoPagoFetch } = require("./_helpers");

module.exports = async function handler(req, res) {
  if (!methodAllowed(req, res, ["GET"])) return;
  if (!requireMercadoPagoAccessToken(res)) return;

  const result = await mercadoPagoFetch("/terminals/v1/list?limit=50&offset=0");
  if (!result.ok) {
    json(res, result.status, { error: "mercado_pago_terminals_error", details: result.data });
    return;
  }

  json(res, 200, result.data);
};
