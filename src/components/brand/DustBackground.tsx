"use client";

import { SparklesCore } from "@/components/ui/sparkles";
import { usePrefersReducedMotion } from "@/lib/use-media-query";

/**
 * Фоновый слой с частицами.
 *
 * Настроен не как «звёзды», а как пыль в воздухе мастерской: цвет латунный,
 * частицы редкие и медленные. Лежит под всем содержимым и не перехватывает
 * клики.
 *
 * При включённом «уменьшить движение» слой не рендерится совсем — это и
 * доступность, и экономия: движок частиц рисует на canvas непрерывно.
 */
export function DustBackground() {
  const reducedMotion = usePrefersReducedMotion();
  if (reducedMotion) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-45"
    >
      <SparklesCore
        id="workshop-dust"
        background="transparent"
        particleColor="#CC9246"
        minSize={0.4}
        maxSize={1.1}
        particleDensity={26}
        speed={0.6}
        className="h-full w-full"
      />
    </div>
  );
}
