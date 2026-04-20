"use client";

import { forwardRef, useRef, useEffect, useImperativeHandle, useCallback } from "react";

// Rotation applied to the cube to bring each face to the front
const FACE_ROTATIONS: Record<number, { x: number; y: number }> = {
  1: { x: 0, y: 0 },
  2: { x: 90, y: 0 },
  3: { x: 0, y: -90 },
  4: { x: 0, y: 90 },
  5: { x: -90, y: 0 },
  6: { x: 0, y: 180 },
};

// SVG dot positions [cx, cy] in a 100×100 viewBox
const DOT_POSITIONS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[72, 28], [28, 72]],
  3: [[72, 28], [50, 50], [28, 72]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
  6: [[28, 22], [72, 22], [28, 50], [72, 50], [28, 78], [72, 78]],
};

function DiceFace({ number }: { number: number }) {
  const dots = DOT_POSITIONS[number] ?? [];
  return (
    <div
      className="absolute inset-0 rounded-2xl flex items-center justify-center"
      style={{
        background: "linear-gradient(145deg, #ffffff 0%, #e8e8f0 100%)",
        border: "1.5px solid rgba(180,180,210,0.6)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -2px 4px rgba(0,0,0,0.12)",
      }}
    >
      <svg viewBox="0 0 100 100" className="w-3/4 h-3/4">
        {dots.map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={8.5}
            fill="#1e0a4a"
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
          />
        ))}
      </svg>
    </div>
  );
}

export interface DiceHandle {
  startRoll: () => void;
  showResult: (face: number) => void;
  stopRoll: () => void;
}

interface Props {
  size?: number;
}

const QuantumDice3D = forwardRef<DiceHandle, Props>(function QuantumDice3D(
  { size = 150 },
  ref
) {
  const cubeRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const rotRef = useRef({ x: -20, y: 30 });
  const velRef = useRef({ x: 0, y: 0 });
  const isRollingRef = useRef(false);
  const half = size / 2;

  const tick = useCallback(() => {
    if (!cubeRef.current || !isRollingRef.current) return;
    rotRef.current.x += velRef.current.x;
    rotRef.current.y += velRef.current.y;
    // Small random wobble for tumbling feel
    velRef.current.x += (Math.random() - 0.5) * 0.8;
    velRef.current.y += (Math.random() - 0.5) * 0.8;
    // Keep velocity in a lively range
    velRef.current.x = Math.max(-14, Math.min(14, velRef.current.x));
    velRef.current.y = Math.max(-14, Math.min(14, velRef.current.y));
    cubeRef.current.style.transform =
      `rotateX(${rotRef.current.x}deg) rotateY(${rotRef.current.y}deg)`;
    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  useImperativeHandle(ref, () => ({
    startRoll() {
      if (!cubeRef.current) return;
      isRollingRef.current = true;
      cubeRef.current.style.transition = "none";
      velRef.current = {
        x: 9 + Math.random() * 5,
        y: 7 + Math.random() * 5,
      };
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(tick);
    },

    showResult(face: number) {
      if (!cubeRef.current) return;
      isRollingRef.current = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      const target = FACE_ROTATIONS[face] ?? { x: 0, y: 0 };
      // Snap to the nearest clean multiple of 360, then add the face offset
      const baseX = Math.round(rotRef.current.x / 360) * 360;
      const baseY = Math.round(rotRef.current.y / 360) * 360;
      const finalX = baseX + target.x;
      const finalY = baseY + target.y;
      cubeRef.current.style.transition =
        "transform 1.5s cubic-bezier(0.19, 1, 0.22, 1)";
      cubeRef.current.style.transform =
        `rotateX(${finalX}deg) rotateY(${finalY}deg)`;
      rotRef.current = { x: finalX, y: finalY };
    },

    stopRoll() {
      if (!cubeRef.current) return;
      isRollingRef.current = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      // Freeze at current rotation — no CSS transition, no face settlement
      cubeRef.current.style.transition = "none";
    },
  }), [tick]);

  useEffect(() => {
    // Set initial idle tilt
    if (cubeRef.current) {
      cubeRef.current.style.transform =
        `rotateX(${rotRef.current.x}deg) rotateY(${rotRef.current.y}deg)`;
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div style={{ width: size, height: size, perspective: size * 3.5 }}>
      <div
        ref={cubeRef}
        style={{
          width: size,
          height: size,
          position: "relative",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* Front  = 1 */ }
        <div style={{ position: "absolute", inset: 0, transform: `translateZ(${half}px)` }}>
          <DiceFace number={1} />
        </div>
        {/* Back   = 6 */}
        <div style={{ position: "absolute", inset: 0, transform: `rotateY(180deg) translateZ(${half}px)` }}>
          <DiceFace number={6} />
        </div>
        {/* Right  = 3 */}
        <div style={{ position: "absolute", inset: 0, transform: `rotateY(90deg) translateZ(${half}px)` }}>
          <DiceFace number={3} />
        </div>
        {/* Left   = 4 */}
        <div style={{ position: "absolute", inset: 0, transform: `rotateY(-90deg) translateZ(${half}px)` }}>
          <DiceFace number={4} />
        </div>
        {/* Top    = 2 */}
        <div style={{ position: "absolute", inset: 0, transform: `rotateX(-90deg) translateZ(${half}px)` }}>
          <DiceFace number={2} />
        </div>
        {/* Bottom = 5 */}
        <div style={{ position: "absolute", inset: 0, transform: `rotateX(90deg) translateZ(${half}px)` }}>
          <DiceFace number={5} />
        </div>
      </div>
    </div>
  );
});

export default QuantumDice3D;
