import Link from "next/link";
import { getProjectBySlug, difficultyColors } from "@/data/projects";

export default function QuantumDicePage() {
  const project = getProjectBySlug("quantum-dice")!;

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
              href="/projects/quantum-dice/play"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all text-white"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                boxShadow: "0 0 20px rgba(124,58,237,0.3)",
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="3" />
                <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                <circle cx="16" cy="16" r="1.5" fill="currentColor" />
              </svg>
              Roll the Dice
            </Link>
            <Link
              href="/projects/quantum-dice/docs"
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
          <h2 className="text-lg font-semibold text-slate-200 mb-5">How the quantum dice works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Superposition",
                color: "purple",
                desc: "3 Hadamard gates put each qubit into a perfect 50/50 state — creating 8 equally probable outcomes (000 through 111) simultaneously.",
              },
              {
                step: "2",
                title: "Measurement",
                color: "cyan",
                desc: "Measuring all 3 qubits collapses the superposition to one definite 3-bit string. This collapse is irreversible and physically random.",
              },
              {
                step: "3",
                title: "Rejection Sampling",
                color: "emerald",
                desc: "8 outcomes → 6 faces. We reject results 6 (110) and 7 (111) and re-roll. Each valid face gets exactly 1/6 probability.",
              },
            ].map(({ step, title, color, desc }) => (
              <div key={step} className="relative">
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
            H = Hadamard gate (superposition) · M = measurement (collapses to 0 or 1)
          </p>
        </div>

        {/* Why quantum random is different */}
        <div className="rounded-xl border border-cyan-700/30 p-6 mb-6" style={{ backgroundColor: "var(--bg-card)" }}>
          <h2 className="text-lg font-semibold text-slate-200 mb-3">Why quantum randomness is different</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Classical <code className="text-rose-400">Math.random()</code></h3>
              <ul className="space-y-1 text-sm text-slate-400">
                <li className="flex gap-2"><span className="text-rose-400 shrink-0">✕</span>Deterministic algorithm (pseudo-random)</li>
                <li className="flex gap-2"><span className="text-rose-400 shrink-0">✕</span>Predictable with the same seed</li>
                <li className="flex gap-2"><span className="text-rose-400 shrink-0">✕</span>Not truly random — mathematically generated</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Quantum measurement</h3>
              <ul className="space-y-1 text-sm text-slate-400">
                <li className="flex gap-2"><span className="text-emerald-400 shrink-0">✓</span>Fundamentally random by quantum mechanics</li>
                <li className="flex gap-2"><span className="text-emerald-400 shrink-0">✓</span>No seed — the universe itself decides</li>
                <li className="flex gap-2"><span className="text-emerald-400 shrink-0">✓</span>Certified by physical law (Born rule)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick start */}
        <div className="rounded-xl border border-purple-700/30 p-6" style={{ backgroundColor: "var(--bg-card)" }}>
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Run the Python script directly</h2>
          <pre className="text-sm text-emerald-300 p-3 rounded-lg bg-black/40 border border-white/5 overflow-x-auto mb-3">
            <code>{`cd quantum/quantum-dice
.venv/bin/python roll.py`}</code>
          </pre>
          <p className="text-xs text-slate-500">
            Uses Qiskit's local StatevectorSampler. For real IBM Quantum hardware, see{" "}
            <code className="text-purple-400">main.py</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
