# WordleCracker — Manual Feedback Wordle Solver

A clean, accurate Wordle solver that mirrors NYT Wordle rules using **manual feedback**.
Built with a clear separation between frontend UX and backend solver logic, designed to be correct first and extensible later.

---

## Why this exists

Most Wordle solvers break on edge cases (especially duplicate letters).
This project prioritizes **correctness by construction**:

> A candidate word is valid *iff* it produces **exactly the same feedback** as Wordle would for the given guess.

No heuristic shortcuts. No fragile rule stacking.

---

## Features

* ✅ Exact Wordle feedback simulation (greens → yellows → greys)
* ✅ Correct handling of duplicate letters
* ✅ Manual feedback input (avoids auto-coloring errors)
* ✅ Clean UI with live candidate filtering
* ✅ Frontend and backend fully decoupled
* ✅ Ready for serverless deployment (Vercel)

---

## Tech Stack

**Frontend**

* Vanilla HTML / CSS / JavaScript
* NYT-style grid and interaction flow

**Backend**

* FastAPI
* Deterministic Wordle feedback simulator
* Serverless-compatible API entry

---

## Project Structure

```
WordleCracker/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── backend/
│   ├── solver/
│   │   └── engine.py
│   ├── main.py        # Local development server
│   └── data/
│       ├── answers.txt
│       └── allowed.txt
├── api/
│   └── solve.py       # Vercel serverless entry
├── requirements.txt
└── vercel.json
```

---

## How it works

1. Enter a 5-letter guess.
2. Submit the guess.
3. Provide feedback manually (green / yellow / grey).
4. Submit feedback.
5. The solver filters candidates by **simulating Wordle feedback**.
6. Remaining valid answers and suggestions update instantly.

---

## API Contract

### `POST /api/solve`

**Request**

```json
{
  "history": [
    { "guess": "SLATE", "feedback": "ggbbb" }
  ]
}
```

**Response**

```json
{
  "remaining_count": 12,
  "answers": ["slick", "sling", "slush"],
  "allowed": ["slick", "sling", "slush", "..."]
}
```

---

## Local Development

### Backend

```bash
uvicorn backend.main:app --reload
```

### Frontend

Open `frontend/index.html` in a browser
(or serve it with any static server).

---

## Deployment

* **Frontend + Backend:** Vercel (serverless)
* Backend exposed via `/api/solve`
* No long-running server required

---

## Known Limitations (by design)

* Manual feedback input (auto-detection intentionally avoided)
* No entropy / ranking heuristics yet
* Free serverless cold starts on first request

These are deliberate v1 tradeoffs.

---

## Roadmap

* Virtual keyboard with live key coloring
* Smarter suggestion ranking
* Mobile UX polish
* Automated test suite for solver edge cases

---

## Author

Built as a correctness-first Wordle solver and portfolio project.

---

## License

MIT