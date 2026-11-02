/* Hand-drawn wiring diagrams for the club decks.

   One canvas (560 x 300) so every wiring slide looks the same size.

   Wires run at right angles, like a real wiring drawing, and are coloured
   by what they carry:

     red     5V / VCC / battery +
     black   GND
     blue    a signal the Arduino sends
     green   a signal the Arduino reads
     purple  switched power (motor outputs)
     orange  a second clock or supply

   A filled dot means two wires are joined. Wires that cross without a dot
   are not connected, which is the convention on every real schematic and
   worth pointing out to students once.

   Components are built with comp(), which reserves a header band for the
   name and then lays the pins out below it at a fixed pitch, so a label can
   never land on top of a title. comp() hands back the exact coordinate of
   every port, and the wires are drawn from those, not from numbers typed
   in by hand.

   CIRCUITS.name -> an <svg> string.  Use with { t: "circuit", name: "..." }
*/

const W = {
  pwr: "#E0414B", gnd: "#262D47", out: "#2E6BE6",
  in: "#1DA14E", mot: "#7B3FC4", aux: "#E8591F",
};
const INK = "#262D47", MUTED = "#8A94A6";

const S = body => `<svg class="fig" viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg">
  <g filter="url(#rai-rough)" fill="none" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;

const wire = (pts, c, w = 2.5) => `<path d="M${pts.map(p => p.join(" ")).join("L")}" stroke="${c}" stroke-width="${w}"/>`;
/* horizontal, vertical, horizontal: never a diagonal on a wiring drawing */
const elbow = (a, b, x, c, w = 2.5) => wire([a, [x, a[1]], [x, b[1]], b], c, w);

const dot = (x, y, c) => `<circle cx="${x}" cy="${y}" r="4" fill="${c}" stroke="${c}" stroke-width="1.4"/>`;

/* Patrick Hand, a little smaller than the Caveat these were laid out in */
const note = (x, y, s, c = "#E4572E", size = 16, anchor = "middle") =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Deck Hand"
    font-size="${(size * 0.84).toFixed(1)}" fill="${c}" stroke="none">${s}</text>`;

const lbl = (x, y, s, c = MUTED, size = 11, anchor = "middle", weight = 700) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Deck Body" font-weight="${weight}"
    font-size="${size}" fill="${c}" stroke="none">${s}</text>`;

const motor = (cx, cy, r = 20) => `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${W.aux}" stroke-width="2.8"/>
  <text x="${cx}" y="${cy + 7}" text-anchor="middle" font-family="Deck Display" font-weight="800"
    font-size="18" fill="${W.aux}" stroke="none">M</text>`;

/* ---- the component builder ----
   left / right are arrays of [label, colour]. A null entry leaves a gap,
   which is how the power pins are kept clear of the signal pins. */
const PITCH = 20;
function comp(x, y, w, name, sub, colour, { left = [], right = [], fill = "#fff", minH = 0 } = {}) {
  const head = sub ? 46 : 30;
  const rows = Math.max(left.length, right.length);
  const h = Math.max(minH, head + rows * PITCH + 10);
  const top = y + head + PITCH / 2;

  const svg = [`
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${fill}" stroke="${colour}" stroke-width="2.8"/>
    <text x="${x + w / 2}" y="${y + 21}" text-anchor="middle" font-family="Deck Display"
      font-weight="700" font-size="15" fill="${colour}" stroke="none">${name}</text>
    ${sub ? `<text x="${x + w / 2}" y="${y + 37}" text-anchor="middle" font-family="Deck Body"
      font-size="11.5" fill="${MUTED}" stroke="none">${sub}</text>` : ""}`];

  const port = (side, i, entry) => {
    if (!entry) return null;
    const [label, c = INK] = entry;
    const px = side === "L" ? x : x + w, py = top + i * PITCH;
    svg.push(`<circle cx="${px}" cy="${py}" r="3.2" fill="${c}" stroke="${c}" stroke-width="1.4"/>
      <text x="${side === "L" ? px + 9 : px - 9}" y="${py + 4}" text-anchor="${side === "L" ? "start" : "end"}"
        font-family="Deck Body" font-weight="700" font-size="10.5" fill="${INK}" stroke="none">${label}</text>`);
    return [px, py];
  };

  const L = left.map((e, i) => port("L", i, e));
  const R = right.map((e, i) => port("R", i, e));
  return { svg: svg.join(""), L, R, x, y, w, h, bottom: y + h, right: x + w };
}

const CIRCUITS = {};

/* ================= EF-10 ================= */

/* Four rails: the power pair along the top, the bus pair along the bottom,
   modules between them, so every module wire is a short straight drop. */
CIRCUITS.i2c = () => {
  const R = { v: 44, g: 68, sda: 242, scl: 266 };
  const uno = comp(16, 104, 124, "Arduino", "Uno", "#0E8A86", {
    right: [["5V", W.pwr], ["GND", W.gnd], ["A4", W.out], ["A5", W.aux]],
  });

  const modul = (x, name, addr, c) => {
    const o = comp(x, 112, 104, name, addr, c, { minH: 72 });
    const px = [x + 20, x + 44, x + 66, x + 88];
    return o.svg + `
      ${lbl(px[0], 106, "VCC", W.pwr, 9.5)}${lbl(px[1], 106, "GND", W.gnd, 9.5)}
      ${lbl(px[2], 200, "SDA", W.out, 9.5)}${lbl(px[3], 200, "SCL", W.aux, 9.5)}
      ${wire([[px[0], 112], [px[0], R.v]], W.pwr)}${dot(px[0], R.v, W.pwr)}
      ${wire([[px[1], 112], [px[1], R.g]], W.gnd)}${dot(px[1], R.g, W.gnd)}
      ${wire([[px[2], o.bottom], [px[2], R.sda]], W.out)}${dot(px[2], R.sda, W.out)}
      ${wire([[px[3], o.bottom], [px[3], R.scl]], W.aux)}${dot(px[3], R.scl, W.aux)}`;
  };

  return S(`
    ${wire([[192, R.v], [530, R.v]], W.pwr)}${lbl(540, R.v + 4, "5V", W.pwr, 10.5, "start")}
    ${wire([[210, R.g], [530, R.g]], W.gnd)}${lbl(540, R.g + 4, "GND", W.gnd, 10.5, "start")}
    ${wire([[228, R.sda], [530, R.sda]], W.out)}${lbl(540, R.sda + 4, "SDA", W.out, 10.5, "start")}
    ${wire([[246, R.scl], [530, R.scl]], W.aux)}${lbl(540, R.scl + 4, "SCL", W.aux, 10.5, "start")}

    ${uno.svg}
    ${wire([uno.R[0], [192, uno.R[0][1]], [192, R.v]], W.pwr)}
    ${wire([uno.R[1], [210, uno.R[1][1]], [210, R.g]], W.gnd)}
    ${wire([uno.R[2], [228, uno.R[2][1]], [228, R.sda]], W.out)}
    ${wire([uno.R[3], [246, uno.R[3][1]], [246, R.scl]], W.aux)}

    ${modul(288, "OLED", "0x3C", "#2E6BE6")}
    ${modul(416, "MPU6050", "0x68", "#7B3FC4")}

    ${note(192, 24, "one set of wires, shared by every module", "#E4572E", 17, "start")}
    ${note(272, 294, "a filled dot means joined; crossing without one means not joined", MUTED, 15)}`);
};

CIRCUITS.uart = () => {
  const a = comp(30, 86, 152, "Arduino A", "sender", "#2E6BE6", {
    right: [["11 TX", W.out], ["10 RX", W.in], null, ["GND", W.gnd]],
  });
  const b = comp(378, 86, 152, "Arduino B", "receiver", "#1DA14E", {
    left: [["11 TX", W.in], ["10 RX", W.out], null, ["GND", W.gnd]],
  });
  return S(`
    ${a.svg}${b.svg}
    ${wire([a.R[0], [256, a.R[0][1]], [256, b.L[1][1]], b.L[1]], W.out)}
    ${wire([a.R[1], [222, a.R[1][1]], [222, 62], [352, 62], [352, b.L[0][1]], b.L[0]], W.in)}
    ${wire([a.R[3], [280, a.R[3][1]], [280, 258], [454, 258], [454, b.L[3][1]], b.L[3]], W.gnd)}
    ${note(280, 40, "TX always goes to RX. Never TX to TX.", "#E4572E", 17)}
    ${lbl(280, 284, "and a third wire joins the two grounds", MUTED, 12, "middle", 400)}`);
};

/* ================= ROB-05 ================= */

CIRCUITS.robotCar = () => {
  const uno = comp(14, 42, 112, "Arduino", "Uno", "#0E8A86", {
    right: [["GND", W.gnd], null, ["7", W.out], ["8", W.out], ["9", W.out],
            ["11", W.out], ["5", W.out], ["6", W.out]],
  });
  const drv = comp(242, 42, 140, "L298N", "motor driver", "#1DA14E", {
    left: [["GND", W.gnd], ["+12V", W.pwr], ["IN1", W.out], ["IN2", W.out], ["IN3", W.out],
           ["IN4", W.out], ["ENA", W.out], ["ENB", W.out]],
    right: [null, ["OUT1/2", W.mot], null, null, ["OUT3/4", W.mot]],
  });
  const bat = comp(392, 236, 140, "4 x AA", "6 V", "#E0414B", { fill: "#FFF3F3", minH: 50 });

  const sig = [2, 3, 4, 5, 6, 7].map(i =>
    wire([uno.R[i], drv.L[i]], W.out, 2.3)).join("");

  return S(`
    ${uno.svg}${drv.svg}${bat.svg}
    ${sig}
    ${wire([uno.R[0], [182, uno.R[0][1]], [182, 274], [218, 274], [218, drv.L[0][1]], drv.L[0]], W.gnd)}
    ${wire([[392, 261], [348, 261], [348, 28], [204, 28], [204, drv.L[1][1]], drv.L[1]], W.pwr)}
    ${wire([[532, 261], [546, 261], [546, 292], [160, 292], [160, 274], [218, 274]], W.gnd)}
    ${dot(218, 274, W.gnd)}
    ${motor(452, drv.R[1][1])}${motor(452, drv.R[4][1])}
    ${wire([drv.R[1], [432, drv.R[1][1]]], W.mot)}
    ${wire([drv.R[4], [432, drv.R[4][1]]], W.mot)}
    ${lbl(452, drv.R[1][1] - 28, "left", MUTED, 10.5, "middle", 400)}
    ${lbl(452, drv.R[4][1] + 34, "right", MUTED, 10.5, "middle", 400)}
    ${note(200, 20, "the motors run on the battery, never on the Uno", "#E4572E", 16, "start")}
    ${note(90, 268, "one ground for", W.gnd, 15)}${note(90, 286, "the whole robot", W.gnd, 15)}`);
};

/* ================= ROB-06 ================= */

CIRCUITS.servo = () => {
  const uno = comp(50, 92, 150, "Arduino", "Uno", "#0E8A86", {
    right: [["5V", W.pwr], ["GND", W.gnd], ["pin 9", W.out]], minH: 118,
  });
  const sv = comp(372, 92, 148, "SG90", "micro servo", "#0E8A86", {
    left: [["red", W.pwr], ["brown", W.gnd], ["orange", W.out]], minH: 118,
  });
  return S(`
    ${uno.svg}${sv.svg}
    ${wire([uno.R[0], sv.L[0]], W.pwr)}
    ${wire([uno.R[1], sv.L[1]], W.gnd)}
    ${wire([uno.R[2], sv.L[2]], W.out)}
    ${note(284, 62, "three wires, and the colours tell you which is which", "#E4572E", 17)}
    ${lbl(284, 250, "pin 9 must be a PWM pin: 3, 5, 6, 9, 10 or 11", W.out, 12.5)}
    ${note(284, 282, "two or more servos need their own 5 V supply", W.pwr, 16)}`);
};

CIRCUITS.stepper = () => {
  const uno = comp(16, 52, 112, "Arduino", "Uno", "#0E8A86", {
    right: [["GND", W.gnd], null, ["8", W.out], ["9", W.out], ["10", W.out], ["11", W.out]],
  });
  const drv = comp(234, 52, 142, "ULN2003", "driver board", "#7B3FC4", {
    left: [["GND", W.gnd], ["5V", W.pwr], ["IN1", W.out], ["IN2", W.out], ["IN3", W.out], ["IN4", W.out]],
    right: [null, null, null, ["plug", W.mot]],
  });
  const mot = comp(430, 96, 108, "28BYJ-48", "stepper", "#E8591F", { minH: 86 });
  const psu = comp(284, 232, 148, "5 V supply", "not the Uno", "#E0414B", { fill: "#FFF3F3", minH: 50 });
  const sig = [2, 3, 4, 5].map(i => wire([uno.R[i], drv.L[i]], W.out, 2.3)).join("");
  return S(`
    ${uno.svg}${drv.svg}${mot.svg}${psu.svg}
    ${sig}
    ${wire([uno.R[0], [172, uno.R[0][1]], [172, 266], [210, 266], [210, drv.L[0][1]], drv.L[0]], W.gnd)}
    ${wire([[284, 257], [258, 257], [258, 32], [196, 32], [196, drv.L[1][1]], drv.L[1]], W.pwr)}
    ${wire([[432, 257], [470, 257], [470, 292], [150, 292], [150, 266], [210, 266]], W.gnd)}
    ${dot(210, 266, W.gnd)}
    ${wire([drv.R[3], [430, drv.R[3][1]]], W.mot)}
    ${note(190, 22, "wired 8, 9, 10, 11; the Stepper library lists them 8, 10, 9, 11", "#E4572E", 16, "start")}
    ${note(484, 210, "2048 steps = one turn", W.mot, 15)}`);
};

/* ================= ROB-07 ================= */

CIRCUITS.encoder = () => {
  const uno = comp(18, 80, 120, "Arduino", "Uno", "#0E8A86", {
    right: [["5V", W.pwr], ["GND", W.gnd], ["pin 2", W.in]], minH: 112,
  });
  const sen = comp(250, 80, 144, "LM393", "IR speed sensor", "#1DA14E", {
    left: [["VCC", W.pwr], ["GND", W.gnd], ["OUT", W.in]], minH: 112,
  });
  const spokes = Array.from({ length: 20 }, (_, i) => {
    if (i % 2) return "";
    const a = i * Math.PI / 10;
    return wire([[474 + 28 * Math.cos(a), 136 + 28 * Math.sin(a)],
                 [474 + 48 * Math.cos(a), 136 + 48 * Math.sin(a)]], INK, 4.5);
  }).join("");
  return S(`
    ${uno.svg}${sen.svg}
    ${wire([uno.R[0], sen.L[0]], W.pwr)}
    ${wire([uno.R[1], sen.L[1]], W.gnd)}
    ${wire([uno.R[2], sen.L[2]], W.in)}
    <circle cx="474" cy="136" r="52" fill="#fff" stroke="${INK}" stroke-width="2.8"/>
    <circle cx="474" cy="136" r="10" fill="${INK}" stroke="${INK}" stroke-width="2"/>
    ${spokes}
    ${wire([[394, 136], [416, 136]], MUTED, 2)}
    ${lbl(474, 210, "slotted disc on the axle", MUTED, 11.5, "middle", 400)}
    ${note(260, 48, "the disc chops the beam: one slot past = one tick", "#E4572E", 17)}
    ${lbl(250, 252, "pin 2 and pin 3 are the only interrupt pins on an Uno", W.in, 12)}
    ${lbl(250, 278, "the motors and driver stay wired exactly as in ROB-05", MUTED, 11.5, "middle", 400)}`);
};

/* ================= ROB-10 ================= */

CIRCUITS.balance = () => {
  const uno = comp(14, 56, 116, "Arduino", "Uno", "#0E8A86", {
    right: [["5V", W.pwr], ["GND", W.gnd], ["A4", W.out], ["A5", W.aux], null,
            ["7,8,9,11", W.out], ["5,6", W.out]],
  });
  const imu = comp(252, 30, 128, "MPU6050", "tilt · 0x68", "#7B3FC4", {
    left: [["VCC", W.pwr], ["SDA", W.out], ["SCL", W.aux]],
  });
  const drv = comp(252, 150, 128, "L298N", "driver", "#1DA14E", {
    left: [["+12V", W.pwr], ["GND", W.gnd], ["IN1-IN4", W.out], ["ENA ENB", W.out]],
    right: [null, ["OUT1/2", W.mot], ["OUT3/4", W.mot]],
  });
  const cell = comp(424, 32, 116, "2 × 18650", "7.4 V", "#E0414B", { fill: "#FFF3F3", minH: 50 });
  return S(`
    ${uno.svg}${imu.svg}${drv.svg}${cell.svg}
    ${elbow(uno.R[0], imu.L[0], 190, W.pwr)}
    ${elbow(uno.R[2], imu.L[1], 212, W.out)}
    ${elbow(uno.R[3], imu.L[2], 232, W.aux)}
    ${elbow(uno.R[5], drv.L[2], 196, W.out, 2.3)}
    ${elbow(uno.R[6], drv.L[3], 212, W.out, 2.3)}
    ${wire([uno.R[1], [186, uno.R[1][1]], [186, 282], [228, 282], [228, drv.L[1][1]], drv.L[1]], W.gnd)}
    ${wire([[424, 57], [402, 57], [402, 136], [176, 136], [176, 112], [252, 112]], W.pwr)}
    ${wire([[540, 57], [552, 57], [552, 292], [206, 292], [206, 282], [228, 282]], W.gnd)}
    ${dot(228, 282, W.gnd)}
    ${wire([drv.L[0], [240, drv.L[0][1]], [240, 112]], W.pwr)}
    ${motor(476, 192)}${motor(476, 258)}
    ${elbow(drv.R[1], [456, 192], 428, W.mot)}
    ${elbow(drv.R[2], [456, 258], 414, W.mot)}
    ${lbl(476, 164, "left", MUTED, 10.5, "middle", 400)}
    ${lbl(476, 290, "right", MUTED, 10.5, "middle", 400)}
    ${note(300, 20, "the IMU is I2C, exactly as in EF-10", "#E4572E", 16)}
    ${note(90, 264, "the cell goes", "#E4572E", 15)}
    ${note(90, 280, "high up: a tall robot", "#E4572E", 15)}
    ${note(90, 296, "balances more easily", "#E4572E", 15)}`);
};

module.exports = { CIRCUITS, W };
