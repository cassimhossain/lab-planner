window.RAI_LESSONS["IS-08"] = {
  fact: "Modern recycling plants use cameras and blasts of air to sort up to 1,000 items a minute.",
  think: { q: "How could a robot tell a bottle from a can, and push each into the right bin?", art: "♻️🤖", cap: "see → decide → sort",
    guesses: ["Weigh them", "Colour sensor", "Camera + AI!"],
    story: { h: "A mountain of rubbish", text: "Pakistan's cities produce tens of thousands of tonnes of waste every day. Sorting it by hand is slow, dirty and dangerous. Robots that can see are starting to help." },
    today: "we join **AI** (a model that recognises items) to **robotics** (a servo that sorts them) to make a working sorting machine." },
  objectives: [
    { t: "Train a model to recognise 3 items", proof: "the model names each item with high confidence" },
    { t: "Link the model's answer to a servo sorter", proof: "the flap moves to the right bin for each item" },
    { t: "Measure how well the sorter works", proof: "I filled the accuracy and speed table" }
  ],
  video: { title: "AI-powered recycling robots", search: "AI recycling sorting robot how it works", mins: 5,
    watch: ["How does the robot see the rubbish?", "How does it move items into the right place?", "What mistakes can it make?"] },
  learn: [
    { kicker: "Big idea", title: "An intelligent system has three parts",
      boxes: [{ h: "Perception (AI)", text: "A camera and a trained model answer: what is this?", color: "purple" },
              { h: "Decision", text: "Rules turn the answer into a choice: bottle → left bin.", color: "blue" },
              { h: "Action (robotics)", text: "A servo moves a flap to push the item.", color: "green" }],
      art: "📷🧠⚙️" },
    { kicker: "Not sure?", title: "Confidence decides safely",
      text: "The model gives a confidence for each class. A good sorter only acts when it's sure.", points: ["Confidence ≥ 80%: sort it", "Below 80%: put it in the **'check' bin** for a human", "Wrong sorting costs more than slow sorting"],
      reveal: { q: "Why not just always pick the class with the highest confidence?", a: "With 40% bottle / 35% can / 25% paper the model is basically guessing. Sending it to a 'check' bin avoids a costly mistake. Real factories do exactly this." } },
    { kicker: "Connecting AI to hardware", title: "From prediction to movement",
      code: "when model says 'bottle' (and sure)\n    set servo to 30°   # left bin\nwhen model says 'can'\n    set servo to 90°   # middle bin\nwhen model says 'paper'\n    set servo to 150°  # right bin\notherwise\n    set servo to 90° and wait",
      side: [{ h: "PictoBlox does both", text: "Its Machine Learning extension runs the image model on the laptop and its Arduino blocks move the servo over USB.", color: "teal" }],
      note: { l: "Engineer tip", text: "Wait for the flap to finish moving before checking the next item." } }
  ],
  quiz: [
    { q: "The model says 45% can, 40% bottle. A careful sorter should...", options: ["Sort it as a can", "Sort it as a bottle", "Send it to the 'check' bin", "Switch off"], answer: 2, why: "Neither answer is confident, so a human should check." },
    { q: "Which part of the sorter is the AI?", options: ["The servo", "The image model", "The cardboard bins", "The USB cable"], answer: 1, why: "The model does the perception; the servo is robotics." }
  ],
  real: [
    { art: "🏭", name: "Recycling plants", text: "Cameras + AI spot materials on fast belts; air jets push each item to its line." },
    { art: "🍎", name: "Fruit packing", text: "Machines grade apples by colour, size and bruises, hundreds per minute." },
    { art: "📦", name: "Warehouses", text: "Robots read labels and sort parcels into delivery routes." }
  ],
  game: { title: "Human sorting line", mins: 6, big: "A sorting system = perception + decision + action. Each part must be fast and reliable.",
    steps: ["Three students: the Camera (eyes open), the Brain (holds the rule card), the Arm (points to the bin).", "The Camera may only say what it sees in 3 words; the Brain decides the bin; the Arm moves.", "Feed 10 picture cards quickly. Count mistakes and time.", "Add a 'not sure' rule and run again."] },
  kitNote: "Use 3 clean, safe items: a plastic bottle, a can and scrunched paper. Make three bins from a cardboard box and a servo flap at the front.",
  simWhy: "**Teachable Machine** to explore the model first. **PictoBlox** (free download) to run the model and move the servo from the same blocks program.",
  builds: [
    { title: "Train the eyes", mins: 15, sim: "teachable", steps: ["In PictoBlox: Machine Learning Environment → **Image Classifier**.", "Classes: bottle, can, paper, **empty**.", "Record 40 pictures per class at the sorting spot, items turned different ways.", "Train and test each item 5 times."], art: "📸" },
    { title: "Build the sorter", mins: 15, steps: ["Glue a servo horn to a cardboard flap at the front of the bins.", "Servo: brown → GND, red → 5V, orange → **pin 9**.", "Test angles 30°, 90°, 150° with a short program.", "Mark the three positions on the box."], art: "📦⚙️",
      side: [{ h: "Safety", text: "Keep fingers away from the flap while it moves.", color: "red" }] },
    { title: "Connect brain to arm", mins: 15, sim: "pictoblox", steps: ["Add the Arduino Uno extension and connect over USB.", "Forever: analyse the image from the camera.", "If 'bottle' and confidence > 0.8 → servo 30°, wait 1 s, servo 90°.", "Same for can (90°, push) and paper (150°).", "Otherwise: show 'Not sure!' and keep the flap closed."],
      note: { l: "Tip", text: "Run the model only every half second. It gives the servo time and stops the flap from flickering." } }
  ],
  test: { title: "Sorting accuracy and speed", intro: "Feed 10 items of each type. Count correct, wrong and 'not sure'.",
    cols: ["Item", "Correct", "Wrong bin", "Not sure", "Time for 10 items"],
    rows: [["Bottle", "", "", "", ""], ["Can", "", "", "", ""], ["Paper", "", "", "", ""], ["Mixed (your choice)", "", "", "", ""]] },
  levelup: { choices: [{ t: "Belt", d: "Use a stepper to roll a cardboard belt and sort items as they arrive." }, { t: "Counter", d: "Count each type and show totals on the OLED." }, { t: "New material", d: "Add glass (a picture card) as a 4th class." }, { t: "Faster", d: "Lower the delay. When does accuracy drop?" }],
    think: { h: "Think like an engineer", text: "Your sorter is 90% accurate. Is that good enough for a factory sorting 1,000 items a minute? How many mistakes is that?" }, boss: "Log every decision with its confidence to a file and find which item is most often confused." },
  debate: { kicker: "Think about it", title: "Robots and jobs", a: { h: "Robots should sort waste", points: ["Sorting by hand is dirty and dangerous", "More recycling helps the environment", "Machines work day and night"] },
    b: { h: "But think about...", points: ["People who earn a living sorting waste", "Who fixes and trains the robots?", "Could robots and people work together?"] }, note: { l: "Your view", text: "Write one sentence: how should a city bring in sorting robots fairly?" } },
  wrap: { learned: ["An intelligent system = perception + decision + action", "A trained model can be the 'eyes' of a robot", "Confidence thresholds make AI safer", "Measure accuracy and speed honestly", "Automation changes jobs; plan it fairly"],
    exit: "Draw your sorter and label the AI part, the decision part and the robot part.", home: "At home, sort one day's rubbish into 3 types. What was hard to decide?", next: "**IS-09 Follow-the-Object Robot**: vision that steers a moving robot." },
  guide: {
    grouping: "Teams of 3 (model, mechanism, code)",
    overview: "A capstone-style integration lesson that connects a trained image model to a physical actuator. The engineering lessons are **confidence thresholds**, **timing between sensing and acting**, and **measuring a system**, not just showing it works once. Plan for 2 sessions with younger or less experienced groups.",
    prep: ["Install PictoBlox on lab laptops and test the Arduino extension and camera", "Prepare 3 sets of safe items per team (rinsed bottles and cans, paper balls)", "Cardboard boxes and craft knives cut in advance by the teacher", "Upload a servo-sweep test sketch to check every servo works", "Optional: a printed 3-bin template"],
    timing: [[8, "Hook", "Waste story and video"], [10, "Learn", "Three parts, confidence, prediction to movement"], [6, "Game", "Human sorting line"], [15, "Build 1", "Train the model"], [15, "Build 2", "Build the sorter"], [15, "Build 3", "Connect model and servo"], [15, "Test", "Accuracy and speed table"], [16, "Wrap", "Debate, objective check, exit ticket"]],
    steps: [
      { phase: "Hook", title: "A mountain of rubbish", say: "If you had to sort 1,000 items a minute, what would you need?", do: ["Collect answers; steer towards eyes (camera), brain (model) and hands (actuator)."] },
      { phase: "Learn", title: "Confidence thresholds", do: ["Use the reveal: ask teams to decide before revealing.", "Show a live Teachable Machine model hesitating between two items."] },
      { phase: "Build", title: "Split the team, then join up", do: ["Assign roles: model trainer, mechanism builder, coder. Swap halfway.", "Insist on testing the servo angles before connecting the model.", "Check every team has an 'empty' class: without it the flap moves constantly."] },
      { phase: "Test", title: "Measure, don't just demo", do: ["Each team feeds 10 of each item and fills the table.", "Put class results on the board; discuss why accuracy differs."] },
      { phase: "Wrap", title: "Robots and jobs debate", do: ["Two-minute pair discussion, then a class vote.", "Exit ticket: labelled drawing."] }
    ],
    misconceptions: [["The servo 'sees' the item", "The servo only moves. The model sees; the code connects them."], ["If it worked once it works", "Systems must be measured many times; one success proves little."], ["Higher confidence threshold is always better", "Too high and nothing gets sorted. It's a trade-off."]],
    trouble: [["Flap twitches all the time", "No 'empty' class, or the model runs too often: add a wait and the empty class."], ["Servo jitters or Arduino resets", "Servo draws too much current: power it from a separate 5V supply with shared GND."], ["PictoBlox can't find the board", "Upload PictoBlox firmware in 'Upload mode', then switch to 'Stage mode'."], ["Model confuses bottle and can", "Add pictures of both at the sorting spot, under classroom lighting."]],
    tiers: {
      starter: ["Replace the camera model with the colour sensor: red card left, blue card right.", "Teacher builds the bins; children feed items and count.", "Focus on 'eyes, brain, hand'."],
      core: ["Full lesson as written over one long or two short sessions."],
      advanced: ["Add a conveyor belt with the stepper.", "Log decisions and confidences; compute a confusion matrix.", "Write a one-page system report with accuracy and throughput."] },
    assess: [
      { c: "System thinking", e: "Names camera and servo", s: "Explains perception, decision, action", x: "Explains trade-offs (threshold, speed, accuracy)" },
      { c: "Integration", e: "Parts work separately", s: "Model drives the servo correctly", x: "Robust: empty class, timing, threshold, logging" },
      { c: "Evaluation", e: "Shows it working", s: "Completes the accuracy table", x: "Analyses errors and proposes data fixes" }],
    safety: ["Only clean, dry, non-sharp items. No glass.", "Teacher cuts cardboard with craft knives.", "Fingers clear of the moving flap."]
  }
};
