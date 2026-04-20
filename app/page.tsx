import { projects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";

export default function HomePage() {
  const available = projects.filter((p) => p.status === "available");
  const upcoming = projects.filter((p) => p.status === "coming-soon");

  return (
    <div className="grid-bg min-h-screen">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          IBM Quantum · 10 min free daily
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-100 mb-4 tracking-tight">
          Quantum
          <span
            className="ml-3"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Fun
          </span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-3">
          Real quantum experiments on IBM quantum hardware — ordered from easy to advanced.
          Each project comes with a full educational guide so you can learn as you build.
        </p>

        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          No quantum physics background needed. One project at a time, one day at a time.
        </p>

        {/* Stats row */}
        <div className="flex justify-center gap-8 mt-12">
          {[
            { value: String(projects.length), label: "Projects planned" },
            { value: String(available.length), label: "Available now" },
            { value: "Free", label: "IBM Quantum tier" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-purple-400">{value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Available projects */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
            Available Now
          </h2>
          <div className="flex-1 h-px bg-purple-900/40" />
          <span className="text-xs text-emerald-400 font-medium">{available.length} ready</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {available.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Upcoming projects */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
            Coming Soon
          </h2>
          <div className="flex-1 h-px bg-slate-800/60" />
          <span className="text-xs text-slate-500">{upcoming.length} in queue</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcoming.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
