import { cn } from "@/lib/cn";

/**
 * Печать бренда: текст по кругу и монограмма в центре.
 *
 * Приём из референсов владельца — круглая печать «Café Aureum · Berlin»
 * и овальные медальоны Pin-Up Beauty. У нас это подпись мастерской:
 * ставится на стык блоков и поверх фотографий, как штамп на упаковке.
 *
 * Кольцо с текстом медленно вращается; монограмма стоит на месте.
 * При «уменьшить движение» вращение гасит общее правило в globals.css.
 */
export function Seal({
  className,
  ring = "var(--color-forest)",
  ink = "var(--color-cream)",
  accent = "var(--color-rose)",
  text = "BOW WOW COLLAR ✦ РУЧНАЯ РАБОТА ✦ БРЕСТ ✦ ",
  spin = true,
}: {
  className?: string;
  /** Цвет диска */
  ring?: string;
  /** Цвет текста по кругу */
  ink?: string;
  /** Цвет монограммы и звёздочек */
  accent?: string;
  text?: string;
  spin?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none relative aspect-square", className)}
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full">
        <circle cx="100" cy="100" r="98" fill={ring} />
        <circle cx="100" cy="100" r="91" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.7" />
        <circle cx="100" cy="100" r="58" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.7" />
      </svg>

      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 size-full"
        style={
          spin ? { animation: "seal-spin 40s linear infinite" } : undefined
        }
      >
        <defs>
          <path
            id="seal-circle"
            d="M 100,100 m -74,0 a 74,74 0 1,1 148,0 a 74,74 0 1,1 -148,0"
          />
        </defs>
        <text
          fill={ink}
          fontFamily="var(--font-sans), sans-serif"
          fontSize="13.5"
          fontWeight="600"
          letterSpacing="3.1"
        >
          <textPath href="#seal-circle" textLength="462">
            {text}
          </textPath>
        </text>
      </svg>

      {/* Монограмма: две буквы антиквой с курсивом */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full">
        <text
          x="100"
          y="112"
          textAnchor="middle"
          fill={accent}
          fontFamily="var(--font-display), serif"
          fontStyle="italic"
          fontSize="44"
        >
          BW
        </text>
      </svg>
    </div>
  );
}
