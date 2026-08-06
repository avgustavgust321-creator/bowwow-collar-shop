import Link from "next/link";
import { categories, pets } from "@/content/categories";
import { sortOptions } from "@/lib/catalog";
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
        "label border px-4 py-2 transition-colors",
        active
          ? "border-gold bg-forest text-cream"
          : "border-line text-muted hover:border-gold hover:text-forest",
      )}
    >
      {children}
    </Link>
  );
}

export function Filters({ params }: { params: Params }) {
  return (
    <div className="flex flex-col gap-5 border-y border-line py-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="label mr-2 text-muted">Категория</span>
        <Chip
          href={buildHref(params, { category: undefined })}
          active={!params.category}
        >
          Все
        </Chip>
        {categories.map((c) => (
          <Chip
            key={c.id}
            href={buildHref(params, { category: c.id })}
            active={params.category === c.id}
          >
            {c.title}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="label mr-2 text-muted">Для кого</span>
          <Chip href={buildHref(params, { pet: undefined })} active={!params.pet}>
            Все
          </Chip>
          {pets.map((p) => (
            <Chip
              key={p.id}
              href={buildHref(params, { pet: p.id })}
              active={params.pet === p.id}
            >
              {p.title}
            </Chip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="label mr-2 text-muted">Сортировка</span>
          {sortOptions.map((s) => (
            <Chip
              key={s.id}
              href={buildHref(params, {
                sort: s.id === "default" ? undefined : s.id,
              })}
              active={(params.sort ?? "default") === s.id}
            >
              {s.label}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
