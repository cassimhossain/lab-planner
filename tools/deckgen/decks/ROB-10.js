const { titleSlide, divider, objectives, check } = require("../lib.js");
const ART = require("../art.js");
const { DIAGRAMS } = require("../diagrams.js");

module.exports = {
  code: "ROB-10",
  title: "Balancing Robot",
  series: "Robotics · Motors & Motion Control",
  accent: "blue",
  slides: [

    titleSlide({
      series: "Robotics · Motors & Motion Control",
      main: "Balancing Robot", accentWords: ["Balancing"],
      hook: "Segways stay upright by falling forward and catching themselves, a hundred times a second.",
      pills: ["120 minutes", "Pairs", "Code Lab + PID Lab + real kit"],
      fig: DIAGRAMS.invPendulum(),
      note: "A two-wheeled balancing robot is an inverted pendulum, the same problem as balancing a broom on your palm. It is unstable by design: left alone it always falls.",
    }),

    { tag: "LEARN", kicker: "Let's think", title: "Balance a broom on your hand",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.1fr 1fr;gap:22px;height:100%">
        <div class="stack">
          <div class="box fill c-blue"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Try it, right now</h3>
            <p>Stand a ruler or a broom upright on your palm. To keep it up you must move your hand <strong>towards the direction it is falling</strong>.</p>
            <p style="margin-top:8px">Notice two things: you never stop moving, and you react to <em>lean</em>, not to position.</p></div></div>
          <div class="note"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Now try it with your eyes shut</b><span>Impossible. Without measurement there is no control. The robot's eyes are an MPU6050.</span></div></div>
        </div>
        <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Guess first</h3>
          <ul style="margin:6px 0 0 18px;line-height:1.8">
            <li>Is a long broom easier or harder than a short one?</li>
            <li>What happens if you react too strongly?</li>
            <li>What happens if you react a moment too late?</li>
            <li>Why can nobody balance a pencil?</li>
          </ul>
          <p style="margin-top:10px;color:#8A94A6">The answers are the whole of control theory, in your hand.</p></div></div></div>` }] },

    objectives([
      { t: "Read **tilt** from an MPU6050 and explain why one sensor is not enough", icon: "chip", color: "teal" },
      { t: "Combine accelerometer and gyro with a **complementary filter**", icon: "wave", color: "blue" },
      { t: "Balance an **inverted pendulum in simulation** and tune it", icon: "graph", color: "orange" },
      { t: "Build and tune a real **two-wheel balancing robot**", icon: "robot", color: "purple" },
    ], "inverted pendulum · IMU · accelerometer · gyroscope · drift · sensor fusion · complementary filter · PID · setpoint · overshoot"),

    { tag: "LEARN", kicker: "Objective 1 · The sensor", title: "Two sensors, both wrong",
      bodyStyle: "display:grid;grid-template-columns:1.2fr 1fr;gap:22px",
      blocks: [
        { t: "figbox", name: "compFilter", color: "teal", h: "Each fixes the other's fault", style: "min-height:0" },
        { t: "html", html: `<div class="stack">
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3 ic="chip">Accelerometer</h3>
            <p>Measures which way gravity pulls, so it always knows true vertical. But every motor vibration shakes it, so the reading jumps about.</p></div></div>
          <div class="box fill c-blue"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3 ic="gears">Gyroscope</h3>
            <p>Measures how fast you are rotating. Add it up over time and you get an angle: beautifully smooth, but it <strong>drifts</strong> a degree every few seconds.</p></div></div>
          <div class="note"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Fusion</b><span>Trust the gyro for the short term and the accelerometer for the long term. One line of code does it.</span></div></div>
        </div>` },
      ] },

    { tag: "LEARN", kicker: "Objective 2 · The filter", title: "One line that makes it work",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.05fr 1fr;gap:22px;height:100%">
        <div class="stack">
          <div class="code" style="align-self:start">angle = 0.98 * (angle + gyro * dt)
      + 0.02 * accelAngle;</div>
          <div class="box fill c-purple"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Read it out loud</h3>
            <p>"Mostly, carry on from where I was and add how far I just rotated. But nudge 2% of the way towards what gravity says, every time."</p></div></div>
        </div>
        <div class="stack">
          <div class="box fill c-green"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Why 0.98?</h3>
            <p>It sets how long the filter remembers the gyro. At 100 Hz, 0.98 means roughly half a second of trust before gravity wins. Too high and drift creeps in; too low and vibration gets through.</p></div></div>
          <div class="box fill c-red"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>dt matters</h3>
            <p>Gyro gives degrees <em>per second</em>. Multiply by the real loop time. If your loop time wanders, your angle wanders with it, so fix the loop at a steady 10 ms.</p></div></div>
        </div></div>` }] },

    { tag: "LEARN", kicker: "Objective 3 · Control", title: "Measure, compare, correct",
      bodyStyle: "display:grid;grid-template-columns:1.25fr 1fr;gap:22px",
      blocks: [
        { t: "figbox", name: "feedbackLoop", color: "blue", h: "The loop that never stops", style: "min-height:0" },
        { t: "html", html: `<div class="stack">
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Error is the only input</h3>
            <p>error = <strong>0°</strong> (upright) − measured angle. The controller never thinks about "upright"; it only ever reduces a number towards zero.</p></div></div>
          <div class="box fill c-purple"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>P, I and D</h3>
            <p><strong>P</strong> pushes in proportion to the lean now. <strong>I</strong> clears up a small permanent lean. <strong>D</strong> brakes, by reacting to how fast the lean is changing.</p></div></div>
        </div>` },
      ] },

    { tag: "LEARN", kicker: "Objective 3 · Tuning", title: "What a bad gain looks like",
      bodyStyle: "display:grid;grid-template-columns:1.3fr 1fr;gap:22px",
      blocks: [
        { t: "figbox", name: "pidShapes", color: "purple", h: "Read the shape, not the feeling", style: "min-height:0" },
        { t: "html", html: `<div class="stack">
          <div class="box fill c-red"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Too much P</h3>
            <p>Over-corrects, shoots past upright, over-corrects the other way. The robot shakes itself to the floor.</p></div></div>
          <div class="box fill c-blue"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Too little P</h3>
            <p>Leans and keeps leaning. It never catches up with its own fall.</p></div></div>
          <div class="note teal"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>The method</b><span>Raise P until it oscillates. Then add D until the oscillation stops. Only then add a little I. One change at a time, written down.</span></div></div>
        </div>` },
      ] },

    { tag: "LEARN", kicker: "In the real world", title: "Inverted pendulums you have met",
      blocks: [{ t: "html", html: `<div class="cols c3" style="flex:1 1 auto;min-height:0;display:grid;gap:18px">
        <div class="box fill c-blue"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3 ic="hand">You, standing up</h3>
          <p>Your ankles make tiny corrections constantly. Stand still and feel them. Your inner ear is the IMU.</p></div></div>
        <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3 ic="star">A rocket on launch</h3>
          <p>Thrust is below the mass, so it is an inverted pendulum too. The engine gimbals to keep it pointing up.</p></div></div>
        <div class="box fill c-purple"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3 ic="robot">A Segway</h3>
          <p>Lean forward and the wheels drive forward to get back under you. You are steering by deliberately falling.</p></div></div></div>` }] },

    divider({
      part: "Part 2 · Make it", main: "Simulate, then build",
      sub: "Tune it where nothing can break, then move the numbers onto a real robot.",
      pills: ["80 minutes", "Pairs", "PID Lab then kit"],
      art: ART.svg("robot"),
    }),

    { tag: "MAKE", kicker: "Before you build", title: "What you need",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;height:100%">
        <div class="box fill c-teal"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3 ic="breadboard">Kit, per pair</h3>
          <ul style="margin:6px 0 0 18px;line-height:1.8">
            <li>MPU6050 IMU</li>
            <li>2WD chassis, rebuilt <strong>tall</strong>: battery at the top</li>
            <li>L298N motor driver</li>
            <li>Arduino Uno + USB cable</li>
            <li>18650 cell + holder</li>
          </ul></div></div>
        <div class="box fill c-red"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3 ic="robot">Build it tall on purpose</h3>
          <p>A short robot falls too fast for an Uno to catch. Put the heavy battery <strong>as high as you can</strong>.</p>
          <p style="margin-top:8px">This is the broom-versus-pencil question from the start of the lesson, and now it is your design decision.</p>
          <p style="margin-top:8px;color:#8A94A6">Keep fingers away from the wheels. Test over a soft surface.</p></div></div></div>` }] },

    { tag: "MAKE", kicker: "Wiring", title: "Sensor and motors on one board",
      bodyStyle: "display:grid;grid-template-columns:1.3fr 1fr;gap:20px",
      blocks: [
        { t: "circuit", name: "balance", color: "blue", h: "IMU on I2C, motors through the driver", style: "min-height:0" },
        { t: "conn", color: "purple", h: "Connections", from: "Arduino Uno", to: "Module", why: "Carries",
          rows: [
            { w: "pwr", a: "5V", b: "MPU VCC", c: "power for the IMU" },
            { w: "out", a: "A4", b: "MPU SDA", c: "tilt data" },
            { w: "aux", a: "A5", b: "MPU SCL", c: "the I2C clock" },
            { w: "out", a: "7, 8, 9, 11", b: "IN1-IN4", c: "motor directions" },
            { w: "out", a: "5, 6", b: "ENA, ENB", c: "motor speed (PWM)" },
            { w: "gnd", a: "GND", b: "all GND", c: "one shared reference" },
          ],
          foot: "The 18650 feeds +12V on the driver. Its minus joins the same ground as everything else." },
      ] },

    { tag: "MAKE", kicker: "Build step 1 of 4", title: "Read the angle",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1.05fr;gap:22px;height:100%">
        <div class="stack">
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Do this</h3>
            <ol style="margin:4px 0 0 19px;line-height:1.7">
              <li>Wire the MPU6050 to A4 and A5 (it is I2C: see EF-10).</li>
              <li>Print the raw accelerometer angle. Tilt it. Tap the desk.</li>
              <li>Print the gyro-only angle. Leave it still for a minute.</li>
              <li>Now print the fused angle and compare all three.</li></ol></div></div>
          <div class="note"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Watch the drift</b><span>Leave the gyro-only version running while you do step 2. Come back and see how far it has wandered.</span></div></div>
        </div>
        <div class="code" style="align-self:start"><span class="kw">float</span> angle = 0;
<span class="kw">unsigned</span> <span class="kw">long</span> last = 0;

<span class="kw">float</span> readAngle() {
  <span class="kw">float</span> dt = (millis() - last) / 1000.0;
  last = millis();

  <span class="kw">float</span> aAng = atan2(ay, az) * 57.2958;
  <span class="kw">float</span> gRate = gx / 131.0;    <span class="cm">// deg/sec</span>

  angle = 0.98 * (angle + gRate * dt)
        + 0.02 * aAng;
  <span class="kw">return</span> angle;
}</div></div>` }] },

    { tag: "MAKE", kicker: "Build step 2 of 4", title: "Tune it in the PID Lab",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.1fr 1fr;gap:22px;height:100%">
        <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Do this</h3>
          <ol style="margin:6px 0 0 19px;line-height:1.75">
            <li>Open <strong>Simulators → PID Lab</strong> and choose the pendulum.</li>
            <li>Set I and D to zero. Raise P until it wobbles forever.</li>
            <li>Halve P. Now raise D until the wobble dies away.</li>
            <li>Nudge the pendulum. Does it recover in under a second?</li>
            <li>Write your three numbers on the board.</li></ol></div></div>
        <div class="stack">
          <div class="box fill c-green"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Why simulate first</h3>
            <p>In the simulator a bad gain costs you nothing. On the desk it costs a snapped motor bracket and ten minutes.</p></div></div>
          <div class="note teal"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>Compare across the class</b><span>Every pair will land on slightly different numbers. That is correct: the gains belong to the machine, not to the theory.</span></div></div>
        </div></div>` }] },

    { tag: "MAKE", kicker: "Build step 3 of 4", title: "Close the loop for real",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1.05fr;gap:22px;height:100%">
        <div class="stack">
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Do this</h3>
            <ol style="margin:4px 0 0 19px;line-height:1.7">
              <li>Hold the robot upright and note the angle it reads. That is your true zero.</li>
              <li>Start with the PID Lab numbers, divided by two.</li>
              <li>Hold it, power on, and let go of it slowly.</li>
              <li>Change <strong>one</strong> gain. Try again. Log what happened.</li></ol></div></div>
          <div class="box fill c-red"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3>Safety cutout</h3>
            <p>Past 35 degrees the robot cannot recover. Cut the motors instead of letting it thrash on the floor.</p></div></div>
        </div>
        <div class="code" style="align-self:start"><span class="kw">float</span> Kp = 22, Ki = 0.4, Kd = 1.4;
<span class="kw">float</span> integral = 0, prev = 0;

<span class="kw">void</span> loop() {
  <span class="kw">float</span> a = readAngle();
  <span class="kw">float</span> err = 0 - a;           <span class="cm">// 0 = upright</span>

  integral += err * 0.01;
  integral = constrain(integral, -50, 50);
  <span class="kw">float</span> deriv = (err - prev) / 0.01;
  prev = err;

  <span class="kw">int</span> out = Kp*err + Ki*integral + Kd*deriv;
  out = constrain(out, -255, 255);

  <span class="kw">if</span> (abs(a) &gt; 35) out = 0;    <span class="cm">// given up</span>
  drive(out, out);
  delay(10);                   <span class="cm">// steady 100 Hz</span>
}</div></div>` }] },

    { tag: "MAKE", kicker: "Build step 4 of 4", title: "Keep a tuning log",
      blocks: [
        { t: "table", color: "blue", cols: ["Try", "Kp", "Ki", "Kd", "What it did"], rows: [
          ["1", "22", "0", "0", "Shook fast and fell in under a second"],
          ["2", "11", "0", "0", "Leaned slowly and fell, no shaking"],
          ["3", "16", "0", "0.8", "Held for 3 seconds, then drifted off"],
          ["4", "16", "0.4", "1.4", "Held, recovered from a nudge"],
          ["5", "...", "...", "...", "Your turn"],
        ] },
        { t: "note", l: "Why the log matters", text: "Without it you will change two things at once, it will work, and you will never know which one did it." },
      ] },

    { tag: "TEST", kicker: "Test like an engineer", title: "Prove it is really controlling",
      blocks: [
        { t: "table", color: "red", cols: ["Try this", "What should happen", "What it teaches"], rows: [
          ["Nudge it gently", "It leans, then recovers", "That is closed loop working"],
          ["Put a book on top", "It needs more Kp to hold", "Gains belong to the machine, not the maths"],
          ["Tilt the floor slightly", "It creeps downhill and holds", "I is correcting a permanent error"],
          ["Set Kd to zero", "The wobble returns", "D is the brake"],
          ["Drop the loop to 20 Hz", "It fails completely", "Control is about speed as much as gains"],
        ] },
        { t: "note", l: "Battery voltage counts", text: "Gains that worked on a full cell will be too weak on a flat one. Retune, or note the voltage next to every log entry." },
      ] },

    { tag: "LEVEL UP", kicker: "Finished early?", title: "Go further",
      blocks: [{ t: "rows", items: [
        { t: "Add **remote steering** over Bluetooth by shifting the setpoint", a: "Ask it to lean 2 degrees and it drives forward.", color: "teal", icon: "phone" },
        { t: "Plot the angle live with the **Serial Plotter**", a: "Now you can see overshoot instead of guessing at it.", color: "blue", icon: "graph" },
        { t: "Add **encoders** so it holds its position, not just its angle", a: "Two loops, one inside the other.", color: "purple", icon: "gears" },
        { t: "Measure **recovery time** after a standard nudge", a: "A real number to compare your tunings with.", color: "orange", icon: "wave" },
      ] }] },

    check([
      { t: "Read **tilt** from an MPU6050", a: "Proof: I showed accelerometer noise and gyro drift separately", color: "teal" },
      { t: "Fuse the two with a **complementary filter**", a: "Proof: my fused angle was steady and did not drift", color: "blue" },
      { t: "Balance an inverted pendulum **in simulation**", a: "Proof: it recovered from a nudge in the PID Lab", color: "orange" },
      { t: "Build and tune a **real balancing robot**", a: "Proof: it stood up, and my tuning log explains why", color: "purple" },
    ]),

    { tag: "WRAP UP", kicker: "Show what you know", title: "What did we learn?",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.15fr 1fr;gap:22px;height:100%">
        <div class="box fill c-teal"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3 ic="book">Five things to keep</h3>
          <ul style="margin:6px 0 0 18px;line-height:1.85">
            <li>A balancing robot is an inverted pendulum: unstable by nature.</li>
            <li>Accelerometers are noisy; gyros drift. Fuse them.</li>
            <li>Error is the only thing a controller ever sees.</li>
            <li>P pushes, D brakes, I clears up what is left.</li>
            <li>Tune one gain at a time, and write it down.</li>
          </ul></div></div>
        <div class="stack">
          <div class="box fill c-orange"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><h3 ic="pencil">Exit ticket</h3>
            <p>Your robot shakes rapidly and falls. Which gain would you change first, up or down, and why?</p></div></div>
          <div class="note teal"><svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><div class="inner"><b>At home</b><span>Watch a lift arrive at a floor. It slows before it stops. That is D, working in a building.</span></div></div>
        </div></div>` }] },

  ],
};
