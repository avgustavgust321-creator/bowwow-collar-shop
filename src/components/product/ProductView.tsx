"use client";

import { useState } from "react";
import { BowlPreview } from "@/components/product/BowlPreview";
import { Configurator } from "@/components/product/Configurator";
import { ProductGallery } from "@/components/product/ProductGallery";
import { formatPrice, mainSlot, priceFrom } from "@/lib/catalog";
import { colorOf } from "@/lib/palette";
import { defaultConfiguration, type Configuration } from "@/lib/price";
import type { Product } from "@/lib/product-schema";

/**
 * Верх карточки товара: галерея и конфигуратор живут на одном состоянии,
 * поэтому выбранный цвет сразу виден на фотографии — а у миски на живом
 * превью вместе с надписью.
 */
export function ProductView({ product }: { product: Product }) {
  const [config, setConfig] = useState<Configuration>(() =>
    defaultConfiguration(product),
  );

  const price = priceFrom(product);
  const slot = mainSlot(product);
  const colorId = slot ? config.leather[slot.id] : undefined;

  const renderPreview =
    product.livePreview === "bowl"
      ? (className?: string) => {
          const textSlot = product.leatherSlots.find(
            (s) => s.id === product.engraving?.colorSlot,
          );
          return (
            <BowlPreview
              className={className}
              base={colorOf(slot?.palette, colorId)?.hex ?? "#E8AFCF"}
              textColor={
                colorOf(textSlot?.palette, config.leather[textSlot?.id ?? ""])
                  ?.hex ?? "#22301f"
              }
              inscription={config.engraving}
            />
          );
        }
      : undefined;

  return (
    <div className="grid lg:grid-cols-2">
      {/* На телефоне фото залипает под шапкой: свотчи цвета лежат ниже,
          и без этого выбор шёл бы вслепую — картинка уезжала бы за экран.
          На широком экране всё видно сразу, там залипание не нужно. */}
      <div className="sticky top-14 z-20 border-b border-line bg-cream lg:static lg:border-r lg:border-b-0">
        <ProductGallery
          product={product}
          colorId={colorId}
          renderPreview={renderPreview}
          mediaClassName="max-lg:aspect-auto max-lg:h-[38vh]"
        />
      </div>

      <div className="px-5 py-10 md:px-8">
        {product.badge && (
          <span className="label bg-forest px-2 py-1 text-cream">
            {product.badge}
          </span>
        )}
        <h1 className="display mt-4 text-4xl md:text-5xl">{product.title}</h1>
        <p className="mt-4 text-muted">{product.summary}</p>
        {product.draft ? (
          <p className="mt-4 border-l-2 border-gold bg-shell px-4 py-3 text-sm text-ink">
            Скоро в продаже. Цвета и надпись уже можно примерить — заказ
            откроется, как только появятся цены.
          </p>
        ) : (
          <p className="mt-2 text-lg font-semibold">
            {price.from && <span className="text-muted">от </span>}
            {formatPrice(price.value)}
          </p>
        )}

        <div className="mt-10">
          <Configurator
            product={product}
            config={config}
            onChange={setConfig}
          />
        </div>
      </div>
    </div>
  );
}
