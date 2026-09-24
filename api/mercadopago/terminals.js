const { json, methodAllowed, mercadoPagoEnv, mercadoPagoFetch } = require("./_helpers");

module.exports = async function handler(req, res) {
  if (!methodAllowed(req, res, ["GET"])) return;
  const accounts = ["primary", "secondary"].filter((accountKey) => mercadoPagoEnv(accountKey).accessToken);
  if (!accounts.length) {
    json(res, 501, { error: "mercado_pago_token_not_configured", message: "Configure o Access Token do Mercado Pago." });
    return;
  }

  const results = await Promise.all(accounts.map(async (accountKey) => ({
    accountKey,
    result: await mercadoPagoFetch("/terminals/v1/list?limit=50&offset=0", {}, accountKey),
  })));
  const successful = results.filter((entry) => entry.result.ok);
  if (!successful.length) {
    json(res, results[0].result.status, { error: "mercado_pago_terminals_error", details: results[0].result.data });
    return;
  }
  const terminals = successful.flatMap(({ accountKey, result }) =>
    (result.data?.data?.terminals || []).map((terminal) => ({ ...terminal, account_key: accountKey })),
  );
  json(res, 200, {
    data: { terminals },
    paging: { total: terminals.length, limit: 100, offset: 0 },
    account_errors: results.filter((entry) => !entry.result.ok).map((entry) => entry.accountKey),
  });
};
