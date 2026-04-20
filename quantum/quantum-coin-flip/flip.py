"""
Quantum Coin Flip — flip.py
Streams JSON status events to stdout for the web UI.
Uses Qiskit StatevectorSampler (local quantum simulation — instant results).
"""

import json
import sys
import time


def emit(step: int, status: str, message: str, **kwargs) -> None:
    payload = {"step": step, "status": status, "message": message, **kwargs}
    print(json.dumps(payload), flush=True)


def flip_quantum_coin() -> None:
    # ── Step 1: Build the circuit ──────────────────────────────────────────
    emit(1, "building", "Building quantum circuit — placing one Hadamard gate on 1 qubit",
         circuit=(
             "     ┌───┐ ┌─┐\n"
             "q_0: ┤ H ├─┤M├\n"
             "     └───┘ └╥┘\n"
             "meas: ══════╩═"
         ),
         detail=(
             "The Hadamard (H) gate transforms |0⟩ into an equal superposition: "
             "(|0⟩ + |1⟩)/√2. The qubit is now simultaneously heads AND tails — "
             "not one or the other, but genuinely both at once."
         ))
    time.sleep(0.9)

    # ── Step 2: Superposition explained ────────────────────────────────────
    emit(2, "superposition",
         "Qubit is now in perfect 50/50 superposition — heads AND tails simultaneously",
         states={"0 (Tails)": "50%", "1 (Heads)": "50%"},
         detail=(
             "Unlike a spinning coin (which is classically in one state, just unknown), "
             "this qubit genuinely occupies both |0⟩ and |1⟩ with equal amplitude. "
             "The state |ψ⟩ = (|0⟩ + |1⟩)/√2 has no classical equivalent."
         ))
    time.sleep(0.8)

    # ── Step 3: Connect / prepare backend ──────────────────────────────────
    emit(3, "connecting",
         "Preparing Qiskit StatevectorSampler — local quantum simulation",
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
         "Executing quantum circuit — collapsing the qubit with a single measurement",
         shots=1,
         detail=(
             "We run the circuit once (1 shot). The Hadamard gate creates a perfect "
             "superposition, then measurement collapses the qubit to 0 or 1. "
             "The outcome is fundamentally random — guaranteed by the Born rule of "
             "quantum mechanics, not a pseudo-random algorithm."
         ))
    time.sleep(0.6)

    # ── Actual quantum computation ──────────────────────────────────────────
    from qiskit import QuantumCircuit
    from qiskit.primitives import StatevectorSampler

    qc = QuantumCircuit(1)
    qc.h(0)
    qc.measure_all()

    sampler = StatevectorSampler()
    result = sampler.run([(qc,)], shots=1).result()
    counts = result[0].data.meas.get_counts()

    raw_bit = list(counts.keys())[0]   # '0' or '1'
    raw_value = int(raw_bit, 2)         # 0 or 1
    side = "Heads" if raw_value == 1 else "Tails"

    # ── Step 5: Wavefunction collapsed ─────────────────────────────────────
    emit(5, "measured",
         f"Wavefunction collapsed! Qubit measurement returned: {raw_bit}",
         raw_bits=raw_bit,
         raw_value=raw_value,
         detail=(
             f"The qubit collapsed from superposition to the definite state |{raw_bit}⟩. "
             f"In quantum mechanics, this collapse is irreversible and instantaneous. "
             f"Before measurement, neither outcome existed — now only {side} is real."
         ))
    time.sleep(0.5)

    # ── Step 6: Final result ────────────────────────────────────────────────
    emit(6, "result",
         f"Quantum coin landed: {side}",
         side=side.lower(),
         raw_bits=raw_bit,
         raw_value=raw_value)


if __name__ == "__main__":
    try:
        flip_quantum_coin()
    except Exception as e:
        emit(0, "error", str(e))
        sys.exit(1)
