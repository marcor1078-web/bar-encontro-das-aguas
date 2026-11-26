const MP_API_BASE = "https://api.mercadopago.com";
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cuwzzrxstaxmzzzidzqv.supabase.co";
const SUPABASE_PUBLIC_KEY = String(
  process.env.SUPABASE_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "sb_publishable_2tj3Ss6dNdlWJkDutRvZfQ_xdRKoR_t",
).trim();

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
      if (body.length > 1_500_000) {
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

function normalizeMercadoPagoAccountKey(value) {
  return value === "secondary" ? "secondary" : "primary";
}

function mercadoPagoEnv(accountKey = "primary") {
  const normalizedAccountKey = normalizeMercadoPagoAccountKey(accountKey);
  const secondary = normalizedAccountKey === "secondary";
  const printOnTerminal = String(process.env.MP_PRINT_ON_TERMINAL || "seller_ticket").trim();
  const allowedPrintModes = ["no_ticket", "seller_ticket", "buyer_ticket"];
  return {
    accountKey: normalizedAccountKey,
    accessToken: String(secondary ? process.env.MP_SECONDARY_ACCESS_TOKEN || "" : process.env.MP_ACCESS_TOKEN || "").trim(),
    terminalId: String(secondary ? process.env.MP_SECONDARY_TERMINAL_ID || "" : process.env.MP_TERMINAL_ID || "").trim(),
    integratorId: String(process.env.MP_INTEGRATOR_ID || "").trim(),
    platformId: String(process.env.MP_PLATFORM_ID || "").trim(),
    sponsorId: String(process.env.MP_SPONSOR_ID || "").trim(),
    printOnTerminal: allowedPrintModes.includes(printOnTerminal) ? printOnTerminal : "seller_ticket",
    defaultInstallments: Number(process.env.MP_DEFAULT_INSTALLMENTS || 1),
  };
}

function requireMercadoPagoConfig(res, accountKey = "primary") {
  const env = mercadoPagoEnv(accountKey);
  if (!env.accessToken) {
    json(res, 501, {
      error: "mercado_pago_not_configured",
      message: accountKey === "secondary"
        ? "Configure MP_SECONDARY_ACCESS_TOKEN nas variaveis de ambiente da Vercel."
        : "Configure MP_ACCESS_TOKEN nas variaveis de ambiente da Vercel.",
    });
    return null;
  }
  return env;
}

function requireMercadoPagoAccessToken(res, accountKey = "primary") {
  const env = mercadoPagoEnv(accountKey);
  if (!env.accessToken) {
    json(res, 501, {
      error: "mercado_pago_token_not_configured",
      message: "Configure MP_ACCESS_TOKEN nas variaveis de ambiente da Vercel.",
    });
    return null;
  }
  return env;
}

async function mercadoPagoFetch(path, options = {}, accountKey = "primary") {
  const env = mercadoPagoEnv(accountKey);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18_000);
  try {
    const response = await fetch(`${MP_API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.accessToken}`,
        ...(options.headers || {}),
      },
    });
    const text = await response.text();
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (error) {
        data = { error: "invalid_mercado_pago_response", message: text.slice(0, 600) };
      }
    }
    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    return {
      ok: false,
      status: error?.name === "AbortError" ? 504 : 502,
      data: {
        error: error?.name === "AbortError" ? "mercado_pago_timeout" : "mercado_pago_network_error",
        message: error?.name === "AbortError" ? "O Mercado Pago nao respondeu dentro do tempo limite." : error.message || "Falha de rede com o Mercado Pago.",
      },
    };
  } finally {
    clearTimeout(timeout);
  }
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

async function requireOnlineStaff(req, res, allowedPermissions = ["pos", "sales"]) {
  if (!SUPABASE_PUBLIC_KEY) {
    json(res, 501, {
      error: "supabase_public_key_not_configured",
      message: "A chave publicavel do Supabase nao esta configurada.",
    });
    return null;
  }

  const authorization = String(req.headers.authorization || "");
  const accessToken = authorization.toLowerCase().startsWith("bearer ") ? authorization.slice(7).trim() : "";
  if (!accessToken) {
    json(res, 401, { error: "missing_session", message: "Entre no app com uma conta online autorizada." });
    return null;
  }

  let authResponse;
  let authUser;
  try {
    authResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_PUBLIC_KEY, Authorization: `Bearer ${accessToken}` },
    });
    authUser = await authResponse.json().catch(() => ({}));
  } catch (error) {
    json(res, 502, { error: "session_check_failed", message: "Nao foi possivel validar a sessao online." });
    return null;
  }
  if (!authResponse.ok || !authUser?.id) {
    json(res, 401, { error: "invalid_session", message: "Sessao online invalida. Entre novamente no app." });
    return null;
  }

  let profileResponse;
  let profiles;
  try {
    const query = new URLSearchParams({ id: `eq.${authUser.id}`, select: "role,permissions,active", limit: "1" });
    profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles?${query}`, {
      headers: {
        apikey: SUPABASE_PUBLIC_KEY,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    profiles = await profileResponse.json().catch(() => []);
  } catch (error) {
    json(res, 502, { error: "profile_check_failed", message: "Nao foi possivel validar as permissoes da conta." });
    return null;
  }
  if (!profileResponse.ok) {
    json(res, 502, { error: "profile_check_failed", message: "Nao foi possivel validar as permissoes da conta." });
    return null;
  }

  const profile = Array.isArray(profiles) ? profiles[0] : null;
  const permissions = Array.isArray(profile?.permissions) ? profile.permissions : [];
  const allowed = profile?.role === "admin" || allowedPermissions.some((permission) => permissions.includes(permission));
  if (!profile || profile.active === false || !allowed) {
    json(res, 403, { error: "permission_denied", message: "Sua conta nao tem permissao para imprimir fichas na Point." });
    return null;
  }
  return { userId: authUser.id, profile };
}

module.exports = {
  json,
  methodAllowed,
  readJson,
  mercadoPagoEnv,
  normalizeMercadoPagoAccountKey,
  requireMercadoPagoConfig,
  requireMercadoPagoAccessToken,
  mercadoPagoFetch,
  publicTerminalInfo,
  mercadoPagoErrorMessage,
  requireOnlineStaff,
};
