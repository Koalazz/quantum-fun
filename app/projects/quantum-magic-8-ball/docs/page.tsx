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
  { id: "classical-mapping", label: "Classical mapping with quantum randomness" },
  { id: "why-8-fits", label: "Why 8 outcomes fit 8 answers perfectly" },
  { id: "the-circuit", label: "The circuit (same as Quantum Dice)" },
  { id: "no-rejection", label: "No rejection sampling needed" },
  { id: "answer-distribution", label: "Answer distribution and fairness" },
  { id: "step-by-step", label: "Step-by-step code walkthrough" },
  { id: "full-code", label: "Full code" },
  { id: "ibm-hardware", label: "Running on real IBM Quantum hardware" },
  { id: "further-reading", label: "Further reading" },
];

const ANSWERS = [
  { bits: "000", n: 0, text: "It is certain", tone: "positive" },
  { bits: "001", n: 1, text: "Without a doubt", tone: "positive" },
  { bits: "010", n: 2, text: "Yes, definitely", tone: "positive" },
  { bits: "011", n: 3, text: "Most likely", tone: "positive" },
  { bits: "100", n: 4, text: "Reply hazy, try again", tone: "neutral" },
  { bits: "101", n: 5, text: "Ask again later", tone: "neutral" },
  { bits: "110", n: 6, text: "Don't count on it", tone: "negative" },
  { bits: "111", n: 7, text: "Very doubtful", tone: "negative" },
];

export default function QuantumMagic8BallDocsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-deep)" }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-10">
          <Link href="/" className="hover:text-slate-300 transition-colors">Projects</Link>
          <span>/</span>
          <Link href="/projects/quantum-magic-8-ball" className="hover:text-slate-300 transition-colors">Quantum Magic 8-Ball</Link>
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
                <Link href="/projects/quantum-magic-8-ball/play"
                  className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  Ask the oracle →
                </Link>
                <Link href="/projects/quantum-magic-8-ball"
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
              <h1 className="text-4xl font-bold text-slate-100 mb-3">Quantum Magic 8-Ball — Complete Guide</h1>
              <p className="text-lg text-slate-400 leading-relaxed">
                How a 3-qubit quantum circuit produces provably random answers. We explore why 8 outcomes
                fit 8 answers perfectly — and what makes this fundamentally different from
                a classical random answer generator.
              </p>
            </div>

            {/* Section 1 */}
            <Section id="classical-mapping" number="01" title="Classical mapping with quantum randomness">
              <p className="text-slate-400 leading-relaxed mb-4">
                The Magic 8-Ball teaches a pattern you will see throughout quantum computing:
                use <strong className="text-slate-300">quantum randomness to make decisions</strong>, then
                apply a <strong className="text-slate-300">classical mapping</strong> to produce a meaningful result.
              </p>
              <p className="text-slate-400 leading-relaxed mb-4">
                Quantum hardware produces bits — 0s and 1s. The interesting part is not the hardware itself,
                but what you do with those bits. Here, we simply index into a list of answers. The quantum
                step guarantees the index is truly random; the classical step turns that index into something human-readable.
              </p>
              <Callout type="concept">
                <strong>This pattern is everywhere.</strong> QRNG (quantum random number generators) used in
                cryptography, secure key generation, and simulations all follow the same idea: let quantum
                physics generate the entropy, then use classical code to apply it.
              </Callout>
            </Section>

            {/* Section 2 */}
            <Section id="why-8-fits" number="02" title="Why 8 outcomes fit 8 answers perfectly">
              <p className="text-slate-400 leading-relaxed mb-4">
                With 3 qubits in superposition, we get 2³ = 8 equally probable outcomes: 000, 001, 010, 011,
                100, 101, 110, 111. The Magic 8-Ball has exactly 8 answers. This is a perfect fit —
                no rejection sampling needed.
              </p>
              <div className="mt-4 p-4 rounded-xl border border-white/5" style={{ backgroundColor: "var(--bg-card)" }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-white/5">
                      <th className="pb-2 pr-4">Binary</th>
                      <th className="pb-2 pr-4">Decimal</th>
                      <th className="pb-2 pr-4">Answer</th>
                      <th className="pb-2">Tone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {ANSWERS.map(({ bits, n, text, tone }) => (
                      <tr key={bits}>
                        <td className="py-1.5 pr-4 font-mono text-slate-300">{bits}</td>
                        <td className="py-1.5 pr-4 font-mono text-slate-400">{n}</td>
                        <td className={`py-1.5 pr-4 ${
                          tone === "positive" ? "text-emerald-300" :
                          tone === "negative" ? "text-rose-300" : "text-amber-300"
                        }`}>{text}</td>
                        <td className={`py-1.5 text-xs capitalize ${
                          tone === "positive" ? "text-emerald-400" :
                          tone === "negative" ? "text-rose-400" : "text-amber-400"
                        }`}>{tone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-slate-500 mt-3">
                4 positive · 2 neutral · 2 negative. Each answer has exactly 12.5% probability.
              </p>
            </Section>

            {/* Section 3 */}
            <Section id="the-circuit" number="03" title="The circuit (same as Quantum Dice)">
              <p className="text-slate-400 leading-relaxed mb-4">
                The quantum circuit is identical to Quantum Dice — three independent Hadamard gates, one per qubit, followed by measurement.
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
              <Callout type="info">
                <strong>Same circuit, different mapping.</strong> The quantum hardware does exactly the same work as
                Quantum Dice. The difference is entirely in the classical post-processing: instead of mapping
                0–5 to die faces, we map 0–7 to Magic 8-Ball answers.
              </Callout>
            </Section>

            {/* Section 4 */}
            <Section id="no-rejection" number="04" title="No rejection sampling needed">
              <p className="text-slate-400 leading-relaxed mb-4">
                Quantum Dice needed rejection sampling because 8 outcomes do not divide evenly into 6 faces.
                The Magic 8-Ball avoids this entirely because 8 = 2³ — it is a power of 2, so 3 qubits
                produce exactly 8 outcomes with no leftovers.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5">
                  <h3 className="text-sm font-semibold text-rose-300 mb-2">Quantum Dice</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    8 outcomes → 6 faces. Need to reject 2 (outcomes 6 and 7). Expected rejection rate: 25%.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                  <h3 className="text-sm font-semibold text-emerald-300 mb-2">Magic 8-Ball</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    8 outcomes → 8 answers. Perfect fit. No rejection. Every measurement gives a valid answer.
                  </p>
                </div>
              </div>
              <Callout type="tip">
                <strong>Design principle:</strong> When choosing how many options to support, powers of 2 (2, 4, 8, 16…)
                work perfectly with n-qubit circuits and need no rejection sampling. Any other count requires rejection
                sampling or more sophisticated encoding.
              </Callout>
            </Section>

            {/* Section 5 */}
            <Section id="answer-distribution" number="05" title="Answer distribution and fairness">
              <p className="text-slate-400 leading-relaxed mb-4">
                Since each of the 8 binary outcomes has probability 1/8 = 12.5%, and each maps to exactly
                one answer, each answer also has probability 12.5%. The distribution is perfectly uniform.
              </p>
              <div className="space-y-2 mt-4">
                {[
                  { label: "Positive (4 answers)", pct: 50, color: "bg-emerald-500" },
                  { label: "Neutral (2 answers)", pct: 25, color: "bg-amber-500" },
                  { label: "Negative (2 answers)", pct: 25, color: "bg-rose-500" },
                ].map(({ label, pct, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-36 shrink-0">{label}</span>
                    <div className="flex-1 h-2 rounded-full bg-white/5">
                      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%`, opacity: 0.7 }} />
                    </div>
                    <span className="text-xs text-slate-500 w-8 text-right">{pct}%</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500 mt-4">
                The distribution is 50% positive, 25% neutral, 25% negative — an intentional design choice
                matching the original Mattel Magic 8-Ball toy.
              </p>
            </Section>

            {/* Section 6 */}
            <Section id="step-by-step" number="06" title="Step-by-step code walkthrough">
              <CodeBlock title="ask.py — circuit and execution"
                code={`from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler

ANSWERS = [
    "It is certain",      # 000 = 0
    "Without a doubt",    # 001 = 1
    "Yes, definitely",    # 010 = 2
    "Most likely",        # 011 = 3
    "Reply hazy, try again",  # 100 = 4
    "Ask again later",    # 101 = 5
    "Don't count on it",  # 110 = 6
    "Very doubtful",      # 111 = 7
]

# Build the circuit: 3 independent Hadamard gates
qc = QuantumCircuit(3)
qc.h(0)
qc.h(1)
qc.h(2)
qc.measure_all()

# Run once — one question, one answer
sampler = StatevectorSampler()
result = sampler.run([(qc,)], shots=1).result()
counts = result[0].data.meas.get_counts()`}
              />
              <CodeBlock title="ask.py — result extraction"
                code={`# Get the single measurement result
raw_bits = list(counts.keys())[0]   # e.g. '011'
raw_value = int(raw_bits, 2)         # binary string → integer (0–7)

# Direct lookup — no rejection sampling needed
answer = ANSWERS[raw_value]
print(f"The oracle says: {answer}")`}
              />
            </Section>

            {/* Section 7 */}
            <Section id="full-code" number="07" title="Full code">
              <CodeBlock title="quantum/quantum-magic-8-ball/ask.py (simplified)"
                code={`"""
Quantum Magic 8-Ball — ask.py
3 qubits → 8 outcomes → 8 answers. No rejection sampling.
"""
from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler

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


def ask_quantum_oracle() -> str:
    """Ask the quantum oracle. Returns one of 8 answers."""
    qc = QuantumCircuit(3)
    qc.h(0)
    qc.h(1)
    qc.h(2)
    qc.measure_all()

    sampler = StatevectorSampler()
    result = sampler.run([(qc,)], shots=1).result()
    counts = result[0].data.meas.get_counts()

    raw_bits = list(counts.keys())[0]
    return ANSWERS[int(raw_bits, 2)]


if __name__ == "__main__":
    answer = ask_quantum_oracle()
    print(f"The oracle says: {answer}")`}
              />
            </Section>

            {/* Section 8 */}
            <Section id="ibm-hardware" number="08" title="Running on real IBM Quantum hardware">
              <p className="text-slate-400 leading-relaxed mb-4">
                The circuit is tiny — 3 qubits, 3 gates — so it runs fast on real hardware and uses a
                negligible fraction of your free IBM Quantum time.
              </p>
              <CodeBlock title="quantum/quantum-magic-8-ball/ask_ibm.py (simplified)"
                code={`"""
Quantum Magic 8-Ball on real IBM Quantum hardware
"""
import os
from qiskit import QuantumCircuit
from qiskit.transpiler import generate_preset_pass_manager
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler

ANSWERS = [
    "It is certain", "Without a doubt", "Yes, definitely", "Most likely",
    "Reply hazy, try again", "Ask again later", "Don't count on it", "Very doubtful",
]


def ask_on_hardware() -> str:
    api_key = os.environ.get("IBM_QUANTUM_API_KEY")
    service = QiskitRuntimeService(channel="ibm_quantum_platform", token=api_key)
    backend = service.least_busy(simulator=False, operational=True, min_num_qubits=3)

    qc = QuantumCircuit(3)
    qc.h(0); qc.h(1); qc.h(2)
    qc.measure_all()

    pm = generate_preset_pass_manager(backend=backend, optimization_level=1)
    isa_circuit = pm.run(qc)

    sampler = Sampler(mode=backend)
    job = sampler.run([isa_circuit], shots=1)
    print(f"Job submitted: {job.job_id()} — waiting...")

    pub_result = job.result()[0]
    counts = pub_result.data.meas.get_counts()
    raw_bits = list(counts.keys())[0]
    return ANSWERS[int(raw_bits, 2)]


if __name__ == "__main__":
    answer = ask_on_hardware()
    print(f"The oracle says: {answer}")`}
              />
              <Callout type="warning">
                <strong>Hardware wait times:</strong> Expect 1–10 minutes in the IBM Quantum queue. The 3-qubit
                circuit completes in milliseconds once it reaches the front.
              </Callout>
            </Section>

            {/* Section 9 */}
            <Section id="further-reading" number="09" title="Further reading">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Quantum random number generation", description: "How QRNG is used in real-world cryptographic applications", url: "https://en.wikipedia.org/wiki/Hardware_random_number_generator#Quantum_random_number_generators", category: "Theory" },
                  { title: "Born rule", description: "The rule that gives quantum measurement its probabilities", url: "https://en.wikipedia.org/wiki/Born_rule", category: "Theory" },
                  { title: "Qiskit Primitives", description: "StatevectorSampler and SamplerV2 — official reference", url: "https://docs.quantum.ibm.com/api/qiskit/primitives", category: "Official Docs" },
                  { title: "IBM Quantum Learning — Basics", description: "IBM's free course on qubits, gates, and measurement", url: "https://learning.quantum.ibm.com/course/basics-of-quantum-information", category: "Course" },
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
                  <p className="font-semibold text-slate-200">Ready to ask the oracle?</p>
                  <p className="text-sm text-slate-400 mt-0.5">Let quantum mechanics answer your question.</p>
                </div>
                <Link href="/projects/quantum-magic-8-ball/play"
                  className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm text-white"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
                  Ask the Oracle →
                </Link>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
