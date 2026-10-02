import Link from "next/link";
import { ProductMedia } from "@/components/product/ProductMedia";
import { formatPrice, priceFrom } from "@/lib/catalog";
import type { Product } from "@/lib/product-schema";

/**
 * Карточка в каталоге.
 *
 * Лежит на бежевой подложке со своей тенью и приподнимается под курсором —
 * раньше она была просто картинкой с текстом на общем фоне. Фото в
 * золотом паспарту, как на главной. Цена набрана антиквой: рукописный
 * скрипт, которым она шла раньше, цифры читает плохо.
 */
export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const price = priceFrom(product);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex h-full flex-col bg-shell shadow-card transition-transform duration-500 hover:-translate-y-1"
    >
      <div className="frame-gold relative overflow-hidden">
        <ProductMedia
          product={product}
          priority={priority}
          className="transition-transform duration-[1200ms] group-hover:scale-[1.04]"
        />
        {product.badge && (
          <span className="label absolute top-3 left-3 z-10 max-w-[calc(100%-1.5rem)] -rotate-3 bg-rose px-2 py-1 text-forest shadow-card sm:top-6 sm:left-6 sm:px-3 sm:py-1.5">
            {product.badge}
          </span>
        )}
      </div>

      {/* На телефоне карточки идут в две колонки: описание прячем,
          заголовок и цену делаем мельче, чтобы карточка не вытягивалась */}
      <div className="flex flex-1 flex-col p-3 sm:p-5 md:p-6">
        {product.collection && (
          <p className="label text-muted">{product.collection}</p>
        )}
        <h3 className="display mt-1.5 text-lg leading-snug text-ink sm:mt-2 sm:text-2xl">
          {product.title}
        </h3>
        <p className="mt-2 hidden text-sm text-muted sm:line-clamp-2">
          {product.summary}
        </p>
        <div className="mt-auto flex items-baseline justify-between gap-3 pt-3 sm:pt-5">
          <p className="display text-xl text-ink sm:text-2xl">
            {price.from && <span className="text-sm text-muted sm:text-base">от </span>}
            {formatPrice(price.value)}
          </p>
          <span
            aria-hidden
            className="label text-forest transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
