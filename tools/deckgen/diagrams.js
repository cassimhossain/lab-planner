/* Hand-drawn explanatory diagrams for the club decks.

   Everything is plain inline SVG on a 0 0 400 240 canvas (unless stated),
   stroked in the house palette and pushed through the #rai-rough filter so
   it reads as drawn by hand rather than generated.

   DIAGRAMS.name  ->  an <svg> string.  Use with  { t: "fig", name: "i2cBus" }
*/

const C = {
  ink: "#262D47", body: "#3A4152", muted: "#8A94A6",
  teal: "#0E8A86", red: "#E0414B", orange: "#E8591F", blue: "#2E6BE6",
  green: "#1DA14E", purple: "#7B3FC4", amber: "#F2A31B", paper: "#FFF9F0",
};

const S = (w, h, body) =>
  `<svg class="fig" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
   <g filter="url(#rai-rough)" fill="none" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;

/* little builders */
const box = (x, y, w, h, c, label, sub) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#fff" stroke="${c}" stroke-width="2.6"/>
  ${label ? `<text x="${x + w / 2}" y="${y + (sub ? h / 2 - 2 : h / 2 + 5)}" text-anchor="middle"
     font-family="Deck Body" font-weight="700" font-size="14" fill="${C.ink}" stroke="none">${label}</text>` : ""}
  ${sub ? `<text x="${x + w / 2}" y="${y + h / 2 + 15}" text-anchor="middle"
     font-family="Deck Body" font-size="12" fill="${C.muted}" stroke="none">${sub}</text>` : ""}`;

const line = (x1, y1, x2, y2, c, w = 2.4, dash = "") =>
  `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${c}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;

const poly = (pts, c, w = 2.4) => `<path d="M${pts.map(p => p.join(" ")).join("L")}" stroke="${c}" stroke-width="${w}"/>`;

const arrow = (x1, y1, x2, y2, c, w = 2.4) => {
  const a = Math.atan2(y2 - y1, x2 - x1), L = 9;
  return line(x1, y1, x2, y2, c, w) +
    poly([[x2 - L * Math.cos(a - 0.4), y2 - L * Math.sin(a - 0.4)], [x2, y2],
          [x2 - L * Math.cos(a + 0.4), y2 - L * Math.sin(a + 0.4)]], c, w);
};

const tx = (x, y, s, c = C.body, size = 12, weight = 400, anchor = "middle") =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Deck Body" font-size="${size}"
    font-weight="${weight}" fill="${c}" stroke="none">${s}</text>`;

/* Patrick Hand runs wider than the Caveat these were laid out in, so it is
   set a little smaller to keep each note in its place */
const hand = (x, y, s, c = C.orange, size = 17) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="Deck Hand"
    font-size="${(size * 0.84).toFixed(1)}" fill="${c}" stroke="none">${s}</text>`;

const chipBody = (x, y, w, h, c, label) => box(x, y, w, h, c, label);

const DIAGRAMS = {};

/* ---------------- EF-10 · serial protocols ---------------- */

DIAGRAMS.i2cBus = () => S(400, 230, `
  ${box(20, 24, 92, 54, C.teal, "Arduino", "master")}
  ${box(150, 150, 92, 54, C.blue, "OLED", "0x3C")}
  ${box(280, 150, 100, 54, C.purple, "MPU6050", "0x68")}
  ${line(22, 100, 380, 100, C.red, 3)}
  ${line(22, 126, 380, 126, C.orange, 3)}
  ${tx(26, 94, "SDA", C.red, 12, 700, "start")}
  ${tx(26, 142, "SCL", C.orange, 12, 700, "start")}
  ${line(66, 78, 66, 126, C.ink, 2)}
  ${line(196, 100, 196, 150, C.red, 2)}
  ${line(212, 126, 212, 150, C.orange, 2)}
  ${line(326, 100, 326, 150, C.red, 2)}
  ${line(342, 126, 342, 150, C.orange, 2)}
  ${hand(272, 40, "one pair of wires")}
  ${hand(272, 60, "an address each", C.teal, 15)}`);

DIAGRAMS.uartCross = () => S(400, 200, `
  ${box(18, 60, 120, 70, C.blue, "Board A")}
  ${box(262, 60, 120, 70, C.green, "Board B")}
  ${arrow(138, 82, 262, 82, C.red, 2.6)}
  ${arrow(262, 108, 138, 108, C.teal, 2.6)}
  ${tx(200, 74, "TX  →  RX", C.red, 12, 700)}
  ${tx(200, 126, "RX  ←  TX", C.teal, 12, 700)}
  ${line(18, 160, 382, 160, C.muted, 2, "4 6")}
  ${tx(200, 180, "GND must be shared, or neither board agrees what 0 V means", C.muted, 11)}
  ${hand(200, 36, "two wires, one each way")}`);

DIAGRAMS.spiLines = () => S(400, 230, `
  ${box(16, 70, 100, 76, C.teal, "Arduino", "master")}
  ${box(276, 20, 108, 56, C.blue, "SD card")}
  ${box(276, 150, 108, 56, C.purple, "Display")}
  ${line(116, 88, 276, 88, C.red, 2.4)}${tx(196, 82, "MOSI", C.red, 11, 700)}
  ${line(116, 106, 276, 106, C.green, 2.4)}${tx(196, 120, "MISO", C.green, 11, 700)}
  ${line(116, 124, 276, 124, C.blue, 2.4)}${tx(196, 138, "SCK", C.blue, 11, 700)}
  ${line(276, 88, 276, 48, C.red, 2)}${line(276, 124, 276, 178, C.blue, 2)}
  ${line(100, 146, 100, 200, C.orange, 2.4)}${line(100, 200, 330, 200, C.orange, 2.4)}
  ${line(330, 200, 330, 206, C.orange, 2.4)}
  ${tx(190, 216, "CS: one extra wire per device, pulled low to say 'you, talk now'", C.orange, 11, 700)}`);

/* ---------------- ROB-05 · driving a robot car ---------------- */

DIAGRAMS.hbridge = () => S(360, 240, `
  ${line(40, 30, 320, 30, C.red, 3)}${tx(30, 34, "+", C.red, 16, 700, "end")}
  ${line(40, 210, 320, 210, C.ink, 3)}${tx(28, 214, "GND", C.ink, 11, 700, "end")}
  ${box(60, 48, 58, 34, C.green, "S1")}
  ${box(242, 48, 58, 34, C.green, "S2")}
  ${box(60, 158, 58, 34, C.green, "S3")}
  ${box(242, 158, 58, 34, C.green, "S4")}
  ${line(89, 30, 89, 48, C.ink, 2)}${line(89, 82, 89, 120, C.ink, 2)}
  ${line(271, 30, 271, 48, C.ink, 2)}${line(271, 82, 271, 120, C.ink, 2)}
  ${line(89, 120, 140, 120, C.ink, 2)}${line(220, 120, 271, 120, C.ink, 2)}
  ${line(89, 120, 89, 158, C.ink, 2)}${line(271, 120, 271, 158, C.ink, 2)}
  ${line(89, 192, 89, 210, C.ink, 2)}${line(271, 192, 271, 210, C.ink, 2)}
  <circle cx="180" cy="120" r="30" fill="#fff" stroke="${C.orange}" stroke-width="2.8"/>
  ${tx(180, 126, "M", C.orange, 20, 800)}
  ${hand(180, 232, "S1 + S4 on = forward.  S2 + S3 on = back.", C.purple, 16)}
  ${hand(180, 16, "never S1 and S3 together: that is a short circuit", C.red, 15)}`);

DIAGRAMS.diffDrive = () => S(380, 230, `
  ${box(120, 60, 140, 110, C.blue, "")}
  <rect x="96" y="74" width="26" height="40" rx="5" fill="${C.ink}" stroke="${C.ink}" stroke-width="2"/>
  <rect x="96" y="124" width="26" height="40" rx="5" fill="${C.ink}" stroke="${C.ink}" stroke-width="2"/>
  <rect x="258" y="74" width="26" height="40" rx="5" fill="${C.ink}" stroke="${C.ink}" stroke-width="2"/>
  <rect x="258" y="124" width="26" height="40" rx="5" fill="${C.ink}" stroke="${C.ink}" stroke-width="2"/>
  ${tx(190, 108, "chassis", C.blue, 13, 700)}
  ${tx(190, 128, "battery + driver + Uno", C.muted, 11)}
  ${arrow(60, 94, 60, 40, C.green)}${arrow(320, 94, 320, 40, C.green)}
  ${tx(60, 196, "left", C.ink, 12, 700)}${tx(320, 196, "right", C.ink, 12, 700)}
  ${hand(190, 32, "both wheels forward  =  straight on", C.green, 16)}
  ${arrow(60, 214, 60, 206, C.red)}
  ${hand(190, 220, "one forward, one back  =  spin on the spot", C.red, 15)}`);

/* ---------------- ROB-06 · servo and stepper ---------------- */

DIAGRAMS.servoPulse = () => S(400, 210, `
  ${line(30, 170, 380, 170, C.muted, 2)}
  ${poly([[40,170],[40,120],[58,120],[58,170],[140,170],[140,120],[158,120],[158,170]], C.teal, 2.6)}
  ${poly([[180,170],[180,120],[208,120],[208,170],[280,170],[280,120],[308,120],[308,170]], C.blue, 2.6)}
  ${tx(99, 196, "1.0 ms  →  0°", C.teal, 12, 700)}
  ${tx(244, 196, "1.5 ms  →  90°", C.blue, 12, 700)}
  ${tx(352, 196, "2.0 ms  →  180°", C.purple, 12, 700)}
  ${poly([[330,170],[330,120],[372,120],[372,170]], C.purple, 2.6)}
  ${hand(200, 32, "the servo does not count turns, it reads pulse width")}
  ${line(40, 100, 158, 100, C.muted, 1.6, "4 4")}
  ${tx(99, 92, "20 ms frame, every time", C.muted, 11)}`);

DIAGRAMS.motorPick = () => S(400, 200, `
  ${box(12, 40, 112, 92, C.orange)}${box(144, 40, 112, 92, C.teal)}${box(276, 40, 112, 92, C.purple)}
  ${tx(68, 68, "DC motor", C.ink, 14, 700)}${tx(68, 92, "spins, fast", C.body, 12)}${tx(68, 110, "no idea where", C.muted, 11)}
  ${tx(200, 68, "Servo", C.ink, 14, 700)}${tx(200, 92, "points, 0-180°", C.body, 12)}${tx(200, 110, "holds an angle", C.muted, 11)}
  ${tx(332, 68, "Stepper", C.ink, 14, 700)}${tx(332, 92, "counts steps", C.body, 12)}${tx(332, 110, "2048 per turn", C.muted, 11)}
  ${hand(68, 160, "wheels", C.orange)}${hand(200, 160, "arms, grippers", C.teal)}${hand(332, 160, "printers, CNC", C.purple)}
  ${hand(200, 190, "only the servo checks itself: DC and stepper never know where they are", C.red, 15)}`);

/* ---------------- ROB-07 · encoders and odometry ---------------- */

DIAGRAMS.encoderDisc = () => S(400, 220, `
  <circle cx="110" cy="110" r="72" fill="#fff" stroke="${C.ink}" stroke-width="2.8"/>
  <circle cx="110" cy="110" r="14" fill="${C.ink}" stroke="${C.ink}" stroke-width="2"/>
  ${Array.from({ length: 20 }, (_, i) => {
    const a = i * Math.PI / 10;
    const x1 = 110 + 40 * Math.cos(a), y1 = 110 + 40 * Math.sin(a);
    const x2 = 110 + 66 * Math.cos(a), y2 = 110 + 66 * Math.sin(a);
    return i % 2 ? "" : line(x1, y1, x2, y2, C.ink, 5);
  }).join("")}
  ${box(214, 84, 76, 52, C.red, "IR", "LM393")}
  ${arrow(214, 110, 182, 110, C.red, 2.2)}
  ${poly([[300,150],[312,150],[312,118],[330,118],[330,150],[348,150],[348,118],[366,118],[366,150],[384,150]], C.green, 2.6)}
  ${tx(340, 176, "one pulse per slot", C.green, 12, 700)}
  ${hand(110, 208, "20 slots  =  20 ticks per wheel turn", C.purple, 16)}`);

DIAGRAMS.odometry = () => S(400, 190, `
  <circle cx="86" cy="92" r="58" fill="none" stroke="${C.ink}" stroke-width="3"/>
  ${line(86, 92, 144, 92, C.blue, 2.4)}
  ${tx(116, 84, "r", C.blue, 13, 700)}
  ${tx(86, 170, "wheel", C.muted, 12)}
  ${tx(260, 60, "circumference  =  π × diameter", C.ink, 15, 700)}
  ${tx(260, 92, "65 mm wheel  →  204 mm per turn", C.body, 13)}
  ${tx(260, 118, "20 ticks per turn  →  10.2 mm per tick", C.body, 13)}
  ${tx(260, 146, "1 metre  =  98 ticks", C.green, 15, 700)}
  ${hand(260, 176, "measure your own wheel. Never trust the box.", C.red, 15)}`);

/* ---------------- ROB-08/10 · control ---------------- */

DIAGRAMS.feedbackLoop = () => S(420, 200, `
  ${box(16, 70, 86, 56, C.blue, "Sensor", "measure")}
  ${box(132, 70, 86, 56, C.orange, "Compare", "error")}
  ${box(248, 70, 86, 56, C.purple, "Decide", "gain")}
  ${box(248, 70, 86, 56, C.purple, "Decide", "gain")}
  ${arrow(102, 98, 132, 98, C.ink)}
  ${arrow(218, 98, 248, 98, C.ink)}
  ${arrow(334, 98, 362, 98, C.ink)}
  ${box(362, 70, 46, 56, C.green, "Act")}
  ${poly([[385,126],[385,172],[59,172],[59,126]], C.teal, 2.4)}
  ${arrow(59, 140, 59, 126, C.teal)}
  ${tx(222, 190, "and round again, 100 times a second", C.teal, 12, 700)}
  ${tx(175, 56, "goal − measured", C.orange, 11, 700)}
  ${hand(210, 28, "closed loop: the robot checks itself")}`);

DIAGRAMS.pidShapes = () => S(420, 210, `
  ${line(30, 170, 404, 170, C.muted, 2)}${line(30, 16, 30, 170, C.muted, 2)}
  ${line(44, 70, 400, 70, C.muted, 1.6, "5 5")}${tx(44, 62, "goal", C.muted, 11, 700, "start")}
  <path d="M30 170 C70 170 80 20 110 32 C140 44 150 96 180 74 C210 54 220 78 250 70 L400 70"
        stroke="${C.red}" stroke-width="2.6"/>
  <path d="M30 170 C90 170 110 86 160 76 C210 66 260 70 400 70" stroke="${C.green}" stroke-width="2.6"/>
  <path d="M30 170 C110 170 150 120 230 112 C300 106 340 108 400 108" stroke="${C.blue}" stroke-width="2.6"/>
  ${tx(286, 40, "too much P: overshoot and wobble", C.red, 12, 700)}
  ${tx(300, 90, "tuned: fast and steady", C.green, 12, 700)}
  ${tx(300, 132, "too little: never gets there", C.blue, 12, 700)}
  ${hand(214, 200, "change one gain at a time, and write down what happened")}`);

DIAGRAMS.invPendulum = () => S(360, 240, `
  ${line(40, 196, 320, 196, C.muted, 2.4)}
  <circle cx="150" cy="176" r="20" fill="#fff" stroke="${C.ink}" stroke-width="2.6"/>
  <circle cx="214" cy="176" r="20" fill="#fff" stroke="${C.ink}" stroke-width="2.6"/>
  ${line(182, 176, 212, 52, C.blue, 5)}
  ${line(182, 176, 182, 48, C.muted, 2, "5 5")}
  <path d="M182 104 A 72 72 0 0 1 196 106" stroke="${C.red}" stroke-width="2.4"/>
  ${tx(206, 118, "θ", C.red, 16, 700)}
  ${box(196, 20, 84, 36, C.purple, "MPU6050")}
  ${arrow(120, 214, 60, 214, C.green)}
  ${hand(170, 232, "falling right? drive right. the wheels run to stay under the weight.", C.green, 15)}
  ${hand(80, 70, "upside-down", C.orange)}${hand(80, 90, "pendulum", C.orange)}`);

DIAGRAMS.compFilter = () => S(400, 190, `
  ${box(14, 24, 118, 54, C.orange, "Accelerometer", "")}
  ${box(14, 110, 118, 54, C.blue, "Gyroscope", "")}
  ${tx(73, 94, "right on average, noisy", C.muted, 10.5)}
  ${tx(73, 180, "smooth, but drifts away", C.muted, 10.5)}
  ${arrow(132, 51, 196, 80, C.orange)}
  ${arrow(132, 137, 196, 108, C.blue)}
  ${box(196, 66, 96, 56, C.teal, "Blend", "98% + 2%")}
  ${arrow(292, 94, 340, 94, C.teal)}
  ${tx(366, 90, "angle", C.teal, 13, 700)}
  ${tx(366, 108, "you can trust", C.muted, 11)}
  ${hand(240, 164, "a = 0.98·(a + gyro·dt) + 0.02·accel", C.purple, 16)}`);

/* ---------------- shared ---------------- */

DIAGRAMS.l298n = () => S(400, 220, `
  ${box(120, 40, 160, 140, C.green, "L298N", "")}
  ${tx(200, 108, "two half-bridges", C.muted, 11)}
  ${tx(200, 126, "one per motor", C.muted, 11)}
  ${line(120, 66, 60, 66, C.red, 2.4)}${tx(54, 70, "+12V", C.red, 11, 700, "end")}
  ${line(120, 88, 60, 88, C.ink, 2.4)}${tx(54, 92, "GND", C.ink, 11, 700, "end")}
  ${line(120, 110, 60, 110, C.orange, 2.4)}${tx(54, 114, "5V out", C.orange, 11, 700, "end")}
  ${line(120, 140, 60, 140, C.blue, 2.4)}${tx(54, 144, "IN1-IN4", C.blue, 11, 700, "end")}
  ${line(120, 162, 60, 162, C.purple, 2.4)}${tx(54, 166, "ENA/ENB", C.purple, 11, 700, "end")}
  ${line(280, 76, 340, 76, C.ink, 2.4)}${line(280, 98, 340, 98, C.ink, 2.4)}
  <circle cx="358" cy="87" r="20" fill="#fff" stroke="${C.orange}" stroke-width="2.6"/>${tx(358, 93, "M", C.orange, 15, 800)}
  ${line(280, 134, 340, 134, C.ink, 2.4)}${line(280, 156, 340, 156, C.ink, 2.4)}
  <circle cx="358" cy="145" r="20" fill="#fff" stroke="${C.orange}" stroke-width="2.6"/>${tx(358, 151, "M", C.orange, 15, 800)}
  ${hand(200, 206, "IN pins pick the direction. EN pins set the speed with PWM.", C.purple, 15)}`);

DIAGRAMS.pwmDuty = () => S(400, 190, `
  ${line(24, 150, 380, 150, C.muted, 2)}
  ${poly([[30,150],[30,60],[56,60],[56,150],[94,150],[94,60],[120,60],[120,150]], C.green, 2.6)}
  ${tx(76, 174, "25%: slow", C.green, 12, 700)}
  ${poly([[152,150],[152,60],[204,60],[204,150],[216,150],[216,60],[268,60],[268,150]], C.blue, 2.6)}
  ${tx(210, 174, "50%: half speed", C.blue, 12, 700)}
  ${poly([[290,150],[290,60],[368,60],[368,150],[376,150]], C.orange, 2.6)}
  ${tx(336, 174, "90%: flat out", C.orange, 12, 700)}
  ${hand(200, 32, "the motor never gets half a volt. It gets 5 V, switched on and off fast.")}`);

/* ---------------- AI-01 · rules versus learning ---------------- */

/* the two ways to make a computer smart: you write the rules, or it finds them */
DIAGRAMS.rulesVsLearning = () => S(400, 236, `
  ${tx(12, 22, "Normal programming", C.blue, 13, 700, "start")}
  ${box(12, 34, 82, 40, C.blue, "Rules", "you write")}
  ${box(12, 82, 82, 30, C.blue, "Data")}
  ${arrow(98, 74, 150, 74, C.blue)}
  ${box(154, 52, 92, 44, C.blue, "Program")}
  ${arrow(250, 74, 300, 74, C.blue)}
  ${box(304, 54, 84, 40, C.blue, "Answers")}
  ${line(12, 124, 388, 124, C.muted, 1.4, "5 5")}
  ${tx(12, 148, "Machine learning", C.purple, 13, 700, "start")}
  ${box(12, 158, 82, 30, C.purple, "Examples")}
  ${box(12, 196, 82, 36, C.purple, "Answers", "labels")}
  ${arrow(98, 196, 150, 196, C.purple)}
  ${box(154, 174, 92, 44, C.purple, "Learning")}
  ${arrow(250, 196, 300, 196, C.purple)}
  ${box(304, 176, 84, 40, C.purple, "Rules", "it finds")}
  ${hand(345, 140, "the arrows swap round", C.orange, 16)}`);

/* learning a pattern: labelled examples on two features, the line learning
   finds between them, and a new picture placed against it */
DIAGRAMS.patternScatter = () => {
  const cats = [[70, 60], [92, 84], [60, 96], [110, 58], [84, 120], [124, 98], [102, 140]];
  const dogs = [[230, 150], [262, 118], [290, 160], [252, 186], [310, 130], [278, 200], [226, 196]];
  const dot = ([x, y], c) => `<circle cx="${x}" cy="${y}" r="7" fill="${c}" stroke="${c}"/>`;
  return S(400, 236, `
  ${arrow(40, 216, 380, 216, C.muted, 1.8)}${arrow(40, 216, 40, 20, C.muted, 1.8)}
  ${tx(210, 234, "ears: rounder →", C.muted, 11)}
  ${tx(34, 120, "whiskers: longer ↑", C.muted, 11, 400, "end").replace("<text", "<text transform=\"rotate(-90 26 120)\"")}
  ${cats.map(p => dot(p, C.orange)).join("")}${dogs.map(p => dot(p, C.blue)).join("")}
  ${line(120, 214, 300, 30, C.green, 2.6, "7 6")}
  ${hand(318, 46, "the line it learned", C.green, 15)}
  <circle cx="170" cy="112" r="10" fill="#fff" stroke="${C.purple}" stroke-width="2.8"/>${tx(170, 117, "?", C.purple, 14, 700)}
  ${hand(170, 92, "new picture", C.purple, 15)}
  ${hand(170, 148, "cat side: 87% cat", C.purple, 15)}
  <circle cx="300" cy="226" r="0"/>
  ${dot([316, 70], C.orange)}${tx(328, 74, "cat", C.body, 12, 700, "start")}
  ${dot([316, 92], C.blue)}${tx(328, 96, "dog", C.body, 12, 700, "start")}`);
};

/* ---------------- AI-02 · AI basics ---------------- */

/* seventy years of AI on one line */
DIAGRAMS.aiTimeline = () => {
  const ev = [[1950, "Turing asks", "can machines think?", C.blue], [1956, "the name", "artificial intelligence", C.purple], [1997, "Deep Blue", "wins at chess", C.teal],
    [2011, "Siri", "talks on phones", C.orange], [2016, "AlphaGo", "wins at Go", C.green], [2022, "ChatGPT", "writes like a person", C.red]];
  /* evenly spaced, not to scale: the last three are only eleven years apart */
  const x = k => 62 + k * 55;
  return S(400, 236, `
  ${arrow(20, 120, 388, 120, C.muted, 2.2)}
  ${ev.map(([y, a, b, c], k) => { const X = x(k), up = k % 2 === 0, ty = up ? 58 : 168;
    return `<circle cx="${X}" cy="120" r="7" fill="${c}" stroke="${c}"/>${line(X, up ? 112 : 128, X, up ? 80 : 150, c, 1.8)}
      ${tx(X, up ? 74 : 162, String(y), c, 13, 700)}${tx(X, up ? ty - 28 : ty + 14, a, C.ink, 12, 700)}${tx(X, up ? ty - 14 : ty + 28, b, C.body, 10.5)}`; }).join("")}
  ${hand(200, 226, "seventy years from a question to your pocket", C.orange, 15)}`);
};

/* how every AI works: something comes in, a learned model, something comes out */
DIAGRAMS.inputModelOutput = () => S(400, 236, `
  ${tx(62, 34, "INPUT", C.blue, 13, 800)}${tx(200, 34, "MODEL", C.purple, 13, 800)}${tx(338, 34, "OUTPUT", C.green, 13, 800)}
  ${box(14, 48, 96, 34, C.blue, "a photo")}${box(14, 92, 96, 34, C.blue, "a voice")}${box(14, 136, 96, 34, C.blue, "some text")}
  <rect x="146" y="62" width="108" height="94" rx="12" fill="#fff" stroke="${C.purple}" stroke-width="2.8"/>
  ${tx(200, 100, "patterns it", C.ink, 13, 700)}${tx(200, 118, "learned from", C.ink, 13, 700)}${tx(200, 136, "examples", C.ink, 13, 700)}
  ${arrow(112, 109, 142, 109, C.blue)}${arrow(258, 109, 288, 109, C.green)}
  ${box(290, 48, 96, 34, C.green, "\"a cat\"")}${box(290, 92, 96, 34, C.green, "words typed")}${box(290, 136, 96, 34, C.green, "an answer")}
  ${hand(200, 196, "sense, think, act: the same loop as a robot", C.orange, 15)}
  ${hand(200, 218, "it always gives its best guess, never a certainty", C.red, 14)}`);

/* ---------------- AI-02 · hand-drawn illustrations ----------------
   Pictures rather than diagrams: flat colours and a dark marker outline,
   the same style as the doodles in art.js, through the same rough filter. */
const K = "#1B2333";
const PIC = (w, h, body) =>
  `<svg class="fig" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
   <g filter="url(#rai-rough)" stroke="${K}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
const face = (cx, cy, r, skin = "#F2C19B") => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${skin}"/>
  <path d="M${cx - r} ${cy - 2} C${cx - r} ${cy - r - 10} ${cx + r} ${cy - r - 10} ${cx + r} ${cy - 2} C${cx + r * .6} ${cy - r * .55} ${cx - r * .2} ${cy - r * .75} ${cx - r} ${cy - 2}z" fill="#3B2A22"/>
  <circle cx="${cx - r * .35}" cy="${cy + 2}" r="2.6" fill="${K}"/><circle cx="${cx + r * .35}" cy="${cy + 2}" r="2.6" fill="${K}"/>
  <path d="M${cx - r * .35} ${cy + r * .45} Q${cx} ${cy + r * .7} ${cx + r * .35} ${cy + r * .45}" fill="none"/>`;
const robotHead = (cx, cy, s = 1) => `<g transform="translate(${cx} ${cy}) scale(${s})">
  <path d="M0 -38v-12" fill="none"/><circle cx="0" cy="-54" r="5" fill="#E0414B"/>
  <rect x="-30" y="-38" width="60" height="50" rx="12" fill="#B6C4A7"/>
  <rect x="-36" y="-22" width="6" height="18" rx="2" fill="#8C9A7E"/><rect x="30" y="-22" width="6" height="18" rx="2" fill="#8C9A7E"/>
  <circle cx="-12" cy="-16" r="8" fill="#EFFFD9"/><circle cx="12" cy="-16" r="8" fill="#EFFFD9"/>
  <circle cx="-12" cy="-16" r="3.4" fill="#2E6BE6"/><circle cx="12" cy="-16" r="3.4" fill="#2E6BE6"/>
  <rect x="-15" y="0" width="30" height="6" rx="3" fill="#545B61"/></g>`;

/* slide 2: fast is not the same as smart */
DIAGRAMS.calcVsFace = () => PIC(400, 236, `
  <rect x="38" y="30" width="110" height="160" rx="12" fill="#3A4152"/>
  <rect x="50" y="42" width="86" height="34" rx="4" fill="#C9E7C2"/>
  ${tx(130, 66, "99980001", K, 15, 700, "end")}
  ${[0, 1, 2, 3].map(r => [0, 1, 2].map(c => `<rect x="${52 + c * 28}" y="${88 + r * 24}" width="22" height="18" rx="4" fill="${r === 3 && c === 2 ? "#F2A31B" : "#E6E8EE"}"/>`).join("")).join("")}
  <rect x="236" y="22" width="96" height="176" rx="16" fill="#262D47"/>
  <rect x="244" y="38" width="80" height="140" rx="6" fill="#DCEFEC"/>
  ${face(284, 98, 24)}
  <path d="M262 60 h-6 v10 M306 60 h6 v10 M262 140 h-6 v-10 M306 140 h6 v-10" stroke="#0E8A86" stroke-width="2.6" fill="none"/>
  <circle cx="284" cy="160" r="9" fill="#1DA14E"/><path d="M279 160 l4 4 l7 -8" stroke="#fff" stroke-width="2.6" fill="none"/>
  ${hand(93, 214, "very fast, but only follows rules", C.blue, 15)}
  ${hand(284, 222, "learned your face from examples", C.purple, 15)}`);

/* slide 4: what a person does that we call intelligent */
DIAGRAMS.humanIntelligence = () => PIC(400, 236, `
  ${face(200, 124, 42)}
  <path d="M152 112 c-10 0 -12 26 0 26" fill="#F2C19B"/><path d="M248 112 c10 0 12 26 0 26" fill="#F2C19B"/>
  <g><circle cx="70" cy="56" r="26" fill="#E8F0FD"/><path d="M52 56 Q70 40 88 56 Q70 72 52 56z" fill="#fff"/><circle cx="70" cy="56" r="7" fill="#2E6BE6"/></g>
  <g><circle cx="330" cy="56" r="26" fill="#E3F6F2"/><path d="M322 44 a10 12 0 1 1 6 22 c-4 2 -6 6 -10 6" fill="none"/><path d="M344 46 q6 10 0 20 M350 42 q10 14 0 28" stroke="#0E8A86" fill="none"/></g>
  <g><circle cx="70" cy="184" r="26" fill="#F1E9FB"/><path d="M62 192 h16 M63 198 h14" fill="none"/><path d="M60 188 c-8 -10 -4 -26 10 -26 c14 0 18 16 10 26z" fill="#F2D55B"/></g>
  <g><circle cx="330" cy="184" r="26" fill="#FDF1E3"/><path d="M330 172 v30" fill="none"/><path d="M330 172 h16 l6 6 l-6 6 h-16z" fill="#E8591F"/><path d="M330 188 h-16 l-6 6 l6 6 h16z" fill="#2E6BE6"/></g>
  ${line(96, 64, 160, 100, C.muted, 1.6, "4 4")}${line(304, 64, 240, 100, C.muted, 1.6, "4 4")}${line(96, 176, 160, 150, C.muted, 1.6, "4 4")}${line(304, 176, 240, 150, C.muted, 1.6, "4 4")}
  ${hand(70, 104, "see", C.blue, 17)}${hand(330, 104, "hear and talk", C.teal, 17)}${hand(70, 228, "learn", C.purple, 17)}${hand(330, 228, "decide", C.orange, 17)}`);

/* slide 5: a brain and a chip, both learning */
DIAGRAMS.brainVsChip = () => PIC(400, 236, `
  <path d="M60 120 c-18 -6 -16 -40 6 -44 c2 -22 30 -30 44 -16 c14 -14 42 -6 42 16 c22 4 22 38 4 44 c6 20 -18 36 -36 26 c-12 14 -40 10 -44 -6 c-20 2 -28 -12 -16 -20z" fill="#F4B6C2"/>
  <path d="M86 84 c10 6 10 18 0 24 M118 70 c-6 14 6 22 0 36 M140 96 c-12 4 -12 18 0 24 M100 128 c10 -6 22 -4 26 6" fill="none" stroke="#B5677A"/>
  <g transform="translate(290 112)">
    ${[-30, -15, 0, 15, 30].map(d => `<path d="M${d} -52 v-12 M${d} 52 v12 M-52 ${d} h-12 M52 ${d} h12" fill="none"/>`).join("")}
    <rect x="-52" y="-52" width="104" height="104" rx="10" fill="#262D47"/>
    <rect x="-30" y="-30" width="60" height="60" rx="6" fill="#3A4152"/>
    ${tx(0, 6, "AI", "#9CC1FF", 20, 800)}
  </g>
  ${arrow(172, 112, 214, 112, C.purple)}${arrow(214, 124, 172, 124, C.purple)}
  ${hand(108, 196, "learns from experience", "#B5677A", 16)}
  ${hand(290, 210, "learns from data, made by people", C.purple, 16)}`);

/* slide 8: five things AI can do, as badges */
DIAGRAMS.fiveAbilities = () => {
  const cx = k => 42 + k * 79, cy = 50;
  const ring = (k, fill) => `<circle cx="${cx(k)}" cy="${cy}" r="32" fill="${fill}"/>`;
  return PIC(400, 120, `
  ${ring(0, "#E8F0FD")}<path d="M${cx(0) - 20} ${cy} Q${cx(0)} ${cy - 18} ${cx(0) + 20} ${cy} Q${cx(0)} ${cy + 18} ${cx(0) - 20} ${cy}z" fill="#fff"/><circle cx="${cx(0)}" cy="${cy}" r="8" fill="#2E6BE6"/><circle cx="${cx(0)}" cy="${cy}" r="3" fill="${K}"/>
  ${ring(1, "#E3F6F2")}<path d="M${cx(1) - 8} ${cy - 14} a12 14 0 1 1 6 26 c-4 2 -5 6 -10 6" fill="none"/><path d="M${cx(1) + 12} ${cy - 10} q6 10 0 20 M${cx(1) + 18} ${cy - 15} q10 15 0 30" stroke="#0E8A86" fill="none"/>
  ${ring(2, "#F1E9FB")}<path d="M${cx(2) - 20} ${cy - 16} h40 a6 6 0 0 1 6 6 v18 a6 6 0 0 1 -6 6 h-24 l-10 8 v-8 h-6 a6 6 0 0 1 -6 -6 v-18 a6 6 0 0 1 6 -6z" fill="#fff"/>${tx(cx(2) + 2, cy + 4, "Aa", C.purple, 15, 800)}
  ${ring(3, "#FDF1E3")}<path d="M${cx(3)} ${cy - 22} v44" fill="none"/><path d="M${cx(3)} ${cy - 20} h18 l6 6 l-6 6 h-18z" fill="#E8591F"/><path d="M${cx(3)} ${cy - 2} h-18 l-6 6 l6 6 h18z" fill="#2E6BE6"/>
  ${ring(4, "#FCEAE9")}<path d="M${cx(4) - 16} ${cy + 16} l24 -30 l8 6 l-24 30z" fill="#F2A31B"/><path d="M${cx(4) - 16} ${cy + 16} l-3 8 l8 -3z" fill="${K}"/><path d="M${cx(4) + 12} ${cy - 22} l2 -6 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2z" fill="#E0414B" stroke="#E0414B" stroke-width="1"/>
  ${hand(cx(0), 112, "see", C.blue, 17)}${hand(cx(1), 112, "hear", C.teal, 17)}${hand(cx(2), 112, "language", C.purple, 17)}${hand(cx(3), 112, "decide", C.orange, 17)}${hand(cx(4), 112, "create", C.red, 17)}`);
};

/* slide 9: narrow AI does one job; film AI does everything */
DIAGRAMS.narrowVsFilm = () => PIC(400, 236, `
  <rect x="24" y="150" width="140" height="46" rx="4" fill="#F4F1EA"/>
  ${[0, 1, 2, 3, 4, 5, 6].map(c => [0, 1].map(r => (c + r) % 2 ? `<rect x="${24 + c * 20}" y="${150 + r * 23}" width="20" height="23" fill="#3A4152" stroke="none"/>` : "").join("")).join("")}
  <path d="M96 150 v-14 h-8 c0 -12 4 -20 12 -26 l8 8 c-4 4 -4 10 -2 18 h-6 v14z" fill="#fff"/>
  <path d="M36 110 l40 -34 l32 22" fill="none" stroke="${K}" stroke-width="7"/><path d="M36 110 l40 -34 l32 22" fill="none" stroke="#8A94A6" stroke-width="3"/>
  <circle cx="76" cy="76" r="7" fill="#F2A31B"/><rect x="22" y="108" width="28" height="12" rx="3" fill="#F2A31B"/>
  ${hand(94, 222, "narrow AI: brilliant at one job", C.green, 16)}
  <rect x="226" y="20" width="156" height="176" rx="6" fill="#262D47"/>
  ${[0, 1, 2, 3, 4, 5, 6].map(k => `<rect x="${232 + k * 21}" y="25" width="12" height="8" rx="1.5" fill="#fff" stroke="none"/><rect x="${232 + k * 21}" y="183" width="12" height="8" rx="1.5" fill="#fff" stroke="none"/>`).join("")}
  <rect x="234" y="40" width="140" height="136" fill="#4A5578"/>
  ${robotHead(304, 104, 0.9)}
  <rect x="280" y="116" width="48" height="44" rx="8" fill="#B6C4A7"/>
  ${tx(250, 70, "?", "#F2D55B", 22, 800)}${tx(358, 74, "!", "#F2D55B", 22, 800)}
  ${hand(304, 222, "film AI: does everything (made up)", C.red, 16)}`);

/* slide 10: labelled examples go in, a model comes out */
DIAGRAMS.dataPile = () => {
  const card = (x, y, rot, lab, cat) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(.8)"><rect x="-30" y="-30" width="60" height="60" rx="4" fill="#fff"/>
    ${cat ? `<path d="M-14 6 l-4 -20 l12 8 h12 l12 -8 l-4 20 c0 12 -28 12 -28 0z" fill="#F2A31B"/><circle cx="-6" cy="2" r="2" fill="${K}"/><circle cx="6" cy="2" r="2" fill="${K}"/>`
      : `<circle cx="0" cy="0" r="14" fill="#C9A06B"/><path d="M-14 -2 c-6 -10 -2 -16 4 -10 M14 -2 c6 -10 2 -16 -4 -10" fill="#8C6A43"/><circle cx="-5" cy="-1" r="2" fill="${K}"/><circle cx="5" cy="-1" r="2" fill="${K}"/>`}
    <rect x="-22" y="20" width="44" height="14" rx="3" fill="${cat ? "#7B3FC4" : "#0E8A86"}"/>${tx(0, 31, lab, "#fff", 10, 700)}</g>`;
  return PIC(400, 236, `
  ${card(52, 52, -5, "cat", 1)}${card(124, 52, 4, "dog", 0)}${card(52, 124, 3, "dog", 0)}${card(124, 124, -4, "cat", 1)}${card(88, 194, 2, "cat", 1)}
  ${arrow(168, 118, 214, 118, C.purple, 2.8)}
  <g transform="translate(270 118)">${[-24, -8, 8, 24].map(d => `<path d="M${d} -40 v-10 M${d} 40 v10 M-40 ${d} h-10 M40 ${d} h10" fill="none"/>`).join("")}
    <rect x="-40" y="-40" width="80" height="80" rx="8" fill="#262D47"/>${tx(0, 5, "model", "#9CC1FF", 14, 800)}</g>
  ${arrow(326, 118, 360, 118, C.green, 2.8)}${tx(378, 122, "?", C.green, 22, 800)}
  ${hand(88, 14, "examples with labels", C.purple, 16)}${hand(270, 196, "training finds the pattern", C.orange, 16)}`);
};

/* slide 11: people and AI, each heavier on different jobs */
DIAGRAMS.humanVsAiScale = () => PIC(400, 236, `
  <path d="M200 64 v130" fill="none" stroke-width="4"/><path d="M160 200 h80 l-10 -12 h-60z" fill="#8A94A6"/>
  <path d="M90 74 L310 74" fill="none" stroke-width="4"/><circle cx="200" cy="66" r="8" fill="#F2A31B"/>
  <path d="M90 74 l-30 60 h60z M310 74 l-30 60 h60z" fill="none" stroke="#8A94A6" stroke-width="1.8"/>
  <path d="M52 134 h76 c0 14 -76 14 -76 0z M272 134 h76 c0 14 -76 14 -76 0z" fill="#E6E8EE"/>
  ${robotHead(90, 128, 0.62)}
  ${face(310, 110, 20)}<path d="M290 134 c0 -12 40 -12 40 0" fill="#2E6BE6"/>
  ${hand(90, 172, "fast, tireless, huge memory", C.purple, 15)}
  ${hand(310, 172, "understands, feels, invents", C.blue, 15)}
  ${hand(200, 226, "best of all: working together", C.green, 16)}`);

/* slide 12: the husky in the snow */
DIAGRAMS.huskyWolf = () => PIC(400, 236, `
  <rect x="40" y="24" width="190" height="170" rx="6" fill="#DCE9F6"/>
  <path d="M40 150 c40 -16 80 -6 110 -14 c30 -8 60 2 80 -4 v62 h-190z" fill="#fff"/>
  <path d="M70 60 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2z M190 48 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2z M118 40 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2z" fill="#fff" stroke="#9CB4D0" stroke-width="1.2"/>
  <path d="M104 92 l-8 -26 l22 14z M166 92 l8 -26 l-22 14z" fill="#8A94A6"/>
  <path d="M100 100 c0 -24 70 -24 70 0 c0 26 -16 42 -35 42 c-19 0 -35 -16 -35 -42z" fill="#A9B2C2"/>
  <path d="M118 112 c6 -12 28 -12 34 0 c0 18 -34 18 -34 0z" fill="#fff"/>
  <circle cx="122" cy="100" r="4" fill="#2E6BE6"/><circle cx="148" cy="100" r="4" fill="#2E6BE6"/><ellipse cx="135" cy="118" rx="6" ry="4" fill="${K}"/>
  <rect x="246" y="58" width="132" height="58" rx="10" fill="#FCEAE9" stroke="#E0414B" stroke-width="2.6"/>
  ${tx(312, 84, "wolf", "#E0414B", 18, 800)}${tx(312, 104, "94% sure", "#E0414B", 13, 700)}
  ${arrow(244, 92, 214, 104, "#E0414B")}
  ${hand(312, 148, "it's a husky!", C.green, 18)}
  ${hand(312, 178, "it learned: snow = wolf", C.orange, 16)}
  ${hand(135, 222, "every wolf photo it saw had snow", C.muted, 14)}`);

/* slide 13: privacy, kept safe */
DIAGRAMS.safetyShield = () => PIC(260, 240, `
<g transform="translate(-70 0)">
  <path d="M200 24 l72 26 v58 c0 52 -34 84 -72 100 c-38 -16 -72 -48 -72 -100 v-58z" fill="#E3F6F2"/>
  <path d="M200 42 l56 20 v46 c0 40 -26 66 -56 80 c-30 -14 -56 -40 -56 -80 v-46z" fill="#0E8A86"/>
  <rect x="176" y="104" width="48" height="40" rx="6" fill="#F2A31B"/><path d="M186 104 v-12 a14 14 0 0 1 28 0 v12" fill="none" stroke-width="5"/>
  <circle cx="200" cy="120" r="5" fill="${K}"/><path d="M200 124 v10" fill="none" stroke-width="3"/></g>
  ${hand(130, 232, "keep private things private", C.orange, 17)}`);

/* slide 14: a farmer's phone spots a leaf disease */
DIAGRAMS.farmerPhone = () => PIC(400, 236, `
  <path d="M40 200 c40 -12 100 -12 140 0" fill="none" stroke="#1DA14E" stroke-width="3"/>
  ${[60, 90, 120, 150].map(x => `<path d="M${x} 198 v-30 M${x} 182 c-10 -4 -14 -14 -10 -20 c8 2 12 10 10 20 M${x} 176 c10 -4 14 -14 10 -20 c-8 2 -12 10 -10 20" fill="#7CC36E"/>`).join("")}
  <rect x="216" y="24" width="112" height="190" rx="16" fill="#262D47"/>
  <rect x="226" y="40" width="92" height="140" rx="6" fill="#FFF9F0"/>
  <path d="M272 60 c26 10 30 50 0 76 c-30 -26 -26 -66 0 -76z" fill="#7CC36E"/><path d="M272 66 v66" fill="none" stroke="#3E8A3A"/>
  <circle cx="262" cy="92" r="6" fill="#C9772B" stroke="none"/><circle cx="282" cy="108" r="5" fill="#C9772B" stroke="none"/><circle cx="266" cy="118" r="4" fill="#C9772B" stroke="none"/>
  <path d="M234 48 h10 M234 48 v10 M310 48 h-10 M310 48 v10 M234 172 h10 M234 172 v-10 M310 172 h-10 M310 172 v-10" stroke="#0E8A86" stroke-width="2.6" fill="none"/>
  <rect x="230" y="186" width="84" height="20" rx="5" fill="#E0414B"/>${tx(272, 200, "leaf rust 91%", "#fff", 10.5, 700)}
  ${hand(110, 40, "snap a photo of a sick leaf", C.green, 16)}${hand(110, 64, "the app names the disease", C.orange, 16)}`);

module.exports = { DIAGRAMS, C };

/* ================= AI-02 · training data ================= */

/* the loop a class actually walks through: gather, label, train, test, and
   back round again when the model gets something wrong */
DIAGRAMS.trainingLoop = () => S(400, 236, `
  ${box(14, 26, 86, 42, C.orange, "Collect", "photos")}
  ${arrow(104, 47, 136, 47, C.ink)}
  ${box(140, 26, 86, 42, C.blue, "Label", "name each one")}
  ${arrow(230, 47, 262, 47, C.ink)}
  ${box(266, 26, 96, 42, C.purple, "Train", "find the pattern")}
  ${arrow(314, 68, 314, 92, C.purple)}
  ${box(104, 96, 192, 44, C.green, "Model", "it can guess on new pictures")}
  ${arrow(200, 140, 200, 164, C.green)}
  ${box(104, 168, 192, 40, C.teal, "Test it on pictures it never saw")}
  ${poly([[104, 188], [46, 188], [46, 12], [57, 12]], C.red, 2.4)}
  ${arrow(50, 12, 57, 12), ""}
  ${poly([[57, 12], [57, 26]], C.red, 2.4)}
  ${arrow(57, 20, 57, 26, C.red)}
  ${hand(214, 228, "got it wrong? go and collect more of that", C.red, 17)}`);

/* what the Teachable Machine screen looks like, so the class recognises it
   before they open it */
DIAGRAMS.teachableUI = () => {
  const cls = (y, name, n, c) => `
    ${box(10, y, 176, 48, c, "")}
    ${tx(24, y + 21, name, C.ink, 13, 700, "start")}
    ${tx(24, y + 38, n + " samples", C.muted, 11, 400, "start")}
    <rect x="152" y="${y + 13}" width="24" height="22" rx="4" fill="${c}" stroke="${c}"/>
    ${tx(164, y + 28, "cam", "#fff", 8.5, 700)}`;
  const bar = (y, name, pct, c) => `
    ${tx(210, y, name, C.ink, 11.5, 700, "start")}
    ${tx(388, y, pct + "%", c, 11.5, 700, "end")}
    <rect x="210" y="${y + 6}" width="178" height="13" rx="6.5" fill="#EFEAE0" stroke="none"/>
    <rect x="210" y="${y + 6}" width="${Math.round(178 * pct / 100)}" height="13" rx="6.5" fill="${c}" stroke="none"/>`;
  return S(400, 236, `
    ${cls(14, "banana", 42, C.amber)}
    ${cls(70, "apple", 38, C.red)}
    ${cls(126, "nothing", 50, C.muted)}
    ${box(10, 188, 176, 40, C.purple, "Train Model")}
    <rect x="210" y="14" width="178" height="62" rx="5" fill="${C.ink}" stroke="${C.ink}" stroke-width="2.6"/>
    ${tx(299, 42, "webcam", "#fff", 13, 700)}
    ${tx(299, 60, "live preview", "#B9C0CF", 10.5)}
    ${tx(210, 100, "Preview says:", C.muted, 11, 700, "start")}
    ${bar(118, "banana", 92, C.amber)}
    ${bar(152, "apple", 6, C.red)}
    ${bar(186, "nothing", 2, C.muted)}
    ${hand(292, 224, "it says how sure it is, not yes or no", C.orange, 16)}`);
};

/* the same number of examples, collected two ways, and what each does to a
   new photo. This is the slide the whole lesson turns on. */
DIAGRAMS.goodBadData = () => {
  const card = (x, y, c, tilt) =>
    `<rect x="${x}" y="${y}" width="26" height="22" rx="3" fill="#fff" stroke="${c}" stroke-width="2.2"
      transform="rotate(${tilt} ${x + 13} ${y + 11})"/>`;
  return S(400, 236, `
    ${tx(12, 18, "20 photos, all the same", C.red, 12.5, 700, "start")}
    ${[0, 1, 2, 3].map(i => card(14 + i * 34, 30, C.red, 0)).join("")}
    ${[0, 1, 2, 3].map(i => card(14 + i * 34, 60, C.red, 0)).join("")}
    ${hand(84, 108, "same hand, same desk, same light", C.red, 15)}
    ${line(196, 14, 196, 222, C.muted, 1.4, "5 5")}
    ${tx(212, 18, "20 photos, all different", C.green, 12.5, 700, "start")}
    ${[0, 1, 2, 3].map(i => card(214 + i * 34, 30, C.green, i * 7 - 10)).join("")}
    ${[0, 1, 2, 3].map(i => card(214 + i * 34, 60, C.green, 12 - i * 9)).join("")}
    ${hand(286, 108, "different hands, angles, backgrounds", C.green, 15)}
    ${box(14, 130, 160, 40, C.red, "New photo, new room", "")}
    ${box(214, 130, 160, 40, C.green, "New photo, new room", "")}
    ${arrow(94, 170, 94, 186, C.red)}${arrow(294, 170, 294, 186, C.green)}
    ${tx(94, 206, "51% · no idea", C.red, 14, 700)}
    ${tx(294, 206, "94% · banana", C.green, 14, 700)}
    ${hand(200, 232, "same effort, very different model", C.purple, 17)}`);
};

/* what the model is actually handed: brightness numbers, not a picture */
DIAGRAMS.pixelsToNumbers = () => {
  const g = [[90, 60, 40, 70], [70, 30, 20, 50], [40, 20, 25, 60], [80, 55, 45, 85]];
  const cells = g.map((row, r) => row.map((v, c) => {
    const x = 150 + c * 30, y = 56 + r * 30, sh = Math.round(255 - v * 1.6);
    return `<rect x="${x}" y="${y}" width="30" height="30" fill="rgb(${sh},${sh},${sh})" stroke="#fff" stroke-width="1"/>
      <text x="${x + 15}" y="${y + 19}" text-anchor="middle" font-family="Deck Body" font-size="10.5"
        font-weight="700" fill="${sh < 140 ? "#fff" : C.ink}" stroke="none">${v}</text>`;
  }).join("")).join("");
  return S(400, 236, `
    <rect x="14" y="56" width="108" height="120" rx="4" fill="${C.ink}" stroke="${C.ink}" stroke-width="2.6"/>
    ${tx(68, 112, "your photo", "#fff", 12.5, 700)}
    ${tx(68, 130, "224 x 224", "#B9C0CF", 10.5)}
    ${arrow(126, 116, 146, 116, C.ink)}
    ${cells}
    <rect x="150" y="56" width="120" height="120" fill="none" stroke="${C.purple}" stroke-width="2.6"/>
    ${arrow(274, 116, 296, 116, C.purple)}
    ${box(300, 92, 88, 48, C.purple, "the model", "sees only this")}
    ${hand(200, 36, "a picture is just a grid of numbers", C.orange, 17)}
    ${hand(200, 204, "50,176 pixels, three numbers each", C.purple, 16)}
    ${hand(200, 224, "150,528 numbers, for one small photo", C.muted, 15)}`);
};

/* keep some examples back, or you are marking your own homework */
DIAGRAMS.trainTestSplit = () => {
  const card = (x, y, c) => `<rect x="${x}" y="${y}" width="24" height="20" rx="3" fill="#fff" stroke="${c}" stroke-width="2.2"/>`;
  return S(400, 236, `
    ${tx(200, 20, "60 photos you collected", C.ink, 13.5, 700)}
    ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => card(60 + i * 36, 32, C.muted)).join("")}
    ${arrow(140, 60, 96, 84, C.blue)}${arrow(260, 60, 304, 84, C.teal)}
    ${box(14, 90, 164, 52, C.blue, "48 for training", "the model sees the answers")}
    ${box(222, 90, 164, 52, C.teal, "12 held back", "the model never sees these")}
    ${[0, 1, 2, 3, 4].map(i => card(26 + i * 32, 150, C.blue)).join("")}
    ${[0, 1].map(i => card(254 + i * 32, 150, C.teal)).join("")}
    ${arrow(96, 182, 96, 200, C.blue)}${arrow(304, 182, 304, 200, C.teal)}
    ${tx(96, 218, "it learns", C.blue, 12.5, 700)}
    ${tx(304, 218, "you mark it", C.teal, 12.5, 700)}
    ${hand(200, 180, "testing on photos it", C.red, 16)}
    ${hand(200, 198, "already saw is cheating", C.red, 16)}`);
};

/* where a model trained on one kind of face or fruit quietly fails */
DIAGRAMS.biasFunnel = () => S(400, 236, `
  ${tx(14, 18, "What went in", C.ink, 12.5, 700, "start")}
  ${box(14, 26, 180, 34, C.blue, "ripe yellow bananas")}
  ${box(14, 68, 180, 34, C.blue, "one room, one lamp")}
  ${box(14, 110, 180, 34, C.blue, "one pair of hands")}
  ${arrow(198, 85, 224, 85, C.purple)}
  ${box(228, 62, 88, 46, C.purple, "the model")}
  ${arrow(320, 85, 346, 85, C.green)}
  ${tx(372, 80, "works", C.green, 12.5, 700)}
  ${tx(372, 97, "here", C.green, 12.5, 700)}
  ${line(14, 162, 386, 162, C.muted, 1.4, "5 5")}
  ${tx(14, 186, "What it has never seen", C.red, 12.5, 700, "start")}
  ${box(14, 194, 118, 32, C.red, "a green banana")}
  ${box(140, 194, 112, 32, C.red, "a dim room")}
  ${box(260, 194, 126, 32, C.red, "somebody else")}
  ${hand(300, 142, "nobody chose to leave", C.orange, 16)}
  ${hand(300, 158, "these out. They just did.", C.orange, 16)}`);

/* one honest number: how many of the held-back photos it got right */
DIAGRAMS.accuracyCount = () => {
  const tick = (x, y) => `${poly([[x, y + 6], [x + 5, y + 11], [x + 13, y - 2]], C.green, 2.8)}`;
  const cross = (x, y) => `${line(x, y - 2, x + 12, y + 10, C.red, 2.8)}${line(x + 12, y - 2, x, y + 10, C.red, 2.8)}`;
  const marks = Array.from({ length: 12 }, (_, i) => {
    const x = 32 + (i % 6) * 60, y = 72 + Math.floor(i / 6) * 46;
    return i < 10 ? tick(x, y) : cross(x, y);
  }).join("");
  return S(400, 236, `
    ${tx(200, 28, "the 12 photos it had never seen", C.ink, 13.5, 700)}
    ${marks}
    ${line(20, 160, 380, 160, C.muted, 1.6)}
    ${tx(200, 192, "10 right out of 12", C.ink, 20, 700)}
    ${tx(200, 214, "accuracy = 10 ÷ 12 = 83%", C.purple, 14, 700)}
    ${hand(200, 234, "write it down before you change anything", C.orange, 16)}`);
};
