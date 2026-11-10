const { titleSlide, divider, objectives, check } = require("../lib.js");
const ART = require("../art.js");
const { DIAGRAMS } = require("../diagrams.js");

/* the hand-drawn double outline, shared by every box written as html below */
const F = `<svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg>`;
const box = (c, h, body, ic) => `<div class="box fill c-${c}">${F}<div class="inner"><h3${ic ? ` ic="${ic}"` : ""}>${h}</h3>${body}</div></div>`;
const note = (l, t, teal) => `<div class="note${teal ? " teal" : ""}">${F}<div class="inner"><b>${l}</b><span>${t}</span></div></div>`;
const list = items => `<ul style="margin:4px 0 0 18px;line-height:1.6">${items.map(i => `<li>${i}</li>`).join("")}</ul>`;

module.exports = {
  code: "AI-02",
  title: "AI Basics: How Machines See, Hear and Decide",
  series: "Artificial Intelligence",
  accent: "purple",
  slides: [

    titleSlide({
      series: "Artificial Intelligence · Machine Learning Foundations",
      main: "AI Basics", accentWords: ["AI"],
      hook: "How can a machine see, hear and decide?<br>And what can't it do?",
      pills: ["60 minutes", "Pairs", "Laptop + webcam"],
      fig: DIAGRAMS.inputModelOutput(),
      note: "The first program to learn by itself played draughts. Arthur Samuel wrote it in 1959, and it learned to beat him by playing thousands of games against itself.",
    }),

    { tag: "LEARN", kicker: "Let's think", title: "Is a calculator smart?",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1.15fr;gap:22px;height:100%">
        <div class="stack">
          ${box("blue", "Vote with your hands", `<p>Hands up if you think each one is <strong>smart</strong>:</p>
            ${list(["a calculator that does 9,999 × 9,999 instantly", "a fan that turns on when it gets hot", "a phone that unlocks when it sees your face", "a parrot that says hello"])}`, "hand")}
          ${box("orange", "Think about it", list(["What makes a <strong>person</strong> smart?", "Is fast the same as smart?"]))}
        </div>
        <div class="stack"><figure class="fig-wrap" style="flex:1 1 auto;min-height:0">${DIAGRAMS.calcVsFace()}</figure>
          ${note("Hold on to your votes", "By the end you will have a test for which of these are AI.")}
        </div></div>` }] },

    objectives([
      { t: "Explain what **artificial intelligence** is, and what makes it different from a normal program", icon: "brain", color: "purple" },
      { t: "Describe how AI works: **input, model, output**", icon: "arrow", color: "blue" },
      { t: "Name **five things AI can do**, with an example of each", icon: "star", color: "teal" },
      { t: "Say what AI **gets wrong**, and how to use it **safely**", icon: "eye", color: "orange" },
    ], "intelligence · artificial intelligence · data · model · input · output · narrow AI · bias · prediction"),

    { tag: "LEARN", kicker: "Objective 1 · The big idea", title: "What is intelligence?",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.3fr 1fr;gap:22px;height:100%">
        <figure class="fig-wrap" style="flex:1 1 auto;min-height:0">${DIAGRAMS.humanIntelligence()}</figure>
        <div class="stack">
          ${box("blue", "You do four things", list(["<strong>See</strong> a friend's face across the playground", "<strong>Hear</strong> what someone says, and answer", "<strong>Learn</strong> by practising and seeing examples", "<strong>Decide</strong>: cross the road now, or wait?"]))}
          ${note("Intelligence", "Taking in information, learning from it, and using it to decide what to do. You do it hundreds of times a day.")}
        </div></div>` }] },

    { tag: "LEARN", kicker: "Objective 1 · The big idea", title: "So what is AI?",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1.1fr;gap:22px;height:100%">
        <div class="stack">
          ${box("purple", "Artificial intelligence", `<p><strong>Artificial</strong> means made by people. <strong>Intelligence</strong> means seeing, hearing, learning and deciding.</p>
            <p style="margin-top:6px">So AI is <strong>a computer program that does things we would call smart if a person did them</strong>.</p>`, "brain")}
          ${box("green", "AI is a tool", `<p>People build it, train it and decide how to use it. It has no feelings, no wishes and no plan of its own.</p>`, "gear")}
        </div>
        <div class="stack"><figure class="fig-wrap" style="flex:1 1 auto;min-height:0">${DIAGRAMS.brainVsChip()}</figure>
          ${note("The difference", "A normal program follows rules a person wrote. Most AI <strong>learns its own rules from examples</strong>, like you learned what a cat is.", true)}
        </div></div>` }] },

    { tag: "LEARN", kicker: "Objective 1 · History", title: "Seventy years of AI",
      bodyStyle: "display:grid;grid-template-columns:1.35fr 1fr;gap:22px",
      blocks: [
        { t: "figbox", name: "aiTimeline", color: "purple", h: "From a question to your pocket", style: "min-height:0" },
        { t: "html", html: `<div class="stack">
          ${box("blue", "Why so long?", `<p>The ideas are old. What was missing was <strong>enough examples</strong> to learn from and <strong>fast enough computers</strong>. The internet and smartphones gave us both.</p>`, "graph")}
          ${box("orange", "Why now?", `<p>Every day people upload billions of photos and messages. A modern AI can learn from more examples in a week than a person sees in a lifetime.</p>`, "cloud")}
        </div>` },
      ] },

    { tag: "LEARN", kicker: "Objective 2 · How it works", title: "Input, model, output",
      bodyStyle: "display:grid;grid-template-columns:1.3fr 1fr;gap:22px",
      blocks: [
        { t: "figbox", name: "inputModelOutput", color: "purple", h: "Every AI does these three things", style: "min-height:0" },
        { t: "html", html: `<div class="stack">
          ${box("blue", "1. Input", `<p>What goes in: a photo from a camera, sound from a microphone, words you type.</p>`)}
          ${box("purple", "2. Model", `<p>The patterns the AI learned during <strong>training</strong>, from thousands of examples.</p>`)}
          ${box("green", "3. Output", `<p>What comes out: a label, a sentence, an action. Always its <strong>best guess</strong>.</p>`)}
        </div>` },
      ] },

    { tag: "LEARN", kicker: "Objective 3 · What AI can do", title: "Five things AI can do",
      blocks: [{ t: "html", html: `<div style="display:flex;flex-direction:column;gap:12px;height:100%">
        <div class="art" style="height:150px;flex:none">${DIAGRAMS.fiveAbilities()}</div>
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;align-items:start">
          ${box("blue", "See", `<p>Face unlock, photo search, a sick leaf on a farmer's phone.</p>`)}
          ${box("teal", "Hear", `<p>Voice typing in Urdu, smart speakers, reading aloud.</p>`)}
          ${box("purple", "Language", `<p>Google Translate, chatbots, spelling correction.</p>`)}
          ${box("orange", "Decide", `<p>The next YouTube video, the fastest road, spam or not.</p>`)}
          ${box("red", "Create", `<p>Writing a story, drawing a picture, making music.</p>`)}
        </div></div>` }] },

    { tag: "LEARN", kicker: "Objective 3 · Kinds of AI", title: "Real AI versus film AI",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1.15fr;gap:22px;height:100%">
        <div class="stack">
          ${box("green", "Narrow AI: every AI that exists", `<p>Very good at <strong>one job</strong>. A chess AI can't make tea. Face unlock can't translate Urdu.</p>`, "target")}
          ${box("red", "General AI: only in films", `<p>As clever as a person at <strong>everything</strong>, with its own goals. Nobody has built one.</p>`, "robot")}
        </div>
        <div class="stack"><figure class="fig-wrap" style="flex:1 1 auto;min-height:0">${DIAGRAMS.narrowVsFilm()}</figure>
          ${note("So when you hear \"AI\"", "Ask: what one job was it trained for, and what examples did it learn from?")}
        </div></div>` }] },

    { tag: "LEARN", kicker: "Objective 2 · The fuel", title: "Data is what AI learns from",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.2fr 1fr;gap:22px;height:100%">
        <figure class="fig-wrap" style="flex:1 1 auto;min-height:0">${DIAGRAMS.dataPile()}</figure>
        <div class="stack">
          ${box("blue", "Examples", `<p>Lots of them: photos, sounds, sentences. Thousands for a simple job, billions for a chatbot.</p>`)}
          ${box("purple", "Labels", `<p>The right answer for each example, written by a person.</p>`)}
          ${note("Good data, good AI", "If the examples only show some people, the AI works well for them and badly for everyone else.")}
        </div></div>` }] },

    { tag: "LEARN", kicker: "Objective 4 · Humans and AI", title: "Who is better at what?",
      bodyStyle: "display:grid;grid-template-columns:1.25fr 1fr;gap:22px",
      blocks: [
        { t: "table", color: "purple", cols: ["Job", "Better at it"], rows: [
          ["Checking 10,000 photos for a fault", "AI: fast, never tired"],
          ["Spotting a pattern in a huge table", "AI"],
          ["Understanding a joke", "Humans"],
          ["Knowing a friend is upset", "Humans"],
          ["Doing a brand new kind of task", "Humans"],
          ["Deciding what is fair or kind", "Humans: people stay in charge"],
        ] },
        { t: "html", html: `<div class="stack" style="height:100%"><figure class="fig-wrap" style="flex:1 1 auto;min-height:0">${DIAGRAMS.humanVsAiScale()}</figure>
          ${note("The best results", "People and AI together: the AI does the fast part, a person checks and decides.")}</div>` },
      ] },

    { tag: "LEARN", kicker: "Objective 4 · Limits", title: "What AI gets wrong",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.2fr 1fr;gap:22px;height:100%">
        <div class="stack"><figure class="fig-wrap" style="flex:1 1 auto;min-height:0">${DIAGRAMS.huskyWolf()}</figure>
          ${note("The habit to learn", "Treat an AI answer like advice from a stranger: useful, but check it before you trust it.")}</div>
        <div class="stack">
          ${box("red", "Mistakes", `<p>It always gives its best guess, even when it is unsure.</p>`, "eye")}
          ${box("orange", "Bias", `<p>If the examples left some people out, it works worse for them.</p>`, "scales")}
          ${box("purple", "Made-up facts", `<p>Chatbots can write wrong answers that <strong>sound</strong> right.</p>`, "book")}
        </div></div>` }] },

    { tag: "LEARN", kicker: "Objective 4 · Using AI well", title: "Using AI safely and fairly",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1.15fr 1fr;gap:18px;height:100%">
        ${box("green", "Do", list(["<strong>Check</strong> facts in a book or a trusted website", "Say when you used AI", "Use it to explain what you're stuck on", "Ask an adult before trying a new AI app"]), "star")}
        <figure class="fig-wrap" style="flex:1 1 auto;min-height:0">${DIAGRAMS.safetyShield()}</figure>
        ${box("red", "Don't", list(["Share your name, address or photos", "Hand in AI work as your own", "Believe it just because it sounds sure", "Make fake pictures of real people"]), "bin")}
        </div>` }] },

    { tag: "LEARN", kicker: "In the real world", title: "AI around you in Pakistan",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.2fr 1fr;gap:20px;height:100%">
        <figure class="fig-wrap" style="flex:1 1 auto;min-height:0">${DIAGRAMS.farmerPhone()}</figure>
        <div class="stack">
          ${box("green", "Farming", `<p>A farmer photographs a sick leaf, and the app names the disease so it can be treated early.</p>`, "leaf")}
          ${box("blue", "And all around you", list(["<strong>Travel:</strong> Maps predicts traffic in Lahore and Karachi", "<strong>Language:</strong> voice typing and translation in Urdu", "<strong>Shopping:</strong> shops suggest what to buy next", "<strong>Banking:</strong> a strange payment gets flagged", "<strong>Health:</strong> AI helps read X-rays; a doctor checks"]), "map")}
        </div></div>` }] },

    divider({
      part: "Part 2 · Make it",
      main: "Now let's meet AI",
      sub: "Decide who is better at what, sort AI by what it does, then teach a computer to see.",
      pills: ["30 minutes", "Pairs", "Laptop + webcam"],
      art: ART.svg("robot"),
    }),

    { tag: "MAKE", kicker: "Class game 1", title: "Human or AI: who is better?",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.2fr 1fr;gap:22px;align-items:start">
        ${box("purple", "How to play", `<ol style="margin:6px 0 0 19px;line-height:1.7">
          <li>Left wall: <strong>AI is better</strong>. Right wall: <strong>humans are better</strong>. Middle: <strong>both</strong>.</li>
          <li>The teacher reads a job. Walk to where you think it belongs.</li>
          <li>Two people explain their choice. Anyone can change sides.</li>
          <li>The teacher gives the answer, and why.</li></ol>`, "hand")}
        <div class="stack">
          ${box("orange", "Some jobs to read out", list(["Remembering every word in a dictionary", "Comforting a crying friend", "Finding one face in a crowd photo", "Inventing a new game"]))}
          ${note("Notice", "AI wins on speed and size. Humans win on understanding, feelings and anything new.")}
        </div></div>` }] },

    { tag: "MAKE", kicker: "Class game 2", title: "Sort the AI",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.2fr 1fr;gap:22px;align-items:start">
        ${box("blue", "How to play", `<ol style="margin:6px 0 0 19px;line-height:1.7">
          <li>Each pair gets the app cards from the sheet.</li>
          <li>Sort them into five piles: <strong>see</strong>, <strong>hear and speak</strong>, <strong>language</strong>, <strong>decide</strong>, <strong>create</strong>.</li>
          <li>For each card, say what its <strong>input</strong> and <strong>output</strong> are.</li>
          <li>Find one card that fits two piles, and explain why.</li></ol>`, "magnifier")}
        <div class="stack">
          ${box("green", "Example", `<p><strong>Face unlock:</strong> input a photo of a face, output <em>yes, it's you</em> or <em>no</em>. That's <strong>see</strong>.</p>`)}
          ${note("Tricky one", "A self-driving car fits every pile. Real machines often use several AIs together.")}
        </div></div>` }] },

    { tag: "MAKE", kicker: "Teach a computer to see", title: "Teachable Machine",
      bodyStyle: "display:grid;grid-template-columns:1fr 1.1fr;gap:22px",
      blocks: [
        { t: "html", html: `<div class="stack">
          ${box("orange", "Do this", `<ol style="margin:6px 0 0 19px;line-height:1.7">
            <li>Open <strong>teachablemachine.withgoogle.com</strong> → Image project → Standard.</li>
            <li>Make two classes, like <strong>thumbs up</strong> and <strong>thumbs down</strong>.</li>
            <li>Hold the webcam button: 30 pictures each, moving your hand.</li>
            <li>Press <strong>Train</strong>, then test it. Try to trick it.</li></ol>`, "camera")}
          ${note("Spot the three steps", "Your pictures are the <strong>input</strong>. Training made the <strong>model</strong>. The bars are the <strong>output</strong>, with how sure it is.")}
        </div>` },
        { t: "figbox", name: "teachableUI", color: "purple", h: "What you will see", style: "min-height:0" },
      ] },

    { tag: "LEVEL UP", kicker: "Finished early?", title: "Go further",
      blocks: [{ t: "rows", items: [
        { t: "Add a **third class** (an empty background) to Teachable Machine", a: "Why does it need a 'nothing' class?", color: "purple", icon: "camera" },
        { t: "Make it fail on purpose: train with **one person**, test with another", a: "That is bias, made in two minutes.", color: "red", icon: "scales" },
        { t: "Find **three AIs** at home and write their input and output", a: "TV, phone, car, kitchen: where else?", color: "teal", icon: "phone" },
        { t: "Ask a chatbot a question you **know** the answer to", a: "Was it right? How sure did it sound?", color: "orange", icon: "chat" },
      ] }] },

    check([
      { t: "Explain what **AI** is", a: "Proof: I explained it to my partner in one sentence", color: "purple" },
      { t: "Describe **input, model, output**", a: "Proof: I named all three for my Teachable Machine model", color: "blue" },
      { t: "Name **five things AI can do**", a: "Proof: I sorted the app cards into the five piles", color: "teal" },
      { t: "Say what AI **gets wrong** and how to stay safe", a: "Proof: I named one mistake and one safety rule", color: "orange" },
    ]),

    { tag: "WRAP UP", kicker: "Show what you know", title: "What did we learn?",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.3fr 1fr;gap:22px;align-items:start">
        <div class="box fill c-purple">${F}<div class="inner"><h3 ic="book">Five things to keep</h3>${list([
          "AI is a program that does things we would call smart, made by people.",
          "It works in three steps: input, model, output.",
          "It can see, hear, understand language, decide and create.",
          "All real AI is narrow: very good at one job.",
          "It learns from data, makes mistakes, and needs a person to check it."])}</div></div>
        <div class="stack">
          ${box("orange", "Exit ticket", `<p>Go back to the votes from the start. Which of the four was really <strong>AI</strong>, and why?</p>`, "pencil")}
          ${note("Next class", "AI-03: Nearest neighbours. How a computer decides by comparing something new with things it has seen before.", true)}
        </div></div>` }] },
  ],
};
