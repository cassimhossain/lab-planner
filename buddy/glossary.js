/* Study Buddy glossary: short, checked explanations of the words that come
   up in club lessons. Each entry:
     t   the term
     a   other words a student might type for it
     s   simple explanation (for "Explain like I'm 10")
     d   a deeper explanation
     x   a small example (optional; code is Arduino C++ unless it says Python)
     k   words used to find related club lessons
   Teachers: add or correct entries freely. Keep each one short. */
window.BUDDY_GLOSSARY = [
  // ---------- electricity ----------
  { t: "Voltage", a: ["volt", "volts", "potential difference", "v"], s: "Voltage is the push that makes electricity flow, like water pressure in a pipe. A bigger voltage pushes harder.", d: "Voltage is the difference in electrical energy between two points, measured in volts (V). Current only flows when there is a voltage across a complete circuit. An Arduino Uno's pins work at 5 V; an ESP32's at 3.3 V.", k: ["voltage", "battery", "multimeter"] },
  { t: "Current", a: ["amp", "amps", "ampere", "milliamp", "ma"], s: "Current is how much electricity is flowing, like how much water flows through a pipe each second.", d: "Current is the flow of electric charge, measured in amperes (A) or milliamps (mA). An LED needs about 10–20 mA. One Arduino pin should not give more than about 20 mA, which is why motors need a driver.", k: ["current", "circuit", "led"] },
  { t: "Resistance", a: ["ohm", "ohms", "resist"], s: "Resistance is how hard it is for electricity to get through something. More resistance means less current.", d: "Resistance is measured in ohms (Ω). Ohm's law links the three: voltage = current × resistance (V = I × R).", x: "A 5 V supply across a 220 Ω resistor: I = 5 ÷ 220 ≈ 0.023 A, about 23 mA.", k: ["resistor", "ohm"] },
  { t: "Ohm's law", a: ["v=ir", "v = ir", "ohms law"], s: "Ohm's law is a rule that links push (voltage), flow (current) and how hard it is to flow (resistance).", d: "V = I × R. If you know two of them you can find the third: I = V ÷ R and R = V ÷ I. Use it to pick the resistor for an LED.", x: "LED resistor: (5 V − 2 V for the LED) ÷ 0.015 A = 200 Ω, so use the next size up, 220 Ω.", k: ["resistor", "led", "series"] },
  { t: "Circuit", a: ["closed circuit", "open circuit", "complete circuit"], s: "A circuit is a complete loop that electricity travels around, from the battery, through the parts, and back.", d: "If the loop is broken (an open circuit) nothing flows. A switch works by opening and closing the loop.", k: ["circuit", "series", "parallel", "switch"] },
  { t: "Series circuit", a: ["series"], s: "In a series circuit the parts are in one line, one after another. If one breaks, they all stop.", d: "The same current flows through every part, and the voltage is shared between them.", k: ["series", "parallel", "circuit"] },
  { t: "Parallel circuit", a: ["parallel"], s: "In a parallel circuit each part has its own path to the battery, so if one stops the others keep working.", d: "Each branch gets the full voltage, and the currents of the branches add up. Houses are wired in parallel.", k: ["parallel", "series", "circuit"] },
  { t: "Short circuit", a: ["short", "shorted"], s: "A short circuit is when electricity finds a shortcut with almost no resistance. It can make wires and batteries hot. Avoid it!", d: "With almost zero resistance, the current becomes very large (I = V ÷ R). Never connect a battery's + and − directly together, and never connect 5V straight to GND.", k: ["battery", "safety"] },
  { t: "Ground", a: ["gnd", "0v", "negative"], s: "Ground (GND) is the 'zero' point of a circuit, the place the electricity returns to.", d: "All voltages are measured compared to ground. Parts that work together must share the same GND, so connect the GND of a sensor, a driver and the Arduino together.", k: ["ground", "circuit"] },
  { t: "Battery", a: ["batteries", "cell", "9v", "aa battery", "lithium", "li-ion", "lipo"], s: "A battery stores energy and gives it out as electricity. It has a + end and a − end.", d: "A battery turns chemical energy into electrical energy. Safety: never short its ends, never puncture or heat lithium batteries, and stop using one that gets hot or swells.", k: ["battery", "power", "solar"] },
  { t: "Multimeter", a: ["meter", "voltmeter", "ammeter"], s: "A multimeter is a tool that measures voltage, current and resistance.", d: "For voltage, put the probes across the part (in parallel). For current, the meter must be in the path of the current (in series). Start on the highest range.", k: ["multimeter", "voltage"] },
  { t: "Conductor", a: ["insulator", "conductors", "insulators"], s: "A conductor lets electricity through easily, like copper wire. An insulator stops it, like plastic or rubber.", d: "Metals are good conductors because their electrons move freely. Wires are copper covered with an insulator so they don't touch each other.", k: ["conductor", "circuit"] },

  // ---------- components ----------
  { t: "LED", a: ["leds", "light emitting diode", "light-emitting diode"], s: "An LED is a tiny light. It only works one way round: the long leg goes to +.", d: "A light-emitting diode lets current flow one way only. It always needs a resistor (about 220 Ω on 5 V) or it can burn out. The long leg is the anode (+), the short leg the cathode (−).", x: "digitalWrite(13, HIGH);  // turn the LED on pin 13 on", k: ["led", "traffic", "light"] },
  { t: "Resistor", a: ["resistors", "220 ohm", "10k"], s: "A resistor slows down electricity. It protects parts like LEDs from getting too much current.", d: "Resistors are measured in ohms and read by their coloured bands. Common values in the lab: 220 Ω for LEDs, 10 kΩ for buttons and light sensors.", k: ["resistor", "led", "ldr"] },
  { t: "Breadboard", a: ["bread board", "prototype board"], s: "A breadboard is a board with holes for building circuits without soldering. Holes in the same short row are joined inside.", d: "Each row of 5 holes is connected. The long + and − rails along the sides are connected along their length, for power and ground. The gap in the middle separates the two halves.", k: ["breadboard", "circuit"] },
  { t: "Jumper wire", a: ["jumper", "jumpers", "dupont"], s: "Jumper wires are short wires with pins on the ends for connecting parts on a breadboard.", d: "M-M means male pin on both ends, M-F male to female. Use colours to stay tidy: red for +, black for GND.", k: ["jumper", "breadboard"] },
  { t: "Push button", a: ["button", "pushbutton", "switch", "tactile switch"], s: "A push button closes the circuit while you press it.", d: "Read it with digitalRead(). Use INPUT_PULLUP so the pin reads HIGH normally and LOW when pressed, with no extra resistor.", x: "pinMode(2, INPUT_PULLUP);\nif (digitalRead(2) == LOW) { /* pressed */ }", k: ["button", "doorbell", "switch"] },
  { t: "Buzzer", a: ["piezo", "beeper", "speaker"], s: "A buzzer makes a beep when electricity goes through it.", d: "An active buzzer beeps by itself with power. A passive buzzer needs a changing signal: use tone(pin, frequency) to play notes.", x: "tone(8, 440, 500);  // play A (440 Hz) for half a second", k: ["buzzer", "alarm", "sound"] },
  { t: "LDR", a: ["light sensor", "photoresistor", "light dependent resistor"], s: "An LDR is a light sensor. Its resistance changes with how much light falls on it.", d: "Its resistance falls in bright light. Put it in a voltage divider with a 10 kΩ resistor and read it with analogRead() to get a number from 0 to 1023.", k: ["ldr", "light", "streetlight"] },
  { t: "Potentiometer", a: ["pot", "knob", "variable resistor"], s: "A potentiometer is a knob you turn to change a value, like a volume control.", d: "It is a resistor with a sliding middle contact. Connect the ends to 5V and GND and the middle to an analog pin; analogRead() gives 0–1023 as you turn it.", k: ["potentiometer", "knob"] },
  { t: "Servo motor", a: ["servo", "sg90", "mg995"], s: "A servo is a motor that turns to an exact angle, from 0 to 180 degrees, and holds it.", d: "Control it with the Servo library and a PWM pin. Small servos like the SG90 are fine for light jobs; several servos need their own 5 V supply, not the Arduino's.", x: "#include <Servo.h>\nServo s;\nvoid setup() { s.attach(9); }\nvoid loop() { s.write(90); }  // point to 90 degrees", k: ["servo", "arm", "gate"] },
  { t: "DC motor", a: ["motor", "motors", "gear motor"], s: "A DC motor spins round and round when you give it power. Swap the wires and it spins the other way.", d: "Motors need more current than a pin can give, so use a motor driver such as an L298N or L9110. Speed is set with PWM (analogWrite).", k: ["motor", "fan", "car", "robot"] },
  { t: "Motor driver", a: ["l298n", "l9110", "h-bridge", "h bridge", "driver"], s: "A motor driver is a helper chip that lets a small Arduino control a big, hungry motor.", d: "An H-bridge driver switches a separate power supply to the motor, and lets you change direction. The Arduino only sends small control signals.", k: ["motor", "driver", "robot"] },
  { t: "Ultrasonic sensor", a: ["hc-sr04", "hcsr04", "distance sensor", "sonar"], s: "An ultrasonic sensor measures distance like a bat: it sends a sound too high to hear and times the echo.", d: "Send a 10 µs pulse on TRIG, measure the echo time on ECHO with pulseIn(), then distance in cm ≈ time ÷ 58.", x: "long t = pulseIn(ECHO, HIGH);\nint cm = t / 58;", k: ["ultrasonic", "distance", "parking"] },
  { t: "PIR sensor", a: ["pir", "motion sensor", "hc-sr501"], s: "A PIR sensor notices when something warm, like a person, moves in front of it.", d: "It outputs HIGH when it detects motion. Give it a minute to settle after power-up.", k: ["pir", "motion", "alarm", "security"] },
  { t: "DHT11", a: ["dht22", "temperature sensor", "humidity sensor", "dht"], s: "The DHT11 measures temperature and how damp the air is (humidity).", d: "It sends its readings over one data pin. Read it with the DHT library, no faster than once a second.", k: ["temperature", "humidity", "weather"] },
  { t: "OLED display", a: ["oled", "ssd1306", "screen", "display"], s: "An OLED is a small screen that can show words, numbers and simple drawings.", d: "The common 0.96 inch SSD1306 OLED is 128×64 pixels and talks over I²C (SDA and SCL).", k: ["oled", "display", "weather"] },
  { t: "LCD", a: ["16x2", "lcd display", "liquid crystal"], s: "An LCD shows two lines of text, 16 letters each.", d: "With an I²C backpack it only needs 4 wires: VCC, GND, SDA, SCL. Use the LiquidCrystal_I2C library.", k: ["lcd", "display"] },
  { t: "Relay", a: ["relay module"], s: "A relay is a switch that the Arduino can flip with a small signal.", d: "In the club, relays only switch low-voltage things such as a 5 V fan or LED strip. Never use one with mains electricity.", k: ["relay", "smart home"] },
  { t: "RGB LED", a: ["rgb", "neopixel", "ws2812"], s: "An RGB LED has red, green and blue lights inside. Mixing them makes any colour.", d: "A normal RGB LED uses three PWM pins. NeoPixels (WS2812) are chained and controlled through one data pin with a library.", k: ["rgb", "neopixel", "colour"] },
  { t: "Solar panel", a: ["solar", "solar cell"], s: "A solar panel turns sunlight into electricity.", d: "Its voltage and current change with the light. Small panels can charge a battery through a charge controller.", k: ["solar", "energy", "power"] },

  // ---------- boards ----------
  { t: "Arduino", a: ["arduino uno", "uno", "nano", "mega", "microcontroller"], s: "An Arduino is a tiny computer on a board. You write a program and it controls lights, motors and sensors.", d: "The Uno has an ATmega328P chip, 14 digital pins (6 with PWM) and 6 analog inputs, and works at 5 V. Programs are called sketches and are written in C++.", k: ["arduino", "uno"] },
  { t: "ESP32", a: ["esp-32", "esp 32", "esp32 devkit"], s: "The ESP32 is a small, powerful board with Wi-Fi and Bluetooth built in.", d: "Its pins work at 3.3 V, not 5 V, so be careful with 5 V sensors. It can join Wi-Fi, host a web page or talk to other ESP32s with ESP-NOW.", k: ["esp32", "wifi", "iot"] },
  { t: "Pin", a: ["pins", "gpio", "digital pin", "analog pin"], s: "Pins are the little metal connectors on a board where you plug in wires.", d: "Digital pins are on or off (HIGH or LOW). Analog input pins (A0–A5 on the Uno) read voltages as numbers from 0 to 1023. Some digital pins can do PWM, marked with ~.", k: ["pin", "arduino"] },
  { t: "PWM", a: ["pulse width modulation", "analogwrite", "analog write"], s: "PWM is a trick to make 'half on': the pin switches on and off very fast, so an LED looks dimmer or a motor goes slower.", d: "analogWrite(pin, value) with value 0–255 sets the duty cycle: 0 is always off, 255 always on, 127 on about half the time. Only pins marked ~ can do it on the Uno.", x: "analogWrite(9, 64);  // about a quarter brightness", k: ["pwm", "led", "motor", "fan"] },
  { t: "I2C", a: ["i²c", "iic", "sda", "scl", "twi"], s: "I²C is a way for a board to talk to lots of parts using just two wires.", d: "The two wires are SDA (data) and SCL (clock). Each device has its own address. On the Uno they are A4 (SDA) and A5 (SCL).", k: ["i2c", "oled", "lcd"] },
  { t: "Serial Monitor", a: ["serial", "serial.print", "serial.println", "baud", "serial.begin"], s: "The Serial Monitor is a window where your Arduino can print messages, so you can see what it is doing.", d: "Start it with Serial.begin(9600) in setup(), then print with Serial.println(value). The monitor's speed must match the number in Serial.begin.", x: "Serial.begin(9600);\nSerial.println(analogRead(A0));", k: ["serial", "debug"] },

  // ---------- Arduino code ----------
  { t: "setup()", a: ["setup", "void setup"], s: "setup() is the part of an Arduino program that runs once, when the board starts.", d: "Use it to set pin modes, start Serial and attach servos. Then loop() runs forever.", x: "void setup() { pinMode(13, OUTPUT); }", k: ["arduino", "code"] },
  { t: "loop()", a: ["void loop", "main loop"], s: "loop() is the part of an Arduino program that repeats again and again, forever.", d: "Everything the board keeps doing, like checking sensors, goes in loop(). Avoid long delays in it if you need to react quickly.", x: "void loop() { digitalWrite(13, HIGH); delay(500); digitalWrite(13, LOW); delay(500); }", k: ["arduino", "code", "blink"] },
  { t: "pinMode", a: ["pinmode", "output", "input", "input_pullup"], s: "pinMode tells the Arduino whether a pin is for sending (OUTPUT) or listening (INPUT).", d: "pinMode(pin, OUTPUT) for LEDs and buzzers; INPUT for sensors; INPUT_PULLUP for buttons without an extra resistor.", x: "pinMode(2, INPUT_PULLUP);", k: ["arduino", "code"] },
  { t: "digitalWrite", a: ["digitalwrite", "high", "low"], s: "digitalWrite turns a pin on (HIGH) or off (LOW).", d: "HIGH puts 5 V (3.3 V on ESP32) on the pin, LOW puts 0 V. The pin must be set as OUTPUT first.", x: "digitalWrite(13, HIGH);", k: ["arduino", "led"] },
  { t: "digitalRead", a: ["digitalread"], s: "digitalRead checks if a pin is on (HIGH) or off (LOW), for example whether a button is pressed.", d: "It returns HIGH or LOW. With INPUT_PULLUP a pressed button reads LOW.", k: ["button", "arduino"] },
  { t: "analogRead", a: ["analogread", "adc", "0-1023", "1023"], s: "analogRead measures a voltage and gives a number from 0 (0 V) to 1023 (5 V).", d: "It uses the board's analog-to-digital converter. On the ESP32 the range is 0–4095. Use map() to turn the number into something useful.", x: "int light = analogRead(A0);", k: ["ldr", "potentiometer", "sensor"] },
  { t: "delay", a: ["delay()", "millis", "millis()"], s: "delay(1000) makes the Arduino wait for 1000 milliseconds, which is one second.", d: "While delay() waits, the board does nothing else. To do several things at once, check millis() (time since start) instead.", x: "delay(250);  // wait a quarter of a second", k: ["arduino", "blink", "timer"] },
  { t: "map()", a: ["map", "map function"], s: "map() changes a number from one range to another, like turning 0–1023 into 0–180 for a servo.", d: "map(value, fromLow, fromHigh, toLow, toHigh). It works with whole numbers only.", x: "int angle = map(analogRead(A0), 0, 1023, 0, 180);", k: ["servo", "potentiometer"] },
  { t: "Library", a: ["libraries", "#include", "include"], s: "A library is code someone else wrote that you can use, so you don't start from zero.", d: "Add it at the top with #include. Circuit Lab has the common ones built in: Servo, LiquidCrystal_I2C, DHT, Adafruit SSD1306 and more.", x: "#include <Servo.h>", k: ["library", "arduino"] },

  // ---------- programming ideas ----------
  { t: "Variable", a: ["variables", "int", "float", "string"], s: "A variable is a labelled box that stores a value, like a score or a temperature.", d: "In C++ you say the type first: int for whole numbers, float for decimals, bool for true/false. In Python you just write name = value.", x: "int score = 0;   // C++\nscore = 0        # Python", k: ["variable", "code"] },
  { t: "If statement", a: ["if", "else", "if else", "condition", "elif"], s: "An if statement lets the program make a choice: if something is true, do this; otherwise do that.", d: "Compare with == (equal), != (not equal), <, >, <=, >=. In Python the code inside is indented; in C++ it goes inside { }.", x: "if (distance < 10) { digitalWrite(8, HIGH); } else { digitalWrite(8, LOW); }", k: ["if", "logic", "code"] },
  { t: "Loop", a: ["for loop", "while loop", "for", "while", "repeat"], s: "A loop repeats some code, so you don't have to write it again and again.", d: "A for loop repeats a set number of times; a while loop repeats as long as something is true. Make sure a while loop can end!", x: "for i in range(5):\n    print(i)      # Python: prints 0 to 4", k: ["loop", "code"] },
  { t: "Function", a: ["functions", "def", "method", "return"], s: "A function is a named set of steps you can use again whenever you want.", d: "Functions can take inputs (parameters) and give back a result with return. They keep programs tidy.", x: "def area(w, h):\n    return w * h   # Python", k: ["function", "code"] },
  { t: "List", a: ["lists", "array", "arrays"], s: "A list keeps many values in order under one name, like a row of boxes.", d: "Items are counted from 0. In C++ this is an array with a fixed size: int marks[5];", x: "marks = [72, 85, 90]\nprint(marks[0])   # Python: 72", k: ["list", "data"] },
  { t: "Boolean", a: ["bool", "true", "false", "and", "or", "not"], s: "A boolean is a value that is either true or false.", d: "Combine conditions with and/or/not in Python, or &&, ||, ! in C++.", k: ["logic", "code"] },
  { t: "Bug", a: ["debug", "debugging", "error", "errors"], s: "A bug is a mistake in a program. Debugging means finding and fixing it.", d: "Read the error message and its line number, print values to see what is happening, and change one thing at a time.", k: ["debug", "code"] },
  { t: "Syntax error", a: ["syntaxerror", "syntax"], s: "A syntax error means the computer can't understand how something is written, like a missing bracket or colon.", d: "Check the line it names and the line before it for missing : ( ) { } ; or quote marks.", k: ["debug", "code"] },
  { t: "Algorithm", a: ["algorithms", "pseudocode", "flowchart"], s: "An algorithm is a list of clear steps to solve a problem, like a recipe.", d: "Write the steps first in plain words or as a flowchart, then turn them into code.", k: ["algorithm", "logic"] },
  { t: "Python", a: ["py", "python3"], s: "Python is a programming language that is easy to read. You can try it in Code Lab.", d: "Python uses indentation instead of { }. Code Lab runs real Python in your browser, including numpy, pandas and matplotlib.", k: ["python", "code"] },
  { t: "C++", a: ["cpp", "c plus plus"], s: "C++ is the language Arduino programs are written in. It is fast and very common.", d: "Every statement ends with ; and blocks go inside { }. Variables need a type such as int or float.", k: ["c++", "arduino"] },

  // ---------- robotics and IoT ----------
  { t: "Robot", a: ["robots", "robotics"], s: "A robot is a machine that can sense the world, decide what to do, and act, all by itself.", d: "Most robots follow the sense–think–act loop: sensors gather information, a program decides, and motors or lights act on it.", k: ["robot", "robotics"] },
  { t: "Sensor", a: ["sensors"], s: "A sensor is a part that notices something about the world, like light, distance or temperature, and turns it into a signal.", d: "Digital sensors give on/off; analog sensors give a range of values you read with analogRead(); smart sensors talk over I²C or serial.", k: ["sensor"] },
  { t: "Actuator", a: ["actuators"], s: "An actuator is a part that makes something happen: a motor that moves, a buzzer that beeps, a light that shines.", d: "Sensors are the robot's senses; actuators are its muscles. Most actuators need more power than a pin gives.", k: ["actuator", "motor", "servo"] },
  { t: "Feedback loop", a: ["feedback", "closed loop", "control"], s: "A feedback loop is when a machine checks what happened and corrects itself, like steering to stay on a line.", d: "Measure, compare with the goal, adjust, repeat. A line-following robot and a thermostat both use feedback.", k: ["robot", "line", "control"] },
  { t: "IoT", a: ["internet of things", "smart home", "wifi", "wi-fi"], s: "IoT means everyday things connected to the internet, like a plant pot that messages you when it's dry.", d: "Boards like the ESP32 send sensor data over Wi-Fi to a phone, web page or cloud service.", k: ["iot", "esp32", "wifi", "smart"] },
  { t: "Bluetooth", a: ["ble", "hc-05"], s: "Bluetooth lets devices talk without wires over a short distance, like a phone and a robot car.", d: "The ESP32 has Bluetooth built in; an Uno can use an HC-05 module over serial.", k: ["bluetooth", "car", "esp32"] },
  { t: "3D printing", a: ["3d printer", "stl", "tinkercad", "blockscad", "cad"], s: "3D printing builds a solid object layer by layer from a design on the computer.", d: "Design in a CAD tool such as BlocksCAD or Tinkercad, export an STL file, then slice it for the printer.", k: ["3d", "design", "cad"] },

  // ---------- AI ----------
  { t: "Artificial intelligence", a: ["ai", "a.i.", "artificial intelligence"], s: "AI is when computers do things that normally need thinking, like recognising faces or understanding words.", d: "Most AI today learns patterns from lots of examples instead of following rules a person wrote. It can be very useful and it can also be wrong.", k: ["ai", "data"] },
  { t: "Machine learning", a: ["ml", "training", "train", "model"], s: "Machine learning is how a computer learns from examples, like learning what a cat looks like from many cat photos.", d: "A model is trained on labelled data, then makes predictions on new data. More, better and fairer data usually means better results.", k: ["ai", "machine learning", "data"] },
  { t: "Dataset", a: ["data set", "data", "training data"], s: "A dataset is a big collection of examples that a computer learns from.", d: "Good datasets are large, correctly labelled and fair: if a group is missing from the data, the AI may not work well for them.", k: ["data", "ai"] },
  { t: "Neural network", a: ["neural net", "neuron", "perceptron", "deep learning"], s: "A neural network is a computer program made of lots of tiny connected 'neurons' that learn together, a bit like a brain.", d: "Each neuron multiplies its inputs by weights, adds them and passes the result on. Training adjusts the weights. A perceptron is the simplest one: a single neuron.", k: ["ai", "neural", "perceptron"] },
  { t: "Bias in AI", a: ["bias", "fairness", "ethics"], s: "Bias is when an AI is unfair to some people, often because the examples it learned from were unfair.", d: "Check who is in the data, test the AI on different groups, and keep a human in charge of important decisions.", k: ["ai", "ethics"] },
  { t: "Computer vision", a: ["image recognition", "camera", "object detection"], s: "Computer vision is AI that looks at pictures or video and works out what is in them.", d: "It finds patterns of pixels, such as edges and shapes, to recognise objects, faces or colours.", k: ["ai", "camera", "vision"] },
];

/* Safety notes Study Buddy adds when a question touches these words. */
window.BUDDY_SAFETY = [
  { k: ["mains", "wall socket", "socket", "plug", "220v", "230v", "240v", "220 v", "230 v", "240 v", "outlet", "household wiring", "ac power"], refuse: true,
    m: "That's mains electricity, and it can kill. Club projects only use USB, AA or 9 V batteries and power banks. Mains wiring is only for qualified electricians. Want to build a safe low-voltage version instead?" },
  { k: ["solder", "soldering", "soldering iron"], m: "Soldering safety: the iron is hotter than 300 °C. Only solder with a teacher there, in a ventilated room, with safety glasses, and always put the iron back in its stand." },
  { k: ["lithium", "lipo", "li-ion", "18650", "swollen battery", "battery hot"], m: "Battery safety: never short, puncture, crush or heat a lithium battery. If one gets hot or swells, stop, move away from it and tell a teacher." },
  { k: ["motor", "servo", "relay"], m: "Tip: motors, several servos and relays need their own supply or a driver. Don't power them straight from an Arduino pin." },
  { k: ["laser"], m: "Laser safety: never point a laser at anyone's eyes, even a small one." },
];

/* How to wire the club's modules. Each entry:
     t     module name;  a  other names students use
     bus   "I2C" / "SPI" / "UART" when it uses one (Study Buddy explains the bus)
     pins  [module pin, Arduino Uno, ESP32, note]
     tip   the one thing that usually goes wrong
   The Uno and ESP32 pins are the ones the club's lessons and Circuit Lab use;
   any free pin of the same kind works if the code is changed to match. */
window.BUDDY_WIRING = [
  { t: "OLED display (SSD1306, I²C)", a: ["oled", "ssd1306", "0.96 oled", "oled display"], bus: "I2C",
    pins: [["VCC", "5V (or 3.3V)", "3.3V", "power"], ["GND", "GND", "GND", "ground"], ["SCL", "A5", "GPIO 22", "clock line"], ["SDA", "A4", "GPIO 21", "data line"]],
    tip: "Most 0.96\" OLEDs use I²C address 0x3C. If the screen stays black, check SDA and SCL aren't swapped." },
  { t: "LCD 16×2 with I²C backpack", a: ["lcd", "16x2", "lcd i2c", "liquidcrystal"], bus: "I2C",
    pins: [["VCC", "5V", "5V (VIN)", "the LCD needs 5V"], ["GND", "GND", "GND", ""], ["SDA", "A4", "GPIO 21", ""], ["SCL", "A5", "GPIO 22", ""]],
    tip: "If you see blocks or nothing, turn the little blue contrast screw on the backpack. Address is usually 0x27 or 0x3F." },
  { t: "MPU6050 accelerometer / gyro", a: ["mpu6050", "mpu 6050", "gyro", "accelerometer", "imu"], bus: "I2C",
    pins: [["VCC", "5V", "3.3V", ""], ["GND", "GND", "GND", ""], ["SCL", "A5", "GPIO 22", ""], ["SDA", "A4", "GPIO 21", ""]],
    tip: "Several I²C modules can share the same SDA and SCL wires, as long as their addresses differ." },
  { t: "DS3231 real-time clock", a: ["ds3231", "rtc", "real time clock"], bus: "I2C",
    pins: [["VCC", "5V", "3.3V", ""], ["GND", "GND", "GND", ""], ["SDA", "A4", "GPIO 21", ""], ["SCL", "A5", "GPIO 22", ""]],
    tip: "The coin battery keeps the time when the board is off." },
  { t: "Ultrasonic sensor HC-SR04", a: ["hc-sr04", "hcsr04", "ultrasonic", "distance sensor", "sonar"],
    pins: [["VCC", "5V", "5V (VIN)", "needs 5V"], ["TRIG", "D9", "GPIO 5", "Arduino sends the ping"], ["ECHO", "D10", "GPIO 18 through a divider", "sensor sends the echo back"], ["GND", "GND", "GND", ""]],
    tip: "On an ESP32 the ECHO pin gives 5V: put a 1 kΩ + 2 kΩ voltage divider before the ESP32 pin, or use the 3.3V HC-SR04P." },
  { t: "Servo motor (SG90 / MG995)", a: ["servo", "sg90", "mg995", "servo motor"],
    pins: [["Brown / black wire", "GND", "GND", "ground"], ["Red wire", "5V", "5V (VIN)", "power"], ["Orange / yellow wire", "D9", "GPIO 13", "signal (PWM)"]],
    tip: "One small SG90 can run from the Arduino's 5V. Two or more, or an MG995, need their own 5V supply, with its GND joined to the Arduino's GND." },
  { t: "DHT11 / DHT22 temperature & humidity", a: ["dht11", "dht22", "dht", "temperature sensor", "humidity sensor"],
    pins: [["VCC (+)", "5V", "3.3V", ""], ["DATA (out)", "D2", "GPIO 4", ""], ["GND (−)", "GND", "GND", ""]],
    tip: "The 3-pin module already has its resistor. A bare 4-pin sensor needs a 10 kΩ resistor from DATA to VCC. Read it at most once a second." },
  { t: "PIR motion sensor HC-SR501", a: ["pir", "hc-sr501", "motion sensor"],
    pins: [["VCC", "5V", "5V (VIN)", ""], ["OUT", "D2", "GPIO 27", "HIGH when it sees motion"], ["GND", "GND", "GND", ""]],
    tip: "Give it about a minute to settle after power-up. The two orange screws set sensitivity and how long OUT stays HIGH." },
  { t: "LED", a: ["led", "leds", "light emitting diode"],
    pins: [["Long leg (anode, +)", "D13 through a 220 Ω resistor", "GPIO 2 through a 220 Ω resistor", ""], ["Short leg (cathode, −)", "GND", "GND", "flat side of the LED"]],
    tip: "Always use the resistor. An LED the wrong way round simply stays off." },
  { t: "RGB LED (common cathode)", a: ["rgb led", "rgb"],
    pins: [["R", "D9 + 220 Ω", "GPIO 25 + 220 Ω", "PWM pin"], ["Common (longest leg)", "GND", "GND", "5V instead for common anode"], ["G", "D10 + 220 Ω", "GPIO 26 + 220 Ω", ""], ["B", "D11 + 220 Ω", "GPIO 27 + 220 Ω", ""]],
    tip: "With a common-anode LED the longest leg goes to 5V and LOW turns a colour on." },
  { t: "Push button", a: ["button", "push button", "pushbutton", "tactile switch", "switch"],
    pins: [["One leg", "D2", "GPIO 15", "use INPUT_PULLUP"], ["Opposite leg", "GND", "GND", ""]],
    tip: "With pinMode(2, INPUT_PULLUP) the pin reads LOW when pressed, and no resistor is needed. Use legs on opposite sides of the button." },
  { t: "Buzzer", a: ["buzzer", "piezo", "beeper"],
    pins: [["+ (longer leg)", "D8", "GPIO 23", ""], ["−", "GND", "GND", ""]],
    tip: "An active buzzer beeps with digitalWrite; a passive one needs tone(pin, frequency)." },
  { t: "LDR light sensor", a: ["ldr", "light sensor", "photoresistor"],
    pins: [["LDR leg 1", "5V", "3.3V", ""], ["LDR leg 2 and 10 kΩ resistor", "A0", "GPIO 34", "the middle point"], ["Other end of the 10 kΩ", "GND", "GND", ""]],
    tip: "This is a voltage divider. On a 3-pin LDR module: VCC, GND and AO → A0." },
  { t: "Potentiometer", a: ["potentiometer", "pot", "knob"],
    pins: [["Outer leg", "5V", "3.3V", ""], ["Middle leg (wiper)", "A0", "GPIO 34", "the value"], ["Other outer leg", "GND", "GND", ""]],
    tip: "analogRead gives 0–1023 on an Uno and 0–4095 on an ESP32." },
  { t: "Soil moisture / rain / water-level sensor", a: ["soil moisture", "soil sensor", "rain sensor", "water level", "moisture sensor"],
    pins: [["VCC", "5V", "3.3V", ""], ["GND", "GND", "GND", ""], ["AO (analog)", "A0", "GPIO 34", "how wet"], ["DO (digital)", "D7 (optional)", "GPIO 35 (optional)", "wet / dry by the blue screw"]],
    tip: "Power the probe only while reading (from a pin) so it doesn't corrode." },
  { t: "Gas sensor MQ-2 / flame sensor", a: ["mq-2", "mq2", "gas sensor", "smoke sensor", "flame sensor"],
    pins: [["VCC", "5V", "5V (VIN)", ""], ["GND", "GND", "GND", ""], ["AO", "A0", "GPIO 34 through a divider", ""], ["DO", "D7", "GPIO 35", "trip point set by the screw"]],
    tip: "An MQ sensor warms up for a minute and gets hot: that's normal. Test it with a lighter only with a teacher." },
  { t: "IR obstacle / line sensor", a: ["ir sensor", "ir obstacle", "line sensor", "tcrt5000", "line follower sensor"],
    pins: [["VCC", "5V", "3.3V", ""], ["GND", "GND", "GND", ""], ["OUT", "D2", "GPIO 14", "usually LOW when it sees something / a black line differs by module"]],
    tip: "Turn the blue screw until the little LED switches exactly when you want." },
  { t: "Relay module", a: ["relay", "relay module"],
    pins: [["VCC", "5V", "5V (VIN)", ""], ["GND", "GND", "GND", ""], ["IN", "D7", "GPIO 26", ""], ["COM / NO / NC", "the low-voltage load", "the low-voltage load", "screw terminals"]],
    tip: "In the club, relays only switch low-voltage things (a 5 V fan, a battery LED strip). Never mains." },
  { t: "L298N motor driver", a: ["l298n", "l298", "motor driver", "h-bridge"],
    pins: [["ENA (take off the jumper)", "D5 (PWM)", "GPIO 14", "speed of motor A"], ["IN1", "D8", "GPIO 27", "direction A"], ["IN2", "D9", "GPIO 26", "direction A"], ["IN3", "D10", "GPIO 25", "direction B"], ["IN4", "D11", "GPIO 33", "direction B"], ["ENB (take off the jumper)", "D6 (PWM)", "GPIO 32", "speed of motor B"], ["12V terminal", "battery pack +", "battery pack +", "motor power"], ["GND terminal", "battery − AND Arduino GND", "battery − AND ESP32 GND", "shared ground"], ["OUT1/OUT2, OUT3/OUT4", "motor A, motor B", "motor A, motor B", ""]],
    tip: "The grounds must be joined, or nothing moves. Motors run from the battery pack, never from the Arduino's 5V." },
  { t: "RFID reader RC522", a: ["rc522", "rfid", "mfrc522", "rfid reader"], bus: "SPI",
    pins: [["3.3V", "3.3V", "3.3V", "NOT 5V"], ["RST", "D9", "GPIO 4", ""], ["GND", "GND", "GND", ""], ["MISO", "D12", "GPIO 19", ""], ["MOSI", "D11", "GPIO 23", ""], ["SCK", "D13", "GPIO 18", ""], ["SDA (SS)", "D10", "GPIO 5", "chip select"]],
    tip: "The RC522 runs on 3.3V only: 5V can damage it. Its \"SDA\" pin is SPI chip-select here, not I²C." },
  { t: "NeoPixel / WS2812 LED strip or ring", a: ["neopixel", "ws2812", "ws2812b", "led ring", "led strip", "addressable led"],
    pins: [["5V", "5V", "5V (VIN)", ""], ["GND", "GND", "GND", ""], ["DIN", "D6 through 330 Ω", "GPIO 16 through 330 Ω", "data in"]],
    tip: "More than about 8 LEDs at full white need their own 5V supply. Data goes into DIN, at the arrow's start." },
  { t: "Bluetooth module HC-05", a: ["hc-05", "hc05", "bluetooth module"], bus: "UART",
    pins: [["VCC", "5V", "—", "the ESP32 has Bluetooth built in"], ["GND", "GND", "—", ""], ["TXD", "D10 (SoftwareSerial RX)", "—", "TX goes to RX"], ["RXD", "D11 through a 1 kΩ + 2 kΩ divider", "—", "the HC-05's RX is 3.3V"]],
    tip: "TX of one goes to RX of the other. The default pairing code is usually 1234." },
  { t: "Joystick module", a: ["joystick", "thumbstick"],
    pins: [["VCC (+5V)", "5V", "3.3V", ""], ["GND", "GND", "GND", ""], ["VRx", "A0", "GPIO 34", "left–right"], ["VRy", "A1", "GPIO 35", "up–down"], ["SW", "D2", "GPIO 15", "press; use INPUT_PULLUP"]],
    tip: "In the middle it reads about 512 on an Uno." },
  { t: "MAX7219 8×8 LED matrix", a: ["max7219", "led matrix", "8x8 matrix", "dot matrix"], bus: "SPI",
    pins: [["VCC", "5V", "5V (VIN)", ""], ["GND", "GND", "GND", ""], ["DIN", "D12", "GPIO 23", ""], ["CS", "D10", "GPIO 5", ""], ["CLK", "D11", "GPIO 18", ""]],
    tip: "Match the three pin numbers in LedControl(DIN, CLK, CS, 1) to your wires." },
];

/* What the three shared buses are, for "what is SDA/SCL/MOSI/TX" questions. */
window.BUDDY_BUSES = {
  I2C: "I²C uses two shared wires: SDA (data) and SCL (clock), plus power and GND. On an Arduino Uno SDA is A4 and SCL is A5 (also labelled SDA/SCL by the AREF pin); on an ESP32 SDA is GPIO 21 and SCL is GPIO 22. Many I²C modules can share the same two wires because each has its own address.",
  SPI: "SPI uses MOSI (data out), MISO (data in), SCK (clock) and one CS/SS (chip select) wire per device. On an Uno: MOSI D11, MISO D12, SCK D13, CS usually D10. On an ESP32: MOSI 23, MISO 19, SCK 18, CS 5.",
  UART: "Serial (UART) uses TX (transmit) and RX (receive). They cross over: TX of one device goes to RX of the other, and GND is shared.",
};
