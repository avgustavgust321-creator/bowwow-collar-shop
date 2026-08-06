"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/use-media-query";

/**
 * Собака, бегущая за курсором.
 *
 * Идёт за указателем с заметным отставанием, разворачивается по ходу
 * движения, а когда курсор замирает — успокаивается и садится.
 *
 * Не показывается: на тач-устройствах (курсора нет), при включённом
 * «уменьшить движение» и на страницах корзины и оформления — там человек
 * заполняет форму, и бегающая собака только мешает.
 */

const SIZE = 96; // ширина рисунка, px
const EASE = 0.038; // насколько быстро догоняет курсор: меньше — спокойнее
const OFFSET_Y = 26; // держится ниже курсора, чтобы не закрывать цель

const QUIET_ROUTES = ["/cart", "/checkout", "/order"];

export function CursorDog() {
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();
  const finePointer = useMediaQuery("(pointer: fine)");
  const quietRoute = QUIET_ROUTES.some((route) => pathname.startsWith(route));
  const enabled = !reducedMotion && finePointer && !quietRoute;

  const dogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    // Стартуем за кадром, пока мышь не двинулась
    const target = { x: -200, y: -200 };
    const pos = { x: -200, y: -200 };
    let facingRight = true;
    let moving = false;
    let frame = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY + OFFSET_Y;
    };

    const tick = () => {
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const distance = Math.hypot(dx, dy);

      pos.x += dx * EASE;
      pos.y += dy * EASE;

      // Разворачиваем, только когда шаг заметный: иначе дёргается на месте
      if (Math.abs(dx) > 6) facingRight = dx > 0;
      moving = distance > 12;

      // Пока бежит — покачивается, как на рыси
      frame += moving ? 0.12 : 0;
      const bob = moving ? Math.sin(frame) * 3 : 0;
      const tilt = moving ? Math.sin(frame) * 2 : 0;

      const dog = dogRef.current;
      if (dog) {
        dog.style.transform =
          `translate3d(${pos.x - SIZE / 2}px, ${pos.y - SIZE / 2 + bob}px, 0)` +
          ` rotate(${tilt}deg)` +
          ` scaleX(${facingRight ? -1 : 1})`;
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40">
      <div
        ref={dogRef}
        className="absolute top-0 left-0 will-change-transform"
        style={{
          width: SIZE,
          height: SIZE * (762 / 1200),
          backgroundColor: "var(--color-shell)",
          opacity: 0.75,
          maskImage: "url(/images/brand/dog-line.png)",
          WebkitMaskImage: "url(/images/brand/dog-line.png)",
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      />
    </div>
  );
}
