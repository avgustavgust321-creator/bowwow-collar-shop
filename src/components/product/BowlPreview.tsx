"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * Живое превью миски в выбранных цветах.
 *
 * Миска собирается из двух цветов и произвольной надписи — сфотографировать
 * все сочетания невозможно, поэтому рисуем её: корпус в цвет основы,
 * рельефный пояс с текстом по кругу в цвет надписи, внутри стальная чаша.
 * Форма повторяет настоящую: книзу шире, пояс посередине с двумя канавками.
 *
 * Свет и фактура — поверх заливки: цилиндрическая тень по краям и мелкое
 * зерно, как у поверхности после 3D-печати. Без них любой цвет выглядел бы
 * плоской аппликацией.
 */

// Геометрия усечённого конуса: верх уже, низ шире — как у настоящей миски
const CX = 200;
const TOP = { cy: 96, rx: 116, ry: 25 };
const BOTTOM = { cy: 240, rx: 150, ry: 32 };

/** Сечение корпуса на доле высоты t (0 — верх, 1 — низ). */
function ring(t: number) {
  return {
    cy: TOP.cy + (BOTTOM.cy - TOP.cy) * t,
    rx: TOP.rx + (BOTTOM.rx - TOP.rx) * t,
    ry: TOP.ry + (BOTTOM.ry - TOP.ry) * t,
  };
}

/** Передняя дуга сечения — слева направо через ближнюю к зрителю сторону. */
function frontArc(t: number, move = true) {
  const r = ring(t);
  const start = `${CX - r.rx} ${r.cy}`;
  return `${move ? `M ${start} ` : ""}A ${r.rx} ${r.ry} 0 0 0 ${CX + r.rx} ${r.cy}`;
}

export function BowlPreview({
  base,
  textColor,
  inscription,
  placeholder = "ваша надпись",
  className,
}: {
  base: string;
  textColor: string;
  inscription?: string;
  placeholder?: string;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const id = (name: string) => `${name}-${uid}`;

  const text = inscription?.trim() || placeholder;
  const isPlaceholder = !inscription?.trim();
  // Текст занимает среднюю часть пояса: у краёв он уходит за изгиб
  const fontSize = Math.max(11, Math.min(22, 200 / (text.length * 0.6)));

  const band = { top: 0.4, bottom: 0.6 };
  const t1 = ring(band.top);
  const t2 = ring(band.bottom);

  const body =
    `M ${CX - TOP.rx} ${TOP.cy} L ${CX - BOTTOM.rx} ${BOTTOM.cy} ` +
    `A ${BOTTOM.rx} ${BOTTOM.ry} 0 0 0 ${CX + BOTTOM.rx} ${BOTTOM.cy} ` +
    `L ${CX + TOP.rx} ${TOP.cy} ` +
    `A ${TOP.rx} ${TOP.ry} 0 0 1 ${CX - TOP.rx} ${TOP.cy} Z`;

  const bandPath =
    `M ${CX - t1.rx} ${t1.cy} ` +
    `A ${t1.rx} ${t1.ry} 0 0 0 ${CX + t1.rx} ${t1.cy} ` +
    `L ${CX + t2.rx} ${t2.cy} ` +
    `A ${t2.rx} ${t2.ry} 0 0 1 ${CX - t2.rx} ${t2.cy} Z`;

  return (
    <div
      className={cn(
        "relative flex aspect-square items-center justify-center overflow-hidden bg-shell",
        className,
      )}
      style={{
        backgroundImage:
          "radial-gradient(120% 90% at 50% 35%, var(--color-cream) 0%, var(--color-shell) 55%, var(--color-shell-lift) 100%)",
      }}
    >
      <svg
        viewBox="0 20 400 280"
        role="img"
        aria-label={`Миска: ${isPlaceholder ? "без надписи" : `надпись «${text}»`}`}
        className="h-full max-h-full w-[88%]"
      >
        <defs>
          {/* Цилиндрическая светотень: края темнее, блик левее центра */}
          <linearGradient id={id("shade")} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity="0.34" />
            <stop offset="0.16" stopColor="#000" stopOpacity="0.1" />
            <stop offset="0.4" stopColor="#fff" stopOpacity="0.16" />
            <stop offset="0.58" stopColor="#fff" stopOpacity="0.04" />
            <stop offset="0.84" stopColor="#000" stopOpacity="0.14" />
            <stop offset="1" stopColor="#000" stopOpacity="0.36" />
          </linearGradient>
          <linearGradient id={id("floor")} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.18" />
          </linearGradient>
          <radialGradient id={id("steel")} cx="0.45" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#f1f2f3" />
            <stop offset="0.45" stopColor="#9fa4a8" />
            <stop offset="1" stopColor="#4a4f53" />
          </radialGradient>
          {/* Зерно поверхности после 3D-печати */}
          <filter id={id("grain")} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
          </filter>
          <filter id={id("blur")} x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <clipPath id={id("body")}>
            <path d={body} />
          </clipPath>
          <path id={id("line")} d={frontArc((band.top + band.bottom) / 2)} />
        </defs>

        {/* Тень на полу */}
        <ellipse
          cx={CX}
          cy={BOTTOM.cy + 12}
          rx={BOTTOM.rx + 14}
          ry={BOTTOM.ry - 6}
          fill="#000"
          opacity="0.2"
          filter={`url(#${id("blur")})`}
        />

        {/* Корпус */}
        <path d={body} fill={base} />
        <g clipPath={`url(#${id("body")})`}>
          <rect x="0" y="0" width="400" height="300" filter={`url(#${id("grain")})`} opacity="0.16" style={{ mixBlendMode: "multiply" }} />
          <rect x="40" y="60" width="320" height="220" fill={`url(#${id("shade")})`} />
          <rect x="40" y="170" width="320" height="110" fill={`url(#${id("floor")})`} />

          {/* Пояс с надписью: чуть светлее корпуса, по краям канавки */}
          <path d={bandPath} fill="#fff" opacity="0.07" />
          <path d={frontArc(band.top)} fill="none" stroke="#000" strokeOpacity="0.28" strokeWidth="1.6" />
          <path d={frontArc(band.top)} fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="1" transform="translate(0 1.6)" />
          <path d={frontArc(band.bottom)} fill="none" stroke="#000" strokeOpacity="0.28" strokeWidth="1.6" />
          <path d={frontArc(band.bottom)} fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="1" transform="translate(0 1.6)" />

          {/* Надпись — рельефом: светлый край сверху, тень снизу */}
          <g
            fontFamily="var(--font-sans), system-ui, sans-serif"
            fontWeight={700}
            fontSize={fontSize}
            letterSpacing="0.02em"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            <text fill="#000" opacity="0.35" transform="translate(0 1.2)">
              <textPath href={`#${id("line")}`} startOffset="50%">{text}</textPath>
            </text>
            <text fill="#fff" opacity="0.3" transform="translate(0 -0.8)">
              <textPath href={`#${id("line")}`} startOffset="50%">{text}</textPath>
            </text>
            <text fill={textColor} opacity={isPlaceholder ? 0.5 : 1}>
              <textPath href={`#${id("line")}`} startOffset="50%">{text}</textPath>
            </text>
          </g>
        </g>

        {/* Ободок и стальная чаша внутри */}
        <ellipse cx={CX} cy={TOP.cy} rx={TOP.rx} ry={TOP.ry} fill={base} />
        <ellipse cx={CX} cy={TOP.cy} rx={TOP.rx} ry={TOP.ry} fill="#fff" opacity="0.12" />
        <ellipse cx={CX} cy={TOP.cy + 1} rx={TOP.rx - 12} ry={TOP.ry - 5} fill={`url(#${id("steel")})`} />
        <ellipse cx={CX} cy={TOP.cy + 1} rx={TOP.rx - 12} ry={TOP.ry - 5} fill="none" stroke="#000" strokeOpacity="0.25" />

        {/* Контур — чтобы белая миска не растворялась на светлом фоне */}
        <path d={body} fill="none" stroke="#000" strokeOpacity="0.14" strokeWidth="1.2" />
        <ellipse cx={CX} cy={TOP.cy} rx={TOP.rx} ry={TOP.ry} fill="none" stroke="#000" strokeOpacity="0.14" strokeWidth="1.2" />
      </svg>
    </div>
  );
}
