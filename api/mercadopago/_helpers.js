const MP_API_BASE = "https://api.mercadopago.com";

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

function methodAllowed(req, res, methods) {
  if (methods.includes(req.method)) return true;
  res.setHeader("Allow", methods.join(", "));
  json(res, 405, { error: "method_not_allowed" });
  return false;
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Payload muito grande."));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function mercadoPagoEnv() {
  return {
    accessToken: String(process.env.MP_ACCESS_TOKEN || "").trim(),
    terminalId: String(process.env.MP_TERMINAL_ID || "").trim(),
    integratorId: String(process.env.MP_INTEGRATOR_ID || "").trim(),
    platformId: String(process.env.MP_PLATFORM_ID || "").trim(),
    sponsorId: String(process.env.MP_SPONSOR_ID || "").trim(),
    printOnTerminal: String(process.env.MP_PRINT_ON_TERMINAL || "no_ticket").trim(),
    defaultInstallments: Number(process.env.MP_DEFAULT_INSTALLMENTS || 1),
  };
}

function requireMercadoPagoConfig(res) {
  const env = mercadoPagoEnv();
  if (!env.accessToken || !env.terminalId) {
    json(res, 501, {
      error: "mercado_pago_not_configured",
      message: "Configure MP_ACCESS_TOKEN e MP_TERMINAL_ID nas variaveis de ambiente da Vercel.",
    });
    return null;
  }
  return env;
}

function requireMercadoPagoAccessToken(res) {
  const env = mercadoPagoEnv();
  if (!env.accessToken) {
    json(res, 501, {
      error: "mercado_pago_token_not_configured",
      message: "Configure MP_ACCESS_TOKEN nas variaveis de ambiente da Vercel.",
    });
    return null;
  }
  return env;
}

async function mercadoPagoFetch(path, options = {}) {
  const env = mercadoPagoEnv();
  const response = await fetch(`${MP_API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.accessToken}`,
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  return { ok: response.ok, status: response.status, data };
}

function publicTerminalInfo(terminalId) {
  return terminalId ? `...${terminalId.slice(-8)}` : "";
}

function mercadoPagoErrorMessage(data) {
  const details = data?.details || data || {};
  const errors = details.errors || details.error || details.message || details.cause || details;
  if (typeof errors === "string") return errors;
  if (Array.isArray(errors)) {
    return errors.map((entry) => entry.message || entry.description || entry.code || JSON.stringify(entry)).join(" | ");
  }
  if (errors?.message) return errors.message;
  if (errors?.description) return errors.description;
  if (details?.error) return details.error;
  return JSON.stringify(details).slice(0, 600);
}

module.exports = {
  json,
  methodAllowed,
  readJson,
  mercadoPagoEnv,
  requireMercadoPagoConfig,
  requireMercadoPagoAccessToken,
  mercadoPagoFetch,
  publicTerminalInfo,
  mercadoPagoErrorMessage,
};
