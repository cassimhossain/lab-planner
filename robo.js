/* The BotBench robot, the one on the start-up screen, as the sign that
   something is loading. One copy for the portal, Study Buddy and both labs.

   Robo.html("s" | "m" | "l", "Loading…")  returns the markup
     s  a small head that fits inside a button or a status chip
     m  a hopping robot for a panel
     l  the start-up screen's robot, with its rings and orbiting dots
   The label is optional. The styles are added to the page the first time. */
(function () {
  const SVG = `<svg class="rl-svg" viewBox="0 0 64 64" aria-hidden="true"> <path class="r-hair" d="M57.6 13.7c-.7-1-1.6-1.7-2.7-2.2c-3.4-1.7-11.6-1.3-12.3-5.7c-.9-5.7-5.9.1-6.8.1c-1.1 0-1.6-3.9-3.7-3.9c-2.2 0-2.7 3.9-3.7 3.9c-.9 0-5.9-5.8-6.8-.1c-.7 4.3-9 4-12.3 5.7c-1 .5-2 1.2-2.7 2.2c-.5.8.6 1.6 1.2.9c1.6-2 4.8-2.4 7.1-2.8c1.9-.4 4-.6 5.9-1.4c2.6-1 2.5-4.9 3.3-4.9c.6 0 2.7 3 4.5 3c1.6 0 2.6-3.7 3.5-3.7c.9 0 1.9 3.7 3.5 3.7c1.9 0 4-3 4.6-3c.8 0 .7 3.9 3.3 4.9c1.8.8 3.9 1 5.9 1.4c2.3.5 5.6.8 7.1 2.8c.5.7 1.6-.2 1.1-.9" fill="#00b9f1"/> <g class="r-head"> <path d="M53 57c0 2.8-2.2 5-5 5H16c-2.8 0-5-2.2-5-5V36h42v21z" fill="#89967a"/> <path d="M32 12c-15.5 0-21 8.5-21 24v21h42V36c0-15.5-5.5-24-21-24" fill="#b6c4a7"/> <g fill="#89967a"><path d="M11 55c-1.1 0-2-1.2-2-2.6v-6.8c0-1.4.9-2.6 2-2.6v12"/><path d="M53 43c1.1 0 2 1.2 2 2.6v6.8c0 1.4-.9 2.6-2 2.6V43"/></g> <g fill="#3e4347"><path d="M7 20H5v30h4v-2H7z"/><path d="M57 20v28h-2v2h4V20z"/></g> <circle class="r-bulb b" cx="58" cy="20" r="4" fill="#00b9f1"/><circle class="r-bulb r" cx="6" cy="20" r="4" fill="#ff5263"/> <g class="r-eye"><path d="M21.5 39.5c-4.4 0-8-3.6-8-8s3.6-8 8-8s8 3.6 8 8s-3.6 8-8 8" fill="#efffd9"/><g class="r-pupil"><circle cx="21.5" cy="31.5" r="6" fill="#545b61"/><circle cx="21.5" cy="31.5" r="2.3" fill="#ff5263"/></g></g> <g class="r-eye"><path d="M42.5 39.5c-4.4 0-8-3.6-8-8s3.6-8 8-8s8 3.6 8 8s-3.6 8-8 8" fill="#efffd9"/><g class="r-pupil"><circle cx="42.5" cy="31.5" r="6" fill="#545b61"/><circle cx="42.5" cy="31.5" r="2.3" fill="#ff5263"/></g></g> <path d="M19.8 54.1c-7.4 0-7.4-13 0-13h24.5c7.4 0 7.4 13 0 13H19.8" fill="#efffd9"/><path d="M20.5 52.6c-6 0-6-10 0-10h23c6 0 6 10 0 10h-23" fill="#89967a"/> <g class="r-teeth" opacity=".7" fill="#3e4347"><path d="M21.2 50.7c0 1.2-2 1.2-2 0v-6.1c0-1.2 2-1.2 2 0v6.1"/><path d="M25.9 50.7c0 1.2-2 1.2-2 0v-6.1c0-1.2 2-1.2 2 0v6.1"/><path d="M30.6 50.7c0 1.2-2 1.2-2 0v-6.1c0-1.2 2-1.2 2 0v6.1"/><path d="M35.4 50.7c0 1.2-2 1.2-2 0v-6.1c0-1.2 2-1.2 2 0v6.1"/><path d="M40.1 50.7c0 1.2-2 1.2-2 0v-6.1c0-1.2 2-1.2 2 0v6.1"/><path d="M44.8 50.7c0 1.2-2 1.2-2 0v-6.1c0-1.2 2-1.2 2 0v6.1"/></g> <circle cx="32" cy="37" r="2" fill="#f5f5f5"/><path fill="#545b61" d="M30.316 35.862l.566-.565l2.828 2.828l-.565.566z"/> </g></svg>`;
  const CSS = `
.rl{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:inherit;vertical-align:middle}
.rl-bot{position:relative;display:grid;place-items:center}
.rl-body{position:relative;display:block;transform-origin:50% 100%;animation:rl-hop 1.5s cubic-bezier(.45,0,.55,1) infinite}
.rl-svg{display:block;overflow:visible;filter:drop-shadow(0 6px 10px rgba(15,29,54,.22))}
.rl-svg .r-head{transform-origin:32px 60px;animation:rl-bob 1.05s ease-in-out infinite}
.rl-svg .r-hair{transform-origin:32px 12px;animation:rl-wiggle .45s ease-in-out infinite}
.rl-svg .r-eye{transform-box:fill-box;transform-origin:center;animation:rl-blink 2.2s infinite}
.rl-svg .r-pupil{animation:rl-scan 1.7s ease-in-out infinite}
.rl-svg .r-bulb{transform-box:fill-box;transform-origin:center;animation:rl-flash .8s ease-in-out infinite}
.rl-svg .r-bulb.b{animation-delay:.4s}
.rl-svg .r-teeth{animation:rl-talk 1.2s ease-in-out infinite}
.rl-shadow{position:absolute;left:50%;bottom:-4px;width:60%;height:12%;margin-left:-30%;border-radius:50%;background:rgba(15,29,54,.28);filter:blur(2px);animation:rl-shadow 1.5s cubic-bezier(.45,0,.55,1) infinite}
.rl-ring,.rl-ring::before,.rl-ring::after{position:absolute;left:50%;top:50%;border-radius:50%;border:2px solid rgba(0,185,241,.55);animation:rl-ping 2.4s ease-out infinite}
.rl-ring::before,.rl-ring::after{content:"";left:0;top:0;width:100%;height:100%;margin:0}
.rl-ring::before{animation-delay:.8s;border-color:rgba(255,82,99,.55)}.rl-ring::after{animation-delay:1.6s;border-color:rgba(143,183,255,.55)}
.rl-orbit{position:absolute;inset:0;animation:rl-spin 4.2s linear infinite}
.rl-orbit i{position:absolute;left:50%;top:50%;width:9px;height:9px;margin:-4.5px 0 0 -4.5px;border-radius:50%;animation:rl-dot 1.3s ease-in-out infinite}
.rl-orbit i:nth-child(1){transform:rotate(0) translateY(calc(var(--rl-orb)*-1));background:#00b9f1}
.rl-orbit i:nth-child(2){transform:rotate(120deg) translateY(calc(var(--rl-orb)*-1));background:#ff5263;animation-delay:.43s}
.rl-orbit i:nth-child(3){transform:rotate(240deg) translateY(calc(var(--rl-orb)*-1));background:#8FB7FF;animation-delay:.86s}
.rl-s{flex-direction:row;gap:7px}.rl-s .rl-svg{width:1.35em;height:1.35em;filter:none}.rl-s .rl-body{animation-duration:.9s}.rl-s .rl-shadow{display:none}
.rl-m .rl-bot{width:72px;height:72px}.rl-m .rl-svg{width:56px;height:56px}
.rl-l .rl-bot{--rl-orb:70px;width:170px;height:170px}.rl-l .rl-svg{width:96px;height:96px}.rl-l .rl-ring{width:110px;height:110px;margin:-55px 0 0 -55px}
.rl-label{font-weight:700;font-size:14px;line-height:1.3;text-align:center}
.rl-label em{font-style:normal;margin-left:6px;color:#F5B83D}
.rl-s .rl-label{font-size:inherit}
@keyframes rl-hop{0%,100%{transform:translateY(0) scale(1,1)}12%{transform:translateY(0) scale(1.06,.92)}45%{transform:translateY(-14%) scale(.97,1.04)}70%{transform:translateY(0) scale(1.04,.95)}}
@keyframes rl-shadow{0%,100%{transform:scale(1);opacity:.3}45%{transform:scale(.55);opacity:.12}}
@keyframes rl-bob{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-1.2px) rotate(-3deg)}75%{transform:translateY(-1.2px) rotate(3deg)}}
@keyframes rl-wiggle{0%,100%{transform:rotate(0) scaleY(1)}50%{transform:rotate(4deg) scaleY(1.12)}}
@keyframes rl-blink{0%,44%,50%,100%{transform:scaleY(1)}47%{transform:scaleY(.1)}}
@keyframes rl-scan{0%,100%{transform:translate(0,0)}18%{transform:translate(2.8px,.8px)}42%{transform:translate(-2.8px,-1px)}68%{transform:translate(1.6px,-1.6px)}}
@keyframes rl-flash{0%,100%{opacity:1;transform:scale(1.15)}50%{opacity:.3;transform:scale(.65)}}
@keyframes rl-talk{0%,100%{opacity:.7}50%{opacity:.35}}
@keyframes rl-ping{0%{transform:scale(.7);opacity:0}14%{opacity:.9}100%{transform:scale(2.05);opacity:0}}
@keyframes rl-spin{to{transform:rotate(360deg)}}
@keyframes rl-dot{0%,100%{opacity:1}50%{opacity:.25}}
@media (prefers-reduced-motion:reduce){.rl *{animation-duration:3s!important}}`;
  let styled = false;
  function style() {
    if (styled) return; styled = true;
    const st = document.createElement("style"); st.id = "robo-loader"; st.textContent = CSS; document.head.appendChild(st);
  }
  function html(size = "m", label = "") {
    style();
    const extra = size === "l" ? `<span class="rl-ring"></span><span class="rl-orbit"><i></i><i></i><i></i></span>` : "";
    return `<span class="rl rl-${size}" role="status" aria-live="polite"><span class="rl-bot">${extra}<span class="rl-body">${SVG}</span><span class="rl-shadow"></span></span>` +
      (label ? `<span class="rl-label">${label}<em></em></span>` : "") + `</span>`;
  }
  window.Robo = { html, style };
})();
