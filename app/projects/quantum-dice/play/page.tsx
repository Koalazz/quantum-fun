"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import QuantumDice3D, { DiceHandle } from "@/components/QuantumDice3D";
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
  face?: number;
  mapping_table?: Record<string, string>;
  backend?: string;
  job_id?: string;
  poll_count?: number;
  queue_status?: string;
  attempts?: number;
}

type RollState = "idle" | "rolling" | "done" | "error";
type Mode = "ibm" | "local";

const STATUS_ICONS: Record<string, string> = {
  building: "⬡",
  superposition: "⟨ψ⟩",
  connecting: "◎",
  running: "▶",
  queued: "⏳",
  measured: "◉",
  mapping: "→",
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
  mapping: "text-amber-400 border-amber-500/30 bg-amber-500/5",
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
      style={{
        animation: isLatest ? "slideIn 0.3s ease-out" : undefined,
      }}
    >
      <div className="flex items-start gap-3">
        <span className="font-mono text-lg leading-none mt-0.5 shrink-0 w-8 text-center">
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm leading-snug">{entry.message}</p>

          {/* Job ID badge */}
          {entry.job_id && entry.status === "running" && (
            <p className="mt-1 text-xs font-mono text-slate-500 truncate">
              Job: {entry.job_id}
            </p>
          )}

          {/* Queue status */}
          {entry.queue_status && (
            <div className="mt-1 inline-flex items-center gap-1.5 text-xs font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              {entry.queue_status}
            </div>
          )}

          {/* Circuit diagram */}
          {entry.circuit && (
            <pre className="mt-2 text-xs font-mono text-slate-400 bg-black/30 rounded p-2 overflow-x-auto leading-relaxed">
              {entry.circuit}
            </pre>
          )}

          {/* Superposition states */}
          {entry.states && (
            <div className="mt-2 grid grid-cols-4 gap-1">
              {Object.entries(entry.states).map(([state, pct]) => (
                <div key={state} className="bg-black/20 rounded px-2 py-1 text-center">
                  <div className="font-mono text-xs text-fuchsia-300">|{state}⟩</div>
                  <div className="text-xs text-slate-500">{pct}</div>
                </div>
              ))}
            </div>
          )}

          {/* Measurement result */}
          {entry.raw_bits !== undefined && entry.status === "measured" && (
            <div className="mt-2 flex items-center gap-3">
              <span className="font-mono text-sm bg-black/30 px-3 py-1.5 rounded border border-emerald-500/20">
                <span className="text-slate-500">|</span>
                <span className="text-emerald-300 tracking-widest">{entry.raw_bits}</span>
                <span className="text-slate-500">⟩</span>
              </span>
              <span className="text-slate-400 text-sm">
                = <span className="text-slate-200">{entry.raw_value}</span> in decimal
              </span>
              {entry.attempts && entry.attempts > 1 && (
                <span className="text-xs text-amber-400/70">
                  ({entry.attempts} attempts)
                </span>
              )}
            </div>
          )}

          {/* Mapping table */}
          {entry.mapping_table && (
            <div className="mt-2 grid grid-cols-2 gap-1">
              {Object.entries(entry.mapping_table).map(([from, to]) => {
                const isChosen =
                  entry.raw_bits && from.startsWith(entry.raw_bits ?? "");
                const isRejected = to.includes("Rejected");
                return (
                  <div
                    key={from}
                    className={`flex items-center justify-between px-2 py-0.5 rounded text-xs font-mono ${
                      isChosen
                        ? "bg-amber-500/15 border border-amber-500/30 text-amber-300"
                        : isRejected
                        ? "text-slate-600"
                        : "text-slate-500"
                    }`}
                  >
                    <span>{from}</span>
                    <span>→ {to}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Backend info */}
          {entry.backend && (
            <p className="mt-1 text-xs text-slate-500 font-mono">{entry.backend}</p>
          )}

          {/* Detail explanation */}
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

function ResultBadge({ face }: { face: number }) {
  return (
    <div
      className="flex flex-col items-center gap-2"
      style={{ animation: "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(109,40,217,0.08) 60%, transparent 100%)",
          border: "1px solid rgba(167,139,250,0.35)",
          boxShadow: "0 0 24px rgba(124,58,237,0.4), 0 0 48px rgba(124,58,237,0.15), inset 0 0 16px rgba(124,58,237,0.08)",
        }}
      >
        <span
          className="text-5xl font-bold tabular-nums"
          style={{
            color: "white",
            textShadow: "0 0 20px rgba(167,139,250,1), 0 0 40px rgba(124,58,237,0.6)",
          }}
        >
          {face}
        </span>
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

export default function QuantumDicePlayPage() {
  const diceRef = useRef<DiceHandle>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const [rollState, setRollState] = useState<RollState>("idle");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [result, setResult] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>("ibm");
  const entryIdRef = useRef(0);

  const appendLog = useCallback((entry: Omit<LogEntry, "id">) => {
    setLog((prev) => [...prev, { ...entry, id: entryIdRef.current++ }]);
    setTimeout(() => {
      logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  }, []);

  const handleRoll = useCallback(async () => {
    if (rollState === "rolling") return;

    setRollState("rolling");
    setLog([]);
    setResult(null);
    diceRef.current?.startRoll();

    const evtSource = new EventSource(`${basePath}/api/quantum-dice/roll?mode=${mode}`);

    evtSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data) as LogEntry;

        if (data.status === "result") {
          evtSource.close();
          const face = data.face ?? 1;
          appendLog(data);
          setTimeout(() => {
            diceRef.current?.showResult(face);
            setResult(face);
            setRollState("done");
          }, 400);
        } else if (data.status === "error") {
          evtSource.close();
          appendLog(data);
          setRollState("error");
          diceRef.current?.stopRoll();
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
      setRollState("error");
      diceRef.current?.stopRoll();
    };
  }, [rollState, mode, appendLog]);

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
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(124,58,237,0.3); }
          50%       { box-shadow: 0 0 40px rgba(124,58,237,0.6), 0 0 80px rgba(124,58,237,0.2); }
        }
      `}</style>

      <div className="min-h-screen grid-bg" style={{ backgroundColor: "var(--bg-deep)" }}>
        {/* Top bar */}
        <div className="border-b border-white/5 px-6 py-3 flex items-center gap-3">
          <Link href="/projects/quantum-dice" className="text-slate-500 hover:text-slate-300 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <span className="text-sm text-slate-400">Quantum Dice</span>
          <span className="text-slate-600">/</span>
          <span className="text-sm text-slate-300">Play</span>

          <div className="ml-auto flex items-center gap-3">
            <ModeToggle
              mode={mode}
              onChange={setMode}
              disabled={rollState === "rolling"}
            />
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

          {/* ── Left: Dice + Roll Button ── */}
          <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8">

            {/* IBM mode notice */}
            {isIBM && rollState === "idle" && (
              <div className="flex items-center gap-2 text-xs text-blue-400/80 bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2 max-w-xs text-center">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                IBM Cloud jobs may take 1–10 min in queue
              </div>
            )}

            {/* Dice — my-6 ensures glow ring (inset -20px) + 3D face projection
                don't visually bleed into adjacent text elements */}
            <div className="relative mt-4 mb-12">
              <div
                className="absolute inset-[-20px] rounded-3xl pointer-events-none"
                style={{
                  background:
                    rollState === "rolling"
                      ? "radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 70%)"
                      : rollState === "done"
                      ? "radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)"
                      : "transparent",
                  transition: "background 0.5s",
                  animation: rollState === "rolling" ? "pulse-glow 1s ease-in-out infinite" : undefined,
                }}
              />
              <QuantumDice3D ref={diceRef} size={160} />
            </div>

            {/* Result display */}
            {rollState === "done" && result && (
              <ResultBadge face={result} />
            )}

            {/* Status label */}
            {rollState === "rolling" && (
              <div className="flex items-center gap-2 text-purple-300 text-sm">
                <span className="inline-block w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
                {isIBM ? "Waiting for IBM Quantum hardware…" : "Quantum circuit running…"}
              </div>
            )}
            {rollState === "idle" && (
              <p className="text-slate-500 text-sm text-center max-w-xs">
                {isIBM
                  ? "Roll to generate a number on real IBM quantum hardware"
                  : "Roll to generate a number certified by quantum mechanics"}
              </p>
            )}

            {/* Roll button */}
            <button
              onClick={handleRoll}
              disabled={rollState === "rolling"}
              className="relative px-10 py-4 rounded-2xl font-semibold text-base transition-all duration-200 disabled:cursor-not-allowed"
              style={{
                background:
                  rollState === "rolling"
                    ? "rgba(124,58,237,0.2)"
                    : "linear-gradient(135deg, #7c3aed, #6d28d9)",
                border: "1px solid rgba(167,139,250,0.4)",
                color: rollState === "rolling" ? "rgba(167,139,250,0.5)" : "white",
                boxShadow:
                  rollState !== "rolling"
                    ? "0 0 20px rgba(124,58,237,0.3), 0 4px 15px rgba(0,0,0,0.3)"
                    : "none",
              }}
            >
              {rollState === "rolling"
                ? isIBM ? "Waiting for IBM…" : "Rolling…"
                : rollState === "done"
                ? "Roll Again"
                : "Roll Quantum Dice"}
            </button>

            <Link
              href="/projects/quantum-dice/docs"
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
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2" strokeDasharray="5 3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 font-medium">Press Roll to start</p>
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
                  ? `You rolled a ${result}. ${isIBM ? "Certified by real IBM quantum hardware." : "Certified random by quantum measurement — not an algorithm."}`
                  : isIBM
                  ? "This die runs on real IBM quantum processors — superconducting qubits cooled to near absolute zero."
                  : "This die uses quantum superposition. The outcome is unknowable until the moment of measurement."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
