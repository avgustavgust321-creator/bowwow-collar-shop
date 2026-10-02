"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { submitOrder } from "@/app/actions/order";
import { useCart } from "@/components/cart/CartProvider";
import { deliveryOptions } from "@/content/delivery";
import { formatPrice, getProduct } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { calcPrice, describeConfiguration } from "@/lib/price";

/** Общий стиль поля — утилита field в globals.css */
const fieldClass = "field";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, total, approximate, ready, clear } = useCart();
  const [errors, setErrors] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();
  const [delivery, setDelivery] = useState<string>(deliveryOptions[0].id);

  const selectedDelivery = deliveryOptions.find((d) => d.id === delivery);

  if (!ready) {
    return <div className="wrap px-5 py-24 md:px-10" aria-busy="true" />;
  }

  if (lines.length === 0) {
    return (
      <section className="wrap px-5 py-24 text-center md:px-10">
        <h1 className="display text-4xl">Корзина пуста</h1>
        <Link
          href="/catalog"
          className="label mt-8 inline-block bg-forest px-8 py-4 text-cream transition-colors hover:bg-forest-lift"
        >
          В каталог
        </Link>
      </section>
    );
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const payload = {
      customer: {
        name: String(form.get("name") ?? ""),
        phone: String(form.get("phone") ?? ""),
        email: String(form.get("email") ?? ""),
        delivery,
        address: String(form.get("address") ?? ""),
        comment: String(form.get("comment") ?? ""),
        consent: form.get("consent") === "on",
      },
      lines: lines.map((l) => ({
        slug: l.slug,
        config: l.config,
        qty: l.qty,
      })),
    };

    startTransition(async () => {
      const result = await submitOrder(payload);
      if (result.ok) {
        clear();
        if (result.redirectUrl) {
          // Уходим на платёжную страницу эквайера
          window.location.href = result.redirectUrl;
          return;
        }
        router.push(`/order/${result.orderId}`);
      } else {
        setErrors(result.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  };

  return (
    <section className="wrap px-5 py-10 md:px-10">
      <h1 className="display text-4xl md:text-6xl">Оформление</h1>
      <p className="mt-3 text-sm text-muted">
        Все поля, кроме комментария, обязательные.
      </p>

      {errors.length > 0 && (
        <ul className="mt-6 border-l-2 border-gold bg-shell py-4 pl-4 text-sm">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-10 grid gap-10 lg:grid-cols-[2fr_1fr]"
      >
        <div className="flex flex-col gap-8">
          <fieldset className="flex flex-col gap-4">
            <legend className="label text-muted">Контакты</legend>
            <label className="flex flex-col gap-1">
              <span className="label">Фамилия, имя, отчество</span>
              <input name="name" required autoComplete="name" className={fieldClass} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="label">Телефон</span>
                <input
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="+375 __ ___-__-__"
                  className={fieldClass}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="label">Почта</span>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={fieldClass}
                />
              </label>
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="label text-muted">Доставка</legend>
            {deliveryOptions.map((option) => (
              <label
                key={option.id}
                className={cn(
                  "flex cursor-pointer items-start gap-3 border p-4 transition-colors",
                  delivery === option.id
                    ? "border-forest bg-shell shadow-[inset_0_0_0_1px_var(--color-forest)]"
                    : "border-line hover:border-forest",
                )}
              >
                <input
                  type="radio"
                  name="delivery"
                  value={option.id}
                  checked={delivery === option.id}
                  onChange={() => setDelivery(option.id)}
                  className="mt-0.5 size-5 shrink-0 accent-forest"
                />
                <span className="flex-1">
                  <span className="label block">{option.title}</span>
                  <span className="mt-1 block text-sm text-muted">
                    {option.hint}
                  </span>
                </span>
                <span className="text-sm whitespace-nowrap text-muted">
                  {option.price > 0 ? formatPrice(option.price) : "бесплатно"}
                </span>
              </label>
            ))}

            {selectedDelivery?.needsAddress && (
              <label className="mt-2 flex flex-col gap-1">
                <span className="label">Адрес</span>
                <input
                  name="address"
                  required
                  autoComplete="street-address"
                  placeholder="Номер и адрес отделения Европочты или адрес курьеру"
                  className={fieldClass}
                />
              </label>
            )}
          </fieldset>

          <label className="flex flex-col gap-1">
            <span className="label text-muted">
              Комментарий к заказу{" "}
              <span className="normal-case tracking-normal">(необязательно)</span>
            </span>
            <textarea name="comment" rows={4} className={fieldClass} />
          </label>
        </div>

        <aside className="h-fit border border-line bg-shell p-6 lg:sticky lg:top-24">
          <h2 className="label text-muted">Заказ</h2>
          <ul className="mt-4 flex flex-col gap-4 border-b border-line pb-4">
            {lines.map((line) => {
              const product = getProduct(line.slug);
              if (!product) return null;
              const price = calcPrice(product, line.config);
              return (
                <li key={line.key} className="text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="font-semibold">
                      {product.title} × {line.qty}
                    </span>
                    <span className="whitespace-nowrap">
                      {price.approximate && (
                        <span className="text-muted">от </span>
                      )}
                      {formatPrice(price.total * line.qty)}
                    </span>
                  </div>
                  <p className="mt-1 text-muted">
                    {describeConfiguration(product, line.config).join(" · ")}
                  </p>
                </li>
              );
            })}
          </ul>

          {/* Доставка входит в итог уже здесь: раньше покупатель видел
              сумму без неё, а на странице заказа — на 6 р. больше */}
          {selectedDelivery && (
            <div className="mt-4 flex items-baseline justify-between text-sm">
              <span className="text-muted">{selectedDelivery.title}</span>
              <span>
                {selectedDelivery.price > 0
                  ? formatPrice(selectedDelivery.price)
                  : "бесплатно"}
              </span>
            </div>
          )}

          <div className="mt-3 flex items-end justify-between border-t border-line pt-3">
            <span className="label text-muted">Итого</span>
            <span className="display text-3xl">
              {approximate && <span className="text-muted">от&nbsp;</span>}
              {formatPrice(total + (selectedDelivery?.price ?? 0))}
            </span>
          </div>

          <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm">
            <input
              type="checkbox"
              name="consent"
              required
              className="mt-0.5 size-5 shrink-0 accent-forest"
            />
            <span>
              Даю согласие на обработку моих персональных данных, в том числе
              на их передачу за пределы Беларуси, на условиях{" "}
              <Link href="/policy" className="underline hover:text-forest">
                политики
              </Link>
              .
            </span>
          </label>

          <p className="mt-4 text-sm text-muted">
            Оформляя заказ, вы принимаете{" "}
            <Link href="/offer" className="underline hover:text-forest">
              условия оферты
            </Link>
            .
          </p>

          <button
            type="submit"
            disabled={pending}
            className="label mt-5 w-full bg-forest px-8 py-5 text-cream transition-colors hover:bg-forest-lift disabled:opacity-50"
          >
            {pending ? "Отправляем…" : "Оформить заказ"}
          </button>
        </aside>
      </form>
    </section>
  );
}
