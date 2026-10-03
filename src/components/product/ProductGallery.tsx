"use client";

import { useRef, useState, type ReactNode } from "react";
import { ProductMedia } from "@/components/product/ProductMedia";
import { framesFor } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/product-schema";

/**
 * Галерея товара. Подклад на всех кадрах перекрашивается в выбранный
 * в конфигураторе цвет, поэтому клиент видит именно свой вариант.
 *
 * На телефоне кадры листаются пальцем. Раньше миниатюры там были просто
 * скрыты, и из пяти снимков поводка человек видел только первый — пока
 * у ошейников было по кадру на цвет, это не проявлялось.
 */
export function ProductGallery({
  product,
  colorId,
  mediaClassName,
  renderPreview,
}: {
  product: Product;
  colorId?: string;
  /** Переопределение размеров главного кадра — например, на мобильном */
  mediaClassName?: string;
  /**
   * Живое превью изделия — встаёт первым кадром перед фотографиями.
   * Так у миски первым показывается рисунок в выбранных цветах.
   */
  renderPreview?: (className?: string) => ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [slide, setSlide] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const { frames: photos } = framesFor(product, colorId);
  // Кадр null — место живого превью; остальные — индексы фотографий.
  // Если фотографий нет, а превью тоже нет, оставляем один кадр —
  // ProductMedia нарисует на его месте заглушку.
  const photoFrames =
    photos.length > 0 ? photos.map((_, i) => i) : renderPreview ? [] : [0];
  const frames: (number | null)[] = [
    ...(renderPreview ? [null] : []),
    ...photoFrames,
  ];
  const keyOf = (frame: number | null) =>
    frame === null ? "preview" : (photos[frame] ?? "placeholder");

  const render = (
    frame: number | null,
    opts: { className?: string; sizes: string; main?: boolean },
  ) =>
    frame === null ? (
      renderPreview!(opts.className)
    ) : (
      <ProductMedia
        product={product}
        index={frame}
        colorId={colorId}
        priority={opts.main}
        sizes={opts.sizes}
        className={opts.className}
      />
    );

  // Смена цвета может укоротить набор кадров — не даём уйти за край
  const current = Math.min(active, frames.length - 1);
  const currentSlide = Math.min(slide, frames.length - 1);

  const onSwipe = () => {
    const el = scroller.current;
    if (!el) return;
    setSlide(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div>
      {/* ── Телефон: лента кадров со счётчиком ── */}
      <div className="relative lg:hidden">
        <div
          ref={scroller}
          onScroll={onSwipe}
          tabIndex={frames.length > 1 ? 0 : -1}
          aria-label={
            frames.length > 1
              ? `Фотографии товара, ${frames.length} кадров — листайте`
              : undefined
          }
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {frames.map((frame, i) => (
            <div key={keyOf(frame)} className="w-full shrink-0 snap-center">
              {/* Лента видна только на телефоне. На широком экране она
                  скрыта, и «1px» заставляет браузер взять самый маленький
                  вариант кадра вместо полноразмерного */}
              {render(frame, {
                className: mediaClassName,
                sizes: "(min-width: 1024px) 1px, 100vw",
                main: i === 0,
              })}
            </div>
          ))}
        </div>

        {frames.length > 1 && (
          <p
            aria-live="polite"
            className="label absolute right-3 bottom-3 bg-cream/90 px-2 py-1 text-ink"
          >
            {currentSlide + 1} / {frames.length}
          </p>
        )}
      </div>

      {/* ── Широкий экран: главный кадр и миниатюры ── */}
      <div className="hidden lg:block">
        {render(frames[current] ?? null, { sizes: "(min-width: 1024px) 50vw, 1px", main: true })}

        {frames.length > 1 && (
          <div className="flex gap-3 border-t border-line p-3">
            {frames.map((frame, i) => (
              <button
                key={keyOf(frame)}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Кадр ${i + 1}`}
                aria-pressed={i === current}
                className={cn(
                  "w-20 border transition sm:w-24",
                  i === current
                    ? "border-forest ring-1 ring-forest"
                    : "border-line opacity-70 hover:opacity-100",
                )}
              >
                {render(frame, { sizes: "160px" })}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
