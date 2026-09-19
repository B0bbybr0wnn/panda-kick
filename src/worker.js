export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: { ...cors, "Content-Type": "application/json" }
      });

    try {
      if (url.pathname === "/score" && request.method === "POST") {
        const body = await request.json();
        const name = String(body.name || "Player").slice(0, 20);
        const country = String(body.country || "").slice(0, 30);
        const score = Math.max(0, Math.min(20, parseInt(body.score || 0, 10)));
        const total = Math.max(1, Math.min(20, parseInt(body.total || 20, 10)));

        await env.DB.prepare(
          "INSERT INTO scores (name, country, score, total, created_at) VALUES (?, ?, ?, ?, ?)"
        ).bind(name, country, score, total, Date.now()).run();

        return json({ ok: true });
      }

      if (url.pathname === "/leaderboard" && request.method === "GET") {
        const range = url.searchParams.get("range") || "all";
        let query = "SELECT name, country, score, total, created_at FROM scores";
        const bindings = [];
        if (range === "week") {
          query += " WHERE created_at > ?";
          bindings.push(Date.now() - 7 * 24 * 60 * 60 * 1000);
        }
        query += " ORDER BY (CAST(score AS REAL)/total) DESC, score DESC, created_at DESC LIMIT 100";

        const stmt = bindings.length
          ? env.DB.prepare(query).bind(...bindings)
          : env.DB.prepare(query);

        const { results } = await stmt.all();
        return json({ ok: true, scores: results || [] });
      }

      if (url.pathname === "/signup" && request.method === "POST") {
        const body = await request.json();
        const username = String(body.username || "").trim().toLowerCase();
        const pin = String(body.pin || "");
        const country = String(body.country || "").slice(0, 30);

        if (username.length < 3 || username.length > 20)
          return json({ ok: false, error: "Username must be 3-20 characters" }, 400);
        if (!/^[a-z0-9_]+$/.test(username))
          return json({ ok: false, error: "Username: letters, numbers, _ only" }, 400);
        if (!/^\d{4}$/.test(pin))
          return json({ ok: false, error: "PIN must be 4 digits" }, 400);

        const existing = await env.DB.prepare(
          "SELECT id FROM users WHERE username = ?"
        ).bind(username).first();

        if (existing) return json({ ok: false, error: "Username taken" }, 409);

        const pinHash = await hashPin(pin);
        await env.DB.prepare(
          "INSERT INTO users (username, pin_hash, country, created_at) VALUES (?, ?, ?, ?)"
        ).bind(username, pinHash, country, Date.now()).run();

        const user = await env.DB.prepare(
          "SELECT id, username, country, avatar, coins, premium FROM users WHERE username = ?"
        ).bind(username).first();

        return json({ ok: true, user });
      }

      if (url.pathname === "/login" && request.method === "POST") {
        const body = await request.json();
        const username = String(body.username || "").trim().toLowerCase();
        const pin = String(body.pin || "");

        const user = await env.DB.prepare(
          "SELECT * FROM users WHERE username = ?"
        ).bind(username).first();

        if (!user) return json({ ok: false, error: "User not found" }, 404);

        const pinHash = await hashPin(pin);
        if (pinHash !== user.pin_hash)
          return json({ ok: false, error: "Wrong PIN" }, 401);

        return json({
          ok: true,
          user: {
            id: user.id,
            username: user.username,
            country: user.country,
            avatar: user.avatar,
            coins: user.coins,
            premium: user.premium
          }
        });
      }

      if (url.pathname === "/friend/request" && request.method === "POST") {
        const body = await request.json();
        const userId = parseInt(body.user_id, 10);
        const targetUsername = String(body.target || "").trim().toLowerCase();

        if (!userId || !targetUsername)
          return json({ ok: false, error: "Missing data" }, 400);

        const target = await env.DB.prepare(
          "SELECT id, username FROM users WHERE username = ?"
        ).bind(targetUsername).first();

        if (!target) return json({ ok: false, error: "User not found" }, 404);
        if (target.id === userId) return json({ ok: false, error: "Can't add yourself" }, 400);

        const existing = await env.DB.prepare(
          "SELECT id, status FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)"
        ).bind(userId, target.id, target.id, userId).first();

        if (existing) return json({ ok: false, error: "Request already exists" }, 409);

        await env.DB.prepare(
          "INSERT INTO friends (user_id, friend_id, status, created_at) VALUES (?, ?, 'pending', ?)"
        ).bind(userId, target.id, Date.now()).run();

        return json({ ok: true });
      }

      if (url.pathname === "/friend/requests" && request.method === "GET") {
        const userId = parseInt(url.searchParams.get("user_id"), 10);
        if (!userId) return json({ ok: false, error: "Missing user_id" }, 400);

        const { results } = await env.DB.prepare(
          `SELECT f.id, f.user_id, u.username AS from_username, f.created_at
           FROM friends f
           JOIN users u ON u.id = f.user_id
           WHERE f.friend_id = ? AND f.status = 'pending'
           ORDER BY f.created_at DESC`
        ).bind(userId).all();

        return json({ ok: true, requests: results || [] });
      }

      if (url.pathname === "/friend/accept" && request.method === "POST") {
        const body = await request.json();
        const userId = parseInt(body.user_id, 10);
        const requestId = parseInt(body.request_id, 10);

        if (!userId || !requestId)
          return json({ ok: false, error: "Missing data" }, 400);

        const req = await env.DB.prepare(
          "SELECT id FROM friends WHERE id = ? AND friend_id = ? AND status = 'pending'"
        ).bind(requestId, userId).first();

        if (!req) return json({ ok: false, error: "Request not found" }, 404);

        await env.DB.prepare(
          "UPDATE friends SET status = 'accepted' WHERE id = ?"
        ).bind(requestId).run();

        return json({ ok: true });
      }

      if (url.pathname === "/friend/list" && request.method === "GET") {
        const userId = parseInt(url.searchParams.get("user_id"), 10);
        if (!userId) return json({ ok: false, error: "Missing user_id" }, 400);

        const { results } = await env.DB.prepare(
          `SELECT
            CASE WHEN f.user_id = ? THEN f.friend_id ELSE f.user_id END AS friend_id,
            u.username, u.country, u.avatar, u.coins, u.premium
           FROM friends f
           JOIN users u ON u.id = CASE WHEN f.user_id = ? THEN f.friend_id ELSE f.user_id END
           WHERE (f.user_id = ? OR f.friend_id = ?) AND f.status = 'accepted'`
        ).bind(userId, userId, userId, userId).all();

        return json({ ok: true, friends: results || [] });
      }

      if (url.pathname === "/notifications" && request.method === "GET") {
        const { results } = await env.DB.prepare(
          "SELECT date, username, score, total FROM daily_winners ORDER BY date DESC LIMIT 14"
        ).all();
        return json({ ok: true, notifications: results || [] });
      }

      return json({ ok: false, error: "Not found" }, 404);

    } catch (e) {
      return json({ ok: false, error: e.message }, 500);
    }
  },

  async scheduled(event, env, ctx) {
    const today = new Date().toISOString().slice(0, 10);

    const top = await env.DB.prepare(
      `SELECT name AS username, score, total
       FROM scores
       WHERE created_at > ?
       ORDER BY (CAST(score AS REAL)/total) DESC, score DESC
       LIMIT 1`
    ).bind(Date.now() - 24 * 60 * 60 * 1000).first();

    if (!top) return;

    await env.DB.prepare(
      `INSERT OR REPLACE INTO daily_winners (date, username, score, total)
       VALUES (?, ?, ?, ?)`
    ).bind(today, top.username, top.score, top.total).run();
  }
};

async function hashPin(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode("panda-kick-salt::" + pin);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, "0")).join("");
                               }
