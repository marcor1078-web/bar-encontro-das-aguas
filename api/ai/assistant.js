const SUPABASE_URL = process.env.SUPABASE_URL || "https://cuwzzrxstaxmzzzidzqv.supabase.co";
const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const ALLOWED_ACTIONS = new Set(["update_stock", "update_price", "create_expense", "create_cash_expense", "navigate"]);

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(data));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 300_000) {
        reject(new Error("Payload muito grande."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("JSON invalido."));
      }
    });
    req.on("error", reject);
  });
}

function bearerToken(req) {
  const header = String(req.headers.authorization || "");
  return header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
}

function openAIText(response) {
  for (const item of response.output || []) {
    if (item.type !== "message") continue;
    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) return content.text;
    }
  }
  return "";
}

function openAIAction(response) {
  const call = (response.output || []).find((item) => item.type === "function_call" && item.name === "propose_app_action");
  if (!call) return null;
  try {
    const args = JSON.parse(call.arguments || "{}");
    const type = String(args.action || "");
    if (!ALLOWED_ACTIONS.has(type)) return null;
    const payload = JSON.parse(String(args.payload_json || "{}"));
    return {
      type,
      title: String(args.title || "Acao sugerida").slice(0, 120),
      summary: String(args.summary || "Confira os dados antes de executar.").slice(0, 500),
      payload,
    };
  } catch {
    return null;
  }
}

function localMoney(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function localManagerAnswer(message, businessContext) {
  const request = String(message || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (!/(gerente|resumo|executivo|prioridade|situacao.*hoje|como.*negocio)/.test(request)) return "";

  const briefing = businessContext?.management_briefing || {};
  const anomalies = Array.isArray(businessContext?.anomalies) ? businessContext.anomalies : [];
  const inventory = Array.isArray(businessContext?.inventory_intelligence) ? businessContext.inventory_intelligence : [];
  const forecasts = Array.isArray(businessContext?.cash_flow_forecast) ? businessContext.cash_flow_forecast : [];
  const reconciliation = businessContext?.payment_reconciliation || {};
  const variation = Number(briefing.variation_percent || 0);
  const suggestions = Array.isArray(briefing.suggestions) ? briefing.suggestions.filter(Boolean) : [];
  const reorder = inventory.filter((item) => Number(item.suggested_reorder || 0) > 0).slice(0, 3);
  const pendingPayments = Number(reconciliation.pending || 0) + Number(reconciliation.discrepancy || 0);
  const forecast30 = forecasts.find((item) => Number(item.days) === 30);
  const lines = [
    "Resumo automatico do gerente",
    `Recebido hoje: ${localMoney(briefing.received_today)} (${variation >= 0 ? "+" : ""}${variation.toFixed(1)}% em relacao a media recente).`,
    `Despesas em aberto: ${localMoney(briefing.open_expenses)}.`,
  ];

  if (forecast30) lines.push(`Projecao liquida para 30 dias: ${localMoney(forecast30.projectedBalance)}.`);
  if (pendingPayments) lines.push(`Pagamentos que exigem conferencia: ${pendingPayments}.`);
  lines.push("", "Prioridades:");
  if (suggestions.length) suggestions.slice(0, 4).forEach((item, index) => lines.push(`${index + 1}. ${item}`));
  else if (reorder.length) reorder.forEach((item, index) => lines.push(`${index + 1}. Repor ${item.product}: ${item.suggested_reorder} unidade(s).`));
  else lines.push("1. Nenhuma prioridade critica foi detectada agora.");

  if (anomalies.length) {
    lines.push("", "Alertas:");
    anomalies.slice(0, 5).forEach((item) => lines.push(`- ${item.title}: ${item.detail}`));
  }
  lines.push("", "Este resumo foi calculado pelo proprio sistema. Para perguntas livres e execucao assistida de tarefas, configure a chave da OpenAI na Vercel.");
  return lines.join("\n");
}

async function validateUser(accessToken, serviceRoleKey) {
  const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: serviceRoleKey, Authorization: `Bearer ${accessToken}` },
  });
  const user = await userResponse.json().catch(() => ({}));
  if (!userResponse.ok || !user?.id) return null;

  const profileResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=id,name,role,permissions,active`,
    { headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` } },
  );
  const profiles = await profileResponse.json().catch(() => []);
  const profile = Array.isArray(profiles) ? profiles[0] : null;
  if (!profile || profile.active === false) return null;
  const permissions = Array.isArray(profile.permissions) ? profile.permissions : [];
  if (profile.role !== "admin" && !permissions.includes("assistant")) return { forbidden: true };
  return profile;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    json(res, 405, { error: "method_not_allowed" });
    return;
  }

  const openAIKey = String(process.env.OPENAI_API_KEY || "").trim();
  const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!serviceRoleKey) {
    json(res, 501, { error: "supabase_not_configured", message: "Configure SUPABASE_SERVICE_ROLE_KEY na Vercel." });
    return;
  }

  const accessToken = bearerToken(req);
  if (!accessToken) {
    json(res, 401, { error: "missing_session", message: "Entre com uma conta online para usar o assistente." });
    return;
  }

  const profile = await validateUser(accessToken, serviceRoleKey);
  if (!profile) {
    json(res, 401, { error: "invalid_session", message: "Sessao invalida. Entre novamente no app." });
    return;
  }
  if (profile.forbidden) {
    json(res, 403, { error: "assistant_permission_required", message: "Seu usuario nao tem permissao para usar o assistente." });
    return;
  }

  let body;
  try {
    body = await readJson(req);
  } catch (error) {
    json(res, 400, { error: "invalid_request", message: error.message });
    return;
  }

  const message = String(body.message || "").trim().slice(0, 4000);
  if (!message) {
    json(res, 400, { error: "empty_message", message: "Digite uma mensagem para o assistente." });
    return;
  }
  const history = Array.isArray(body.history)
    ? body.history.slice(-10).map((item) => ({
        role: item.role === "assistant" ? "assistant" : "user",
        content: String(item.content || "").slice(0, 2000),
      }))
    : [];
  const businessContext = body.context && typeof body.context === "object" ? body.context : {};

  if (!openAIKey) {
    const localAnswer = localManagerAnswer(message, businessContext);
    if (localAnswer) {
      json(res, 200, { answer: localAnswer, action: null, model: "gerente-local" });
      return;
    }
    json(res, 501, {
      error: "openai_not_configured",
      message: "O resumo Gerente diario funciona sem chave. Para conversar livremente com a IA, configure OPENAI_API_KEY nas variaveis da Vercel.",
    });
    return;
  }

  const instructions = `Voce e o assistente operacional da DISTRIBUIDORA ENCONTRO DAS AGUAS. Responda sempre em portugues do Brasil, de forma objetiva e cuidadosa.
Use somente os dados do contexto fornecido. Nao invente vendas, produtos, saldos, dividas ou identificadores.
Quando o contexto trouxer management_briefing, inventory_intelligence, cash_flow_forecast, anomalies ou payment_reconciliation, use esses campos para atuar como gerente diario: destaque prioridades, explique riscos e proponha proximas acoes praticas.
Trate previsoes como estimativas, diferencie fiado de valor recebido e nunca apresente uma anomalia como fraude comprovada.
Para perguntas e analises, responda normalmente e nao chame ferramenta.
Quando o usuario pedir uma alteracao, chame propose_app_action uma unica vez. A acao sera apenas proposta e exigira confirmacao humana no aplicativo.
Acoes permitidas e payload_json esperado:
- update_stock: {"product_id":"uuid","mode":"add|remove|set","quantity":numero,"reason":"texto"}
- update_price: {"product_id":"uuid","new_price":numero}
- create_expense: {"description":"texto","category":"texto","amount":numero,"expense_date":"AAAA-MM-DD","due_date":"AAAA-MM-DD"}
- create_cash_expense: {"amount":numero,"reason":"texto","date":"AAAA-MM-DD"}
- navigate: {"view":"dashboard|pos|tables|sales|cash|stock|suppliers|clients|catalog|reports|team|settings"}
Nunca proponha exclusoes, alteracao de usuarios, fechamento de caixa, venda, pagamento ou operacao de maquininha nesta versao.
Se faltarem dados essenciais, faca uma pergunta em vez de propor a acao.
Data local atual: ${new Date().toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })}.
Usuario: ${profile.name || "Usuario"}; cargo: ${profile.role}.`;

  const input = [
    { role: "developer", content: instructions },
    ...history,
    {
      role: "user",
      content: `CONTEXTO DO NEGOCIO:\n${JSON.stringify(businessContext)}\n\nPEDIDO DO USUARIO:\n${message}`,
    },
  ];

  const aiResponse = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${openAIKey}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      input,
      store: false,
      max_output_tokens: 900,
      tools: [
        {
          type: "function",
          name: "propose_app_action",
          description: "Propoe uma unica alteracao no aplicativo para confirmacao humana. Nunca executa diretamente.",
          strict: true,
          parameters: {
            type: "object",
            additionalProperties: false,
            properties: {
              action: { type: "string", enum: [...ALLOWED_ACTIONS] },
              title: { type: "string" },
              summary: { type: "string" },
              payload_json: { type: "string", description: "Objeto JSON serializado com os parametros exatos da acao." },
            },
            required: ["action", "title", "summary", "payload_json"],
          },
        },
      ],
      tool_choice: "auto",
    }),
  });

  const responseData = await aiResponse.json().catch(() => ({}));
  if (!aiResponse.ok) {
    const messageText = responseData?.error?.message || "Falha ao consultar a OpenAI.";
    json(res, aiResponse.status, { error: "openai_request_failed", message: messageText });
    return;
  }

  const action = openAIAction(responseData);
  const answer = openAIText(responseData) || action?.summary || "Nao consegui montar uma resposta. Tente explicar de outra forma.";
  json(res, 200, { answer, action, model: process.env.OPENAI_MODEL || "gpt-5-mini" });
};
