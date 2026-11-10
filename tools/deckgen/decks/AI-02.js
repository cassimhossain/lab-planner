const { titleSlide, divider, objectives, check } = require("../lib.js");
const ART = require("../art.js");
const { DIAGRAMS } = require("../diagrams.js");

/* the hand-drawn double outline, shared by every box written as html below */
const F = `<svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg>`;
const box = (c, h, body, ic) => `<div class="box fill c-${c}">${F}<div class="inner"><h3${ic ? ` ic="${ic}"` : ""}>${h}</h3>${body}</div></div>`;
const note = (l, t, teal) => `<div class="note${teal ? " teal" : ""}">${F}<div class="inner"><b>${l}</b><span>${t}</span></div></div>`;

module.exports = {
  code: "AI-02",
  title: "Training Data: Teach a Computer to See",
  series: "Artificial Intelligence",
  accent: "purple",
  slides: [

    titleSlide({
      series: "Artificial Intelligence · Machine Learning Foundations",
      main: "Training Data", accentWords: ["Data"],
      hook: "Teach a computer to see. It has never met a banana,<br>and in ten minutes it will spot one.",
      pills: ["60 minutes", "Pairs", "Laptop + webcam"],
      fig: DIAGRAMS.trainingLoop(),
      note: "In 2012 a model called AlexNet learned to recognise a thousand kinds of object from 1.2 million labelled photos, and beat every hand-written program by so far that the whole field changed direction within a year.",
    }),

    { tag: "LEARN", kicker: "Let's think", title: "Nobody gave you rules for a banana",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.1fr 1fr;gap:22px;align-items:start">
        <div class="stack">
          ${box("blue", "How did you learn it?", `<p>You can spot a banana in a second. Green, black-spotted, peeled, sliced, in a photo, in a cartoon.</p>
            <p style="margin-top:6px">Nobody ever sat you down with a list of banana rules. You just saw <strong>a lot of bananas</strong>, and somebody told you the word.</p>`, "eye")}
          ${box("purple", "That is exactly the trick", `<p>Last lesson we found that rules break. Today we do the other thing: collect examples, attach the right answer to each one, and let the computer find the pattern.</p>`, "brain")}
        </div>
        <div class="stack">
          ${box("orange", "Guess first", `<ul style="margin:4px 0 0 18px;line-height:1.7">
            <li>How many photos would you need to teach it <strong>banana</strong>?</li>
            <li>Would 100 photos of the <strong>same</strong> banana be enough?</li>
            <li>What happens when it sees a banana in a dark room?</li>
            <li>How would you ever know if it was any good?</li></ul>`)}
          ${note("Write your four guesses down", "We test every one of them before the end of the lesson. You will be right about some and wrong about at least one.")}
        </div></div>` }] },

    objectives([
      { t: "Collect and **label** training examples", icon: "camera", color: "purple" },
      { t: "**Train** an image model and test it on new pictures", icon: "brain", color: "blue" },
      { t: "Explain why **varied** examples beat more of the same", icon: "scales", color: "orange" },
      { t: "Measure **accuracy** honestly, on data the model never saw", icon: "graph", color: "teal" },
    ], "training data · label · class · sample · model · prediction · confidence · test set · accuracy · bias"),

    { tag: "LEARN", kicker: "Objective 1 · The big idea", title: "Four words you need today",
      bodyStyle: "display:grid;grid-template-columns:1fr 1fr;gap:20px",
      blocks: [
        { t: "html", html: `<div class="stack">
          ${box("purple", "Class", `<p>One of the answers the model is allowed to give. <strong>banana</strong>, <strong>apple</strong>, <strong>nothing</strong>. You decide the classes before you start.</p>`, "book")}
          ${box("blue", "Sample", `<p>One example. One photo. Teachable Machine counts these for you, and the count is the first thing to look at when something goes wrong.</p>`, "camera")}
        </div>` },
        { t: "html", html: `<div class="stack">
          ${box("orange", "Label", `<p>The right answer attached to a sample. In Teachable Machine the label is simply <strong>which box you put the photo in</strong>.</p>`, "pencil")}
          ${box("green", "Model", `<p>What comes out of training. A pattern, frozen, that turns a new photo into a guess and a number saying how sure it is.</p>`, "chip")}
        </div>` },
      ] },

    { tag: "LEARN", kicker: "Objective 1 · The cycle", title: "The loop every AI team runs",
      bodyStyle: "display:grid;grid-template-columns:1.3fr 1fr;gap:20px",
      blocks: [
        { t: "figbox", name: "trainingLoop", color: "purple", h: "Collect, label, train, test, repeat", style: "min-height:0" },
        { t: "html", html: `<div class="stack">
          ${box("blue", "It is a loop, not a line", `<p>No team gets it right first time. They train, find what it gets wrong, go and collect <strong>more of that</strong>, and train again.</p>`)}
          ${box("red", "The loop is where the work is", `<p>Training takes seconds. Collecting the right examples takes days. Real AI jobs are mostly about data, not about maths.</p>`)}
          ${note("Today", "You will go round this loop at least twice. The second time round is where the learning happens.", true)}
        </div>` },
      ] },

    { tag: "LEARN", kicker: "Objective 2 · Inside", title: "What the computer actually sees",
      bodyStyle: "display:grid;grid-template-columns:1.3fr 1fr;gap:20px",
      blocks: [
        { t: "figbox", name: "pixelsToNumbers", color: "blue", h: "No picture, just numbers", style: "min-height:0" },
        { t: "html", html: `<div class="stack">
          ${box("purple", "A photo is a grid", `<p>Every pixel is three numbers: how much red, green and blue. A small 224 by 224 photo is <strong>150,528 numbers</strong>.</p>`)}
          ${box("teal", "The pattern is in the numbers", `<p>The model never sees yellow or curved. It finds that <em>these</em> numbers tend to go together when you said banana.</p>`)}
          ${note("Why that matters", "Change the light and every number changes. That is why a model trained in one room can fail in the next one.")}
        </div>` },
      ] },

    { tag: "LEARN", kicker: "Objective 3 · The key idea", title: "Variety beats quantity",
      blocks: [{ t: "figbox", name: "goodBadData", color: "green", h: "Twenty photos, collected two ways", style: "flex:1 1 auto;min-height:0" }] },

    { tag: "LEARN", kicker: "Objective 3 · Why", title: "A model only knows what it was shown",
      bodyStyle: "display:grid;grid-template-columns:1.3fr 1fr;gap:20px",
      blocks: [
        { t: "figbox", name: "biasFunnel", color: "red", h: "What went in decides what works", style: "min-height:0" },
        { t: "html", html: `<div class="stack">
          ${box("orange", "This has a name", `<p>When the training data leaves something out, the model is <strong>biased</strong> against it. Not because anyone meant it. Because nobody photographed it.</p>`)}
          ${box("red", "It matters outside class", `<p>Face systems that worked on some skin tones and not others, and voice systems that missed some accents, were built by people who did not notice what their data was missing.</p>`)}
        </div>` },
      ] },

    { tag: "LEARN", kicker: "Objective 4 · Honesty", title: "Never mark your own homework",
      bodyStyle: "display:grid;grid-template-columns:1.3fr 1fr;gap:20px",
      blocks: [
        { t: "figbox", name: "trainTestSplit", color: "teal", h: "Hold some examples back", style: "min-height:0" },
        { t: "html", html: `<div class="stack">
          ${box("teal", "Train set and test set", `<p>Most of the photos teach the model. A handful are hidden from it and used only at the end, to find out what it really learned.</p>`)}
          ${box("purple", "Why hold any back?", `<p>A model can memorise. Ask it about a photo it already studied and it looks perfect. The held-back photos are the only honest question you can ask.</p>`)}
          ${note("In Teachable Machine", "There is no split button. You make the test set yourself: take a few photos, keep them out, and try them at the end.", true)}
        </div>` },
      ] },

    { tag: "LEARN", kicker: "In the real world", title: "Who is collecting data right now",
      blocks: [{ t: "html", html: `<div class="cols c3" style="flex:1 1 auto;min-height:0;display:grid;gap:18px">
        ${box("blue", "Your phone gallery", `<p>Search "mango" in your photos and it finds them. Somebody labelled millions of pictures so yours could be searched.</p>`, "phone")}
        ${box("orange", "A mango farm", `<p>Sorting machines grade fruit by photo. They are trained on that farm's own fruit, because another farm's mangoes look different.</p>`, "plant")}
        ${box("purple", "Every CAPTCHA", `<p>"Select all squares with a bus." You are labelling training data, free, a few seconds at a time.</p>`, "webcam")}
      </div>` }] },

    divider({
      part: "Part 2 · Make it", main: "Now teach one yourself",
      sub: "Three classes, a honest test, and one round of making it better.",
      pills: ["35 minutes", "Pairs", "Teachable Machine"],
      art: ART.svg("webcam"),
    }),

    { tag: "MAKE", kicker: "Class game", title: "Be the model",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.1fr 1fr;gap:22px;align-items:start">
        ${box("green", "How to play", `<ol style="margin:6px 0 0 19px;line-height:1.75">
          <li>One student leaves the room. They are the model.</li>
          <li>The class picks a secret class, say <strong>things that roll</strong>.</li>
          <li>They come back. You show them objects and say only <strong>yes</strong> or <strong>no</strong>. No explaining.</li>
          <li>After ten objects, hand them a new one. Can they guess?</li></ol>
          <p style="margin-top:10px">They just learned from labelled examples, with no rules given.</p>`)}
        <div class="stack">
          ${box("red", "Round two: bad data", `<p>Now only show them <strong>round red</strong> things that roll. Then hand them a blue pen lid.</p>
            <p style="margin-top:6px">They will say no. They learned <em>red and round</em>, because that is all you showed.</p>`)}
          ${note("Say it out loud", "\"The model is not stupid. It learned exactly what we taught it.\" That sentence is the whole lesson.")}
        </div></div>` }] },

    { tag: "MAKE", kicker: "Before you start", title: "What you need",
      bodyStyle: "display:grid;grid-template-columns:1fr 1fr;gap:20px",
      blocks: [
        { t: "html", html: box("teal", "Kit, per pair", `<ul style="margin:6px 0 0 18px;line-height:1.8">
          <li>One laptop with a webcam</li>
          <li>Chrome or Edge, and internet</li>
          <li><strong>teachablemachine.withgoogle.com</strong></li>
          <li>Three objects: say a banana, an apple, and nothing at all</li>
        </ul>`, "laptop") },
        { t: "html", html: `<div class="stack">
          ${box("orange", "Two rules before you touch it", `<ul style="margin:4px 0 0 18px;line-height:1.7">
            <li>Nothing leaves the laptop. Training runs <strong>in the browser</strong>.</li>
            <li>No photos of faces today, yours or anyone else's. Objects and hands only.</li></ul>`)}
          ${note("Why the third class?", "A model with only banana and apple must answer one of the two, even for an empty desk. A nothing class gives it somewhere honest to put that.", true)}
        </div>` },
      ] },

    { tag: "MAKE", kicker: "Build step 1 of 4", title: "Collect and label",
      bodyStyle: "display:grid;grid-template-columns:1.25fr 1fr;gap:20px",
      blocks: [
        { t: "figbox", name: "teachableUI", color: "purple", h: "The screen you will see", style: "min-height:0" },
        { t: "html", html: `<div class="stack">
          ${box("orange", "Do this", `<ol style="margin:4px 0 0 19px;line-height:1.65">
            <li>New Project, then <strong>Image Project</strong>, then Standard.</li>
            <li>Rename Class 1 to <strong>banana</strong>, Class 2 to <strong>apple</strong>.</li>
            <li>Add a Class and call it <strong>nothing</strong>.</li>
            <li>Hold Webcam and record about <strong>40 samples</strong> each.</li>
            <li>Keep the three counts roughly equal.</li></ol>`)}
          ${note("Move while you record", "Turn it, tilt it, move nearer, change hands, step sideways. Forty varied samples beat four hundred identical ones.")}
        </div>` },
      ] },

    { tag: "MAKE", kicker: "Build step 2 of 4", title: "Train it, then try to break it",
      bodyStyle: "display:grid;grid-template-columns:1fr 1fr;gap:20px",
      blocks: [
        { t: "html", html: `<div class="stack">
          ${box("orange", "Do this", `<ol style="margin:4px 0 0 19px;line-height:1.7">
            <li>Press <strong>Train Model</strong>. Do not switch tabs while it runs.</li>
            <li>Watch the Preview bars as you hold things up.</li>
            <li>Now try to fool it: move to a window, use your other hand, hold the fruit further away.</li>
            <li>Write down <strong>three things that fooled it</strong>.</li></ol>`)}
          ${box("purple", "Read the bars, not the winner", `<p>92% banana is a confident model. 48% banana and 44% apple is a model guessing. Both show the same top answer.</p>`)}
        </div>` },
        { t: "html", html: `<div class="stack">
          ${box("blue", "It never says yes or no", `<p>Every prediction is a set of percentages that add up to 100. The app just shows you the biggest one.</p>`)}
          ${note("The honest question", "Not \"does it work?\" but \"when does it stop working?\" Engineers get paid for the second question.")}
        </div>` },
      ] },

    { tag: "MAKE", kicker: "Build step 3 of 4", title: "Measure it properly",
      bodyStyle: "display:grid;grid-template-columns:1.2fr 1fr;gap:20px",
      blocks: [
        { t: "figbox", name: "accuracyCount", color: "teal", h: "Twelve honest questions", style: "min-height:0" },
        { t: "html", html: `<div class="stack">
          ${box("orange", "Do this", `<ol style="margin:4px 0 0 19px;line-height:1.7">
            <li>Take <strong>12 new photos</strong>: 4 banana, 4 apple, 4 empty. New spot, new light.</li>
            <li>Show each one and write down what it said.</li>
            <li>Count the right ones. Divide by 12.</li>
            <li>That number is your <strong>accuracy</strong>. Write it on the board.</li></ol>`)}
          ${note("Compare across the class", "Every pair will get a different number from the same app and the same fruit. The difference is entirely in the data they collected.", true)}
        </div>` },
      ] },

    { tag: "MAKE", kicker: "Build step 4 of 4", title: "Round two: make it better",
      bodyStyle: "display:grid;grid-template-columns:1fr 1fr;gap:20px",
      blocks: [
        { t: "html", html: `<div class="stack">
          ${box("orange", "Do this", `<ol style="margin:4px 0 0 19px;line-height:1.7">
            <li>Look at your three failures from step 2.</li>
            <li>Collect <strong>15 more samples of exactly those cases</strong>.</li>
            <li>Train again.</li>
            <li>Run the <strong>same 12 test photos</strong>. Did accuracy go up?</li></ol>`)}
          ${box("green", "This is the job", `<p>You did not change the model, the maths or the code. You changed the data. That is how nearly every real AI system gets better.</p>`)}
        </div>` },
        { t: "html", html: `<div class="stack">
          ${box("red", "If it got worse", `<p>That happens, and it is worth more than a win. Usually one class now has far more samples than the others, so the model leans towards it.</p>`)}
          ${note("Keep both numbers", "Before and after, on the same 12 photos. A measurement you can compare is worth more than one that sounds good.")}
        </div>` },
      ] },

    { tag: "TEST", kicker: "Test like an engineer", title: "Break it on purpose",
      blocks: [
        { t: "table", color: "red", cols: ["Try this", "What usually happens", "What it teaches"], rows: [
          ["Hold the fruit against a window", "Confidence collapses", "Backlight changes every pixel number"],
          ["Ask a different student to hold it", "It often gets it wrong", "It learned your hands as part of banana"],
          ["Use a yellow pencil case", "It may shout banana", "It learned yellow, not fruit"],
          ["Record 200 of one class, 20 of another", "It favours the big class", "Unbalanced data quietly skews the model"],
          ["Delete the nothing class and retrain", "An empty desk becomes apple", "A model must answer with what it has"],
        ] },
        { t: "note", l: "Record the failures", text: "A class list of ways to fool a model is a better record of this lesson than any screenshot of it working." },
      ] },

    { tag: "LEVEL UP", kicker: "Finished early?", title: "Go further",
      blocks: [{ t: "rows", items: [
        { t: "Build a **four-class** model: ripe, unripe, bruised, nothing", a: "Much harder. The classes overlap, and the bars show it.", color: "purple", icon: "camera" },
        { t: "Export the model and run it in a **web page**", a: "Export Model, TensorFlow.js, and paste the snippet.", color: "blue", icon: "laptop" },
        { t: "Test one pair's model on **another pair's** fruit", a: "Accuracy usually drops. Ask out loud why.", color: "orange", icon: "scales" },
        { t: "Try **Machine Learning for Kids** and compare", a: "Same idea, different tool, text instead of pictures.", color: "teal", icon: "chat" },
      ] }] },

    check([
      { t: "Collect and **label** training examples", a: "Proof: three classes, roughly 40 varied samples each", color: "purple" },
      { t: "**Train** a model and test it on new pictures", a: "Proof: it named fruit it had never seen before", color: "blue" },
      { t: "Explain why **varied** examples beat more of the same", a: "Proof: I named three things that fooled my model and why", color: "orange" },
      { t: "Measure **accuracy** on held-back data", a: "Proof: I have a before and an after number on the same 12 photos", color: "teal" },
    ]),

    { tag: "WRAP UP", kicker: "Show what you know", title: "What did we learn?",
      bodyStyle: "display:grid;grid-template-columns:1.15fr 1fr;gap:20px",
      blocks: [
        { t: "html", html: box("teal", "Five things to keep", `<ul style="margin:6px 0 0 18px;line-height:1.85">
          <li>A model learns from labelled examples, not rules.</li>
          <li>A photo reaches it as a grid of numbers.</li>
          <li>Varied examples beat more of the same.</li>
          <li>Test on pictures it has never seen, or you learn nothing.</li>
          <li>A model only knows what it was shown.</li>
        </ul>`) },
        { t: "html", html: `<div class="stack">
          ${box("orange", "Exit ticket", `<p>Your model calls a yellow pencil case a banana. You may not change the code. What exactly would you do?</p>`)}
          ${note("Next class", "AI-03 Nearest Neighbours: the simplest learning method there is, and you can do it on paper.", true)}
        </div>` },
      ] },

  ],
};
