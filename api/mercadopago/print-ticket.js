const {
  json,
  methodAllowed,
  readJson,
  requireMercadoPagoConfig,
  mercadoPagoFetch,
  mercadoPagoErrorMessage,
  requireOnlineStaff,
} = require("./_helpers");
const { randomUUID } = require("crypto");

function safeReference(value) {
  return String(value || `print-${Date.now()}`)
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .slice(0, 64);
}

function validatePrintContent(print) {
  const subtype = print.subtype === "image" ? "image" : "custom";
  const content = String(print.content || "").trim();
  if (subtype === "custom") {
    if (content.length < 100 || content.length > 4096) {
      return { error: "invalid_print_content", message: "A impressao personalizada precisa ter entre 100 e 4096 caracteres." };
    }
    return { subtype, content };
  }

  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(content) || content.length > 1_400_000) {
    return { error: "invalid_image_content", message: "A imagem precisa estar codificada em Base64 e ter no maximo 1 MB." };
  }
  const bytes = Buffer.from(content, "base64");
  const isPng = bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const isJpeg = bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (bytes.length > 1_048_576 || (!isPng && !isJpeg)) {
    return { error: "invalid_image_content", message: "A imagem deve ser PNG ou JPEG e ter no maximo 1 MB." };
  }
  return { subtype, content };
}

async function createPrintAction({ terminalId, accountKey, print }) {
  const result = await mercadoPagoFetch("/terminals/v1/actions", {
    method: "POST",
    headers: { "X-Idempotency-Key": print.idempotencyKey || randomUUID() },
    body: JSON.stringify({
      type: "print",
      external_reference: safeReference(print.externalReference),
      config: { point: { terminal_id: terminalId, subtype: print.subtype } },
      content: print.content,
    }),
  }, accountKey);
  return result;
}

module.exports = async function handler(req, res) {
  if (!methodAllowed(req, res, ["POST"])) return;
  if (!await requireOnlineStaff(req, res)) return;
  const body = await readJson(req);
  const accountKey = body.accountKey === "secondary" ? "secondary" : "primary";
  const env = requireMercadoPagoConfig(res, accountKey);
  if (!env) return;
  const terminalId = String(body.terminalId || env.terminalId).trim();

  if (!terminalId) {
    json(res, 400, { error: "missing_terminal_id" });
    return;
  }
  const isBatch = Array.isArray(body.tickets);
  const prints = isBatch ? body.tickets : [body];
  if (!prints.length || prints.length > 30) {
    json(res, 400, { error: "invalid_print_batch", message: "Envie entre 1 e 30 impressoes por lote." });
    return;
  }

  const validated = prints.map((rawPrint, index) => {
    const print = rawPrint && typeof rawPrint === "object" ? rawPrint : {};
    const content = validatePrintContent(print || {});
    return { print: { ...content, ticketNumber: print.ticketNumber || index + 1, idempotencyKey: print.idempotencyKey, externalReference: print.externalReference }, error: content.error, message: content.message };
  });
  const invalid = validated.find((entry) => entry.error);
  if (invalid) {
    json(res, 400, { error: invalid.error, message: invalid.message, ticketNumber: invalid.print.ticketNumber });
    return;
  }

  const results = await Promise.all(validated.map(async ({ print }) => {
    const result = await createPrintAction({ terminalId, accountKey, print });
    if (!result.ok) {
      return {
        ticketNumber: print.ticketNumber,
        ok: false,
        statusCode: result.status,
        error: "mercado_pago_print_error",
        message: mercadoPagoErrorMessage(result.data),
        details: result.data,
      };
    }
    return { ...result.data, ticketNumber: print.ticketNumber, ok: true };
  }));

  if (isBatch) {
    json(res, 200, {
      results,
      message: "As acoes de impressao foram enviadas ao Mercado Pago em lote.",
    });
    return;
  }

  const result = results[0];
  if (!result.ok) {
    json(res, result.statusCode || 502, { error: result.error, message: result.message, details: result.details });
    return;
  }
  json(res, 200, { ...result, message: "Acao de impressao criada; confirme a chegada a Point pelo status on_terminal." });
};
