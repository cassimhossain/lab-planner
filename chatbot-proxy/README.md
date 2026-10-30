# Study Buddy's AI (free)

Without this, Study Buddy answers from the club's slides, glossary and wiring guides, in the browser. That works offline but can't reason like a real AI.
This small Cloudflare Worker connects Study Buddy to a **real AI model for free**, so it can explain anything in robotics, electronics, coding and AI. It also sends the AI the most relevant slides from our own presentations with each question, so answers match how the club teaches.

If the AI is off, busy, out of its free allowance or unreachable, Study Buddy quietly falls back to its built-in answers.

## Pick the AI (one setting: `PROVIDER`)

| | Cloudflare Workers AI (`workers-ai`) | Google Gemini (`gemini`) |
|---|---|---|
| Model | Llama 3.1 8B | Gemini 2.5 Flash (or whichever free model you set in `GEMINI_MODEL`) |
| Key | **None.** Connected inside Cloudflare. | A free key from Google AI Studio, stored as a Worker **secret**. |
| Quality | Good for short explanations. | Usually stronger, especially for code and explanations. |
| Free limit | A daily allowance (it has been 10,000 "neurons", roughly a few hundred answers). | Per-minute and per-day request limits on the free tier. |
| Can it bill you? | No: the Workers Free plan has no paid overage. | Not if the Google project has **no billing account**. Never add billing to that project. |
| For students? | Check Cloudflare's terms and the Llama licence. | **Read Google's Gemini API terms first:** they have required users to be 18+ and restricted apps likely to be used by under-18s, and free-tier prompts may be used to improve Google's products. |

Limits and terms change, so check the current ones before you switch it on.

## Set it up in the Cloudflare dashboard (about 10 minutes, no command line)

1. Make a free account at **dash.cloudflare.com** (no card needed).
2. **Workers & Pages → Create → Create Worker.** Name it `study-buddy` and press **Deploy** (it deploys a placeholder).
3. Press **Edit code**. Delete what's there, paste the whole of `chatbot-proxy/worker.js` from this repo, and press **Deploy**.
4. Go to the Worker's **Settings → Variables and Secrets** and add these as **Text**:
   - `ALLOWED_ORIGIN` = `https://cassimhossain.github.io`
   - `PROMPT_URL` = `https://cassimhossain.github.io/lab-planner/buddy/system-prompt.txt`
   - `PROVIDER` = `workers-ai` or `gemini`
   - `SESSION_LIMIT` = `20` and `DAILY_LIMIT` = `300`
5. Then, for the AI you picked:
   - **Workers AI:** **Settings → Bindings → Add → Workers AI**, variable name `AI`.
   - **Gemini:** get a key at **aistudio.google.com → Get API key** (in a project with no billing). In **Settings → Variables and Secrets**, add it with type **Secret**, name `GEMINI_API_KEY`. Never put the key in any file in this repo.
6. Copy the Worker's address (like `https://study-buddy.<your-name>.workers.dev`) and open it in a browser. You should see `{"ok":true,...}`.
7. In this repo, edit `buddy/config.js`:
   ```js
   backend: "worker",
   workerUrl: "https://study-buddy.<your-name>.workers.dev",
   ```
   Commit and push. Study Buddy's header now says "AI helper".

Pasted into the dashboard, the Worker counts its rate limits in memory, which is a good brake but not exact. For exact limits, deploy with wrangler instead (`npx wrangler deploy` in this folder, which needs Node.js); `wrangler.toml` sets up a small free Durable Object for the counting.

## What it enforces

- Only `ALLOWED_ORIGIN` may call it.
- Questions up to 600 characters. A student's code (up to 4000 characters) is only sent when they press "Explain this error" or "Help with my code".
- `SESSION_LIMIT` questions per browser tab per 10 minutes and `DAILY_LIMIT` per day.
- The teacher prompt comes from `buddy/system-prompt.txt` on the site (cached 10 minutes), so editing that file changes how Study Buddy behaves.

## Turning it off

- **AI only:** add `BUDDY_OFF` = `1` in the Worker's variables (immediate), or set `backend: "local"` in `buddy/config.js`.
- **Completely:** set `enabled: false` in `buddy/config.js` and push. The button disappears from every page.
