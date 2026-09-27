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
          <span className="label absolute top-6 left-6 z-10 -rotate-3 bg-rose px-3 py-1.5 text-forest shadow-card">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        {product.collection && (
          <p className="label text-muted">{product.collection}</p>
        )}
        <h3 className="display mt-2 text-2xl text-ink">{product.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">
          {product.summary}
        </p>
        <div className="mt-auto flex items-baseline justify-between gap-3 pt-5">
          <p className="display text-2xl text-ink">
            {price.from && <span className="text-base text-muted">от </span>}
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
