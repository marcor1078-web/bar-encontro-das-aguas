const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cuwzzrxstaxmzzzidzqv.supabase.co";

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 200_000) {
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

function bearerToken(req) {
  const header = req.headers.authorization || "";
  return header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
}

async function supabaseFetch(path, options = {}) {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  return { ok: response.ok, status: response.status, data };
}

function errorMessage(data) {
  if (typeof data?.message === "string") return data.message;
  if (typeof data?.error_description === "string") return data.error_description;
  if (typeof data?.error === "string") return data.error;
  return JSON.stringify(data).slice(0, 400);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    json(res, 405, { error: "method_not_allowed" });
    return;
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!serviceRoleKey) {
    json(res, 501, {
      error: "supabase_service_role_not_configured",
      message: "Configure SUPABASE_SERVICE_ROLE_KEY nas variaveis de ambiente da Vercel.",
    });
    return;
  }

  const accessToken = bearerToken(req);
  if (!accessToken) {
    json(res, 401, { error: "missing_session", message: "Sessao do administrador ausente." });
    return;
  }

  const body = await readJson(req);
  const userId = String(body.userId || "").trim();
  const password = String(body.password || "").trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId)) {
    json(res, 400, { error: "invalid_user_id", message: "Usuario invalido." });
    return;
  }
  if (password.length < 6) {
    json(res, 400, { error: "weak_password", message: "A nova senha precisa ter pelo menos 6 caracteres." });
    return;
  }

  const callerResult = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const caller = await callerResult.json().catch(() => ({}));
  if (!callerResult.ok || !caller?.id) {
    json(res, 401, { error: "invalid_session", message: "Sessao invalida. Entre novamente no app." });
    return;
  }

  const profileResult = await supabaseFetch(`/rest/v1/profiles?id=eq.${encodeURIComponent(caller.id)}&select=role,active`);
  if (!profileResult.ok) {
    json(res, profileResult.status, { error: "profile_check_failed", message: errorMessage(profileResult.data) });
    return;
  }

  const adminProfile = Array.isArray(profileResult.data) ? profileResult.data[0] : null;
  if (!adminProfile || adminProfile.role !== "admin" || adminProfile.active === false) {
    json(res, 403, { error: "admin_required", message: "Apenas administrador ativo pode trocar senha online." });
    return;
  }

  const updateResult = await supabaseFetch(`/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
    method: "PUT",
    body: JSON.stringify({ password }),
  });
  if (!updateResult.ok) {
    json(res, updateResult.status, {
      error: "password_update_failed",
      message: errorMessage(updateResult.data),
      details: updateResult.data,
    });
    return;
  }

  json(res, 200, { ok: true });
};
