import Link from "next/link";
import { Project, difficultyColors } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
}

const difficultyLabel: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const isAvailable = project.status === "available";

  const cardContent = (
    <div
      className={`group relative h-full rounded-xl border transition-all duration-300 p-6 flex flex-col gap-4 ${
        isAvailable
          ? "border-purple-700/40 hover:border-purple-500/60 cursor-pointer"
          : "border-slate-800/60 opacity-60 cursor-default"
      }`}
      style={{
        backgroundColor: "var(--bg-card)",
        ...(isAvailable && {
          backgroundImage:
            "radial-gradient(ellipse at top left, rgba(124,58,237,0.05) 0%, transparent 60%)",
        }),
      }}
    >
      {/* Order badge */}
      <div className="flex items-start justify-between">
        <span className="text-xs font-mono text-purple-500/60">#{String(project.order).padStart(2, "0")}</span>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${difficultyColors[project.difficulty]}`}
          >
            {difficultyLabel[project.difficulty]}
          </span>
          {!isAvailable && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full border text-slate-500 bg-slate-800/40 border-slate-700/30">
              Soon
            </span>
          )}
        </div>
      </div>

      {/* Title & tagline */}
      <div>
        <h3
          className={`font-semibold text-lg mb-1 transition-colors ${
            isAvailable ? "text-slate-100 group-hover:text-purple-300" : "text-slate-400"
          }`}
        >
          {project.title}
        </h3>
        <p className="text-sm text-purple-300/70 font-medium">{project.tagline}</p>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-400 leading-relaxed flex-1">{project.description}</p>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-white/5">
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="3" />
          </svg>
          {project.qubits} qubit{project.qubits !== 1 ? "s" : ""}
        </span>
        <span>{project.estimatedTime}</span>
        <span className="flex-1 text-right">{project.concepts.slice(0, 2).join(" · ")}</span>
      </div>

      {/* Hover arrow */}
      {isAvailable && (
        <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity text-purple-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      )}
    </div>
  );

  if (isAvailable) {
    return (
      <Link href={`/projects/${project.slug}`} className="h-full block">
        {cardContent}
      </Link>
    );
  }

  return <div className="h-full">{cardContent}</div>;
}
