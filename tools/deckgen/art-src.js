/* Robotics & AI Curriculum: the hand-drawn doodle library.

   Every picture in the new slides and tiles is drawn here, in the same style
   as the club's decks: flat colours, a dark marker outline, simple shapes.
   The outline is made wobbly by one shared SVG filter (#rai-rough), so the
   drawings look hand-made without any image files.

   RAI_ART.svg("arduino")             one drawing
   RAI_ART.svg("arduino", "label")    with an aria-label
   RAI_ART.doodles(n)                 n small edge doodles (stars, leaves...) for a slide */
(function () {
  const K = "#1B2333";                       // the marker
  const g = (inner, vb = "0 0 120 100") =>
    `<svg class="doodle" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg"><g filter="url(#rai-rough)" stroke="${K}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">${inner}</g></svg>`;
  const A = {
    /* ---- boards and parts ---- */
    arduino: g(`<rect x="8" y="16" width="104" height="70" rx="5" fill="#1F7A74"/><rect x="2" y="26" width="18" height="16" fill="#C9CED6"/><rect x="2" y="58" width="16" height="14" fill="#2B2F36"/>
      <rect x="40" y="20" width="62" height="6" fill="#2B2F36"/><rect x="46" y="76" width="56" height="6" fill="#2B2F36"/><rect x="56" y="50" width="44" height="12" fill="#2B2F36"/>
      <circle cx="30" cy="24" r="3" fill="#E0414B"/><rect x="34" y="34" width="10" height="10" fill="#2B2F36"/><circle cx="96" cy="38" r="2.5" fill="#7EE2A4" stroke="none"/>`),
    esp32: g(`<rect x="34" y="6" width="52" height="90" rx="4" fill="#1B2333"/><rect x="42" y="12" width="36" height="22" fill="#C9CED6"/><path d="M48 16v12M54 16v12M60 16v12M66 16v12" stroke="#8A93A3"/>
      <rect x="44" y="44" width="32" height="26" fill="#2E3542"/><rect x="50" y="84" width="20" height="8" fill="#C9CED6"/><path d="M34 40h-6M34 50h-6M34 60h-6M34 70h-6M86 40h6M86 50h6M86 60h6M86 70h6"/>`),
    breadboard: g(`<rect x="6" y="18" width="108" height="64" rx="5" fill="#F4F1EA"/><path d="M12 30h96M12 70h96" stroke="#E0414B"/><path d="M12 34h96M12 66h96" stroke="#2E6BE6"/>
      <path d="M20 44h80M20 50h80M20 56h80" stroke="#B8B2A6" stroke-dasharray="2 5"/>`),
    led: g(`<path d="M42 50a18 18 0 0 1 36 0v18H42z" fill="#E0414B"/><rect x="38" y="66" width="44" height="6" fill="#E0414B"/><path d="M52 72v22M68 72v16"/>
      <path d="M86 26l8-8M92 38l10-2M82 16l2-10" stroke="#F2A31B"/>`),
    resistor: g(`<path d="M6 50h24M90 50h24"/><rect x="30" y="38" width="60" height="24" rx="10" fill="#E9D3A6"/><path d="M44 38v24M56 38v24M66 38v24" stroke-width="4" stroke="#8A4B1F"/><path d="M78 38v24" stroke-width="4" stroke="#D4AF37"/>`),
    battery: g(`<rect x="22" y="30" width="72" height="40" rx="6" fill="#2E9E5B"/><rect x="94" y="42" width="8" height="16" fill="#C9CED6"/><rect x="22" y="30" width="22" height="40" rx="6" fill="#1B2333"/><path d="M60 40v20M50 50h20" stroke="#fff"/>`),
    button: g(`<rect x="34" y="40" width="52" height="40" rx="4" fill="#3A4150"/><circle cx="60" cy="58" r="14" fill="#E0414B"/><path d="M38 80v10M82 80v10M38 40v-8M82 40v-8"/>`),
    pot: g(`<rect x="30" y="48" width="60" height="30" rx="4" fill="#2E6BE6"/><circle cx="60" cy="40" r="16" fill="#C9CED6"/><path d="M60 40l9-9" stroke-width="3.5"/><path d="M44 78v12M60 78v12M76 78v12"/>`),
    servo: g(`<rect x="22" y="40" width="70" height="40" rx="4" fill="#2E6BE6"/><rect x="12" y="50" width="10" height="20" fill="#2E6BE6"/><rect x="92" y="50" width="10" height="20" fill="#2E6BE6"/>
      <circle cx="42" cy="40" r="10" fill="#F4F1EA"/><path d="M30 34l26-6" stroke-width="7" stroke="#F4F1EA"/><path d="M30 34l26-6" stroke-width="2"/><path d="M92 80q10 6 18 2" stroke="#F2A31B"/>`),
    motor: g(`<rect x="20" y="34" width="64" height="40" rx="12" fill="#F2A31B"/><rect x="84" y="46" width="12" height="16" fill="#C9CED6"/><path d="M96 54h16" stroke-width="4"/><path d="M30 74v12M44 74v12"/>
      <path d="M100 32a12 12 0 0 1 10 10M100 76a12 12 0 0 0 10-10" stroke="#8A93A3"/>`),
    stepper: g(`<circle cx="52" cy="54" r="30" fill="#C9CED6"/><circle cx="52" cy="54" r="10" fill="#3A4150"/><rect x="86" y="40" width="26" height="30" rx="3" fill="#E0414B"/><path d="M82 54h4M52 24v-8"/>`),
    ultrasonic: g(`<rect x="10" y="30" width="100" height="44" rx="4" fill="#2E6BE6"/><circle cx="36" cy="52" r="15" fill="#C9CED6"/><circle cx="84" cy="52" r="15" fill="#C9CED6"/>
      <circle cx="36" cy="52" r="7" fill="#3A4150"/><circle cx="84" cy="52" r="7" fill="#3A4150"/><path d="M44 74v12M54 74v12M66 74v12M76 74v12"/>`),
    irsensor: g(`<rect x="24" y="24" width="72" height="44" rx="4" fill="#1B2333"/><circle cx="46" cy="76" r="8" fill="#B9C4FF"/><circle cx="74" cy="76" r="8" fill="#2B2F36"/><path d="M40 92l-6 6M80 92l6 6" stroke="#E0414B"/><circle cx="84" cy="36" r="3" fill="#7EE2A4" stroke="none"/>`),
    multimeter: g(`<rect x="30" y="10" width="60" height="84" rx="8" fill="#F2A31B"/><rect x="38" y="18" width="44" height="22" fill="#D7F0D8"/><text x="60" y="35" font-size="13" text-anchor="middle" fill="${K}" stroke="none" font-family="monospace">5.0V</text>
      <circle cx="60" cy="62" r="13" fill="#3A4150"/><path d="M60 62l6-8" stroke="#fff"/><circle cx="44" cy="86" r="3" fill="#E0414B"/><circle cx="76" cy="86" r="3" fill="#1B2333"/>`),
    chip: g(`<rect x="30" y="26" width="60" height="48" rx="4" fill="#2B2F36"/><path d="M38 26v-10M50 26v-10M62 26v-10M74 26v-10M86 26v-10M38 74v10M50 74v10M62 74v10M74 74v10M86 74v10" stroke="#8A93A3"/><circle cx="40" cy="36" r="3" fill="#8A93A3" stroke="none"/>`),
    relay: g(`<rect x="20" y="30" width="80" height="50" rx="4" fill="#2E6BE6"/><rect x="32" y="38" width="40" height="34" fill="#1B2333"/><path d="M80 44h12M80 56h12M80 68h12"/><circle cx="86" cy="36" r="3" fill="#E0414B" stroke="none"/>`),
    transistor: g(`<path d="M38 60a22 22 0 0 1 44 0v6H38z" fill="#2B2F36"/><path d="M48 66v26M60 66v26M72 66v26"/>`),
    /* ---- robots ---- */
    robot: g(`<rect x="34" y="28" width="52" height="42" rx="10" fill="#B6C4A7"/><path d="M60 28v-12"/><circle cx="60" cy="13" r="5" fill="#E0414B"/><circle cx="49" cy="46" r="7" fill="#EFFFD9"/><circle cx="71" cy="46" r="7" fill="#EFFFD9"/>
      <circle cx="49" cy="46" r="3" fill="${K}"/><circle cx="71" cy="46" r="3" fill="${K}"/><path d="M50 60h20"/><rect x="40" y="70" width="40" height="22" rx="4" fill="#2E6BE6"/><path d="M40 78h-12M80 78h12"/>`),
    robotCar: g(`<rect x="16" y="34" width="88" height="34" rx="6" fill="#F2A31B"/><rect x="30" y="20" width="36" height="16" rx="3" fill="#1F7A74"/><circle cx="34" cy="72" r="13" fill="#2B2F36"/><circle cx="86" cy="72" r="13" fill="#2B2F36"/>
      <circle cx="34" cy="72" r="4" fill="#C9CED6"/><circle cx="86" cy="72" r="4" fill="#C9CED6"/><rect x="96" y="40" width="14" height="14" fill="#2E6BE6"/><circle cx="102" cy="44" r="2" fill="#fff" stroke="none"/><circle cx="102" cy="51" r="2" fill="#fff" stroke="none"/>`),
    robotArm: g(`<rect x="16" y="82" width="44" height="12" rx="3" fill="#3A4150"/><path d="M38 82V60" stroke-width="12" stroke="${K}"/><path d="M38 82V60" stroke-width="7" stroke="#F2A31B"/><path d="M38 60l34-22" stroke-width="12"/><path d="M38 60l34-22" stroke-width="7" stroke="#F2A31B"/>
      <circle cx="38" cy="60" r="7" fill="#2E6BE6"/><circle cx="72" cy="38" r="7" fill="#2E6BE6"/><path d="M72 38l24 6M96 44l8-8M96 44l8 10" stroke-width="4"/>`),
    gripper: g(`<rect x="44" y="10" width="32" height="20" rx="3" fill="#3A4150"/><path d="M50 30l-14 30 10 24M70 30l14 30-10 24" stroke-width="8" stroke="${K}"/><path d="M50 30l-14 30 10 24M70 30l14 30-10 24" stroke-width="4" stroke="#C9CED6"/><circle cx="60" cy="74" r="10" fill="#FFE29A"/>`),
    drone: g(`<rect x="44" y="42" width="32" height="18" rx="5" fill="#2E6BE6"/><path d="M44 46L22 32M76 46l22-14M44 56L22 70M76 56l22 14"/><ellipse cx="22" cy="30" rx="16" ry="4" fill="#C9CED6"/><ellipse cx="98" cy="30" rx="16" ry="4" fill="#C9CED6"/>
      <ellipse cx="22" cy="72" rx="16" ry="4" fill="#C9CED6"/><ellipse cx="98" cy="72" rx="16" ry="4" fill="#C9CED6"/><circle cx="60" cy="64" r="4" fill="#1B2333"/>`),
    gear: g(`<path d="M60 14l7 10 12-3 2 12 11 5-5 11 8 9-10 7 1 12-12 1-5 11-10-6-10 6-5-11-12-1 1-12-10-7 8-9-5-11 11-5 2-12 12 3z" fill="#C9CED6"/><circle cx="60" cy="56" r="13" fill="#F4F1EA"/>`),
    gears: g(`<circle cx="42" cy="56" r="26" fill="#F2A31B" stroke-dasharray="7 4"/><circle cx="42" cy="56" r="9" fill="#F4F1EA"/><circle cx="88" cy="34" r="16" fill="#2E6BE6" stroke-dasharray="6 4"/><circle cx="88" cy="34" r="5" fill="#F4F1EA"/>`),
    line: g(`<path d="M10 80c20-40 40 10 60-20s30-30 40-10" stroke-width="10" stroke="${K}" fill="none"/><path d="M10 80c20-40 40 10 60-20s30-30 40-10" stroke-width="2" stroke="#F4F1EA" stroke-dasharray="4 6" fill="none"/>`),
    /* ---- computers and AI ---- */
    laptop: g(`<rect x="22" y="18" width="76" height="50" rx="4" fill="#3A4150"/><rect x="28" y="24" width="64" height="38" fill="#DCEBFF"/><path d="M10 74h100l-8 10H18z" fill="#C9CED6"/><path d="M36 34h20M36 42h30M36 50h16" stroke="#2E6BE6"/>`),
    phone: g(`<rect x="38" y="8" width="44" height="84" rx="8" fill="#2B2F36"/><rect x="43" y="16" width="34" height="62" fill="#DCEBFF"/><circle cx="60" cy="85" r="3" fill="#C9CED6"/><rect x="48" y="28" width="24" height="12" rx="3" fill="#2E9E5B"/><rect x="48" y="48" width="24" height="12" rx="3" fill="#E0414B"/>`),
    webcam: g(`<circle cx="60" cy="40" r="26" fill="#3A4150"/><circle cx="60" cy="40" r="13" fill="#7FA8E8"/><circle cx="55" cy="35" r="4" fill="#fff" stroke="none"/><path d="M50 66l-8 22h36l-8-22"/><circle cx="80" cy="22" r="3" fill="#E0414B" stroke="none"/>`),
    camera: g(`<rect x="16" y="32" width="88" height="54" rx="8" fill="#3A4150"/><rect x="40" y="22" width="30" height="12" rx="3" fill="#3A4150"/><circle cx="60" cy="59" r="18" fill="#7FA8E8"/><circle cx="54" cy="53" r="5" fill="#fff" stroke="none"/>`),
    brain: g(`<path d="M60 22c-10-10-30-6-30 10-12 4-12 22 0 26-2 14 14 22 26 14 4 4 8 4 8 4V22z" fill="#F7B2C4"/><path d="M60 22c10-10 30-6 30 10 12 4 12 22 0 26 2 14-14 22-26 14-4 4-4 4-4 4V22z" fill="#F7B2C4"/>
      <path d="M40 40c6 0 8 6 14 4M44 60c6-4 10 2 14-2M80 40c-6 0-8 6-14 4M76 60c-6-4-10 2-14-2" fill="none"/>`),
    network: g(`<path d="M24 26l36 24M24 50l36 0M24 74l36-24M24 26l36 0M60 26l36 24M60 50l36 0M60 74l36-24M24 74l36 0M60 26v48" stroke="#8A93A3" stroke-width="1.8"/>
      <circle cx="24" cy="26" r="7" fill="#2E6BE6"/><circle cx="24" cy="50" r="7" fill="#2E6BE6"/><circle cx="24" cy="74" r="7" fill="#2E6BE6"/><circle cx="60" cy="26" r="7" fill="#7B3FC4"/><circle cx="60" cy="50" r="7" fill="#7B3FC4"/><circle cx="60" cy="74" r="7" fill="#7B3FC4"/><circle cx="96" cy="50" r="8" fill="#2E9E5B"/>`),
    chat: g(`<path d="M12 18h62v36H40l-14 12V54H12z" fill="#DCEBFF"/><path d="M50 46h58v34H96v12L84 80H50z" fill="#F1E9FB"/><path d="M22 30h40M22 40h28M60 58h38M60 68h26"/>`),
    book: g(`<path d="M60 26c-14-10-34-10-46-4v62c12-6 32-6 46 4z" fill="#F4F1EA"/><path d="M60 26c14-10 34-10 46-4v62c-12-6-32-6-46 4z" fill="#FFE29A"/><path d="M60 26v62"/><path d="M24 40h24M24 50h24M72 40h24M72 50h20" stroke="#8A93A3"/>`),
    magnifier: g(`<circle cx="50" cy="44" r="26" fill="#DCEBFF"/><path d="M70 64l26 26" stroke-width="10" stroke="${K}"/><path d="M70 64l26 26" stroke-width="5" stroke="#F2A31B"/><path d="M38 34a14 14 0 0 1 12-6" stroke="#fff"/>`),
    wifi: g(`<path d="M22 46a54 54 0 0 1 76 0M34 58a36 36 0 0 1 52 0M46 70a18 18 0 0 1 28 0" fill="none" stroke-width="5"/><circle cx="60" cy="82" r="5" fill="${K}"/>`),
    graph: g(`<rect x="14" y="14" width="92" height="72" rx="4" fill="#fff"/><path d="M24 74h74M24 74V22"/><path d="M28 68l16-14 14 6 16-22 20 8" fill="none" stroke="#2E6BE6" stroke-width="3.5"/><circle cx="74" cy="38" r="3.5" fill="#E0414B"/>`),
    wave: g(`<path d="M8 50c8-30 14 30 22 0s14-40 22 0 14 30 22 0 14-24 22 0 10 14 16 0" fill="none" stroke="#7B3FC4" stroke-width="4"/>`),
    scales: g(`<path d="M60 16v66M36 88h48"/><path d="M20 30h80" stroke-width="4"/><path d="M28 30l-12 26h24zM92 30l-12 26h24z" fill="#FFE29A"/><path d="M16 56a12 6 0 0 0 24 0M80 56a12 6 0 0 0 24 0" fill="#F2A31B"/><circle cx="60" cy="16" r="5" fill="#E0414B"/>`),
    pencil: g(`<path d="M24 88l8-24 52-52 16 16-52 52z" fill="#F2A31B"/><path d="M24 88l8-24 16 16z" fill="#F4F1EA"/><path d="M84 12l16 16" stroke-width="7" stroke="#E0414B"/>`),
    bin: g(`<path d="M30 30h60l-6 60H36z" fill="#2E9E5B"/><rect x="24" y="22" width="72" height="10" rx="3" fill="#2E9E5B"/><path d="M50 50a10 10 0 0 1 18 2l-4-2M70 64a10 10 0 0 1-16 4l4 0" stroke="#fff" fill="none"/>`),
    bulb: g(`<path d="M60 12a26 26 0 0 0-16 46v12h32V58a26 26 0 0 0-16-46z" fill="#FFE29A"/><rect x="46" y="70" width="28" height="14" rx="3" fill="#C9CED6"/><path d="M52 52l8-14 8 14" fill="none" stroke="#F2A31B"/><path d="M96 26l8-6M100 44h10M20 26l-8-6M16 44H6" stroke="#F2A31B"/>`),
    hand: g(`<path d="M40 92V48c0-6 10-6 10 0V30c0-6 10-6 10 0v-6c0-6 10-6 10 0v8c0-6 10-6 10 0v32c4-8 14-6 12 2l-10 20c-4 6-8 8-14 8z" fill="#F5C89A"/>`),
    eye: g(`<path d="M8 50c26-34 78-34 104 0-26 34-78 34-104 0z" fill="#fff"/><circle cx="60" cy="50" r="18" fill="#2E6BE6"/><circle cx="60" cy="50" r="8" fill="${K}"/><circle cx="54" cy="44" r="4" fill="#fff" stroke="none"/>`),
    trophy: g(`<path d="M38 14h44v26a22 22 0 0 1-44 0z" fill="#F2C335"/><path d="M38 22H24c0 14 8 20 14 20M82 22h14c0 14-8 20-14 20" fill="none"/><rect x="54" y="62" width="12" height="14" fill="#F2C335"/><rect x="40" y="76" width="40" height="12" rx="3" fill="#8A4B1F"/>`),
    map: g(`<rect x="12" y="14" width="96" height="72" rx="4" fill="#F4F1EA"/><path d="M12 38h96M12 62h96M36 14v72M60 14v72M84 14v72" stroke="#C9CED6" stroke-width="1.8"/><rect x="60" y="38" width="24" height="24" fill="#3A4150"/>
      <path d="M24 74V50h24v-24h48" fill="none" stroke="#E0414B" stroke-width="3.5" stroke-dasharray="6 4"/><circle cx="24" cy="74" r="5" fill="#2E9E5B"/><path d="M96 20l-6 6M96 20l6 6M96 20v12" stroke="#E0414B"/>`),
    cloud: g(`<path d="M30 74a18 18 0 0 1 2-36 24 24 0 0 1 46-6 20 20 0 0 1 14 42z" fill="#DCEBFF"/>`),
    video: g(`<rect x="10" y="14" width="100" height="64" rx="8" fill="#2B2F36"/><rect x="16" y="20" width="88" height="52" rx="4" fill="#F7E1A8"/><circle cx="60" cy="46" r="15" fill="#E0414B"/><path d="M55 38l12 8-12 8z" fill="#fff"/><path d="M40 86h40"/>`),
    plant: g(`<path d="M36 56h48l-6 34H42z" fill="#D9682B"/><path d="M60 56V24"/><path d="M60 40c-14-2-18-14-18-14s14-2 18 10M60 32c10-8 20-6 20-6s-4 12-20 10" fill="#2E9E5B"/>`),
    arrow: g(`<path d="M10 54c24-10 52-12 92-4" fill="none" stroke="#E4572E" stroke-width="5"/><path d="M84 34l20 16-22 14" fill="none" stroke="#E4572E" stroke-width="5"/>`),
    /* ---- tiny edge doodles ---- */
    star: g(`<path d="M60 14l12 28 30 2-24 18 8 30-26-18-26 18 8-30-24-18 30-2z" fill="none"/>`),
    sparkle: g(`<path d="M60 10v80M20 50h80M32 22l56 56M88 22L32 78" fill="none"/>`),
    squiggle: g(`<path d="M8 50c10-18 20 18 30 0s20-18 30 0 20 18 30 0" fill="none"/>`),
    leaf: g(`<path d="M20 80C20 30 70 14 100 20c0 34-24 64-80 60zM20 80l50-44" fill="none"/>`),
    bolt: g(`<path d="M66 8L30 58h24l-10 36 40-52H60z" fill="none"/>`)
  };
  /* one shared filter that makes every outline wobble a little */
  function defs() {
    if (document.getElementById("rai-rough-defs")) return;
    const d = document.createElement("div");
    d.id = "rai-rough-defs"; d.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
    d.innerHTML = `<svg width="0" height="0" aria-hidden="true"><filter id="rai-rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="2.6"/></filter></svg>`;
    (document.body || document.documentElement).appendChild(d);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", defs); else defs();
  const EDGE = ["star", "sparkle", "squiggle", "leaf", "bolt", "gear", "bulb"], TINT = ["#E0414B", "#F2A31B", "#2E9E5B", "#2E6BE6", "#7B3FC4"];
  window.RAI_ART = {
    has: k => !!A[k],
    svg: (k, label) => A[k] ? (label ? A[k].replace("<svg ", `<svg role="img" aria-label="${label}" `) : A[k].replace("<svg ", '<svg aria-hidden="true" ')) : "",
    /* small faint doodles placed round the edge of a slide, different on every slide */
    doodles(seed) {
      const spots = [[18, 12, 3], [88, 8, 4], [94, 42, 3.5], [3, 46, 3], [62, 92, 3], [94, 86, 3.5]];
      return spots.filter((_, i) => (seed + i) % 2 === 0).slice(0, 4).map(([x, y, w], i) => {
        const k = EDGE[(seed * 3 + i * 5) % EDGE.length], c = TINT[(seed + i * 2) % TINT.length];
        return `<i class="edge" style="left:${x}%;top:${y}%;width:${w}%;color:${c}">${A[k].replace(/stroke="#1B2333"/, 'stroke="currentColor"').replace(/fill="#[0-9A-Fa-f]{6}"/g, 'fill="none"')}</i>`;
      }).join("");
    }
  };
})();
