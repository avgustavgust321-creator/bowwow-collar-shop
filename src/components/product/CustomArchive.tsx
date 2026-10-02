import Image from "next/image";
import { archivePieces } from "@/content/custom-archive";
import { cn } from "@/lib/cn";

/**
 * «Сделано однажды» — архив заказных ошейников.
 *
 * Подан как музейная экспозиция: у каждой вещи инвентарный номер и
 * этикетка с описанием, поверх снимка — штамп «один экземпляр».
 * Каталог показывает, что можно купить, архив — что можно придумать.
 *
 * На телефоне лента листается вбок, чтобы шесть карточек не растягивали
 * страницу на несколько экранов.
 */
export function CustomArchive({
  className,
  limit,
}: {
  className?: string;
  limit?: number;
}) {
  const pieces = limit ? archivePieces.slice(0, limit) : archivePieces;

  return (
    <ul
      className={cn(
        "-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 md:pb-0",
        className,
      )}
    >
      {pieces.map((piece, i) => (
        <li
          key={piece.src}
          className="w-[72vw] max-w-80 shrink-0 snap-start md:w-auto md:max-w-none"
        >
          <figure className="group bg-cream p-2.5 shadow-card md:p-3">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={piece.src}
                alt={`${piece.title}. ${piece.note}`}
                fill
                sizes="(min-width: 768px) 30vw, 72vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <span
                aria-hidden
                className="label absolute top-3 right-3 rotate-6 border border-forest/60 bg-rose/90 px-2 py-1 text-forest"
              >
                1 экз.
              </span>
            </div>
            <figcaption className="px-1 pt-4 pb-2">
              <p className="label text-gold-ink">
                № {String(i + 1).padStart(2, "0")}
              </p>
              <p className="display mt-1 text-2xl text-ink">{piece.title}</p>
              <p className="mt-2 text-sm text-muted">{piece.note}</p>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
