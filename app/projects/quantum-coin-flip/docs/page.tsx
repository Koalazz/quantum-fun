import Link from "next/link";

function Section({ id, number, title, children }: { id: string; number: string; title: string; children: React.ReactNode }) {
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

function Callout({ type, children }: { type: "info" | "tip" | "warning" | "concept"; children: React.ReactNode }) {
  const styles = {
    info: "border-cyan-500/30 bg-cyan-500/5 text-cyan-300",
    tip: "border-emerald-500/30 bg-emerald-500/5 text-emerald-300",
    warning: "border-amber-500/30 bg-amber-500/5 text-amber-300",
    concept: "border-purple-500/30 bg-purple-500/5 text-purple-300",
  };
  const icons = { info: "ℹ", tip: "✦", warning: "⚠", concept: "⚛" };
  return (
    <div className={`rounded-lg border p-4 my-4 ${styles[type]}`}>
      <div className="flex items-start gap-2">
        <span className="text-base leading-tight mt-0.5">{icons[type]}</span>
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function CodeBlock({ title, code }: { title?: string; code: string }) {
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
        <code className="language-python text-sm">{code}</code>
      </pre>
    </div>
  );
}

const toc = [
  { id: "what-is-random", label: "What makes randomness truly random?" },
  { id: "the-qubit", label: "The qubit — a quantum coin" },
  { id: "hadamard-gate", label: "The Hadamard gate" },
  { id: "the-circuit", label: "The quantum coin flip circuit" },
  { id: "born-rule", label: "The Born rule — why exactly 50/50?" },
  { id: "step-by-step", label: "Step-by-step code walkthrough" },
  { id: "full-code", label: "Full code" },
  { id: "ibm-hardware", label: "Running on real IBM Quantum hardware" },
  { id: "further-reading", label: "Further reading" },
];

export default function QuantumCoinFlipDocsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-deep)" }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-10">
          <Link href="/" className="hover:text-slate-300 transition-colors">Projects</Link>
          <span>/</span>
          <Link href="/projects/quantum-coin-flip" className="hover:text-slate-300 transition-colors">Quantum Coin Flip</Link>
          <span>/</span>
          <span className="text-slate-300">Guide</span>
        </nav>

        <div className="flex gap-12">
          {/* TOC */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">On this page</p>
              <nav className="space-y-1">
                {toc.map((item) => (
                  <a key={item.id} href={`#${item.id}`}
                    className="block text-sm text-slate-400 hover:text-purple-300 py-1 transition-colors leading-tight">
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-8 pt-6 border-t border-white/5 space-y-2">
                <Link href="/projects/quantum-coin-flip/play"
                  className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  Flip the coin →
                </Link>
                <Link href="/projects/quantum-coin-flip"
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                  ← Back to project
                </Link>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Educational Guide · 1 qubit · Beginner
              </div>
              <h1 className="text-4xl font-bold text-slate-100 mb-3">Quantum Coin Flip — Complete Guide</h1>
              <p className="text-lg text-slate-400 leading-relaxed">
                The simplest possible quantum program: one qubit, one gate, one measurement.
                We cover what truly random means, why a physical coin isn&apos;t it, and how a single
                qubit achieves what no classical system can.
              </p>
            </div>

            {/* Section 1 */}
            <Section id="what-is-random" number="01" title="What makes randomness truly random?">
              <p className="text-slate-400 leading-relaxed mb-4">
                When you flip a physical coin, the outcome seems random — but it isn&apos;t, not in a deep sense.
                If you knew the exact force, angle, air resistance, and surface properties, you could predict
                whether it lands heads or tails every time. The randomness is <strong className="text-slate-300">epistemic</strong>
                — it comes from your ignorance, not from nature.
              </p>
              <Callout type="concept">
                <strong>Epistemic vs. ontic randomness.</strong> Epistemic randomness is unpredictability due to
                incomplete information. Ontic randomness is unpredictability that exists in reality itself — no
                amount of information would help you predict the outcome. Quantum mechanics produces ontic randomness.
              </Callout>
              <p className="text-slate-400 leading-relaxed mb-4">
                Classical random number generators (PRNGs) are even worse: they are entirely deterministic.
                Given the same seed, <code className="bg-white/10 px-1 rounded text-cyan-300">random.random()</code> produces
                the exact same sequence forever. They are not random at all — they are mathematical illusions of randomness.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Quantum measurement is different. According to quantum mechanics, when a qubit in superposition
                is measured, the outcome is not determined by any prior state of the universe. This has been
                experimentally confirmed to extraordinary precision via Bell inequality tests. The randomness
                is <strong className="text-purple-300">built into the fabric of reality</strong>.
              </p>
            </Section>

            {/* Section 2 */}
            <Section id="the-qubit" number="02" title="The qubit — a quantum coin">
              <p className="text-slate-400 leading-relaxed mb-4">
                A classical bit is always 0 or 1. A qubit can be a <strong className="text-slate-300">superposition</strong>
                — a combination of 0 and 1 at the same time. We write the general state as:
              </p>
              <div className="bg-black/30 rounded-lg p-4 border border-white/5 font-mono text-sm text-center mb-4">
                <span className="text-slate-400">|ψ⟩ = α</span>
                <span className="text-purple-300">|0⟩</span>
                <span className="text-slate-400"> + β</span>
                <span className="text-cyan-300">|1⟩</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-4">
                Where α and β are <strong className="text-slate-300">probability amplitudes</strong> — complex numbers
                satisfying |α|² + |β|² = 1. When you measure the qubit, you get |0⟩ with probability |α|²
                and |1⟩ with probability |β|².
              </p>
              <Callout type="info">
                <strong>The key difference from a classical coin mid-spin:</strong> A spinning coin is always
                heads or tails — you just don&apos;t know which. A qubit in superposition is genuinely neither
                until measured. The difference is not philosophical — it produces measurable physical effects
                (interference) that classical probability cannot explain.
              </Callout>
              <p className="text-slate-400 leading-relaxed">
                For our coin flip, we want α = β = 1/√2, giving exactly 50% probability for each outcome.
                We call |0⟩ = Tails and |1⟩ = Heads. The Hadamard gate creates this perfect balance.
              </p>
            </Section>

            {/* Section 3 */}
            <Section id="hadamard-gate" number="03" title="The Hadamard gate">
              <p className="text-slate-400 leading-relaxed mb-4">
                A quantum gate is a unitary matrix that transforms qubit states. The Hadamard gate (H) is:
              </p>
              <div className="bg-black/30 rounded-lg p-4 border border-white/5 font-mono text-sm text-slate-300 mb-4">
                <div className="text-center mb-2">H = (1/√2) × [ 1 &nbsp; 1 ]</div>
                <div className="text-center">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[ 1 -1 ]</div>
              </div>
              <p className="text-slate-400 leading-relaxed mb-4">
                When applied to the initial qubit state |0⟩ = [1, 0]ᵀ:
              </p>
              <div className="bg-black/30 rounded-lg p-4 border border-white/5 font-mono text-sm text-slate-300 mb-4">
                H|0⟩ = (1/√2) × [1+0, 1+0]ᵀ = (1/√2)[1, 1]ᵀ = (|0⟩ + |1⟩)/√2
              </div>
              <p className="text-slate-400 leading-relaxed">
                The result is a perfectly balanced superposition. Both α and β equal 1/√2, so
                |α|² = |β|² = ½. The Hadamard gate is the quantum equivalent of tossing a coin —
                except the coin is genuinely in both states at once.
              </p>
              <Callout type="concept">
                <strong>Why is H its own inverse?</strong> Applying H twice returns to the original state:
                H²= I. This is because H is both unitary and Hermitian (H† = H). It is one of
                the most important gates in quantum computing and appears in nearly every quantum algorithm.
              </Callout>
            </Section>

            {/* Section 4 */}
            <Section id="the-circuit" number="04" title="The quantum coin flip circuit">
              <p className="text-slate-400 leading-relaxed mb-4">
                The coin flip circuit is the simplest possible quantum program: one gate, one measurement.
              </p>
              <div className="font-mono text-sm text-slate-300 leading-loose bg-black/30 rounded-lg p-4 border border-white/5 mb-4">
                <pre>{`     ┌───┐ ┌─┐
q_0: ┤ H ├─┤M├
     └───┘ └╥┘
meas: ══════╩═`}</pre>
              </div>
              <p className="text-sm text-slate-500 mb-4">
                H = Hadamard gate · M = measurement · ║ = classical wire carrying the bit result
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                {[
                  { step: "Start", desc: "Qubit initialized to |0⟩ — the default state of all qubits before any gates.", color: "slate" },
                  { step: "Apply H", desc: "Hadamard transforms |0⟩ into (|0⟩ + |1⟩)/√2 — equal superposition of heads and tails.", color: "purple" },
                  { step: "Measure", desc: "Collapse collapses the superposition: 50% → |0⟩ (Tails), 50% → |1⟩ (Heads).", color: "cyan" },
                ].map(({ step, desc, color }) => (
                  <div key={step} className={`p-4 rounded-xl border border-${color}-700/30`} style={{ backgroundColor: "var(--bg-card)" }}>
                    <h3 className={`font-semibold text-${color}-300 text-sm mb-2`}>{step}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Section 5 */}
            <Section id="born-rule" number="05" title="The Born rule — why exactly 50/50?">
              <p className="text-slate-400 leading-relaxed mb-4">
                The Born rule is a fundamental postulate of quantum mechanics. It states:
              </p>
              <div className="p-4 rounded-xl border border-purple-700/30 mb-4" style={{ backgroundColor: "var(--bg-card)" }}>
                <p className="text-sm text-slate-300 leading-relaxed">
                  For a quantum state |ψ⟩ = α|0⟩ + β|1⟩, the probability of measuring outcome |0⟩
                  is <span className="text-purple-300 font-mono">|α|²</span> and the probability of
                  measuring |1⟩ is <span className="text-cyan-300 font-mono">|β|²</span>.
                </p>
              </div>
              <p className="text-slate-400 leading-relaxed mb-4">
                After H|0⟩, α = β = 1/√2. So |α|² = |1/√2|² = 1/2 and |β|² = 1/2. Exactly 50% each.
                This is not an approximation — it is exact for an ideal quantum gate, guaranteed by the
                mathematics of unitary transformations.
              </p>
              <Callout type="info">
                <strong>The Born rule has no derivation</strong> from more fundamental principles — it is
                a postulate, confirmed by decades of experiments to extreme precision. Some interpretations
                of quantum mechanics (like Many-Worlds) attempt to derive it, but all mainstream physicists
                accept it as a foundational fact about how nature works.
              </Callout>
              <p className="text-slate-400 leading-relaxed">
                In practice, real quantum hardware introduces noise — small deviations from ideal gate
                behaviour. A real IBM quantum processor will give you ~49.x% / 50.x% rather than exactly
                50/50. But for a single flip, you get one definite outcome. The 50/50 bias only appears
                when you run many flips and look at statistics.
              </p>
            </Section>

            {/* Section 6 */}
            <Section id="step-by-step" number="06" title="Step-by-step code walkthrough">
              <h3 className="text-slate-300 font-semibold mb-2">Build the circuit</h3>
              <CodeBlock title="flip.py — circuit"
                code={`from qiskit import QuantumCircuit

# Create a circuit with 1 qubit
qc = QuantumCircuit(1)

# Apply Hadamard gate — puts qubit into 50/50 superposition
qc.h(0)

# Add measurement — collapses superposition to 0 or 1
qc.measure_all()

print(qc.draw())  # prints the circuit diagram`}
              />
              <Callout type="tip">
                <code>measure_all()</code> adds measurement gates to all qubits AND creates a classical
                register to store results. Without this, quantum states remain unobserved — no output.
              </Callout>

              <h3 className="text-slate-300 font-semibold mb-2 mt-6">Run the circuit</h3>
              <CodeBlock title="flip.py — sampling"
                code={`from qiskit.primitives import StatevectorSampler

# StatevectorSampler runs using exact statevector simulation
# No IBM Quantum account needed — runs entirely on your CPU
sampler = StatevectorSampler()

# Run 1 shot: measure once (one coin flip)
result = sampler.run([(qc,)], shots=1).result()

# Get the measurement counts: {'0': 1} or {'1': 1}
counts = result[0].data.meas.get_counts()
print(counts)`}
              />

              <h3 className="text-slate-300 font-semibold mb-2 mt-6">Extract the result</h3>
              <CodeBlock title="flip.py — result extraction"
                code={`# The measurement result is a single-character string: '0' or '1'
raw_bit = list(counts.keys())[0]
raw_value = int(raw_bit, 2)  # converts '0' → 0, '1' → 1

# Map to coin sides
side = "Heads" if raw_value == 1 else "Tails"
print(f"Quantum coin: {side}")`}
              />
            </Section>

            {/* Section 7 */}
            <Section id="full-code" number="07" title="Full code">
              <CodeBlock title="quantum/quantum-coin-flip/flip.py (simplified)"
                code={`"""
Quantum Coin Flip — flip.py
Uses Qiskit StatevectorSampler (local simulation, instant results)
"""
from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler


def flip_quantum_coin() -> str:
    """Flip a fair quantum coin. Returns 'Heads' or 'Tails'."""
    qc = QuantumCircuit(1)
    qc.h(0)
    qc.measure_all()

    sampler = StatevectorSampler()
    result = sampler.run([(qc,)], shots=1).result()
    counts = result[0].data.meas.get_counts()

    raw_bit = list(counts.keys())[0]
    return "Heads" if int(raw_bit, 2) == 1 else "Tails"


if __name__ == "__main__":
    side = flip_quantum_coin()
    print(f"Quantum coin landed: {side}")`}
              />
            </Section>

            {/* Section 8 */}
            <Section id="ibm-hardware" number="08" title="Running on real IBM Quantum hardware">
              <p className="text-slate-400 leading-relaxed mb-4">
                The web demo uses a local simulator for instant results. To run on actual IBM superconducting
                quantum processors, the circuit is identical — only the execution backend changes.
              </p>
              <CodeBlock title="quantum/quantum-coin-flip/flip_ibm.py (simplified)"
                code={`"""
Quantum Coin Flip on real IBM Quantum hardware
"""
import os
from qiskit import QuantumCircuit
from qiskit.transpiler import generate_preset_pass_manager
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler


def flip_on_hardware() -> str:
    api_key = os.environ.get("IBM_QUANTUM_API_KEY")
    service = QiskitRuntimeService(channel="ibm_quantum_platform", token=api_key)

    # Pick the least busy real backend with at least 1 qubit
    backend = service.least_busy(simulator=False, operational=True, min_num_qubits=1)
    print(f"Using backend: {backend.name}")

    qc = QuantumCircuit(1)
    qc.h(0)
    qc.measure_all()

    # Transpile to the hardware's native gate set
    pm = generate_preset_pass_manager(backend=backend, optimization_level=1)
    isa_circuit = pm.run(qc)

    # Submit and wait (typically 1–10 minutes in queue)
    sampler = Sampler(mode=backend)
    job = sampler.run([isa_circuit], shots=1)
    print(f"Job ID: {job.job_id()} — waiting...")

    pub_result = job.result()[0]
    counts = pub_result.data.meas.get_counts()
    raw_bit = list(counts.keys())[0]
    return "Heads" if int(raw_bit, 2) == 1 else "Tails"


if __name__ == "__main__":
    side = flip_on_hardware()
    print(f"Quantum hardware landed: {side}")`}
              />
              <Callout type="warning">
                <strong>Hardware wait times:</strong> IBM Quantum hardware jobs typically wait 1–10 minutes
                in a queue. The coin flip circuit is the smallest possible quantum program — 1 qubit,
                1 gate — so it uses a tiny fraction of your free 10-minute daily allowance.
              </Callout>
            </Section>

            {/* Section 9 */}
            <Section id="further-reading" number="09" title="Further reading">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Bell inequality tests", description: "The experimental proof that quantum randomness is ontic, not epistemic", url: "https://en.wikipedia.org/wiki/Bell_test", category: "Theory" },
                  { title: "Born rule — Wikipedia", description: "The quantum mechanical rule that determines measurement probabilities", url: "https://en.wikipedia.org/wiki/Born_rule", category: "Theory" },
                  { title: "Hadamard transform", description: "Full mathematical description of the Hadamard gate", url: "https://en.wikipedia.org/wiki/Hadamard_transform#Quantum_computing_applications", category: "Theory" },
                  { title: "Quantum superposition", description: "What superposition really means — and what it doesn't", url: "https://en.wikipedia.org/wiki/Quantum_superposition", category: "Theory" },
                  { title: "Qiskit Primitives docs", description: "StatevectorSampler, SamplerV2 — official reference", url: "https://docs.quantum.ibm.com/api/qiskit/primitives", category: "Official Docs" },
                  { title: "IBM Quantum Learning — Basics", description: "IBM's free course covering qubits, gates, and measurement", url: "https://learning.quantum.ibm.com/course/basics-of-quantum-information", category: "Course" },
                ].map((r) => (
                  <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer"
                    className="group p-4 rounded-xl border border-white/5 hover:border-purple-700/40 transition-all"
                    style={{ backgroundColor: "var(--bg-card)" }}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-200 group-hover:text-purple-300 transition-colors">{r.title}</span>
                      <svg className="w-3.5 h-3.5 shrink-0 text-slate-500 group-hover:text-purple-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{r.description}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/20 border border-purple-700/20 text-purple-400">{r.category}</span>
                  </a>
                ))}
              </div>

              <div className="mt-10 p-6 rounded-xl border border-purple-700/30 bg-purple-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-200">Ready to flip?</p>
                  <p className="text-sm text-slate-400 mt-0.5">Open the interactive coin and see it in action.</p>
                </div>
                <Link href="/projects/quantum-coin-flip/play"
                  className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm text-white transition-colors"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
                  Flip Quantum Coin →
                </Link>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
