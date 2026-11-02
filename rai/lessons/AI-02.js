window.RAI_LESSONS["AI-02"] = {
  fact: "The photo app on your phone learned to recognise cats from millions of pictures that people had labelled by hand.",
  think: { q: "How can a computer that has never seen a banana learn to spot one?", art: "🍌📷", cap: "examples, not rules",
    guesses: ["Someone types the rules", "It searches the internet", "We show it examples!"],
    story: { h: "Try writing the rule", text: "\"A banana is yellow and curved.\" But some are green. Some are brown. Some are straight. Some are in a bowl with lemons. Rules break fast. Examples don't." },
    today: "we teach a computer to tell objects apart by **showing it examples**, then we try to trick it." },
  objectives: [
    { t: "Collect and label training examples", proof: "my model has at least 3 classes with 30+ pictures each" },
    { t: "Train a model and test it fairly", proof: "I tested it on things it never saw while training" },
    { t: "Explain why varied examples make better AI", proof: "I can show one mistake and how more data fixed it" }
  ],
  video: { title: "How machine learning works (for beginners)", search: "how does machine learning work explained simply", mins: 5,
    watch: ["What does 'training' mean?", "Why does the computer need so many examples?", "What happens when the examples are all the same?"] },
  learn: [
    { kicker: "Big idea", title: "Rules versus learning",
      boxes: [{ h: "Normal programming", text: "You write the rules.\nIF yellow AND curved THEN banana.", color: "blue" },
              { h: "Machine learning", text: "You give examples with answers (labels).\nThe computer finds the rules itself.", color: "purple" }],
      art: "📏➡️🧠", cap: "from rules to examples",
      note: { l: "Key words", text: "**Training data** = the examples. **Label** = the right answer for each one. **Model** = what the computer learns." } },
    { kicker: "How it learns", title: "Classes, examples and a guess",
      text: "We make **classes**: groups with a name, like banana, apple, nothing.", points: ["Each class gets lots of example pictures", "Training: the computer looks for patterns that separate the classes", "Afterwards it gives a **confidence** for each class: 92% banana, 6% apple, 2% nothing"],
      reveal: { q: "Why do we need a 'nothing' class?", a: "Without it the model must pick banana or apple even when you show it your empty hand. A 'nothing' (background) class lets it say 'I see neither'." },
      art: "📊", cap: "a guess with a confidence" },
    { kicker: "The secret", title: "Good data beats a clever computer",
      boxes: [{ h: "Bad training data", points: ["All photos on the same desk", "Always held the same way", "Only one person's hand"], color: "red" },
              { h: "Good training data", points: ["Different backgrounds and lighting", "Turned, near, far, half hidden", "Different people holding it"], color: "green" }],
      note: { l: "Remember", text: "The model only knows what you show it. If every banana photo has a blue desk behind it, it might learn **blue desk**, not banana!" } },
    { kicker: "Deeper", title: "Training, testing and overfitting", only: ["advanced"],
      text: "Keep some pictures **out** of training. Test on those.", points: ["Training accuracy: how well it does on pictures it studied", "Test accuracy: how well it does on new pictures (the honest score)", "**Overfitting:** great on training, poor on new data. It memorised instead of learning."],
      art: "📚 vs 📝" }
  ],
  quiz: [
    { q: "What is a label in machine learning?", options: ["A sticker on the laptop", "The right answer for an example", "The name of the program", "A type of camera"], answer: 1, why: "Each training example comes with its label, like 'banana'." },
    { q: "Your model works for you but not for your friend. The best fix is...", options: ["Train longer with the same pictures", "Buy a faster computer", "Add training pictures of your friend and others", "Delete a class"], answer: 2, why: "More varied examples help the model work for everyone." }
  ],
  real: [
    { art: "📱", name: "Phone photos", text: "Search your gallery for 'dog' or 'beach': a model trained on labelled photos finds them." },
    { art: "🩺", name: "Medical scans", text: "Models trained on thousands of labelled X-rays help doctors spot problems early." },
    { art: "♻️", name: "Recycling plants", text: "Cameras sort plastic, paper and metal on fast conveyor belts." }
  ],
  game: { title: "Human classifier", mins: 8, big: "A learner is only as good as its examples. More, varied examples = better guesses.",
    steps: ["One student is the 'AI' and steps outside.", "The class picks a secret rule (e.g. 'things with wheels') and shows the AI 6 labelled picture cards: YES or NO.", "Now show 4 new cards. The AI guesses YES or NO.", "Count how many were right. Then show 6 more varied examples and test again.", "Did more examples help?"] },
  kitNote: "Use real fruit, school objects or picture cards. Three very different objects are easiest at first; similar ones (orange vs lemon) make a good challenge.",
  simWhy: "**Teachable Machine** trains in the browser and nothing is uploaded unless you choose to save. **Machine Learning for Kids** lets you use the model inside a Scratch game afterwards.",
  builds: [
    { title: "Collect your examples", mins: 12, sim: "teachable", steps: ["Open Teachable Machine → **Image Project** → Standard.", "Rename the classes: e.g. banana, apple, nothing.", "Hold the webcam button and record **30+ pictures per class**.", "Move the object: turn it, near and far, different hands.", "For 'nothing', record the empty background and your empty hands."], art: "📸",
      note: { l: "Tip", text: "Hold the record button and slowly turn the object. You get 30 different pictures in a few seconds." } },
    { title: "Train and test", mins: 10, steps: ["Click **Train Model**. Keep the tab open while it trains.", "Look at the preview: hold up each object and read the confidence bars.", "Try to trick it: a different angle, bad lighting, a similar object.", "Write down every mistake in the test table."],
      side: [{ h: "Reading the bars", text: "Above 80%: confident. Around 50/50: unsure. Unsure on a real object means it needs more examples like that.", color: "blue" }] },
    { title: "Fix it with better data", mins: 10, steps: ["Pick the worst mistake from your table.", "Add 15–20 new pictures of exactly that situation.", "Train again and repeat the same test.", "Did the score go up? Write the new result."], art: "🔧" },
    { title: "Test like a scientist", only: ["advanced"], mins: 10, steps: ["Collect 10 test photos per class that are **never** used for training.", "Count correct answers before and after improving the data.", "Work out accuracy = correct ÷ total × 100.", "Which class is most often confused with which?"] }
  ],
  test: { title: "Trick-the-model table", intro: "Test each idea 3 times. Was the model right?",
    cols: ["What I showed", "Model said", "Confidence", "Right?"],
    rows: [["Object far away", "", "", ""], ["Object turned upside down", "", "", ""], ["Dim light", "", "", ""], ["My friend holding it", "", "", ""], ["A similar object", "", "", ""]] },
  levelup: { choices: [{ t: "New class", d: "Add a 4th class. Does it confuse the others?" }, { t: "Hands only", d: "Train rock, paper and scissors hand shapes." }, { t: "Game time", d: "Export the model to Machine Learning for Kids and use it in a Scratch game." }, { t: "Fair test", d: "Ask 5 people not in your group to test it. Score it." }],
    think: { h: "Think like an engineer", text: "Your model is 100% on your own pictures. Why might that NOT mean it's good?" }, boss: "Make the model say 'not sure' when no class is above 70%, and show a message." },
  debate: { kicker: "Think about it", title: "Your pictures are data", a: { h: "Questions to ask", points: ["Who can see the pictures I record?", "Is it OK to train on photos of someone without asking?", "What if a model only works for people who look like the ones in the training data?"] },
    b: { h: "Our class rules", points: ["Ask before recording anyone's face or hands", "Teachable Machine runs in the browser: delete projects you don't need", "Test on lots of different people before saying it works"] }, note: { l: "Fair AI", text: "Many real AI mistakes happened because the training data didn't include enough different people." } },
  wrap: { learned: ["Machine learning learns from labelled examples", "Classes, labels, training and confidence", "Varied data makes a model work in more places", "Test on new examples, not the ones it trained on", "Ask permission before using people's pictures"],
    exit: "Your model thinks every red thing is an apple. What would you do to fix it?", home: "Find two apps at home that recognise pictures or faces. Ask: what examples might they have learned from?", next: "**AI-03 Nearest Neighbours**: how a computer compares a new example with old ones." },
  guide: {
    grouping: "Pairs at one laptop with a webcam",
    overview: "Students experience the core idea of machine learning: **the program learns from labelled examples instead of written rules**. The lesson's real lesson is about data quality: students build a model, find where it fails, and fix it with better data, not more code. Works with any age: young students stop after the trick-the-model table; older students compute test accuracy.",
    prep: ["Test Teachable Machine on the school network and webcams the day before", "Collect 3 sets of objects per pair (fruit, stationery, toys) or print picture cards", "Plan a quiet background area if lighting in the room is poor", "Print the trick-the-model table (or use the slide)", "Check the school policy on recording students; use hands and objects if faces are not allowed"],
    timing: [[8, "Hook", "Banana rule-writing challenge and video"], [12, "Learn", "Rules vs learning, classes, good data"], [8, "Game", "Human classifier"], [12, "Build 1", "Collect examples"], [10, "Build 2", "Train and test with the table"], [10, "Build 3", "Fix with better data, re-test"], [10, "Wrap", "Data-ethics talk, objective check, exit ticket"]],
    steps: [
      { phase: "Hook", title: "Write the banana rule", say: "Write me a rule that finds every banana in the world, and nothing else.", do: ["Give 2 minutes. Collect rules on the board.", "Show a green banana, a banana sticker, a yellow curved toy: break each rule.", "Land the idea: some things are easier to learn from examples than to describe."] },
      { phase: "Learn", title: "Classes, labels, confidence", do: ["Use the tap-to-reveal 'nothing class' question; let pairs discuss first.", "Point out the confidence numbers: AI gives a probability, not a certainty."] },
      { phase: "Build", title: "Collect, train, trick, fix", do: ["Demonstrate recording 30 images while turning the object: it takes 5 seconds.", "Insist on the 'nothing' class.", "Walk round asking: 'What has your model never seen?'", "Before 'Fix it', stop the class: each pair says its worst mistake aloud."] },
      { phase: "Wrap", title: "Your pictures are data", do: ["Discuss the three questions on the debate slide.", "Agree the class rules; they apply to all AI lessons.", "Exit ticket on a sticky note."] }
    ],
    misconceptions: [["The computer understands what a banana is", "It only learns patterns of pixels that went with the label. Show it a yellow pencil to prove it."], ["More training time fixes everything", "Training longer on the same pictures doesn't help with new situations; new varied data does."], ["100% in the preview means it works", "Only on what you tested. Test on other people, places and lighting."], ["AI is always right", "It always answers, even when it shouldn't. That's why we look at confidence."]],
    trouble: [["Webcam not found", "Allow camera access in the browser bar; close other apps using the camera."], ["Training is very slow", "Use fewer pictures (30 per class) or close other tabs; older laptops take 1–2 minutes."], ["Model always says the same class", "One class has far more pictures: balance the numbers."], ["Works on one laptop, not another", "Lighting and camera differ: add pictures from both places."]],
    tiers: {
      starter: ["Teacher drives the laptop; children hold objects and shout out the guesses.", "Two classes only (e.g. teddy vs nothing).", "Focus on 'it learns from examples' and 'trick it'."],
      core: ["Full lesson: three classes, test table, fix with better data."],
      advanced: ["Add the held-out test set and accuracy calculation.", "Discuss overfitting with the training versus test score.", "Write up which classes get confused and why."] },
    assess: [
      { c: "Understands learning from data", e: "Says the computer 'looks at pictures'", s: "Explains classes, labels and training", x: "Explains why varied data and a test set matter" },
      { c: "Builds and tests", e: "Model trained with help", s: "3 classes, test table completed", x: "Measures accuracy before/after fixing data" },
      { c: "Responsible use", e: "Follows rules when reminded", s: "Asks permission, explains privacy", x: "Explains how biased data causes unfair AI" }],
    safety: ["Never record faces without permission; hands and objects are enough.", "Delete projects at the end unless the class decides to keep them."]
  }
};
