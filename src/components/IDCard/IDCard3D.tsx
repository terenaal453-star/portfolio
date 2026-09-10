import React, { useRef, useCallback, useEffect, useState } from "react";
import { RealisticCard } from "./RealisticCard";
import { LanyardSystem } from "./LanyardSystem";
import { useCardPhysics, CardPhysicsState } from "../../hooks/useCardPhysics";
import { useMousePosition } from "../../hooks/useMousePosition";

export interface IDCard3DProps {
  commandRef?: React.MutableRefObject<((cmd: string) => void) | null>;
}

const CARD_W    = 218;
const CARD_H    = 336;
const LANYARD_H = 165;

// Flip states
type FlipState = "front" | "flipping-to-back" | "back" | "flipping-to-front";

export const IDCard3D: React.FC<IDCard3DProps> = ({ commandRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef      = useRef<HTMLDivElement>(null);
  const shadowRef    = useRef<HTMLDivElement>(null);

  const stateRef = useRef<CardPhysicsState>({
    rotX: 0, rotY: 0, rotZ: 0,
    posX: 0, posY: 0, swingAngle: 0,
  });

  // ── Flip system ──
  // currentFlipY is the actual Y rotation in degrees (0 = front, 180 = back)
  const currentFlipY  = useRef(0);
  const targetFlipY   = useRef(0);
  const flipVel       = useRef(0);
  const flipState     = useRef<FlipState>("front");
  const flipRafRef    = useRef<number>(0);
  const isAnimating   = useRef(false);

  // React state just for passing isFlipped to RealisticCard
  const [isFlipped, setIsFlipped] = useState(false);

  const isDragging  = useRef(false);
  const dragStart   = useRef({ x: 0, y: 0, angle: 0 });
  const mouse       = useMousePosition();
  const mouseRef    = useRef(mouse);
  mouseRef.current  = mouse;

  const [liveState, setLiveState] = useState<CardPhysicsState>({
    rotX: 0, rotY: 0, rotZ: 0, posX: 0, posY: 0, swingAngle: 0,
  });

  // ── Apply card DOM transform ──
  const applyCardTransform = useCallback((
    physics: CardPhysicsState,
    flipY:   number,
  ) => {
    if (!cardRef.current) return;
    const ang    = physics.swingAngle;
    const angRad = (ang * Math.PI) / 180;
    const offX   = Math.sin(angRad) * LANYARD_H * 0.55;
    const offY   = (1 - Math.cos(angRad)) * LANYARD_H * 0.55;

    cardRef.current.style.transform = `
      perspective(1100px)
      translateX(${offX + physics.posX}px)
      translateY(${offY + physics.posY}px)
      rotateZ(${ang}deg)
      rotateX(${physics.rotX}deg)
      rotateY(${flipY}deg)
    `;
  }, []);

  // ── Flip animation loop ──
  const animateFlip = useCallback(() => {
    const target = targetFlipY.current;
    const diff   = target - currentFlipY.current;

    // Ease done
    if (Math.abs(diff) < 0.08 && Math.abs(flipVel.current) < 0.05) {
      currentFlipY.current = target;
      flipVel.current      = 0;
      isAnimating.current  = false;

      // Update flip state
      if (target % 360 === 0 || target === 0) {
        flipState.current = "front";
        setIsFlipped(false);
      } else {
        flipState.current = "back";
        setIsFlipped(true);
      }

      applyCardTransform(stateRef.current, currentFlipY.current);
      return;
    }

    // Spring toward target
    flipVel.current      += diff * 0.055;
    flipVel.current      *= 0.82;
    currentFlipY.current += flipVel.current;

    applyCardTransform(stateRef.current, currentFlipY.current);
    flipRafRef.current = requestAnimationFrame(animateFlip);
  }, [applyCardTransform]);

  // ── Trigger one flip ──
  // Toggles between front (0) and back (180)
  const triggerFlip = useCallback(() => {
    // If already animating, ignore
    if (isAnimating.current) return;

    isAnimating.current = true;

    if (flipState.current === "front") {
      // Flip to back
      targetFlipY.current  = currentFlipY.current + 180;
      flipVel.current      = 8;   // initial push velocity
      flipState.current    = "flipping-to-back";
    } else if (flipState.current === "back") {
      // Flip back to front
      targetFlipY.current  = currentFlipY.current + 180;
      flipVel.current      = 8;
      flipState.current    = "flipping-to-front";
    } else {
      // Mid-animation — ignore
      isAnimating.current = false;
      return;
    }

    cancelAnimationFrame(flipRafRef.current);
    flipRafRef.current = requestAnimationFrame(animateFlip);
  }, [animateFlip]);

  // ── Physics update ──
  const handleUpdate = useCallback((state: CardPhysicsState) => {
    stateRef.current = state;
    applyCardTransform(state, currentFlipY.current);

    // Shadow
    if (shadowRef.current) {
      const ang    = state.swingAngle;
      const angRad = (ang * Math.PI) / 180;
      const sX     = Math.sin(angRad) * 50;
      const blur   = 28 + Math.abs(ang) * 0.6;
      const op     = Math.max(0.12, 0.48 - Math.abs(ang) * 0.008);
      const scaleX = Math.max(0.4, 1 - Math.abs(ang) * 0.012);
      shadowRef.current.style.transform =
        `translateX(calc(-50% + ${sX}px)) scaleX(${scaleX})`;
      shadowRef.current.style.filter  = `blur(${blur}px)`;
      shadowRef.current.style.opacity = String(op);
    }

    setLiveState(prev => {
      if (
        Math.abs(prev.swingAngle - state.swingAngle) > 0.05 ||
        Math.abs(prev.rotX      - state.rotX)       > 0.1  ||
        Math.abs(prev.rotY      - state.rotY)       > 0.1
      ) return { ...state };
      return prev;
    });
  }, [applyCardTransform]);

  const { applyImpulse, applyCommand, applySwing } =
    useCardPhysics(handleUpdate);

  useEffect(() => {
    if (commandRef) commandRef.current = applyCommand;
  }, [commandRef, applyCommand]);

  useEffect(() => {
    return () => cancelAnimationFrame(flipRafRef.current);
  }, []);

  // ── Mouse proximity ──
  const proxRaf = useRef<number>(0);
  useEffect(() => {
    const tick = () => {
      if (!containerRef.current || isDragging.current) {
        proxRaf.current = requestAnimationFrame(tick);
        return;
      }
      const rect = containerRef.current.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + LANYARD_H   + CARD_H / 2;
      const dx   = mouseRef.current.x - cx;
      const dy   = mouseRef.current.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxD = 300;

      if (dist < maxD && dist > 10) {
        const prox  = 1 - dist / maxD;
        const speed = Math.min(mouseRef.current.speed, 4);
        const force = prox * prox * 0.01 * (1 + speed * 0.25);
        applyImpulse((dy / maxD) * force * 25, (dx / maxD) * force * 25);
        if (speed > 0.8) applySwing((dx / maxD) * force * 5 * speed);
      }
      proxRaf.current = requestAnimationFrame(tick);
    };
    proxRaf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(proxRaf.current);
  }, [applyImpulse, applySwing]);

  // ── Track if this is a drag or a click ──
  const dragMoved     = useRef(false);
  const mouseDownPos  = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current   = true;
    dragMoved.current    = false;
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
    dragStart.current    = {
      x:     e.clientX,
      y:     e.clientY,
      angle: stateRef.current.swingAngle,
    };
    e.preventDefault();
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;

    const dx = e.clientX - mouseDownPos.current.x;
    const dy = e.clientY - mouseDownPos.current.y;

    // Mark as drag if moved more than 5px
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      dragMoved.current = true;
    }

    const tgt = dragStart.current.angle +
      (e.clientX - dragStart.current.x) * 0.28;
    applySwing((tgt - stateRef.current.swingAngle) * 0.18);
    applyImpulse(
      (e.clientY - dragStart.current.y) * 0.008,
      (e.clientX - dragStart.current.x) * 0.008,
    );
  }, [applySwing, applyImpulse]);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;

    // If mouse didn't move much → it's a click → flip once
    if (!dragMoved.current) {
      triggerFlip();
    }

    dragMoved.current = false;
  }, [triggerFlip]);

  const onMouseLeave = useCallback(() => {
    isDragging.current = false;
    dragMoved.current  = false;
  }, []);

  // ── Touch ──
  const touchMoved    = useRef(false);
  const touchStartPos = useRef({ x: 0, y: 0 });

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    isDragging.current   = true;
    touchMoved.current   = false;
    touchStartPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    dragStart.current = {
      x:     e.touches[0].clientX,
      y:     e.touches[0].clientY,
      angle: stateRef.current.swingAngle,
    };
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const dx = e.touches[0].clientX - touchStartPos.current.x;
    const dy = e.touches[0].clientY - touchStartPos.current.y;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      touchMoved.current = true;
    }

    const tgt = dragStart.current.angle +
      (e.touches[0].clientX - dragStart.current.x) * 0.28;
    applySwing((tgt - stateRef.current.swingAngle) * 0.18);
    applyImpulse(
      (e.touches[0].clientY - dragStart.current.y) * 0.008,
      (e.touches[0].clientX - dragStart.current.x) * 0.008,
    );
    e.preventDefault();
  }, [applySwing, applyImpulse]);

  const onTouchEnd = useCallback(() => {
    isDragging.current = false;

    // Tap = flip once
    if (!touchMoved.current) {
      triggerFlip();
    }

    touchMoved.current = false;
  }, [triggerFlip]);

  return (
    <div
      ref={containerRef}
      style={{
        position:      "relative",
        width:         CARD_W,
        height:        CARD_H + LANYARD_H + 40,
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
        userSelect:    "none",
      }}
    >
      {/* Lanyard */}
      <LanyardSystem
        swingAngle={liveState.swingAngle}
        rotX={liveState.rotX}
        rotY={liveState.rotY}
        cardWidth={CARD_W}
        lanyardHeight={LANYARD_H + 22}
      />

      {/* 3D Card */}
      <div
        ref={cardRef}
        title="Click to flip card"
        style={{
          position:       "absolute",
          top:            LANYARD_H,
          left:           "50%",
          marginLeft:     -CARD_W / 2,
          width:          CARD_W,
          height:         CARD_H,
          transformStyle: "preserve-3d",
          cursor:         isDragging.current ? "grabbing" : "pointer",
          willChange:     "transform",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <RealisticCard
          rotX={liveState.rotX}
          rotY={liveState.rotY}
          swingAngle={liveState.swingAngle}
          isFlipped={isFlipped}
        />
      </div>

      {/* Click hint */}
      <div style={{
        position:      "absolute",
        bottom:        "12px",
        left:          "50%",
        transform:     "translateX(-50%)",
        fontSize:      "9px",
        color:         "rgba(255,255,255,0.18)",
        letterSpacing: "1.5px",
        fontFamily:    "'JetBrains Mono', monospace",
        whiteSpace:    "nowrap",
        pointerEvents: "none",
        userSelect:    "none",
      }}>
        click to flip
      </div>

      {/* Ground shadow */}
      <div
        ref={shadowRef}
        style={{
          position:      "absolute",
          bottom:        "30px",
          left:          "50%",
          width:         CARD_W * 0.82,
          height:        "18px",
          background:    "radial-gradient(ellipse at center, rgba(0,0,0,0.75) 0%, transparent 70%)",
          filter:        "blur(28px)",
          opacity:       0.45,
          pointerEvents: "none",
          transform:     "translateX(-50%)",
          willChange:    "transform, filter, opacity",
        }}
      />
    </div>
  );
};