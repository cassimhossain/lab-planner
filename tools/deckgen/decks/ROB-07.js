const { titleSlide, divider, objectives, check } = require("../lib.js");
const ART = require("../art.js");
const { DIAGRAMS } = require("../diagrams.js");

module.exports = {
  code: "ROB-07",
  title: "Encoders: How Far Did I Go?",
  series: "Robotics · Motors & Motion Control",
  accent: "blue",
  slides: [

    titleSlide({
      series: "Robotics · Motors & Motion Control",
      main: "How Far Did I Go?", accentWords: ["How Far"],
      hook: "Robots can't see their own wheels. So how do they know they drove one metre?",
      pills: ["90 minutes", "Pairs", "Real kit"],
      fig: DIAGRAMS.encoderDisc(),
      note: "Ancient Roman carts carried an odometer: a gear that dropped one pebble into a box every Roman mile. Counting wheel turns is a two thousand year old idea.",
    }),

    { tag: "LEARN", kicker: "Let's think", title: "Why 'drive for 2 seconds' always fails",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.1fr 1fr;gap:22px;height:100%">
        <div class="stack">
          <div class="box fill c-red"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>The same code, four different answers</h3>
            <p>Run <code>forward(); delay(2000);</code> four times and measure.</p>
            <ul style="margin:6px 0 0 18px;line-height:1.7">
              <li>Fresh batteries: 118 cm</li>
              <li>Half-flat batteries: 94 cm</li>
              <li>On carpet: 86 cm</li>
              <li>Carrying a book: 71 cm</li>
            </ul></div></div>
          <div class="note"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Time is not distance</b><span>Time only becomes distance if speed never changes. On a real robot, speed changes constantly.</span></div></div>
        </div>
        <div class="box fill c-blue"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>So measure the thing you care about</h3>
          <p>Do not guess from time. <strong>Count the wheel.</strong></p>
          <p style="margin-top:10px">If you know how far the wheel travels in one turn, and you can count turns, you know distance. Battery level, carpet and cargo stop mattering.</p>
          <p style="margin-top:10px;color:#8A94A6">This single idea is what separates a toy from a robot.</p></div></div></div>` }] },

    objectives([
      { t: "Explain **encoder ticks** and how wheel circumference turns them into distance", icon: "gear", color: "teal" },
      { t: "Count ticks with an **interrupt**, not a polling loop", icon: "bolt", color: "blue" },
      { t: "Drive an **exact distance** and measure the error", icon: "line", color: "orange" },
      { t: "Work out **speed** from ticks per second", icon: "graph", color: "purple" },
    ], "encoder · tick · slot · interrupt · ISR · volatile · odometry · circumference · resolution · debounce"),

    { tag: "LEARN", kicker: "Objective 1 · The sensor", title: "A slotted disc and an eye",
      bodyStyle: "display:grid;grid-template-columns:1.25fr 1fr;gap:22px",
      blocks: [
        { t: "figbox", name: "encoderDisc", color: "blue", h: "Light, blocked, light, blocked", style: "min-height:0" },
        { t: "html", html: `<div class="stack">
          <div class="box fill c-green"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>How it works</h3>
            <p>An infrared LED shines at a phototransistor. The slotted disc on the axle chops the beam. The LM393 turns each chop into a clean HIGH-LOW edge.</p></div></div>
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Resolution</h3>
            <p>20 slots means 20 ticks per turn. That is the finest distance you can ever measure: about <strong>1 cm</strong> on a 65 mm wheel.</p></div></div>
          <div class="note"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>One beam cannot tell direction</b><span>Forward and backward look identical. Two sensors, slightly offset, would solve it. That is a quadrature encoder.</span></div></div>
        </div>` },
      ] },

    { tag: "LEARN", kicker: "Objective 1 · The maths", title: "From ticks to centimetres",
      bodyStyle: "display:grid;grid-template-columns:1.15fr 1fr;gap:22px",
      blocks: [
        { t: "figbox", name: "odometry", color: "teal", h: "Do this once, with your own wheel", style: "min-height:0" },
        { t: "html", html: `<div class="stack">
          <div class="box fill c-purple"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Work it through</h3>
            <p>Circumference = π × d = 3.1416 × 65 mm = <strong>204 mm</strong>.</p>
            <p style="margin-top:6px">204 ÷ 20 slots = <strong>10.2 mm per tick</strong>.</p>
            <p style="margin-top:6px">1000 ÷ 10.2 = <strong>98 ticks</strong> for one metre.</p></div></div>
          <div class="box fill c-red"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Measure, do not assume</h3>
            <p>A "65 mm" wheel with a rubber tyre is often 66 or 67 mm. Roll it along a ruler for one turn and use <em>that</em> number.</p></div></div>
        </div>` },
      ] },

    { tag: "LEARN", kicker: "Objective 2 · Interrupts", title: "Why loop() is not fast enough",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;height:100%">
        <div class="stack">
          <div class="box fill c-red"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>The problem with polling</h3>
            <p>At full speed a wheel may produce <strong>200 ticks a second</strong>. If your loop also prints to Serial and reads a sensor, it may only come round 50 times a second.</p>
            <p style="margin-top:8px">Three quarters of your ticks are simply never seen, and your distance is quietly wrong.</p></div></div>
          <div class="note"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Missed ticks never come back</b><span>There is no way to notice afterwards. The count is just low, and everything built on it is low too.</span></div></div>
        </div>
        <div class="stack">
          <div class="box fill c-green"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>What an interrupt does</h3>
            <p>You tell the chip: "whenever pin 2 goes from LOW to HIGH, drop everything and run this function."</p>
            <p style="margin-top:8px">The main loop is paused mid-instruction, the counter is bumped, and the loop resumes. Nothing is missed.</p></div></div>
          <div class="box fill c-purple"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Two rules for an ISR</h3>
            <p>Keep it <strong>tiny</strong>: no Serial.print, no delay. And mark any variable it touches <strong>volatile</strong>, or the compiler will optimise your reads away.</p></div></div>
        </div></div>` }] },

    { tag: "LEARN", kicker: "In the real world", title: "Counting is everywhere",
      blocks: [{ t: "html", html: `<div class="cols c3" style="flex:1 1 auto;min-height:0;display:grid;gap:18px">
        <div class="box fill c-blue"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Your bike computer</h3>
          <p>A magnet on a spoke and a reed switch. One pulse per wheel turn, and it knows your speed and your distance.</p></div></div>
        <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>A computer mouse</h3>
          <p>Old ball mice had two slotted wheels inside, one for each axis, doing exactly what your robot is about to do.</p></div></div>
        <div class="box fill c-purple"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>A lift</h3>
          <p>An encoder on the motor tells the controller which floor it is passing, so it knows when to start slowing down.</p></div></div></div>` }] },

    divider({
      part: "Part 2 · Make it", main: "Now let's count",
      sub: "Fit the sensor, count ticks, then drive exactly one metre and measure the error.",
      pills: ["50 minutes", "Pairs", "Real kit"],
      art: ART.svg("gears"),
    }),

    { tag: "MAKE", kicker: "Class game", title: "Count the wheel by hand",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.1fr 1fr;gap:22px;height:100%">
        <div class="box fill c-green"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>How to play</h3>
          <ol style="margin:6px 0 0 19px;line-height:1.8">
            <li>Mark one spot on a wheel with tape.</li>
            <li>Push the robot one metre along a measured line.</li>
            <li>Count the turns out loud, including the fraction.</li>
            <li>Now work backwards: how far is one turn?</li></ol>
          <p style="margin-top:10px">You have just performed odometry with your eyes. The encoder is only doing it faster.</p></div></div>
        <div class="stack">
          <div class="box fill c-red"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Round two: slip</h3>
            <p>Push the robot but hold one wheel so it slides. Ticks say you moved; the floor says you did not. <strong>Encoders measure the wheel, not the world.</strong></p></div></div>
          <div class="note"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Remember this</b><span>Wheel slip is why a robot that only counts ticks will still get lost eventually.</span></div></div>
        </div></div>` }] },

    { tag: "MAKE", kicker: "Build step 1 of 3", title: "Fit the sensor and see a tick",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1.05fr;gap:22px;height:100%">
        <div class="stack">
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Do this</h3>
            <ol style="margin:4px 0 0 19px;line-height:1.7">
              <li>Slide the slotted disc onto the axle, inside the chassis.</li>
              <li>Clamp the LM393 so the disc runs through its gap.</li>
              <li>VCC to 5V, GND to GND, <strong>OUT to pin 2</strong>.</li>
              <li>Turn the wheel by hand. The LED on the module should flicker.</li></ol></div></div>
          <div class="note"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>LED stays on or off?</b><span>The disc is not in the gap, or the little trimmer needs adjusting. Turn it until the LED just flickers as the disc moves.</span></div></div>
        </div>
        <div class="code" style="align-self:start"><span class="cm">// see the raw signal first</span>
<span class="kw">void</span> setup() {
  pinMode(2, INPUT);
  Serial.begin(<span class="st">9600</span>);
}

<span class="kw">void</span> loop() {
  Serial.println(digitalRead(2));
  delay(20);
}

<span class="cm">// Turn the wheel slowly by hand.</span>
<span class="cm">// You should see a clean run of</span>
<span class="cm">// 1 1 1 0 0 0 1 1 1 0 0 0</span>
<span class="cm">// If it is noisy, the sensor is</span>
<span class="cm">// not aligned with the slots.</span></div></div>` }] },

    { tag: "MAKE", kicker: "Build step 2 of 3", title: "Count with an interrupt",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1.05fr;gap:22px;height:100%">
        <div class="stack">
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Do this</h3>
            <ol style="margin:4px 0 0 19px;line-height:1.7">
              <li>Attach the interrupt to pin 2, RISING edge.</li>
              <li>Spin the wheel one full turn by hand.</li>
              <li>Does it print 20? If not, your disc has a different slot count.</li>
              <li>Use <em>your</em> number everywhere from now on.</li></ol></div></div>
          <div class="box fill c-purple"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Why the noInterrupts block?</h3>
            <p>The count is two bytes. An interrupt landing between reading byte one and byte two would hand you nonsense.</p></div></div>
        </div>
        <div class="code" style="align-self:start"><span class="kw">volatile</span> <span class="kw">long</span> ticks = 0;

<span class="kw">void</span> onTick() { ticks++; }     <span class="cm">// keep it tiny</span>

<span class="kw">void</span> setup() {
  pinMode(2, INPUT);
  attachInterrupt(digitalPinToInterrupt(2),
                  onTick, RISING);
  Serial.begin(<span class="st">9600</span>);
}

<span class="kw">void</span> loop() {
  noInterrupts();
  <span class="kw">long</span> t = ticks;              <span class="cm">// safe copy</span>
  interrupts();

  Serial.print(<span class="st">"ticks: "</span>);
  Serial.println(t);
  delay(250);
}</div></div>` }] },

    { tag: "MAKE", kicker: "Build step 3 of 3", title: "Drive exactly one metre",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1.05fr;gap:22px;height:100%">
        <div class="stack">
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Do this</h3>
            <ol style="margin:4px 0 0 19px;line-height:1.7">
              <li>Mark a 1 m line on the floor with tape.</li>
              <li>Run the sketch. Measure where it actually stopped.</li>
              <li>Write the error down. Repeat five times.</li>
              <li>Now do it again with half-flat batteries. Did the error change?</li></ol></div></div>
          <div class="note teal"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>The point of the whole lesson</b><span>With time-based driving, flat batteries ruin the distance. With ticks, they do not. Prove it to yourself.</span></div></div>
        </div>
        <div class="code" style="align-self:start"><span class="kw">const</span> <span class="kw">float</span> MM_PER_TICK = 10.2;

<span class="kw">void</span> driveMM(<span class="kw">int</span> mm) {
  noInterrupts(); ticks = 0; interrupts();
  <span class="kw">long</span> target = mm / MM_PER_TICK;

  forward();
  <span class="kw">while</span> (<span class="kw">true</span>) {
    noInterrupts();
    <span class="kw">long</span> t = ticks;
    interrupts();
    <span class="kw">if</span> (t &gt;= target) <span class="kw">break</span>;
  }
  halt();

  Serial.print(<span class="st">"stopped after "</span>);
  Serial.println(ticks);
}

<span class="kw">void</span> loop() { driveMM(1000); delay(4000); }</div></div>` }] },

    { tag: "TEST", kicker: "Test like an engineer", title: "Where the error comes from",
      blocks: [
        { t: "table", color: "red", cols: ["Try this", "What happens", "What it teaches"], rows: [
          ["Drive on tile, then on carpet", "Carpet is short by a few cm", "Wheel slip: ticks are not ground truth"],
          ["Run at speed 255 instead of 150", "It overshoots further", "The robot cannot stop instantly"],
          ["Use flat batteries", "Distance stays right, time changes", "This is exactly why we count"],
          ["Cover the sensor with a finger", "Count freezes, robot never stops", "Always add a timeout as a safety net"],
          ["Count 10 turns, divide by 10", "A much better mm-per-tick", "Averaging beats one measurement"],
        ] },
        { t: "note", l: "Overshoot", text: "Stopping at exactly the target tick still overshoots, because the robot has momentum. Subtract a few ticks, or slow down near the end." },
      ] },

    { tag: "LEVEL UP", kicker: "Finished early?", title: "Go further",
      blocks: [{ t: "rows", items: [
        { t: "Work out **speed**: ticks in a 100 ms window × 10", a: "Print it live and push the robot by hand.", color: "teal", icon: "graph" },
        { t: "Fit **two encoders** and keep both wheels at the same count", a: "This is how a robot drives genuinely straight.", color: "blue", icon: "gears" },
        { t: "Turn exactly **90 degrees** using ticks instead of time", a: "Work out the arc length from the wheel spacing.", color: "purple", icon: "map" },
        { t: "Add a **slow-down zone** in the last 50 mm", a: "Overshoot drops to almost nothing.", color: "orange", icon: "wave" },
      ] }] },

    check([
      { t: "Explain **ticks and circumference**", a: "Proof: I worked out my own mm per tick from a measured wheel", color: "teal" },
      { t: "Count ticks with an **interrupt**", a: "Proof: one hand turn printed exactly my slot count", color: "blue" },
      { t: "Drive an **exact distance**", a: "Proof: within 3 cm of a metre, five times running", color: "orange" },
      { t: "Work out **speed** from ticks per second", a: "Proof: the number rose when I pushed the robot faster", color: "purple" },
    ]),

    { tag: "WRAP UP", kicker: "Show what you know", title: "What did we learn?",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.15fr 1fr;gap:22px;height:100%">
        <div class="box fill c-teal"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Five things to keep</h3>
          <ul style="margin:6px 0 0 18px;line-height:1.85">
            <li>Time is not distance. Count the wheel.</li>
            <li>Circumference ÷ slots = millimetres per tick.</li>
            <li>Interrupts catch ticks that loop() would miss.</li>
            <li>ISRs stay tiny; shared variables are volatile.</li>
            <li>Encoders measure the wheel, not the world. Slip is real.</li>
          </ul></div></div>
        <div class="stack">
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Exit ticket</h3>
            <p>Your robot reports 1.00 m but the tape says 0.92 m. Give two possible causes and how you would tell them apart.</p></div></div>
          <div class="note teal"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Next class</b><span>ROB-08: feedback control. Now that the robot can measure itself, it can correct itself.</span></div></div>
        </div></div>` }] },

  ],
};
