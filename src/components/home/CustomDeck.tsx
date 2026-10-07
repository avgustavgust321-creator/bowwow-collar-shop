import Image from "next/image";
import { archivePieces } from "@/content/custom-archive";
import { cn } from "@/lib/cn";

/**
 * Колода из трёх заказных ошейников для блока «Сошьём по вашей идее».
 *
 * Карточки лежат внахлёст с наклоном −8° / 0° / +8°. Когда курсор над
 * блоком, колода раскрывается веером, а карточка под курсором ещё
 * и приподнимается. Движение на CSS с «перелётом» в конце
 * (cubic-bezier 0.34, 1.56…) — похоже на пружину без библиотеки
 * анимаций, которую мы убрали ради скорости.
 *
 * За колодой — огромное «на заказ» с градиентом в прозрачность:
 * надпись читается фоном, а не спорит с заголовком слева.
 */

const cards = [
  {
    // Левая: отклонена влево, при раскрытии уходит ещё левее
    base: "z-10 -mr-12 rotate-[-8deg] sm:-mr-14 md:-mr-16",
    fan: "group-hover:-translate-x-6 group-hover:-translate-y-3 group-hover:rotate-[-13deg]",
  },
  {
    base: "z-20 scale-105",
    fan: "group-hover:-translate-y-4",
  },
  {
    base: "z-10 -ml-12 rotate-[8deg] sm:-ml-14 md:-ml-16",
    fan: "group-hover:translate-x-6 group-hover:-translate-y-3 group-hover:rotate-[13deg]",
  },
];

export function CustomDeck() {
  return (
    <div
      aria-hidden
      className="relative flex flex-col items-center pt-[11vw] pb-4 sm:pt-16 md:pt-16 md:pb-6 lg:pt-24"
    >
      {/* Надпись сверху, карточки наезжают на её нижнюю половину —
          так она читается целиком, а не выглядывает краями из-за колоды */}
      <p className="display pointer-events-none absolute inset-x-0 top-0 bg-linear-to-b from-cream/50 via-cream/20 to-transparent bg-clip-text text-center text-[16vw] leading-[1.1] whitespace-nowrap text-transparent italic select-none md:text-[5.5rem] lg:text-[8rem]">
        на заказ
      </p>

      <div className="relative flex items-end justify-center">
        {archivePieces.slice(0, 3).map((piece, i) => (
          <div
            key={piece.src}
            className={cn(
              "relative w-28 origin-bottom bg-cream p-1.5 pb-6 shadow-[0_15px_40px_rgba(0,0,0,0.35)] sm:w-36 md:w-40 md:p-2 md:pb-8 lg:w-44",
              "transition-[translate,rotate,scale] duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:z-30 hover:scale-[1.08] motion-reduce:transition-none",
              cards[i].base,
              cards[i].fan,
            )}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={piece.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 11rem, (min-width: 640px) 9rem, 7rem"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
