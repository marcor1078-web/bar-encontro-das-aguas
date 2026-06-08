const {
  json,
  methodAllowed,
  readJson,
  requireMercadoPagoConfig,
  mercadoPagoFetch,
  mercadoPagoErrorMessage,
} = require("./_helpers");

module.exports = async function handler(req, res) {
  if (!methodAllowed(req, res, ["POST"])) return;
  const env = requireMercadoPagoConfig(res);
  if (!env) return;

  const body = await readJson(req);
  const operatingMode = String(body.operatingMode || "PDV").trim().toUpperCase();
  const terminalId = String(body.terminalId || env.terminalId).trim();
  if (!["PDV", "STANDALONE"].includes(operatingMode)) {
    json(res, 400, { error: "invalid_operating_mode" });
    return;
  }
  if (!terminalId) {
    json(res, 400, { error: "missing_terminal_id" });
    return;
  }

  const result = await mercadoPagoFetch("/terminals/v1/setup", {
    method: "PATCH",
    body: JSON.stringify({
      terminals: [
        {
          id: terminalId,
          operating_mode: operatingMode,
        },
      ],
    }),
  });

  if (!result.ok) {
    json(res, result.status, {
      error: "mercado_pago_terminal_setup_error",
      message: mercadoPagoErrorMessage(result.data),
      details: result.data,
    });
    return;
  }

  json(res, 200, result.data);
};
