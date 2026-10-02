"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { deliveryOptions } from "@/content/delivery";
import { ProductMedia } from "@/components/product/ProductMedia";
import { formatPrice, getProduct } from "@/lib/catalog";
import { calcPrice, describeConfiguration } from "@/lib/price";

/** Цена доставки в корзине — из настроек доставки, а не вписана руками */
const deliveryFrom = Math.min(...deliveryOptions.map((d) => d.price));
const deliveryNote =
  `Доставка — ${deliveryFrom > 0 ? `${deliveryFrom} р.` : "бесплатно"}: ` +
  deliveryOptions
    .map((d) => d.title[0].toLowerCase() + d.title.slice(1))
    .join(" или ") +
  ".";

export default function CartPage() {
  const { lines, total, approximate, ready, setQty, remove } = useCart();

  if (!ready) {
    return <div className="wrap px-5 py-24 md:px-10" aria-busy="true" />;
  }

  if (lines.length === 0) {
    return (
      <section className="wrap px-5 py-24 text-center md:px-10">
        <h1 className="display text-4xl md:text-6xl">Корзина пуста</h1>
        <p className="mt-4 text-muted">
          Соберите ошейник или шлейку под своего питомца.
        </p>
        <Link
          href="/catalog"
          className="label mt-8 inline-block bg-forest px-8 py-4 text-cream transition-colors hover:bg-forest-lift"
        >
          В каталог
        </Link>
      </section>
    );
  }

  return (
    <section className="wrap px-5 py-10 md:px-10">
      <h1 className="display text-4xl md:text-6xl">Корзина</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <ul className="flex flex-col border-t border-line">
          {lines.map((line) => {
            const product = getProduct(line.slug);
            if (!product) return null;
            const price = calcPrice(product, line.config);
            const options = describeConfiguration(product, line.config);

            return (
              <li
                key={line.key}
                className="flex gap-4 border-b border-line py-5 sm:gap-6"
              >
                <Link
                  href={`/product/${product.slug}`}
                  className="w-24 shrink-0 sm:w-32"
                >
                  <ProductMedia product={product} sizes="128px" />
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <Link
                      href={`/product/${product.slug}`}
                      className="display inline-flex min-h-11 items-center text-xl hover:text-forest"
                    >
                      {product.title}
                    </Link>
                    <p className="font-semibold whitespace-nowrap">
                      {price.approximate && (
                        <span className="text-muted">от </span>
                      )}
                      {formatPrice(price.total * line.qty)}
                    </p>
                  </div>

                  <ul className="mt-2 flex flex-col gap-0.5 text-sm text-muted">
                    {options.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center border border-line">
                      <button
                        type="button"
                        onClick={() => setQty(line.key, line.qty - 1)}
                        aria-label="Уменьшить количество"
                        className="inline-flex size-11 items-center justify-center text-lg transition-colors hover:bg-shell hover:text-forest"
                      >
                        −
                      </button>
                      <span aria-live="polite" className="min-w-8 text-center">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(line.key, line.qty + 1)}
                        aria-label="Увеличить количество"
                        className="inline-flex size-11 items-center justify-center text-lg transition-colors hover:bg-shell hover:text-forest"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(line.key)}
                      className="label inline-flex min-h-11 items-center px-2 text-muted underline-offset-4 transition-colors hover:text-forest hover:underline"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit border border-line bg-shell p-6 lg:sticky lg:top-24">
          <h2 className="label text-muted">Итого</h2>
          <p className="display mt-2 text-4xl">
            {approximate && <span className="text-muted">от&nbsp;</span>}
            {formatPrice(total)}
          </p>
          <p className="mt-3 text-sm text-muted">
            {deliveryNote}
          </p>
          {approximate && (
            <p className="mt-3 border-l-2 border-gold pl-3 text-sm">
              В заказе есть позиции с предварительной ценой (по замерам или
              по вашей идее) — окончательную сумму подтвердит мастер.
            </p>
          )}
          <Link
            href="/checkout"
            className="label mt-6 block bg-forest px-8 py-5 text-center text-cream transition-colors hover:bg-forest-lift"
          >
            Оформить заказ
          </Link>
          <Link
            href="/catalog"
            className="label mt-3 flex min-h-11 items-center justify-center text-muted transition-colors hover:text-forest"
          >
            Продолжить покупки
          </Link>
        </aside>
      </div>
    </section>
  );
}
