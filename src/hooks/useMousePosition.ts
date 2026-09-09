import { useEffect, useRef, useState } from "react";

export interface MousePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
}

export function useMousePosition(): MousePosition {
  const [mouse, setMouse] = useState<MousePosition>({
    x: 0, y: 0, vx: 0, vy: 0, speed: 0,
  });
  const prevRef = useRef({ x: 0, y: 0, time: Date.now() });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const now   = Date.now();
      const dt    = Math.max(now - prevRef.current.time, 1);
      const vx    = (e.clientX - prevRef.current.x) / dt;
      const vy    = (e.clientY - prevRef.current.y) / dt;
      const speed = Math.sqrt(vx * vx + vy * vy);
      setMouse({ x: e.clientX, y: e.clientY, vx, vy, speed });
      prevRef.current = { x: e.clientX, y: e.clientY, time: now };
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return mouse;
}