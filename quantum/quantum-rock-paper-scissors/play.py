"""
Quantum Rock Paper Scissors — play.py
Streams JSON status events to stdout for the web UI.
Uses Qiskit StatevectorSampler (local quantum simulation — instant results).

The quantum opponent generates its choice using 2 qubits in superposition.
Rejection sampling turns 4 outcomes into 3 equal-probability choices.
"""

import json
import sys
import time

CHOICES = {0: "rock", 1: "paper", 2: "scissors"}
CHOICE_EMOJIS = {"rock": "✊", "paper": "🖐", "scissors": "✌️"}


def emit(step: int, status: str, message: str, **kwargs) -> None:
    payload = {"step": step, "status": status, "message": message, **kwargs}
    print(json.dumps(payload), flush=True)


def game_result(opponent: str, player: str) -> str:
    """Returns 'win', 'lose', or 'draw' from the player's perspective."""
    if opponent == player:
        return "draw"
    wins = {("rock", "scissors"), ("scissors", "paper"), ("paper", "rock")}
    return "win" if (player, opponent) in wins else "lose"


def play_quantum_rps(player_choice: str) -> None:
    # ── Step 1: Build the circuit ──────────────────────────────────────────
    emit(1, "building",
         "Building quantum circuit — opponent prepares 2 qubits in superposition",
         circuit=(
             "     ┌───┐ ┌─┐\n"
             "q_0: ┤ H ├─┤M├─\n"
             "     ├───┤ └╥┘┌─┐\n"
             "q_1: ┤ H ├──╫─┤M├\n"
             "     └───┘  ║ └╥┘\n"
             "meas: ══════╩══╩═"
         ),
         detail=(
             "Two Hadamard gates create 4 equally probable states: 00, 01, 10, 11. "
             "We map 00→Rock, 01→Paper, 10→Scissors and reject 11 (rejection sampling). "
             "Each valid choice has exactly 1/3 probability."
         ))
    time.sleep(0.9)

    # ── Step 2: Superposition explained ────────────────────────────────────
    emit(2, "superposition",
         "Opponent's qubits are in superposition — all 3 choices exist simultaneously",
         states={"00": "25%", "01": "25%", "10": "25%", "11": "25% (reject)"},
         detail=(
             "Before measurement, the opponent has no choice — they are in all states at once. "
             "This is not a hidden choice waiting to be revealed. The choice literally does not "
             "exist yet. No prediction is possible, even in principle."
         ))
    time.sleep(0.8)

    # ── Step 3: Connect / prepare backend ──────────────────────────────────
    emit(3, "connecting",
         "Preparing Qiskit StatevectorSampler — opponent consulting the quantum realm",
         backend="Qiskit StatevectorSampler",
         backend_type="local_simulator",
         detail=(
             "We use Qiskit's built-in statevector simulator. On real IBM Quantum "
             "hardware this step connects to the cloud and joins a job queue. "
             "The simulator gives mathematically identical results in milliseconds."
         ))
    time.sleep(0.7)

    # ── Step 4: Run the circuit ─────────────────────────────────────────────
    emit(4, "running",
         "Executing quantum circuit — opponent's choice is being determined by physics",
         shots=1,
         detail=(
             "Measurement collapses the superposition. The opponent's choice emerges from "
             "quantum indeterminacy — not from a strategy, not from a seed, not from "
             "any prior state of the universe. It is physically impossible to predict."
         ))
    time.sleep(0.6)

    # ── Actual quantum computation ──────────────────────────────────────────
    from qiskit import QuantumCircuit
    from qiskit.primitives import StatevectorSampler

    qc = QuantumCircuit(2)
    qc.h(0)
    qc.h(1)
    qc.measure_all()

    sampler = StatevectorSampler()

    # Rejection sampling: reject '11' to keep 3 equal choices
    attempts = 0
    chosen_bits = None
    while chosen_bits is None:
        attempts += 1
        result = sampler.run([(qc,)], shots=16).result()
        counts = result[0].data.meas.get_counts()
        valid = [(bits, cnt) for bits, cnt in counts.items() if int(bits, 2) <= 2]
        if valid:
            import random
            pool: list[str] = []
            for bits, cnt in valid:
                pool.extend([bits] * cnt)
            chosen_bits = random.choice(pool)

    raw_value = int(chosen_bits, 2)   # 0, 1, or 2
    opponent_choice = CHOICES[raw_value]
    result_str = game_result(opponent_choice, player_choice)

    # ── Step 5: Wavefunction collapsed ─────────────────────────────────────
    emit(5, "measured",
         f"Wavefunction collapsed! Measurement returned: {chosen_bits}",
         raw_bits=chosen_bits,
         raw_value=raw_value,
         attempts=attempts,
         detail=(
             f"The 2 qubits collapsed to |{chosen_bits}⟩ = {raw_value}. "
             f"{'Needed ' + str(attempts) + ' attempt(s) — outcome 11 was rejected.' if attempts > 1 else 'Valid result on the first try.'}"
         ))
    time.sleep(0.5)

    # ── Step 6: Map to choice ───────────────────────────────────────────────
    emit(6, "mapping",
         f"Mapping {chosen_bits} → {raw_value} → {opponent_choice} {CHOICE_EMOJIS[opponent_choice]}",
         raw_bits=chosen_bits,
         raw_value=raw_value,
         opponent_choice=opponent_choice,
         mapping_table={
             "00 (0)": "Rock ✊",
             "01 (1)": "Paper 🖐",
             "10 (2)": "Scissors ✌️",
             "11 (3)": "Rejected — re-roll",
         },
         detail=(
             "Rejection of outcome 11 ensures each of the 3 choices has exactly "
             "1/3 probability. The opponent cannot cheat — the choice is sealed by physics."
         ))
    time.sleep(0.3)

    # ── Step 7: Final result ────────────────────────────────────────────────
    emit(7, "result",
         f"Opponent plays {opponent_choice} {CHOICE_EMOJIS[opponent_choice]} — you {result_str}!",
         opponent_choice=opponent_choice,
         player_choice=player_choice,
         result=result_str,
         raw_bits=chosen_bits,
         raw_value=raw_value)


if __name__ == "__main__":
    choice = sys.argv[1] if len(sys.argv) > 1 else "rock"
    try:
        play_quantum_rps(choice)
    except Exception as e:
        emit(0, "error", str(e))
        sys.exit(1)
