"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { measurements } from "@/content/categories";
import type { MeasurementId } from "@/content/categories";
import { hardwareOptions } from "@/content/leather";
import { colorOf, selectableColors } from "@/lib/palette";
import { formatLength, formatPrice, productionTerm } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import {
  calcPrice,
  extraProductionDays,
  validateConfiguration,
  type Configuration,
} from "@/lib/price";
import type { Product } from "@/lib/product-schema";

export function Configurator({
  product,
  config,
  onChange,
}: {
  product: Product;
  config: Configuration;
  onChange: (next: Configuration) => void;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const price = useMemo(() => calcPrice(product, config), [product, config]);
  const errors = useMemo(
    () => validateConfiguration(product, config),
    [product, config],
  );

  const patch = (next: Partial<Configuration>) => {
    onChange({ ...config, ...next });
    setAdded(false);
  };

  const handleAdd = () => {
    if (errors.length > 0) {
      setShowErrors(true);
      return;
    }
    add(product.slug, config);
    setAdded(true);
  };

  const selectedSize = product.sizes?.find((s) => s.code === config.sizeCode);
  const extraDays = extraProductionDays(product, config);

  // Поле мерки — и для «своих замеров», и для размера, который сам
  // просит мерку (Big Boss просит обхват шеи)
  const measureField = (field: string) => {
    const m = measurements[field as MeasurementId];
    return (
      <label key={field} className="flex flex-col gap-1">
        <span className="label">{m.label}</span>
        <span className="text-xs text-muted">{m.hint}</span>
        <div className="mt-1 flex min-h-11 items-center border border-line bg-cream transition-colors focus-within:border-forest focus-within:shadow-[0_0_0_1px_var(--color-forest)]">
          <input
            type="number"
            inputMode="decimal"
            min={5}
            max={150}
            step={0.5}
            value={config.measurements?.[field] ?? ""}
            onChange={(e) =>
              patch({
                measurements: {
                  ...config.measurements,
                  [field]: e.target.value ? Number(e.target.value) : Number.NaN,
                },
              })
            }
            className="w-full bg-transparent px-3 py-2 text-ink outline-none"
            placeholder="0"
          />
          <span className="label px-3 text-muted">см</span>
        </div>
      </label>
    );
  };

  const engravingLength = config.engraving?.trim().length ?? 0;
  // Подпись поля гравировки — заголовок над ним, а не плейсхолдер:
  // плейсхолдер исчезает при вводе, и скринридер его как подпись не читает
  const engravingLabelId = useId();

  return (
    <div className="flex flex-col gap-8">
      {/* ── Размер ─────────────────────────────────────────── */}
      {product.sizes && (
        <section>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="label text-muted">Размер</h2>
            {product.customFit && (
              <div className="flex border border-line">
                {(
                  [
                    ["grid", "По сетке"],
                    ["custom", "Свои замеры"],
                  ] as const
                ).map(([mode, title]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => patch({ fit: mode })}
                    className={cn(
                      "label min-h-11 px-4 transition-colors",
                      config.fit === mode
                        ? "bg-forest text-cream"
                        : "hover:bg-shell hover:text-forest",
                    )}
                  >
                    {title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {config.fit === "grid" ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size.code}
                  type="button"
                  onClick={() => patch({ sizeCode: size.code })}
                  className={cn(
                    "flex min-h-11 min-w-20 flex-col items-start border px-3 py-2 text-left transition-colors",
                    config.sizeCode === size.code
                      ? "border-forest bg-forest text-cream"
                      : "border-line hover:border-forest",
                  )}
                >
                  <span className="label">{size.code}</span>
                  {!product.draft && (
                    <span className="mt-1 text-xs">
                      {size.from && "от "}
                      {formatPrice(size.price)}
                    </span>
                  )}
                  {size.note && (
                    <span
                      className={cn(
                        "mt-0.5 text-xs",
                        config.sizeCode === size.code
                          ? "text-cream-muted"
                          : "text-muted",
                      )}
                    >
                      {size.note}
                    </span>
                  )}
                </button>
              ))}
              {selectedSize?.measure && (
                <div className="mt-2 grid w-full gap-4 sm:grid-cols-2">
                  {selectedSize.measure.map(measureField)}
                  <p className="text-sm text-muted sm:col-span-2">
                    {selectedSize.code} шьётся под конкретную собаку — укажите
                    мерку, и мастер подтвердит цену.{" "}
                    <Link href="/sizing" className="underline hover:text-forest">
                      Как измерить
                    </Link>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {product.customFit?.fields.map(measureField)}
              </div>
              <p className="border-l-2 border-gold bg-shell px-4 py-3 text-sm">
                По индивидуальным замерам цена предварительная — мастер
                подтвердит её после проверки. Как правильно измерить питомца,
                описано{" "}
                <Link href="/sizing" className="underline hover:text-forest">
                  здесь
                </Link>
                .
              </p>
            </div>
          )}
        </section>
      )}

      {/* ── Кожа ───────────────────────────────────────────── */}
      {product.leatherSlots.map((slot) => {
        // Ищем по всей палитре, а не только по выбираемой: у зафиксированных
        // слотов цвет может быть вне списка выбора — как шоколадный верх
        const current = colorOf(slot.palette, config.leather[slot.id]);

        // Зафиксированный цвет модели: показываем, но не даём менять.
        if (slot.fixed) {
          return (
            <section key={slot.id} className="flex items-center gap-3">
              <span
                className="size-11 shrink-0 rounded-full border border-black/10"
                style={{ backgroundColor: current?.hex }}
              />
              <div>
                <h2 className="label text-muted">{slot.label}</h2>
                <p className="text-sm text-muted">
                  {current?.name} — постоянный цвет этой модели
                </p>
              </div>
            </section>
          );
        }

        return (
          <section key={slot.id}>
            <h2 className="label text-muted">
              {slot.label}
              <span className="ml-3 normal-case text-ink">
                {current?.name}
              </span>
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectableColors(slot.palette).map((color) => {
                const active = config.leather[slot.id] === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    title={color.name}
                    aria-label={color.name}
                    aria-pressed={active}
                    onClick={() =>
                      patch({
                        leather: { ...config.leather, [slot.id]: color.id },
                      })
                    }
                    className={cn(
                      "size-11 rounded-full border border-black/10 transition-shadow",
                      active
                        ? "ring-2 ring-forest ring-offset-2 ring-offset-cream"
                        : "hover:ring-1 hover:ring-forest/40 hover:ring-offset-2 hover:ring-offset-cream",
                    )}
                    style={{ backgroundColor: color.hex }}
                  />
                );
              })}
            </div>
          </section>
        );
      })}

      {/* ── Фурнитура ──────────────────────────────────────── */}
      {product.hardware && (
        <section>
          <h2 className="label text-muted">Фурнитура</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {hardwareOptions.map((hw) => (
              <button
                key={hw.id}
                type="button"
                onClick={() => patch({ hardware: hw.id })}
                className={cn(
                  "flex min-h-11 items-center gap-2 border px-4 transition-colors",
                  config.hardware === hw.id
                    ? "border-forest bg-forest text-cream"
                    : "border-line hover:border-forest",
                )}
              >
                <span
                  className="size-4 rounded-full border border-black/15"
                  style={{ backgroundColor: hw.hex }}
                />
                <span className="label">{hw.name}</span>
                {(hw.priceDelta > 0 || hw.extraDays) && (
                  <span
                    className={cn(
                      "label",
                      config.hardware === hw.id ? "text-rose" : "text-forest",
                    )}
                  >
                    {[
                      hw.priceDelta > 0 && `+${formatPrice(hw.priceDelta)}`,
                      hw.extraDays && `+${hw.extraDays} дня`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Длина ──────────────────────────────────────────── */}
      {product.length && (
        <section>
          <h2 className="label text-muted">Длина</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {Array.from({ length: product.length.maxSteps + 1 }, (_, steps) => {
              const { base, step, pricePerStep } = product.length!;
              const active = (config.extraLength ?? 0) === steps;
              return (
                <button
                  key={steps}
                  type="button"
                  aria-pressed={active}
                  onClick={() => patch({ extraLength: steps })}
                  className={cn(
                    "flex min-h-11 min-w-20 flex-col items-start border px-3 py-2 text-left transition-colors",
                    active
                      ? "border-forest bg-forest text-cream"
                      : "border-line hover:border-forest",
                  )}
                >
                  <span className="label">{formatLength(base + steps * step)}</span>
                  <span
                    className={cn(
                      "mt-1 text-xs",
                      active ? "text-cream-muted" : "text-muted",
                    )}
                  >
                    {steps === 0
                      ? "стандарт"
                      : `+${formatPrice(steps * pricePerStep)}`}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {product.configNote && (
        <p className="border-l-2 border-gold bg-shell px-4 py-3 text-sm">
          {product.configNote}
        </p>
      )}

      {/* ── Гравировка ─────────────────────────────────────── */}
      {product.engraving && (
        <section>
          <div className="flex items-baseline justify-between">
            <h2 id={engravingLabelId} className="label text-muted">
              {product.engraving.label ?? "Гравировка"}
              {product.engraving.price > 0 && (
                <span className="ml-3 text-forest">
                  +{formatPrice(product.engraving.price)}
                </span>
              )}
            </h2>
            <span className="text-xs text-muted">
              {engravingLength}/{product.engraving.maxChars}
            </span>
          </div>
          <input
            type="text"
            value={config.engraving ?? ""}
            maxLength={product.engraving.maxChars}
            onChange={(e) => patch({ engraving: e.target.value })}
            aria-labelledby={engravingLabelId}
            placeholder={product.engraving.placeholder ?? "Например, Марта"}
            className="field mt-3"
          />
          {engravingLength > 0 && !product.livePreview && (
            <p className="display mt-3 bg-forest px-4 py-4 text-center text-2xl tracking-wide text-gold">
              {config.engraving}
            </p>
          )}
        </section>
      )}

      {/* ── Итог ───────────────────────────────────────────── */}
      <section className="border-t border-line pt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="label text-muted">Итого</p>
            <p className="display mt-1 text-4xl">
              {product.draft ? (
                <span className="text-muted">скоро</span>
              ) : (
                <>
                  {price.approximate && (
                    <span className="text-muted">от&nbsp;</span>
                  )}
                  {formatPrice(price.total)}
                </>
              )}
            </p>
          </div>
          <p className="text-right text-sm text-muted">
            Изготовление
            <br />
            {productionTerm(product, extraDays)}
          </p>
        </div>

        {showErrors && errors.length > 0 && (
          <ul className="mt-4 border-l-2 border-gold pl-4 text-sm text-forest">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}

        {product.draft ? (
          <p className="label mt-6 w-full border border-line px-8 py-5 text-center text-muted">
            Скоро в продаже
          </p>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            className="label mt-6 w-full bg-forest px-8 py-5 text-cream transition-colors hover:bg-forest-lift"
          >
            Добавить в корзину
          </button>
        )}

        {added && (
          <p className="mt-3 text-center text-sm">
            Добавлено.{" "}
            <Link href="/cart" className="underline hover:text-forest">
              Перейти в корзину
            </Link>
          </p>
        )}
      </section>
    </div>
  );
}
