from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.solver.engine import WordleSolver
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "backend" / "data"


def load_words(filename):
    with open(DATA_DIR / filename) as f:
        return [w.strip() for w in f.readlines()]


answers = load_words("answers.txt")
allowed = load_words("allowed.txt")

solver = WordleSolver(answers, allowed)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # fine for v1 / portfolio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/solve")
def solve(payload: dict):
    history = payload.get("history", [])

    answers_filtered, possible_solutions = solver.solve(history)

    return {
        # IMPORTANT FIX:
        # remaining_count should reflect actual possible answers
        "remaining_count": len(answers_filtered),
        "answers": answers_filtered[:20],          # Try This
        "allowed": possible_solutions[:50],        # Possible Solutions
    }