import Image from "next/image";
import Link from "next/link";
import { communityPhotos } from "@/content/community";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Значок инстаграма. Своей рисовкой, а не из lucide: оттуда бренд-иконки
 * убрали, и импорт Instagram ломает сборку.
 */
function InstagramMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Блок «В инстаграме»: фотографии собак, каждая — ссылка в инстаграм.
 *
 * Четыре кадра в ряд со ступенькой: каждый второй опущен. Ровная сетка
 * одинаковых плиток читалась бы как галерея из шаблона.
 *
 * Кадров именно четыре, а не шесть: шестью лента занимала полторы тысячи
 * пикселей и по площади перевешивала блок с самими товарами.
 *
 * Подписи под фотографиями нет намеренно: пока нет настоящих отзывов от
 * заказчиков, любой текст под чужой собакой был бы выдуманным.
 */
/** Наклоны снимков — небольшие, чтобы выглядело разложенным, а не упавшим */
const tilts = ["-rotate-2", "rotate-[1.5deg]", "-rotate-1", "rotate-2"];

export function Community() {
  return (
    <section className="px-5 py-16 md:px-10 md:py-24">
      <div className="wrap flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="hand -rotate-3 text-3xl text-gold-ink md:text-4xl">в инстаграме</p>
          <h2 className="display-xl mt-1 text-ink">
            Их <em className="text-gold-ink">собаки</em>
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <a
            href={site.contacts.instagram}
            target="_blank"
            rel="noreferrer"
            className="label inline-flex min-h-11 items-center gap-2 border-b border-gold transition-colors hover:border-forest hover:text-forest"
          >
            <InstagramMark className="size-4" />
            {site.contacts.instagramHandle}
          </a>
          {/* Здесь только четыре кадра — остальные собаки на своей странице */}
          <Link
            href="/dogs"
            className="label group inline-flex min-h-11 items-center gap-2 border-b border-gold transition-colors hover:border-forest hover:text-forest"
          >
            Все собаки
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>

      <ul className="wrap mt-14 grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-8">
        {communityPhotos.map((photo, i) => (
          <li
            key={photo.src}
            className={cn(
              // Снимки разложены, а не выставлены: лёгкий наклон в разные
              // стороны и ступенька — каждый второй опущен
              i % 2 === 1 && "mt-6 md:mt-10",
              tilts[i % tilts.length],
            )}
          >
            <a
              href={photo.href ?? site.contacts.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label={`${photo.alt} — открыть инстаграм ${site.contacts.instagramHandle}`}
              className="group relative block bg-cream p-2.5 pb-9 shadow-card transition-transform duration-500 hover:z-10 hover:rotate-0 hover:scale-[1.03] focus-visible:rotate-0 md:p-3 md:pb-12"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>

              {/* Значок проявляется под курсором — чтобы было понятно,
                  что кадр кликабельный и уводит наружу */}
              <span
                aria-hidden
                className="absolute inset-2.5 bottom-9 flex items-center justify-center bg-forest/0 md:inset-3 md:bottom-12 opacity-0 transition-all duration-300 group-hover:bg-forest/45 group-hover:opacity-100 group-focus-visible:bg-forest/45 group-focus-visible:opacity-100"
              >
                <InstagramMark className="size-8 text-cream" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
