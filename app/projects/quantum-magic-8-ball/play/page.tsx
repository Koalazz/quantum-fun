"use client";

import { useState, useCallback, useRef } from "react";
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
  answer?: string;
  tone?: string;
  mapping_table?: Record<string, string>;
  backend?: string;
  job_id?: string;
  poll_count?: number;
  queue_status?: string;
}

type AskState = "idle" | "asking" | "done" | "error";
type Mode = "ibm" | "local";

const TONE_STYLES = {
  positive: {
    answer: "text-emerald-300",
    glow: "rgba(52,211,153,0.3)",
    triangle: "#34d399",
    border: "border-emerald-500/30",
  },
  neutral: {
    answer: "text-amber-300",
    glow: "rgba(251,191,36,0.3)",
    triangle: "#fbbf24",
    border: "border-amber-500/30",
  },
  negative: {
    answer: "text-rose-300",
    glow: "rgba(251,113,133,0.3)",
    triangle: "#fb7185",
    border: "border-rose-500/30",
  },
};

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

function EightBall({ askState, answer, tone }: { askState: AskState; answer: string | null; tone: string | null }) {
  const toneStyle = tone ? TONE_STYLES[tone as keyof typeof TONE_STYLES] : TONE_STYLES.neutral;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
      {/* Glow ring */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            askState === "asking"
              ? `radial-gradient(circle, ${toneStyle.glow.replace("0.3", "0.15")} 0%, transparent 70%)`
              : askState === "done"
              ? `radial-gradient(circle, ${toneStyle.glow} 0%, transparent 70%)`
              : "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
          transition: "background 0.5s",
          animation: askState === "asking" ? "oracleGlow 1.2s ease-in-out infinite" : undefined,
          inset: -24,
        }}
      />

      {/* Ball */}
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 30%, #2d2d4e, #0a0a1a 65%)",
          border: "2px solid rgba(124,58,237,0.3)",
          boxShadow: askState === "done"
            ? `0 0 40px ${toneStyle.glow}, 0 0 80px ${toneStyle.glow.replace("0.3", "0.1")}, inset 0 0 40px rgba(0,0,0,0.6)`
            : "0 0 20px rgba(124,58,237,0.2), inset 0 0 40px rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          transition: "box-shadow 0.5s",
          animation: askState === "asking" ? "ballShake 0.15s ease-in-out infinite" : undefined,
        }}
      >
        {/* The "8" label (idle state) */}
        {askState !== "done" && (
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "radial-gradient(circle at 40% 35%, #1e1e3f, #0d0d1f)",
              border: "2px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: askState === "asking" ? 0.4 : 1,
              transition: "opacity 0.3s",
            }}
          >
            <span style={{ fontSize: 36, fontWeight: 900, color: "white", textShadow: "0 0 10px rgba(255,255,255,0.3)" }}>
              8
            </span>
          </div>
        )}

        {/* Answer triangle (done state) */}
        {askState === "done" && answer && (
          <div
            style={{
              animation: "answerReveal 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              textAlign: "center",
              maxWidth: 160,
            }}
          >
            {/* Triangle shape */}
            <div style={{
              width: 0,
              height: 0,
              borderLeft: "20px solid transparent",
              borderRight: "20px solid transparent",
              borderBottom: `34px solid ${toneStyle.triangle}`,
              marginBottom: 10,
              filter: `drop-shadow(0 0 8px ${toneStyle.triangle})`,
            }} />
            <p style={{
              fontSize: 13,
              fontWeight: 600,
              lineHeight: 1.3,
              color: toneStyle.triangle,
              textShadow: `0 0 12px ${toneStyle.glow}`,
            }}>
              {answer}
            </p>
          </div>
        )}

        {/* Asking spinner */}
        {askState === "asking" && (
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, transparent 0%, rgba(124,58,237,0.3) 50%, transparent 100%)",
              animation: "spin 1s linear infinite",
            }}
          />
        )}

        {/* Specular highlight */}
        <div style={{
          position: "absolute",
          top: "18%",
          left: "22%",
          width: "28%",
          height: "20%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
      </div>
    </div>
  );
}

function LogEntryCard({ entry, isLatest }: { entry: LogEntry; isLatest: boolean }) {
  const colorClass = STATUS_COLORS[entry.status] ?? "text-slate-400 border-white/10 bg-white/5";
  const icon = STATUS_ICONS[entry.status] ?? "·";

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-500 ${colorClass} ${isLatest ? "opacity-100" : "opacity-70"}`}
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
            <div className="mt-2 grid grid-cols-4 gap-1">
              {Object.entries(entry.states).map(([state, pct]) => (
                <div key={state} className="bg-black/20 rounded px-2 py-1 text-center">
                  <div className="font-mono text-xs text-fuchsia-300">|{state}⟩</div>
                  <div className="text-xs text-slate-500">{pct}</div>
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
                = <span className="text-slate-200">{entry.raw_value}</span>
              </span>
            </div>
          )}
          {entry.mapping_table && (
            <div className="mt-2 grid grid-cols-1 gap-0.5">
              {Object.entries(entry.mapping_table).map(([bits, ans]) => {
                const isChosen = entry.raw_bits && bits.startsWith(entry.raw_bits);
                return (
                  <div
                    key={bits}
                    className={`flex items-center justify-between px-2 py-0.5 rounded text-xs font-mono ${
                      isChosen ? "bg-amber-500/15 border border-amber-500/30 text-amber-300" : "text-slate-600"
                    }`}
                  >
                    <span>{bits}</span>
                    <span className="truncate ml-2">→ {ans}</span>
                  </div>
                );
              })}
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

function ModeToggle({ mode, onChange, disabled }: { mode: Mode; onChange: (m: Mode) => void; disabled: boolean }) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
      <button
        onClick={() => onChange("ibm")}
        disabled={disabled}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 disabled:cursor-not-allowed ${
          mode === "ibm" ? "bg-blue-600/80 text-white border border-blue-400/30" : "text-slate-500 hover:text-slate-300"
        }`}
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
        className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 disabled:cursor-not-allowed ${
          mode === "local" ? "bg-emerald-600/70 text-white border border-emerald-400/30" : "text-slate-500 hover:text-slate-300"
        }`}
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

export default function QuantumMagic8BallPlayPage() {
  const logRef = useRef<HTMLDivElement>(null);
  const [askState, setAskState] = useState<AskState>("idle");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [result, setResult] = useState<{ answer: string; tone: string } | null>(null);
  const [mode, setMode] = useState<Mode>("ibm");
  const entryIdRef = useRef(0);

  const appendLog = useCallback((entry: Omit<LogEntry, "id">) => {
    setLog((prev) => [...prev, { ...entry, id: entryIdRef.current++ }]);
    setTimeout(() => {
      logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  }, []);

  const handleAsk = useCallback(async () => {
    if (askState === "asking") return;

    setAskState("asking");
    setLog([]);
    setResult(null);

    const evtSource = new EventSource(`${basePath}/api/quantum-magic-8-ball/ask?mode=${mode}`);

    evtSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data) as LogEntry;

        if (data.status === "result") {
          evtSource.close();
          appendLog(data);
          setTimeout(() => {
            setResult({ answer: data.answer ?? "…", tone: data.tone ?? "neutral" });
            setAskState("done");
          }, 400);
        } else if (data.status === "error") {
          evtSource.close();
          appendLog(data);
          setAskState("error");
        } else {
          appendLog(data);
        }
      } catch {
        // ignore parse errors
      }
    };

    evtSource.onerror = () => {
      evtSource.close();
      appendLog({ step: 0, status: "error", message: "Connection to server lost. Is the dev server running?" });
      setAskState("error");
    };
  }, [askState, mode, appendLog]);

  const isIBM = mode === "ibm";
  const toneStyle = result?.tone ? TONE_STYLES[result.tone as keyof typeof TONE_STYLES] : TONE_STYLES.neutral;

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes answerReveal {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes oracleGlow {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
        @keyframes ballShake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25%       { transform: translateX(-3px) rotate(-2deg); }
          75%       { transform: translateX(3px) rotate(2deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <div className="min-h-screen grid-bg" style={{ backgroundColor: "var(--bg-deep)" }}>
        {/* Top bar */}
        <div className="border-b border-white/5 px-6 py-3 flex items-center gap-3">
          <Link href="/projects/quantum-magic-8-ball" className="text-slate-500 hover:text-slate-300 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <span className="text-sm text-slate-400">Quantum Magic 8-Ball</span>
          <span className="text-slate-600">/</span>
          <span className="text-sm text-slate-300">Play</span>

          <div className="ml-auto flex items-center gap-3">
            <ModeToggle mode={mode} onChange={setMode} disabled={askState === "asking"} />
            <div className="flex items-center gap-2 text-xs text-slate-500">
              {isIBM ? (
                <><span className="w-1.5 h-1.5 rounded-full bg-blue-400" />IBM Quantum Cloud</>
              ) : (
                <><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Qiskit Simulator</>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-[calc(100vh-56px-65px)]">

          {/* ── Left: 8-ball + Button ── */}
          <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8">

            {isIBM && askState === "idle" && (
              <div className="flex items-center gap-2 text-xs text-blue-400/80 bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2 max-w-xs text-center">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                IBM Cloud jobs may take 1–10 min in queue
              </div>
            )}

            <EightBall askState={askState} answer={result?.answer ?? null} tone={result?.tone ?? null} />

            {/* Result text */}
            {askState === "done" && result && (
              <div
                className={`text-center px-6 py-3 rounded-xl border ${toneStyle.border}`}
                style={{ animation: "answerReveal 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}
              >
                <p className={`text-xl font-semibold ${toneStyle.answer}`} style={{
                  textShadow: `0 0 20px ${toneStyle.glow}`,
                }}>
                  {result.answer}
                </p>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <span className="text-xs text-purple-400/60">⚛</span>
                  <span className="text-xs text-purple-300/60 tracking-wide">Quantum oracle</span>
                </div>
              </div>
            )}

            {askState === "asking" && (
              <div className="flex items-center gap-2 text-purple-300 text-sm">
                <span className="inline-block w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
                {isIBM ? "Consulting IBM Quantum hardware…" : "Consulting the quantum oracle…"}
              </div>
            )}

            {askState === "idle" && (
              <p className="text-slate-500 text-sm text-center max-w-xs">
                {isIBM
                  ? "Ask the oracle — answered by real IBM quantum hardware"
                  : "Ask the oracle — answered by quantum superposition"}
              </p>
            )}

            {/* Ask button */}
            <button
              onClick={handleAsk}
              disabled={askState === "asking"}
              className="relative px-10 py-4 rounded-2xl font-semibold text-base transition-all duration-200 disabled:cursor-not-allowed"
              style={{
                background: askState === "asking"
                  ? "rgba(124,58,237,0.2)"
                  : "linear-gradient(135deg, #7c3aed, #6d28d9)",
                border: "1px solid rgba(167,139,250,0.4)",
                color: askState === "asking" ? "rgba(167,139,250,0.5)" : "white",
                boxShadow: askState !== "asking"
                  ? "0 0 20px rgba(124,58,237,0.3), 0 4px 15px rgba(0,0,0,0.3)"
                  : "none",
              }}
            >
              {askState === "asking"
                ? isIBM ? "Waiting for IBM…" : "Consulting oracle…"
                : askState === "done"
                ? "Ask Again"
                : "Ask the Oracle"}
            </button>

            <Link
              href="/projects/quantum-magic-8-ball/docs"
              className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
            >
              How does this work? →
            </Link>
          </div>

          {/* ── Right: Log ── */}
          <div
            className="w-full lg:w-[480px] border-t lg:border-t-0 lg:border-l border-white/5 flex flex-col"
            style={{ backgroundColor: "rgba(3,5,15,0.7)" }}
          >
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-sm font-semibold text-slate-300">Behind the scenes</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isIBM ? "Live log from real IBM quantum hardware" : "What the quantum oracle is doing"}
                </p>
              </div>
              {log.length > 0 && (
                <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  {log.length} steps
                </span>
              )}
            </div>

            <div ref={logRef} className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 0 }}>
              {log.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-12">
                  <div className="w-16 h-16 rounded-full bg-purple-900/20 border border-purple-700/30 flex items-center justify-center">
                    <span className="text-3xl font-black text-purple-500/60">8</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 font-medium">Ask a question first</p>
                    <p className="text-xs text-slate-600 mt-1 max-w-[220px]">
                      {isIBM
                        ? "Live events from IBM Quantum hardware will stream here"
                        : "Each quantum step will appear here as it happens"}
                    </p>
                  </div>
                </div>
              ) : (
                log.map((entry, i) => (
                  <LogEntryCard key={entry.id} entry={entry} isLatest={i === log.length - 1} />
                ))
              )}
            </div>

            <div className="px-5 py-3 border-t border-white/5 shrink-0">
              <p className="text-xs text-slate-600 leading-relaxed">
                <span className="text-slate-500">⚛</span>{" "}
                {result
                  ? `The oracle says: "${result.answer}". ${isIBM ? "Certified by real IBM quantum hardware." : "Certified by quantum measurement — not an algorithm."}`
                  : isIBM
                  ? "This oracle runs on real IBM quantum processors — superconducting qubits cooled to near absolute zero."
                  : "The answer exists in all 8 states simultaneously until the moment the oracle is consulted."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
