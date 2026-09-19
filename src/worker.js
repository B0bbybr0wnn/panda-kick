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

    if (url.pathname === "/score" && request.method === "POST") {
      try {
        const body = await request.json();
        const name = String(body.name || "Player").slice(0, 20);
        const country = String(body.country || "").slice(0, 30);
        const score = Math.max(0, Math.min(20, parseInt(body.score || 0, 10)));
        const total = Math.max(1, Math.min(20, parseInt(body.total || 20, 10)));

        await env.DB.prepare(
          "INSERT INTO scores (name, country, score, total, created_at) VALUES (?, ?, ?, ?, ?)"
        ).bind(name, country, score, total, Date.now()).run();

        return new Response(JSON.stringify({ ok: true }), {
          headers: { ...cors, "Content-Type": "application/json" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), {
          status: 400,
          headers: { ...cors, "Content-Type": "application/json" }
        });
      }
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

      return new Response(JSON.stringify({ ok: true, scores: results || [] }), {
        headers: { ...cors, "Content-Type": "application/json" }
      });
    }

    return new Response("Not found", { status: 404, headers: cors });
  }
};
