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
