"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { measurements } from "@/content/categories";
import type { MeasurementId } from "@/content/categories";
import { hardwareOptions } from "@/content/leather";
import { colorOf, selectableColors } from "@/lib/palette";
import { formatPrice, productionTerm } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import {
  calcPrice,
  IDEA_MIN_CHARS,
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
  // Подпись поля гравировки — заголовок над ним, а не плейсхолдер:
  // плейсхолдер исчезает при вводе, и скринридер его как подпись не читает
  const engravingLabelId = useId();
  const ideaLabelId = useId();
  const ideaHintId = useId();

  const brief = config.brief ?? {};
  const ideaLength = brief.idea?.trim().length ?? 0;
  const patchBrief = (next: Partial<NonNullable<Configuration["brief"]>>) =>
    patch({ brief: { ...brief, ...next } });
  const toggleDetail = (detail: string) => {
    const current = brief.details ?? [];
    patchBrief({
      details: current.includes(detail)
        ? current.filter((d) => d !== detail)
        : [...current, detail],
    });
  };

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
                                [field]: e.target.value
                                  ? Number(e.target.value)
                                  : Number.NaN,
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
                })}
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

      {/* ── Идея ───────────────────────────────────────────── */}
      {product.brief && (
        <>
          <section>
            <h2 className="label text-muted">Форма</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {product.brief.shapes.map((shape) => {
                const active = brief.shape === shape.id;
                return (
                  <button
                    key={shape.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => patchBrief({ shape: shape.id })}
                    className={cn(
                      "flex min-h-11 flex-col items-start border px-3 py-2 text-left transition-colors",
                      active
                        ? "border-forest bg-forest text-cream"
                        : "border-line hover:border-forest",
                    )}
                  >
                    <span className="label">{shape.title}</span>
                    {shape.note && (
                      <span
                        className={cn(
                          "mt-0.5 text-xs",
                          active ? "text-cream-muted" : "text-muted",
                        )}
                      >
                        {shape.note}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="label text-muted">
              Что добавить{" "}
              <span className="normal-case tracking-normal">
                (можно несколько или ничего)
              </span>
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.brief.details.map((detail) => {
                const active = brief.details?.includes(detail) ?? false;
                return (
                  <button
                    key={detail}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleDetail(detail)}
                    className={cn(
                      "min-h-11 rounded-full border px-4 text-sm transition-colors",
                      active
                        ? "border-forest bg-forest text-cream"
                        : "border-line hover:border-forest",
                    )}
                  >
                    {active && <span aria-hidden>✓ </span>}
                    {detail}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <div className="flex items-baseline justify-between gap-3">
              <h2 id={ideaLabelId} className="label text-muted">
                Ваша идея
              </h2>
              <span className="text-xs text-muted">
                {ideaLength}/{product.brief.ideaMaxChars}
              </span>
            </div>
            <p id={ideaHintId} className="mt-1 text-sm text-muted">
              Цвета, материал, настроение, для кого ошейник. Можно приложить
              ссылку на фото-референс.
            </p>
            <textarea
              rows={5}
              value={brief.idea ?? ""}
              maxLength={product.brief.ideaMaxChars}
              onChange={(e) => patchBrief({ idea: e.target.value })}
              aria-labelledby={ideaLabelId}
              aria-describedby={ideaHintId}
              aria-invalid={showErrors && ideaLength < IDEA_MIN_CHARS}
              placeholder="Например: рыжая замша с бирюзовой вставкой, как на фото, только с серебряной пряжкой — для нашей борзой Луны"
              className="field mt-3"
            />
            <p className="mt-3 border-l-2 border-gold bg-shell px-4 py-3 text-sm">
              После заказа мастер свяжется с вами, обсудит детали и назовёт
              точную цену. Платить ничего не нужно, пока вы не договоритесь
              о деталях.
            </p>
          </section>
        </>
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
                {hw.priceDelta > 0 && (
                  <span
                    className={cn(
                      "label",
                      config.hardware === hw.id ? "text-rose" : "text-forest",
                    )}
                  >
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
            <h2 id={engravingLabelId} className="label text-muted">
              {product.engraving.label ?? "Гравировка на бирке"}
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
            {productionTerm(product)}
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
