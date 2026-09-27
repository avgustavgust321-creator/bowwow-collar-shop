import Link from "next/link";
import { categories } from "@/content/categories";
import { listedProducts } from "@/lib/catalog";

// Категории без единого товара в продаже не показываем: «Миски» появятся
// в фильтре сами, когда миска выйдет из черновика
const liveCategories = categories.filter((c) =>
  listedProducts.some((p) => p.category === c.id),
);
import { cn } from "@/lib/cn";

type Params = { category?: string; pet?: string; sort?: string };

/** Ссылка на каталог с изменённым одним параметром, остальные сохраняются. */
function buildHref(current: Params, patch: Params): string {
  const next = { ...current, ...patch };
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(next)) {
    if (value) qs.set(key, value);
  }
  const query = qs.toString();
  return query ? `/catalog?${query}` : "/catalog";
}

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      className={cn(
        "label inline-flex min-h-11 items-center border px-4 transition-colors",
        active
          ? "border-forest bg-forest text-cream"
          : "border-line text-muted hover:border-forest hover:text-forest",
      )}
    >
      {children}
    </Link>
  );
}

/**
 * Фильтры каталога.
 *
 * Раньше здесь было двенадцать кнопок в трёх группах — на семь товаров.
 * Механика весила больше содержимого: до первого изделия человек проходил
 * четыреста пикселей переключателей, которые нечего переключать.
 *
 * Остались категории — единственный фильтр, который при таком каталоге
 * что-то меняет. «Для кого» и сортировка вернутся, когда позиций станет
 * хотя бы пара десятков: код для них лежит рядом и никуда не делся.
 */
export function Filters({ params }: { params: Params }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-y border-line py-5">
      <Chip
        href={buildHref(params, { category: undefined })}
        active={!params.category}
      >
        Все
      </Chip>
      {liveCategories.map((c) => (
        <Chip
          key={c.id}
          href={buildHref(params, { category: c.id })}
          active={params.category === c.id}
        >
          {c.title}
        </Chip>
      ))}
    </div>
  );
}
