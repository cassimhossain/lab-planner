const { titleSlide, divider, objectives, check } = require("../lib.js");
const ART = require("../art.js");
const { DIAGRAMS } = require("../diagrams.js");

module.exports = {
  code: "ROB-06",
  title: "Servos and Steppers: Moving Precisely",
  series: "Robotics · Motors & Motion Control",
  accent: "blue",
  slides: [

    titleSlide({
      series: "Robotics · Motors & Motion Control",
      main: "Moving Precisely", accentWords: ["Precisely"],
      hook: "A DC motor spins. A servo points. A stepper counts. Which one draws a perfect circle?",
      pills: ["60 minutes", "Pairs", "Circuit Lab or real kit"],
      fig: DIAGRAMS.motorPick(),
      note: "The 28BYJ-48 stepper in your kit takes 2048 steps for one turn of the output shaft. That is a resolution of 0.176 degrees, finer than you can see.",
    }),

    { tag: "LEARN", kicker: "Let's think", title: "Draw a square, in the dark",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.1fr 1fr;gap:22px;height:100%">
        <div class="stack">
          <div class="box fill c-blue"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>The challenge</h3>
            <p>Close your eyes. Draw a 10 cm square on paper. Open them. It is not square, and the lines are not 10 cm.</p>
            <p style="margin-top:8px">Now do it again with your eyes open. Better, because you can <strong>check as you go</strong>.</p></div></div>
          <div class="note"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>That is the whole lesson</b><span>A DC motor is drawing with its eyes shut. A stepper counts its own moves. A servo has a tiny eye inside it that checks the angle hundreds of times a second.</span></div></div>
        </div>
        <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Guess first</h3>
          <ul style="margin:6px 0 0 18px;line-height:1.8">
            <li>Which motor is in a printer that must not drift?</li>
            <li>Which is in a toy car?</li>
            <li>Which is in a camera gimbal that must hold still?</li>
            <li>Which one would you put on a robot arm elbow?</li>
          </ul>
          <p style="margin-top:10px;color:#8A94A6">No wrong answers yet. Write them down, and check at the end.</p></div></div></div>` }] },

    objectives([
      { t: "Compare **DC, servo and stepper** motors and what each is for", icon: "motor", color: "teal" },
      { t: "Explain how a **pulse width** sets a servo angle", icon: "wave", color: "blue" },
      { t: "Drive a servo to an angle and a stepper **an exact number of steps**", icon: "stepper", color: "orange" },
      { t: "Pick the right motor for a job and **justify it**", icon: "scales", color: "purple" },
    ], "servo · stepper · PWM · pulse width · steps per revolution · open loop · torque · holding torque · gearbox"),

    { tag: "LEARN", kicker: "Objective 1 · Compare", title: "Three motors, three jobs",
      bodyStyle: "display:grid;grid-template-columns:1.15fr 1fr;gap:22px",
      blocks: [
        { t: "figbox", name: "motorPick", color: "teal", h: "What each one actually gives you", style: "min-height:0" },
        { t: "table", color: "blue", cols: ["", "DC", "Servo", "Stepper"], rows: [
          ["Controls", "speed", "angle", "position in steps"],
          ["Range", "endless", "0 to 180°", "endless, counted"],
          ["Knows where it is", "no", "yes, inside", "only if you count"],
          ["Holds still under load", "no", "yes", "yes, strongly"],
          ["Needs a driver", "yes", "no", "yes"],
          ["Typical use", "wheels", "arms, steering", "printers, CNC"],
        ] },
      ] },

    { tag: "LEARN", kicker: "Objective 2 · Servos", title: "The pulse is the instruction",
      bodyStyle: "display:grid;grid-template-columns:1.25fr 1fr;gap:22px",
      blocks: [
        { t: "figbox", name: "servoPulse", color: "blue", h: "Width, not voltage, not count", style: "min-height:0" },
        { t: "html", html: `<div class="stack">
          <div class="box fill c-green"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Inside the case</h3>
            <p>A small DC motor, a gearbox, a <strong>potentiometer</strong> on the output shaft, and a tiny controller that compares the pot reading with the pulse you sent.</p></div></div>
          <div class="box fill c-purple"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>It is a closed loop</h3>
            <p>Push the arm and the servo pushes back, because the pot tells it the angle is wrong. That is why a servo holds a load and a DC motor does not.</p></div></div>
          <div class="note"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Buzzing?</b><span>The servo is hunting: it cannot reach the angle you asked for. Either something is jammed, or the 5 V rail is sagging.</span></div></div>
        </div>` },
      ] },

    { tag: "LEARN", kicker: "Objective 3 · Steppers", title: "Counting, not guessing",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;height:100%">
        <div class="stack">
          <div class="box fill c-purple"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>How a stepper moves</h3>
            <p>Four coils are energised in turn. The rotor jumps to line up with whichever coil is on. Each jump is one <strong>step</strong>, always the same size.</p>
            <p style="margin-top:8px">No feedback is needed, because the step size is set by the physical magnets, not by timing.</p></div></div>
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>The 28BYJ-48 numbers</h3>
            <p>32 steps per turn of the <em>internal</em> rotor, then a <strong>64:1 gearbox</strong>.</p>
            <p style="margin-top:6px">32 × 64 = <strong>2048 steps per output turn</strong>. One step is 0.176°.</p></div></div>
        </div>
        <div class="stack">
          <div class="box fill c-red"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>The catch: open loop</h3>
            <p>If the load is too heavy, the rotor <strong>skips a step</strong> and nothing tells you. The code still thinks it is at 90°. The arm is at 83°.</p>
            <p style="margin-top:8px">This is why 3D printers have a home switch: the only way to be sure is to go back to a known place.</p></div></div>
          <div class="note teal"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Slower is stronger</b><span>Steppers lose torque as they speed up. If yours is skipping, add a longer delay between steps before you blame the motor.</span></div></div>
        </div></div>` }] },

    { tag: "LEARN", kicker: "In the real world", title: "Open your eyes and spot them",
      blocks: [{ t: "html", html: `<div class="cols c3" style="flex:1 1 auto;min-height:0;display:grid;gap:18px">
        <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3 ic="motor">DC motor</h3>
          <p>A pedestal fan, a drill, a toy car. You want it to go round; nobody cares exactly where it stops.</p></div></div>
        <div class="box fill c-teal"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3 ic="servo">Servo</h3>
          <p>The flaps on a model aeroplane, a camera gimbal, the steering of an RC car. Hold this angle, against wind.</p></div></div>
        <div class="box fill c-purple"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3 ic="stepper">Stepper</h3>
          <p>A 3D printer, a CNC router, the paper feed in a photocopier. Move exactly this far, every time.</p></div></div></div>` }] },

    divider({
      part: "Part 2 · Make it", main: "Now let's drive them",
      sub: "A servo that points, then a stepper that counts out exactly one revolution.",
      pills: ["30 minutes", "Pairs", "Circuit Lab or real kit"],
      art: ART.svg("servo"),
    }),

    { tag: "MAKE", kicker: "Class game", title: "Be the stepper",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.1fr 1fr;gap:22px;height:100%">
        <div class="box fill c-green"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>How to play</h3>
          <ol style="margin:6px 0 0 19px;line-height:1.8">
            <li>Four students stand in a square. Each is a coil.</li>
            <li>A fifth stands in the middle: the rotor, arm pointing out.</li>
            <li>Coils light up in order 1, 2, 3, 4. The rotor must point at whoever is lit.</li>
            <li>Speed up the calling until the rotor cannot keep up.</li></ol>
          <p style="margin-top:10px">That failure is a <strong>skipped step</strong>, and it is exactly what a real stepper does when it is pushed too fast.</p></div></div>
        <div class="stack">
          <div class="box fill c-blue"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Round two</h3>
            <p>Now call them backwards: 4, 3, 2, 1. The rotor reverses. Nothing else changed.</p></div></div>
          <div class="note"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Half stepping</b><span>Light two neighbours at once and the rotor points between them. That doubles your resolution, for free.</span></div></div>
        </div></div>` }] },

    { tag: "MAKE", kicker: "Before you wire", title: "What you need",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;height:100%">
        <div class="box fill c-teal"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3 ic="breadboard">Kit, per pair</h3>
          <ul style="margin:6px 0 0 18px;line-height:1.8">
            <li>SG90 servo (orange signal, red 5V, brown GND)</li>
            <li>28BYJ-48 stepper + ULN2003 driver board</li>
            <li>Arduino Uno + USB cable</li>
            <li>Half-size breadboard, jumper wires</li>
          </ul></div></div>
        <div class="box fill c-red"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3 ic="battery">Power warning</h3>
          <p>One SG90 on the Arduino's 5 V is fine. <strong>Two or more is not.</strong> They pull current in spikes and reset the board.</p>
          <p style="margin-top:8px">The stepper always takes its own 5 V supply through the ULN2003. Share the ground, never the 5 V rail.</p></div></div></div>` }] },

    { tag: "MAKE", kicker: "Wiring · servo", title: "Three wires, by colour",
      bodyStyle: "display:grid;grid-template-columns:1.3fr 1fr;gap:20px",
      blocks: [
        { t: "circuit", name: "servo", color: "teal", h: "SG90 on a PWM pin", style: "min-height:0" },
        { t: "conn", color: "teal", h: "Connections", from: "Arduino Uno", to: "SG90 servo", why: "Carries",
          rows: [
            { w: "pwr", a: "5V", b: "red", c: "power for the motor inside" },
            { w: "gnd", a: "GND", b: "brown", c: "the shared reference" },
            { w: "out", a: "pin 9", b: "orange", c: "the pulse that sets the angle" },
          ],
          foot: "Brown is always ground on a hobby servo. If the colours are black, red, yellow, black is ground." },
      ] },

    { tag: "MAKE", kicker: "Wiring · stepper", title: "Four coils, four pins",
      bodyStyle: "display:grid;grid-template-columns:1.3fr 1fr;gap:20px",
      blocks: [
        { t: "circuit", name: "stepper", color: "purple", h: "28BYJ-48 through a ULN2003", style: "min-height:0" },
        { t: "conn", color: "purple", h: "Connections", from: "Arduino Uno", to: "ULN2003", why: "Carries",
          rows: [
            { w: "out", a: "8", b: "IN1", c: "coil 1" },
            { w: "out", a: "9", b: "IN2", c: "coil 2" },
            { w: "out", a: "10", b: "IN3", c: "coil 3" },
            { w: "out", a: "11", b: "IN4", c: "coil 4" },
            { w: "pwr", a: "(own 5 V)", b: "5V", c: "coil current, not from the Uno" },
            { w: "gnd", a: "GND", b: "GND", c: "the shared reference" },
          ],
          foot: "Wire 8, 9, 10, 11 to IN1 to IN4. The sketch lists them 8, 10, 9, 11: that is not a typo." },
      ] },

    { tag: "MAKE", kicker: "Build step 1 of 3", title: "A servo that points",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1.05fr;gap:22px;height:100%">
        <div class="stack">
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Do this</h3>
            <ol style="margin:4px 0 0 19px;line-height:1.7">
              <li>Signal to pin 9, red to 5V, brown to GND.</li>
              <li>Upload the sweep. Watch it travel 0 to 180 and back.</li>
              <li>Hold the arm gently. Feel it push back.</li>
              <li>Now make it point at a number you type in the Serial Monitor.</li></ol></div></div>
          <div class="note"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Never force the arm</b><span>Turning a powered servo by hand strips the plastic gears. If you must reposition it, cut the power first.</span></div></div>
        </div>
        <div class="code" style="align-self:start">#include &lt;Servo.h&gt;
Servo arm;

<span class="kw">void</span> setup() {
  arm.attach(9);
  Serial.begin(<span class="st">9600</span>);
}

<span class="kw">void</span> loop() {
  <span class="kw">for</span> (<span class="kw">int</span> a = 0; a &lt;= 180; a += 2) {
    arm.write(a);              <span class="cm">// degrees, not pulses</span>
    delay(15);                 <span class="cm">// give it time to arrive</span>
  }
  <span class="kw">for</span> (<span class="kw">int</span> a = 180; a &gt;= 0; a -= 2) {
    arm.write(a);
    delay(15);
  }
}</div></div>` }] },

    { tag: "MAKE", kicker: "Build step 2 of 3", title: "A stepper that counts",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1.05fr;gap:22px;height:100%">
        <div class="stack">
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Do this</h3>
            <ol style="margin:4px 0 0 19px;line-height:1.7">
              <li>ULN2003 IN1-IN4 to pins 8, 9, 10, 11.</li>
              <li>Mark the shaft with tape so you can see one turn.</li>
              <li>Run exactly 2048 steps. Does the mark come home?</li>
              <li>Now run 1024. It should stop half way round.</li></ol></div></div>
          <div class="box fill c-purple"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Watch the order</h3>
            <p>The Stepper library wants pins in the order <strong>8, 10, 9, 11</strong> for this board. Wrong order means it vibrates and goes nowhere.</p></div></div>
        </div>
        <div class="code" style="align-self:start">#include &lt;Stepper.h&gt;

<span class="kw">const</span> <span class="kw">int</span> STEPS = 2048;      <span class="cm">// one full turn</span>
Stepper motor(STEPS, 8, 10, 9, 11);

<span class="kw">void</span> setup() {
  motor.setSpeed(10);          <span class="cm">// rev/min, keep it low</span>
  Serial.begin(<span class="st">9600</span>);
}

<span class="kw">void</span> loop() {
  motor.step(STEPS);           <span class="cm">// one turn clockwise</span>
  delay(1000);
  motor.step(-STEPS / 4);      <span class="cm">// back a quarter turn</span>
  delay(1000);
}</div></div>` }] },

    { tag: "MAKE", kicker: "Build step 3 of 3", title: "A pointer that means something",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1.05fr;gap:22px;height:100%">
        <div class="stack">
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Do this</h3>
            <ol style="margin:4px 0 0 19px;line-height:1.7">
              <li>Draw a dial on card: 0 to 100.</li>
              <li>Tape a card arrow to the servo horn.</li>
              <li>Map a sensor reading onto 0 to 180 degrees.</li>
              <li>Now it is a gauge, not a toy.</li></ol></div></div>
          <div class="note teal"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>map() is your friend</b><span>Every sensor has its own range. map() stretches it onto the range your output needs, in one line.</span></div></div>
        </div>
        <div class="code" style="align-self:start">#include &lt;Servo.h&gt;
Servo needle;

<span class="kw">void</span> setup() {
  needle.attach(9);
}

<span class="kw">void</span> loop() {
  <span class="kw">int</span> raw = analogRead(A0);          <span class="cm">// 0 to 1023</span>
  <span class="kw">int</span> deg = map(raw, 0, 1023, 0, 180);
  needle.write(deg);
  delay(50);                         <span class="cm">// smooth, not jumpy</span>
}</div></div>` }] },

    { tag: "TEST", kicker: "Test like an engineer", title: "Find the limits",
      blocks: [
        { t: "table", color: "red", cols: ["Try this", "What happens", "What it teaches"], rows: [
          ["Ask the servo for 200 degrees", "It stops at its limit and buzzes", "The range is physical, not a suggestion"],
          ["Hold the servo arm still for 5 seconds", "It gets warm", "Holding torque costs current"],
          ["Set stepper speed to 30 rev/min", "It stalls or skips", "Torque falls as speed rises"],
          ["Load the stepper shaft with a finger", "It loses steps silently", "Open loop never knows it failed"],
          ["Run two servos from Arduino 5 V", "The board browns out", "Motors need their own supply"],
        ] },
        { t: "note", l: "Record the numbers", text: "At what speed did your stepper first skip? That number is a property of your motor, and a real engineer writes it down." },
      ] },

    { tag: "LEVEL UP", kicker: "Finished early?", title: "Go further",
      blocks: [{ t: "rows", items: [
        { t: "Work out **degrees per step** and prove it with a protractor", a: "360 ÷ 2048. Measure 100 steps and check.", color: "teal", icon: "scales" },
        { t: "Add **acceleration**: start slow, speed up, slow down", a: "Fewer skipped steps and much less noise.", color: "blue", icon: "wave" },
        { t: "Try **half stepping** and count the new steps per turn", a: "4096. Twice the resolution, half the torque.", color: "purple", icon: "gear" },
        { t: "Drive a servo with **raw pulses** and no library", a: "digitalWrite, delayMicroseconds, repeat every 20 ms.", color: "orange", icon: "laptop" },
      ] }] },

    check([
      { t: "Compare **DC, servo and stepper** motors", a: "Proof: I picked the right one for three different machines", color: "teal" },
      { t: "Explain how a **pulse width** sets a servo angle", a: "Proof: I said what 1.5 ms means without looking", color: "blue" },
      { t: "Drive a stepper **an exact number of steps**", a: "Proof: my tape mark came back to the start", color: "orange" },
      { t: "Pick the right motor for a job and **justify it**", a: "Proof: I gave a reason, not just a name", color: "purple" },
    ]),

    { tag: "WRAP UP", kicker: "Show what you know", title: "What did we learn?",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.15fr 1fr;gap:22px;height:100%">
        <div class="box fill c-teal"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3 ic="book">Five things to keep</h3>
          <ul style="margin:6px 0 0 18px;line-height:1.85">
            <li>DC controls speed, servo controls angle, stepper counts.</li>
            <li>A servo reads pulse width, between 1 and 2 ms.</li>
            <li>A servo is closed loop; a stepper is not.</li>
            <li>2048 steps is one turn of the 28BYJ-48.</li>
            <li>Steppers lose torque as they speed up.</li>
          </ul></div></div>
        <div class="stack">
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3 ic="pencil">Exit ticket</h3>
            <p>You are building a robot that must lift a cup to a shelf and hold it there. Which motor, and what happens if you choose wrong?</p></div></div>
          <div class="note teal"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Next class</b><span>ROB-07: encoders. How a robot works out how far it has actually travelled, rather than how far it meant to.</span></div></div>
        </div></div>` }] },

  ],
};
