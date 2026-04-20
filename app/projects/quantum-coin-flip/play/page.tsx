"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { basePath } from "@/lib/basepath";

interface LogEntry {
  id: number;
  step: number;
  status: string;
  message: string;
  detail?: string;
  circuit?: string;
  states?: Record<string, string>;
  raw_bits?: string;
  raw_value?: number;
  side?: string;
  backend?: string;
  job_id?: string;
  poll_count?: number;
  queue_status?: string;
}

type FlipState = "idle" | "flipping" | "done" | "error";
type Mode = "ibm" | "local";

const STATUS_ICONS: Record<string, string> = {
  building: "⬡",
  superposition: "⟨ψ⟩",
  connecting: "◎",
  running: "▶",
  queued: "⏳",
  measured: "◉",
  result: "✦",
  error: "✕",
};

const STATUS_COLORS: Record<string, string> = {
  building: "text-violet-400 border-violet-500/30 bg-violet-500/5",
  superposition: "text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/5",
  connecting: "text-cyan-400 border-cyan-500/30 bg-cyan-500/5",
  running: "text-blue-400 border-blue-500/30 bg-blue-500/5",
  queued: "text-sky-400 border-sky-500/30 bg-sky-500/5",
  measured: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
  result: "text-purple-300 border-purple-400/40 bg-purple-500/10",
  error: "text-rose-400 border-rose-500/30 bg-rose-500/5",
};

function LogEntryCard({ entry, isLatest }: { entry: LogEntry; isLatest: boolean }) {
  const colorClass = STATUS_COLORS[entry.status] ?? "text-slate-400 border-white/10 bg-white/5";
  const icon = STATUS_ICONS[entry.status] ?? "·";

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-500 ${colorClass} ${
        isLatest ? "opacity-100 translate-y-0" : "opacity-70"
      }`}
      style={{ animation: isLatest ? "slideIn 0.3s ease-out" : undefined }}
    >
      <div className="flex items-start gap-3">
        <span className="font-mono text-lg leading-none mt-0.5 shrink-0 w-8 text-center">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm leading-snug">{entry.message}</p>

          {entry.job_id && entry.status === "running" && (
            <p className="mt-1 text-xs font-mono text-slate-500 truncate">Job: {entry.job_id}</p>
          )}

          {entry.queue_status && (
            <div className="mt-1 inline-flex items-center gap-1.5 text-xs font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              {entry.queue_status}
            </div>
          )}

          {entry.circuit && (
            <pre className="mt-2 text-xs font-mono text-slate-400 bg-black/30 rounded p-2 overflow-x-auto leading-relaxed">
              {entry.circuit}
            </pre>
          )}

          {entry.states && (
            <div className="mt-2 flex gap-2">
              {Object.entries(entry.states).map(([state, pct]) => (
                <div key={state} className="bg-black/20 rounded px-3 py-1.5 text-center flex-1">
                  <div className="font-mono text-xs text-fuchsia-300">|{state.split(" ")[0]}⟩</div>
                  <div className="text-xs text-slate-300 font-medium">{pct}</div>
                  <div className="text-xs text-slate-500">{state.includes("Heads") ? "Heads" : "Tails"}</div>
                </div>
              ))}
            </div>
          )}

          {entry.raw_bits !== undefined && entry.status === "measured" && (
            <div className="mt-2 flex items-center gap-3">
              <span className="font-mono text-sm bg-black/30 px-3 py-1.5 rounded border border-emerald-500/20">
                <span className="text-slate-500">|</span>
                <span className="text-emerald-300 tracking-widest">{entry.raw_bits}</span>
                <span className="text-slate-500">⟩</span>
              </span>
              <span className="text-slate-400 text-sm">
                = <span className="text-slate-200">{entry.raw_value === 1 ? "Heads" : "Tails"}</span>
              </span>
            </div>
          )}

          {entry.backend && (
            <p className="mt-1 text-xs text-slate-500 font-mono">{entry.backend}</p>
          )}

          {entry.detail && (
            <p className="mt-2 text-xs text-slate-500 leading-relaxed border-t border-white/5 pt-2">
              {entry.detail}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function QuantumCoin({ flipState, side }: { flipState: FlipState; side: string | null }) {
  const isHeads = side === "heads";

  return (
    <div className="relative" style={{ perspective: "600px" }}>
      <div
        style={{
          width: 160,
          height: 160,
          position: "relative",
          transformStyle: "preserve-3d",
          transition: flipState === "done" ? "transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)" : undefined,
          transform:
            flipState === "flipping"
              ? undefined
              : flipState === "done"
              ? isHeads ? "rotateY(0deg)" : "rotateY(180deg)"
              : "rotateY(0deg)",
          animation: flipState === "flipping" ? "coinSpin 0.4s linear infinite" : undefined,
        }}
      >
        {/* Heads face (front) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "radial-gradient(circle at 35% 35%, #a78bfa, #7c3aed 60%, #4c1d95)",
            border: "3px solid rgba(167,139,250,0.5)",
            boxShadow: "0 0 24px rgba(124,58,237,0.5), inset 0 0 20px rgba(0,0,0,0.3)",
          }}
        >
          <span style={{ fontSize: 56, fontWeight: 800, color: "white", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>H</span>
        </div>

        {/* Tails face (back) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "radial-gradient(circle at 35% 35%, #67e8f9, #06b6d4 60%, #0e7490)",
            border: "3px solid rgba(103,232,249,0.5)",
            boxShadow: "0 0 24px rgba(6,182,212,0.5), inset 0 0 20px rgba(0,0,0,0.3)",
          }}
        >
          <span style={{ fontSize: 56, fontWeight: 800, color: "white", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>T</span>
        </div>
      </div>
    </div>
  );
}

function ResultBadge({ side }: { side: string }) {
  const isHeads = side === "heads";
  return (
    <div
      className="flex flex-col items-center gap-2"
      style={{ animation: "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}
    >
      <div className="text-2xl font-bold tracking-wide" style={{
        color: isHeads ? "#a78bfa" : "#67e8f9",
        textShadow: isHeads
          ? "0 0 20px rgba(167,139,250,0.8)"
          : "0 0 20px rgba(103,232,249,0.8)",
      }}>
        {isHeads ? "Heads" : "Tails"}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-purple-400/60">⚛</span>
        <span className="text-xs text-purple-300/60 tracking-wide">Quantum result</span>
      </div>
    </div>
  );
}

function ModeToggle({ mode, onChange, disabled }: { mode: Mode; onChange: (m: Mode) => void; disabled: boolean }) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
      <button
        onClick={() => onChange("ibm")}
        disabled={disabled}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
          mode === "ibm"
            ? "bg-blue-600/80 text-white border border-blue-400/30"
            : "text-slate-500 hover:text-slate-300"
        } disabled:cursor-not-allowed`}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
        IBM Cloud
      </button>
      <button
        onClick={() => onChange("local")}
        disabled={disabled}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
          mode === "local"
            ? "bg-emerald-600/70 text-white border border-emerald-400/30"
            : "text-slate-500 hover:text-slate-300"
        } disabled:cursor-not-allowed`}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
        </svg>
        Local Sim
      </button>
    </div>
  );
}

export default function QuantumCoinFlipPlayPage() {
  const logRef = useRef<HTMLDivElement>(null);
  const [flipState, setFlipState] = useState<FlipState>("idle");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("ibm");
  const entryIdRef = useRef(0);

  const appendLog = useCallback((entry: Omit<LogEntry, "id">) => {
    setLog((prev) => [...prev, { ...entry, id: entryIdRef.current++ }]);
    setTimeout(() => {
      logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  }, []);

  const handleFlip = useCallback(async () => {
    if (flipState === "flipping") return;

    setFlipState("flipping");
    setLog([]);
    setResult(null);

    const evtSource = new EventSource(`${basePath}/api/quantum-coin-flip/flip?mode=${mode}`);

    evtSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data) as LogEntry;

        if (data.status === "result") {
          evtSource.close();
          const side = data.side ?? "heads";
          appendLog(data);
          setTimeout(() => {
            setResult(side);
            setFlipState("done");
          }, 400);
        } else if (data.status === "error") {
          evtSource.close();
          appendLog(data);
          setFlipState("error");
        } else {
          appendLog(data);
        }
      } catch {
        // ignore parse errors
      }
    };

    evtSource.onerror = () => {
      evtSource.close();
      appendLog({
        step: 0,
        status: "error",
        message: "Connection to server lost. Is the dev server running?",
      });
      setFlipState("error");
    };
  }, [flipState, mode, appendLog]);

  const isIBM = mode === "ibm";

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes coinSpin {
          0%   { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.8; }
        }
      `}</style>

      <div className="min-h-screen grid-bg" style={{ backgroundColor: "var(--bg-deep)" }}>
        {/* Top bar */}
        <div className="border-b border-white/5 px-6 py-3 flex items-center gap-3">
          <Link href="/projects/quantum-coin-flip" className="text-slate-500 hover:text-slate-300 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <span className="text-sm text-slate-400">Quantum Coin Flip</span>
          <span className="text-slate-600">/</span>
          <span className="text-sm text-slate-300">Play</span>

          <div className="ml-auto flex items-center gap-3">
            <ModeToggle mode={mode} onChange={setMode} disabled={flipState === "flipping"} />
            <div className="flex items-center gap-2 text-xs text-slate-500">
              {isIBM ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  IBM Quantum Cloud
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Qiskit Simulator
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-[calc(100vh-56px-65px)]">

          {/* ── Left: Coin + Flip Button ── */}
          <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8">

            {isIBM && flipState === "idle" && (
              <div className="flex items-center gap-2 text-xs text-blue-400/80 bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2 max-w-xs text-center">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                IBM Cloud jobs may take 1–10 min in queue
              </div>
            )}

            {/* Coin */}
            <div className="relative mt-4 mb-4">
              <div
                className="absolute inset-[-24px] rounded-full pointer-events-none"
                style={{
                  background:
                    flipState === "flipping"
                      ? "radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 70%)"
                      : flipState === "done"
                      ? result === "heads"
                        ? "radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)"
                        : "radial-gradient(ellipse, rgba(6,182,212,0.15) 0%, transparent 70%)"
                      : "transparent",
                  transition: "background 0.5s",
                  animation: flipState === "flipping" ? "pulse-glow 0.6s ease-in-out infinite" : undefined,
                }}
              />
              <QuantumCoin flipState={flipState} side={result} />
            </div>

            {/* Result */}
            {flipState === "done" && result && <ResultBadge side={result} />}

            {/* Status label */}
            {flipState === "flipping" && (
              <div className="flex items-center gap-2 text-purple-300 text-sm">
                <span className="inline-block w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
                {isIBM ? "Waiting for IBM Quantum hardware…" : "Quantum circuit running…"}
              </div>
            )}
            {flipState === "idle" && (
              <p className="text-slate-500 text-sm text-center max-w-xs">
                {isIBM
                  ? "Flip to generate heads or tails on real IBM quantum hardware"
                  : "Flip to generate heads or tails certified by quantum mechanics"}
              </p>
            )}

            {/* Flip button */}
            <button
              onClick={handleFlip}
              disabled={flipState === "flipping"}
              className="relative px-10 py-4 rounded-2xl font-semibold text-base transition-all duration-200 disabled:cursor-not-allowed"
              style={{
                background:
                  flipState === "flipping"
                    ? "rgba(124,58,237,0.2)"
                    : "linear-gradient(135deg, #7c3aed, #6d28d9)",
                border: "1px solid rgba(167,139,250,0.4)",
                color: flipState === "flipping" ? "rgba(167,139,250,0.5)" : "white",
                boxShadow:
                  flipState !== "flipping"
                    ? "0 0 20px rgba(124,58,237,0.3), 0 4px 15px rgba(0,0,0,0.3)"
                    : "none",
              }}
            >
              {flipState === "flipping"
                ? isIBM ? "Waiting for IBM…" : "Flipping…"
                : flipState === "done"
                ? "Flip Again"
                : "Flip Quantum Coin"}
            </button>

            <Link
              href="/projects/quantum-coin-flip/docs"
              className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
            >
              How does this work? →
            </Link>
          </div>

          {/* ── Right: Behind the Scenes Log ── */}
          <div
            className="w-full lg:w-[480px] border-t lg:border-t-0 lg:border-l border-white/5 flex flex-col"
            style={{ backgroundColor: "rgba(3,5,15,0.7)" }}
          >
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-sm font-semibold text-slate-300">Behind the scenes</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isIBM
                    ? "Live log from real IBM quantum hardware"
                    : "What's happening inside the quantum computer"}
                </p>
              </div>
              {log.length > 0 && (
                <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  {log.length} steps
                </span>
              )}
            </div>

            <div
              ref={logRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
              style={{ minHeight: 0 }}
            >
              {log.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-12">
                  <div className="w-16 h-16 rounded-full bg-purple-900/20 border border-purple-700/30 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4l3 3" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 font-medium">Press Flip to start</p>
                    <p className="text-xs text-slate-600 mt-1 max-w-[220px]">
                      {isIBM
                        ? "Live events from IBM Quantum hardware will stream here"
                        : "Each step will appear here explaining exactly what the quantum circuit is doing"}
                    </p>
                  </div>
                </div>
              ) : (
                log.map((entry, i) => (
                  <LogEntryCard
                    key={entry.id}
                    entry={entry}
                    isLatest={i === log.length - 1}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-white/5 shrink-0">
              <p className="text-xs text-slate-600 leading-relaxed">
                <span className="text-slate-500">⚛</span>{" "}
                {result
                  ? `You got ${result === "heads" ? "Heads" : "Tails"}. ${isIBM ? "Certified by real IBM quantum hardware." : "Certified random by quantum measurement — not an algorithm."}`
                  : isIBM
                  ? "This coin runs on real IBM quantum processors — superconducting qubits cooled to near absolute zero."
                  : "This coin uses quantum superposition. The outcome is unknowable until the moment of measurement."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
