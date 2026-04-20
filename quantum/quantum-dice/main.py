"""
Quantum Dice on real IBM Quantum hardware
Project: Quantum Fun #03 · https://localhost:3002/projects/quantum-dice

Run:
    IBM_QUANTUM_API_KEY=<key> python main.py
"""
import os
import random
import sys
from qiskit import QuantumCircuit
from qiskit.transpiler import generate_preset_pass_manager
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler


def build_dice_circuit() -> QuantumCircuit:
    qc = QuantumCircuit(3)
    qc.h(0)
    qc.h(1)
    qc.h(2)
    qc.measure_all()
    return qc


def roll_on_hardware(max_attempts: int = 5) -> int:
    api_key = os.environ.get("IBM_QUANTUM_API_KEY")
    if not api_key:
        print("Error: IBM_QUANTUM_API_KEY not set.")
        sys.exit(1)

    service = QiskitRuntimeService(channel="ibm_quantum", token=api_key)
    backend = service.least_busy(simulator=False, operational=True, min_num_qubits=3)
    print(f"Backend: {backend.name}  ({backend.num_qubits} qubits)")

    qc = build_dice_circuit()
    print(qc.draw())

    pm = generate_preset_pass_manager(backend=backend, optimization_level=1)
    isa_circuit = pm.run(qc)

    for attempt in range(1, max_attempts + 1):
        sampler = Sampler(mode=backend)
        job = sampler.run([isa_circuit], shots=64)
        print(f"Attempt {attempt} — Job ID: {job.job_id()}  (waiting...)")

        pub_result = job.result()[0]
        bit_strings = pub_result.data.meas.get_bitstrings()
        valid = [b for b in bit_strings if int(b, 2) <= 5]

        if valid:
            chosen = random.choice(valid)
            face = int(chosen, 2) + 1
            print(f"\nResult: |{chosen}⟩ = {int(chosen, 2)} → Die face: {face}")
            return face

        print(f"All results were 6 or 7 — re-rolling (attempt {attempt}/{max_attempts})")

    raise RuntimeError("Exceeded max re-roll attempts — extremely unlikely event!")


if __name__ == "__main__":
    face = roll_on_hardware()
    print(f"\nYou rolled a {face}!")
