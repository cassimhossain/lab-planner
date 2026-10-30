/* Study Buddy settings. This is the only file to change to switch Study
   Buddy's answers between the built-in helper and the AI, or to turn it off.

   enabled  false hides Study Buddy on every page (the kill switch).
   backend  "local"  answers from the club's own lessons, parts and glossary,
                     in the browser, with no internet. The default.
            "worker" asks the free Cloudflare Worker in /chatbot-proxy first
                     and falls back to "local" if it is off, busy, out of its
                     daily allowance, or the student is offline.
   workerUrl  the address the Worker was deployed to (see chatbot-proxy/README.md).
   version    matches the portal's ?v= so the lesson data is fetched fresh. */
window.BUDDY_CONFIG = {
  enabled: true,
  backend: "local",
  workerUrl: "",
  version: "38",
};
