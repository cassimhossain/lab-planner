# Study Buddy proxy (optional)

Study Buddy works without this: by default it answers from the club's own lessons, parts list and glossary, in the browser.
This Worker adds AI answers, using **Cloudflare Workers AI on the free plan**. If it is off, busy, out of its daily allowance or unreachable, the site falls back to the built-in helper automatically.

## Why Cloudflare Workers AI

- **No API key.** The Worker reaches Workers AI through a built-in connection (the `AI` binding), so there is no secret to paste in, store or leak.
- **It can't cause a bill on the free plan.** When the daily free allowance runs out, the AI returns an error and Study Buddy switches to its built-in answers. A free Cloudflare account needs no credit card.
- Gemini's free tier was the alternative, but free-tier prompts may be used to improve Google's products and its terms restrict users under 18, which doesn't suit a school club.

**Before you deploy, check Cloudflare's current free limits and terms:** the Workers AI daily allowance (it has been 10,000 "neurons" a day, roughly a few hundred short answers), the Workers Free plan request limit, that Durable Objects are still included on the Free plan, and the licence of the model (`@cf/meta/llama-3.1-8b-instruct`, Meta's Llama licence).

## Deploy (about 10 minutes)

You need a free Cloudflare account and Node.js on your own computer (students' browsers don't need anything).

```bash
cd chatbot-proxy
npx wrangler login
npx wrangler deploy
```

Wrangler prints the Worker's address, like `https://study-buddy.<your-name>.workers.dev`. Then in `buddy/config.js`:

```js
backend: "worker",
workerUrl: "https://study-buddy.<your-name>.workers.dev",
```

Commit and push. Study Buddy now says "AI helper" in its header.

## Settings (in `wrangler.toml`, or in the dashboard under the Worker's Settings → Variables)

| Setting | What it does |
|---|---|
| `ALLOWED_ORIGIN` | The only site allowed to use the Worker. |
| `PROMPT_URL` | Where the teacher prompt is read from (`buddy/system-prompt.txt` on the site, cached 10 minutes). |
| `SESSION_LIMIT` | Questions per browser tab per 10 minutes (default 20). |
| `DAILY_LIMIT` | Questions for the whole club per day (default 300). Keep it below what the free AI allowance covers. |
| `BUDDY_OFF` | Set to `1` to switch the AI off at once. |

Each question is capped at 600 characters. A student's code is only sent when they press "Explain this error" or "Help with my code", and is capped at 4000 characters.

## Turning Study Buddy off

- **AI only:** set `BUDDY_OFF` to `1` in the Worker's variables (takes effect immediately), or set `backend: "local"` in `buddy/config.js`.
- **Completely:** set `enabled: false` in `buddy/config.js` and push. The button disappears from every page.
