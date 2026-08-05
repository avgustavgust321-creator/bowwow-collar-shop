"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { measurements } from "@/content/categories";
import type { MeasurementId } from "@/content/categories";
import {
  hardwareOptions,
  leatherById,
  selectableLeatherColors,
} from "@/content/leather";
import { formatPrice } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import {
  calcPrice,
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

  const engravingLength = config.engraving?.trim().length ?? 0;

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
                      "label px-4 py-2 transition-colors",
                      config.fit === mode
                        ? "bg-forest text-paper"
                        : "hover:text-brass",
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
                    "flex min-w-20 flex-col items-start border px-3 py-2 text-left transition-colors",
                    config.sizeCode === size.code
                      ? "border-line bg-forest text-paper"
                      : "border-line hover:border-brass",
                  )}
                >
                  <span className="label">{size.code}</span>
                  <span className="mt-1 text-xs opacity-70">
                    {size.from && "от "}
                    {formatPrice(size.price)}
                  </span>
                  {size.note && (
                    <span className="mt-0.5 text-xs opacity-60">
                      {size.note}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {product.customFit?.fields.map((field) => {
                  const m = measurements[field as MeasurementId];
                  return (
                    <label key={field} className="flex flex-col gap-1">
                      <span className="label">{m.label}</span>
                      <span className="text-xs text-muted">{m.hint}</span>
                      <div className="mt-1 flex items-center border border-line bg-forest focus-within:border-brass">
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
                                [field]: e.target.value
                                  ? Number(e.target.value)
                                  : Number.NaN,
                              },
                            })
                          }
                          className="w-full bg-transparent px-3 py-2 outline-none"
                          placeholder="0"
                        />
                        <span className="label px-3 text-muted">см</span>
                      </div>
                    </label>
                  );
                })}
              </div>
              <p className="border-l-2 border-brass bg-forest px-4 py-3 text-sm">
                По индивидуальным замерам цена предварительная — мастер
                подтвердит её после проверки. Как правильно измерить питомца,
                описано{" "}
                <Link href="/sizing" className="underline hover:text-brass">
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
        const current = leatherById.get(config.leather[slot.id] ?? "");

        // Зафиксированный цвет модели: показываем, но не даём менять.
        if (slot.fixed) {
          return (
            <section key={slot.id} className="flex items-center gap-3">
              <span
                className="size-10 shrink-0 rounded-full border-2 border-line"
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
              <span className="ml-3 normal-case text-paper">
                {current?.name}
              </span>
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectableLeatherColors.map((color) => {
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
                      "size-10 rounded-full border-2 transition-transform",
                      active
                        ? "border-line scale-110"
                        : "border-transparent hover:scale-105",
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
                  "flex items-center gap-2 border px-4 py-2 transition-colors",
                  config.hardware === hw.id
                    ? "border-line bg-forest text-paper"
                    : "border-line hover:border-brass",
                )}
              >
                <span
                  className="size-4 rounded-full"
                  style={{ backgroundColor: hw.hex }}
                />
                <span className="label">{hw.name}</span>
                {hw.priceDelta > 0 && (
                  <span className="label text-brass">
                    +{formatPrice(hw.priceDelta)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Гравировка ─────────────────────────────────────── */}
      {product.engraving && (
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="label text-muted">
              Гравировка на бирке
              {product.engraving.price > 0 && (
                <span className="ml-3 text-brass">
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
            placeholder="Имя питомца"
            className="mt-3 w-full rounded-xl border-2 border-line bg-night px-4 py-3 outline-none focus:border-line"
          />
          {engravingLength > 0 && (
            <p className="display mt-3 border border-line bg-forest px-4 py-4 text-center text-2xl text-gold">
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
              {price.approximate && (
                <span className="text-muted">от&nbsp;</span>
              )}
              {formatPrice(price.total)}
            </p>
          </div>
          <p className="text-right text-sm text-muted">
            Изготовление
            <br />
            {product.productionDays} дней
          </p>
        </div>

        {showErrors && errors.length > 0 && (
          <ul className="mt-4 border-l-2 border-brass pl-4 text-sm text-brass">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={handleAdd}
          className="label mt-6 w-full bg-brass px-8 py-5 text-night transition-colors hover:bg-brass-light"
        >
          Добавить в корзину
        </button>

        {added && (
          <p className="mt-3 text-center text-sm">
            Добавлено.{" "}
            <Link href="/cart" className="underline hover:text-brass">
              Перейти в корзину
            </Link>
          </p>
        )}
      </section>
    </div>
  );
}
