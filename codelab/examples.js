/* Code Lab - ready-made programs. `input` is sample input for the Input box (optional). */
export const EXAMPLES = {
  python: [
    { cat: "Start here", title: "Hello, world", code: `# Your first Python program
print("Hello, world!")
print("Welcome to the Robotics & AI Club")
` },
    { cat: "Start here", title: "Ask my name", code: `# input() waits for you to type, then press Enter
name = input("What is your name? ")
age = int(input("How old are you? "))
print(f"Hi {name}! In 5 years you will be {age + 5}.")
` },
    { cat: "Start here", title: "Calculator", code: `a = float(input("First number: "))
op = input("Operation (+ - * /): ")
b = float(input("Second number: "))

if op == "+":
    print("Answer:", a + b)
elif op == "-":
    print("Answer:", a - b)
elif op == "*":
    print("Answer:", a * b)
elif op == "/":
    print("Answer:", a / b if b != 0 else "can't divide by zero")
else:
    print("I don't know that operation")
` },
    { cat: "Loops", title: "Times table", code: `n = int(input("Which times table? "))
for i in range(1, 11):
    print(f"{n} x {i:2} = {n * i:3}")
` },
    { cat: "Loops", title: "Number guessing game", code: `import random

secret = random.randint(1, 50)
tries = 0
print("I'm thinking of a number from 1 to 50.")

while True:
    guess = int(input("Your guess: "))
    tries += 1
    if guess < secret:
        print("Higher!")
    elif guess > secret:
        print("Lower!")
    else:
        print(f"Correct! You got it in {tries} tries.")
        break
` },
    { cat: "Loops", title: "FizzBuzz", code: `for i in range(1, 31):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)
` },
    { cat: "Loops", title: "Star pyramid", code: `rows = int(input("How many rows? "))
for r in range(1, rows + 1):
    print(" " * (rows - r) + "*" * (2 * r - 1))
` },
    { cat: "Data", title: "Lists: class marks", code: `marks = [72, 85, 90, 64, 78, 95, 58]

print("Marks:", marks)
print("Highest:", max(marks))
print("Lowest:", min(marks))
print("Average:", round(sum(marks) / len(marks), 1))
print("Sorted:", sorted(marks, reverse=True))
passed = [m for m in marks if m >= 60]
print(len(passed), "students passed")
` },
    { cat: "Data", title: "Dictionary: word count", code: `text = input("Type a sentence: ").lower()
counts = {}
for word in text.split():
    word = word.strip(".,!?")
    counts[word] = counts.get(word, 0) + 1

for word, n in sorted(counts.items(), key=lambda kv: -kv[1]):
    print(f"{word:12} {'#' * n} {n}")
`, input: "the robot saw the red ball and the robot moved" },
    { cat: "Functions", title: "Functions: prime numbers", code: `def is_prime(n):
    if n < 2:
        return False
    for d in range(2, int(n ** 0.5) + 1):
        if n % d == 0:
            return False
    return True

limit = int(input("Primes up to: "))
primes = [n for n in range(limit + 1) if is_prime(n)]
print(primes)
print("There are", len(primes), "primes")
` },
    { cat: "Functions", title: "Recursion: Fibonacci", code: `def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

for i in range(15):
    print(fib(i), end=" ")
print()
` },
    { cat: "Functions", title: "Class: a robot", code: `class Robot:
    def __init__(self, name):
        self.name = name
        self.x, self.y = 0, 0
        self.battery = 100

    def move(self, dx, dy):
        cost = abs(dx) + abs(dy)
        if cost > self.battery:
            print(f"{self.name}: not enough battery!")
            return
        self.x += dx
        self.y += dy
        self.battery -= cost
        print(f"{self.name} is at ({self.x}, {self.y}), battery {self.battery}%")

r = Robot("Robo")
r.move(3, 4)
r.move(-10, 20)
r.move(50, 50)
` },
    { cat: "Robotics", title: "Line follower logic", code: `# Simulate a line-following robot's decisions
readings = [(0, 1, 0), (0, 1, 1), (0, 0, 1), (1, 1, 0), (1, 0, 0), (0, 0, 0)]

def decide(left, middle, right):
    if middle and not left and not right:
        return "forward"
    if right:
        return "turn right"
    if left:
        return "turn left"
    return "stop: line lost"

for s in readings:
    print(s, "->", decide(*s))
` },
    { cat: "Robotics", title: "Ultrasonic distance math", code: `# The HC-SR04 measures how long the echo takes (microseconds)
SPEED_OF_SOUND = 0.0343   # cm per microsecond

for echo_us in [580, 1160, 2900, 5800, 11600]:
    distance = echo_us * SPEED_OF_SOUND / 2
    print(f"echo {echo_us:5} us -> {distance:6.1f} cm")
` },
    { cat: "AI & data", title: "numpy: sensor statistics", code: `import numpy as np

np.random.seed(1)
temps = 25 + np.random.randn(24) * 2       # 24 hourly readings

print("Readings:", np.round(temps, 1))
print("Mean:", temps.mean().round(2))
print("Std dev:", temps.std().round(2))
print("Hottest hour:", temps.argmax())
` },
    { cat: "AI & data", title: "matplotlib: plot a graph", code: `import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
plt.plot(x, np.sin(x), label="sin(x)")
plt.plot(x, np.cos(x), label="cos(x)")
plt.title("Waves")
plt.xlabel("time")
plt.legend()
plt.grid(True)
plt.show()
` },
    { cat: "AI & data", title: "Linear regression from scratch", code: `import numpy as np
import matplotlib.pyplot as plt

# hours studied vs test score
hours = np.array([1, 2, 3, 4, 5, 6, 7, 8])
score = np.array([52, 55, 61, 64, 70, 74, 78, 85])

w, b, lr = 0.0, 0.0, 0.01
for step in range(5000):                 # gradient descent
    pred = w * hours + b
    err = pred - score
    w -= lr * (2 * err * hours).mean()
    b -= lr * (2 * err).mean()

print(f"score = {w:.2f} x hours + {b:.2f}")
print("Predicted score for 10 hours:", round(w * 10 + b, 1))

plt.scatter(hours, score, label="data")
plt.plot(hours, w * hours + b, "r", label="model")
plt.legend(); plt.show()
` },
    { cat: "AI & data", title: "Perceptron: learn AND", code: `import numpy as np

X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y = np.array([0, 0, 0, 1])                 # AND gate
w, b = np.zeros(2), 0.0

for epoch in range(10):
    for xi, target in zip(X, y):
        out = 1 if xi @ w + b > 0 else 0
        w += 0.1 * (target - out) * xi
        b += 0.1 * (target - out)

for xi in X:
    print(xi, "->", 1 if xi @ w + b > 0 else 0)
print("weights", w, "bias", b)
` },
    { cat: "AI & data", title: "k-nearest neighbours", code: `import math

# (sweetness, crunchiness) -> fruit
data = [((8, 5), "apple"), ((9, 6), "apple"), ((7, 7), "apple"),
        ((3, 1), "banana"), ((2, 2), "banana"), ((4, 1), "banana")]

def classify(point, k=3):
    near = sorted(data, key=lambda d: math.dist(point, d[0]))[:k]
    labels = [label for _, label in near]
    return max(set(labels), key=labels.count)

s = int(input("Sweetness 1-10: "))
c = int(input("Crunchiness 1-10: "))
print("I think it's a", classify((s, c)))
` },
  ],
  cpp: [
    { cat: "Start here", title: "Hello, world", code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, world!" << endl;
    cout << "Welcome to the Robotics & AI Club" << endl;
    return 0;
}
` },
    { cat: "Start here", title: "Read two numbers", code: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cout << "Enter two numbers: ";
    cin >> a >> b;
    cout << "\\nSum = " << a + b << endl;
    cout << "Product = " << a * b << endl;
    return 0;
}
`, input: "12 30" },
    { cat: "Start here", title: "Grade calculator", code: `#include <iostream>
using namespace std;

int main() {
    int marks;
    cin >> marks;
    char grade;
    if (marks >= 90) grade = 'A';
    else if (marks >= 75) grade = 'B';
    else if (marks >= 60) grade = 'C';
    else grade = 'F';
    cout << "Marks " << marks << " -> grade " << grade << endl;
    return 0;
}
`, input: "82" },
    { cat: "Loops", title: "Times table", code: `#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= 10; i++)
        cout << n << " x " << setw(2) << i << " = " << setw(3) << n * i << endl;
    return 0;
}
`, input: "7" },
    { cat: "Loops", title: "Sum of many numbers", code: `#include <iostream>
using namespace std;

int main() {
    int count;
    cin >> count;              // first line: how many numbers
    long long total = 0;
    for (int i = 0; i < count; i++) {
        int x;
        cin >> x;
        total += x;
    }
    cout << "Total: " << total << endl;
    cout << "Average: " << (double)total / count << endl;
    return 0;
}
`, input: "5\n10 20 30 40 50" },
    { cat: "Loops", title: "Star pyramid", code: `#include <iostream>
#include <string>
using namespace std;

int main() {
    int rows;
    cin >> rows;
    for (int r = 1; r <= rows; r++)
        cout << string(rows - r, ' ') << string(2 * r - 1, '*') << endl;
    return 0;
}
`, input: "6" },
    { cat: "Data", title: "Arrays: highest and lowest", code: `#include <iostream>
using namespace std;

int main() {
    int marks[] = {72, 85, 90, 64, 78, 95, 58};
    int n = sizeof(marks) / sizeof(marks[0]);
    int hi = marks[0], lo = marks[0], sum = 0;
    for (int i = 0; i < n; i++) {
        if (marks[i] > hi) hi = marks[i];
        if (marks[i] < lo) lo = marks[i];
        sum += marks[i];
    }
    cout << "Highest " << hi << ", lowest " << lo << ", average " << (double)sum / n << endl;
    return 0;
}
` },
    { cat: "Data", title: "Vectors and sorting", code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> v;
    int x;
    while (cin >> x) v.push_back(x);    // read until the input ends
    sort(v.begin(), v.end());
    cout << "Sorted:";
    for (int n : v) cout << " " << n;
    cout << "\\nMedian: " << v[v.size() / 2] << endl;
    return 0;
}
`, input: "42 7 19 3 88 25 61" },
    { cat: "Data", title: "Strings: reverse and palindrome", code: `#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    string word;
    cin >> word;
    string rev = word;
    reverse(rev.begin(), rev.end());
    cout << "Reversed: " << rev << endl;
    cout << (rev == word ? "It's a palindrome!" : "Not a palindrome") << endl;
    return 0;
}
`, input: "racecar" },
    { cat: "Functions", title: "Functions: prime numbers", code: `#include <iostream>
using namespace std;

bool isPrime(int n) {
    if (n < 2) return false;
    for (int d = 2; d * d <= n; d++)
        if (n % d == 0) return false;
    return true;
}

int main() {
    int limit;
    cin >> limit;
    for (int n = 2; n <= limit; n++)
        if (isPrime(n)) cout << n << " ";
    cout << endl;
    return 0;
}
`, input: "60" },
    { cat: "Functions", title: "Recursion: factorial", code: `#include <iostream>
using namespace std;

long long factorial(int n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}

int main() {
    for (int i = 1; i <= 15; i++)
        cout << i << "! = " << factorial(i) << endl;
    return 0;
}
` },
    { cat: "Functions", title: "Class: a robot", code: `#include <iostream>
#include <string>
#include <cstdlib>
using namespace std;

class Robot {
public:
    string name;
    int x = 0, y = 0, battery = 100;
    Robot(string n) : name(n) {}
    void move(int dx, int dy) {
        int cost = abs(dx) + abs(dy);
        if (cost > battery) { cout << name << ": not enough battery!" << endl; return; }
        x += dx; y += dy; battery -= cost;
        cout << name << " is at (" << x << ", " << y << "), battery " << battery << "%" << endl;
    }
};

int main() {
    Robot r("Robo");
    r.move(3, 4);
    r.move(-10, 20);
    r.move(50, 50);
    return 0;
}
` },
    { cat: "Robotics", title: "Struct: sensor readings", code: `#include <iostream>
#include <vector>
using namespace std;

struct Reading {
    int time;
    float distanceCm;
};

int main() {
    vector<Reading> log = {{0, 120.5}, {1, 80.2}, {2, 35.0}, {3, 12.4}, {4, 9.8}};
    for (Reading r : log) {
        cout << "t=" << r.time << "s  " << r.distanceCm << " cm";
        if (r.distanceCm < 15) cout << "  STOP!";
        cout << endl;
    }
    return 0;
}
` },
  ],
};

/* ---------------- Python turtle (Skulpt, offline) ---------------- */
EXAMPLES.turtle = [
  { cat: "Start here", title: "A square", code: `# Four sides, four right turns.
import turtle

t = turtle.Turtle()
t.shape("turtle")

for side in range(4):
    t.forward(120)
    t.right(90)

turtle.done()
` },
  { cat: "Start here", title: "Your name in colour", code: `import turtle

t = turtle.Turtle()
t.penup()
t.goto(-120, 0)
t.pendown()
t.color("#2E6BE6")
t.width(4)
t.write("Hello!", font=("Arial", 28, "bold"))

turtle.done()
` },
  { cat: "Start here", title: "Ask, then draw", code: `# input() waits for you to type, same as on the Python tab.
import turtle

sides = int(input("How many sides? "))
size = int(input("How long is each side? "))

t = turtle.Turtle()
t.shape("turtle")
t.speed(8)

angle = 360 / sides
for i in range(sides):
    t.forward(size)
    t.right(angle)

turtle.done()
`, input: "6\n100" },

  { cat: "Shapes and loops", title: "Any shape you like", code: `import turtle

def polygon(t, sides, size):
    for i in range(sides):
        t.forward(size)
        t.right(360 / sides)

t = turtle.Turtle()
t.speed(0)

for sides in range(3, 9):
    polygon(t, sides, 70)
    t.penup()
    t.forward(20)
    t.pendown()

turtle.done()
` },
  { cat: "Shapes and loops", title: "Spiral", code: `import turtle

t = turtle.Turtle()
t.speed(0)
t.width(2)

colours = ["#E63946", "#F08C00", "#16A34A", "#2E6BE6", "#7B3FC4"]

for step in range(90):
    t.color(colours[step % len(colours)])
    t.forward(step * 3)
    t.right(89)

turtle.done()
` },
  { cat: "Shapes and loops", title: "Star", code: `import turtle

t = turtle.Turtle()
t.color("#F59E0B")
t.width(3)
t.speed(6)

t.begin_fill()
for point in range(5):
    t.forward(180)
    t.right(144)
t.end_fill()

turtle.done()
` },

  { cat: "Pictures", title: "A house", code: `import turtle

t = turtle.Turtle()
t.speed(7)
t.width(3)

# walls
t.color("#8D6E63")
t.begin_fill()
for side in range(4):
    t.forward(140)
    t.left(90)
t.end_fill()

# roof
t.color("#E63946")
t.begin_fill()
t.forward(140)
t.left(120)
t.forward(140)
t.left(120)
t.forward(140)
t.end_fill()

t.hideturtle()
turtle.done()
` },
  { cat: "Pictures", title: "Rainbow fan", code: `import turtle

t = turtle.Turtle()
t.speed(0)
t.width(6)

colours = ["#E63946", "#F08C00", "#F5B83D", "#2E9E5B", "#20B8A6", "#1F6FD1", "#7B3FC4"]

for i, c in enumerate(colours):
    t.color(c)
    t.forward(150)
    t.backward(150)
    t.left(180 / len(colours))

t.hideturtle()
turtle.done()
` },
  { cat: "Pictures", title: "Random walk", code: `import turtle
import random

t = turtle.Turtle()
t.speed(0)
t.width(2)

for step in range(120):
    t.color(random.choice(["#2E6BE6", "#16A34A", "#E63946", "#F59E0B"]))
    t.forward(random.randint(10, 40))
    t.right(random.randint(-120, 120))

turtle.done()
` },
];

/* ---------------- p5.js ---------------- */
EXAMPLES.p5 = [
  { cat: "Start here", title: "Follow the mouse", code: `function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(20, 24, 40);
  noStroke();
  fill(46, 107, 230);
  circle(mouseX, mouseY, 60);
}
` },
  { cat: "Start here", title: "Draw with the mouse", code: `function setup() {
  createCanvas(400, 400);
  background(250);
}

function draw() {
  if (mouseIsPressed) {
    stroke(46, 107, 230);
    strokeWeight(6);
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

function keyPressed() {
  if (key === "c") background(250);   // press c to clear
}
` },
  { cat: "Start here", title: "Shapes and colour", code: `function setup() {
  createCanvas(400, 400);
  noLoop();            // draw once, not 60 times a second
}

function draw() {
  background(245, 247, 251);

  fill(230, 57, 70);   noStroke();
  circle(120, 120, 120);

  fill(46, 158, 91);
  rect(220, 60, 120, 120, 16);

  fill(245, 184, 61);
  triangle(200, 340, 120, 220, 280, 220);
}
` },

  { cat: "Movement", title: "Bouncing ball", code: `let x, y, dx = 4, dy = 3;

function setup() {
  createCanvas(400, 400);
  x = width / 2;
  y = height / 2;
}

function draw() {
  background(20, 24, 40);

  x = x + dx;
  y = y + dy;
  if (x < 20 || x > width - 20) dx = -dx;
  if (y < 20 || y > height - 20) dy = -dy;

  noStroke();
  fill(245, 184, 61);
  circle(x, y, 40);
}
` },
  { cat: "Movement", title: "A hundred stars", code: `let stars = [];

function setup() {
  createCanvas(400, 400);
  for (let i = 0; i < 100; i++) {
    stars.push({ x: random(width), y: random(height), s: random(1, 3) });
  }
}

function draw() {
  background(8, 12, 26);
  noStroke();
  fill(255);
  for (const st of stars) {
    circle(st.x, st.y, st.s);
    st.y = st.y + st.s * 0.4;
    if (st.y > height) { st.y = 0; st.x = random(width); }
  }
}
` },
  { cat: "Movement", title: "Clock", code: `function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
}

function draw() {
  background(245, 247, 251);
  translate(width / 2, height / 2);

  stroke(190); strokeWeight(2); noFill();
  circle(0, 0, 320);

  hand(second() * 6, 140, 2, color(230, 57, 70));
  hand(minute() * 6, 120, 5, color(19, 33, 60));
  hand(hour() % 12 * 30 + minute() * 0.5, 80, 7, color(19, 33, 60));
}

function hand(deg, len, w, c) {
  push();
  rotate(deg);
  stroke(c); strokeWeight(w);
  line(0, 0, 0, -len);
  pop();
}
` },

  { cat: "Interactive", title: "Catch the dot", code: `let dx, dy, score = 0;

function setup() {
  createCanvas(400, 400);
  place();
  textFont("system-ui");
}

function place() {
  dx = random(30, width - 30);
  dy = random(30, height - 30);
}

function draw() {
  background(20, 24, 40);
  noStroke();
  fill(46, 158, 91);
  circle(dx, dy, 44);
  fill(255);
  textSize(18);
  text("Score: " + score, 14, 28);
}

function mousePressed() {
  if (dist(mouseX, mouseY, dx, dy) < 22) {
    score = score + 1;
    console.log("caught one, score is now", score);
    place();
  }
}
` },
  { cat: "Interactive", title: "Sound bars (no microphone)", code: `// A pretend equaliser: good practice with arrays and map().
let bars = [];

function setup() {
  createCanvas(400, 300);
  for (let i = 0; i < 24; i++) bars.push(random(20, 260));
}

function draw() {
  background(12, 18, 32);
  noStroke();
  for (let i = 0; i < bars.length; i++) {
    bars[i] = bars[i] + random(-14, 14);
    bars[i] = constrain(bars[i], 20, 280);
    const c = map(bars[i], 20, 280, 140, 360);
    colorMode(HSB);
    fill(c % 360, 70, 95);
    rect(i * 16 + 6, height - bars[i], 11, bars[i], 4);
    colorMode(RGB);
  }
}
` },
];

/* ---------------- Processing (Java syntax, via Processing.js) ---------------- */
EXAMPLES.processing = [
  { cat: "Start here", title: "Follow the mouse", code: `void setup() {
  size(400, 400);
}

void draw() {
  background(20, 24, 40);
  noStroke();
  fill(0, 150, 216);
  ellipse(mouseX, mouseY, 60, 60);
}
` },
  { cat: "Start here", title: "Draw with the mouse", code: `void setup() {
  size(400, 400);
  background(250);
}

void draw() {
  if (mousePressed) {
    stroke(0, 150, 216);
    strokeWeight(6);
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

void keyPressed() {
  if (key == 'c') background(250);
}
` },
  { cat: "Start here", title: "Shapes and colour", code: `// In Processing every variable says what type it is: int, float, color.
void setup() {
  size(400, 400);
  noLoop();
}

void draw() {
  background(245, 247, 251);

  fill(230, 57, 70);
  noStroke();
  ellipse(120, 120, 120, 120);

  fill(46, 158, 91);
  rect(220, 60, 120, 120, 16);

  fill(245, 184, 61);
  triangle(200, 340, 120, 220, 280, 220);
}
` },

  { cat: "Movement", title: "Bouncing ball", code: `float x, y;
float dx = 4;
float dy = 3;

void setup() {
  size(400, 400);
  x = width / 2;
  y = height / 2;
}

void draw() {
  background(20, 24, 40);

  x = x + dx;
  y = y + dy;
  if (x < 20 || x > width - 20) dx = -dx;
  if (y < 20 || y > height - 20) dy = -dy;

  noStroke();
  fill(245, 184, 61);
  ellipse(x, y, 40, 40);
}
` },
  { cat: "Movement", title: "Falling stars with an array", code: `int COUNT = 100;
float[] xs = new float[COUNT];
float[] ys = new float[COUNT];
float[] ss = new float[COUNT];

void setup() {
  size(400, 400);
  for (int i = 0; i < COUNT; i++) {
    xs[i] = random(width);
    ys[i] = random(height);
    ss[i] = random(1, 3);
  }
}

void draw() {
  background(8, 12, 26);
  noStroke();
  fill(255);
  for (int i = 0; i < COUNT; i++) {
    ellipse(xs[i], ys[i], ss[i], ss[i]);
    ys[i] = ys[i] + ss[i] * 0.4;
    if (ys[i] > height) { ys[i] = 0; xs[i] = random(width); }
  }
}
` },
  { cat: "Movement", title: "Spinning squares", code: `float angle = 0;

void setup() {
  size(400, 400);
  rectMode(CENTER);
}

void draw() {
  background(245, 247, 251);
  translate(width / 2, height / 2);

  for (int i = 0; i < 8; i++) {
    pushMatrix();
    rotate(angle + i * PI / 8);
    noFill();
    stroke(0, 150, 216, 200 - i * 20);
    strokeWeight(3);
    rect(0, 0, 60 + i * 28, 60 + i * 28, 10);
    popMatrix();
  }
  angle = angle + 0.01;
}
` },

  { cat: "Interactive", title: "Catch the dot", code: `float dx, dy;
int score = 0;

void setup() {
  size(400, 400);
  place();
}

void place() {
  dx = random(30, width - 30);
  dy = random(30, height - 30);
}

void draw() {
  background(20, 24, 40);
  noStroke();
  fill(46, 158, 91);
  ellipse(dx, dy, 44, 44);
  fill(255);
  textSize(18);
  text("Score: " + score, 14, 28);
}

void mousePressed() {
  if (dist(mouseX, mouseY, dx, dy) < 22) {
    score = score + 1;
    println("caught one, score is now " + score);
    place();
  }
}
` },
  { cat: "Interactive", title: "A simple bar chart", code: `int[] values = { 12, 30, 22, 44, 18, 36, 27 };
String[] labels = { "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" };

void setup() {
  size(420, 320);
  noLoop();
}

void draw() {
  background(255);
  int w = 40;
  for (int i = 0; i < values.length; i++) {
    float h = map(values[i], 0, 50, 0, 220);
    fill(46, 107, 230);
    noStroke();
    rect(20 + i * (w + 14), height - 40 - h, w, h, 6);
    fill(70);
    textAlign(CENTER);
    text(labels[i], 20 + i * (w + 14) + w / 2, height - 20);
  }
}
` },
];

/* ---------------- Web: HTML, CSS and JavaScript ---------------- */
EXAMPLES.web = [
  {
    cat: "Start here", title: "Your first page",
    html: `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>My page</title>
</head>
<body>
  <h1>Hello!</h1>
  <p>This page is made of three files.</p>
  <button id="go">Click me</button>
  <p id="out"></p>
</body>
</html>
`,
    css: `body {
  font-family: system-ui, sans-serif;
  margin: 24px;
  color: #13213C;
}

h1 { color: #2E6BE6; }

button {
  background: #2E6BE6;
  color: #fff;
  border: 0;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 15px;
}
`,
    js: `let clicks = 0;

document.getElementById("go").addEventListener("click", () => {
  clicks = clicks + 1;
  document.getElementById("out").textContent = "You clicked " + clicks + " times.";
});
`,
  },
  {
    cat: "Start here", title: "A page about you",
    html: `<!doctype html>
<html>
<head><meta charset="utf-8"><title>About me</title></head>
<body>
  <header>
    <div class="avatar">RA</div>
    <h1>Your name here</h1>
    <p class="sub">Robotics &amp; AI Club</p>
  </header>

  <h2>Three things about me</h2>
  <ul>
    <li>I am learning to build circuits.</li>
    <li>My favourite sensor is the ultrasonic one.</li>
    <li>One day I want to build a robot that tidies my room.</li>
  </ul>
</body>
</html>
`,
    css: `body {
  font-family: system-ui, sans-serif;
  max-width: 520px;
  margin: 32px auto;
  color: #13213C;
  line-height: 1.6;
}

header {
  text-align: center;
  padding: 24px;
  border-radius: 18px;
  background: linear-gradient(135deg, #2E6BE6, #7B3FC4);
  color: #fff;
}

.avatar {
  width: 68px; height: 68px;
  margin: 0 auto 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, .22);
  display: grid; place-items: center;
  font-size: 24px; font-weight: 800;
}

header h1 { margin: 0; font-size: 26px; }
.sub { margin: 4px 0 0; opacity: .85; }

li { margin: 6px 0; }
`,
    js: `console.log("The page loaded. Try changing the colours in style.css.");
`,
  },

  {
    cat: "Make it do things", title: "Counter with buttons",
    html: `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Counter</title></head>
<body>
  <h1>Counter</h1>
  <p class="num" id="n">0</p>
  <button id="down">-1</button>
  <button id="reset">Reset</button>
  <button id="up">+1</button>
</body>
</html>
`,
    css: `body { font-family: system-ui, sans-serif; text-align: center; margin-top: 48px; color: #13213C; }
.num { font-size: 72px; font-weight: 800; margin: 12px 0 24px; color: #2E6BE6; }
button { font-size: 18px; padding: 12px 20px; margin: 0 4px; border: 1px solid #E3E8F0;
  background: #fff; border-radius: 12px; cursor: pointer; }
button:hover { border-color: #2E6BE6; color: #2E6BE6; }
`,
    js: `let n = 0;
const show = () => document.getElementById("n").textContent = n;

document.getElementById("up").onclick = () => { n = n + 1; show(); };
document.getElementById("down").onclick = () => { n = n - 1; show(); };
document.getElementById("reset").onclick = () => { n = 0; show(); };
`,
  },
  {
    cat: "Make it do things", title: "To-do list",
    html: `<!doctype html>
<html>
<head><meta charset="utf-8"><title>To do</title></head>
<body>
  <h1>Things to do</h1>
  <form id="f">
    <input id="what" placeholder="What needs doing?" autocomplete="off">
    <button>Add</button>
  </form>
  <ul id="list"></ul>
</body>
</html>
`,
    css: `body { font-family: system-ui, sans-serif; max-width: 460px; margin: 40px auto; color: #13213C; }
form { display: flex; gap: 8px; }
input { flex: 1; padding: 11px 13px; border: 1px solid #E3E8F0; border-radius: 10px; font-size: 15px; }
button { padding: 11px 18px; border: 0; border-radius: 10px; background: #2E6BE6; color: #fff; font-size: 15px; }
ul { list-style: none; padding: 0; margin-top: 18px; }
li { display: flex; align-items: center; gap: 10px; padding: 11px 13px; border: 1px solid #E3E8F0;
  border-radius: 10px; margin-bottom: 8px; }
li.done span { text-decoration: line-through; color: #94A3B8; }
li span { flex: 1; }
`,
    js: `const list = document.getElementById("list");

document.getElementById("f").addEventListener("submit", (e) => {
  e.preventDefault();
  const what = document.getElementById("what");
  if (!what.value.trim()) return;

  const li = document.createElement("li");
  li.innerHTML = "<input type='checkbox'><span></span>";
  li.querySelector("span").textContent = what.value;
  li.querySelector("input").onchange = (ev) => li.classList.toggle("done", ev.target.checked);
  list.appendChild(li);

  what.value = "";
  what.focus();
});
`,
  },
  {
    cat: "Make it do things", title: "Quiz",
    html: `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Quiz</title></head>
<body>
  <h1>Robotics quiz</h1>
  <div id="q"></div>
  <p id="score"></p>
</body>
</html>
`,
    css: `body { font-family: system-ui, sans-serif; max-width: 480px; margin: 40px auto; color: #13213C; }
.q { border: 1px solid #E3E8F0; border-radius: 14px; padding: 16px; margin-bottom: 12px; }
.q b { display: block; margin-bottom: 10px; }
.q button { display: block; width: 100%; text-align: left; padding: 10px 12px; margin: 5px 0;
  border: 1px solid #E3E8F0; background: #fff; border-radius: 9px; font-size: 15px; cursor: pointer; }
.q button:hover { border-color: #2E6BE6; }
.q button.right { background: #DCFCE7; border-color: #16A34A; }
.q button.wrong { background: #FEE2E2; border-color: #DC2626; }
#score { font-weight: 700; font-size: 18px; }
`,
    js: `const questions = [
  { q: "What does an ultrasonic sensor measure?", a: ["Distance", "Temperature", "Light"], right: 0 },
  { q: "Which pin number is the built-in LED on an Uno?", a: ["9", "13", "A0"], right: 1 },
  { q: "What does a resistor do?", a: ["Stores charge", "Limits current", "Makes light"], right: 1 },
];

let score = 0;
const box = document.getElementById("q");

questions.forEach((item, i) => {
  const d = document.createElement("div");
  d.className = "q";
  d.innerHTML = "<b>" + (i + 1) + ". " + item.q + "</b>";
  item.a.forEach((text, j) => {
    const b = document.createElement("button");
    b.textContent = text;
    b.onclick = () => {
      if (d.dataset.done) return;
      d.dataset.done = "1";
      b.className = j === item.right ? "right" : "wrong";
      if (j === item.right) score = score + 1;
      document.getElementById("score").textContent = "Score: " + score + " / " + questions.length;
    };
    d.appendChild(b);
  });
  box.appendChild(d);
});
`,
  },

  {
    cat: "Layout", title: "Cards that reflow",
    html: `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Our kit</title></head>
<body>
  <h1>Our kit</h1>
  <div class="grid">
    <article><h2>Arduino Uno</h2><p>The board that runs your code.</p></article>
    <article><h2>Breadboard</h2><p>Where you build without soldering.</p></article>
    <article><h2>Servo</h2><p>A motor that holds an angle.</p></article>
    <article><h2>Ultrasonic</h2><p>Measures distance with sound.</p></article>
  </div>
</body>
</html>
`,
    css: `body { font-family: system-ui, sans-serif; margin: 28px; color: #13213C; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
}

article {
  border: 1px solid #E3E8F0;
  border-radius: 14px;
  padding: 16px;
  transition: transform .15s, box-shadow .15s;
}

article:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(15, 29, 54, .1);
}

h2 { margin: 0 0 6px; font-size: 17px; color: #2E6BE6; }
p { margin: 0; color: #475569; }
`,
    js: `// Make the window narrower and watch the cards rearrange themselves.
console.log("Cards on screen:", document.querySelectorAll("article").length);
`,
  },
];
