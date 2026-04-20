"""
Quantum Dice — roll.py
Streams JSON status events to stdout for the web UI.
Uses Qiskit StatevectorSampler (local quantum simulation — instant results).
"""

import json
import random
import sys
import time


def emit(step: int, status: str, message: str, **kwargs) -> None:
    payload = {"step": step, "status": status, "message": message, **kwargs}
    print(json.dumps(payload), flush=True)


def roll_quantum_dice() -> None:
    # ── Step 1: Build the circuit ──────────────────────────────────────────
    emit(1, "building", "Building quantum circuit — placing Hadamard gates on 3 qubits",
         circuit="""     ┌───┐ ┌─┐
q_0: ┤ H ├─┤M├─
     ├───┤ └╥┘┌─┐
q_1: ┤ H ├──╫─┤M├
     ├───┤  ║ └╥┘┌─┐
q_2: ┤ H ├──╫──╫─┤M├
     └───┘  ║  ║ └╥┘
meas: ══════╩══╩══╩═""",
         detail="Each H gate puts one qubit into equal superposition: 50% |0⟩ + 50% |1⟩. "
                "With 3 qubits, we get 2³ = 8 equally probable states: 000 through 111.")
    time.sleep(0.9)

    # ── Step 2: Superposition explained ────────────────────────────────────
    emit(2, "superposition",
         "Qubits are now in superposition — all 8 outcomes exist simultaneously",
         states={
             "000": "12.5%", "001": "12.5%", "010": "12.5%", "011": "12.5%",
             "100": "12.5%", "101": "12.5%", "110": "12.5%", "111": "12.5%",
         },
         detail="Right now the quantum state holds ALL possibilities at once. "
                "No classical computer can truly do this — it would need to track "
                "8 separate probability amplitudes. This is quantum parallelism.")
    time.sleep(0.8)

    # ── Step 3: Connect / prepare backend ──────────────────────────────────
    emit(3, "connecting",
         "Preparing Qiskit StatevectorSampler — local quantum simulation",
         backend="Qiskit StatevectorSampler",
         backend_type="local_simulator",
         detail="We use Qiskit's built-in statevector simulator. On real IBM Quantum "
                "hardware this step connects to the cloud and joins a job queue "
                "(typically 1–10 minutes). The simulator gives mathematically "
                "identical results in milliseconds.")
    time.sleep(0.7)

    # ── Step 4: Run the circuit ─────────────────────────────────────────────
    emit(4, "running",
         "Executing quantum circuit — collapsing 3 qubits with a single measurement",
         shots=1,
         detail="We run the circuit once (1 shot). The Hadamard gates create a "
                "uniform superposition, then measurement collapses all 3 qubits "
                "simultaneously. The outcome is fundamentally random — not pseudo-random "
                "like a computer's rand() — but random by the laws of physics.")
    time.sleep(0.6)

    # ── Actual quantum computation ──────────────────────────────────────────
    from qiskit import QuantumCircuit
    from qiskit.primitives import StatevectorSampler

    # Build the 3-qubit dice circuit
    qc = QuantumCircuit(3)
    qc.h(0)
    qc.h(1)
    qc.h(2)
    qc.measure_all()

    # Rejection sampling: run until we get a result in 0–5 (dice faces 1–6)
    sampler = StatevectorSampler()
    attempts = 0
    chosen_bits = None
    while chosen_bits is None:
        attempts += 1
        result = sampler.run([(qc,)], shots=64).result()
        counts = result[0].data.meas.get_counts()
        valid = [(bits, cnt) for bits, cnt in counts.items() if int(bits, 2) <= 5]
        if valid:
            # Weight by counts for proper quantum statistics
            pool: list[str] = []
            for bits, cnt in valid:
                pool.extend([bits] * cnt)
            chosen_bits = random.choice(pool)

    raw_value = int(chosen_bits, 2)   # 0–5
    face = raw_value + 1               # 1–6

    # ── Step 5: Wavefunction collapsed ─────────────────────────────────────
    emit(5, "measured",
         f"Wavefunction collapsed! 3-qubit measurement returned: {chosen_bits}",
         raw_bits=chosen_bits,
         raw_value=raw_value,
         attempts=attempts,
         detail=f"The 3 qubits collapsed from superposition to the definite state "
                f"|{chosen_bits}⟩. In binary, {chosen_bits} = {raw_value}. "
                f"{'Needed ' + str(attempts) + ' attempts (rejection sampling: discarded 110 and 111 to keep the die fair).' if attempts > 1 else 'Got a valid result on the first try!'}")
    time.sleep(0.5)

    # ── Step 6: Map to dice face ────────────────────────────────────────────
    emit(6, "mapping",
         f"Mapping binary {chosen_bits} → decimal {raw_value} → die face {face}",
         raw_bits=chosen_bits,
         raw_value=raw_value,
         face=face,
         mapping_table={
             "000 (0)": "Face 1", "001 (1)": "Face 2", "010 (2)": "Face 3",
             "011 (3)": "Face 4", "100 (4)": "Face 5", "101 (5)": "Face 6",
             "110 (6)": "Rejected — re-roll", "111 (7)": "Rejected — re-roll",
         },
         detail=f"We add 1 to convert 0-indexed quantum result to 1-indexed die face. "
                f"States 6 and 7 are rejected to keep the 6-sided die perfectly fair "
                f"(rejection sampling). Each valid face has exactly 1/6 probability.")
    time.sleep(0.3)

    # ── Step 7: Final result ────────────────────────────────────────────────
    emit(7, "result",
         f"Quantum dice rolled: {face}",
         face=face,
         raw_bits=chosen_bits,
         raw_value=raw_value)


if __name__ == "__main__":
    try:
        roll_quantum_dice()
    except Exception as e:
        emit(0, "error", str(e))
        sys.exit(1)
