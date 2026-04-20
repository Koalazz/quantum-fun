import Link from "next/link";
import { getProjectBySlug } from "@/data/projects";
import { difficultyColors } from "@/data/projects";

export default function HelloWorldPage() {
  const project = getProjectBySlug("hello-world")!;

  return (
    <div className="grid-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-slate-300 transition-colors">
            Projects
          </Link>
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
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full border ${difficultyColors[project.difficulty]}`}
              >
                Beginner
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full border border-emerald-400/30 text-emerald-400 bg-emerald-400/10">
                Live on IBM Quantum
              </span>
            </div>
            <h1 className="text-4xl font-bold text-slate-100 mb-3">{project.title}</h1>
            <p className="text-lg text-purple-300/80 mb-3">{project.tagline}</p>
            <p className="text-slate-400 leading-relaxed max-w-2xl">{project.description}</p>
          </div>

          <div className="flex flex-col gap-3 min-w-[200px]">
            <Link
              href="/projects/hello-world/docs"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Read the Guide
            </Link>
            <a
              href="https://quantum.cloud.ibm.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-purple-700/40 hover:border-purple-500/60 text-slate-300 hover:text-slate-100 font-medium text-sm transition-colors"
            >
              Open IBM Quantum
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* Concepts */}
        <div className="flex flex-wrap gap-2 mb-10">
          {project.concepts.map((c) => (
            <span
              key={c}
              className="text-xs px-3 py-1 rounded-full bg-purple-900/20 border border-purple-700/30 text-purple-300"
            >
              {c}
            </span>
          ))}
        </div>

        {/* What you will build */}
        <div
          className="rounded-xl border border-purple-700/30 p-6 mb-8"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <h2 className="text-lg font-semibold text-slate-200 mb-4">What you will build</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-purple-300 mb-2">Part 1 · Bell State</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Create a 2-qubit Bell state circuit — the simplest example of quantum entanglement.
                You will measure correlations between qubits that prove they are entangled, even when
                measured independently.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-cyan-300 mb-2">Part 2 · 100-Qubit GHZ State</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Scale up to a 100-qubit Greenberger–Horne–Zeilinger (GHZ) state — a utility-scale
                demonstration of quantum entanglement across an entire quantum processor.
              </p>
            </div>
          </div>
        </div>

        {/* Circuit diagram */}
        <div
          className="rounded-xl border border-purple-700/30 p-6 mb-8"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Bell State Circuit</h2>
          <div className="font-mono text-sm text-slate-300 leading-loose bg-black/30 rounded-lg p-4">
            <pre>{`     ┌───┐
q_0: ┤ H ├──■───
     └───┘┌─┴─┐
q_1: ─────┤ X ├─
          └───┘ `}</pre>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            H = Hadamard gate (creates superposition) · ■ → X = CNOT gate (entangles qubits)
          </p>
        </div>

        {/* Quick start */}
        <div
          className="rounded-xl border border-purple-700/30 p-6 mb-8"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Quick Start</h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">1. Install dependencies</p>
              <pre className="text-sm text-emerald-300 p-3 rounded-lg bg-black/40 border border-white/5 overflow-x-auto">
                <code>{`pip install qiskit-ibm-runtime matplotlib`}</code>
              </pre>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">2. Run the script</p>
              <pre className="text-sm text-emerald-300 p-3 rounded-lg bg-black/40 border border-white/5 overflow-x-auto">
                <code>{`cd quantum/hello-world
python main.py`}</code>
              </pre>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">3. New to quantum? Read the guide first</p>
              <Link
                href="/projects/hello-world/docs"
                className="inline-flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Open the step-by-step educational guide
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Expected results */}
        <div
          className="rounded-xl border border-cyan-700/30 p-6"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Expected Results</h2>
          <p className="text-sm text-slate-400 mb-4">
            When you measure the observables ZZ and XX on a Bell state, you expect correlations of{" "}
            <span className="text-cyan-300 font-mono">+1</span>. Independent observables (IZ, ZI, IX, XI)
            should be near <span className="text-cyan-300 font-mono">0</span>.
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { label: "IZ", expected: "≈ 0" },
              { label: "IX", expected: "≈ 0" },
              { label: "ZI", expected: "≈ 0" },
              { label: "XI", expected: "≈ 0" },
              { label: "ZZ", expected: "≈ 1", highlight: true },
              { label: "XX", expected: "≈ 1", highlight: true },
            ].map(({ label, expected, highlight }) => (
              <div
                key={label}
                className={`rounded-lg p-3 text-center border ${
                  highlight
                    ? "border-cyan-500/40 bg-cyan-500/10"
                    : "border-white/5 bg-black/20"
                }`}
              >
                <div className={`font-mono text-sm font-semibold ${highlight ? "text-cyan-300" : "text-slate-400"}`}>
                  {label}
                </div>
                <div className={`text-xs mt-1 ${highlight ? "text-cyan-400" : "text-slate-500"}`}>
                  {expected}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4">
            The ZZ = XX = 1 signature is the hallmark of a maximally entangled Bell state.
            This is quantum entanglement, measured on real hardware.
          </p>
        </div>
      </div>
    </div>
  );
}
