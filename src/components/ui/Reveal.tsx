"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/use-media-query";

/**
 * Состояние появления при прокрутке.
 *
 * idle  — как пришло с сервера: видно. Пока не загрузились скрипты,
 *         ничего не прячем — раньше на медленном канале карточки на
 *         главной оставались пустыми, пока не догрузится JavaScript.
 * armed — блок ниже экрана: спрятан и ждёт, когда до него долистают.
 * shown — долистали: проявляется с анимацией.
 *
 * Что уже на экране в момент загрузки, остаётся как есть, без анимации.
 */
type Phase = "idle" | "armed" | "shown";

function useRevealPhase<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const node = ref.current;
    if (!node || reducedMotion) return;
    if (node.getBoundingClientRect().top < window.innerHeight) return;

    // Прячем только то, что ниже экрана, и только когда скрипты уже
    // работают — иначе блок мог бы остаться невидимым навсегда
    const arm = requestAnimationFrame(() => setPhase("armed"));
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("shown");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(node);
    return () => {
      cancelAnimationFrame(arm);
      observer.disconnect();
    };
  }, [reducedMotion]);

  return { ref, phase };
}

/**
 * Мягкое появление блока при прокрутке: сдвиг на несколько пикселей
 * и проявление. Срабатывает один раз и намеренно коротко — движение
 * должно подсказывать, что блок новый, а не задерживать чтение.
 *
 * При включённом «уменьшить движение» блок просто виден сразу.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  /** Задержка в миллисекундах — для лесенки из нескольких блоков */
  delay?: number;
  className?: string;
}) {
  const { ref, phase } = useRevealPhase<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        phase === "shown" &&
          "transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
        phase === "armed" ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100",
        className,
      )}
      style={{ transitionDelay: phase === "shown" ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  );
}

/**
 * Заголовок «выезжает из-под линии»: текст поднимается из невидимой
 * маски с быстрым стартом и долгим мягким торможением.
 *
 * Маска режет только по вертикали (overflow-y: clip), чтобы не обрезать
 * курсивные хвосты Playfair по бокам; нижний запас — под выносные
 * элементы букв «д», «у», «р».
 */
export function MaskReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const { ref, phase } = useRevealPhase<HTMLSpanElement>();

  return (
    <span
      ref={ref}
      className="-mb-[0.14em] block overflow-x-visible overflow-y-clip pb-[0.14em]"
    >
      <span
        className={cn(
          "block",
          phase === "shown" &&
            "transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          phase === "armed" ? "translate-y-[110%]" : "translate-y-0",
        )}
        style={{ transitionDelay: phase === "shown" ? `${delay}ms` : undefined }}
      >
        {children}
      </span>
    </span>
  );
}
