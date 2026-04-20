"""
100-Qubit GHZ State — utility-scale quantum entanglement
Project: Quantum Fun #01 (Part 2) · https://localhost:3000/projects/hello-world
"""

import os
import sys
from qiskit import QuantumCircuit
from qiskit.quantum_info import SparsePauliOp
from qiskit.transpiler import generate_preset_pass_manager
from qiskit_ibm_runtime import (
    QiskitRuntimeService,
    EstimatorV2 as Estimator,
    EstimatorOptions,
)
from matplotlib import pyplot as plt


def get_ghz_circuit(n: int) -> QuantumCircuit:
    qc = QuantumCircuit(n)
    qc.h(0)
    for i in range(n - 1):
        qc.cx(i, i + 1)
    return qc


def run_ghz(n: int = 100) -> None:
    api_key = os.environ.get("IBM_QUANTUM_API_KEY")
    if not api_key:
        print("Error: IBM_QUANTUM_API_KEY not set.")
        sys.exit(1)

    service = QiskitRuntimeService(channel="ibm_quantum", token=api_key)
    backend = service.least_busy(simulator=False, operational=True, min_num_qubits=n)
    print(f"Backend: {backend.name}  ({backend.num_qubits} qubits)")

    qc = get_ghz_circuit(n)

    operator_strings = [
        "Z" + "I" * i + "Z" + "I" * (n - 2 - i) for i in range(n - 1)
    ]
    operators = [SparsePauliOp(s) for s in operator_strings]

    pm = generate_preset_pass_manager(optimization_level=1, backend=backend)
    isa_circuit = pm.run(qc)
    isa_operators = [op.apply_layout(isa_circuit.layout) for op in operators]

    options = EstimatorOptions()
    options.resilience_level = 1
    options.dynamical_decoupling.enable = True
    options.dynamical_decoupling.sequence_type = "XY4"

    estimator = Estimator(backend, options=options)
    job = estimator.run([(isa_circuit, isa_operators)])
    print(f"Job ID: {job.job_id()}")
    print("Waiting for results...")

    result = job.result()[0]
    values = result.data.evs
    normalized = [v / values[0] for v in values]

    fig, ax = plt.subplots(figsize=(10, 4))
    ax.plot(range(1, len(normalized) + 1), normalized, marker="o", markersize=3,
            color="#06b6d4", linewidth=1.5)
    ax.set_xlabel("Distance from qubit 0 (i)", color="#94a3b8")
    ax.set_ylabel("⟨ZᵢZ₀⟩ / ⟨Z₁Z₀⟩", color="#94a3b8")
    ax.set_title(f"{n}-Qubit GHZ State — Correlation Decay", color="#e2e8f0")
    ax.set_facecolor("#03050f")
    fig.patch.set_facecolor("#03050f")
    ax.tick_params(colors="#94a3b8")
    for spine in ax.spines.values():
        spine.set_edgecolor("#334155")
    plt.tight_layout()
    out = f"ghz_{n}_results.png"
    plt.savefig(out, dpi=150)
    print(f"Plot saved → {out}")


if __name__ == "__main__":
    run_ghz(100)
