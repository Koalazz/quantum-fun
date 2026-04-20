import { spawn } from "child_process";
import path from "path";

export const dynamic = "force-dynamic";

const VALID_CHOICES = new Set(["rock", "paper", "scissors"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") ?? "ibm";
  const playerChoice = searchParams.get("choice") ?? "rock";

  if (!VALID_CHOICES.has(playerChoice)) {
    return new Response(JSON.stringify({ error: "Invalid choice" }), { status: 400 });
  }

  const scriptDir = path.join(process.cwd(), "quantum", "quantum-rock-paper-scissors");
  const pythonPath =
    process.env.QUANTUM_RPS_PYTHON ??
    process.env.QUANTUM_DICE_PYTHON ??
    path.join(scriptDir, ".venv", "bin", "python");

  const scriptFile = mode === "local" ? "play.py" : "play_ibm.py";
  const scriptPath = path.join(scriptDir, scriptFile);

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const env: NodeJS.ProcessEnv = {
        ...process.env,
        IBM_QUANTUM_API_KEY: process.env.IBM_QUANTUM_API_KEY ?? "",
      };

      const py = spawn(pythonPath, [scriptPath, playerChoice], { cwd: scriptDir, env });

      let buffer = "";

      py.stdout.on("data", (data: Buffer) => {
        buffer += data.toString();
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed) {
            controller.enqueue(encoder.encode(`data: ${trimmed}\n\n`));
          }
        }
      });

      py.stderr.on("data", (data: Buffer) => {
        const msg = JSON.stringify({
          step: 0,
          status: "error",
          message: data.toString().trim(),
        });
        controller.enqueue(encoder.encode(`data: ${msg}\n\n`));
      });

      py.on("close", (code) => {
        if (buffer.trim()) {
          controller.enqueue(encoder.encode(`data: ${buffer.trim()}\n\n`));
        }
        if (code !== 0 && code !== null) {
          const msg = JSON.stringify({
            step: 0,
            status: "error",
            message: `Python process exited with code ${code}`,
          });
          controller.enqueue(encoder.encode(`data: ${msg}\n\n`));
        }
        controller.close();
      });

      py.on("error", (err) => {
        const msg = JSON.stringify({
          step: 0,
          status: "error",
          message: `Failed to start process: ${err.message}`,
        });
        controller.enqueue(encoder.encode(`data: ${msg}\n\n`));
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
