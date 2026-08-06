import Image from "next/image";
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
 * Сетка нарочно неровная: вертикальные кадры занимают две строки, часть
 * снимков сдвинута вниз. Ровная сетка одинаковых квадратов читалась бы
 * как галерея из шаблона, а здесь нужен вид ленты, собранной руками.
 *
 * Подписи под фотографиями нет намеренно: пока нет настоящих отзывов от
 * заказчиков, любой текст под чужой собакой был бы выдуманным.
 */
export function Community() {
  return (
    <section className="px-5 py-16 md:px-10 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="hand text-gold-ink">их собаки</p>
          <h2 className="display mt-2 text-3xl md:text-5xl">В инстаграме</h2>
        </div>
        <a
          href={site.contacts.instagram}
          target="_blank"
          rel="noreferrer"
          className="label inline-flex items-center gap-2 border-b border-gold pb-1 transition-colors hover:border-forest hover:text-forest"
        >
          <InstagramMark className="size-4" />
          {site.contacts.instagramHandle}
        </a>
      </div>

      <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {communityPhotos.map((photo, i) => (
          <li
            key={photo.src}
            className={cn(
              photo.tall && "row-span-2",
              // лёгкая ступенька: каждый второй кадр опущен
              i % 2 === 1 && "mt-6 md:mt-10",
            )}
          >
            <a
              href={photo.href ?? site.contacts.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label={`${photo.alt} — открыть инстаграм ${site.contacts.instagramHandle}`}
              className="group relative block h-full overflow-hidden"
            >
              <div
                className={cn(
                  "relative h-full w-full",
                  photo.tall ? "aspect-[3/4]" : "aspect-[4/3]",
                )}
              >
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
                className="absolute inset-0 flex items-center justify-center bg-forest/0 opacity-0 transition-all duration-300 group-hover:bg-forest/45 group-hover:opacity-100 group-focus-visible:bg-forest/45 group-focus-visible:opacity-100"
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
