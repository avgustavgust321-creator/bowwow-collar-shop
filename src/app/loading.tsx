import { PoopingDog } from "@/components/brand/PoopingDog";

/**
 * Экран загрузки. Next показывает его, пока грузятся данные страницы.
 *
 * Реплики сменяют друг друга по кругу средствами CSS: так они не
 * примелькаются при частых переходах, а разметка остаётся статичной.
 */
const lines = [
  "Секунду, дела",
  "Занято, подождите",
  "Минутку, тут важное",
  "Сейчас, только закончим",
];

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-7 bg-[#06301E] px-5 py-20 text-[#E5A4BE]">
      <PoopingDog />

      <p className="relative h-4 w-full text-center">
        {lines.map((line, i) => (
          <span
            key={line}
            className="absolute inset-x-0 text-[0.72rem] tracking-[0.3em] text-[#9FBBA8] uppercase opacity-0 motion-reduce:animate-none motion-reduce:first:opacity-100"
            style={{
              animation: `caption-cycle ${lines.length * 2.6}s linear infinite`,
              animationDelay: `${i * 2.6}s`,
            }}
          >
            {line}
          </span>
        ))}
      </p>
    </div>
  );
}
