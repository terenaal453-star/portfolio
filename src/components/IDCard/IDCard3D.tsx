import React, { useRef, useCallback, useEffect, useState } from "react";
import { RealisticCard }  from "./RealisticCard";
import { LanyardSystem }  from "./LanyardSystem";
import { useCardPhysics, CardPhysicsState } from "../../hooks/useCardPhysics";
import { useMousePosition } from "../../hooks/useMousePosition";

export interface IDCard3DProps {
  commandRef?: React.MutableRefObject<((cmd: string) => void) | null>;
}

const CARD_W      = 218;
const CARD_H      = 336;
const LANYARD_H   = 165;

export const IDCard3D: React.FC<IDCard3DProps> = ({ commandRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef      = useRef<HTMLDivElement>(null);
  const shadowRef    = useRef<HTMLDivElement>(null);

  const stateRef     = useRef<CardPhysicsState>({
    rotX: 0, rotY: 0, rotZ: 0,
    posX: 0, posY: 0, swingAngle: 0,
  });

  const isDragging   = useRef(false);
  const dragStart    = useRef({ x: 0, y: 0, angle: 0 });

  const mouse        = useMousePosition();
  const mouseRef     = useRef(mouse);
  mouseRef.current   = mouse;

  const [liveState, setLiveState] = useState<CardPhysicsState>({
    rotX: 0, rotY: 0, rotZ: 0, posX: 0, posY: 0, swingAngle: 0,
  });

  // Physics update — DOM mutation for performance
  const handleUpdate = useCallback((state: CardPhysicsState) => {
    stateRef.current = state;

    // Update card transform every frame
    if (cardRef.current) {
      const ang    = state.swingAngle;
      const angRad = (ang * Math.PI) / 180;

      // Pendulum position: card hangs from fixed top point
      const swingOffsetX = Math.sin(angRad) * LANYARD_H * 0.55;
      const swingOffsetY = (1 - Math.cos(angRad)) * LANYARD_H * 0.55;

      cardRef.current.style.transform = `
        perspective(1100px)
        translateX(${swingOffsetX + state.posX}px)
        translateY(${swingOffsetY + state.posY}px)
        rotateZ(${ang}deg)
        rotateX(${state.rotX}deg)
        rotateY(${state.rotY}deg)
      `;
    }

    // Realistic shadow — moves and blurs with swing
    if (shadowRef.current) {
      const ang      = state.swingAngle;
      const angRad   = (ang * Math.PI) / 180;
      const shadowX  = Math.sin(angRad) * 50;
      const blur     = 28 + Math.abs(ang) * 0.6;
      const opacity  = Math.max(0.12, 0.48 - Math.abs(ang) * 0.008);
      const scaleX   = Math.max(0.4, 1 - Math.abs(ang) * 0.012);

      shadowRef.current.style.transform =
        `translateX(calc(-50% + ${shadowX}px)) scaleX(${scaleX})`;
      shadowRef.current.style.filter    = `blur(${blur}px)`;
      shadowRef.current.style.opacity   = String(opacity);
    }

    // Update react state only for lanyard (lower frequency ok)
    setLiveState(prev => {
      if (
        Math.abs(prev.swingAngle - state.swingAngle) > 0.05 ||
        Math.abs(prev.rotX - state.rotX) > 0.1 ||
        Math.abs(prev.rotY - state.rotY) > 0.1
      ) {
        return { ...state };
      }
      return prev;
    });
  }, []);

  const { applyImpulse, applyCommand, applySwing } = useCardPhysics(handleUpdate);

  useEffect(() => {
    if (commandRef) commandRef.current = applyCommand;
  }, [commandRef, applyCommand]);

  // ── Mouse proximity — subtle tilt + swing ──
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
        const prox   = (1 - dist / maxD);
        const speed  = Math.min(mouseRef.current.speed, 4);
        const force  = prox * prox * 0.01 * (1 + speed * 0.25);

        // Gentle tilt toward cursor
        applyImpulse(
          (dy / maxD) * force * 25,
          (dx / maxD) * force * 25,
        );

        // Fast mouse movement creates a tiny swing
        if (speed > 0.8) {
          applySwing((dx / maxD) * force * 5 * speed);
        }
      }

      proxRaf.current = requestAnimationFrame(tick);
    };

    proxRaf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(proxRaf.current);
  }, [applyImpulse, applySwing]);

  // ── Drag interaction ──
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current  = {
      x:     e.clientX,
      y:     e.clientY,
      angle: stateRef.current.swingAngle,
    };
    e.preventDefault();
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx          = e.clientX - dragStart.current.x;
    const dy          = e.clientY - dragStart.current.y;
    const targetAngle = dragStart.current.angle + dx * 0.28;
    const diff        = targetAngle - stateRef.current.swingAngle;
    applySwing(diff * 0.18);
    applyImpulse(dy * 0.008, dx * 0.008);
  }, [applySwing, applyImpulse]);

  const onMouseUp   = useCallback(() => { isDragging.current = false; }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    isDragging.current = true;
    dragStart.current  = {
      x:     e.touches[0].clientX,
      y:     e.touches[0].clientY,
      angle: stateRef.current.swingAngle,
    };
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const dx          = e.touches[0].clientX - dragStart.current.x;
    const dy          = e.touches[0].clientY - dragStart.current.y;
    const targetAngle = dragStart.current.angle + dx * 0.28;
    const diff        = targetAngle - stateRef.current.swingAngle;
    applySwing(diff * 0.18);
    applyImpulse(dy * 0.008, dx * 0.008);
    e.preventDefault();
  }, [applySwing, applyImpulse]);

  const onTouchEnd  = useCallback(() => { isDragging.current = false; }, []);

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
      {/* Canvas lanyard */}
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
        style={{
          position:       "absolute",
          top:            LANYARD_H,
          left:           "50%",
          marginLeft:     -CARD_W / 2,
          width:          CARD_W,
          height:         CARD_H,
          transformStyle: "preserve-3d",
          cursor:         "grab",
          willChange:     "transform",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <RealisticCard
          rotX={liveState.rotX}
          rotY={liveState.rotY}
          swingAngle={liveState.swingAngle}
        />
      </div>

      {/* Realistic ground shadow */}
      <div
        ref={shadowRef}
        style={{
          position:      "absolute",
          bottom:        "-10px",
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