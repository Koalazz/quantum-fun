export type Difficulty = "beginner" | "intermediate" | "advanced";
export type Status = "available" | "coming-soon";

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  difficulty: Difficulty;
  status: Status;
  concepts: string[];
  qubits: number;
  estimatedTime: string;
  order: number;
}

export const projects: Project[] = [
  {
    id: "hello-world",
    slug: "hello-world",
    title: "Hello Quantum World",
    tagline: "Your first entangled qubits on real quantum hardware",
    description:
      "Create a Bell state — two entangled qubits — and measure correlations that prove quantum entanglement is real. This is the canonical first program every quantum developer writes.",
    difficulty: "beginner",
    status: "available",
    concepts: ["Superposition", "Entanglement", "Bell States", "Measurement"],
    qubits: 2,
    estimatedTime: "10 min",
    order: 1,
  },
  {
    id: "quantum-coin-flip",
    slug: "quantum-coin-flip",
    title: "Quantum Coin Flip",
    tagline: "The most perfect coin flip in the universe",
    description:
      "A single Hadamard gate creates a perfect 50/50 superposition. Unlike classical random, this is provably unbiased — guaranteed by physics.",
    difficulty: "beginner",
    status: "available",
    concepts: ["Hadamard Gate", "Superposition", "Measurement"],
    qubits: 1,
    estimatedTime: "5 min",
    order: 2,
  },
  {
    id: "quantum-dice",
    slug: "quantum-dice",
    title: "Quantum Dice",
    tagline: "Roll a truly random die — certified by quantum mechanics",
    description:
      "Use 3 qubits in superposition to generate 8 possible outcomes. Discard 7 and 8 to get a fair 6-sided die with randomness guaranteed by quantum physics.",
    difficulty: "beginner",
    status: "available",
    concepts: ["Multi-qubit Superposition", "Classical Post-processing", "QRNG"],
    qubits: 3,
    estimatedTime: "10 min",
    order: 3,
  },
  {
    id: "quantum-magic-8-ball",
    slug: "quantum-magic-8-ball",
    title: "Quantum Magic 8-Ball",
    tagline: "Ask the universe — it answers with quantum randomness",
    description:
      "Map 8 quantum measurement outcomes to 8 classic Magic 8-Ball answers. The universe itself decides your fortune.",
    difficulty: "beginner",
    status: "available",
    concepts: ["Superposition", "Measurement", "Classical Mapping"],
    qubits: 3,
    estimatedTime: "10 min",
    order: 4,
  },
  {
    id: "quantum-rock-paper-scissors",
    slug: "quantum-rock-paper-scissors",
    title: "Quantum Rock Paper Scissors",
    tagline: "Play against a quantum opponent you can never predict",
    description:
      "An entangled quantum opponent makes choices that are fundamentally unpredictable — not just hard to guess, but physically impossible to predict.",
    difficulty: "beginner",
    status: "coming-soon",
    concepts: ["Entanglement", "Game Theory", "Measurement"],
    qubits: 2,
    estimatedTime: "15 min",
    order: 5,
  },
  {
    id: "quantum-teleportation",
    slug: "quantum-teleportation",
    title: "Quantum Teleportation",
    tagline: "Transfer a qubit state across space using entanglement",
    description:
      "Implement the quantum teleportation protocol — no information travels faster than light, but a quantum state is perfectly reconstructed on a remote qubit.",
    difficulty: "intermediate",
    status: "coming-soon",
    concepts: ["Entanglement", "Bell Measurement", "Classical Communication", "Teleportation Protocol"],
    qubits: 3,
    estimatedTime: "20 min",
    order: 6,
  },
  {
    id: "grovers-search",
    slug: "grovers-search",
    title: "Grover's Search",
    tagline: "Find a needle in a haystack quadratically faster",
    description:
      "Grover's algorithm finds a marked item in an unsorted list in O(√N) steps instead of O(N). One of the most famous examples of quantum speedup.",
    difficulty: "intermediate",
    status: "coming-soon",
    concepts: ["Amplitude Amplification", "Oracle", "Quadratic Speedup"],
    qubits: 4,
    estimatedTime: "30 min",
    order: 7,
  },
  {
    id: "quantum-key-distribution",
    slug: "quantum-key-distribution",
    title: "Quantum Key Distribution (BB84)",
    tagline: "Simulate unbreakable encryption with quantum physics",
    description:
      "Implement the BB84 protocol — the first quantum cryptography scheme. Any eavesdropper disturbs the quantum states, making interception detectable.",
    difficulty: "advanced",
    status: "coming-soon",
    concepts: ["BB84 Protocol", "Quantum Cryptography", "No-Cloning Theorem"],
    qubits: 8,
    estimatedTime: "45 min",
    order: 8,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const difficultyColors: Record<Difficulty, string> = {
  beginner: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  intermediate: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  advanced: "text-rose-400 bg-rose-400/10 border-rose-400/30",
};
