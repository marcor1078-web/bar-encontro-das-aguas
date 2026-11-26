const {
  json,
  methodAllowed,
  requireMercadoPagoConfig,
  mercadoPagoFetch,
  requireOnlineStaff,
} = require("./_helpers");

module.exports = async function handler(req, res) {
  if (!methodAllowed(req, res, ["GET"])) return;
  if (!await requireOnlineStaff(req, res)) return;

  const url = new URL(req.url, "https://distribuidora-encontro-das-aguas.local");
  const accountKey = url.searchParams.get("accountKey") === "secondary" ? "secondary" : "primary";
  if (!requireMercadoPagoConfig(res, accountKey)) return;
  const actionId = String(url.searchParams.get("id") || "").trim();
  if (!actionId) {
    json(res, 400, { error: "missing_action_id" });
    return;
  }

  const result = await mercadoPagoFetch(`/terminals/v1/actions/${encodeURIComponent(actionId)}`, {}, accountKey);
  if (!result.ok) {
    json(res, result.status, { error: "mercado_pago_print_status_error", message: result.data?.message || "Nao foi possivel consultar a impressao.", details: result.data });
    return;
  }
  json(res, 200, result.data);
};
