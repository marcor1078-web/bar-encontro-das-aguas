const { json, methodAllowed, mercadoPagoEnv, publicTerminalInfo } = require("./_helpers");

module.exports = async function handler(req, res) {
  if (!methodAllowed(req, res, ["GET"])) return;

  const env = mercadoPagoEnv();
  json(res, 200, {
    enabled: Boolean(env.accessToken && env.terminalId),
    terminal: publicTerminalInfo(env.terminalId),
    printOnTerminal: env.printOnTerminal,
    defaultInstallments: env.defaultInstallments,
  });
};
