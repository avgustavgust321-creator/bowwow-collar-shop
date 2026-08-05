import Image from "next/image";
import { leatherById } from "@/content/leather";
import { framesFor } from "@/lib/catalog";
import type { Product } from "@/lib/product-schema";
import { cn } from "@/lib/cn";

/** Схематичные силуэты по категориям — пока нет фотографий. */
const glyphs: Record<string, React.ReactNode> = {
  collars: (
    <>
      <circle cx="50" cy="52" r="30" />
      <rect x="42" y="14" width="16" height="12" />
      <path d="M50 26v8" />
    </>
  ),
  harnesses: (
    <>
      <circle cx="34" cy="58" r="20" />
      <circle cx="66" cy="58" r="20" />
      <path d="M50 20v22M38 20h24" />
    </>
  ),
  leashes: (
    <>
      <path d="M28 20c22 0 34 12 34 30s-12 30-26 30-20-8-20-16 6-14 14-14 12 6 12 12" />
      <path d="M70 18c6 0 10 4 10 10s-4 10-10 10" />
    </>
  ),
  accessories: (
    <>
      <rect x="26" y="38" width="48" height="44" rx="6" />
      <path d="M38 38V26a12 12 0 0 1 24 0v12" />
    </>
  ),
};

/**
 * Фотография товара с перекраской подклада.
 *
 * На снимке подклад заранее обесцвечен до нейтрального серого, поверх него
 * накладывается выбранный цвет режимом multiply через маску области. За счёт
 * этого сохраняются текстура кожи, строчка и светотень — цвет не выглядит
 * плоской заливкой.
 */
export function ProductMedia({
  product,
  index = 0,
  colorId,
  className,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: {
  product: Product;
  /** Какой кадр из галереи показывать */
  index?: number;
  /** Цвет кожи для перекраски; по умолчанию — цвет слота из каталога */
  colorId?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const { frames, real } = framesFor(product, colorId);
  const photo = frames[index];
  const placeholderHex = leatherById.get(product.placeholder)?.hex ?? "#A9813E";

  if (!photo) {
    return (
      <div
        className={cn(
          "relative flex aspect-square items-center justify-center overflow-hidden",
          className,
        )}
        style={{
          backgroundColor: `color-mix(in srgb, ${placeholderHex} 22%, #12211a)`,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          aria-hidden
          className="w-1/2 transition-transform duration-500 group-hover:scale-[1.04]"
          fill="none"
          stroke="rgba(241,234,224,0.45)"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          {glyphs[product.category]}
        </svg>
        <span className="label absolute bottom-3 left-3 text-muted">
          фото скоро
        </span>
      </div>
    );
  }

  const tintSlot = product.tint
    ? product.leatherSlots.find((s) => s.id === product.tint!.slot)
    : undefined;
  // Под настоящий снимок перекраска не нужна — цвет уже на фотографии
  const mask = real ? undefined : product.tint?.masks[index];
  const tintHex = leatherById.get(colorId ?? tintSlot?.defaultColor ?? "")?.hex;

  return (
    <div
      className={cn(
        "relative aspect-square overflow-hidden bg-forest",
        // isolate — чтобы multiply смешивался только с фотографией,
        // а не со всей страницей
        "isolate",
        className,
      )}
    >
      <Image
        src={photo}
        alt={product.title}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
      {mask && tintHex && (
        // Маска сделана из того же кадра и совпадает с ним пиксель в пиксель,
        // поэтому раскладывается ровно так же, как фотография.
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-multiply transition-colors duration-200"
          style={{
            backgroundColor: tintHex,
            maskImage: `url(${mask})`,
            WebkitMaskImage: `url(${mask})`,
            maskSize: "cover",
            WebkitMaskSize: "cover",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        />
      )}
    </div>
  );
}
