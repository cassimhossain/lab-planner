const { titleSlide, divider, objectives, check } = require("../lib.js");
const ART = require("../art.js");
const { DIAGRAMS } = require("../diagrams.js");

module.exports = {
  code: "ROB-05",
  title: "Build and Wire a Robot Car",
  series: "Robotics · Motors & Motion Control",
  accent: "blue",
  slides: [

    titleSlide({
      series: "Robotics · Motors & Motion Control",
      main: "Build and Wire a Robot Car", accentWords: ["Robot Car"],
      hook: "Two motors, one driver, one brain. Let's make it roll.",
      pills: ["90 minutes", "Pairs", "Real kit"],
      fig: DIAGRAMS.diffDrive(),
      note: "A robot with two driven wheels and one caster is called a differential drive. The same geometry steers a wheelchair, a warehouse robot and the Mars rovers' smaller cousins.",
    }),

    { tag: "LEARN", kicker: "Let's think", title: "Why can't the Arduino just drive the motors?",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.1fr 1fr;gap:22px;height:100%">
        <div class="stack">
          <div class="box fill c-red"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>The numbers that stop you</h3>
            <p>An Arduino pin can supply about <strong>20 mA</strong> safely, and 40 mA before it dies. A small yellow gear motor pulls <strong>150 to 250 mA</strong> running, and over <strong>1 A</strong> at the instant it starts or stalls.</p>
            <p style="margin-top:8px">That is ten to fifty times too much. The pin would not drive the motor; the motor would destroy the pin.</p></div></div>
          <div class="note"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>And there is a second problem</b><span>A pin can only be 0 V or 5 V. To run a motor backwards you must reverse the voltage across it, and a pin cannot go negative.</span></div></div>
        </div>
        <div class="box fill c-blue"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>So we need a part that</h3>
          <ul style="margin:6px 0 0 18px;line-height:1.85">
            <li>takes a small signal from the Arduino,</li>
            <li>switches a much larger current from the battery,</li>
            <li>and can send that current through the motor <strong>either way round</strong>.</li>
          </ul>
          <p style="margin-top:12px">That part is a <strong>motor driver</strong>. Inside it is an arrangement of four switches called an <strong>H-bridge</strong>.</p></div></div></div>` }] },

    objectives([
      { t: "Assemble a **2WD chassis** so it rolls straight and nothing rubs", icon: "robotCar", color: "teal" },
      { t: "Wire two motors through an **L298N driver** and a separate battery", icon: "motor", color: "blue" },
      { t: "Explain how an **H-bridge** reverses a motor", icon: "chip", color: "orange" },
      { t: "Drive **forward, back, left and right** from code, as functions", icon: "laptop", color: "purple" },
    ], "H-bridge · differential drive · PWM · duty cycle · enable pin · stall current · common ground · caster"),

    { tag: "LEARN", kicker: "Objective 3 · The idea", title: "An H-bridge is four switches",
      bodyStyle: "display:grid;grid-template-columns:1.2fr 1fr;gap:22px",
      blocks: [
        { t: "figbox", name: "hbridge", color: "green", h: "Why it is called an H", style: "min-height:0" },
        { t: "html", html: `<div class="stack">
          <div class="box fill c-blue"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Forward</h3>
            <p>Close S1 and S4. Current enters the motor on the left and leaves on the right.</p></div></div>
          <div class="box fill c-purple"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Backward</h3>
            <p>Close S2 and S3 instead. The same battery, the same motor, current the other way, so the shaft spins the other way.</p></div></div>
          <div class="note"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Shoot-through</b><span>S1 and S3 together is a straight wire from + to GND. The chip gets hot and dies. This is why we let the driver do the switching, not loose wires.</span></div></div>
        </div>` },
      ] },

    { tag: "LEARN", kicker: "Objective 2 · The board", title: "Reading the L298N",
      bodyStyle: "display:grid;grid-template-columns:1.2fr 1fr;gap:22px",
      blocks: [
        { t: "figbox", name: "l298n", color: "green", h: "Two motors, one board", style: "min-height:0" },
        { t: "html", html: `<div class="stack">
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>IN pins decide direction</h3>
            <p>IN1 HIGH and IN2 LOW drives motor A one way. Swap them and it reverses. Both the same means brake.</p></div></div>
          <div class="box fill c-purple"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>EN pins decide speed</h3>
            <p>ENA and ENB take PWM from pins 5, 6, 9, 10 or 11. 0 is stopped, 255 is flat out.</p></div></div>
          <div class="note"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>The 5V jumper</b><span>Leave it on and the board powers the Arduino from the battery. Take it off if you also have USB plugged in, or the two supplies fight.</span></div></div>
        </div>` },
      ] },

    { tag: "LEARN", kicker: "Objective 2 · Speed", title: "PWM: speed from a switch",
      bodyStyle: "display:grid;grid-template-columns:1.2fr 1fr;gap:22px",
      blocks: [
        { t: "figbox", name: "pwmDuty", color: "blue", h: "Same voltage, different share of the time", style: "min-height:0" },
        { t: "html", html: `<div class="stack">
          <div class="box fill c-green"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Why not just lower the voltage?</h3>
            <p>Because a resistor would turn the difference into heat. Switching wastes almost nothing, which matters when you are running on four AA cells.</p></div></div>
          <div class="box fill c-red"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>The dead zone</h3>
            <p>Below about <strong>analogWrite(60)</strong> most cheap motors only buzz. There is not enough torque to overcome their own friction. Start your speed tests at 100.</p></div></div>
        </div>` },
      ] },

    { tag: "LEARN", kicker: "Objective 4 · Steering", title: "No steering wheel needed",
      bodyStyle: "display:grid;grid-template-columns:1.2fr 1fr;gap:22px",
      blocks: [
        { t: "figbox", name: "diffDrive", color: "teal", h: "Differential drive", style: "min-height:0" },
        { t: "table", color: "blue", cols: ["Left wheel", "Right wheel", "The robot"], rows: [
          ["forward", "forward", "drives straight"],
          ["forward", "stopped", "swings a wide arc right"],
          ["forward", "backward", "spins on the spot, right"],
          ["backward", "backward", "reverses"],
          ["fast", "slow", "curves gently right"],
        ] },
      ] },

    { tag: "LEARN", kicker: "In the real world", title: "Where you have seen this",
      blocks: [{ t: "html", html: `<div class="cols c3" style="flex:1 1 auto;min-height:0;display:grid;gap:18px">
        <div class="box fill c-blue"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Robot vacuum</h3>
          <p>Two driven wheels, one caster, and a clever turn-on-the-spot when it meets a chair leg. Exactly this drive.</p></div></div>
        <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Electric wheelchair</h3>
          <p>The joystick does not steer. It sets two wheel speeds, and the chair curves because they differ.</p></div></div>
        <div class="box fill c-purple"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Warehouse AGV</h3>
          <p>Shelf-carrying robots turn in their own footprint, because an aisle has no room for a turning circle.</p></div></div></div>` }] },

    divider({
      part: "Part 2 · Make it", main: "Now let's build it",
      sub: "Chassis first, then wiring, then code. Test after every single step.",
      pills: ["60 minutes", "Pairs", "Real kit"],
      art: ART.svg("robotCar"),
    }),

    { tag: "MAKE", kicker: "Before you build", title: "What you need",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;height:100%">
        <div class="box fill c-teal"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Kit, per pair</h3>
          <ul style="margin:6px 0 0 18px;line-height:1.8">
            <li>2WD chassis kit: plate, 2 gear motors, 2 wheels, caster</li>
            <li>L298N motor driver</li>
            <li>Arduino Uno + USB cable</li>
            <li>4×AA battery pack</li>
            <li>Male-female jumper wires, screwdriver set</li>
          </ul></div></div>
        <div class="box fill c-red"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Safety, before power</h3>
          <ul style="margin:6px 0 0 18px;line-height:1.8">
            <li>Wheels <strong>off the desk</strong> for every first test.</li>
            <li>Tie long hair back. Gear motors catch it.</li>
            <li>Battery in last, out first, whenever you change wiring.</li>
            <li>If the driver smells hot, disconnect at once and tell a teacher.</li>
          </ul></div></div></div>` }] },

    { tag: "MAKE", kicker: "Wiring", title: "The whole robot, on one page",
      bodyStyle: "display:grid;grid-template-columns:1.3fr 1fr;gap:20px",
      blocks: [
        { t: "circuit", name: "robotCar", color: "green", h: "Uno, driver, two motors, one battery", style: "min-height:0" },
        { t: "conn", color: "blue", h: "Connections", from: "Arduino Uno", to: "L298N", why: "Carries",
          rows: [
            { w: "out", a: "7", b: "IN1", c: "left motor, direction A" },
            { w: "out", a: "8", b: "IN2", c: "left motor, direction B" },
            { w: "out", a: "9", b: "IN3", c: "right motor, direction A" },
            { w: "out", a: "11", b: "IN4", c: "right motor, direction B" },
            { w: "out", a: "5", b: "ENA", c: "left motor speed (PWM)" },
            { w: "out", a: "6", b: "ENB", c: "right motor speed (PWM)" },
            { w: "gnd", a: "GND", b: "GND", c: "the shared reference" },
          ],
          foot: "Then battery + to +12V and battery minus to the same GND. Remove the ENA and ENB jumpers first." },
      ] },

    { tag: "MAKE", kicker: "Build step 1 of 4", title: "Assemble the chassis",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.1fr 1fr;gap:22px;height:100%">
        <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Do this</h3>
          <ol style="margin:4px 0 0 19px;line-height:1.75">
            <li>Bolt both motors into the brackets. Do not overtighten; the plastic strips.</li>
            <li>Push the wheels on until they click flat against the shaft.</li>
            <li>Fit the caster at the <strong>opposite</strong> end to the motors.</li>
            <li>Mount the battery pack over the motors, not over the caster.</li>
            <li>Spin each wheel by hand. It should turn freely with no rubbing.</li></ol></div></div>
        <div class="stack">
          <div class="box fill c-purple"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Why the weight goes at the back</h3>
            <p>Weight over the driven wheels gives them grip. Weight over the caster just makes the robot push a sliding lump.</p></div></div>
          <div class="note"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Rubbing wheel?</b><span>Loosen the bracket, square the motor, retighten. A wheel that rubs will curve your robot away no matter how good your code is.</span></div></div>
        </div></div>` }] },

    { tag: "MAKE", kicker: "Build step 2 of 4", title: "Wire it up",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;height:100%">
        <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Do this, in this order</h3>
          <ol style="margin:4px 0 0 19px;line-height:1.7">
            <li>Left motor to OUT1 / OUT2. Right motor to OUT3 / OUT4.</li>
            <li>Battery + to <strong>+12V</strong>, battery − to <strong>GND</strong>.</li>
            <li><strong>Arduino GND to driver GND.</strong> Never skip this.</li>
            <li>IN1→7, IN2→8, IN3→9, IN4→11.</li>
            <li>ENA→5, ENB→6. Remove the little enable jumpers first.</li></ol></div></div>
        <div class="stack">
          <div class="box fill c-red"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Common ground, again</h3>
            <p>The Arduino says "5 V" compared to <em>its</em> ground. The driver measures against <em>its</em> ground. If they are not joined, the IN pins mean nothing and the robot twitches randomly.</p></div></div>
          <div class="note teal"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Two supplies, one rule</b><span>Battery powers the motors. USB powers the Arduino. The grounds are shared. The 5 V rails are not.</span></div></div>
        </div></div>` }] },

    { tag: "MAKE", kicker: "Build step 3 of 4", title: "Make one wheel turn",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1.05fr;gap:22px;height:100%">
        <div class="stack">
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Do this</h3>
            <ol style="margin:4px 0 0 19px;line-height:1.7">
              <li>Wheels off the desk.</li>
              <li>Upload the sketch. The left wheel should turn forward.</li>
              <li>Swap IN1 and IN2 in code. It should reverse.</li>
              <li>Now repeat for the right wheel.</li></ol></div></div>
          <div class="note"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Wrong way round?</b><span>Do not rewrite the code. Swap the two motor wires at OUT1 and OUT2. It is the same fix, and it keeps your code honest.</span></div></div>
        </div>
        <div class="code" style="align-self:start"><span class="cm">// one motor, both directions</span>
<span class="kw">const</span> <span class="kw">int</span> IN1 = 7, IN2 = 8, ENA = 5;

<span class="kw">void</span> setup() {
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(ENA, OUTPUT);
}

<span class="kw">void</span> loop() {
  digitalWrite(IN1, HIGH);     <span class="cm">// forward</span>
  digitalWrite(IN2, LOW);
  analogWrite(ENA, 180);       <span class="cm">// ~70% speed</span>
  delay(1500);

  analogWrite(ENA, 0);         <span class="cm">// coast</span>
  delay(500);
}</div></div>` }] },

    { tag: "MAKE", kicker: "Build step 4 of 4", title: "Four functions, one robot",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1.1fr;gap:22px;height:100%">
        <div class="stack">
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Do this</h3>
            <ol style="margin:4px 0 0 19px;line-height:1.7">
              <li>Write <code>forward()</code>, <code>back()</code>, <code>left()</code>, <code>right()</code>, <code>stop()</code>.</li>
              <li>Drive a square: forward, right, four times.</li>
              <li>Measure how long a 90° turn really takes. Tune it.</li></ol></div></div>
          <div class="box fill c-green"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Why functions?</h3>
            <p>Named functions turn eight confusing digitalWrites into one word you can read out loud. Every robot you build from now on will have these five.</p></div></div>
        </div>
        <div class="code" style="align-self:start"><span class="kw">int</span> SPD = 170;

<span class="kw">void</span> drive(<span class="kw">int</span> l, <span class="kw">int</span> r) {
  digitalWrite(IN1, l &gt; 0); digitalWrite(IN2, l &lt; 0);
  digitalWrite(IN3, r &gt; 0); digitalWrite(IN4, r &lt; 0);
  analogWrite(ENA, abs(l));
  analogWrite(ENB, abs(r));
}

<span class="kw">void</span> forward() { drive( SPD,  SPD); }
<span class="kw">void</span> back()    { drive(-SPD, -SPD); }
<span class="kw">void</span> left()    { drive(-SPD,  SPD); }
<span class="kw">void</span> right()   { drive( SPD, -SPD); }
<span class="kw">void</span> halt()    { drive(0, 0); }

<span class="kw">void</span> loop() {                 <span class="cm">// a square</span>
  <span class="kw">for</span> (<span class="kw">int</span> i = 0; i &lt; 4; i++) {
    forward(); delay(1000);
    right();   delay(420);     <span class="cm">// tune this</span>
  }
  halt(); delay(3000);
}</div></div>` }] },

    { tag: "TEST", kicker: "Test like an engineer", title: "Make it go straight",
      blocks: [
        { t: "table", color: "red", cols: ["Symptom", "Likely cause", "What to try"], rows: [
          ["Curves to one side", "Motors are never identical", "Lower the faster side: use 170 and 155, not 170 and 170"],
          ["One wheel does nothing", "Loose OUT screw terminal", "Tug the wire gently. Retighten and retest"],
          ["Both wheels twitch randomly", "No common ground", "Join Arduino GND to driver GND"],
          ["Works on USB, dies on battery", "Flat cells, or 6 V is not enough", "Fresh AAs, or move to a 2S pack"],
          ["Arduino resets when it starts", "Motor inrush drags the rail down", "Separate supplies, grounds joined"],
        ] },
        { t: "note", l: "Calibration is normal", text: "Real robots all have a trim value somewhere. Finding yours is engineering, not cheating." },
      ] },

    { tag: "LEVEL UP", kicker: "Finished early?", title: "Go further",
      blocks: [{ t: "rows", items: [
        { t: "Write a **calibration routine** that drives 2 m and reports the drift", a: "Then store the correction as a constant.", color: "teal", icon: "graph" },
        { t: "Add a **soft start** so speed ramps from 0 to full over 300 ms", a: "Less wheelspin, less voltage sag.", color: "blue", icon: "wave" },
        { t: "Drive a **figure of eight** without stopping", a: "Two different speeds, swapped halfway.", color: "purple", icon: "line" },
        { t: "Measure the **stall current** with a multimeter", a: "Hold the wheel and watch the reading climb.", color: "orange", icon: "multimeter" },
      ] }] },

    check([
      { t: "Assemble a **2WD chassis** that rolls freely", a: "Proof: both wheels spin by hand with no rubbing", color: "teal" },
      { t: "Wire motors through an **L298N** with a shared ground", a: "Proof: both motors run in both directions", color: "blue" },
      { t: "Explain how an **H-bridge** reverses a motor", a: "Proof: I named which two switches close for each direction", color: "orange" },
      { t: "Drive **forward, back, left, right** as functions", a: "Proof: my robot drove a square and came back", color: "purple" },
    ]),

    { tag: "WRAP UP", kicker: "Show what you know", title: "What did we learn?",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.15fr 1fr;gap:22px;height:100%">
        <div class="box fill c-teal"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Five things to keep</h3>
          <ul style="margin:6px 0 0 18px;line-height:1.85">
            <li>Arduino pins give signals. Drivers give power.</li>
            <li>An H-bridge reverses a motor with four switches.</li>
            <li>PWM sets speed by switching fast, not by lowering volts.</li>
            <li>Two wheel speeds are all the steering you need.</li>
            <li>No shared ground, no working robot.</li>
          </ul></div></div>
        <div class="stack">
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Exit ticket</h3>
            <p>Your robot drifts left. Name two different fixes, one mechanical and one in code.</p></div></div>
          <div class="note teal"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Next class</b><span>ROB-06: servos and steppers. A DC motor spins; a servo points; a stepper counts.</span></div></div>
        </div></div>` }] },

  ],
};
