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

const toc = [
  { id: "the-problem", label: "The problem with regular randomness" },
  { id: "binary-and-qubits", label: "Binary numbers & qubits" },
  { id: "the-circuit", label: "The quantum dice circuit" },
  { id: "rejection-sampling", label: "Rejection sampling — keeping the die fair" },
  { id: "superposition-math", label: "Superposition: the math" },
  { id: "step-by-step", label: "Step-by-step code walkthrough" },
  { id: "full-code", label: "Full code" },
  { id: "ibm-hardware", label: "Running on real IBM Quantum hardware" },
  { id: "further-reading", label: "Further reading" },
];

export default function QuantumDiceDocsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-deep)" }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-10">
          <Link href="/" className="hover:text-slate-300 transition-colors">Projects</Link>
          <span>/</span>
          <Link href="/projects/quantum-dice" className="hover:text-slate-300 transition-colors">Quantum Dice</Link>
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
                <Link href="/projects/quantum-dice/play"
                  className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  Play the dice →
                </Link>
                <Link href="/projects/quantum-dice"
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
                Educational Guide · 3 qubits · Beginner
              </div>
              <h1 className="text-4xl font-bold text-slate-100 mb-3">Quantum Dice — Complete Guide</h1>
              <p className="text-lg text-slate-400 leading-relaxed">
                How to roll a truly random die using quantum superposition. We cover everything from scratch —
                what makes a number truly random, how qubits work, and every line of code.
              </p>
            </div>

            {/* Section 1 */}
            <Section id="the-problem" number="01" title="The problem with regular randomness">
              <p className="text-slate-400 leading-relaxed mb-4">
                When your computer rolls a die with <code className="bg-white/10 px-1 rounded text-cyan-300">Math.random()</code>{" "}
                or Python's <code className="bg-white/10 px-1 rounded text-cyan-300">random.randint()</code>, it uses a{" "}
                <strong className="text-slate-300">pseudo-random number generator (PRNG)</strong>. This is a mathematical
                formula that produces numbers that <em>look</em> random but are actually completely predictable.
              </p>
              <Callout type="concept">
                <strong>Analogy:</strong> A PRNG is like a recipe. If you give it the same starting ingredient
                (called the &ldquo;seed&rdquo;), it produces the exact same sequence every time. Given the seed, a mathematician
                could predict every number your computer will ever &ldquo;randomly&rdquo; generate.
              </Callout>
              <p className="text-slate-400 leading-relaxed mb-4">
                Quantum randomness is different at a fundamental level. When a qubit in superposition is measured, the
                outcome is not determined by any hidden formula, seed, or initial condition. According to quantum mechanics,{" "}
                <strong className="text-purple-300">no information in the universe</strong> can predict the result before
                measurement. This is not a technical limitation — it is how physics works.
              </p>
              <p className="text-slate-400 leading-relaxed">
                This property is called <strong className="text-slate-300">quantum indeterminacy</strong>, and it is
                one of the most tested and confirmed facts in all of science. Our dice uses it to generate numbers that
                are certified random by the laws of physics.
              </p>
            </Section>

            {/* Section 2 */}
            <Section id="binary-and-qubits" number="02" title="Binary numbers & qubits">
              <p className="text-slate-400 leading-relaxed mb-4">
                To understand the quantum dice, we need two concepts: binary numbers and qubits.
              </p>

              <h3 className="text-slate-300 font-semibold mb-2">Binary numbers</h3>
              <p className="text-sm text-slate-400 mb-3">
                Computers count in binary (base 2) using only 0s and 1s. With 3 binary digits (bits), you can represent
                8 different numbers:
              </p>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  ["000", "0"], ["001", "1"], ["010", "2"], ["011", "3"],
                  ["100", "4"], ["101", "5"], ["110", "6"], ["111", "7"],
                ].map(([bits, val]) => (
                  <div key={bits} className={`rounded-lg p-2 text-center border ${
                    parseInt(val) <= 5
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-rose-500/20 bg-rose-500/5"
                  }`}>
                    <div className="font-mono text-sm text-slate-300">{bits}</div>
                    <div className={`text-xs mt-0.5 ${parseInt(val) <= 5 ? "text-emerald-400" : "text-rose-400"}`}>
                      {val} {parseInt(val) <= 5 ? "✓" : "✕"}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500 mb-6">
                Green = valid dice face (maps to 1–6). Red = rejected and re-rolled.
              </p>

              <h3 className="text-slate-300 font-semibold mb-2">Qubits</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-3">
                A classical bit is always 0 or 1. A qubit can be 0, 1, or any combination — called a{" "}
                <strong className="text-purple-300">superposition</strong>. We write this as:
              </p>
              <div className="bg-black/30 rounded-lg p-4 border border-white/5 font-mono text-sm text-center mb-4">
                <span className="text-slate-400">|ψ⟩ = α</span>
                <span className="text-purple-300">|0⟩</span>
                <span className="text-slate-400"> + β</span>
                <span className="text-cyan-300">|1⟩</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Where α and β are probability amplitudes (complex numbers). The probability of measuring 0 is |α|² and
                measuring 1 is |β|². A Hadamard gate sets α = β = 1/√2, giving exactly 50% for each — a perfect coin.
              </p>
            </Section>

            {/* Section 3 */}
            <Section id="the-circuit" number="03" title="The quantum dice circuit">
              <p className="text-slate-400 leading-relaxed mb-4">
                Our dice circuit is just 3 lines: apply a Hadamard gate to each qubit, then measure all three.
              </p>
              <div className="font-mono text-sm text-slate-300 leading-loose bg-black/30 rounded-lg p-4 border border-white/5 mb-4">
                <pre>{`     ┌───┐ ┌─┐
q_0: ┤ H ├─┤M├──
     ├───┤ └╥┘┌─┐
q_1: ┤ H ├──╫─┤M├
     ├───┤  ║ └╥┘┌─┐
q_2: ┤ H ├──╫──╫─┤M├
     └───┘  ║  ║ └╥┘
meas: ══════╩══╩══╩═`}</pre>
              </div>
              <p className="text-sm text-slate-500 mb-4">
                H = Hadamard gate · M = measurement · ║ = classical wire carrying the bit result
              </p>
              <Callout type="concept">
                <strong>Why 3 Hadamard gates independently?</strong> Unlike the Bell state (Hello World), we do NOT
                entangle the qubits here. Each qubit is independently superposed. This gives us 3 independent coin
                flips, combining into 8 equally weighted outcomes. No qubit knows what the others measured.
              </Callout>
              <p className="text-slate-400 leading-relaxed mt-4">
                After the three H gates, the joint quantum state is:
              </p>
              <div className="bg-black/30 rounded-lg p-4 border border-white/5 font-mono text-xs text-slate-400 leading-relaxed mt-3">
                <div className="text-slate-300 text-sm mb-2">|ψ⟩ = ⅛(|000⟩ + |001⟩ + |010⟩ + |011⟩ + |100⟩ + |101⟩ + |110⟩ + |111⟩)</div>
                <div className="text-slate-500">All 8 states are present simultaneously with equal amplitude 1/√8</div>
              </div>
            </Section>

            {/* Section 4 */}
            <Section id="rejection-sampling" number="04" title="Rejection sampling — keeping the die fair">
              <p className="text-slate-400 leading-relaxed mb-4">
                3 qubits give 8 outcomes. A standard die has 6 faces. 8 ÷ 6 is not a whole number, so we cannot
                simply map outcomes to faces without bias. The solution is <strong className="text-slate-300">rejection sampling</strong>.
              </p>
              <Callout type="info">
                <strong>What is rejection sampling?</strong> We generate a random number from our 8-outcome distribution.
                If it is in the valid range (0–5), we accept it. If not (6 or 7), we throw it away and try again.
                The result is a perfectly uniform distribution over {"{1, 2, 3, 4, 5, 6}"}.
              </Callout>
              <div className="mt-4 p-4 rounded-xl border border-white/5" style={{ backgroundColor: "var(--bg-card)" }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-white/5">
                      <th className="pb-2 pr-4">Quantum result</th>
                      <th className="pb-2 pr-4">Binary</th>
                      <th className="pb-2 pr-4">Action</th>
                      <th className="pb-2">Die face</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      ["000", "0", "accept", "1"],
                      ["001", "1", "accept", "2"],
                      ["010", "2", "accept", "3"],
                      ["011", "3", "accept", "4"],
                      ["100", "4", "accept", "5"],
                      ["101", "5", "accept", "6"],
                      ["110", "6", "reject", "—"],
                      ["111", "7", "reject", "—"],
                    ].map(([bits, dec, action, face]) => (
                      <tr key={bits} className={action === "reject" ? "text-slate-600" : "text-slate-300"}>
                        <td className="py-1.5 pr-4 font-mono">{bits}</td>
                        <td className="py-1.5 pr-4 font-mono">{dec}</td>
                        <td className={`py-1.5 pr-4 font-medium ${action === "accept" ? "text-emerald-400" : "text-rose-400"}`}>
                          {action}
                        </td>
                        <td className="py-1.5">{face}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-slate-500 mt-3">
                Rejection rate = 2/8 = 25%. Expected trials per roll = 1/(6/8) = 1.33 — usually done in one shot.
              </p>
            </Section>

            {/* Section 5 */}
            <Section id="superposition-math" number="05" title="Superposition: the math (simple version)">
              <p className="text-slate-400 leading-relaxed mb-4">
                You do not need to understand this section to use the dice, but it demystifies what is really happening.
              </p>
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-purple-700/30" style={{ backgroundColor: "var(--bg-card)" }}>
                  <h3 className="font-semibold text-purple-300 mb-2 text-sm">The Hadamard gate as a matrix</h3>
                  <p className="text-sm text-slate-400 mb-3">
                    A quantum gate is a matrix that transforms a qubit&apos;s state. The Hadamard matrix is:
                  </p>
                  <div className="font-mono text-sm bg-black/30 rounded p-3 text-slate-300 text-center">
                    H = (1/√2) × [1  1]<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[1 -1]
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    Applied to |0⟩ = [1, 0]ᵀ: H|0⟩ = (1/√2)[1, 1]ᵀ = (|0⟩ + |1⟩)/√2
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-cyan-700/30" style={{ backgroundColor: "var(--bg-card)" }}>
                  <h3 className="font-semibold text-cyan-300 mb-2 text-sm">The Born rule — how probability emerges</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    A qubit state |ψ⟩ = α|0⟩ + β|1⟩ has measurement probability |α|² for 0 and |β|² for 1.
                    After H, α = β = 1/√2, so |α|² = |β|² = ½. Each outcome has exactly 50% probability.
                    The Born rule is a postulate of quantum mechanics — it is confirmed by millions of experiments but
                    has no deeper derivation. It is simply how nature works.
                  </p>
                </div>
              </div>
            </Section>

            {/* Section 6 */}
            <Section id="step-by-step" number="06" title="Step-by-step code walkthrough">
              <h3 className="text-slate-300 font-semibold mb-2">Import and build the circuit</h3>
              <CodeBlock title="roll.py — circuit"
                code={`from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler

# Create a circuit with 3 qubits
qc = QuantumCircuit(3)

# Apply Hadamard to each qubit — puts each into 50/50 superposition
qc.h(0)  # qubit 0
qc.h(1)  # qubit 1
qc.h(2)  # qubit 2

# Add measurements — this is how we collapse the superposition
qc.measure_all()

print(qc.draw())  # prints the circuit diagram`}
              />
              <Callout type="tip">
                <code>measure_all()</code> adds measurement gates to all qubits AND creates a classical register
                to hold the results. Without measurement, quantum states are not observable.
              </Callout>

              <h3 className="text-slate-300 font-semibold mb-2 mt-6">Run the circuit</h3>
              <CodeBlock title="roll.py — sampling"
                code={`# StatevectorSampler runs the circuit using exact statevector simulation
# No IBM Quantum account needed — runs entirely on your CPU
sampler = StatevectorSampler()

# Run 64 shots: 64 measurements of the same circuit
# Each shot independently collapses the qubits
result = sampler.run([(qc,)], shots=64).result()

# Get the measurement counts: {'000': 8, '001': 9, '010': 7, ...}
counts = result[0].data.meas.get_counts()
print(counts)`}
              />

              <h3 className="text-slate-300 font-semibold mb-2 mt-6">Rejection sampling</h3>
              <CodeBlock title="roll.py — rejection sampling"
                code={`import random

# Filter: keep only results where integer value is 0–5 (die faces 1–6)
valid = [(bits, cnt) for bits, cnt in counts.items() if int(bits, 2) <= 5]

# Weight the pool by quantum measurement counts (preserves quantum statistics)
pool = []
for bits, count in valid:
    pool.extend([bits] * count)

# Pick one from the pool — the die result
chosen_bits = random.choice(pool)
raw_value = int(chosen_bits, 2)  # convert binary string to int (0–5)
face = raw_value + 1              # shift to 1–6

print(f"Quantum bits: {chosen_bits} = {raw_value} → Die face: {face}")`}
              />
            </Section>

            {/* Section 7 */}
            <Section id="full-code" number="07" title="Full code">
              <CodeBlock title="quantum/quantum-dice/roll.py (simplified)"
                code={`"""
Quantum Dice — roll.py
Uses Qiskit StatevectorSampler (local simulation, instant results)
"""
import random
from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler


def roll_quantum_dice() -> int:
    """Roll a fair 6-sided quantum die. Returns 1–6."""
    qc = QuantumCircuit(3)
    qc.h(0)
    qc.h(1)
    qc.h(2)
    qc.measure_all()

    sampler = StatevectorSampler()

    # Rejection sampling loop (usually completes in 1 attempt)
    while True:
        result = sampler.run([(qc,)], shots=64).result()
        counts = result[0].data.meas.get_counts()
        valid = [(bits, cnt) for bits, cnt in counts.items() if int(bits, 2) <= 5]
        if valid:
            pool = [bits for bits, cnt in valid for _ in range(cnt)]
            chosen = random.choice(pool)
            return int(chosen, 2) + 1


if __name__ == "__main__":
    face = roll_quantum_dice()
    print(f"You rolled: {face}")`}
              />
            </Section>

            {/* Section 8 */}
            <Section id="ibm-hardware" number="08" title="Running on real IBM Quantum hardware">
              <p className="text-slate-400 leading-relaxed mb-4">
                The web demo uses a local simulator for instant results. To run on real quantum hardware (IBM&apos;s
                actual quantum processors), use the IBM Quantum service. The circuit is identical — only the
                execution backend changes.
              </p>
              <CodeBlock title="quantum/quantum-dice/main.py"
                code={`"""
Quantum Dice on real IBM Quantum hardware
Uses SamplerV2 primitive with IBM Quantum free tier (10 min/day)
"""
import os
import random
from qiskit import QuantumCircuit
from qiskit.transpiler import generate_preset_pass_manager
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler


def roll_on_hardware() -> int:
    api_key = os.environ.get("IBM_QUANTUM_API_KEY")
    service = QiskitRuntimeService(channel="ibm_quantum", token=api_key)

    # Pick the least busy real backend with ≥ 3 qubits
    backend = service.least_busy(simulator=False, operational=True, min_num_qubits=3)
    print(f"Using backend: {backend.name}")

    qc = QuantumCircuit(3)
    qc.h(0); qc.h(1); qc.h(2)
    qc.measure_all()

    # Transpile for the specific hardware
    pm = generate_preset_pass_manager(backend=backend, optimization_level=1)
    isa_circuit = pm.run(qc)

    # Run with SamplerV2 (returns bit arrays, not counts)
    sampler = Sampler(mode=backend)
    job = sampler.run([isa_circuit], shots=64)
    print(f"Job ID: {job.job_id()} — waiting (1–10 min)...")

    pub_result = job.result()[0]
    # Convert bit arrays to binary strings
    bits_array = pub_result.data.meas.get_bitstrings()
    valid = [b for b in bits_array if int(b, 2) <= 5]

    if not valid:
        return roll_on_hardware()  # re-run if all rejected

    chosen = random.choice(valid)
    return int(chosen, 2) + 1


if __name__ == "__main__":
    face = roll_on_hardware()
    print(f"Quantum hardware rolled: {face}")`}
              />
              <Callout type="warning">
                <strong>Hardware wait times:</strong> IBM Quantum hardware jobs typically wait 1–10 minutes in a
                queue. Your 10-minute daily free tier covers this easily. The dice circuit is tiny — it uses only
                3 qubits for a fraction of a second of actual quantum processor time.
              </Callout>
            </Section>

            {/* Section 9 */}
            <Section id="further-reading" number="09" title="Further reading">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Qiskit Primitives docs", description: "StatevectorSampler, SamplerV2 — full reference", url: "https://docs.quantum.ibm.com/api/qiskit/primitives", category: "Official Docs" },
                  { title: "Born rule — Wikipedia", description: "The quantum mechanical rule that determines measurement probabilities", url: "https://en.wikipedia.org/wiki/Born_rule", category: "Theory" },
                  { title: "QRNG — ANU Quantum Random Numbers", description: "A real quantum random number service used in industry", url: "https://qrng.anu.edu.au", category: "Real-world" },
                  { title: "Quantum indeterminacy", description: "Why quantum outcomes are fundamentally unpredictable", url: "https://en.wikipedia.org/wiki/Quantum_indeterminacy", category: "Theory" },
                  { title: "Hadamard gate", description: "Full mathematical description of the Hadamard transform", url: "https://en.wikipedia.org/wiki/Hadamard_transform#Quantum_computing_applications", category: "Theory" },
                  { title: "IBM Quantum Learning — Basics of Quantum Information", description: "IBM's free course covering qubits, gates, and measurement", url: "https://learning.quantum.ibm.com/course/basics-of-quantum-information", category: "Course" },
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
                  <p className="font-semibold text-slate-200">Ready to roll?</p>
                  <p className="text-sm text-slate-400 mt-0.5">Open the interactive dice and see it in action.</p>
                </div>
                <Link href="/projects/quantum-dice/play"
                  className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm text-white transition-colors"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
                  Play Quantum Dice →
                </Link>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
