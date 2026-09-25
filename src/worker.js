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
      /* ============ SCORES ============ */

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

      /* ============ AUTH ============ */

      if (url.pathname === "/signup" && request.method === "POST") {
        const body = await request.json();
        const username = String(body.username || "").trim().toLowerCase();
        const pin = String(body.pin || "");
        const country = String(body.country || "").slice(0, 30);

        if (username.length < 3 || username.length > 20) {
          return json({ ok: false, error: "Username must be 3-20 characters" }, 400);
        }
        if (!/^[a-z0-9_]+$/.test(username)) {
          return json({ ok: false, error: "Username: letters, numbers, _ only" }, 400);
        }
        if (!/^\d{4}$/.test(pin)) {
          return json({ ok: false, error: "PIN must be 4 digits" }, 400);
        }

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
        if (pinHash !== user.pin_hash) return json({ ok: false, error: "Wrong PIN" }, 401);

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

      if (url.pathname === "/user/sync" && request.method === "POST") {
        const body = await request.json();
        const userId = parseInt(body.user_id, 10);
        if (!userId) return json({ ok: false, error: "Missing user_id" }, 400);

        const coins = Math.max(0, parseInt(body.coins || 0, 10));
        const premium = body.premium ? 1 : 0;
        const avatar = String(body.avatar || "ball").slice(0, 30);
        const country = String(body.country || "").slice(0, 30);

        await env.DB.prepare(
          "UPDATE users SET coins = ?, premium = ?, avatar = ?, country = ? WHERE id = ?"
        ).bind(coins, premium, avatar, country, userId).run();

        return json({ ok: true });
      }

      /* ============ PAYSTACK ============ */

      if (url.pathname === "/paystack/init" && request.method === "POST") {
        const body = await request.json();
        const userId = parseInt(body.user_id, 10);
        const username = String(body.username || "").slice(0, 20);
        const email = String(body.email || `${username}@pandakick.app`).slice(0, 80);

        if (!userId) return json({ ok: false, error: "Missing user_id" }, 400);
        if (!env.PAYSTACK_SECRET_KEY) return json({ ok: false, error: "Paystack not configured" }, 500);

        const amountKobo = 250000;

        const psRes = await fetch("https://api.paystack.co/transaction/initialize", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            amount: amountKobo,
            currency: "NGN",
            metadata: { user_id: userId, username },
            callback_url: "https://panda-kick.pages.dev/?paystack=done"
          })
        });

        const psData = await psRes.json();
        if (!psData.status) {
          return json({ ok: false, error: psData.message || "Could not init payment" }, 400);
        }

        return json({
          ok: true,
          authorization_url: psData.data.authorization_url,
          reference: psData.data.reference
        });
      }

      if (url.pathname === "/paystack/verify" && request.method === "GET") {
        const reference = url.searchParams.get("reference");
        if (!reference) return json({ ok: false, error: "Missing reference" }, 400);
        if (!env.PAYSTACK_SECRET_KEY) return json({ ok: false, error: "Paystack not configured" }, 500);

        const psRes = await fetch(
          "https://api.paystack.co/transaction/verify/" + encodeURIComponent(reference),
          { headers: { Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}` } }
        );

        const psData = await psRes.json();
        if (!psData.status || psData.data.status !== "success") {
          return json({ ok: false, error: "Payment not successful" }, 400);
        }

        const meta = psData.data.metadata || {};
        const userId = parseInt(meta.user_id, 10);
        if (!userId) return json({ ok: false, error: "Missing user_id in metadata" }, 400);

        await env.DB.prepare(
          "UPDATE users SET premium = 1, coins = coins + 500 WHERE id = ?"
        ).bind(userId).run();

        return json({ ok: true, premium: true });
      }

/* ⬇️ NEXT CHUNK BELOW ⬇️ */
          /* ============ FRIENDS ============ */

      if (url.pathname === "/friend/request" && request.method === "POST") {
        const body = await request.json();
        const userId = parseInt(body.user_id, 10);
        const targetUsername = String(body.target || "").trim().toLowerCase();

        if (!userId || !targetUsername) return json({ ok: false, error: "Missing data" }, 400);

        const target = await env.DB.prepare(
          "SELECT id, username FROM users WHERE username = ?"
        ).bind(targetUsername).first();

        if (!target) return json({ ok: false, error: "User not found" }, 404);
        if (target.id === userId) return json({ ok: false, error: "Can't add yourself" }, 400);

        const existing = await env.DB.prepare(
          "SELECT id FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)"
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

        if (!userId || !requestId) return json({ ok: false, error: "Missing data" }, 400);

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

      /* ============ CHALLENGES ============ */

      if (url.pathname === "/challenge/create" && request.method === "POST") {
        const body = await request.json();
        const userId = parseInt(body.user_id, 10);
        const username = String(body.username || "").slice(0, 20);
        const questionIds = Array.isArray(body.question_ids) ? body.question_ids : [];

        if (!userId || !username || questionIds.length !== 20) {
          return json({ ok: false, error: "Need 20 question ids + username" }, 400);
        }

        let code = "";
        for (let attempt = 0; attempt < 5; attempt++) {
          const candidate = "PK" + Math.random().toString(36).slice(2, 7).toUpperCase();
          const exists = await env.DB.prepare(
            "SELECT id FROM challenges WHERE code = ?"
          ).bind(candidate).first();
          if (!exists) { code = candidate; break; }
        }
        if (!code) return json({ ok: false, error: "Could not generate code" }, 500);

        const result = await env.DB.prepare(
          "INSERT INTO challenges (code, creator_id, creator_name, question_ids, status, created_at) VALUES (?, ?, ?, ?, 'open', ?)"
        ).bind(code, userId, username, JSON.stringify(questionIds), Date.now()).run();

        return json({ ok: true, code, challenge_id: result.meta.last_row_id });
      }

      if (url.pathname === "/challenge/join" && request.method === "POST") {
        const body = await request.json();
        const code = String(body.code || "").trim().toUpperCase();
        if (!code) return json({ ok: false, error: "Enter a code" }, 400);

        const ch = await env.DB.prepare(
          "SELECT id, code, creator_name, question_ids, status, created_at FROM challenges WHERE code = ?"
        ).bind(code).first();

        if (!ch) return json({ ok: false, error: "Challenge not found" }, 404);

        return json({
          ok: true,
          challenge: {
            id: ch.id,
            code: ch.code,
            creator_name: ch.creator_name,
            question_ids: JSON.parse(ch.question_ids),
            status: ch.status
          }
        });
      }

      if (url.pathname === "/challenge/submit" && request.method === "POST") {
        const body = await request.json();
        const challengeId = parseInt(body.challenge_id, 10);
        const userId = parseInt(body.user_id, 10) || null;
        const username = String(body.username || "Player").slice(0, 20);
        const score = Math.max(0, Math.min(20, parseInt(body.score || 0, 10)));
        const total = Math.max(1, Math.min(20, parseInt(body.total || 20, 10)));

        if (!challengeId) return json({ ok: false, error: "Missing challenge_id" }, 400);

        const ch = await env.DB.prepare(
          "SELECT creator_id FROM challenges WHERE id = ?"
        ).bind(challengeId).first();

        if (!ch) return json({ ok: false, error: "Challenge not found" }, 404);

        const isCreator = ch.creator_id === userId ? 1 : 0;

        await env.DB.prepare(
          "INSERT INTO challenge_scores (challenge_id, user_id, username, score, total, is_creator, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
        ).bind(challengeId, userId, username, score, total, isCreator, Date.now()).run();

        return json({ ok: true });
      }

      if (url.pathname === "/challenge/results" && request.method === "GET") {
        const challengeId = parseInt(url.searchParams.get("challenge_id"), 10);
        if (!challengeId) return json({ ok: false, error: "Missing challenge_id" }, 400);

        const ch = await env.DB.prepare(
          "SELECT id, code, creator_name FROM challenges WHERE id = ?"
        ).bind(challengeId).first();
        if (!ch) return json({ ok: false, error: "Not found" }, 404);

        const { results } = await env.DB.prepare(
          `SELECT username, score, total, is_creator, created_at
           FROM challenge_scores
           WHERE challenge_id = ?
           ORDER BY (CAST(score AS REAL)/total) DESC, created_at ASC`
        ).bind(challengeId).all();

        return json({ ok: true, challenge: ch, scores: results || [] });
      }

      if (url.pathname === "/challenge/mine" && request.method === "GET") {
        const username = String(url.searchParams.get("username") || "").trim().toLowerCase();
        if (!username) return json({ ok: false, error: "Missing username" }, 400);

        const { results } = await env.DB.prepare(
          `SELECT DISTINCT c.id, c.code, c.creator_name, c.created_at, c.status
           FROM challenges c
           LEFT JOIN challenge_scores s ON s.challenge_id = c.id
           WHERE LOWER(c.creator_name) = ? OR LOWER(s.username) = ?
           ORDER BY c.created_at DESC
           LIMIT 50`
        ).bind(username, username).all();

        return json({ ok: true, challenges: results || [] });
      }

      /* ============ NOTIFICATIONS ============ */

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
