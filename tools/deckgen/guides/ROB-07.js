/* Teacher guide: ROB-07 Encoders: How Far Did I Go? Built by guide.js. */
module.exports = {
  code: "ROB-07",
  grouping: "Pairs, using their ROB-05 robot",

  overview: "Students discover that driving 'for two seconds' gives a different distance every time, and replace time with counting. They fit an LM393 slotted-disc sensor to the ROB-05 robot, work out millimetres per tick from their own wheel, count ticks with an interrupt so none are missed, and drive exactly one metre, measuring the error. They finish by finding where the remaining error comes from.",
  mustLand: "Time is not distance. Count the wheel: circumference ÷ slots gives millimetres per tick, and an interrupt makes sure no tick is missed. Encoders measure the wheel, not the floor, so slip is still real.",

  outcomes: [
    "Explain **encoder ticks** and turn wheel circumference into millimetres per tick.",
    "Count ticks with an **interrupt**, not a polling loop, and say why.",
    "Drive an **exact distance** and measure the error.",
    "Work out **speed** from ticks per second.",
  ],

  depths: {
    starter: "Count wheel turns by hand along a 1 m line (the class game), then fit the sensor and watch the count rise as the wheel is turned. Stop after build step 2.",
    core: "Full lesson: the maths with their own wheel, interrupt counting, then the 1 m drive repeated five times with the error recorded.",
    advanced: "Speed from ticks in a 100 ms window, a slow-down zone in the last 50 mm, and a 90° turn by ticks using the wheel spacing.",
  },

  kit: [
    "The pair's ROB-05 robot car (chassis, L298N, Uno, battery pack)",
    "★IR speed sensor module (LM393) with a 20-slot encoder disc",
    "Female-female or male-female jumper wires",
    "Tape measure or metre rule, masking tape for a 1 m line",
    "Calculator (or phone) for the circumference maths",
  ],
  sims: [
    "**Circuit Lab**: the sensor and interrupt counting can be tried on screen before the real build.",
    "**Code Lab**: practise the circumference and ticks maths in Python first.",
  ],
  prep: [
    "Order LM393 sensors and encoder discs in advance: they are ★ not in the lab yet. Most 2WD chassis kits include the discs.",
    "Check each ROB-05 robot still drives and has the forward() and halt() functions; the 1 m sketch uses them.",
    "Tape a 1 m line with a clear start mark for each table or on the corridor floor.",
    "Keep a set of half-flat AA cells to show that tick-counting ignores battery level.",
    "Try one sensor yourself: adjust its trimmer until the LED flickers cleanly as the disc turns.",
  ],

  timing: [
    [5, "Let's think", "The same code, four distances (slide 2)."],
    [3, "Aims", "The four aims and keywords (slide 3)."],
    [22, "Teach", "The sensor, ticks to centimetres, why interrupts, real examples (slides 4 to 7)."],
    [10, "Count the wheel", "Push the robot 1 m and count turns; round two: slip (slide 9)."],
    [15, "Fit the sensor", "Disc on the axle, LM393 in the gap, see the raw 1s and 0s (slides 10, 11)."],
    [10, "Count with an interrupt", "One hand turn should print 20 (slide 12)."],
    [15, "Drive one metre", "Five runs, record the error, then flat batteries (slide 13)."],
    [5, "Where the error comes from", "Two rows of the test table (slide 14)."],
    [5, "Check and exit ticket", "Self-rating; the 1.00 m vs 0.92 m question (slides 16, 17)."],
  ],

  steps: [
    { phase: "Let's think", mins: 5, slides: "1-2",
      say: ["Same code, `forward(); delay(2000);`, run four times: 118 cm, 94, 86, 71. What changed?",
        "Time only turns into distance if speed never changes. On a real robot it changes all the time."],
      do: ["If you have time, run it live once on fresh and once on flat batteries."] },
    { phase: "Aims", mins: 3, slides: "3",
      say: ["By the end your robot stops at one metre whatever the batteries are doing."] },
    { phase: "Teach", mins: 22, slides: "4-7",
      say: ["An infrared beam shines across a gap. The slotted disc on the axle chops it. Each chop is one tick.",
        "Circumference is π times the diameter: 3.14 × 65 mm = 204 mm. With 20 slots that is 10.2 mm per tick, so a metre is about 98 ticks.",
        "A wheel can make 200 ticks a second. If loop() also prints and reads sensors it may only look 50 times a second, and the missed ticks never come back.",
        "An interrupt says: whenever pin 2 rises, drop everything and add one. Nothing is missed.",
        "Two rules: keep the interrupt function tiny, and mark its variable `volatile`."],
      do: ["Slide 5: every pair measures their real wheel by rolling it one turn along a ruler, and works out their own mm per tick.",
        "Slide 6: act out polling vs interrupt: a student checking a door every minute vs a doorbell."],
      watch: "students using 65 mm without measuring. Rubber tyres are often 66 or 67 mm, which is a 3% error." },
    { phase: "Count the wheel", mins: 10, slides: "9",
      say: ["You are about to do odometry with your eyes. The encoder only does it faster."],
      do: ["Tape a mark on one wheel; push the robot 1 m; count turns including the fraction; work out one turn's distance.",
        "Round two: hold one wheel so it slides. The ticks say you moved; the floor says you did not."] },
    { phase: "Fit the sensor", mins: 15, slides: "10-11",
      say: ["See the raw signal before you count it. If the 1s and 0s are messy, counting will be wrong."],
      do: ["Disc on the axle inside the chassis; clamp the LM393 so the disc runs through its gap.", "VCC→5V, GND→GND, OUT→pin 2.", "Upload the raw sketch; turn the wheel slowly and watch 1 1 1 0 0 0."],
      watch: "a module LED that stays on or off. The disc is not in the gap, or the trimmer needs turning until the LED just flickers." },
    { phase: "Count with an interrupt", mins: 10, slides: "12",
      say: ["The noInterrupts() lines make a safe copy of the count, so an interrupt cannot land halfway through reading it."],
      do: ["Upload the interrupt sketch; turn the wheel one full turn by hand.", "It should print 20 (or your disc's slot count). Use your number from now on."],
      watch: "counts that jump by two or three per slot. That is a noisy edge; adjust the sensor's trimmer or alignment." },
    { phase: "Drive one metre", mins: 15, slides: "13",
      say: ["Prove it to yourself: with ticks, flat batteries change the time, not the distance."],
      do: ["Add `driveMM()` to the ROB-05 sketch (it uses their forward() and halt()); set MM_PER_TICK to their own number.",
        "Five runs from the start mark; record where it stopped each time.", "Swap in half-flat cells and run again."],
      watch: "the robot stopping a little past 1 m every time. That is momentum; it is the next table's lesson, not a bug." },
    { phase: "Where the error comes from", mins: 5, slides: "14",
      say: ["Stopping exactly at the target tick still overshoots, because the robot has momentum."],
      do: ["Pairs try two rows: carpet vs tile, speed 255, or covering the sensor (and see why a timeout is needed)."] },
    { phase: "Check and exit ticket", mins: 5, slides: "16-17",
      say: ["Rate yourself and be ready to show your error measurements."],
      do: ["Exit ticket: the robot reports 1.00 m but the tape says 0.92 m. Two causes, and how to tell them apart."] },
  ],

  misconceptions: [
    ["Driving for a fixed time gives a fixed distance.", "Only if speed never changes. Batteries, floor and load all change speed."],
    ["The encoder measures how far the robot moved.", "It measures how far the wheel turned. If the wheel slips, the count is wrong."],
    ["loop() is fast enough to see every tick.", "Not when it also prints or reads sensors. Missed ticks are lost for good, so use an interrupt."],
    ["One sensor knows forward from backward.", "One beam cannot tell direction. A quadrature encoder (two offset sensors) can."],
    ["The wheel is exactly the size on the box.", "Measure it: one rolled turn along a ruler. Tyres vary by a few millimetres."],
  ],

  trouble: [
    ["Count never changes", "OUT must go to pin 2 (an interrupt pin on the Uno: 2 or 3). Check the disc passes through the gap."],
    ["Count jumps several per slot", "Noisy edges: adjust the trimmer, steady the sensor, or check a loose wire."],
    ["Robot never stops", "The count froze (sensor blocked or disconnected). Add a timeout: stop after a maximum time as a safety net."],
    ["Always overshoots by a few cm", "Momentum. Stop a few ticks early, or slow down in the last 50 mm."],
    ["Distance short on carpet", "Wheel slip. Ticks are not ground truth; test on a hard floor."],
    ["Prints 19 or 21 for one turn", "Normal at the start and end of a hand turn. Count ten turns and divide by ten."],
  ],

  rubric: [
    ["Ticks to distance", "Uses the given 10.2 mm with help.", "Measures their own wheel and works out mm per tick.", "Explains how resolution limits accuracy and averages over many turns."],
    ["Interrupts", "Runs the interrupt sketch.", "Explains why polling misses ticks and why the variable is volatile.", "Explains the safe copy with noInterrupts(), or measures speed in a time window."],
    ["Exact distance", "Robot stops roughly near 1 m.", "Within 3 cm of 1 m, five times; records the error.", "Adds a slow-down zone or timeout and shows the error shrink."],
  ],

  answers: [
    ["Slide 5: mm per tick and ticks for one metre?", "π × 65 = 204 mm; 204 ÷ 20 = 10.2 mm per tick; 1000 ÷ 10.2 ≈ 98 ticks."],
    ["Slide 6: Why must the ISR variable be volatile?", "It changes outside the normal flow of the program. Without volatile the compiler may keep an old copy and never see the new count."],
    ["Slide 14: Cover the sensor with a finger. What happens?", "The count freezes, so the robot never reaches its target and never stops. Always add a timeout."],
    ["Exit ticket: reports 1.00 m, tape says 0.92 m.", "Wheel slip (check: test on tile vs carpet; slip changes with surface), or the wrong mm per tick (check: roll the wheel one turn on a ruler; if it is wrong the error is the same on every surface)."],
  ],

  safety: [
    "Wheels off the desk while fitting and testing the sensor.",
    "Battery out before fitting the disc or moving wires.",
    "Run the 1 m drives on the floor, away from table edges and feet.",
    "Keep fingers clear of the wheels and the disc while the motors can run.",
  ],
};
