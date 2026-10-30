/* Study Buddy proxy: a Cloudflare Worker on the FREE plan.

   It sits between the club's site and a free AI model, and holds any key, so
   no key is ever in the website. Pick the model with PROVIDER:
     "workers-ai"  Cloudflare Workers AI (Llama 3.1 8B). No key at all: add a
                   Workers AI binding called AI.
     "gemini"      Google Gemini through AI Studio's free tier. Add your key as
                   a SECRET called GEMINI_API_KEY (never in this file).

   What it enforces:
   - only the club's site may call it (ALLOWED_ORIGIN)
   - questions up to 600 characters; code context up to 4000
   - SESSION_LIMIT questions per browser tab per 10 minutes, DAILY_LIMIT per
     day. Counted in a Durable Object when one is bound as LIMITER (deployed
     with wrangler), otherwise in memory: a good-enough brake, not exact
   - BUDDY_OFF = "1" switches it off at once
   - the teacher prompt is read from buddy/system-prompt.txt on the site
   - answers stream back as they're written, in one simple format whichever
     provider made them

   It can't cause a bill: Workers Free has no paid overage, and a Gemini key
   from a Google project WITHOUT billing turned on only ever gets the free
   tier (it errors with 429 when that runs out). When anything fails, the
   site quietly answers from its built-in helper instead. */
import { DurableObject } from "cloudflare:workers";

const FALLBACK_PROMPT = "You are Study Buddy, a friendly, safe helper for school students learning electronics, Arduino, ESP32, Python, C++, robotics and AI. Explain clearly and correctly, give hints before full answers for homework, say \"I'm not sure\" rather than guess, refuse anything unsafe (mains electricity, weapons), and never ask for personal information.";
const memo = { sessions: new Map(), day: "", n: 0 };   // used when no Durable Object is bound

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGIN || "").split(",").map(s => s.trim()).filter(Boolean);
    const ok = allowed.includes(origin);
    const cors = ok ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "86400" } : {};
    const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors } });

    if (req.method === "OPTIONS") return new Response(null, { status: ok ? 204 : 403, headers: cors });
    if (req.method === "GET") return json(200, { ok: true, provider: provider(env), off: env.BUDDY_OFF === "1" });   // a quick "is it up?" check
    if (!ok) return json(403, { error: "origin" });
    if (req.method !== "POST") return json(405, { error: "method" });
    if (env.BUDDY_OFF === "1") return json(503, { error: "off" });

    let body;
    try { const raw = await req.text(); if (raw.length > 30000) return json(413, { error: "too long" }); body = JSON.parse(raw); } catch (e) { return json(400, { error: "bad json" }); }
    const message = String(body.message || "").trim();
    if (!message) return json(400, { error: "empty" });
    if (message.length > 600) return json(413, { error: "too long" });
    const session = String(body.session || "").replace(/[^a-z0-9]/gi, "").slice(0, 16) || "anon";

    const verdict = await hit(env, session, +env.SESSION_LIMIT || 20, 10 * 60 * 1000, +env.DAILY_LIMIT || 300);
    if (!verdict.ok) return json(429, { error: verdict.why });

    let prompt = FALLBACK_PROMPT;
    if (env.PROMPT_URL) {
      try { const r = await fetch(env.PROMPT_URL, { cf: { cacheTtl: 600, cacheEverything: true } }); if (r.ok) prompt = (await r.text()).slice(0, 8000); } catch (e) { }
    }
    const c = body.context || {}, clip = (s, n) => String(s || "").slice(0, n);
    const slides = (Array.isArray(c.slides) ? c.slides : []).slice(0, 5).map(s => `- ${clip(s.c, 12)} slide ${clip(s.n, 4)}: ${clip(s.t, 600)}`).join("\n");
    const notes = [
      body.mode === "deep" ? "Mode: deeper. Add the reason behind it and one more detail." : "Mode: simple. Explain like the student is 10 years old.",
      body.hint ? "The student wants a hint, not the answer. Give a hint or a guiding question only." : "",
      c.page ? `The student is in: ${clip(c.page, 20)}.` : "",
      c.lesson ? `Current club lesson: ${clip(c.lesson, 20)}.` : "",
      c.lang ? `Language: ${clip(c.lang, 20)}.` : "",
      c.parts ? `Parts in their circuit: ${clip(c.parts, 400)}.` : "",
      slides ? `Slides from the club's own presentations that may be relevant (use them when they fit, and mention the lesson and slide; otherwise answer from your own knowledge):\n${slides}` : "",
      c.error ? `Their error message:\n${clip(c.error, 1200)}` : "",
      c.code ? `Their code:\n${clip(c.code, 4000)}` : "",
    ].filter(Boolean).join("\n\n");
    const history = (Array.isArray(body.history) ? body.history : []).slice(-8)
      .filter(m => m && (m.role === "user" || m.role === "assistant")).map(m => ({ role: m.role, content: clip(m.content, 800) }));
    const system = prompt + "\n\n" + notes;

    try {
      const stream = provider(env) === "gemini" ? await gemini(env, system, history, message) : await workersAI(env, system, history, message);
      return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-store", ...cors } });
    } catch (e) {
      /* most often: the free daily allowance is used up, or the key is missing */
      return json(e.status === 429 ? 429 : 503, { error: "ai", detail: String(e.message || "").slice(0, 120) });
    }
  },
};

const provider = env => (env.PROVIDER || "workers-ai").toLowerCase();

async function workersAI(env, system, history, message) {
  if (!env.AI) throw new Error("No Workers AI binding called AI");
  const model = env.WORKERS_AI_MODEL || "@cf/meta/llama-3.1-8b-instruct";
  /* Workers AI already streams "data: {"response": "..."}" lines, the format the site reads */
  return env.AI.run(model, { messages: [{ role: "system", content: system }, ...history, { role: "user", content: message }], stream: true, max_tokens: 600, temperature: 0.4 });
}

async function gemini(env, system, history, message) {
  if (!env.GEMINI_API_KEY) throw new Error("No GEMINI_API_KEY secret");
  const model = env.GEMINI_MODEL || "gemini-2.5-flash";
  const contents = history.map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })).concat([{ role: "user", parts: [{ text: message }] }]);
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`, {
    method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents, generationConfig: { maxOutputTokens: 800, temperature: 0.4 } }),
  });
  if (!r.ok || !r.body) throw Object.assign(new Error("Gemini " + r.status), { status: r.status });
  /* turn Gemini's stream into the same "data: {"response": ...}" lines Workers AI sends */
  const enc = new TextEncoder(), dec = new TextDecoder(); let buf = "";
  return r.body.pipeThrough(new TransformStream({
    transform(chunk, ctl) {
      buf += dec.decode(chunk, { stream: true });
      let i; while ((i = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
        if (!line.startsWith("data:")) continue;
        try {
          const j = JSON.parse(line.slice(5));
          const text = ((((j.candidates || [])[0] || {}).content || {}).parts || []).map(p => p.text || "").join("");
          if (text) ctl.enqueue(enc.encode("data: " + JSON.stringify({ response: text }) + "\n\n"));
        } catch (e) { }
      }
    },
    flush(ctl) { ctl.enqueue(enc.encode("data: [DONE]\n\n")); },
  }));
}

/* rate limits: exact with a Durable Object, best effort without one */
async function hit(env, session, perSession, windowMs, daily) {
  if (env.LIMITER) return env.LIMITER.get(env.LIMITER.idFromName("global")).hit(session, perSession, windowMs, daily);
  const now = Date.now(), day = new Date(now).toISOString().slice(0, 10);
  if (memo.day !== day) { memo.day = day; memo.n = 0; memo.sessions.clear(); }
  if (memo.n >= daily) return { ok: false, why: "daily" };
  const list = (memo.sessions.get(session) || []).filter(t => now - t < windowMs);
  if (list.length >= perSession) return { ok: false, why: "session" };
  list.push(now); memo.sessions.set(session, list); memo.n++;
  return { ok: true };
}

/* One small counter for the whole club (only used when bound as LIMITER).
   Per-tab counts are kept for ten minutes; the daily count resets at midnight UTC. */
export class Limiter extends DurableObject {
  async hit(session, perSession, windowMs, daily) {
    const now = Date.now(), day = new Date(now).toISOString().slice(0, 10);
    const d = (await this.ctx.storage.get("day")) || { day, n: 0 };
    if (d.day !== day) { d.day = day; d.n = 0; const old = [...(await this.ctx.storage.list({ prefix: "s:" })).keys()]; if (old.length) await this.ctx.storage.delete(old); }
    if (d.n >= daily) return { ok: false, why: "daily" };
    const key = "s:" + session, list = ((await this.ctx.storage.get(key)) || []).filter(t => now - t < windowMs);
    if (list.length >= perSession) return { ok: false, why: "session" };
    list.push(now); d.n++;
    await this.ctx.storage.put({ [key]: list, day: d });
    return { ok: true };
  }
}
