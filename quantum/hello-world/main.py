"""
Hello Quantum World — Bell State on IBM Quantum hardware
Project: Quantum Fun #01 · https://localhost:3000/projects/hello-world

Run:
    IBM_QUANTUM_API_KEY=<key> python main.py
    or set IBM_QUANTUM_API_KEY in your environment / .env.local
"""

import os
import sys
from qiskit import QuantumCircuit
from qiskit.quantum_info import SparsePauliOp
from qiskit.transpiler import generate_preset_pass_manager
from qiskit_ibm_runtime import QiskitRuntimeService, EstimatorV2 as Estimator
from matplotlib import pyplot as plt


def create_bell_circuit() -> tuple[QuantumCircuit, list[SparsePauliOp], list[str]]:
    """Two-qubit Bell state: H on q0, then CNOT(q0 → q1)."""
    qc = QuantumCircuit(2)
    qc.h(0)
    qc.cx(0, 1)

    labels = ["IZ", "IX", "ZI", "XI", "ZZ", "XX"]
    observables = [SparsePauliOp(label) for label in labels]
    return qc, observables, labels


def run_on_hardware(
    qc: QuantumCircuit,
    observables: list[SparsePauliOp],
    labels: list[str],
) -> None:
    api_key = os.environ.get("IBM_QUANTUM_API_KEY")
    if not api_key:
        print("Error: IBM_QUANTUM_API_KEY not set.")
        print("Set it with:  export IBM_QUANTUM_API_KEY=<your-key>")
        sys.exit(1)

    service = QiskitRuntimeService(channel="ibm_quantum", token=api_key)

    backend = service.least_busy(simulator=False, operational=True)
    print(f"Backend: {backend.name}")

    pm = generate_preset_pass_manager(backend=backend, optimization_level=1)
    isa_circuit = pm.run(qc)
    mapped_observables = [obs.apply_layout(isa_circuit.layout) for obs in observables]

    estimator = Estimator(mode=backend)
    estimator.options.resilience_level = 1
    estimator.options.default_shots = 5000

    job = estimator.run([(isa_circuit, mapped_observables)])
    print(f"Job ID: {job.job_id()}  (save this to check status later)")
    print("Waiting for results...")

    pub_result = job.result()[0]
    values = pub_result.data.evs
    errors = pub_result.data.stds

    print("\nResults:")
    for label, val, err in zip(labels, values, errors):
        bar = "█" * int(abs(val) * 20)
        sign = "+" if val >= 0 else "-"
        print(f"  {label}  {sign}{abs(val):.3f} ±{err:.3f}  {bar}")

    fig, ax = plt.subplots(figsize=(8, 4))
    ax.plot(labels, values, "-o", color="#7c3aed", linewidth=2, markersize=8, zorder=3)
    ax.errorbar(labels, values, yerr=errors, fmt="none", color="#7c3aed", alpha=0.5)
    ax.axhline(0, color="#94a3b8", alpha=0.3, linewidth=0.8)
    ax.axhline(1, color="#06b6d4", alpha=0.2, linewidth=0.8, linestyle="--")
    ax.set_xlabel("Observable", color="#94a3b8")
    ax.set_ylabel("Expectation Value", color="#94a3b8")
    ax.set_title("Bell State Correlations — IBM Quantum", color="#e2e8f0", pad=12)
    ax.set_ylim(-1.3, 1.3)
    ax.set_facecolor("#03050f")
    fig.patch.set_facecolor("#03050f")
    ax.tick_params(colors="#94a3b8")
    for spine in ax.spines.values():
        spine.set_edgecolor("#334155")
    plt.tight_layout()
    out = "bell_state_results.png"
    plt.savefig(out, dpi=150)
    print(f"\nPlot saved → {out}")


if __name__ == "__main__":
    qc, observables, labels = create_bell_circuit()
    print("Circuit:")
    print(qc.draw())
    print()
    run_on_hardware(qc, observables, labels)
