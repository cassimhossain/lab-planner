window.RAI_LESSONS["AI-11"] = {
  fact: "Large language models are trained on so much text that a person reading non-stop would need thousands of years to finish it.",
  think: { q: "ChatGPT has never been to school. So how does it write essays?", art: "chat brain", cap: "one word at a time",
    guesses: ["A person types the answers", "It copies from websites", "It predicts the next word!"],
    story: { h: "Finish the sentence", text: "\"The cat sat on the ___.\" You said 'mat' without thinking. You've read that pattern many times. A language model does the same thing, billions of times, very fast." },
    today: "we discover that chatbots work by **predicting the next word**, and build a tiny text generator ourselves." },
  objectives: [
    { t: "Explain next-word prediction", proof: "I can show how a model picks the next word from probabilities" },
    { t: "Explain tokens and temperature", proof: "I changed temperature and described what happened" },
    { t: "Build a tiny text generator", proof: "my Code Lab program writes new sentences from a text" }
  ],
  video: { title: "How large language models work", search: "how do large language models work simple explanation", mins: 7,
    watch: ["What does the model predict?", "Where does its knowledge come from?", "Why can it be confidently wrong?"] },
  learn: [
    { kicker: "Big idea", title: "A very well-read guesser",
      text: "A language model has one job: **given some words, guess the next one**. Repeat that, and you get sentences, essays, even code.",
      points: ["It learned by reading huge amounts of text", "It stores patterns, not a list of facts", "It writes one word (token) at a time"],
      art: "book chat" },
    { kicker: "Probabilities", title: "Picking the next word",
      boxes: [{ h: "\"The robot picked up the ...\"", text: "box   41%\nball  22%\ncup   18%\nelephant  0.1%", color: "blue" }],
      side: [{ h: "Temperature", text: "Low (0.2): always picks the top word. Safe, boring.\nHigh (1.2): picks unlikely words more often. Creative, sometimes nonsense.", color: "amber" }],
      reveal: { q: "Why does the same question give a different answer each time?", a: "The model samples from the probabilities instead of always taking the top word. Temperature controls how adventurous that sampling is." } },
    { kicker: "Tokens", title: "Words are cut into pieces",
      text: "Models don't read whole words. They read **tokens**: common words, or pieces of rarer ones.", points: ["\"robot\" → 1 token", "\"unbelievable\" → un · believ · able", "Numbers and Urdu or Arabic words often take more tokens", "Each token becomes a list of numbers the model can compute with"],
      note: { l: "Fun fact", text: "That's why models are sometimes bad at counting letters in a word: they never saw the letters, only tokens!" } },
    { kicker: "Why it gets things wrong", title: "Fluent is not the same as true",
      boxes: [{ h: "Hallucinations", text: "If the most likely-sounding answer is false, the model may say it anyway, confidently.", color: "red" }, { h: "So we...", points: ["Check important facts in trusted sources", "Ask for sources and verify them", "Never paste private information"], color: "green" }] },
    { kicker: "Deeper", title: "Attention: which words matter?", only: ["advanced"],
      text: "Transformers use **attention**: each word looks at the other words to decide what they mean together.", points: ["\"The robot dropped the cup because **it** was heavy\": attention links 'it' to 'cup'", "Stack many attention layers → rich understanding of context", "Explore it live in Transformer Explainer (GPT-2)"] }
  ],
  quiz: [
    { q: "What is the main thing a language model does?", options: ["Searches Google", "Predicts the next token", "Looks up a dictionary", "Asks a human"], answer: 1, why: "Everything it writes comes from repeated next-token prediction." },
    { q: "Raising the temperature makes answers...", options: ["More random and creative", "Always correct", "Shorter", "In a different language"], answer: 0, why: "Higher temperature picks less likely words more often." }
  ],
  real: [
    { art: "robot", name: "Chatbots", text: "Study Buddy, ChatGPT and Gemini all generate replies token by token." },
    { art: "laptop", name: "Phone keyboards", text: "The word suggestions above your keyboard are a small next-word model." },
    { art: "cloud", name: "Translation", text: "Modern translators predict the next word in the other language." }
  ],
  game: { title: "Human language model", mins: 8, big: "Each word is chosen from what usually comes next. Different choices give different stories.",
    steps: ["Sit in a circle. The teacher says: 'Once upon a time, a robot'.", "Each student adds ONE word that could come next.", "Round 2: before choosing, roll a die. On a 6 you must pick a surprising word (high temperature!).", "Compare the two stories. Which was more sensible? Which was more fun?"] },
  simWhy: "**Code Lab** (Python) runs the word-chain generator below. **Transformer Explainer** shows a real GPT-2 model choosing the next token, with a temperature slider.",
  builds: [
    { title: "Count what comes next", mins: 12, sim: "code-lab", steps: ["Open Code Lab → Python. Paste the code.", "Put any text you like in `text` (a story, a song, school rules).", "Run it: `nxt` stores which words follow which.", "Print `nxt['the']`. What usually follows 'the'?"],
      code: "import random\ntext = \"\"\"the robot saw the ball. the robot\npicked up the ball. the cat saw the robot.\"\"\"\nwords = text.replace('.', ' .').split()\nnxt = {}\nfor a, b in zip(words, words[1:]):\n    nxt.setdefault(a, []).append(b)\nprint(nxt['the'])" },
    { title: "Generate new sentences", mins: 12, steps: ["Add the generator below the first code.", "Run it several times. Is it the same each time?", "Give it a much longer text. Does the writing get better?", "Find one sentence it made that was never in the text."],
      code: "w = 'the'\nout = [w]\nfor i in range(15):\n    if w not in nxt: break\n    w = random.choice(nxt[w])   # sample!\n    out.append(w)\nprint(' '.join(out))", note: { l: "This is a Markov chain", text: "It only looks back ONE word. Real models look back thousands of tokens, and that's the difference." } },
    { title: "Temperature in the real thing", only: ["core", "advanced"], mins: 10, sim: "transformer-explainer", steps: ["Open Transformer Explainer.", "Type a sentence start and watch the next-token probabilities.", "Move temperature low, then high. Describe the change.", "Find a prompt where the top token is surprising."] }
  ],
  test: { title: "Generator experiments", cols: ["Training text", "How long?", "Sample sentence it made", "Makes sense? (1–5)"],
    rows: [["3 sentences", "short", "", ""], ["A whole story", "long", "", ""], ["School rules", "", "", ""]] },
  levelup: { choices: [{ t: "Two-word memory", d: "Use pairs of words as the key: (a, b) → next. Is it better?" }, { t: "Probabilities", d: "Count and print the % for each next word." }, { t: "Style copy", d: "Train on poems by one poet. Does it 'sound' like them?" }],
    think: { h: "Think like an engineer", text: "Our generator never says something that wasn't in its text as a word pair. Why can real LLMs say new things, and also new false things?" }, boss: "Add a temperature setting to your generator: at low temperature always pick the most common next word." },
  debate: { kicker: "Think about it", title: "Using chatbots well", a: { h: "Great for", points: ["Explaining an idea in another way", "Brainstorming and getting unstuck", "Checking your code's error message"] },
    b: { h: "Be careful with", points: ["Facts, dates and numbers: check them", "Copying answers instead of learning", "Personal information: never share it"] }, note: { l: "Our rule", text: "Use AI like a smart study partner: ask, check, then think for yourself." } },
  wrap: { learned: ["Language models predict the next token", "They learned patterns from huge amounts of text", "Temperature controls randomness", "Fluent is not the same as true: check facts", "I built a Markov-chain text generator"],
    exit: "In one sentence: why can a chatbot sound sure and still be wrong?", home: "Type the start of a sentence on a phone keyboard and keep tapping the middle suggestion. Read your 'AI story' to someone.", next: "**AI-12 Prompting and Fact-Checking**: getting good, honest answers from AI." },
  guide: {
    grouping: "Pairs at a laptop",
    overview: "Demystifies chatbots: they are next-token predictors trained on huge text. The circle game and the Markov-chain build give students a concrete, correct mental model, which is the foundation for responsible AI use (fact-checking, privacy) in AI-12. The advanced tier adds tokens and attention through Transformer Explainer.",
    prep: ["Test Code Lab Python on the laptops (first run downloads Python once)", "Prepare 2–3 longer texts students can paste (a public-domain story, school rules)", "Open Transformer Explainer once to check it loads on the school network (it is large)", "A die for the circle game"],
    timing: [[8, "Hook", "Finish-the-sentence and video"], [14, "Learn", "Next-word guessing, probabilities, tokens, hallucinations"], [8, "Game", "Human language model"], [12, "Build 1", "Count what comes next"], [12, "Build 2", "Generate sentences"], [10, "Build 3", "Transformer Explainer"], [6, "Wrap", "Using chatbots well, exit ticket"]],
    steps: [
      { phase: "Hook", title: "The cat sat on the...", say: "How did you know it was 'mat'? Nobody told you just now.", do: ["Collect three sentence starts from students; the class completes them aloud."] },
      { phase: "Game", title: "Circle story", do: ["Write the story on the board as it grows.", "In the high-temperature round, celebrate surprising words, then ask which story is more believable."] },
      { phase: "Build", title: "From counting to generating", do: ["Stop after Build 1 and show `nxt['the']` on the projector.", "Ask pairs to read their silliest generated sentence aloud."] },
      { phase: "Wrap", title: "Our AI rule", do: ["Agree 'ask, check, think' as a class rule and display it."] }
    ],
    misconceptions: [["Chatbots look things up on the internet", "Many don't; they generate from patterns learned in training (some can also search, but the writing is still prediction)."], ["The AI understands like a person", "It models language patterns extremely well; whether that is 'understanding' is debated. It has no experiences or goals of its own."], ["If it's written well, it's true", "Fluency comes from patterns; truth needs checking."]],
    trouble: [["KeyError: 'the'", "The training text doesn't contain that word in lowercase: use .lower() on the text."], ["Generator stops early", "It reached a word with no followers (the last word): that's what the `break` does."], ["Transformer Explainer is slow", "It downloads a small GPT-2 model; demonstrate on the teacher laptop instead."]],
    tiers: {
      starter: ["Circle game plus phone-keyboard story as a whole class.", "Teacher runs the generator on the projector; students choose the training text.", "Key message: 'it guesses the next word'."],
      core: ["Full lesson as written."],
      advanced: ["Attention slide and Transformer Explainer exploration.", "Two-word memory and temperature implementation.", "Discuss training data, copyright and bias."] },
    assess: [
      { c: "Explains how LLMs work", e: "'It knows things'", s: "Explains next-token prediction and training text", x: "Explains tokens, temperature and attention" },
      { c: "Programming", e: "Runs the given code", s: "Changes text and explains output", x: "Extends the model (2-word memory, temperature)" },
      { c: "Responsible use", e: "Repeats the rule", s: "Explains why to fact-check", x: "Discusses hallucination, privacy and bias" }],
    safety: ["Students under 13 should only use AI chat tools the school has approved (Study Buddy).", "Never paste personal information into an AI tool."]
  }
};
