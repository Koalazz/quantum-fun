import Link from "next/link";
import { getProjectBySlug, difficultyColors } from "@/data/projects";

export default function QuantumMagic8BallPage() {
  const project = getProjectBySlug("quantum-magic-8-ball")!;

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
              href="/projects/quantum-magic-8-ball/play"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all text-white"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                boxShadow: "0 0 20px rgba(124,58,237,0.3)",
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round" />
                <circle cx="12" cy="17" r="0.5" fill="currentColor" />
              </svg>
              Ask the Oracle
            </Link>
            <Link
              href="/projects/quantum-magic-8-ball/docs"
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
          <h2 className="text-lg font-semibold text-slate-200 mb-5">How the quantum oracle works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Superposition",
                color: "purple",
                desc: "Three Hadamard gates create 2³ = 8 equally probable outcomes (000–111). All 8 answers exist simultaneously in the quantum state.",
              },
              {
                step: "2",
                title: "Measurement",
                color: "cyan",
                desc: "Measuring collapses all 8 possibilities to one definite 3-bit string. The outcome is physically random — no algorithm, no bias.",
              },
              {
                step: "3",
                title: "Mapping",
                color: "emerald",
                desc: "The 3-bit binary result (000–111) maps directly to one of 8 answers. 8 outcomes fit 8 answers perfectly — no rejection needed.",
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

        {/* Circuit diagram */}
        <div className="rounded-xl border border-purple-700/30 p-6 mb-6" style={{ backgroundColor: "var(--bg-card)" }}>
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Quantum Circuit</h2>
          <pre className="font-mono text-sm text-slate-300 bg-black/30 rounded-lg p-4 leading-loose overflow-x-auto">{`     ┌───┐ ┌─┐
q_0: ┤ H ├─┤M├──
     ├───┤ └╥┘┌─┐
q_1: ┤ H ├──╫─┤M├
     ├───┤  ║ └╥┘┌─┐
q_2: ┤ H ├──╫──╫─┤M├
     └───┘  ║  ║ └╥┘
meas: ══════╩══╩══╩═`}</pre>
          <p className="text-xs text-slate-500 mt-3">
            Identical to the Quantum Dice circuit — but all 8 outcomes are valid, so no rejection sampling is needed.
          </p>
        </div>

        {/* Answer mapping */}
        <div className="rounded-xl border border-purple-700/30 p-6 mb-6" style={{ backgroundColor: "var(--bg-card)" }}>
          <h2 className="text-lg font-semibold text-slate-200 mb-4">The 8 quantum answers</h2>
          <div className="grid md:grid-cols-2 gap-2">
            {[
              { bits: "000", n: 0, answer: "It is certain", tone: "positive" },
              { bits: "001", n: 1, answer: "Without a doubt", tone: "positive" },
              { bits: "010", n: 2, answer: "Yes, definitely", tone: "positive" },
              { bits: "011", n: 3, answer: "Most likely", tone: "positive" },
              { bits: "100", n: 4, answer: "Reply hazy, try again", tone: "neutral" },
              { bits: "101", n: 5, answer: "Ask again later", tone: "neutral" },
              { bits: "110", n: 6, answer: "Don't count on it", tone: "negative" },
              { bits: "111", n: 7, answer: "Very doubtful", tone: "negative" },
            ].map(({ bits, n, answer, tone }) => (
              <div key={bits} className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
                tone === "positive" ? "border-emerald-500/20 bg-emerald-500/5" :
                tone === "negative" ? "border-rose-500/20 bg-rose-500/5" :
                "border-white/5 bg-white/3"
              }`}>
                <span className="font-mono text-xs text-slate-500 shrink-0 w-10">{bits}</span>
                <span className="text-slate-500 text-xs shrink-0">({n})</span>
                <span className={`text-sm font-medium ${
                  tone === "positive" ? "text-emerald-300" :
                  tone === "negative" ? "text-rose-300" :
                  "text-slate-400"
                }`}>{answer}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4">
            4 positive · 2 neutral · 2 negative — each with exactly 12.5% probability.
          </p>
        </div>

        {/* Quick start */}
        <div className="rounded-xl border border-purple-700/30 p-6" style={{ backgroundColor: "var(--bg-card)" }}>
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Run the Python script directly</h2>
          <pre className="text-sm text-emerald-300 p-3 rounded-lg bg-black/40 border border-white/5 overflow-x-auto mb-3">
            <code>{`cd quantum/quantum-magic-8-ball
.venv/bin/python ask.py`}</code>
          </pre>
          <p className="text-xs text-slate-500">
            Uses Qiskit&apos;s local StatevectorSampler. For real IBM Quantum hardware, see{" "}
            <code className="text-purple-400">ask_ibm.py</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
