const {
  json,
  methodAllowed,
  readJson,
  requireMercadoPagoConfig,
  mercadoPagoFetch,
  mercadoPagoErrorMessage,
} = require("./_helpers");
const { randomUUID } = require("crypto");

function safeReference(value) {
  return String(value || `print-${Date.now()}`)
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .slice(0, 64);
}

module.exports = async function handler(req, res) {
  if (!methodAllowed(req, res, ["POST"])) return;
  const env = requireMercadoPagoConfig(res);
  if (!env) return;

  const body = await readJson(req);
  const terminalId = String(body.terminalId || env.terminalId).trim();
  const content = String(body.content || "").trim();

  if (!terminalId) {
    json(res, 400, { error: "missing_terminal_id" });
    return;
  }
  if (content.length < 100 || content.length > 4096) {
    json(res, 400, {
      error: "invalid_print_content",
      message: "A ficha personalizada precisa ter entre 100 e 4096 caracteres.",
    });
    return;
  }

  const result = await mercadoPagoFetch("/terminals/v1/actions", {
    method: "POST",
    headers: { "X-Idempotency-Key": body.idempotencyKey || randomUUID() },
    body: JSON.stringify({
      type: "print",
      external_reference: safeReference(body.externalReference),
      config: {
        point: {
          terminal_id: terminalId,
          subtype: "custom",
        },
      },
      content,
    }),
  });

  if (!result.ok) {
    json(res, result.status, {
      error: "mercado_pago_print_error",
      message: mercadoPagoErrorMessage(result.data),
      details: result.data,
    });
    return;
  }

  json(res, 200, result.data);
};
