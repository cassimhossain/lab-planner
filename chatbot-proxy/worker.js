/* Study Buddy proxy: a Cloudflare Worker on the FREE plan.

   It sits between the club's site and Cloudflare Workers AI:
   - answers only requests from the club's site (CORS, ALLOWED_ORIGIN)
   - caps the question at 600 characters and the code context at 4000
   - limits each browser tab to SESSION_LIMIT questions per 10 minutes, and
     the whole club to DAILY_LIMIT questions per day (counted in a small
     Durable Object, which is free on the Workers Free plan)
   - reads the teacher-written prompt from buddy/system-prompt.txt on the site
   - streams the answer back as it is written
   - BUDDY_OFF = "1" switches it off at once

   There is no API key: the AI binding connects the Worker to Workers AI
   inside Cloudflare. On the Free plan, when the daily AI allowance is used
   up the AI returns an error instead of a bill; the site then falls back to
   its built-in helper. */
import { DurableObject } from "cloudflare:workers";

const MODEL = "@cf/meta/llama-3.1-8b-instruct";
const FALLBACK_PROMPT = "You are Study Buddy, a friendly, safe helper for school students learning electronics, Arduino, Python, C++, robotics and AI. Keep answers short and age-appropriate, give hints before full answers for homework, say \"I'm not sure\" rather than guess, refuse anything unsafe (mains electricity, weapons), and never ask for personal information.";

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGIN || "").split(",").map(s => s.trim()).filter(Boolean);
    const ok = allowed.includes(origin);
    const cors = ok ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "86400" } : {};
    const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors } });

    if (req.method === "OPTIONS") return new Response(null, { status: ok ? 204 : 403, headers: cors });
    if (!ok) return json(403, { error: "origin" });
    if (req.method !== "POST") return json(405, { error: "method" });
    if (env.BUDDY_OFF === "1") return json(503, { error: "off" });

    let body;
    try { const raw = await req.text(); if (raw.length > 20000) return json(413, { error: "too long" }); body = JSON.parse(raw); } catch (e) { return json(400, { error: "bad json" }); }
    const message = String(body.message || "").trim();
    if (!message) return json(400, { error: "empty" });
    if (message.length > 600) return json(413, { error: "too long" });
    const session = String(body.session || "").replace(/[^a-z0-9]/gi, "").slice(0, 16) || "anon";

    /* rate limits: per tab, and one daily total for the club */
    const lim = env.LIMITER.get(env.LIMITER.idFromName("global"));
    const verdict = await lim.hit(session, +env.SESSION_LIMIT || 20, 10 * 60 * 1000, +env.DAILY_LIMIT || 300);
    if (!verdict.ok) return json(429, { error: verdict.why });

    /* the teacher's prompt, cached by Cloudflare for 10 minutes */
    let prompt = FALLBACK_PROMPT;
    if (env.PROMPT_URL) {
      try { const r = await fetch(env.PROMPT_URL, { cf: { cacheTtl: 600, cacheEverything: true } }); if (r.ok) prompt = (await r.text()).slice(0, 8000); } catch (e) { }
    }
    const c = body.context || {}, clip = (s, n) => String(s || "").slice(0, n);
    const notes = [
      body.mode === "deep" ? "Mode: deeper. Add the reason behind it and one more detail." : "Mode: simple. Explain like the student is 10 years old.",
      body.hint ? "The student wants a hint, not the answer. Give a hint or a guiding question only." : "",
      c.page ? `The student is in: ${clip(c.page, 20)}.` : "",
      c.lesson ? `Current club lesson: ${clip(c.lesson, 20)}.` : "",
      c.lang ? `Language: ${clip(c.lang, 20)}.` : "",
      c.parts ? `Parts in their circuit: ${clip(c.parts, 400)}.` : "",
      c.error ? `Their error message:\n${clip(c.error, 1200)}` : "",
      c.code ? `Their code:\n${clip(c.code, 4000)}` : "",
    ].filter(Boolean).join("\n");
    const history = (Array.isArray(body.history) ? body.history : []).slice(-8)
      .filter(m => m && (m.role === "user" || m.role === "assistant")).map(m => ({ role: m.role, content: clip(m.content, 800) }));
    const messages = [{ role: "system", content: prompt + "\n\n" + notes }, ...history, { role: "user", content: message }];

    try {
      const stream = await env.AI.run(MODEL, { messages, stream: true, max_tokens: 450, temperature: 0.4 });
      return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-store", ...cors } });
    } catch (e) {
      /* most often: the free daily AI allowance is used up */
      return json(503, { error: "ai" });
    }
  },
};

/* One small counter for the whole club. Per-tab counts are kept for ten
   minutes; the daily count resets at midnight UTC. */
export class Limiter extends DurableObject {
  async hit(session, perSession, windowMs, daily) {
    const now = Date.now(), day = new Date(now).toISOString().slice(0, 10);
    const d = (await this.ctx.storage.get("day")) || { day, n: 0 };
    if (d.day !== day) { d.day = day; d.n = 0; await this.ctx.storage.delete(await this.ctx.storage.list({ prefix: "s:" }).then(m => [...m.keys()])); }
    if (d.n >= daily) return { ok: false, why: "daily" };
    const key = "s:" + session, list = ((await this.ctx.storage.get(key)) || []).filter(t => now - t < windowMs);
    if (list.length >= perSession) return { ok: false, why: "session" };
    list.push(now); d.n++;
    await this.ctx.storage.put({ [key]: list, day: d });
    return { ok: true };
  }
}
