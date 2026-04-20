"""
Quantum Rock Paper Scissors — play_ibm.py
IBM Quantum Cloud version. Streams JSON status events to stdout.
"""

import json
import logging
import os
import random
import sys
import time

logging.getLogger("qiskit_ibm_runtime").setLevel(logging.ERROR)
logging.getLogger("qiskit").setLevel(logging.ERROR)

CHOICES = {0: "rock", 1: "paper", 2: "scissors"}
CHOICE_EMOJIS = {"rock": "✊", "paper": "🖐", "scissors": "✌️"}


def emit(step: int, status: str, message: str, **kwargs) -> None:
    payload = {"step": step, "status": status, "message": message, **kwargs}
    print(json.dumps(payload), flush=True)


def _status_str(status: object) -> str:
    if hasattr(status, "name"):
        return str(status.name).upper()
    if hasattr(status, "value"):
        return str(status.value).upper()
    return str(status).upper()


def game_result(opponent: str, player: str) -> str:
    if opponent == player:
        return "draw"
    wins = {("rock", "scissors"), ("scissors", "paper"), ("paper", "rock")}
    return "win" if (player, opponent) in wins else "lose"


def play_quantum_rps_ibm(player_choice: str) -> None:
    api_key = os.environ.get("IBM_QUANTUM_API_KEY")
    if not api_key:
        emit(0, "error", "IBM_QUANTUM_API_KEY not set. Configure it in .env.local.")
        sys.exit(1)

    emit(1, "building",
         "Building quantum circuit — opponent prepares 2 qubits in superposition",
         circuit=(
             "     ┌───┐ ┌─┐\n"
             "q_0: ┤ H ├─┤M├─\n"
             "     ├───┤ └╥┘┌─┐\n"
             "q_1: ┤ H ├──╫─┤M├\n"
             "     └───┘  ║ └╥┘\n"
             "meas: ══════╩══╩═"
         ),
         detail=(
             "Two Hadamard gates create 4 equally probable states: 00, 01, 10, 11. "
             "We map 00→Rock, 01→Paper, 10→Scissors and reject 11 (rejection sampling)."
         ))

    from qiskit import QuantumCircuit

    qc = QuantumCircuit(2)
    qc.h(0)
    qc.h(1)
    qc.measure_all()

    time.sleep(0.8)

    emit(2, "superposition",
         "Opponent's qubits are in superposition — all 3 choices exist simultaneously",
         states={"00": "25%", "01": "25%", "10": "25%", "11": "25% (reject)"},
         detail=(
             "Before measurement, the opponent has no choice — they are in all states at once. "
             "No prediction is possible, even in principle."
         ))
    time.sleep(0.6)

    emit(3, "connecting",
         "Connecting to IBM Quantum Cloud — opponent consulting real quantum hardware...",
         backend_type="ibm_quantum_cloud",
         detail="Authenticating with IBM Quantum and selecting least busy processor with ≥ 2 qubits.")

    from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler
    from qiskit.transpiler import generate_preset_pass_manager

    service = QiskitRuntimeService(channel="ibm_quantum_platform", token=api_key)
    backend = service.least_busy(simulator=False, operational=True, min_num_qubits=2)

    emit(3, "connecting",
         f"Connected to {backend.name} — {backend.num_qubits} qubits · transpiling circuit...",
         backend=backend.name,
         backend_type="ibm_quantum_cloud")

    pm = generate_preset_pass_manager(backend=backend, optimization_level=1)
    isa_circuit = pm.run(qc)

    sampler = Sampler(mode=backend)
    job = sampler.run([isa_circuit], shots=16)
    job_id = job.job_id()

    emit(4, "running",
         f"Job submitted — ID: {job_id[:16]}… — waiting in hardware queue",
         job_id=job_id,
         shots=16,
         detail=f"Job queued on {backend.name}. Running 16 shots to enable rejection sampling.")

    POLL_INTERVALS = [5, 10, 15, 20, 30]
    MAX_WAIT_SECONDS = 1200
    start_time = time.time()
    poll_count = 0

    while True:
        if time.time() - start_time > MAX_WAIT_SECONDS:
            emit(0, "error", f"Timeout: job took longer than 20 minutes. Job ID: {job_id}")
            sys.exit(1)

        try:
            raw_status = job.status()
            status = _status_str(raw_status)
        except Exception as exc:
            emit(0, "error", f"Failed to check job status: {exc}")
            sys.exit(1)

        if status == "DONE":
            break
        if status in ("ERROR", "CANCELLED", "FAILED"):
            emit(0, "error", f"IBM Quantum job {status.lower()}. Job ID: {job_id}")
            sys.exit(1)

        poll_count += 1
        sleep_secs = POLL_INTERVALS[min(poll_count - 1, len(POLL_INTERVALS) - 1)]
        msg = (
            f"Running on {backend.name}… (check #{poll_count})"
            if "RUN" in status
            else f"In hardware queue… (check #{poll_count})"
        )
        emit(4, "queued", msg,
             job_id=job_id, poll_count=poll_count, queue_status=status,
             detail=f"Status: {status}. Checking again in {sleep_secs}s.")
        time.sleep(sleep_secs)

    pub_result = job.result()[0]
    counts = pub_result.data.meas.get_counts()

    valid = [(bits, cnt) for bits, cnt in counts.items() if int(bits, 2) <= 2]
    if not valid:
        emit(0, "error", "All shots returned value 3 — extremely unlikely. Please retry.")
        sys.exit(1)

    pool: list[str] = []
    for bits, cnt in valid:
        pool.extend([bits] * cnt)
    chosen_bits = random.choice(pool)
    raw_value = int(chosen_bits, 2)
    opponent_choice = CHOICES[raw_value]
    result_str = game_result(opponent_choice, player_choice)

    emit(5, "measured",
         f"Real qubits collapsed! Hardware measurement returned: {chosen_bits}",
         raw_bits=chosen_bits,
         raw_value=raw_value,
         backend=backend.name,
         detail=f"The quantum processor collapsed its qubits to |{chosen_bits}⟩ = {raw_value}.")
    time.sleep(0.4)

    emit(6, "mapping",
         f"Mapping {chosen_bits} → {raw_value} → {opponent_choice} {CHOICE_EMOJIS[opponent_choice]}",
         raw_bits=chosen_bits,
         raw_value=raw_value,
         opponent_choice=opponent_choice,
         mapping_table={
             "00 (0)": "Rock ✊",
             "01 (1)": "Paper 🖐",
             "10 (2)": "Scissors ✌️",
             "11 (3)": "Rejected — re-roll",
         })
    time.sleep(0.2)

    emit(7, "result",
         f"Opponent plays {opponent_choice} {CHOICE_EMOJIS[opponent_choice]} — you {result_str}! — certified by IBM quantum hardware",
         opponent_choice=opponent_choice,
         player_choice=player_choice,
         result=result_str,
         raw_bits=chosen_bits,
         raw_value=raw_value,
         backend=backend.name)


if __name__ == "__main__":
    choice = sys.argv[1] if len(sys.argv) > 1 else "rock"
    try:
        play_quantum_rps_ibm(choice)
    except Exception as exc:
        emit(0, "error", str(exc))
        sys.exit(1)
