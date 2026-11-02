const { titleSlide, divider, objectives, check } = require("../lib.js");
const ART = require("../art.js");
const { DIAGRAMS } = require("../diagrams.js");

module.exports = {
  code: "EF-10",
  title: "Talking Chips: I2C, UART and SPI",
  series: "Engineering Foundations",
  accent: "orange",
  slides: [

    titleSlide({
      series: "Engineering Foundations · Programming Robots",
      main: "Talking Chips", accentWords: ["Chips"],
      hook: "I2C, UART and SPI: how the parts of a robot pass messages to each other",
      pills: ["60 minutes", "Pairs", "Circuit Lab or real kit"],
      fig: DIAGRAMS.i2cBus(),
      note: "I2C was invented at Philips in 1982 so the chips inside a television could share two wires instead of dozens. The same two wires are in your robot.",
    }),

    { tag: "LEARN", kicker: "Let's think", title: "How do two chips agree on anything?",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.1fr 1fr;gap:22px;height:100%">
        <div class="stack">
          <div class="box fill c-blue"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>The problem</h3>
            <p>An Arduino has <strong>20 pins</strong>. A robot can easily have a screen, a motion sensor, a clock, an SD card and a radio. That is already more than 20 wires.</p>
            <p style="margin-top:6px">So the chips have to <strong>share</strong> wires. And the moment two things share a wire, they need rules: who speaks, who listens, how fast, and how you know a message ended.</p></div></div>
          <div class="note"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>That set of rules is called a protocol</b><span>Urdu, English and Morse code are all protocols. So are I2C, UART and SPI. The wires are just wires. The protocol is the agreement.</span></div></div>
        </div>
        <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Guess first</h3>
          <ul style="margin:6px 0 0 18px;line-height:1.75">
            <li>How few wires could carry a whole sentence?</li>
            <li>If both chips talk at once, what happens?</li>
            <li>How does a chip know a message is <em>for it</em>?</li>
          </ul>
          <p style="margin-top:10px;color:#8A94A6">Write your three answers down. We will come back to them at the end of the lesson.</p></div></div></div>` }] },

    objectives([
      { t: "Explain what **serial** communication is, and why robots use it", icon: "chat", color: "teal" },
      { t: "Put **two I2C devices** on the same two wires and find their addresses", icon: "chip", color: "blue" },
      { t: "Send data between **two boards over UART**", icon: "network", color: "orange" },
      { t: "Choose **I2C, UART or SPI** for a job and say why", icon: "scales", color: "purple" },
    ], "serial · parallel · bus · address · SDA · SCL · TX · RX · baud rate · master · device · clock"),

    { tag: "LEARN", kicker: "Objective 1 · The big idea", title: "Serial: one wire, one bit at a time",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;height:100%">
        <div class="box fill c-teal"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Parallel</h3>
          <p>Eight wires carry eight bits at the same instant. Fast, but it costs eight pins, eight tracks on the board and eight chances of a bad joint.</p>
          <p style="margin-top:8px">This is how the old printer cables worked. Look at the back of an old PC and you will see the enormous plug.</p></div></div>
        <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Serial</h3>
          <p>One wire carries the same eight bits <strong>one after another</strong>, very quickly. It costs one pin instead of eight.</p>
          <p style="margin-top:8px">Nearly everything modern is serial: USB, HDMI, Ethernet, SATA. Fewer wires turned out to be worth more than doing it all at once.</p></div></div>
        <div class="note teal" style="grid-column:1/3"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Why serial won</b><span>A single wire can be driven faster and more cleanly than eight wires that must all arrive at the same nanosecond. Simplicity beat brute force.</span></div></div></div>` }] },

    { tag: "LEARN", kicker: "Objective 2 · I2C", title: "Two wires, many devices",
      bodyStyle: "display:grid;grid-template-columns:1.25fr 1fr;gap:22px",
      blocks: [
        { t: "figbox", name: "i2cBus", color: "blue", h: "One bus, one address each", style: "min-height:0" },
        { t: "html", html: `<div class="stack">
          <div class="box fill c-teal"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>SDA: the data</h3>
            <p>One wire carries every bit of every message, in both directions, for every device on the bus.</p></div></div>
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>SCL: the clock</h3>
            <p>The master ticks this line. A bit is only read on a tick, so the two sides can never lose their place.</p></div></div>
          <div class="note"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Pull-ups</b><span>Both lines idle HIGH through a resistor. Devices can only pull them down, never push them up, so two devices talking at once cannot damage each other.</span></div></div>
        </div>` },
      ] },

    { tag: "LEARN", kicker: "Objective 2 · I2C", title: "An address is a house number",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;height:100%">
        <div class="stack">
          <div class="box fill c-green"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>How it works</h3>
            <p>The Arduino shouts an <strong>address</strong> onto the bus. Every device hears it. Only the device with that address answers. The rest stay quiet.</p>
            <p style="margin-top:8px">An address is 7 bits, so there is room for 112 usable devices on one pair of wires.</p></div></div>
          <div class="box fill c-red"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Addresses in our kit</h3>
            <p><strong>0x3C</strong> OLED screen · <strong>0x68</strong> MPU6050 motion sensor · <strong>0x27</strong> LCD backpack · <strong>0x57</strong> heart rate sensor</p>
            <p style="margin-top:8px">Two devices with the <strong>same</strong> address on one bus will clash. Many boards have a solder jumper that shifts the address by one.</p></div></div>
        </div>
        <div class="stack">
          <div class="box fill c-purple"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Why hexadecimal?</h3>
            <p>0x3C is just 60 written in base 16. Datasheets use hex because one hex digit is exactly four bits, so <code>0x3C</code> reads straight off as <code>0011 1100</code>.</p></div></div>
          <div class="note"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Blank screen?</b><span>Nine times out of ten it is the wrong address. Run the scanner sketch and it will tell you what is really on the bus.</span></div></div>
        </div></div>` }] },

    { tag: "LEARN", kicker: "Objective 3 · UART", title: "Two boards, one wire each way",
      bodyStyle: "display:grid;grid-template-columns:1.25fr 1fr;gap:22px",
      blocks: [
        { t: "figbox", name: "uartCross", color: "orange", h: "TX of one goes to RX of the other", style: "min-height:0" },
        { t: "html", html: `<div class="stack">
          <div class="box fill c-blue"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>No clock wire</h3>
            <p>UART has no SCL. Instead both boards agree a <strong>baud rate</strong> in advance and each counts its own time.</p></div></div>
          <div class="box fill c-red"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Only two devices</h3>
            <p>There are no addresses, so a UART link joins exactly two boards. For a third you need another pair of pins.</p></div></div>
          <div class="note"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Gibberish, not silence</b><span>Wrong baud gives you nonsense characters. Wrong wiring gives you nothing at all. The symptom tells you which fault you have.</span></div></div>
        </div>` },
      ] },

    { tag: "LEARN", kicker: "Objective 4 · SPI", title: "Fast, but hungry for pins",
      bodyStyle: "display:grid;grid-template-columns:1.25fr 1fr;gap:22px",
      blocks: [
        { t: "figbox", name: "spiLines", color: "purple", h: "Four wires, plus a chip select each", style: "min-height:0" },
        { t: "html", html: `<div class="stack">
          <div class="box fill c-green"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Full duplex</h3>
            <p>MOSI and MISO are separate wires, so data goes both ways at the same moment. I2C and UART cannot do that.</p></div></div>
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>The cost</h3>
            <p>Three shared wires plus <strong>one more pin for every device</strong>. Four SPI devices on an Uno is already most of your pins.</p></div></div>
          <div class="note teal"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>How fast?</b><span>An Uno clocks SPI at up to 8 MHz. That is about 20 times quicker than standard I2C.</span></div></div>
        </div>` },
      ] },

    { tag: "LEARN", kicker: "Objective 4 · Choosing", title: "Three languages, three jobs",
      blocks: [
        { t: "table", color: "teal", cols: ["", "UART", "I2C", "SPI"], rows: [
          ["Wires", "2 (TX, RX)", "2 (SDA, SCL)", "4 (+1 per device)"],
          ["How many devices", "Just 2", "Up to 112, by address", "As many as you have CS pins"],
          ["Typical speed", "9.6 kbit/s to 115 kbit/s", "100 to 400 kbit/s", "8 Mbit/s and up"],
          ["Needs a clock wire", "No, both agree a baud rate", "Yes, SCL", "Yes, SCK"],
          ["Best for", "Board to board, GPS, Bluetooth", "Screens, sensors, clocks", "SD cards, big displays, radio"],
          ["On an Uno", "pins 0 and 1", "A4 = SDA, A5 = SCL", "11, 12, 13 + a CS pin"],
        ] },
        { t: "stripe", color: "green", l: "Rule of thumb:", text: "A few slow devices sharing wires? **I2C**. Two boards chatting? **UART**. Something fast, like an SD card? **SPI**." },
      ] },

    { tag: "LEARN", kicker: "In the real world", title: "You are surrounded by these three",
      blocks: [{ t: "html", html: `<div class="cols c3" style="flex:1 1 auto;min-height:0;display:grid;gap:18px">
        <div class="box fill c-blue"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>I2C</h3>
          <p>The digital scale at a kiryana shop: load cell amplifier, display and clock all on one pair of wires inside a cheap plastic case.</p></div></div>
        <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>UART</h3>
          <p>A GPS module in a delivery bike tracker. It simply talks, once a second, down one wire, whether anybody is listening or not.</p></div></div>
        <div class="box fill c-purple"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>SPI</h3>
          <p>The LED matrix boards on Jinnah Avenue. Thousands of pixels need refreshing many times a second, which only SPI can keep up with.</p></div></div></div>` }] },

    divider({
      part: "Part 2 · Make it", main: "Now let's put it to work",
      sub: "Two devices on one pair of wires, then two boards talking to each other.",
      pills: ["30 minutes", "Pairs", "Circuit Lab or real kit"],
      art: ART.svg("breadboard"),
    }),

    { tag: "MAKE", kicker: "Class game", title: "Be the bus",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.1fr 1fr;gap:22px;height:100%">
        <div class="box fill c-green"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>How to play</h3>
          <ol style="margin:6px 0 0 19px;line-height:1.8">
            <li>Everyone gets a sticky note with a number. That is your address.</li>
            <li>The teacher is the master and calls one number, then a message.</li>
            <li>Only that student may answer. Everybody else stays silent.</li>
            <li>Now give two students the <strong>same</strong> number and call it.</li>
          </ol></div></div>
        <div class="stack">
          <div class="box fill c-red"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>What you just felt</h3>
            <p>Two people answering at once is an <strong>address clash</strong>. Neither message gets through. On a real bus you see nonsense, or nothing at all.</p></div></div>
          <div class="note"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Round two</b><span>Now the teacher claps a steady beat and you may only speak on a clap. That clap is SCL, the clock.</span></div></div>
        </div></div>` }] },

    { tag: "MAKE", kicker: "Before you wire", title: "What you need",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;height:100%">
        <div class="box fill c-teal"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Kit, per pair</h3>
          <ul style="margin:6px 0 0 18px;line-height:1.8">
            <li>Arduino Uno + USB cable (×2 for the UART step)</li>
            <li>OLED 128×64 I2C display</li>
            <li>MPU6050 motion sensor</li>
            <li>Breadboard and jumper wires</li>
          </ul></div></div>
        <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Wiring, every time</h3>
          <p><strong>SDA → A4 · SCL → A5 · VCC → 5V · GND → GND</strong></p>
          <p style="margin-top:8px">Both I2C devices go to the <em>same</em> four rails. That is the whole point: you are not giving each one its own pins.</p>
          <p style="margin-top:8px;color:#8A94A6">Check GND first, before power. A missing ground is the single commonest fault in this lesson.</p></div></div></div>` }] },

    { tag: "MAKE", kicker: "Wiring · I2C", title: "Wire it once, wire it right",
      bodyStyle: "display:grid;grid-template-columns:1.25fr 1fr;gap:20px",
      blocks: [
        { t: "circuit", name: "i2c", color: "blue", h: "Two I2C modules on one Arduino", style: "min-height:0" },
        { t: "conn", color: "teal", h: "Connections", from: "Arduino Uno", to: "Both modules", why: "Carries",
          rows: [
            { w: "pwr", a: "5V", b: "VCC", c: "power for both modules" },
            { w: "gnd", a: "GND", b: "GND", c: "the shared reference" },
            { w: "out", a: "A4", b: "SDA", c: "data, both directions" },
            { w: "aux", a: "A5", b: "SCL", c: "the clock, from the Uno" },
          ],
          foot: "Four wires total, not eight. Both modules land on the same four rails." },
      ] },

    { tag: "MAKE", kicker: "Wiring · UART", title: "Two boards, crossed over",
      bodyStyle: "display:grid;grid-template-columns:1.25fr 1fr;gap:20px",
      blocks: [
        { t: "circuit", name: "uart", color: "orange", h: "SoftwareSerial on pins 10 and 11", style: "min-height:0" },
        { t: "conn", color: "orange", h: "Connections", from: "Board A", to: "Board B", why: "Carries",
          rows: [
            { w: "out", a: "pin 11 TX", b: "pin 10 RX", c: "A talking to B" },
            { w: "in", a: "pin 10 RX", b: "pin 11 TX", c: "B talking to A" },
            { w: "gnd", a: "GND", b: "GND", c: "the shared reference" },
          ],
          foot: "TX to TX is the classic mistake. Both boards shout, neither listens." },
      ] },

    { tag: "MAKE", kicker: "Build step 1 of 3", title: "Who is on the bus?",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1.05fr;gap:22px;height:100%">
        <div class="stack">
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Do this</h3>
            <ol style="margin:4px 0 0 19px;line-height:1.7">
              <li>Wire both devices to A4 and A5, plus 5V and GND.</li>
              <li>Upload the scanner sketch.</li>
              <li>Open the <strong>Serial Monitor</strong> at 9600.</li>
              <li>Write down every address it finds.</li></ol></div></div>
          <div class="note"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Tip</b><span>Nothing found? Swap SDA and SCL. Getting them the wrong way round is the commonest wiring slip of the whole lesson.</span></div></div>
        </div>
        <div class="code" style="align-self:start">#include &lt;Wire.h&gt;

<span class="kw">void</span> setup() {
  Wire.begin();
  Serial.begin(<span class="st">9600</span>);
  Serial.println(<span class="st">"Scanning..."</span>);
  <span class="kw">for</span> (<span class="kw">byte</span> a = 1; a &lt; 127; a++) {
    Wire.beginTransmission(a);
    <span class="kw">if</span> (Wire.endTransmission() == 0) {
      Serial.print(<span class="st">"Found 0x"</span>);
      Serial.println(a, HEX);   <span class="cm">// a device answered</span>
    }
  }
}

<span class="kw">void</span> loop() {}</div></div>` }] },

    { tag: "MAKE", kicker: "Build step 2 of 3", title: "Both devices, one sketch",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1.05fr;gap:22px;height:100%">
        <div class="stack">
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Do this</h3>
            <ol style="margin:4px 0 0 19px;line-height:1.7">
              <li>Read the tilt from the <strong>MPU6050</strong> at 0x68.</li>
              <li>Print it on the <strong>OLED</strong> at 0x3C.</li>
              <li>Tilt the breadboard. The number should follow.</li>
              <li>Unplug <strong>one</strong> device. What happens to the other?</li></ol></div></div>
          <div class="box fill c-purple"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Notice</h3>
            <p>Two libraries, two addresses, <strong>one pair of wires</strong>. Neither device knows the other is there.</p></div></div>
        </div>
        <div class="code" style="align-self:start">#include &lt;Wire.h&gt;
#include &lt;Adafruit_SSD1306.h&gt;
Adafruit_SSD1306 oled(128, 64, &amp;Wire, -1);

<span class="kw">void</span> setup() {
  Wire.begin();
  oled.begin(SSD1306_SWITCHCAPVCC, <span class="st">0x3C</span>);
  Wire.beginTransmission(<span class="st">0x68</span>);   <span class="cm">// wake the MPU6050</span>
  Wire.write(<span class="st">0x6B</span>); Wire.write(0);
  Wire.endTransmission();
}

<span class="kw">void</span> loop() {
  Wire.beginTransmission(<span class="st">0x68</span>);
  Wire.write(<span class="st">0x3B</span>); Wire.endTransmission(<span class="kw">false</span>);
  Wire.requestFrom(<span class="st">0x68</span>, 6);
  <span class="kw">int</span> x = Wire.read() &lt;&lt; 8 | Wire.read();
  oled.clearDisplay(); oled.setCursor(0, 0);
  oled.print(<span class="st">"Tilt: "</span>); oled.print(x / 1600);
  oled.display(); delay(100);
}</div></div>` }] },

    { tag: "MAKE", kicker: "Build step 3 of 3", title: "Two boards, one conversation",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1.05fr;gap:22px;height:100%">
        <div class="stack">
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Do this</h3>
            <ol style="margin:4px 0 0 19px;line-height:1.7">
              <li><strong>TX of board A → RX of board B</strong>, and back the other way.</li>
              <li>Join the two <strong>GND</strong> pins. This is not optional.</li>
              <li>Send a number when a button is pressed.</li>
              <li>Light an LED on the other board when it arrives.</li></ol></div></div>
          <div class="note"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Gibberish on screen?</b><span>The two boards disagree about baud rate. Both must say 9600. Garbage means wrong speed; silence means wrong wiring.</span></div></div>
        </div>
        <div class="code" style="align-self:start"><span class="cm">// Board A: sender</span>
#include &lt;SoftwareSerial.h&gt;
SoftwareSerial link(10, 11);  <span class="cm">// RX, TX</span>

<span class="kw">void</span> setup() {
  link.begin(<span class="st">9600</span>);
  pinMode(2, INPUT_PULLUP);
}

<span class="kw">void</span> loop() {
  <span class="kw">if</span> (digitalRead(2) == LOW) {
    link.println(<span class="st">"PING"</span>);
    delay(300);
  }
}

<span class="cm">// Board B: receiver</span>
<span class="kw">void</span> loop() {
  <span class="kw">if</span> (link.available()) {
    String m = link.readStringUntil(<span class="st">'\\n'</span>);
    <span class="kw">if</span> (m.startsWith(<span class="st">"PING"</span>))
      digitalWrite(13, HIGH);
  }
}</div></div>` }] },

    { tag: "TEST", kicker: "Test like an engineer", title: "Break it on purpose",
      blocks: [
        { t: "table", color: "red", cols: ["Do this", "What should happen", "What it teaches"], rows: [
          ["Pull out the SDA wire", "Scanner finds nothing", "No data line, no conversation"],
          ["Pull out one GND", "Nonsense or nothing", "Both sides need the same reference voltage"],
          ["Set board B to 4800 baud", "Gibberish, not silence", "Wrong speed looks different from wrong wiring"],
          ["Give both devices 0x3C", "One or both vanish", "An address clash is silent and confusing"],
          ["Add a third I2C device", "All three still work", "A bus really does scale"],
        ] },
        { t: "note", l: "Write it down", text: "An engineer who can describe the symptom can find the fault. 'It does not work' is not a symptom." },
      ] },

    { tag: "LEVEL UP", kicker: "Finished early?", title: "Go further",
      blocks: [{ t: "rows", items: [
        { t: "Put **three** I2C devices on the bus and scan again", a: "Does the bus get slower? Measure it with millis().", color: "teal", icon: "chip" },
        { t: "Send a **temperature reading** over UART instead of PING", a: "You will need to turn a number into text and back.", color: "blue", icon: "wave" },
        { t: "Read an **SD card over SPI** and list the files", a: "Notice how many more wires it took.", color: "purple", icon: "chip" },
        { t: "Measure SCL on an oscilloscope or logic analyser", a: "Count the clock pulses in one message.", color: "orange", icon: "graph" },
      ] }] },

    check([
      { t: "Explain what **serial** communication is and why robots use it", a: "Proof: I explained it to my partner without looking", color: "teal" },
      { t: "Put **two I2C devices** on the same two wires", a: "Proof: the scanner found both addresses", color: "blue" },
      { t: "Send data between **two boards over UART**", a: "Proof: a message arrived on the other board", color: "orange" },
      { t: "Choose **I2C, UART or SPI** for a job and say why", a: "Proof: I justified my choice for a new sensor", color: "purple" },
    ]),

    { tag: "WRAP UP", kicker: "Show what you know", title: "What did we learn?",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.15fr 1fr;gap:22px;height:100%">
        <div class="box fill c-teal"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Five things to keep</h3>
          <ul style="margin:6px 0 0 18px;line-height:1.85">
            <li>Serial sends bits one at a time, and it won.</li>
            <li>I2C: two wires, many devices, each with an address.</li>
            <li>UART: two boards, TX crossed to RX, matching baud.</li>
            <li>SPI: four wires, fastest, one CS per device.</li>
            <li>Shared GND is never optional.</li>
          </ul></div></div>
        <div class="stack">
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Exit ticket</h3>
            <p>You are adding a GPS, a screen and an SD card to one robot. Which protocol for each, and why?</p></div></div>
          <div class="note teal"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Next class</b><span>EF-11: libraries. How somebody else's code saves you two hours, and how to read it when it misbehaves.</span></div></div>
        </div></div>` }] },

  ],
};
