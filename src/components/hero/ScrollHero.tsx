"use client";

import { useEffect, useRef } from "react";
import { IBM_Plex_Mono, Literata, Manrope } from "next/font/google";
import { usePrefersReducedMotion } from "@/lib/use-media-query";

/**
 * Первый экран: сцена, которой управляет прокрутка.
 *
 * Видео не играет само — его кадр привязан к положению страницы.
 * Блок делится на пять зон: пауза, движение, пауза, движение, пауза.
 * Текст показывается только на паузах.
 *
 * Последний кадр первого ролика совпадает с первым кадром второго,
 * поэтому подмена ролика на середине пути незаметна.
 *
 * ШРИФТЫ: в задании были Fraunces и Work Sans, но у них нет кириллицы —
 * весь русский текст свалился бы в системный шрифт. Взяты ближайшие
 * с кириллицей: Literata вместо Fraunces, Manrope вместо Work Sans.
 */

const literata = Literata({
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400"],
  variable: "--font-hero-serif",
});

const manrope = Manrope({
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400"],
  variable: "--font-hero-sans",
});

const mono = IBM_Plex_Mono({
  subsets: ["cyrillic", "latin"],
  weight: ["400"],
  variable: "--font-hero-mono",
});

const palette = {
  bg: "#1b120d",
  brass: "#b98a46",
  brassLight: "#dcb26c",
  text: "#f3e9d8",
  muted: "#c7b8a2",
};

/** Три остановки сцены — по одной на каждую паузу. */
const stops = [
  {
    eyebrow: "Ошейник",
    title: "Сшит по её меркам",
    lines: [
      "Натуральная кожа и латунь-антик.",
      "Двенадцать оттенков, размеры по замерам вашей собаки.",
    ],
  },
  {
    eyebrow: "Поводок",
    title: "Латунь, которая держит",
    lines: [
      "Литой карабин с широким зевом.",
      "Кожаные вставки на местах крепления, шнур не режет ладонь.",
    ],
  },
  {
    eyebrow: "Комплект",
    title: "Собирается в один цвет",
    lines: ["Ошейник, поводок и шлейка шьются из одной кожи."],
  },
];

/** Плавная ступенька: 0 до a, 1 после b. */
const ramp = (v: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (v - a) / (b - a)));

/**
 * Сцена идёт с постоянной скоростью и не зависит от того, как резко
 * крутят колесо. Прокрутка задаёт только цель, а кадр подтягивается
 * к ней с ограничением скорости — поэтому «пролистать» ролик рывком
 * нельзя, он всё равно отыграет свои секунды.
 */
const SPEED = 1.6; // во столько раз быстрее реального времени ролика
const PAUSE_SPEED = 0.5; // доли прокрутки в секунду на паузах между сценами

/**
 * Длина прокрутки всей сцены. Страница всё равно не уедет вперёд сцены
 * (см. clampScroll), поэтому пяти экранов не нужно — темп задаёт время,
 * а не высота блока.
 */
const SCENE_HEIGHT = "300vh";

/**
 * Кадр по горизонтали на узком экране. Ролик снят в 4:3, на телефоне
 * от него остаётся вертикальная полоса: 50% обрезали бы ошейник слева,
 * поэтому окно кадра сдвинуто и собака стоит правее.
 */
const MOBILE_FRAMING =
  "object-[38%_center] md:object-center bg-[position:38%_center] md:bg-center";

/**
 * Постер лежит ещё и фоном самого <video>. Атрибут poster исчезает, как
 * только отрисован первый кадр, и если следующий кадр ещё не скачался,
 * на его месте виден фон страницы — тот самый коричневый экран. Фоновая
 * картинка держится всё время и закрывает эти провалы.
 */
const posterBackdrop = (src: string) => ({
  backgroundImage: `url(${src})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
});

export function ScrollHero() {
  const reducedMotion = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const textRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (reducedMotion) return;

    const wrap = wrapRef.current;
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!wrap || !v1 || !v2) return;

    // iOS сам данные ролика не тянет: пока не запустишь воспроизведение,
    // в буфере пусто и перемотка показывает пустой кадр. Короткий
    // «завод» play → pause заставляет браузер начать загрузку.
    const kick = (video: HTMLVideoElement) => {
      const started = video.play();
      if (started) started.then(() => video.pause()).catch(() => {});
    };
    kick(v1);

    // Второй ролик тянем только после первого: иначе они делят канал
    // пополам и видимый экран ждёт лишнее. Он нужен лишь с середины сцены.
    const loadSecond = () => {
      if (v2.preload === "auto") return;
      v2.preload = "auto";
      v2.load();
      kick(v2);
    };
    if (v1.readyState >= 3) loadSecond();
    else v1.addEventListener("canplaythrough", loadSecond, { once: true });

    let raf = 0;
    /** Где сцена находится сейчас. Тянется к прокрутке, но не мгновенно. */
    let shown = -1;
    /** Куда её просят: рывок прокрутки двигает цель, но не саму сцену. */
    let desired = 0;
    /** Куда мы сами прижали страницу; -1 — не держим. */
    let forcedY = -1;
    let prevTime = 0;

    /** Перемотка без очереди запросов: пока идёт поиск кадра, новый не шлём. */
    const seek = (video: HTMLVideoElement, time: number) => {
      if (!Number.isFinite(time) || video.seeking) return;
      if (Math.abs(video.currentTime - time) < 0.02) return;
      video.currentTime = time;
    };

    /**
     * Предел скорости в текущей точке сцены. В зонах движения он привязан
     * к длине ролика: двадцать процентов прокрутки = его длительность.
     * Паузы кадром не заняты, их проходим быстрее, иначе сцена вязнет.
     */
    const speedLimit = (p: number, d1: number, d2: number) => {
      if (p > 0.18 && p < 0.42) return (0.2 / (d1 || 3)) * SPEED;
      if (p > 0.58 && p < 0.82) return (0.2 / (d2 || 5)) * SPEED;
      return PAUSE_SPEED;
    };

    const tick = (now: number) => {
      const rect = wrap.getBoundingClientRect();
      const scrollable = wrap.offsetHeight - window.innerHeight;
      const wrapTop = rect.top + window.scrollY;
      const raw = Math.min(1, Math.max(0, -rect.top / scrollable));

      const d1 = v1.duration || 0;
      const d2 = v2.duration || 0;

      // Первый кадр — встаём сразу туда, где страница уже стоит,
      // иначе после перезагрузки посередине сцена поползёт с начала.
      if (shown < 0) {
        shown = raw;
        desired = raw;
        prevTime = now;
      }

      // Цель помнит, куда просили, даже когда страницу держим на месте.
      // Читаем её только если страницу двигал человек: наш собственный
      // прижим иначе выглядел бы как прокрутка вверх и сцена бы встала.
      const movedByUser =
        forcedY < 0 || Math.abs(window.scrollY - forcedY) > 2;
      if (movedByUser) {
        if (raw < shown - 0.002) desired = raw; // листают вверх
        else if (raw > desired) desired = raw; // просят дальше
      }

      // Шаг ограничен по величине: рывок колеса цель двигает, скорость — нет.
      const dt = Math.min(0.05, (now - prevTime) / 1000);
      prevTime = now;
      const diff = desired - shown;
      const step = speedLimit(shown, d1, d2) * dt;
      shown += Math.abs(diff) <= step ? diff : Math.sign(diff) * step;

      // Пока сцена догоняет цель, страница едет вместе с ней и ни на пиксель
      // вперёд: пролистать первый экран, не досмотрев его, нельзя. Просто
      // упереть страницу не выйдет — сцена уходила бы вперёд, и её отставание
      // читалось бы как прокрутка вверх. Вверх пускаем свободно: над первым
      // экраном всё равно только шапка.
      forcedY = -1;
      if (desired > shown + 0.0005 && shown < 0.999) {
        const pinned = wrapTop + scrollable * shown;
        if (Math.abs(window.scrollY - pinned) > 1) window.scrollTo(0, pinned);
        forcedY = window.scrollY;
      }

      // Зоны 1–2: первый ролик. Зоны 4–5: второй.
      if (shown < 0.4) {
        seek(v1, d1 * ramp(shown, 0.2, 0.4));
      } else {
        seek(v2, d2 * ramp(shown, 0.6, 0.8));
      }

      // Подмена ролика ровно на стыке одинаковых кадров
      const showSecond = shown >= 0.4;
      v1.style.opacity = showSecond ? "0" : "1";
      v2.style.opacity = showSecond ? "1" : "0";

      // Текст виден только на паузах и гаснет до начала движения
      const visibility = [
        1 - ramp(shown, 0.15, 0.19),
        ramp(shown, 0.41, 0.45) * (1 - ramp(shown, 0.55, 0.59)),
        ramp(shown, 0.81, 0.85),
      ];
      visibility.forEach((value, i) => {
        const node = textRefs.current[i];
        if (!node) return;
        node.style.opacity = String(value);
        node.style.transform = `translateY(${(1 - value) * 14}px)`;
        node.style.pointerEvents = value > 0.6 ? "auto" : "none";
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      v1.removeEventListener("canplaythrough", loadSecond);
    };
  }, [reducedMotion]);

  const fontVars = `${literata.variable} ${manrope.variable} ${mono.variable}`;

  const Overlay = ({
    stop,
    index,
    withCta,
    isStatic = false,
  }: {
    stop: (typeof stops)[number];
    index: number;
    withCta?: boolean;
    isStatic?: boolean;
  }) => (
    <div
      ref={(node) => {
        if (!isStatic) textRefs.current[index] = node;
      }}
      className="absolute inset-x-0 bottom-0 px-6 pb-16 md:px-14 md:pb-20"
      style={{
        fontFamily: "var(--font-hero-sans)",
        opacity: isStatic ? 1 : 0,
      }}
    >
      <p
        className="text-[0.68rem] tracking-[0.32em] uppercase"
        style={{ fontFamily: "var(--font-hero-mono)", color: palette.brass }}
      >
        {stop.eyebrow}
      </p>
      <h2
        className="mt-4 max-w-2xl text-4xl leading-[1.08] font-light md:text-6xl"
        style={{ fontFamily: "var(--font-hero-serif)", color: palette.text }}
      >
        {stop.title}
      </h2>
      <div className="mt-4 max-w-md space-y-1 font-light" style={{ color: palette.muted }}>
        {stop.lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      {withCta && (
        <a
          href="/catalog"
          className="mt-8 inline-flex min-h-11 items-center rounded-full px-7 text-[0.72rem] tracking-[0.28em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
          style={{
            fontFamily: "var(--font-hero-mono)",
            background: palette.brass,
            color: palette.bg,
            outlineColor: palette.brassLight,
          }}
        >
          Смотреть каталог
        </a>
      )}
    </div>
  );

  // ── Без движения: три кадра друг под другом, тот же текст ──
  if (reducedMotion) {
    return (
      <div className={fontVars} style={{ background: palette.bg }}>
        {stops.map((stop, i) => (
          <section key={stop.eyebrow} className="relative h-[80vh] overflow-hidden">
            <video
              src={i === 0 ? "/videos/hero-1.mp4" : "/videos/hero-2.mp4"}
              poster={
                i === 0 ? "/videos/hero-1-poster.jpg" : "/videos/hero-2-poster.jpg"
              }
              muted
              playsInline
              preload="metadata"
              className={`h-full w-full object-cover ${MOBILE_FRAMING}`}
              onLoadedMetadata={(e) => {
                const el = e.currentTarget;
                el.currentTime = i === 0 ? 0 : i === 1 ? 0 : el.duration || 0;
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(27,18,13,0.92) 0%, rgba(27,18,13,0.35) 45%, transparent 75%)",
              }}
            />
            <Overlay stop={stop} index={i} withCta={i === 2} isStatic />
          </section>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className={`relative ${fontVars}`}
      style={{ height: SCENE_HEIGHT, background: palette.bg }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* poster рисуется до того, как подгрузится сам ролик — первый
            экран виден сразу, а не тёмным прямоугольником */}
        <video
          ref={video1Ref}
          src="/videos/hero-1.mp4"
          poster="/videos/hero-1-poster.jpg"
          muted
          playsInline
          preload="auto"
          style={posterBackdrop("/videos/hero-1-poster.jpg")}
          className={`absolute inset-0 h-full w-full object-cover ${MOBILE_FRAMING}`}
        />
        <video
          ref={video2Ref}
          src="/videos/hero-2.mp4"
          poster="/videos/hero-2-poster.jpg"
          muted
          playsInline
          preload="metadata"
          style={posterBackdrop("/videos/hero-2-poster.jpg")}
          className={`absolute inset-0 h-full w-full object-cover opacity-0 ${MOBILE_FRAMING}`}
        />

        {/* Градиент под текстом — только ради читаемости, без плашек */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(27,18,13,0.9) 0%, rgba(27,18,13,0.3) 42%, transparent 70%)",
          }}
        />

        {stops.map((stop, i) => (
          <Overlay key={stop.eyebrow} stop={stop} index={i} withCta={i === 2} />
        ))}
      </div>
    </div>
  );
}
