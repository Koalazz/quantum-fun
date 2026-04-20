import Link from "next/link";

interface SectionProps {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}

function Section({ id, number, title, children }: SectionProps) {
  return (
    <section id={id} className="mb-16 scroll-mt-24">
      <div className="flex items-baseline gap-3 mb-6">
        <span className="font-mono text-xs text-purple-500/60 w-6">{number}</span>
        <h2 className="text-2xl font-bold text-slate-100">{title}</h2>
      </div>
      <div className="pl-9">{children}</div>
    </section>
  );
}

function Callout({
  type,
  children,
}: {
  type: "info" | "tip" | "warning" | "concept";
  children: React.ReactNode;
}) {
  const styles = {
    info: "border-cyan-500/30 bg-cyan-500/5 text-cyan-300",
    tip: "border-emerald-500/30 bg-emerald-500/5 text-emerald-300",
    warning: "border-amber-500/30 bg-amber-500/5 text-amber-300",
    concept: "border-purple-500/30 bg-purple-500/5 text-purple-300",
  };
  const icons = {
    info: "ℹ",
    tip: "✦",
    warning: "⚠",
    concept: "⚛",
  };

  return (
    <div className={`rounded-lg border p-4 my-4 ${styles[type]}`}>
      <div className="flex items-start gap-2">
        <span className="text-base leading-tight mt-0.5">{icons[type]}</span>
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function CodeBlock({ title, code, language = "python" }: { title?: string; code: string; language?: string }) {
  return (
    <div className="my-4 rounded-lg overflow-hidden border border-purple-900/30">
      {title && (
        <div className="flex items-center gap-2 px-4 py-2 bg-purple-900/20 border-b border-purple-900/30">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <span className="text-xs text-slate-400 font-mono ml-1">{title}</span>
        </div>
      )}
      <pre className="p-4 overflow-x-auto bg-black/40 m-0 border-0 rounded-none">
        <code className={`language-${language} text-sm`}>{code}</code>
      </pre>
    </div>
  );
}

const tocItems = [
  { id: "what-is-quantum", label: "What is a quantum computer?" },
  { id: "key-concepts", label: "Key concepts" },
  { id: "setup", label: "Setup & installation" },
  { id: "step1", label: "Step 1 · Create the circuit" },
  { id: "step2", label: "Step 2 · Optimize for hardware" },
  { id: "step3", label: "Step 3 · Run on IBM Quantum" },
  { id: "step4", label: "Step 4 · Read the results" },
  { id: "full-code", label: "Full code" },
  { id: "part2", label: "Part 2 · 100-qubit GHZ" },
  { id: "further-reading", label: "Further reading" },
];

export default function HelloWorldDocsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-deep)" }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-10">
          <Link href="/" className="hover:text-slate-300 transition-colors">Projects</Link>
          <span>/</span>
          <Link href="/projects/hello-world" className="hover:text-slate-300 transition-colors">Hello Quantum World</Link>
          <span>/</span>
          <span className="text-slate-300">Guide</span>
        </nav>

        <div className="flex gap-12">
          {/* TOC sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">On this page</p>
              <nav className="space-y-1">
                {tocItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-sm text-slate-400 hover:text-purple-300 py-1 transition-colors leading-tight"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-8 pt-6 border-t border-white/5">
                <Link
                  href="/projects/hello-world"
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to project
                </Link>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-medium mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Educational Guide · No experience needed
              </div>
              <h1 className="text-4xl font-bold text-slate-100 mb-3">
                Hello Quantum World
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed">
                Your complete guide to running your first quantum program on real IBM quantum hardware.
                We will explain every concept from scratch — no physics or programming background required.
              </p>
            </div>

            {/* Section 1 */}
            <Section id="what-is-quantum" number="01" title="What is a quantum computer?">
              <p className="text-slate-400 leading-relaxed mb-4">
                A regular computer stores information as <strong className="text-slate-300">bits</strong> — each bit is either
                a <code className="bg-white/10 px-1 rounded text-cyan-300">0</code> or a{" "}
                <code className="bg-white/10 px-1 rounded text-cyan-300">1</code>. Your laptop might have billions of bits, but
                each one is always exactly one value.
              </p>
              <p className="text-slate-400 leading-relaxed mb-4">
                A quantum computer uses <strong className="text-slate-300">qubits</strong> (quantum bits). A qubit can be 0,
                1, or — and this is the key idea —{" "}
                <strong className="text-purple-300">both 0 and 1 at the same time</strong>. This is called{" "}
                <strong className="text-purple-300">superposition</strong>.
              </p>
              <Callout type="concept">
                <strong>Analogy:</strong> Imagine a coin. When it is lying flat, it is either heads (0) or tails (1).
                A qubit in superposition is like a spinning coin — it is neither heads nor tails until it lands.
                The act of measuring it &quot;lands&quot; the coin.
              </Callout>
              <p className="text-slate-400 leading-relaxed mb-4">
                Quantum computers are not faster at everything. They excel at specific problems: simulating molecules,
                cracking certain codes, searching large databases, and optimizing complex systems. For our purposes, they are
                the most perfect random number generators in the universe — randomness guaranteed by physics itself.
              </p>
            </Section>

            {/* Section 2 */}
            <Section id="key-concepts" number="02" title="Key concepts you will use today">
              <div className="space-y-6">
                <div
                  className="p-5 rounded-xl border border-purple-700/30"
                  style={{ backgroundColor: "var(--bg-card)" }}
                >
                  <h3 className="font-semibold text-purple-300 mb-2">Superposition</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    A qubit in superposition exists in both states (0 and 1) simultaneously with some probability of each.
                    When you <em>measure</em> it, it &quot;collapses&quot; to one definite value. The Hadamard gate (H) is the
                    tool that puts a qubit into superposition — it gives exactly 50% probability for each outcome.
                  </p>
                </div>
                <div
                  className="p-5 rounded-xl border border-cyan-700/30"
                  style={{ backgroundColor: "var(--bg-card)" }}
                >
                  <h3 className="font-semibold text-cyan-300 mb-2">Entanglement</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Two qubits are entangled when measuring one instantly determines the outcome of the other, no matter how
                    far apart they are. Einstein called it &quot;spooky action at a distance.&quot; The CNOT gate (Controlled-NOT)
                    is how we create entanglement — it flips the second qubit only if the first is in state 1.
                  </p>
                </div>
                <div
                  className="p-5 rounded-xl border border-emerald-700/30"
                  style={{ backgroundColor: "var(--bg-card)" }}
                >
                  <h3 className="font-semibold text-emerald-300 mb-2">Bell State</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    A Bell state is a specific pair of maximally entangled qubits. When measured, the two qubits{" "}
                    <em>always</em> give the same result — either both 0 or both 1 — even though each outcome is random.
                    It is the simplest proof that quantum entanglement is real.
                  </p>
                </div>
                <div
                  className="p-5 rounded-xl border border-slate-700/40"
                  style={{ backgroundColor: "var(--bg-card)" }}
                >
                  <h3 className="font-semibold text-slate-300 mb-2">Quantum Gate</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    A quantum gate is an operation on qubits — like logic gates (AND, OR, NOT) in classical computing,
                    but reversible. Today we use two gates: <strong className="text-purple-300">H (Hadamard)</strong> to
                    create superposition, and <strong className="text-cyan-300">CNOT</strong> to create entanglement.
                  </p>
                </div>
              </div>
            </Section>

            {/* Section 3 */}
            <Section id="setup" number="03" title="Setup & installation">
              <p className="text-slate-400 leading-relaxed mb-4">
                We need two things: a Python environment and an IBM Quantum account (already set up via your API key).
              </p>

              <h3 className="text-slate-300 font-semibold mb-2">Install Qiskit</h3>
              <p className="text-sm text-slate-400 mb-3">
                Qiskit is IBM's open-source quantum computing SDK. It lets us write quantum circuits in Python and run
                them on real IBM quantum hardware.
              </p>
              <CodeBlock
                title="terminal"
                language="bash"
                code={`pip install qiskit-ibm-runtime matplotlib`}
              />

              <h3 className="text-slate-300 font-semibold mb-2 mt-6">Save your IBM Quantum credentials</h3>
              <p className="text-sm text-slate-400 mb-3">
                This saves your API key locally so you do not need to enter it every time. Run this <em>once</em>.
              </p>
              <CodeBlock
                title="save_credentials.py"
                code={`from qiskit_ibm_runtime import QiskitRuntimeService

# Save once — this writes to ~/.qiskit/qiskit-ibm.json
QiskitRuntimeService.save_account(
    channel="ibm_quantum",
    token="YOUR_API_KEY_HERE",  # from /home/yaya/Downloads/apikey.json
)

print("Credentials saved!")
`}
              />
              <Callout type="tip">
                The project&apos;s <code className="bg-white/10 px-1 rounded">quantum/hello-world/main.py</code> loads the
                API key automatically from your environment or saved credentials. You do not need to paste it in manually.
              </Callout>

              <h3 className="text-slate-300 font-semibold mb-2 mt-6">What is IBM Quantum?</h3>
              <p className="text-sm text-slate-400 mb-3">
                IBM Quantum is IBM&apos;s cloud platform for running programs on real quantum computers. The free tier gives
                you 10 minutes of quantum hardware time per day — more than enough for these experiments. The computers
                are in IBM&apos;s data centers; you submit jobs over the internet and get results back.
              </p>
            </Section>

            {/* Section 4 */}
            <Section id="step1" number="04" title="Step 1 · Create the quantum circuit">
              <p className="text-slate-400 leading-relaxed mb-4">
                A <strong className="text-slate-300">quantum circuit</strong> is a sequence of quantum gates applied
                to qubits — like a recipe for a quantum computation. We will build a 2-qubit Bell state circuit.
              </p>
              <CodeBlock
                title="main.py — Step 1"
                code={`from qiskit import QuantumCircuit
from qiskit.quantum_info import SparsePauliOp

# Create a circuit with 2 qubits
qc = QuantumCircuit(2)

# Apply a Hadamard gate to qubit 0
# This puts qubit 0 into superposition: |+⟩ = (|0⟩ + |1⟩) / √2
qc.h(0)

# Apply a CNOT gate: qubit 0 is control, qubit 1 is target
# This entangles the two qubits
qc.cx(0, 1)

# Print an ASCII diagram of the circuit
print(qc.draw())
`}
              />
              <p className="text-sm text-slate-400 mt-3 mb-4">What this produces:</p>
              <div className="font-mono text-sm text-slate-300 bg-black/30 rounded-lg p-4 border border-white/5 leading-loose">
                <pre>{`     ┌───┐
q_0: ┤ H ├──■──
     └───┘┌─┴─┐
q_1: ─────┤ X ├
          └───┘`}</pre>
              </div>
              <Callout type="concept">
                <strong>Why this creates entanglement:</strong> After H, qubit 0 is in state (|0⟩ + |1⟩) / √2.
                The CNOT then creates the joint state (|00⟩ + |11⟩) / √2. This means: if qubit 0 is measured as 0,
                qubit 1 will be 0. If qubit 0 is 1, qubit 1 will be 1. Always. No matter what.
              </Callout>

              <h3 className="text-slate-300 font-semibold mb-2 mt-6">Define what to measure</h3>
              <p className="text-sm text-slate-400 mb-3">
                Instead of counting how many 0s and 1s we get, we will measure{" "}
                <strong className="text-slate-300">expectation values</strong> of Pauli observables.
                Think of these as &quot;correlation measurements&quot; — they tell us how correlated the qubits are.
              </p>
              <CodeBlock
                title="main.py — observables"
                code={`# Pauli observables: I = identity, Z = measure in Z basis, X = measure in X basis
# "IZ" means: measure qubit 1 in Z, ignore qubit 0
# "ZZ" means: measure correlation between both qubits in Z
observables_labels = ["IZ", "IX", "ZI", "XI", "ZZ", "XX"]
observables = [SparsePauliOp(label) for label in observables_labels]
`}
              />
            </Section>

            {/* Section 5 */}
            <Section id="step2" number="05" title="Step 2 · Optimize the circuit for real hardware">
              <p className="text-slate-400 leading-relaxed mb-4">
                Real quantum computers are messy. Each one has a unique physical layout — not every qubit can talk
                to every other qubit. The circuit we wrote assumes an ideal computer. Before running on hardware, we
                need to <strong className="text-slate-300">transpile</strong> (translate + optimize) our circuit to
                match the actual machine.
              </p>
              <CodeBlock
                title="main.py — Step 2"
                code={`from qiskit_ibm_runtime import QiskitRuntimeService
from qiskit.transpiler import generate_preset_pass_manager

# Connect to IBM Quantum
service = QiskitRuntimeService()

# Pick the least busy real quantum computer with ≥ 2 qubits
# (not a simulator — we want real quantum hardware!)
backend = service.least_busy(simulator=False, operational=True)
print(f"Running on: {backend.name}")

# Transpile: convert our abstract circuit to native gates
# optimization_level=1 is a good balance of speed vs quality
pm = generate_preset_pass_manager(backend=backend, optimization_level=1)
isa_circuit = pm.run(qc)  # ISA = Instruction Set Architecture
`}
              />
              <Callout type="info">
                <strong>What is transpilation?</strong> Your circuit uses abstract gates (H, CNOT). Real quantum
                computers only support a small set of native gates (like ECR, RZ, SX on IBM machines). The transpiler
                converts your abstract gates to native ones, and also routes qubits to match the physical connections
                of the specific chip you are using.
              </Callout>
            </Section>

            {/* Section 6 */}
            <Section id="step3" number="06" title="Step 3 · Run on IBM Quantum hardware">
              <p className="text-slate-400 leading-relaxed mb-4">
                We use the <strong className="text-slate-300">Estimator</strong> — a Qiskit Runtime primitive that
                runs our circuit and returns expectation values. We turn on{" "}
                <strong className="text-slate-300">error mitigation</strong> to get cleaner results despite the noise
                that exists in today&apos;s quantum hardware.
              </p>
              <CodeBlock
                title="main.py — Step 3"
                code={`from qiskit_ibm_runtime import EstimatorV2 as Estimator

# Create an Estimator connected to our backend
estimator = Estimator(mode=backend)

# Resilience level 1 = basic error mitigation (noise reduction)
estimator.options.resilience_level = 1

# Run 5000 shots (repetitions) for statistical accuracy
estimator.options.default_shots = 5000

# Apply the circuit's layout to our observables
mapped_observables = [
    observable.apply_layout(isa_circuit.layout) for observable in observables
]

# Submit the job to IBM Quantum
# This sends your circuit over the internet to a real quantum computer
job = estimator.run([(isa_circuit, mapped_observables)])
print(f"Job submitted! ID: {job.job_id()}")
print("Waiting for results (usually 1-5 minutes)...")
`}
              />
              <Callout type="warning">
                <strong>Jobs take time.</strong> Your circuit joins a queue of other users&apos; jobs on the IBM Quantum
                computer. Wait time is typically 1–10 minutes. The job ID lets you check status later if you close
                your terminal.
              </Callout>
            </Section>

            {/* Section 7 */}
            <Section id="step4" number="07" title="Step 4 · Read and visualize the results">
              <p className="text-slate-400 leading-relaxed mb-4">
                When the job completes, we get back expectation values for each observable. Let us plot them and
                understand what they mean.
              </p>
              <CodeBlock
                title="main.py — Step 4"
                code={`from matplotlib import pyplot as plt

# Get the results
pub_result = job.result()[0]
values = pub_result.data.evs   # expectation values
errors = pub_result.data.stds  # statistical error bars

print("\\nResults:")
for label, value, error in zip(observables_labels, values, errors):
    print(f"  {label}: {value:.3f} ± {error:.3f}")

# Plot
plt.figure(figsize=(8, 4))
plt.plot(observables_labels, values, "-o", color="#7c3aed", linewidth=2, markersize=8)
plt.errorbar(observables_labels, values, yerr=errors, fmt="none", color="#7c3aed", alpha=0.5)
plt.axhline(0, color="white", alpha=0.2, linewidth=0.5)
plt.xlabel("Observable", color="#94a3b8")
plt.ylabel("Expectation Value", color="#94a3b8")
plt.title("Bell State Correlations", color="#e2e8f0")
plt.ylim(-1.2, 1.2)
plt.tight_layout()
plt.savefig("bell_state_results.png", dpi=150, facecolor="#03050f")
plt.show()
print("\\nPlot saved as bell_state_results.png")
`}
              />
              <Callout type="concept">
                <strong>What to look for:</strong> The magic is in ZZ and XX — they should both be close to +1.
                This means: whenever qubit 0 is +1 in Z, qubit 1 is also +1. They are perfectly correlated.
                IZ, ZI, IX, XI should be near 0 — each qubit individually looks completely random.
                Random individually, perfectly correlated together. That is entanglement.
              </Callout>
            </Section>

            {/* Section 8 */}
            <Section id="full-code" number="08" title="Full code">
              <p className="text-slate-400 leading-relaxed mb-4">
                Here is the complete script, combining all four steps. This is what is in{" "}
                <code className="bg-white/10 px-1 rounded text-cyan-300">quantum/hello-world/main.py</code>.
              </p>
              <CodeBlock
                title="quantum/hello-world/main.py"
                code={`"""
Hello Quantum World — Bell State on IBM Quantum hardware
Project: Quantum Fun #01
"""

import os
from qiskit import QuantumCircuit
from qiskit.quantum_info import SparsePauliOp
from qiskit.transpiler import generate_preset_pass_manager
from qiskit_ibm_runtime import QiskitRuntimeService, EstimatorV2 as Estimator
from matplotlib import pyplot as plt


def create_bell_circuit() -> tuple[QuantumCircuit, list[SparsePauliOp], list[str]]:
    """Create a 2-qubit Bell state circuit with Pauli observables."""
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
    """Transpile, run, and plot the Bell state circuit on IBM Quantum."""
    api_key = os.environ.get("IBM_QUANTUM_API_KEY")
    service = QiskitRuntimeService(channel="ibm_quantum", token=api_key)

    backend = service.least_busy(simulator=False, operational=True)
    print(f"Running on: {backend.name}")

    pm = generate_preset_pass_manager(backend=backend, optimization_level=1)
    isa_circuit = pm.run(qc)
    mapped_observables = [obs.apply_layout(isa_circuit.layout) for obs in observables]

    estimator = Estimator(mode=backend)
    estimator.options.resilience_level = 1
    estimator.options.default_shots = 5000

    job = estimator.run([(isa_circuit, mapped_observables)])
    print(f"Job ID: {job.job_id()} — waiting for results...")

    pub_result = job.result()[0]
    values = pub_result.data.evs
    errors = pub_result.data.stds

    print("\\nResults:")
    for label, val, err in zip(labels, values, errors):
        print(f"  {label}: {val:.3f} ± {err:.3f}")

    plt.figure(figsize=(8, 4))
    plt.plot(labels, values, "-o", color="#7c3aed", linewidth=2, markersize=8)
    plt.errorbar(labels, values, yerr=errors, fmt="none", color="#7c3aed", alpha=0.5)
    plt.axhline(0, color="white", alpha=0.2, linewidth=0.5)
    plt.xlabel("Observable")
    plt.ylabel("Expectation Value")
    plt.title("Bell State Correlations — IBM Quantum")
    plt.ylim(-1.2, 1.2)
    plt.tight_layout()
    plt.savefig("bell_state_results.png", dpi=150)
    print("Plot saved as bell_state_results.png")


if __name__ == "__main__":
    qc, observables, labels = create_bell_circuit()
    print(qc.draw())
    run_on_hardware(qc, observables, labels)
`}
              />
            </Section>

            {/* Section 9 */}
            <Section id="part2" number="09" title="Part 2 · Scaling up to 100 qubits">
              <p className="text-slate-400 leading-relaxed mb-4">
                The Bell state uses 2 qubits. A{" "}
                <strong className="text-slate-300">GHZ state</strong> (Greenberger–Horne–Zeilinger) extends
                entanglement across <em>N</em> qubits. At 100 qubits, this becomes a &quot;utility-scale&quot;
                demonstration — something impossible to simulate classically.
              </p>
              <Callout type="concept">
                <strong>Why is 100 qubits special?</strong> Simulating a 50+ qubit entangled system requires more
                classical memory than exists on Earth. At 100 entangled qubits, only a real quantum computer can
                evaluate this circuit. Welcome to the regime where quantum computers have no classical equivalent.
              </Callout>
              <CodeBlock
                title="quantum/hello-world/ghz_100.py"
                code={`"""
100-Qubit GHZ State — utility-scale quantum entanglement
Part 2 of the Hello World project.
"""

import os
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
    """Create an n-qubit GHZ state: entangle all n qubits in a chain."""
    qc = QuantumCircuit(n)
    qc.h(0)
    for i in range(n - 1):
        qc.cx(i, i + 1)
    return qc


def run_ghz(n: int = 100) -> None:
    api_key = os.environ.get("IBM_QUANTUM_API_KEY")
    service = QiskitRuntimeService(channel="ibm_quantum", token=api_key)

    backend = service.least_busy(
        simulator=False, operational=True, min_num_qubits=n
    )
    print(f"Running {n}-qubit GHZ on: {backend.name}")

    qc = get_ghz_circuit(n)

    # ZiZ0 correlation operators: how correlated is qubit i with qubit 0?
    operator_strings = [
        "Z" + "I" * i + "Z" + "I" * (n - 2 - i) for i in range(n - 1)
    ]
    operators = [SparsePauliOp(s) for s in operator_strings]

    pm = generate_preset_pass_manager(optimization_level=1, backend=backend)
    isa_circuit = pm.run(qc)
    isa_operators = [op.apply_layout(isa_circuit.layout) for op in operators]

    # Dynamical decoupling reduces noise on long circuits
    options = EstimatorOptions()
    options.resilience_level = 1
    options.dynamical_decoupling.enable = True
    options.dynamical_decoupling.sequence_type = "XY4"

    estimator = Estimator(backend, options=options)
    job = estimator.run([(isa_circuit, isa_operators)])
    print(f"Job ID: {job.job_id()} — waiting...")

    result = job.result()[0]
    values = result.data.evs
    normalized = [v / values[0] for v in values]

    plt.figure(figsize=(10, 4))
    plt.plot(range(1, len(normalized) + 1), normalized, marker="o", markersize=3,
             color="#06b6d4", linewidth=1.5)
    plt.xlabel("Distance from qubit 0 (i)")
    plt.ylabel("⟨ZᵢZ₀⟩ / ⟨Z₁Z₀⟩")
    plt.title(f"{n}-Qubit GHZ State — Correlation Decay")
    plt.tight_layout()
    plt.savefig("ghz_100_results.png", dpi=150)
    print("Plot saved as ghz_100_results.png")


if __name__ == "__main__":
    run_ghz(100)
`}
              />
              <p className="text-sm text-slate-400 mt-3">
                You will see correlations decay with distance from qubit 0 — this is due to the noise accumulation
                as the entanglement chain gets longer. This decay is a real physical measurement of decoherence on
                quantum hardware.
              </p>
            </Section>

            {/* Section 10 */}
            <Section id="further-reading" number="10" title="Further reading & resources">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: "IBM Quantum Hello World Guide",
                    description: "The official IBM tutorial this project is based on",
                    url: "https://quantum.cloud.ibm.com/docs/en/guides/hello-world",
                    category: "Official Docs",
                  },
                  {
                    title: "Qiskit Documentation",
                    description: "Full reference for the Qiskit SDK — circuits, gates, transpiler",
                    url: "https://docs.quantum.ibm.com",
                    category: "Official Docs",
                  },
                  {
                    title: "IBM Quantum Learning",
                    description: "Free courses from IBM — from basics to advanced algorithms",
                    url: "https://learning.quantum.ibm.com",
                    category: "Courses",
                  },
                  {
                    title: "Qiskit Textbook",
                    description: "Learn quantum computing with interactive Jupyter notebooks",
                    url: "https://github.com/Qiskit/textbook",
                    category: "Textbook",
                  },
                  {
                    title: "Bell States — Wikipedia",
                    description: "Mathematical description of Bell states and their properties",
                    url: "https://en.wikipedia.org/wiki/Bell_state",
                    category: "Theory",
                  },
                  {
                    title: "Quantum Computing Playground",
                    description: "Visual browser-based quantum circuit simulator",
                    url: "https://quantumplayground.net",
                    category: "Interactive",
                  },
                ].map((resource) => (
                  <a
                    key={resource.url}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-4 rounded-xl border border-white/5 hover:border-purple-700/40 transition-all"
                    style={{ backgroundColor: "var(--bg-card)" }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-200 group-hover:text-purple-300 transition-colors">
                        {resource.title}
                      </span>
                      <svg className="w-3.5 h-3.5 shrink-0 text-slate-500 group-hover:text-purple-400 transition-colors mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-2">{resource.description}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/20 border border-purple-700/20 text-purple-400">
                      {resource.category}
                    </span>
                  </a>
                ))}
              </div>

              {/* Next project */}
              <div className="mt-10 p-6 rounded-xl border border-purple-700/30 bg-purple-900/10 text-center">
                <p className="text-sm text-slate-400 mb-3">
                  Finished? You are ready for the next project.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-colors"
                >
                  Back to all projects
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
