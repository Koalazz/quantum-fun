import Link from "next/link";
import { getProjectBySlug, difficultyColors } from "@/data/projects";

export default function QuantumRPSPage() {
  const project = getProjectBySlug("quantum-rock-paper-scissors")!;

  return (
    <div className="grid-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-slate-300 transition-colors">Projects</Link>
          <span>/</span>
          <span className="text-slate-300">{project.title}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs text-purple-500/60">
                #{String(project.order).padStart(2, "0")}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${difficultyColors[project.difficulty]}`}>
                Beginner
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full border border-emerald-400/30 text-emerald-400 bg-emerald-400/10">
                Interactive
              </span>
            </div>
            <h1 className="text-4xl font-bold text-slate-100 mb-3">{project.title}</h1>
            <p className="text-lg text-purple-300/80 mb-3">{project.tagline}</p>
            <p className="text-slate-400 leading-relaxed max-w-2xl">{project.description}</p>
          </div>

          <div className="flex flex-col gap-3 min-w-[200px]">
            <Link
              href="/projects/quantum-rock-paper-scissors/play"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all text-white"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                boxShadow: "0 0 20px rgba(124,58,237,0.3)",
              }}
            >
              <span className="text-base">✊</span>
              Play Now
            </Link>
            <Link
              href="/projects/quantum-rock-paper-scissors/docs"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-purple-700/40 hover:border-purple-500/60 text-slate-300 hover:text-slate-100 font-medium text-sm transition-colors"
            >
              Read the Guide
            </Link>
          </div>
        </div>

        {/* Concepts */}
        <div className="flex flex-wrap gap-2 mb-10">
          {project.concepts.map((c) => (
            <span key={c} className="text-xs px-3 py-1 rounded-full bg-purple-900/20 border border-purple-700/30 text-purple-300">
              {c}
            </span>
          ))}
        </div>

        {/* How it works */}
        <div className="rounded-xl border border-purple-700/30 p-6 mb-6" style={{ backgroundColor: "var(--bg-card)" }}>
          <h2 className="text-lg font-semibold text-slate-200 mb-5">How the quantum opponent works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Your move",
                color: "cyan",
                desc: "You pick Rock, Paper, or Scissors. Your choice is classical — made freely, ahead of time.",
              },
              {
                step: "2",
                title: "Quantum opponent",
                color: "purple",
                desc: "2 qubits in superposition produce 4 outcomes. Outcome 11 is rejected, leaving Rock, Paper, and Scissors with equal 1/3 probability.",
              },
              {
                step: "3",
                title: "Result",
                color: "emerald",
                desc: "The opponent's choice collapses from superposition upon measurement. The result is provably unpredictable — not just hard to guess.",
              },
            ].map(({ step, title, color, desc }) => (
              <div key={step}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mb-3 bg-${color}-500/15 border border-${color}-500/30 text-${color}-300`}>
                  {step}
                </div>
                <h3 className="font-semibold text-slate-200 mb-1">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Circuit + mapping */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="rounded-xl border border-purple-700/30 p-6" style={{ backgroundColor: "var(--bg-card)" }}>
            <h2 className="text-lg font-semibold text-slate-200 mb-4">Quantum Circuit</h2>
            <pre className="font-mono text-sm text-slate-300 bg-black/30 rounded-lg p-4 leading-loose overflow-x-auto">{`     ┌───┐ ┌─┐
q_0: ┤ H ├─┤M├─
     ├───┤ └╥┘┌─┐
q_1: ┤ H ├──╫─┤M├
     └───┘  ║ └╥┘
meas: ══════╩══╩═`}</pre>
            <p className="text-xs text-slate-500 mt-3">
              H = Hadamard gate · M = measurement
            </p>
          </div>

          <div className="rounded-xl border border-purple-700/30 p-6" style={{ backgroundColor: "var(--bg-card)" }}>
            <h2 className="text-lg font-semibold text-slate-200 mb-4">Outcome mapping</h2>
            <div className="space-y-2">
              {[
                { bits: "00", val: 0, choice: "Rock ✊", keep: true },
                { bits: "01", val: 1, choice: "Paper 🖐", keep: true },
                { bits: "10", val: 2, choice: "Scissors ✌️", keep: true },
                { bits: "11", val: 3, choice: "Rejected — re-roll", keep: false },
              ].map(({ bits, val, choice, keep }) => (
                <div key={bits} className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-sm ${
                  keep ? "border-purple-500/20 bg-purple-500/5 text-slate-300" : "border-white/5 text-slate-600"
                }`}>
                  <span className="font-mono w-6">{bits}</span>
                  <span className="text-slate-500 text-xs">({val})</span>
                  <span className="flex-1">{choice}</span>
                  {keep
                    ? <span className="text-emerald-400 text-xs">1/3</span>
                    : <span className="text-rose-400 text-xs">✕</span>}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Rejection sampling ensures each valid choice has exactly 1/3 probability.
            </p>
          </div>
        </div>

        {/* Why quantum opponent is unbeatable */}
        <div className="rounded-xl border border-cyan-700/30 p-6 mb-6" style={{ backgroundColor: "var(--bg-card)" }}>
          <h2 className="text-lg font-semibold text-slate-200 mb-3">Why you cannot outplay this opponent</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-2">A human opponent</h3>
              <ul className="space-y-1 text-sm text-slate-400">
                <li className="flex gap-2"><span className="text-rose-400 shrink-0">✕</span>Has psychological patterns you can read</li>
                <li className="flex gap-2"><span className="text-rose-400 shrink-0">✕</span>May follow strategies that become predictable</li>
                <li className="flex gap-2"><span className="text-rose-400 shrink-0">✕</span>Choice exists before you reveal yours</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-2">This quantum opponent</h3>
              <ul className="space-y-1 text-sm text-slate-400">
                <li className="flex gap-2"><span className="text-emerald-400 shrink-0">✓</span>No psychology — pure quantum randomness</li>
                <li className="flex gap-2"><span className="text-emerald-400 shrink-0">✓</span>No strategy — the universe decides</li>
                <li className="flex gap-2"><span className="text-emerald-400 shrink-0">✓</span>Choice does not exist until measurement</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick start */}
        <div className="rounded-xl border border-purple-700/30 p-6" style={{ backgroundColor: "var(--bg-card)" }}>
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Run the Python script directly</h2>
          <pre className="text-sm text-emerald-300 p-3 rounded-lg bg-black/40 border border-white/5 overflow-x-auto mb-3">
            <code>{`cd quantum/quantum-rock-paper-scissors
.venv/bin/python play.py rock   # or paper / scissors`}</code>
          </pre>
          <p className="text-xs text-slate-500">
            Pass your choice as a command-line argument. For real IBM Quantum hardware, see{" "}
            <code className="text-purple-400">play_ibm.py</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
