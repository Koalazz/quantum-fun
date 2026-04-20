"""
Quantum Magic 8-Ball — ask.py
Streams JSON status events to stdout for the web UI.
Uses Qiskit StatevectorSampler (local quantum simulation — instant results).
"""

import json
import sys
import time

ANSWERS = [
    "It is certain",
    "Without a doubt",
    "Yes, definitely",
    "Most likely",
    "Reply hazy, try again",
    "Ask again later",
    "Don't count on it",
    "Very doubtful",
]

ANSWER_TONE = [
    "positive", "positive", "positive", "positive",
    "neutral", "neutral", "negative", "negative",
]


def emit(step: int, status: str, message: str, **kwargs) -> None:
    payload = {"step": step, "status": status, "message": message, **kwargs}
    print(json.dumps(payload), flush=True)


def ask_quantum_8ball() -> None:
    # ── Step 1: Build the circuit ──────────────────────────────────────────
    emit(1, "building", "Building quantum circuit — placing Hadamard gates on 3 qubits",
         circuit=(
             "     ┌───┐ ┌─┐\n"
             "q_0: ┤ H ├─┤M├──\n"
             "     ├───┤ └╥┘┌─┐\n"
             "q_1: ┤ H ├──╫─┤M├\n"
             "     ├───┤  ║ └╥┘┌─┐\n"
             "q_2: ┤ H ├──╫──╫─┤M├\n"
             "     └───┘  ║  ║ └╥┘\n"
             "meas: ══════╩══╩══╩═"
         ),
         detail=(
             "Three Hadamard gates create 2³ = 8 equally probable outcomes (000–111). "
             "Each outcome maps to one of the 8 Magic 8-Ball answers. "
             "The universe itself chooses your answer."
         ))
    time.sleep(0.9)

    # ── Step 2: Superposition explained ────────────────────────────────────
    emit(2, "superposition",
         "All 8 answers exist simultaneously in quantum superposition",
         states={
             "000": "12.5%", "001": "12.5%", "010": "12.5%", "011": "12.5%",
             "100": "12.5%", "101": "12.5%", "110": "12.5%", "111": "12.5%",
         },
         detail=(
             "The 3 qubits hold all 8 possible answers at once — "
             "not as probabilities in a classical sense, but as genuine quantum superposition. "
             "No classical computer can replicate this state with a single register."
         ))
    time.sleep(0.8)

    # ── Step 3: Connect / prepare backend ──────────────────────────────────
    emit(3, "connecting",
         "Preparing Qiskit StatevectorSampler — consulting the quantum oracle",
         backend="Qiskit StatevectorSampler",
         backend_type="local_simulator",
         detail=(
             "We use Qiskit's built-in statevector simulator. On real IBM Quantum "
             "hardware this step connects to the cloud and joins a job queue "
             "(typically 1–10 minutes). The simulator gives mathematically "
             "identical results in milliseconds."
         ))
    time.sleep(0.7)

    # ── Step 4: Run the circuit ─────────────────────────────────────────────
    emit(4, "running",
         "Executing quantum circuit — the oracle is consulting the universe",
         shots=1,
         detail=(
             "We run the circuit once. The Hadamard gates create a uniform superposition "
             "over all 8 answers, then measurement collapses to exactly one. "
             "No algorithm, no bias — certified by the Born rule."
         ))
    time.sleep(0.6)

    # ── Actual quantum computation ──────────────────────────────────────────
    from qiskit import QuantumCircuit
    from qiskit.primitives import StatevectorSampler

    qc = QuantumCircuit(3)
    qc.h(0)
    qc.h(1)
    qc.h(2)
    qc.measure_all()

    sampler = StatevectorSampler()
    result = sampler.run([(qc,)], shots=1).result()
    counts = result[0].data.meas.get_counts()

    raw_bits = list(counts.keys())[0]   # e.g. '011'
    raw_value = int(raw_bits, 2)         # 0–7
    answer = ANSWERS[raw_value]
    tone = ANSWER_TONE[raw_value]

    # ── Step 5: Wavefunction collapsed ─────────────────────────────────────
    emit(5, "measured",
         f"Wavefunction collapsed! 3-qubit measurement returned: {raw_bits}",
         raw_bits=raw_bits,
         raw_value=raw_value,
         detail=(
             f"The 3 qubits collapsed from superposition to |{raw_bits}⟩. "
             f"In binary, {raw_bits} = {raw_value}. "
             f"This maps directly to answer #{raw_value + 1} of 8."
         ))
    time.sleep(0.5)

    # ── Step 6: Map to answer ───────────────────────────────────────────────
    emit(6, "mapping",
         f"Mapping binary {raw_bits} → answer #{raw_value + 1}: \"{answer}\"",
         raw_bits=raw_bits,
         raw_value=raw_value,
         answer=answer,
         tone=tone,
         mapping_table={
             "000 (0)": ANSWERS[0],
             "001 (1)": ANSWERS[1],
             "010 (2)": ANSWERS[2],
             "011 (3)": ANSWERS[3],
             "100 (4)": ANSWERS[4],
             "101 (5)": ANSWERS[5],
             "110 (6)": ANSWERS[6],
             "111 (7)": ANSWERS[7],
         },
         detail=(
             "Each of the 8 binary outcomes maps directly to one Magic 8-Ball answer. "
             "No rejection sampling needed — 8 outcomes fit 8 answers perfectly."
         ))
    time.sleep(0.3)

    # ── Step 7: Final result ────────────────────────────────────────────────
    emit(7, "result",
         f"The quantum oracle speaks: \"{answer}\"",
         answer=answer,
         tone=tone,
         raw_bits=raw_bits,
         raw_value=raw_value)


if __name__ == "__main__":
    try:
        ask_quantum_8ball()
    except Exception as e:
        emit(0, "error", str(e))
        sys.exit(1)
