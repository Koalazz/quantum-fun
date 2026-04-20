"""
Quantum Magic 8-Ball — ask_ibm.py
IBM Quantum Cloud version. Streams JSON status events to stdout for the web UI.
Uses qiskit-ibm-runtime to run on real IBM quantum hardware.
"""

import json
import logging
import os
import sys
import time

logging.getLogger("qiskit_ibm_runtime").setLevel(logging.ERROR)
logging.getLogger("qiskit").setLevel(logging.ERROR)

ANSWERS = [
    "It is certain",
    "Without a doubt",
    "Yes, definitely",
    "Most likely",
    "Reply hazy, try again",
    "Ask again later",
    "Don't count on it",
    "Very doubtful",
]

ANSWER_TONE = [
    "positive", "positive", "positive", "positive",
    "neutral", "neutral", "negative", "negative",
]


def emit(step: int, status: str, message: str, **kwargs) -> None:
    payload = {"step": step, "status": status, "message": message, **kwargs}
    print(json.dumps(payload), flush=True)


def _status_str(status: object) -> str:
    if hasattr(status, "name"):
        return str(status.name).upper()
    if hasattr(status, "value"):
        return str(status.value).upper()
    return str(status).upper()


def ask_quantum_8ball_ibm() -> None:
    api_key = os.environ.get("IBM_QUANTUM_API_KEY")
    if not api_key:
        emit(0, "error", "IBM_QUANTUM_API_KEY not set. Configure it in .env.local.")
        sys.exit(1)

    # ── Step 1: Build the circuit ──────────────────────────────────────────
    emit(1, "building",
         "Building quantum circuit — placing Hadamard gates on 3 qubits",
         circuit=(
             "     ┌───┐ ┌─┐\n"
             "q_0: ┤ H ├─┤M├──\n"
             "     ├───┤ └╥┘┌─┐\n"
             "q_1: ┤ H ├──╫─┤M├\n"
             "     ├───┤  ║ └╥┘┌─┐\n"
             "q_2: ┤ H ├──╫──╫─┤M├\n"
             "     └───┘  ║  ║ └╥┘\n"
             "meas: ══════╩══╩══╩═"
         ),
         detail=(
             "Three Hadamard gates create 2³ = 8 equally probable outcomes (000–111). "
             "Each outcome maps to one of the 8 Magic 8-Ball answers. "
             "The universe itself chooses your answer."
         ))

    from qiskit import QuantumCircuit

    qc = QuantumCircuit(3)
    qc.h(0)
    qc.h(1)
    qc.h(2)
    qc.measure_all()

    time.sleep(0.8)

    # ── Step 2: Superposition explained ────────────────────────────────────
    emit(2, "superposition",
         "All 8 answers exist simultaneously in quantum superposition",
         states={
             "000": "12.5%", "001": "12.5%", "010": "12.5%", "011": "12.5%",
             "100": "12.5%", "101": "12.5%", "110": "12.5%", "111": "12.5%",
         },
         detail=(
             "The 3 qubits hold all 8 possible answers at once in genuine quantum superposition. "
             "No classical system can replicate this with a single register."
         ))
    time.sleep(0.6)

    # ── Step 3: Connect to IBM Quantum ──────────────────────────────────────
    emit(3, "connecting",
         "Connecting to IBM Quantum Cloud — consulting the real quantum oracle...",
         backend_type="ibm_quantum_cloud",
         detail=(
             "Authenticating with IBM Quantum and selecting the least busy real quantum "
             "processor with at least 3 qubits."
         ))

    from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler
    from qiskit.transpiler import generate_preset_pass_manager

    service = QiskitRuntimeService(channel="ibm_quantum_platform", token=api_key)
    backend = service.least_busy(simulator=False, operational=True, min_num_qubits=3)

    emit(3, "connecting",
         f"Connected to {backend.name} — {backend.num_qubits} qubits · transpiling circuit...",
         backend=backend.name,
         backend_type="ibm_quantum_cloud",
         detail=(
             f"Selected {backend.name}, a real IBM superconducting quantum processor. "
             "Transpiling the circuit to match this hardware's native gate set."
         ))

    pm = generate_preset_pass_manager(backend=backend, optimization_level=1)
    isa_circuit = pm.run(qc)

    # ── Step 4: Submit job ─────────────────────────────────────────────────
    sampler = Sampler(mode=backend)
    job = sampler.run([isa_circuit], shots=1)
    job_id = job.job_id()

    emit(4, "running",
         f"Job submitted — ID: {job_id[:16]}… — waiting in hardware queue",
         job_id=job_id,
         shots=1,
         detail=(
             f"Job {job_id} is queued on {backend.name}. "
             "IBM quantum processors are cooled to ~15 millikelvin. "
             "Your job waits its turn, then runs in milliseconds on real qubits."
         ))

    # ── Poll until job completes ────────────────────────────────────────────
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
             job_id=job_id,
             poll_count=poll_count,
             queue_status=status,
             detail=(
                 f"Your job status is {status}. Checking again in {sleep_secs}s."
             ))
        time.sleep(sleep_secs)

    # ── Retrieve results ────────────────────────────────────────────────────
    pub_result = job.result()[0]
    counts = pub_result.data.meas.get_counts()

    raw_bits = list(counts.keys())[0]
    raw_value = int(raw_bits, 2)
    answer = ANSWERS[raw_value]
    tone = ANSWER_TONE[raw_value]

    # ── Step 5: Wavefunction collapsed ─────────────────────────────────────
    emit(5, "measured",
         f"Real qubits collapsed! Hardware measurement returned: {raw_bits}",
         raw_bits=raw_bits,
         raw_value=raw_value,
         backend=backend.name,
         detail=(
             f"The real quantum processor collapsed its qubits to |{raw_bits}⟩. "
             f"In binary, {raw_bits} = {raw_value}. "
             "This randomness comes directly from physical quantum measurement."
         ))
    time.sleep(0.4)

    # ── Step 6: Map to answer ───────────────────────────────────────────────
    emit(6, "mapping",
         f"Mapping binary {raw_bits} → answer #{raw_value + 1}: \"{answer}\"",
         raw_bits=raw_bits,
         raw_value=raw_value,
         answer=answer,
         tone=tone,
         mapping_table={
             "000 (0)": ANSWERS[0],
             "001 (1)": ANSWERS[1],
             "010 (2)": ANSWERS[2],
             "011 (3)": ANSWERS[3],
             "100 (4)": ANSWERS[4],
             "101 (5)": ANSWERS[5],
             "110 (6)": ANSWERS[6],
             "111 (7)": ANSWERS[7],
         },
         detail=(
             "Each of the 8 binary outcomes maps directly to one Magic 8-Ball answer. "
             "No rejection sampling needed — 8 outcomes fit 8 answers perfectly."
         ))
    time.sleep(0.2)

    # ── Step 7: Final result ────────────────────────────────────────────────
    emit(7, "result",
         f"The quantum oracle speaks: \"{answer}\" — certified by real IBM quantum hardware",
         answer=answer,
         tone=tone,
         raw_bits=raw_bits,
         raw_value=raw_value,
         backend=backend.name)


if __name__ == "__main__":
    try:
        ask_quantum_8ball_ibm()
    except Exception as exc:
        emit(0, "error", str(exc))
        sys.exit(1)
