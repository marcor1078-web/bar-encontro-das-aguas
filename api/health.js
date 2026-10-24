const emailHandler = require("../lib/email-service");

module.exports = async function handler(req, res) {
  const action = req.query?.action || new URL(req.url || "/api/health", "http://localhost").searchParams.get("action");
  if (action === "email") return emailHandler(req, res);

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify({ ok: true, at: new Date().toISOString() }));
};
