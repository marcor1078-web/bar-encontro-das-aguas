const { json, methodAllowed, mercadoPagoEnv, publicTerminalInfo } = require("./_helpers");

module.exports = async function handler(req, res) {
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
