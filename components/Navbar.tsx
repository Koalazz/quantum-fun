"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-50 border-b border-purple-900/30 backdrop-blur-md"
      style={{ backgroundColor: "rgba(3, 5, 15, 0.85)" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-600/30 transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="12" r="8" strokeDasharray="4 2" />
              <line x1="12" y1="4" x2="12" y2="4.1" strokeWidth="3" strokeLinecap="round" />
              <line x1="12" y1="20" x2="12" y2="20.1" strokeWidth="3" strokeLinecap="round" />
              <line x1="4" y1="12" x2="4.1" y2="12" strokeWidth="3" strokeLinecap="round" />
              <line x1="20" y1="12" x2="20.1" y2="12" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-semibold text-slate-200 text-sm tracking-wide">
            Quantum<span className="text-purple-400">Fun</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              pathname === "/"
                ? "bg-purple-600/20 text-purple-300"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            Projects
          </Link>
          <a
            href="https://quantum.cloud.ibm.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-md text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors flex items-center gap-1"
          >
            IBM Quantum
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
