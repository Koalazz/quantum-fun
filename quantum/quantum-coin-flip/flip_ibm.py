"""
Quantum Coin Flip — flip_ibm.py
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


def emit(step: int, status: str, message: str, **kwargs) -> None:
    payload = {"step": step, "status": status, "message": message, **kwargs}
    print(json.dumps(payload), flush=True)


def _status_str(status: object) -> str:
    if hasattr(status, "name"):
        return str(status.name).upper()
    if hasattr(status, "value"):
        return str(status.value).upper()
    return str(status).upper()


def flip_quantum_coin_ibm() -> None:
    api_key = os.environ.get("IBM_QUANTUM_API_KEY")
    if not api_key:
        emit(0, "error", "IBM_QUANTUM_API_KEY not set. Configure it in .env.local.")
        sys.exit(1)

    # ── Step 1: Build the circuit ──────────────────────────────────────────
    emit(1, "building",
         "Building quantum circuit — placing one Hadamard gate on 1 qubit",
         circuit=(
             "     ┌───┐ ┌─┐\n"
             "q_0: ┤ H ├─┤M├\n"
             "     └───┘ └╥┘\n"
             "meas: ══════╩═"
         ),
         detail=(
             "The Hadamard (H) gate transforms |0⟩ into an equal superposition: "
             "(|0⟩ + |1⟩)/√2. The qubit is now simultaneously heads AND tails — "
             "not one or the other, but genuinely both at once."
         ))

    from qiskit import QuantumCircuit

    qc = QuantumCircuit(1)
    qc.h(0)
    qc.measure_all()

    time.sleep(0.8)

    # ── Step 2: Superposition explained ────────────────────────────────────
    emit(2, "superposition",
         "Qubit is now in perfect 50/50 superposition — heads AND tails simultaneously",
         states={"0 (Tails)": "50%", "1 (Heads)": "50%"},
         detail=(
             "Unlike a spinning coin (which is classically in one state, just unknown), "
             "this qubit genuinely occupies both |0⟩ and |1⟩ with equal amplitude. "
             "The state |ψ⟩ = (|0⟩ + |1⟩)/√2 has no classical equivalent."
         ))
    time.sleep(0.6)

    # ── Step 3: Connect to IBM Quantum ──────────────────────────────────────
    emit(3, "connecting",
         "Connecting to IBM Quantum Cloud — authenticating and finding least busy hardware...",
         backend_type="ibm_quantum_cloud",
         detail=(
             "Authenticating with IBM Quantum and selecting the least busy real quantum "
             "processor with at least 1 qubit. Unlike a simulator, this is genuinely "
             "random — caused by quantum measurement on superconducting qubits."
         ))

    from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler
    from qiskit.transpiler import generate_preset_pass_manager

    service = QiskitRuntimeService(channel="ibm_quantum_platform", token=api_key)
    backend = service.least_busy(simulator=False, operational=True, min_num_qubits=1)

    emit(3, "connecting",
         f"Connected to {backend.name} — {backend.num_qubits} qubits · transpiling circuit...",
         backend=backend.name,
         backend_type="ibm_quantum_cloud",
         detail=(
             f"Selected {backend.name}, a real IBM superconducting quantum processor. "
             "The circuit must be transpiled (compiled) to match this hardware's specific "
             "qubit connectivity and native gate set before it can run."
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
             f"Job {job_id} is queued on {backend.name}. IBM quantum processors are "
             "cooled to ~15 millikelvin (colder than outer space) to keep qubits coherent. "
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
                 "IBM quantum processors serve researchers worldwide. "
                 f"Your job status is {status}. Checking again in {sleep_secs}s. "
                 "Once it reaches the front, execution takes only milliseconds."
             ))
        time.sleep(sleep_secs)

    # ── Retrieve results ────────────────────────────────────────────────────
    pub_result = job.result()[0]
    counts = pub_result.data.meas.get_counts()

    raw_bit = list(counts.keys())[0]
    raw_value = int(raw_bit, 2)
    side = "Heads" if raw_value == 1 else "Tails"

    # ── Step 5: Wavefunction collapsed ─────────────────────────────────────
    emit(5, "measured",
         f"Real qubit collapsed! Hardware measurement returned: {raw_bit}",
         raw_bits=raw_bit,
         raw_value=raw_value,
         backend=backend.name,
         detail=(
             f"The real quantum processor collapsed its qubit from superposition to "
             f"|{raw_bit}⟩. This randomness is not algorithmic — it is a direct consequence "
             "of quantum measurement on physical superconducting qubits."
         ))
    time.sleep(0.4)

    # ── Step 6: Final result ────────────────────────────────────────────────
    emit(6, "result",
         f"Quantum coin landed: {side} — certified by real IBM quantum hardware",
         side=side.lower(),
         raw_bits=raw_bit,
         raw_value=raw_value,
         backend=backend.name)


if __name__ == "__main__":
    try:
        flip_quantum_coin_ibm()
    except Exception as exc:
        emit(0, "error", str(exc))
        sys.exit(1)
