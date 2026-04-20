"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { basePath } from "@/lib/basepath";

type Choice = "rock" | "paper" | "scissors";
type GameState = "idle" | "waiting" | "done" | "error";
type GameResult = "win" | "lose" | "draw";
type Mode = "ibm" | "local";

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
  opponent_choice?: Choice;
  player_choice?: Choice;
  result?: GameResult;
  mapping_table?: Record<string, string>;
  backend?: string;
  job_id?: string;
  poll_count?: number;
  queue_status?: string;
  attempts?: number;
}

const CHOICE_EMOJI: Record<Choice, string> = {
  rock: "✊",
  paper: "🖐",
  scissors: "✌️",
};

const CHOICE_LABEL: Record<Choice, string> = {
  rock: "Rock",
  paper: "Paper",
  scissors: "Scissors",
};

const RESULT_CONFIG: Record<GameResult, { label: string; color: string; glow: string; bg: string }> = {
  win:  { label: "You Win!",  color: "text-emerald-300", glow: "rgba(52,211,153,0.4)",  bg: "border-emerald-500/30 bg-emerald-500/5" },
  lose: { label: "You Lose",  color: "text-rose-300",    glow: "rgba(251,113,133,0.4)", bg: "border-rose-500/30 bg-rose-500/5" },
  draw: { label: "Draw!",     color: "text-amber-300",   glow: "rgba(251,191,36,0.4)",  bg: "border-amber-500/30 bg-amber-500/5" },
};

const STATUS_ICONS: Record<string, string> = {
  building: "⬡", superposition: "⟨ψ⟩", connecting: "◎", running: "▶",
  queued: "⏳", measured: "◉", mapping: "→", result: "✦", error: "✕",
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

function ChoiceButton({ choice, selected, disabled, onClick }: {
  choice: Choice; selected: boolean; disabled: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center gap-2 w-24 py-4 rounded-2xl border transition-all duration-200 disabled:cursor-not-allowed ${
        selected
          ? "border-purple-400/60 bg-purple-500/15 text-purple-200 scale-105"
          : "border-white/10 bg-white/5 text-slate-400 hover:border-purple-500/40 hover:text-slate-200 hover:bg-purple-500/5"
      }`}
    >
      <span className="text-3xl">{CHOICE_EMOJI[choice]}</span>
      <span className="text-xs font-medium">{CHOICE_LABEL[choice]}</span>
    </button>
  );
}

function VersusDisplay({
  playerChoice,
  opponentChoice,
  gameState,
  result,
}: {
  playerChoice: Choice | null;
  opponentChoice: Choice | null;
  gameState: GameState;
  result: GameResult | null;
}) {
  const resultCfg = result ? RESULT_CONFIG[result] : null;

  return (
    <div className="flex items-center justify-center gap-6 w-full max-w-sm">
      {/* Player side */}
      <div className="flex flex-col items-center gap-2 flex-1">
        <p className="text-xs text-slate-500 uppercase tracking-wider">You</p>
        <div
          className={`w-20 h-20 rounded-2xl border flex items-center justify-center text-4xl transition-all duration-500 ${
            playerChoice
              ? "border-purple-500/40 bg-purple-500/10"
              : "border-white/5 bg-white/3"
          }`}
          style={{
            boxShadow: playerChoice && gameState === "done" && result
              ? `0 0 20px ${resultCfg?.glow}`
              : undefined,
          }}
        >
          {playerChoice ? CHOICE_EMOJI[playerChoice] : <span className="text-slate-600 text-2xl">?</span>}
        </div>
        {playerChoice && <p className="text-xs text-slate-400">{CHOICE_LABEL[playerChoice]}</p>}
      </div>

      {/* VS badge */}
      <div className="flex flex-col items-center gap-1">
        {gameState === "done" && resultCfg ? (
          <div
            className={`px-3 py-1 rounded-full border text-sm font-bold ${resultCfg.bg} ${resultCfg.color}`}
            style={{ animation: "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}
          >
            {resultCfg.label}
          </div>
        ) : (
          <span className="text-slate-600 text-xs font-semibold tracking-widest">VS</span>
        )}
      </div>

      {/* Opponent side */}
      <div className="flex flex-col items-center gap-2 flex-1">
        <p className="text-xs text-slate-500 uppercase tracking-wider">Quantum</p>
        <div
          className={`w-20 h-20 rounded-2xl border flex items-center justify-center text-4xl transition-all duration-500 ${
            opponentChoice
              ? "border-cyan-500/40 bg-cyan-500/10"
              : "border-white/5 bg-white/3"
          }`}
          style={{
            boxShadow: opponentChoice && gameState === "done" && result
              ? `0 0 20px ${resultCfg?.glow}`
              : undefined,
            animation: gameState === "waiting" ? "pulse 1s ease-in-out infinite" : undefined,
          }}
        >
          {gameState === "waiting" ? (
            <span
              className="text-purple-500/60 font-mono text-xl"
              style={{ animation: "superpositionFlicker 0.4s ease-in-out infinite" }}
            >
              ⟨ψ⟩
            </span>
          ) : opponentChoice ? (
            <span style={{ animation: "popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
              {CHOICE_EMOJI[opponentChoice]}
            </span>
          ) : (
            <span className="text-slate-600 text-2xl">?</span>
          )}
        </div>
        {opponentChoice
          ? <p className="text-xs text-slate-400">{CHOICE_LABEL[opponentChoice]}</p>
          : gameState === "waiting"
          ? <p className="text-xs text-purple-500/60">superposition…</p>
          : <p className="text-xs text-slate-600">—</p>}
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
              <span className="text-slate-400 text-sm">= {entry.raw_value}</span>
              {entry.attempts && entry.attempts > 1 && (
                <span className="text-xs text-amber-400/70">({entry.attempts} attempts)</span>
              )}
            </div>
          )}
          {entry.mapping_table && (
            <div className="mt-2 grid grid-cols-1 gap-0.5">
              {Object.entries(entry.mapping_table).map(([from, to]) => {
                const isChosen = entry.raw_bits && from.startsWith(entry.raw_bits);
                const isRejected = to.includes("Rejected");
                return (
                  <div key={from} className={`flex items-center justify-between px-2 py-0.5 rounded text-xs font-mono ${
                    isChosen ? "bg-amber-500/15 border border-amber-500/30 text-amber-300"
                    : isRejected ? "text-slate-600" : "text-slate-500"
                  }`}>
                    <span>{from}</span>
                    <span>→ {to}</span>
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
      <button onClick={() => onChange("ibm")} disabled={disabled}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all disabled:cursor-not-allowed ${
          mode === "ibm" ? "bg-blue-600/80 text-white border border-blue-400/30" : "text-slate-500 hover:text-slate-300"
        }`}>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
        IBM Cloud
      </button>
      <button onClick={() => onChange("local")} disabled={disabled}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all disabled:cursor-not-allowed ${
          mode === "local" ? "bg-emerald-600/70 text-white border border-emerald-400/30" : "text-slate-500 hover:text-slate-300"
        }`}>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
        </svg>
        Local Sim
      </button>
    </div>
  );
}

export default function QuantumRPSPlayPage() {
  const logRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [opponentChoice, setOpponentChoice] = useState<Choice | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [mode, setMode] = useState<Mode>("ibm");
  const entryIdRef = useRef(0);

  const appendLog = useCallback((entry: Omit<LogEntry, "id">) => {
    setLog((prev) => [...prev, { ...entry, id: entryIdRef.current++ }]);
    setTimeout(() => {
      logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  }, []);

  const handlePlay = useCallback(async (choice: Choice) => {
    if (gameState === "waiting") return;

    setPlayerChoice(choice);
    setOpponentChoice(null);
    setGameResult(null);
    setGameState("waiting");
    setLog([]);

    const evtSource = new EventSource(
      `${basePath}/api/quantum-rock-paper-scissors/play?mode=${mode}&choice=${choice}`
    );

    evtSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data) as LogEntry;

        if (data.status === "result") {
          evtSource.close();
          appendLog(data);
          setTimeout(() => {
            setOpponentChoice(data.opponent_choice ?? "rock");
            setGameResult(data.result ?? "draw");
            setGameState("done");
          }, 400);
        } else if (data.status === "error") {
          evtSource.close();
          appendLog(data);
          setGameState("error");
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
      setGameState("error");
    };
  }, [gameState, mode, appendLog]);

  const handleReset = useCallback(() => {
    setGameState("idle");
    setPlayerChoice(null);
    setOpponentChoice(null);
    setGameResult(null);
    setLog([]);
  }, []);

  const isIBM = mode === "ibm";
  const isWaiting = gameState === "waiting";
  const isDone = gameState === "done";

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
        @keyframes superpositionFlicker {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.1); }
        }
      `}</style>

      <div className="min-h-screen grid-bg" style={{ backgroundColor: "var(--bg-deep)" }}>
        {/* Top bar */}
        <div className="border-b border-white/5 px-6 py-3 flex items-center gap-3">
          <Link href="/projects/quantum-rock-paper-scissors" className="text-slate-500 hover:text-slate-300 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <span className="text-sm text-slate-400">Quantum Rock Paper Scissors</span>
          <span className="text-slate-600">/</span>
          <span className="text-sm text-slate-300">Play</span>
          <div className="ml-auto flex items-center gap-3">
            <ModeToggle mode={mode} onChange={setMode} disabled={isWaiting} />
            <div className="flex items-center gap-2 text-xs text-slate-500">
              {isIBM
                ? <><span className="w-1.5 h-1.5 rounded-full bg-blue-400" />IBM Quantum Cloud</>
                : <><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Qiskit Simulator</>}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-[calc(100vh-56px-65px)]">

          {/* ── Left: Game ── */}
          <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">

            {isIBM && gameState === "idle" && (
              <div className="flex items-center gap-2 text-xs text-blue-400/80 bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2 max-w-xs text-center">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                IBM Cloud jobs may take 1–10 min in queue
              </div>
            )}

            {/* Versus display */}
            <VersusDisplay
              playerChoice={playerChoice}
              opponentChoice={opponentChoice}
              gameState={gameState}
              result={gameResult}
            />

            {/* Status */}
            {isWaiting && (
              <div className="flex items-center gap-2 text-purple-300 text-sm">
                <span className="inline-block w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
                {isIBM ? "Waiting for IBM Quantum hardware…" : "Quantum opponent deciding…"}
              </div>
            )}

            {/* Choice buttons or Play Again */}
            {!isWaiting && (
              <div className="flex flex-col items-center gap-4">
                {isDone ? (
                  <button
                    onClick={handleReset}
                    className="px-8 py-3 rounded-2xl font-semibold text-sm text-white transition-all"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                      boxShadow: "0 0 20px rgba(124,58,237,0.3), 0 4px 15px rgba(0,0,0,0.3)",
                      border: "1px solid rgba(167,139,250,0.4)",
                    }}
                  >
                    Play Again
                  </button>
                ) : (
                  <>
                    <p className="text-sm text-slate-400">Pick your move:</p>
                    <div className="flex gap-3">
                      {(["rock", "paper", "scissors"] as Choice[]).map((c) => (
                        <ChoiceButton
                          key={c}
                          choice={c}
                          selected={playerChoice === c}
                          disabled={isWaiting}
                          onClick={() => handlePlay(c)}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600">Click a choice to play immediately</p>
                  </>
                )}
              </div>
            )}

            <Link href="/projects/quantum-rock-paper-scissors/docs"
              className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
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
                  {isIBM ? "Live log from real IBM quantum hardware" : "Quantum opponent's decision process"}
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
                    <span className="text-2xl">✊</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 font-medium">Pick a move to start</p>
                    <p className="text-xs text-slate-600 mt-1 max-w-[220px]">
                      {isIBM
                        ? "Live events from IBM Quantum hardware will stream here"
                        : "The quantum circuit steps will appear here as they run"}
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
                {isDone && gameResult && playerChoice && opponentChoice
                  ? `You played ${CHOICE_LABEL[playerChoice]}, opponent played ${CHOICE_LABEL[opponentChoice]}. ${
                      gameResult === "win" ? "You win!" : gameResult === "lose" ? "You lose." : "It's a draw."
                    } ${isIBM ? "Certified by real IBM quantum hardware." : "Certified by quantum measurement."}`
                  : isIBM
                  ? "The quantum opponent runs on real IBM processors cooled to near absolute zero."
                  : "The opponent's choice doesn't exist until the moment of measurement."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
