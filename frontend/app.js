console.log("app.js loaded");

// ====================
// CONSTANTS & STATE
// ====================
const rows = 6;
const cols = 5;

let currentRow = 0;
let currentCol = 0;
let feedbackCol = 0;
let mode = "guess"; // "guess" | "feedback"

// ====================
// DOM REFERENCES
// ====================
const instruction = document.getElementById("instruction");

const countEl = document.getElementById("count");
const answersEl = document.getElementById("answers");
const allowedEl = document.getElementById("allowed");

const grid = document.getElementById("grid");

// Safety checks (important)
if (!instruction || !countEl || !answersEl || !allowedEl || !grid) {
  console.error("One or more required DOM elements are missing.");
}

// ====================
// STATE MATRICES
// ====================
const guesses = Array.from({ length: rows }, () =>
  Array(cols).fill("")
);

const feedback = Array.from({ length: rows }, () =>
  Array(cols).fill("")
);

// ====================
// GRID CREATION
// ====================
const gridRows = [];

for (let r = 0; r < rows; r++) {
  const row = document.createElement("div");
  row.className = "row";

  for (let c = 0; c < cols; c++) {
    const cell = document.createElement("div");
    cell.className = "cell grey";
    row.appendChild(cell);
  }

  grid.appendChild(row);
  gridRows.push(row);
}

console.log("Grid rows created:", gridRows.length); // must be 6

// ====================
// FEEDBACK BUTTONS
// ====================
const feedbackButtons = {
  g: document.querySelector(".fb.green"),
  y: document.querySelector(".fb.yellow"),
  b: document.querySelector(".fb.grey"),
};

Object.entries(feedbackButtons).forEach(([code, btn]) => {
  if (!btn) {
    console.error(`Feedback button missing for code: ${code}`);
    return;
  }

  btn.addEventListener("click", () => {
    if (mode === "feedback") {
      handleFeedbackInput(code);
    }
  });
});

// ====================
// KEYBOARD INPUT
// ====================
document.addEventListener("keydown", (e) => {
  const key = e.key.toUpperCase();

  if (mode === "guess") {
    if (key === "BACKSPACE") handleGuessBackspace();
    else if (key === "ENTER") handleGuessEnter();
    else if (/^[A-Z]$/.test(key)) handleGuessLetter(key);
  } else if (mode === "feedback") {
    if (key === "BACKSPACE") handleFeedbackBackspace();
    else if (key === "ENTER") handleFeedbackEnter();
  }
});

// ====================
// GUESS MODE HANDLERS
// ====================
function handleGuessLetter(letter) {
  if (currentCol >= cols) return;

  guesses[currentRow][currentCol] = letter;
  gridRows[currentRow].children[currentCol].innerText = letter;
  currentCol++;
}

function handleGuessBackspace() {
  if (currentCol === 0) return;

  currentCol--;
  guesses[currentRow][currentCol] = "";
  gridRows[currentRow].children[currentCol].innerText = "";
}

function handleGuessEnter() {
  if (currentCol < cols) return;

  mode = "feedback";
  feedbackCol = 0;
  instruction.innerText = "Give feedback";
}

// ====================
// FEEDBACK MODE HANDLERS
// ====================
function handleFeedbackInput(code) {
  if (feedbackCol >= cols) return;

  feedback[currentRow][feedbackCol] = code;

  const cell = gridRows[currentRow].children[feedbackCol];
  cell.classList.remove("grey", "yellow", "green");

  if (code === "b") cell.classList.add("grey");
  if (code === "y") cell.classList.add("yellow");
  if (code === "g") cell.classList.add("green");

  feedbackCol++;
}

function handleFeedbackBackspace() {
  if (feedbackCol === 0) return;

  feedbackCol--;
  feedback[currentRow][feedbackCol] = "";

  const cell = gridRows[currentRow].children[feedbackCol];
  cell.classList.remove("yellow", "green");
  cell.classList.add("grey");
}

function handleFeedbackEnter() {
  console.log("ENTER pressed in feedback mode");

  if (feedbackCol < cols) return;

  const history = buildHistory();
  console.log("Sending history:", history);

  console.log("Calling backend /solve");

  fetch("/api/solve", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ history })
  })
    .then(res => {
      if (!res.ok) throw new Error("Backend error");
      return res.json();
    })
    .then(data => {
    console.log("Solver response:", data);   // 👈 ADD THIS HERE
    updateRightPanel(data);
  })
    .catch(err => console.error("Solver fetch failed:", err));

  // Reset for next row
  currentRow++;
  currentCol = 0;
  feedbackCol = 0;
  mode = "guess";
  instruction.innerText = "Take your guess";
}

// ====================
// HELPERS
// ====================
function buildHistory() {
  const history = [];

  for (let r = 0; r <= currentRow; r++) {
    const guess = guesses[r].join("");
    const fb = feedback[r].join("");

    if (guess.length === cols && fb.length === cols) {
      history.push({ guess, feedback: fb });
    }
  }

  return history;
}

function updateRightPanel(data) {
  console.log("Solver response:", data);

  countEl.innerText = `Remaining: ${data.remaining_count}`;

  answersEl.innerHTML = data.answers.join(", ");
  allowedEl.innerHTML = data.allowed.join(", ");
}