import { cn } from "@/lib/cn";

/**
 * Собака, занятая своими делами, — картинка для экрана загрузки.
 *
 * Нарисована линией в манере остальных иллюстраций бренда. Пока идёт
 * загрузка, позади неё по очереди появляются три «горошины»: это и есть
 * индикатор прогресса, отдельная полоска не нужна.
 *
 * Шутка по делу: холдер «Круассан» из каталога придуман ровно для
 * этого момента прогулки.
 *
 * ЗАМЕНИТЬ: это мой набросок. Когда придёт иллюстрация от вашего
 * художника — подставим её вместо этого SVG.
 */
export function PoopingDog({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 180"
      className={cn("w-64", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Собака присела по своим делам"
    >
      {/* спина: круп заметно ниже холки — та самая поза */}
      <path d="M70 110 C 80 86, 112 76, 150 80" />
      {/* шея */}
      <path d="M150 80 C 160 68, 174 56, 192 52" />
      {/* голова и морда */}
      <path d="M192 52 C 206 48, 219 54, 221 63 C 222 70, 215 75, 206 75 L 190 74" />
      <path d="M206 75 C 208 79, 205 83, 200 83" />
      {/* ухо */}
      <path d="M191 54 C 185 45, 174 45, 172 54 C 170 62, 177 67, 184 66" />
      <circle cx="201" cy="62" r="2.4" fill="currentColor" stroke="none" />
      {/* нос — по нему силуэт и опознаётся как собачий */}
      <circle cx="218" cy="60" r="3.4" fill="currentColor" stroke="none" />
      {/* грудь */}
      <path d="M190 74 C 180 86, 170 94, 162 98" />
      {/* живот */}
      <path d="M88 128 C 112 137, 142 132, 160 120" />
      {/* передние лапы — прямые, собака упирается */}
      <path d="M162 98 L 160 154 M160 154 L 172 157" />
      <path d="M147 102 L 143 154 M143 154 L 155 157" />
      {/* задние согнуты */}
      <path d="M76 112 C 63 127, 66 143, 81 150 L 96 154" />
      <path d="M93 118 C 85 130, 87 144, 100 152" />
      {/* хвост кверху */}
      <path d="M71 106 C 58 96, 52 76, 61 63 C 66 56, 75 58, 75 66" />
      {/* земля */}
      <path d="M30 160 L 214 160" opacity="0.3" />

      {/* «горошины» — индикатор загрузки */}
      <g fill="currentColor" stroke="none">
        <circle cx="60" cy="152" r="4.6">
          <animate
            attributeName="opacity"
            values="0;1;1;1;0"
            dur="2s"
            begin="0s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="46" cy="155" r="4">
          <animate
            attributeName="opacity"
            values="0;0;1;1;0"
            dur="2s"
            begin="0.35s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="33" cy="156" r="3.4">
          <animate
            attributeName="opacity"
            values="0;0;0;1;0"
            dur="2s"
            begin="0.7s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  );
}
