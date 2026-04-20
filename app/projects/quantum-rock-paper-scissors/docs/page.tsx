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
  { id: "why-unpredictable", label: "Why the opponent is unpredictable" },
  { id: "the-circuit", label: "The 2-qubit circuit" },
  { id: "rejection-sampling", label: "Rejection sampling for 3 choices" },
  { id: "game-logic", label: "Classical game logic" },
  { id: "step-by-step", label: "Step-by-step code walkthrough" },
  { id: "full-code", label: "Full code" },
  { id: "ibm-hardware", label: "Running on real IBM Quantum hardware" },
  { id: "further-reading", label: "Further reading" },
];

export default function QuantumRPSDocsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-deep)" }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-10">
          <Link href="/" className="hover:text-slate-300 transition-colors">Projects</Link>
          <span>/</span>
          <Link href="/projects/quantum-rock-paper-scissors" className="hover:text-slate-300 transition-colors">Quantum Rock Paper Scissors</Link>
          <span>/</span>
          <span className="text-slate-300">Guide</span>
        </nav>

        <div className="flex gap-12">
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
                <Link href="/projects/quantum-rock-paper-scissors/play"
                  className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  Play now →
                </Link>
                <Link href="/projects/quantum-rock-paper-scissors"
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                  ← Back to project
                </Link>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Educational Guide · 2 qubits · Beginner
              </div>
              <h1 className="text-4xl font-bold text-slate-100 mb-3">Quantum Rock Paper Scissors — Complete Guide</h1>
              <p className="text-lg text-slate-400 leading-relaxed">
                How to build a quantum opponent whose choices are physically impossible to predict.
                We cover 2-qubit superposition, rejection sampling for non-power-of-2 outcomes,
                and why this is genuinely different from a random number generator.
              </p>
            </div>

            <Section id="why-unpredictable" number="01" title="Why the opponent is unpredictable">
              <p className="text-slate-400 leading-relaxed mb-4">
                In classical Rock Paper Scissors, a fair opponent uses a random number generator. That generator
                has a seed. If you knew the seed, you could predict every future move. Even hardware RNGs based
                on thermal noise are only unpredictable due to practical measurement limits —
                in principle, they are deterministic.
              </p>
              <Callout type="concept">
                <strong>The quantum difference:</strong> A qubit in superposition has no hidden variable that
                determines the measurement outcome. Bell test experiments have proven beyond doubt that no
                &ldquo;pre-existing answer&rdquo; exists. The choice does not exist until the moment of measurement —
                not just unknown to you, but nonexistent in the universe.
              </Callout>
              <p className="text-slate-400 leading-relaxed">
                This means the quantum opponent cannot cheat, cannot be predicted by any means, and cannot
                have a strategy — even in principle. The randomness is ontic (real) not epistemic (ignorance-based).
              </p>
            </Section>

            <Section id="the-circuit" number="02" title="The 2-qubit circuit">
              <p className="text-slate-400 leading-relaxed mb-4">
                Two independent Hadamard gates create four equally probable outcomes.
              </p>
              <div className="font-mono text-sm text-slate-300 leading-loose bg-black/30 rounded-lg p-4 border border-white/5 mb-4">
                <pre>{`     ┌───┐ ┌─┐
q_0: ┤ H ├─┤M├─
     ├───┤ └╥┘┌─┐
q_1: ┤ H ├──╫─┤M├
     └───┘  ║ └╥┘
meas: ══════╩══╩═`}</pre>
              </div>
              <p className="text-slate-400 leading-relaxed mb-4">
                After the H gates, the joint quantum state is:
              </p>
              <div className="bg-black/30 rounded-lg p-4 border border-white/5 font-mono text-sm text-slate-300 mb-4">
                |ψ⟩ = ½(|00⟩ + |01⟩ + |10⟩ + |11⟩)
              </div>
              <p className="text-sm text-slate-400">
                All four 2-bit strings are present simultaneously with amplitude ½ each
                (probability ¼ = 25% each).
              </p>
              <Callout type="info">
                <strong>No entanglement needed here.</strong> The two qubits are independently superposed.
                Entanglement would correlate their outcomes — useful in other quantum protocols, but not
                needed for this application. Each qubit is its own independent coin flip.
              </Callout>
            </Section>

            <Section id="rejection-sampling" number="03" title="Rejection sampling for 3 choices">
              <p className="text-slate-400 leading-relaxed mb-4">
                2 qubits give 4 outcomes. We need 3 choices. 4 ÷ 3 is not a whole number, so a direct
                mapping would bias the results. We use the same rejection sampling technique as Quantum Dice.
              </p>
              <div className="mt-4 p-4 rounded-xl border border-white/5" style={{ backgroundColor: "var(--bg-card)" }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-white/5">
                      <th className="pb-2 pr-4">Quantum result</th>
                      <th className="pb-2 pr-4">Value</th>
                      <th className="pb-2 pr-4">Action</th>
                      <th className="pb-2">Choice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      ["00", "0", "accept", "Rock ✊"],
                      ["01", "1", "accept", "Paper 🖐"],
                      ["10", "2", "accept", "Scissors ✌️"],
                      ["11", "3", "reject", "Re-roll"],
                    ].map(([bits, val, action, choice]) => (
                      <tr key={bits} className={action === "reject" ? "text-slate-600" : "text-slate-300"}>
                        <td className="py-1.5 pr-4 font-mono">{bits}</td>
                        <td className="py-1.5 pr-4 font-mono">{val}</td>
                        <td className={`py-1.5 pr-4 font-medium ${action === "accept" ? "text-emerald-400" : "text-rose-400"}`}>
                          {action}
                        </td>
                        <td className="py-1.5">{choice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-slate-500 mt-3">
                Rejection rate = 1/4 = 25%. Expected trials per game = 1/(3/4) = 1.33 — usually done in one shot.
                Each valid choice has exactly 1/3 probability.
              </p>
            </Section>

            <Section id="game-logic" number="04" title="Classical game logic">
              <p className="text-slate-400 leading-relaxed mb-4">
                Once the opponent&apos;s quantum choice is determined, the win/lose/draw result is computed classically.
                Quantum mechanics provides the randomness; classical code provides the game rules.
              </p>
              <CodeBlock title="play.py — game result"
                code={`def game_result(opponent: str, player: str) -> str:
    """Returns 'win', 'lose', or 'draw' from the player's perspective."""
    if opponent == player:
        return "draw"
    # These pairs mean the player wins
    wins = {("rock", "scissors"), ("scissors", "paper"), ("paper", "rock")}
    return "win" if (player, opponent) in wins else "lose"`}
              />
              <p className="text-slate-400 leading-relaxed">
                The player passes their choice as a command-line argument (or via the web UI). The script
                generates the opponent&apos;s quantum choice, then evaluates the result.
              </p>
            </Section>

            <Section id="step-by-step" number="05" title="Step-by-step code walkthrough">
              <CodeBlock title="play.py — circuit and execution"
                code={`from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler
import random

CHOICES = {0: "rock", 1: "paper", 2: "scissors"}

# Build the 2-qubit circuit
qc = QuantumCircuit(2)
qc.h(0)
qc.h(1)
qc.measure_all()

sampler = StatevectorSampler()

# Rejection sampling loop
chosen_bits = None
while chosen_bits is None:
    result = sampler.run([(qc,)], shots=16).result()
    counts = result[0].data.meas.get_counts()

    # Keep only 00, 01, 10 (values 0–2)
    valid = [(bits, cnt) for bits, cnt in counts.items() if int(bits, 2) <= 2]
    if valid:
        pool = [bits for bits, cnt in valid for _ in range(cnt)]
        chosen_bits = random.choice(pool)

raw_value = int(chosen_bits, 2)
opponent_choice = CHOICES[raw_value]`}
              />
            </Section>

            <Section id="full-code" number="06" title="Full code">
              <CodeBlock title="quantum/quantum-rock-paper-scissors/play.py (simplified)"
                code={`"""
Quantum Rock Paper Scissors — play.py
2 qubits → 4 outcomes → 3 choices (rejection sampling on 11).
"""
import random
import sys
from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler

CHOICES = {0: "rock", 1: "paper", 2: "scissors"}


def game_result(opponent: str, player: str) -> str:
    if opponent == player:
        return "draw"
    wins = {("rock", "scissors"), ("scissors", "paper"), ("paper", "rock")}
    return "win" if (player, opponent) in wins else "lose"


def quantum_rps(player_choice: str) -> dict:
    qc = QuantumCircuit(2)
    qc.h(0)
    qc.h(1)
    qc.measure_all()

    sampler = StatevectorSampler()
    chosen_bits = None

    while chosen_bits is None:
        result = sampler.run([(qc,)], shots=16).result()
        counts = result[0].data.meas.get_counts()
        valid = [(b, c) for b, c in counts.items() if int(b, 2) <= 2]
        if valid:
            pool = [b for b, c in valid for _ in range(c)]
            chosen_bits = random.choice(pool)

    opponent_choice = CHOICES[int(chosen_bits, 2)]
    return {
        "player": player_choice,
        "opponent": opponent_choice,
        "result": game_result(opponent_choice, player_choice),
    }


if __name__ == "__main__":
    choice = sys.argv[1] if len(sys.argv) > 1 else "rock"
    outcome = quantum_rps(choice)
    print(f"You: {outcome['player']} | Opponent: {outcome['opponent']} | {outcome['result'].upper()}")`}
              />
            </Section>

            <Section id="ibm-hardware" number="07" title="Running on real IBM Quantum hardware">
              <p className="text-slate-400 leading-relaxed mb-4">
                The 2-qubit circuit is tiny and runs quickly on any IBM processor. The only change
                from the local simulator version is the execution backend.
              </p>
              <Callout type="warning">
                <strong>Hardware wait times:</strong> IBM Quantum jobs typically wait 1–10 minutes in queue.
                We run 16 shots to ensure rejection sampling completes in a single job, minimizing wait time.
              </Callout>
              <CodeBlock title="quantum/quantum-rock-paper-scissors/play_ibm.py (key difference)"
                code={`from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler
from qiskit.transpiler import generate_preset_pass_manager

service = QiskitRuntimeService(channel="ibm_quantum_platform", token=api_key)
backend = service.least_busy(simulator=False, operational=True, min_num_qubits=2)

# Transpile to hardware's native gate set
pm = generate_preset_pass_manager(backend=backend, optimization_level=1)
isa_circuit = pm.run(qc)

# Run 16 shots — ensures we get at least one valid (non-rejected) result
sampler = Sampler(mode=backend)
job = sampler.run([isa_circuit], shots=16)
result = job.result()[0]
counts = result.data.meas.get_counts()`}
              />
            </Section>

            <Section id="further-reading" number="08" title="Further reading">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Bell test experiments", description: "The proof that quantum randomness has no hidden variables", url: "https://en.wikipedia.org/wiki/Bell_test", category: "Theory" },
                  { title: "Quantum indeterminacy", description: "Why quantum outcomes are unknowable before measurement", url: "https://en.wikipedia.org/wiki/Quantum_indeterminacy", category: "Theory" },
                  { title: "Rejection sampling", description: "The classical technique for generating uniform distributions", url: "https://en.wikipedia.org/wiki/Rejection_sampling", category: "Algorithm" },
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
                  <p className="font-semibold text-slate-200">Ready to play?</p>
                  <p className="text-sm text-slate-400 mt-0.5">Challenge an opponent you can never outpredict.</p>
                </div>
                <Link href="/projects/quantum-rock-paper-scissors/play"
                  className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm text-white"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
                  Play Now →
                </Link>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
