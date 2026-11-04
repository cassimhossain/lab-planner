const { titleSlide, divider, objectives, check } = require("../lib.js");
const ART = require("../art.js");
const { DIAGRAMS } = require("../diagrams.js");

/* the hand-drawn double outline, shared by every box written as html below */
const F = `<svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg>`;
const box = (c, h, body, ic) => `<div class="box fill c-${c}">${F}<div class="inner"><h3${ic ? ` ic="${ic}"` : ""}>${h}</h3>${body}</div></div>`;
const note = (l, t, teal) => `<div class="note${teal ? " teal" : ""}">${F}<div class="inner"><b>${l}</b><span>${t}</span></div></div>`;

module.exports = {
  code: "AI-01",
  title: "What Is AI? Rules versus Learning",
  series: "Artificial Intelligence",
  accent: "purple",
  slides: [

    titleSlide({
      series: "Artificial Intelligence · Machine Learning Foundations",
      main: "What Is AI?", accentWords: ["AI?"],
      hook: "Write rules to spot a cat.<br>Now write them for every cat on Earth.",
      pills: ["60 minutes", "Pairs", "Cards + a laptop"],
      fig: DIAGRAMS.rulesVsLearning(),
      note: "The words \"artificial intelligence\" were first used in 1956, for a summer workshop at Dartmouth College in the USA. It took about 60 more years for AI to fit in your pocket.",
    }),

    { tag: "LEARN", kicker: "Let's think", title: "Write the rules for a cat",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.1fr 1fr;gap:22px;align-items:start">
        <div class="stack">
          ${box("blue", "Try it in 60 seconds", `<p>Write rules a computer could follow to decide <strong>cat or not a cat</strong>.</p>
            <p style="margin-top:6px">Most people write something like: <strong>fur, four legs, whiskers, pointy ears, says meow</strong>.</p>`)}
          ${box("red", "Now break your rules", `<ul style="margin:4px 0 0 18px;line-height:1.6">
            <li>A <strong>Sphynx cat</strong> has no fur at all.</li>
            <li>A <strong>Scottish Fold</strong> has folded-down ears.</li>
            <li>A cat curled into a ball shows <strong>no legs</strong>.</li>
            <li>A <strong>dog</strong> has fur, four legs and whiskers too.</li></ul>`)}
        </div>
        <div class="stack">
          ${box("orange", "Guess first", `<ul style="margin:4px 0 0 18px;line-height:1.7">
            <li>How many rules would cover every cat on Earth?</li>
            <li>How did <strong>you</strong> learn what a cat is? Did anyone give you rules?</li>
            <li>Your phone can find every cat photo in your gallery. Who wrote its rules?</li></ul>`)}
          ${note("The big idea of today", "You learned \"cat\" from seeing lots of cats, not from a list of rules. Modern AI learns the same way.")}
        </div></div>` }] },

    objectives([
      { t: "Tell a **rule-based program** from a **learning system**", icon: "scales", color: "purple" },
      { t: "Explain that AI **learns patterns from examples**", icon: "brain", color: "blue" },
      { t: "Find **AI in everyday apps** and say what it learned from", icon: "phone", color: "teal" },
      { t: "Show **where rules break** and examples help", icon: "magnifier", color: "orange" },
    ], "artificial intelligence · rule · program · example · label · pattern · training · prediction · confidence"),

    { tag: "LEARN", kicker: "Objective 1 · The big idea", title: "Two ways to make a computer smart",
      bodyStyle: "display:grid;grid-template-columns:1.25fr 1fr;gap:22px",
      blocks: [
        { t: "figbox", name: "rulesVsLearning", color: "purple", h: "Rules in, or rules out", style: "min-height:0" },
        { t: "html", html: `<div class="stack">
          ${box("blue", "Normal programming", `<p>A person thinks of every case and writes it as a rule. The computer follows the rules exactly, every time.</p>`, "pencil")}
          ${box("purple", "Machine learning", `<p>A person collects <strong>examples with the right answers</strong>. The computer finds the pattern itself, and uses it on things it has never seen.</p>`, "brain")}
          ${note("Artificial intelligence", "Any computer doing something we would call smart if a person did it. Today almost all of it is machine learning.", true)}
        </div>` },
      ] },

    { tag: "LEARN", kicker: "Objective 1 · Rules", title: "A rule program, and the dog that fools it",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;align-items:start">
        <div class="stack">
          <div class="code"><span class="cm"># a cat detector made of rules</span>
<span class="kw">def</span> is_cat(animal):
    <span class="kw">if</span> (animal[<span class="st">"fur"</span>]
            <span class="kw">and</span> animal[<span class="st">"whiskers"</span>]
            <span class="kw">and</span> animal[<span class="st">"legs"</span>] == 4):
        <span class="kw">return</span> <span class="st">"cat"</span>
    <span class="kw">return</span> <span class="st">"not a cat"</span>

dog = {<span class="st">"fur"</span>: True, <span class="st">"whiskers"</span>: True, <span class="st">"legs"</span>: 4}
print(is_cat(dog))   <span class="cm"># cat  (wrong!)</span></div>
          ${note("Fix it with another rule?", "Add \"says meow\". Now a photo can't be checked at all, because photos don't make sounds. Every fix makes a new problem.")}
        </div>
        <div class="stack">
          ${box("green", "Rules are the right tool when…", `<ul style="margin:4px 0 0 18px;line-height:1.6">
            <li>every case is known: a <strong>calculator</strong>, a <strong>Metro fare</strong> machine</li>
            <li>the answer must be exact and explainable: <strong>exam marks</strong>, a <strong>traffic-light timer</strong></li></ul>`, "scales")}
          ${box("purple", "Learning is the right tool when…", `<ul style="margin:4px 0 0 18px;line-height:1.6">
            <li>there are too many cases to write: <strong>faces</strong>, <strong>voices</strong>, <strong>handwriting</strong></li>
            <li>even experts can't say the rule: <strong>is this email spam?</strong></li></ul>`, "brain")}
        </div></div>` }] },

    { tag: "LEARN", kicker: "Objective 2 · Patterns", title: "How a computer learns from examples",
      bodyStyle: "display:grid;grid-template-columns:1.25fr 1fr;gap:22px",
      blocks: [
        { t: "figbox", name: "patternScatter", color: "purple", h: "Every example is a dot with its answer", style: "min-height:0" },
        { t: "html", html: `<div class="stack">
          ${box("orange", "1. Examples with labels", `<p>Hundreds of pictures, each with the <strong>right answer</strong> written on it by a person: cat, or dog.</p>`)}
          ${box("green", "2. Training finds the pattern", `<p>The computer measures things (ear shape, whisker length) and finds the <strong>line that best separates</strong> the two groups.</p>`)}
          ${box("purple", "3. A guess for something new", `<p>A new picture lands on one side of the line. That is the <strong>prediction</strong>, with how sure it is: 87% cat.</p>`)}
        </div>` },
      ] },

    { tag: "LEARN", kicker: "Objective 2 · Patterns", title: "Clever, but it doesn't understand",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:start">
        ${box("blue", "It only knows its examples", `<p>Train it only on orange cats and it may decide <strong>orange = cat</strong>. It learns whatever pattern is easiest, not what you meant.</p>`, "eye")}
        ${box("red", "It is always guessing", `<p>Even at 99% sure it can be wrong. A good AI shows how <strong>confident</strong> it is, so a person can check the unsure ones.</p>`, "graph")}
        ${box("green", "Better examples, better AI", `<p>More examples, and more <strong>different</strong> examples (other colours, angles, lighting), beat a cleverer computer.</p>`, "star")}
        <div style="grid-column:1/4">${note("A story from real life", "A model trained to spot wolves in photos was very accurate, until people looked closer. It had learned that wolf photos had <strong>snow</strong> in them. Show it a husky in snow: \"wolf\".")}</div>
        </div>` }] },

    { tag: "LEARN", kicker: "Objective 3 · Everyday AI", title: "AI is already in your pocket",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;align-items:start">
        ${box("purple", "Face unlock", `<p>Learned from millions of faces what makes <strong>your</strong> face yours, in any light.</p>`, "camera")}
        ${box("blue", "Voice typing", `<p>Gboard types Urdu and English you speak. It learned from huge numbers of voice recordings.</p>`, "chat")}
        ${box("teal", "Maps traffic", `<p>Google Maps knows the Islamabad Expressway is slow from the speed of phones already on it.</p>`, "map")}
        ${box("orange", "Recommendations", `<p>YouTube and Daraz suggest the next video or product from what people like you clicked.</p>`, "video")}
        ${box("red", "Spam filters", `<p>Learned from millions of emails that people marked as spam or not spam.</p>`, "cloud")}
        ${box("green", "Photo search", `<p>Type \"beach\" in your gallery. Nobody wrote a beach rule: it learned from labelled photos.</p>`, "magnifier")}
        </div>` }] },

    divider({
      part: "Part 2 · Make it",
      main: "Now let's be the AI",
      sub: "Sort smart from not-smart, learn a secret rule from examples, then train two real AIs.",
      pills: ["35 minutes", "Pairs", "Cards + a laptop"],
      art: ART.svg("brain"),
    }),

    { tag: "MAKE", kicker: "Class game 1", title: "Smart or not smart?",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.2fr 1fr;gap:22px;align-items:start">
        ${box("purple", "How to play", `<ol style="margin:6px 0 0 19px;line-height:1.7">
          <li>Each pair gets the 12 cards from the sheet.</li>
          <li>Sort them into two piles: <strong>follows rules</strong> or <strong>learned from examples</strong>.</li>
          <li>For every card, say <strong>why</strong> in one sentence.</li>
          <li>Swap with the next pair and check their piles.</li></ol>`)}
        <div class="stack">
          ${box("orange", "Watch out for the tricky ones", `<p>An <strong>automatic door</strong> feels clever, but it follows one rule: something moved, so open. Being useful is not the same as learning.</p>`)}
          ${note("The test", "Could a person write down every rule it uses? Then it's a rule program. If nobody could, it probably learned from examples.")}
        </div></div>` }] },

    { tag: "MAKE", kicker: "Class game 2", title: "Be the AI: the human classifier",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.1fr 1fr;gap:22px;align-items:start">
        ${box("green", "How to play", `<ol style="margin:6px 0 0 19px;line-height:1.7">
          <li>One student is the <strong>AI</strong> and steps outside.</li>
          <li>The class picks a secret rule, like <strong>things with wheels</strong>.</li>
          <li>The AI sees 6 picture cards marked <strong>YES</strong> or <strong>NO</strong>.</li>
          <li>Now 4 new cards, unmarked. The AI says YES or NO. Count the right answers.</li>
          <li>Show 6 more, very different examples, and test again.</li></ol>`)}
        <div class="stack">
          ${box("red", "What you just felt", `<p>Nobody told the AI the rule. It <strong>found a pattern</strong> in the examples, and more varied examples made its guesses better. That is training.</p>`)}
          ${note("Round two", "Pick a sneaky rule, like things that are red. If every YES card was also a car, the AI learns cars. Now you have seen what bad training data does.")}
        </div></div>` }] },

    { tag: "MAKE", kicker: "Train a real AI · 1 of 2", title: "AI for Oceans",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.1fr 1fr;gap:22px;align-items:start">
        ${box("blue", "Do this", `<ol style="margin:6px 0 0 19px;line-height:1.7">
          <li>Open <strong>code.org/oceans</strong> (free, no login needed).</li>
          <li>Teach A.I. Bot: label each object <strong>fish</strong> or <strong>not fish</strong>. Do at least 30.</li>
          <li>Press <strong>Continue</strong> and watch it clean the ocean. Count its mistakes.</li>
          <li>Next level: teach it a new word, like <strong>angry</strong> fish, using only pictures.</li></ol>`, "robot")}
        <div class="stack">
          ${box("purple", "Notice", `<p>You never wrote a rule. You only gave <strong>examples with answers</strong>, and the bot found the pattern itself.</p>`)}
          ${note("Ask yourself", "When the bot calls a fish \"angry\", what was it really looking at? Its idea of angry is only as good as your labels.")}
        </div></div>` }] },

    { tag: "MAKE", kicker: "Train a real AI · 2 of 2", title: "Quick, Draw!",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.1fr 1fr;gap:22px;align-items:start">
        ${box("orange", "Do this", `<ol style="margin:6px 0 0 19px;line-height:1.7">
          <li>Open <strong>quickdraw.withgoogle.com</strong> and press <strong>Let's draw!</strong></li>
          <li>Six doodles, 20 seconds each. The AI guesses out loud as you draw.</li>
          <li>At the end, click a doodle it <strong>missed</strong>.</li>
          <li>Look at what other people drew for that word. Why did yours not match?</li></ol>`, "pencil")}
        <div class="stack">
          ${box("teal", "Where it learned", `<p>It learned from over <strong>50 million doodles</strong> drawn by people all over the world, each one labelled with the word they were asked to draw.</p>`)}
          ${note("Notice", "It recognises how most people draw a thing, not the thing itself. Draw a cat your own way and it may never guess.")}
        </div></div>` }] },

    { tag: "TEST", kicker: "Test like an engineer", title: "Where do rules break?",
      blocks: [
        { t: "table", color: "purple", cols: ["The rule", "Something that breaks it", "Would examples do better?"], rows: [
          ["A cat has fur", "A Sphynx cat (no fur)", "Yes: show photos of every kind of cat"],
          ["A ripe mango is yellow", "A ripe Sindhri with green patches", "Yes: show ripe and unripe mangoes"],
          ["Spam says \"you have won\"", "A real prize email from school", "Yes: learn from emails people marked"],
          ["A traffic light is red for 60 s", "Nothing: it never changes", "No: here a rule is the right tool"],
        ] },
        { t: "note", l: "Your turn", text: "Write your own rule for \"a ripe mango\", then try to break it. Can your partner find a mango your rule gets wrong?" },
      ] },

    { tag: "LEVEL UP", kicker: "Finished early?", title: "Go further",
      blocks: [{ t: "rows", items: [
        { t: "Write **5 rules** for spotting a **ripe mango**, then find 3 that break them", a: "Which rule broke first? Could you ever finish the list?", color: "purple", icon: "pencil" },
        { t: "In AI for Oceans, teach a **new word** with deliberately bad labels", a: "What did the bot learn instead? That is bias, made on purpose.", color: "blue", icon: "robot" },
        { t: "Find a word Quick, Draw! **always misses** when you draw it", a: "Look at its examples. What does everyone else draw that you don't?", color: "orange", icon: "eye" },
        { t: "Find two apps at home that say **recommended for you**", a: "Guess what examples each one learned from.", color: "teal", icon: "phone" },
      ] }] },

    check([
      { t: "Tell a **rule-based program** from a **learning system**", a: "Proof: I sorted all 12 cards and gave a reason for each", color: "purple" },
      { t: "Explain that AI **learns patterns from examples**", a: "Proof: I explained the human classifier game in my own words", color: "blue" },
      { t: "Find **AI in everyday apps**", a: "Proof: I named two apps and what they learned from", color: "teal" },
      { t: "Show **where rules break**", a: "Proof: my partner broke my mango rule, or I broke theirs", color: "orange" },
    ]),

    { tag: "WRAP UP", kicker: "Show what you know", title: "What did we learn?",
      blocks: [{ t: "html", html: `<div style="display:grid;grid-template-columns:1.3fr 1fr;gap:22px;align-items:start">
        <div class="box fill c-purple">${F}<div class="inner"><h3 ic="book">Five things to keep</h3><ul style="margin:4px 0 0 18px;line-height:1.6">
          <li>A rule program does exactly what a person wrote, nothing more.</li>
          <li>Machine learning finds the rules itself, from examples with answers.</li>
          <li>AI learns patterns, so it only knows what its examples showed it.</li>
          <li>It is always guessing; good AI says how sure it is.</li>
          <li>Rules for the exact jobs, learning for the messy ones.</li></ul></div></div>
        <div class="stack">
          ${box("orange", "Exit ticket", `<p>A fruit shop wants a program that spots <strong>ripe mangoes</strong>. Rules or learning? Give one reason.</p>`, "pencil")}
          ${note("Next class", "AI-02: Training data. You will teach a computer to see, with your own webcam, in ten minutes.", true)}
        </div></div>` }] },
  ],
};
