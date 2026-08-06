import Link from "next/link";
import { ProductMedia } from "@/components/product/ProductMedia";
import { formatPrice, priceFrom } from "@/lib/catalog";
import type { Product } from "@/lib/product-schema";

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
      className="group flex h-full flex-col"
    >
      <div className="relative overflow-hidden">
        <ProductMedia
          product={product}
          priority={priority}
          className="transition-transform duration-[1200ms] group-hover:scale-[1.04]"
        />
        {product.badge && (
          <span className="sticker label absolute top-3 left-3">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-5">
        {product.collection && (
          <p className="label text-muted">{product.collection}</p>
        )}
        <h3 className="display mt-2 text-xl transition-colors group-hover:text-forest">
          {product.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">
          {product.summary}
        </p>
        <p className="hand mt-4 text-lg text-ink">
          {price.from && "от "}
          {formatPrice(price.value)}
        </p>
      </div>
    </Link>
  );
}
