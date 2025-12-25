const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
  },
  body: JSON.stringify(body)
});

exports.handler = async (event, context) => {
  try {
    if (event.httpMethod !== "POST") {
      return json(405, { ok: false, error: "Method not allowed" });
    }

    const payload = JSON.parse(event.body || "{}");
    const { name, message, website } = payload;

    // Honeypot: bots usually fill this
    if (website) {
      return json(200, { ok: true });
    }

    const cleanName = String(name || "").trim().slice(0, 40);
    const cleanMsg  = String(message || "").trim().slice(0, 240);

    if (!cleanName || !cleanMsg) {
      return json(400, { ok: false, error: "Missing fields" });
    }

    // Optional IP hash (for basic spam control)
    const ip =
      event.headers["x-nf-client-connection-ip"] ||
      event.headers["client-ip"] ||
      "";

    const ip_hash = ip
      ? crypto.createHash("sha256").update(ip).digest("hex")
      : null;

    const { error } = await supabase
      .from("public_wall")
      .insert([
        {
          name: cleanName,
          message: cleanMsg,
          approved: false,
          ip_hash
        }
      ]);

    if (error) throw error;

    return json(200, { ok: true, pending: true });
  } catch (e) {
    return json(500, {
      ok: false,
      error: String(e?.message || e)
    });
  }
};