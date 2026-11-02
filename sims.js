/* Virtual labs: simulators available in the portal.
   PhET simulations: PhET Interactive Simulations, University of Colorado Boulder, https://phet.colorado.edu (CC BY 4.0). Stored in sims/phet so they work without internet.
   BlocksCAD: https://www.blockscad3d.com (open source, GPL v3). Loaded from the official site, needs internet.
   Circuit Lab: our own Arduino simulator (circuit/, installable as an app).
   Code Lab: Python (Pyodide), C++ (g++ online), Python turtle (Skulpt), p5.js, Processing and web pages, in codelab/. */
window.SIMS = {
  list: [
    { key: "circuit-lab", name: "Circuit Lab", by: "Robotics & AI Club", kind: "build", href: "circuit/", offline: false,
      about: "Build Arduino circuits with LEDs, buttons, sensors, servos and motors, write the code and run it.",
      good: "Arduino lessons: blink, traffic lights, sensors, servos, motors", ages: "8+", color: "#2E6BE6" },
    { key: "code-lab", name: "Code Lab", by: "Robotics & AI Club", kind: "code", href: "codelab/", offline: false,
      about: "Write and run Python and C++ in the browser. input() waits for typing, errors are explained, and plots show up.",
      good: "Python and C++ practice, algorithms, AI and data projects (numpy, matplotlib)", ages: "10+", color: "#7C3AED" },
    { key: "cck-dc", name: "Circuit Construction Kit: DC", by: "PhET", kind: "phet", src: "sims/phet/circuit-construction-kit-dc_en.html", web: "https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc",
      about: "Batteries, bulbs, switches and resistors. Build series and parallel circuits and measure them with a meter.",
      good: "Series and parallel circuits, open and closed circuits, conductors and insulators", ages: "8+", color: "#F2A31B" },
    { key: "ohms-law", name: "Ohm's Law", by: "PhET", kind: "phet", src: "sims/phet/ohms-law_en.html", web: "https://phet.colorado.edu/en/simulations/ohms-law",
      about: "Change voltage and resistance and watch the current change. See V = I × R come alive.",
      good: "Why LEDs need a resistor, voltage, current and resistance", ages: "11+", color: "#3FA36B" },
    { key: "resistance-wire", name: "Resistance in a Wire", by: "PhET", kind: "phet", src: "sims/phet/resistance-in-a-wire_en.html", web: "https://phet.colorado.edu/en/simulations/resistance-in-a-wire",
      about: "Make a wire longer, thicker or out of a different material and see how its resistance changes.",
      good: "What resistance is, choosing wires", ages: "11+", color: "#8A5CD6" },
    { key: "cck-ac", name: "Circuit Construction Kit: AC", by: "PhET", kind: "phet", src: "sims/phet/circuit-construction-kit-ac_en.html", web: "https://phet.colorado.edu/en/simulations/circuit-construction-kit-ac",
      about: "Add capacitors, inductors and AC sources. Watch charge flow back and forth.",
      good: "Capacitors, timers, AC and DC", ages: "14+", color: "#D9534F" },
    { key: "capacitor", name: "Capacitor Lab: Basics", by: "PhET", kind: "phet", src: "sims/phet/capacitor-lab-basics_en.html", web: "https://phet.colorado.edu/en/simulations/capacitor-lab-basics",
      about: "Charge a capacitor, change the plates and see how much energy it stores.",
      good: "555 timer circuits, storing energy", ages: "14+", color: "#1E9AA8" },
    { key: "faradays-law", name: "Faraday's Law", by: "PhET", kind: "phet", src: "sims/phet/faradays-law_en.html", web: "https://phet.colorado.edu/en/simulations/faradays-law",
      about: "Move a magnet through a coil and light a bulb. The idea behind every generator.",
      good: "Motors and generators, magnets and electricity", ages: "11+", color: "#E0662B" },
    { key: "em-lab", name: "Faraday's Electromagnetic Lab", by: "PhET", kind: "phet", src: "sims/phet/faradays-electromagnetic-lab_en.html", web: "https://phet.colorado.edu/en/simulations/faradays-electromagnetic-lab",
      about: "Electromagnets, transformers and generators in one lab.",
      good: "Electromagnets, motors, relays and solenoids", ages: "12+", color: "#5B6CD9" },
    { key: "blockscad", name: "BlocksCAD", by: "BlocksCAD", kind: "cad", src: "https://www.blockscad3d.com/editor/", web: "https://www.blockscad3d.com", online: true,
      about: "Snap blocks together to make 3D shapes, then export an STL for the 3D printer.",
      good: "3D modelling and printing, name badges, enclosures, grippers, gears", ages: "10+", color: "#6E3FC8" }
    ,
    /* Free tools used by the Robotics & AI curriculum (rai/). "ext" ones open in a new tab:
       their sites don't allow being shown inside another page, or need a sign-in. */
    { key: "falstad", name: "Falstad Circuit Simulator", by: "Paul Falstad", kind: "elec", src: "https://www.falstad.com/circuit/circuitjs.html", web: "https://www.falstad.com/circuit/", online: true,
      about: "Animated circuits: watch current flow through transistors, relays, logic gates and op-amps.", good: "Transistors, relays, diodes, logic and power circuits", ages: "12+", color: "#C2410C" },
    { key: "wokwi", name: "Wokwi", by: "Wokwi", kind: "elec", ext: true, href: "https://wokwi.com", online: true,
      about: "Online Arduino and ESP32 simulator with Wi-Fi, displays and hundreds of parts.", good: "ESP32 Wi-Fi projects, displays, sharing a project link", ages: "11+", color: "#1E9E5B" },
    { key: "tinkercad", name: "Tinkercad", by: "Autodesk", kind: "cad", ext: true, href: "https://www.tinkercad.com", online: true,
      about: "3D design and circuits in the browser. Free account; teachers can make a class with no student emails.", good: "Robot parts, sensor mounts, grippers, first Arduino circuits", ages: "8+", color: "#1477D4" },
    { key: "circuitverse", name: "CircuitVerse", by: "CircuitVerse", kind: "elec", ext: true, href: "https://circuitverse.org/simulator", online: true,
      about: "Digital logic simulator: gates, adders, flip-flops and truth tables.", good: "Logic gates, robot decision rules, binary", ages: "11+", color: "#42B983" },
    { key: "openroberta", name: "Open Roberta Lab", by: "Fraunhofer IAIS", kind: "robot", ext: true, href: "https://lab.open-roberta.org", online: true,
      about: "Program a simulated robot with blocks, then see the same program as text. No account needed.", good: "First robot programs, sensors, blocks to code", ages: "8+", color: "#F29400" },
    { key: "vexvr", name: "VEXcode VR", by: "VEX Robotics", kind: "robot", ext: true, href: "https://vr.vex.com", online: true,
      about: "A virtual robot in 3D playgrounds: mazes, castles, painting and more, in blocks or Python.", good: "Robot driving, sensors, loops, mazes", ages: "8+", color: "#D7263D" },
    { key: "gearsbot", name: "GearsBot", by: "A Posteriori", kind: "robot", ext: true, href: "https://gears.aposteriori.com.sg", online: true,
      about: "Robot simulator with real physics: line following, obstacle courses and arms, in blocks or Python.", good: "Line followers, feedback control, obstacle avoidance", ages: "10+", color: "#3A6EA5" },
    { key: "webots", name: "Webots", by: "Cyberbotics", kind: "robot", ext: true, href: "https://cyberbotics.com", online: true,
      about: "Professional open-source robot simulator (free download): real robot models, sensors and physics.", good: "Advanced robot simulation, mapping, robot arms", ages: "15+", color: "#5C6BC0" },
    { key: "motiongen", name: "MotionGen", by: "Stony Brook University", kind: "robot", ext: true, href: "https://motiongen.io", online: true,
      about: "Design linkages and watch them move: grabbers, walkers and wipers.", good: "Linkages, mechanisms, walking legs", ages: "11+", color: "#00897B" },
    { key: "geargen", name: "Gear Generator", by: "geargenerator.com", kind: "robot", ext: true, href: "https://geargenerator.com", online: true,
      about: "Spin gear trains, change tooth counts and watch speed and direction change.", good: "Gear ratios, speed and torque", ages: "9+", color: "#6D4C41" },
    { key: "pathfinding", name: "PathFinding Visualiser", by: "Xueqiao Xu (MIT licence)", kind: "robot", src: "https://qiao.github.io/PathFinding.js/visual/", web: "https://github.com/qiao/PathFinding.js", online: true,
      about: "Draw walls and watch BFS, Dijkstra and A* search for the shortest path.", good: "Path planning, graph search, heuristics", ages: "12+", color: "#8E24AA" },
    { key: "blockly-games", name: "Blockly Games", by: "Google (open source)", kind: "robot", ext: true, href: "https://blockly.games", online: true,
      about: "Puzzles that teach loops and conditions: guide a character through mazes.", good: "Algorithms, loops, if-else, first programming", ages: "7+", color: "#4285F4" },
    { key: "codeorg", name: "Code.org", by: "Code.org", kind: "robot", ext: true, href: "https://code.org/learn", online: true,
      about: "Hour of Code puzzles and courses with blocks, for every age.", good: "Sequences, loops, events", ages: "5+", color: "#00ADBC" },
    { key: "teachable", name: "Teachable Machine", by: "Google", kind: "ai", ext: true, href: "https://teachablemachine.withgoogle.com", online: true,
      about: "Train an image, sound or pose model with a webcam or microphone in minutes. Nothing to install.", good: "Training data, classes, testing, AI projects", ages: "7+", color: "#F4511E" },
    { key: "ml4kids", name: "Machine Learning for Kids", by: "Dale Lane", kind: "ai", ext: true, href: "https://machinelearningforkids.co.uk", online: true,
      about: "Train text, image and number models and use them in Scratch or Python projects.", good: "Classifiers, decision trees, AI games", ages: "9+", color: "#2F80ED" },
    { key: "tf-playground", name: "TensorFlow Playground", by: "Google (Apache 2.0)", kind: "ai", src: "https://playground.tensorflow.org", web: "https://playground.tensorflow.org", online: true,
      about: "Tinker with a neural network: add layers and neurons and watch it learn to separate dots.", good: "Neurons, layers, training, overfitting", ages: "12+", color: "#FF6F00" },
    { key: "cnn-explainer", name: "CNN Explainer", by: "Polo Club, Georgia Tech (MIT)", kind: "ai", src: "https://poloclub.github.io/cnn-explainer/", web: "https://github.com/poloclub/cnn-explainer", online: true,
      about: "Follow one picture through a convolutional network, layer by layer.", good: "Convolution, filters, image recognition", ages: "13+", color: "#3949AB" },
    { key: "transformer-explainer", name: "Transformer Explainer", by: "Polo Club, Georgia Tech (MIT)", kind: "ai", src: "https://poloclub.github.io/transformer-explainer/", web: "https://github.com/poloclub/transformer-explainer", online: true,
      about: "See how a real language model (GPT-2) picks the next word: tokens, attention and temperature.", good: "Large language models, attention, temperature", ages: "14+", color: "#00838F" },
    { key: "gan-lab", name: "GAN Lab", by: "Polo Club, Georgia Tech (Apache 2.0)", kind: "ai", src: "https://poloclub.github.io/ganlab/", web: "https://github.com/poloclub/ganlab", online: true,
      about: "Watch two networks compete: one makes fakes, one spots them.", good: "Generative AI, how fakes are made", ages: "14+", color: "#AD1457" },
    { key: "reinforcejs", name: "REINFORCEjs Grid World", by: "Andrej Karpathy (MIT)", kind: "ai", ext: true, href: "https://cs.stanford.edu/people/karpathy/reinforcejs/gridworld_td.html", online: true,
      about: "An agent learns to reach the goal by trial, error and reward. Change the rewards and watch.", good: "Reinforcement learning, rewards, Q-learning", ages: "13+", color: "#6A1B9A" },
    { key: "quickdraw", name: "Quick, Draw!", by: "Google", kind: "ai", ext: true, href: "https://quickdraw.withgoogle.com", online: true,
      about: "Doodle and a neural network guesses what you drew.", good: "What AI recognises, training data from millions of people", ages: "6+", color: "#FBC02D" },
    { key: "codeorg-ai", name: "AI for Oceans", by: "Code.org", kind: "ai", ext: true, href: "https://code.org/oceans", online: true,
      about: "Train an AI to clean the ocean, then discover how training data creates bias.", good: "What AI is, training data, bias", ages: "8+", color: "#0277BD" },
    { key: "colab", name: "Google Colab", by: "Google", kind: "ai", ext: true, href: "https://colab.research.google.com", online: true,
      about: "Free Python notebooks with a GPU in the cloud. Needs a Google account.", good: "Training real neural networks, data science", ages: "15+", color: "#F9AB00" },
    { key: "edge-impulse", name: "Edge Impulse", by: "Edge Impulse", kind: "ai", ext: true, href: "https://edgeimpulse.com", online: true,
      about: "Collect sensor data, train a tiny model and download it as an Arduino library. Free account.", good: "TinyML, gesture and sound models on the ESP32", ages: "15+", color: "#3B47C2" },
    { key: "mediapipe", name: "MediaPipe Studio", by: "Google", kind: "ai", ext: true, href: "https://mediapipe-studio.webapps.google.com", online: true,
      about: "Try hand, face and pose tracking live from your webcam.", good: "Hand and pose tracking, gesture control", ages: "11+", color: "#00897B" },
    { key: "pictoblox", name: "PictoBlox", by: "STEMpedia", kind: "ai", ext: true, href: "https://pictoblox.ai", online: true,
      about: "Scratch-style blocks with AI and machine learning extensions that can drive an Arduino. Free download.", good: "AI + Arduino projects with blocks", ages: "8+", color: "#7E57C2" },
    { key: "moral-machine", name: "Moral Machine", by: "MIT Media Lab", kind: "ai", ext: true, href: "https://www.moralmachine.net", online: true,
      about: "Choose what a self-driving car should do in impossible situations, then compare with the world.", good: "AI ethics debates", ages: "12+", color: "#455A64" },
    { key: "pid-sim", name: "PID Lab", by: "Robotics & AI Club", kind: "robot", src: "rai/sims/pid.html", web: "rai/sims/pid.html",
      about: "Tune P, I and D on a motor and a balancing pendulum, and watch the response graph live.", good: "Feedback control, PID tuning, overshoot", ages: "12+", color: "#2E6BE6" },
    { key: "study-buddy", name: "Study Buddy", by: "Robotics & AI Club", kind: "ai", href: "#buddy",
      about: "The club's own AI tutor. Good for prompt-writing practice and fact-checking lessons.", good: "Prompting, checking AI answers", ages: "8+", color: "#F5B83D" }
  ],
  /* Lessons with a ready-made circuit and code in Circuit Lab (circuit/#lesson=CODE) */
  circuits: "F-00 F-01 F-02 F-04 JM-00 JM-01 JM-02 JM-03 JM-04 JM-05 JM-06 JM-07 JM-08 JM-09 JM-11 JM-12 JM-13 JM-15 JM-20 JM-21 JM-22 JM-23 JM-25 JM-26 JM-27 JM-32 LE-01 LE-02 LE-03 LE-04 LE-05 LE-06 LE-07 LE-08 LE-09 LE-10 LE-11 LE-12 LE-19 LE-21 LE-22 LE-23 LE-30 LE-32 TL-01 TL-02 TL-03 TL-04 TL-05 TL-06 TL-07 TL-08 TL-09 TL-10 TL-12 TL-14 TL-16 TL-19 TL-23 TL-25 TL-26 TL-27 TL-28 YI-02 YI-03 YI-04 YI-05 YI-06 YI-07 YI-08 YI-09 YI-10 YI-11 YI-18 YI-21 YI-22 YI-23 YI-25 YI-26 YI-27 YI-28 YI-32".split(" "),
  /* keyword rules: lesson title or domain -> simulator */
  rules: [
    [/series|parallel|paper circuit|lemon battery|circuit card|conductor|insulator/i, ["cck-dc", "ohms-law"]],
    [/resistor|ohm/i, ["ohms-law", "resistance-wire"]],
    [/555|timer|capacitor/i, ["capacitor", "cck-ac"]],
    [/motor|generator|electromagnet|relay|solenoid|dynamo/i, ["em-lab", "faradays-law"]],
    [/3d|cad|enclosure|gripper|gearbox|badge|mount|printed/i, ["blockscad"]],
    [/python|c\+\+|coding|programm|algorithm|machine learning|neural|tinyml|\bAI\b|data|game|turtle|chatbot/i, ["code-lab"]]
  ]
};
window.SIMS.byKey = Object.fromEntries(window.SIMS.list.map(s => [s.key, s]));
/* simulators for one lesson: [{ sim, href, why }] */
window.SIMS.forLesson = function (code, title, domain) {
  const S = window.SIMS, out = [], seen = new Set();
  const add = (k, href, why) => { if (seen.has(k) || !S.byKey[k]) return; seen.add(k); out.push({ sim: S.byKey[k], href, why }); };
  code = String(code || "").replace(/\s*\(.*\)$/, "");
  if (S.circuits.includes(code)) add("circuit-lab", "circuit/#lesson=" + code, "Ready-made circuit and code for this lesson");
  const txt = (title || "") + " " + (domain || "");
  S.rules.forEach(([re, ks]) => { if (re.test(txt)) ks.forEach(k => S.byKey[k] && add(k, S.byKey[k].href || "sim.html?s=" + k, S.byKey[k].good)); });
  return out;
};
