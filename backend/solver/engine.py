from collections import Counter
from typing import List, Dict


class WordleSolver:
    def __init__(self, answers: List[str], allowed: List[str]):
        self.answers = answers
        self.allowed = allowed

    # ---------------------------------
    # Exact Wordle feedback simulation
    # ---------------------------------
    def simulate_feedback(self, answer: str, guess: str) -> str:
        feedback = ["b"] * 5
        answer_chars = list(answer)

        # Pass 1: Greens
        for i in range(5):
            if guess[i] == answer[i]:
                feedback[i] = "g"
                answer_chars[i] = None

        # Pass 2: Yellows
        remaining = Counter(c for c in answer_chars if c is not None)

        for i in range(5):
            if feedback[i] == "b" and guess[i] in remaining and remaining[guess[i]] > 0:
                feedback[i] = "y"
                remaining[guess[i]] -= 1

        return "".join(feedback)

    # ---------------------------------
    # Filter words by feedback history
    # ---------------------------------
    def filter_candidates(
        self,
        candidates: List[str],
        history: List[Dict[str, str]],
    ) -> List[str]:
        valid = []

        for word in candidates:
            ok = True
            for step in history:
                if self.simulate_feedback(word, step["guess"]) != step["feedback"]:
                    ok = False
                    break
            if ok:
                valid.append(word)

        return valid

    # ---------------------------------
    # Public API (Option A)
    # ---------------------------------
    def solve(self, history: List[Dict[str, str]]):
        # Normalize frontend input (uppercase → lowercase)
        normalized_history = [
            {
                "guess": step["guess"].lower(),
                "feedback": step["feedback"].lower(),
            }
            for step in history
        ]

        filtered_answers = self.filter_candidates(self.answers, normalized_history)
        filtered_allowed = self.filter_candidates(self.allowed, normalized_history)

        return filtered_answers, filtered_allowed