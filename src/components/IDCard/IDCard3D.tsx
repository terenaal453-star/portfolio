import React, { useRef, useCallback, useEffect, useState } from "react";
import { CardFront } from "./CardFront";
import { CardBack } from "./CardBack";
import { Lanyard } from "./Lanyard";
import { useCardPhysics, CardPhysicsState } from "../../hooks/useCardPhysics";
import { useMousePosition } from "../../hooks/useMousePosition";

export interface IDCard3DProps {
  commandRef?: React.MutableRefObject<((cmd: string) => void) | null>;
}

const CARD_WIDTH = 224;
const CARD_HEIGHT = 344;
const LANYARD_HEIGHT = 140;

export const IDCard3D: React.FC<IDCard3DProps> = ({ commandRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardWrapRef = useRef<HTMLDivElement>(null);
  const lightOverlayRef = useRef<HTMLDivElement>(null);
  const lanyardRef = useRef<HTMLDivElement>(null);

  const physicsStateRef = useRef<CardPhysicsState>({
    rotX: 0,
    rotY: 0,
    rotZ: -8,
    posX: 0,
    posY: 0,
  });

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 });
  const mouse = useMousePosition();
  const mouseRef = useRef(mouse);
  mouseRef.current = mouse;

  const [displayRotY, setDisplayRotY] = useState(0);

  // Physics update — directly mutate DOM for performance
  const handleUpdate = useCallback((state: CardPhysicsState) => {
    physicsStateRef.current = state;

    // Update card transform
    if (cardWrapRef.current) {
      cardWrapRef.current.style.transform = `
        perspective(900px)
        translateX(${state.posX}px)
        translateY(${state.posY}px)
        rotateX(${state.rotX}deg)
        rotateY(${state.rotY}deg)
        rotateZ(${state.rotZ}deg)
      `;
    }

    // Update light overlay
    if (lightOverlayRef.current) {
      const lx = 50 + state.rotY * 1.2;
      const ly = 50 - state.rotX * 1.2;
      lightOverlayRef.current.style.background = `radial-gradient(
        ellipse at ${lx}% ${ly}%,
        rgba(255,255,255,0.07) 0%,
        rgba(255,255,255,0.025) 35%,
        transparent 70%
      )`;
    }

    // Sync rotY to state for face visibility — throttled
    setDisplayRotY(state.rotY);
  }, []);

  const { applyImpulse, applyCommand } = useCardPhysics(handleUpdate);

  // Expose applyCommand for terminal
  useEffect(() => {
    if (commandRef) {
      commandRef.current = applyCommand;
    }
  }, [commandRef, applyCommand]);

  // ── Mouse proximity effect ──
  const proximityRaf = useRef<number>(0);

  useEffect(() => {
    const tick = () => {
      if (!containerRef.current || isDragging.current) {
        proximityRaf.current = requestAnimationFrame(tick);
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2 + LANYARD_HEIGHT / 2;

      const dx = mouseRef.current.x - cx;
      const dy = mouseRef.current.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 220;

      if (dist < maxDist && dist > 5) {
        const proximity = 1 - dist / maxDist;
        const speedBoost = 1 + mouseRef.current.speed * 0.6;
        const strength = proximity * proximity * 0.03 * speedBoost;

        applyImpulse(
          (dy / maxDist) * strength * 50,
          (dx / maxDist) * strength * 50
        );
      }

      proximityRaf.current = requestAnimationFrame(tick);
    };

    proximityRaf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(proximityRaf.current);
  }, [applyImpulse]);

  // ── Drag handlers ──
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDragging.current = true;
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        rotX: physicsStateRef.current.rotX,
        rotY: physicsStateRef.current.rotY,
      };
      e.preventDefault();
    },
    []
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const targetRotY = dragStart.current.rotY + dx * 0.5;
      const targetRotX = dragStart.current.rotX + dy * 0.5;
      const cur = physicsStateRef.current;

      applyImpulse(
        (targetRotX - cur.rotX) * 0.25,
        (targetRotY - cur.rotY) * 0.25
      );
    },
    [applyImpulse]
  );

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      isDragging.current = true;
      dragStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        rotX: physicsStateRef.current.rotX,
        rotY: physicsStateRef.current.rotY,
      };
    },
    []
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging.current) return;
      const dx = e.touches[0].clientX - dragStart.current.x;
      const dy = e.touches[0].clientY - dragStart.current.y;
      const targetRotY = dragStart.current.rotY + dx * 0.5;
      const targetRotX = dragStart.current.rotX + dy * 0.5;
      const cur = physicsStateRef.current;

      applyImpulse(
        (targetRotX - cur.rotX) * 0.25,
        (targetRotY - cur.rotY) * 0.25
      );
      e.preventDefault();
    },
    [applyImpulse]
  );

  const onTouchEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Normalize rotY to [-180, 180] for face detection
  const normalizedRotY = ((displayRotY % 360) + 360) % 360;
  const showFront = normalizedRotY < 90 || normalizedRotY > 270;

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: CARD_WIDTH,
        height: CARD_HEIGHT + LANYARD_HEIGHT,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        userSelect: "none",
      }}
    >
      {/* ── Lanyard (above card, not in 3D transform) ── */}
      <div
        ref={lanyardRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: `${LANYARD_HEIGHT}px`,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <Lanyard
          cardRotY={physicsStateRef.current.rotY}
          cardRotZ={physicsStateRef.current.rotZ}
        />
      </div>

      {/* ── 3D Card wrapper ── */}
      <div
        ref={cardWrapRef}
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          position: "relative",
          transformStyle: "preserve-3d",
          borderRadius: "16px",
          cursor: isDragging.current ? "grabbing" : "grab",
          boxShadow: `
            0 30px 70px rgba(0,0,0,0.85),
            0 12px 35px rgba(0,0,0,0.6),
            0 0 0 1px rgba(255,255,255,0.07)
          `,
          zIndex: 3,
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Card thickness — top edge */}
        <div
          style={{
            position: "absolute",
            top: "-2px",
            left: "10px",
            right: "10px",
            height: "4px",
            background: "linear-gradient(90deg, #111827, #1e2740, #111827)",
            transform: "rotateX(90deg)",
            transformOrigin: "top center",
          }}
        />

        {/* Card thickness — bottom edge */}
        <div
          style={{
            position: "absolute",
            bottom: "-2px",
            left: "10px",
            right: "10px",
            height: "4px",
            background: "linear-gradient(90deg, #111827, #1e2740, #111827)",
            transform: "rotateX(-90deg)",
            transformOrigin: "bottom center",
          }}
        />

        {/* Front face */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "16px",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            overflow: "hidden",
          }}
        >
          <CardFront rotY={displayRotY} />
        </div>

        {/* Back face */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "16px",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            overflow: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <CardBack rotY={displayRotY} />
        </div>

        {/* Dynamic light reflection overlay */}
        <div
          ref={lightOverlayRef}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "16px",
            pointerEvents: "none",
            zIndex: 10,
            mixBlendMode: "overlay",
            backfaceVisibility: "hidden",
          }}
        />
      </div>

      {/* Ground shadow */}
      <div
        style={{
          position: "absolute",
          bottom: "-24px",
          left: "8%",
          right: "8%",
          height: "24px",
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, transparent 70%)",
          filter: "blur(10px)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </div>
  );
};