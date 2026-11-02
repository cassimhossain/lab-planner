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

module.exports = { DIAGRAMS, C };
