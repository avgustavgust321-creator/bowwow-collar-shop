"use client";

import { useState } from "react";
import { ProductMedia } from "@/components/product/ProductMedia";
import { framesFor } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/product-schema";

/**
 * Галерея товара. Подклад на всех кадрах перекрашивается в выбранный
 * в конфигураторе цвет, поэтому клиент видит именно свой вариант.
 */
export function ProductGallery({
  product,
  colorId,
  mediaClassName,
}: {
  product: Product;
  colorId?: string;
  /** Переопределение размеров главного кадра — например, на мобильном */
  mediaClassName?: string;
}) {
  const [active, setActive] = useState(0);
  const { frames } = framesFor(product, colorId);

  return (
    <div>
      <ProductMedia
        product={product}
        index={active}
        colorId={colorId}
        priority
        sizes="(min-width: 1024px) 50vw, 100vw"
        className={mediaClassName}
      />

      {frames.length > 1 && (
        <div className="hidden gap-3 border-t border-line p-3 lg:flex">
          {frames.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Кадр ${i + 1}`}
              aria-pressed={i === active}
              className={cn(
                "w-20 border transition-colors sm:w-24",
                i === active
                  ? "border-line"
                  : "border-line opacity-60 hover:opacity-100",
              )}
            >
              <ProductMedia
                product={product}
                index={i}
                colorId={colorId}
                sizes="160px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
