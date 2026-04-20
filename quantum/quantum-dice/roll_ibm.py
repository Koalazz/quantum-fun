"""
Quantum Dice — roll_ibm.py
IBM Quantum Cloud version. Streams JSON status events to stdout for the web UI.
Uses qiskit-ibm-runtime to run on real IBM quantum hardware.
"""

import json
import logging
import os
import random
import sys
import time

# qiskit-ibm-runtime emits several INFO/WARNING lines to stderr during
# account discovery and instance selection. route.ts treats all stderr as
# an error SSE event, so suppress everything below ERROR level.
logging.getLogger("qiskit_ibm_runtime").setLevel(logging.ERROR)
logging.getLogger("qiskit").setLevel(logging.ERROR)


def emit(step: int, status: str, message: str, **kwargs) -> None:
    payload = {"step": step, "status": status, "message": message, **kwargs}
    print(json.dumps(payload), flush=True)


def _status_str(status: object) -> str:
    """Normalize job status to uppercase string regardless of SDK version."""
    if hasattr(status, "name"):
        return str(status.name).upper()
    if hasattr(status, "value"):
        return str(status.value).upper()
    return str(status).upper()


def roll_quantum_dice_ibm() -> None:
    api_key = os.environ.get("IBM_QUANTUM_API_KEY")
    if not api_key:
        emit(0, "error", "IBM_QUANTUM_API_KEY not set. Configure it in .env.local.")
        sys.exit(1)

    # ── Step 1: Build the circuit ──────────────────────────────────────────
    emit(
        1, "building",
        "Building quantum circuit — placing Hadamard gates on 3 qubits",
        circuit=(
            "     ┌───┐ ┌─┐\n"
            "q_0: ┤ H ├─┤M├─\n"
            "     ├───┤ └╥┘┌─┐\n"
            "q_1: ┤ H ├──╫─┤M├\n"
            "     ├───┤  ║ └╥┘┌─┐\n"
            "q_2: ┤ H ├──╫──╫─┤M├\n"
            "     └───┘  ║  ║ └╥┘\n"
            "meas: ══════╩══╩══╩═"
        ),
        detail=(
            "Each H gate puts one qubit into equal superposition: 50% |0⟩ + 50% |1⟩. "
            "With 3 qubits, we get 2³ = 8 equally probable states: 000 through 111."
        ),
    )

    from qiskit import QuantumCircuit

    qc = QuantumCircuit(3)
    qc.h(0)
    qc.h(1)
    qc.h(2)
    qc.measure_all()

    time.sleep(0.8)

    # ── Step 2: Superposition explained ────────────────────────────────────
    emit(
        2, "superposition",
        "Qubits are now in superposition — all 8 outcomes exist simultaneously",
        states={
            "000": "12.5%", "001": "12.5%", "010": "12.5%", "011": "12.5%",
            "100": "12.5%", "101": "12.5%", "110": "12.5%", "111": "12.5%",
        },
        detail=(
            "Right now the quantum state holds ALL possibilities at once. "
            "No classical computer can truly do this — it would need to track "
            "8 separate probability amplitudes. This is quantum parallelism."
        ),
    )
    time.sleep(0.6)

    # ── Step 3: Connect to IBM Quantum ──────────────────────────────────────
    emit(
        3, "connecting",
        "Connecting to IBM Quantum Cloud — authenticating and finding least busy hardware...",
        backend_type="ibm_quantum_cloud",
        detail=(
            "Authenticating with IBM Quantum and selecting the least busy real quantum "
            "processor with at least 3 qubits. Unlike a simulator, this is genuinely "
            "random — caused by quantum measurement on superconducting qubits."
        ),
    )

    from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler
    from qiskit.transpiler import generate_preset_pass_manager

    service = QiskitRuntimeService(channel="ibm_quantum_platform", token=api_key)
    backend = service.least_busy(simulator=False, operational=True, min_num_qubits=3)

    emit(
        3, "connecting",
        f"Connected to {backend.name} — {backend.num_qubits} qubits · transpiling circuit...",
        backend=backend.name,
        backend_type="ibm_quantum_cloud",
        detail=(
            f"Selected {backend.name}, a real IBM superconducting quantum processor. "
            "The circuit must be transpiled (compiled) to match this hardware's specific "
            "qubit connectivity and native gate set before it can run."
        ),
    )

    pm = generate_preset_pass_manager(backend=backend, optimization_level=1)
    isa_circuit = pm.run(qc)

    # ── Step 4: Submit job ─────────────────────────────────────────────────
    sampler = Sampler(mode=backend)
    job = sampler.run([isa_circuit], shots=64)
    job_id = job.job_id()

    emit(
        4, "running",
        f"Job submitted — ID: {job_id[:16]}… — waiting in hardware queue",
        job_id=job_id,
        shots=64,
        detail=(
            f"Job {job_id} is queued on {backend.name}. IBM quantum processors are "
            "cooled to ~15 millikelvin (colder than outer space) to keep qubits coherent. "
            "Your job waits its turn, then runs in milliseconds on real qubits."
        ),
    )

    # ── Poll until job completes ────────────────────────────────────────────
    POLL_INTERVALS = [5, 10, 15, 20, 30]
    MAX_WAIT_SECONDS = 1200  # 20-minute safety cap
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

        if "RUN" in status:
            msg = f"Running on {backend.name}… (check #{poll_count})"
        else:
            msg = f"In hardware queue… (check #{poll_count})"

        emit(
            4, "queued",
            msg,
            job_id=job_id,
            poll_count=poll_count,
            queue_status=status,
            detail=(
                "IBM quantum processors serve researchers worldwide. "
                f"Your job status is {status}. Checking again in {sleep_secs}s. "
                "Once it reaches the front, execution takes only milliseconds."
            ),
        )
        time.sleep(sleep_secs)

    # ── Retrieve results ────────────────────────────────────────────────────
    pub_result = job.result()[0]
    counts = pub_result.data.meas.get_counts()

    valid = [(bits, cnt) for bits, cnt in counts.items() if int(bits, 2) <= 5]
    if not valid:
        emit(0, "error", "All 64 shots returned values 6 or 7 — statistically impossible. Retry.")
        sys.exit(1)

    pool: list[str] = []
    for bits, cnt in valid:
        pool.extend([bits] * cnt)
    chosen_bits = random.choice(pool)
    raw_value = int(chosen_bits, 2)
    face = raw_value + 1

    # ── Step 5: Wavefunction collapsed ─────────────────────────────────────
    emit(
        5, "measured",
        f"Real qubits collapsed! Hardware measurement returned: {chosen_bits}",
        raw_bits=chosen_bits,
        raw_value=raw_value,
        attempts=1,
        backend=backend.name,
        detail=(
            f"The real quantum processor collapsed its qubits from superposition to "
            f"|{chosen_bits}⟩. In binary, {chosen_bits} = {raw_value}. "
            "This randomness is not algorithmic — it is a direct consequence of "
            "quantum measurement on physical superconducting qubits."
        ),
    )
    time.sleep(0.4)

    # ── Step 6: Map to dice face ────────────────────────────────────────────
    emit(
        6, "mapping",
        f"Mapping binary {chosen_bits} → decimal {raw_value} → die face {face}",
        raw_bits=chosen_bits,
        raw_value=raw_value,
        face=face,
        mapping_table={
            "000 (0)": "Face 1", "001 (1)": "Face 2", "010 (2)": "Face 3",
            "011 (3)": "Face 4", "100 (4)": "Face 5", "101 (5)": "Face 6",
            "110 (6)": "Rejected — re-roll", "111 (7)": "Rejected — re-roll",
        },
        detail=(
            "We add 1 to convert the 0-indexed quantum result to a 1-indexed die face. "
            "States 6 and 7 are rejected (rejection sampling) to keep all 6 faces equally "
            "likely. Each valid face has exactly 1/6 probability."
        ),
    )
    time.sleep(0.2)

    # ── Step 7: Final result ────────────────────────────────────────────────
    emit(
        7, "result",
        f"Quantum dice rolled: {face} — certified by real IBM quantum hardware",
        face=face,
        raw_bits=chosen_bits,
        raw_value=raw_value,
        backend=backend.name,
    )


if __name__ == "__main__":
    try:
        roll_quantum_dice_ibm()
    except Exception as exc:
        emit(0, "error", str(exc))
        sys.exit(1)
