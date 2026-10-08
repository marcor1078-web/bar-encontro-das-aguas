const { json, methodAllowed, mercadoPagoEnv, publicTerminalInfo } = require("./_helpers");
const recoverSales = require("../../lib/mercadopago-recovery");

function queryAction(req) {
  if (req.query?.action !== undefined) return String(req.query.action || "");
  try {
    return new URL(req.url || "/", "https://app.local").searchParams.get("action") || "";
  } catch {
    return "";
  }
}

module.exports = async function handler(req, res) {
  if (queryAction(req) === "recover-sales") {
    await recoverSales(req, res);
    return;
  }
  if (!methodAllowed(req, res, ["GET"])) return;

  const env = mercadoPagoEnv();
  const secondary = mercadoPagoEnv("secondary");
  json(res, 200, {
    enabled: Boolean(env.accessToken || secondary.accessToken),
    terminalId: env.terminalId,
    terminal: publicTerminalInfo(env.terminalId),
    printOnTerminal: env.printOnTerminal,
    defaultInstallments: env.defaultInstallments,
    secondaryEnabled: Boolean(secondary.accessToken),
    secondaryTerminalId: secondary.terminalId,
  });
};
