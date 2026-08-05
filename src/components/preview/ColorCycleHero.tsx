"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { selectableLeatherColors } from "@/content/leather";
import { getProduct } from "@/lib/catalog";
import { usePrefersReducedMotion } from "@/lib/use-media-query";

/**
 * Герой: один ошейник, который сам перебирает цвета кожи.
 *
 * Работает на той же механике, что и конфигуратор: под фотографией
 * лежит обесцвеченный снимок, поверх — цвет через маску изделия.
 * Поэтому меняется именно кожа, а латунь, строчка и фон остаются.
 *
 * Смысл приёма: «двенадцать цветов, у каждого своё имя» — не текст
 * под заголовком, а то, что происходит на экране. Имя цвета проявляется
 * рядом и сменяется вместе с ним.
 *
 * При включённом «уменьшить движение» перебор останавливается на первом
 * цвете, и герой остаётся обычной фотографией.
 */

const HOLD_MS = 2600;

export function ColorCycleHero() {
  const product = getProduct("collar-solid");
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % selectableLeatherColors.length),
      HOLD_MS,
    );
    return () => clearInterval(id);
  }, [reducedMotion]);

  if (!product?.tint) return null;

  const color = selectableLeatherColors[index];
  const photo = product.images[0];
  const mask = product.tint.masks[0];

  return (
    <section className="relative isolate min-h-[92vh] overflow-hidden bg-[#06301E]">
      {/* Снимок с обесцвеченной кожей — основа для перекраски */}
      <Image
        src={photo}
        alt="Кожаный ошейник ручной работы"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-90"
      />

      {/* Цвет кожи: меняется плавно, остальное на снимке не трогает */}
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-multiply transition-colors duration-[1400ms] ease-in-out"
        style={{
          backgroundColor: color.hex,
          maskImage: `url(${mask})`,
          WebkitMaskImage: `url(${mask})`,
          maskSize: "cover",
          WebkitMaskSize: "cover",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />

      {/* Затемнение к низу, чтобы текст читался поверх фотографии */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(6,48,30,0.92) 0%, rgba(6,48,30,0.55) 42%, rgba(6,48,30,0.05) 70%)",
        }}
      />

      <div className="relative flex min-h-[92vh] flex-col justify-center px-6 py-24 md:px-16">
        <p className="text-[0.7rem] tracking-[0.34em] text-[#9FBBA8] uppercase">
          Минск · с 2019
        </p>

        <h1
          className="mt-8 max-w-2xl text-5xl leading-[1.03] font-light text-[#F1EAE0] md:text-7xl"
          style={{ fontFamily: "var(--font-preview-serif)" }}
        >
          Двенадцать оттенков,
          <br />у каждого своё имя
        </h1>

        {/* Имя цвета сменяется вместе с кожей на фотографии */}
        <div className="mt-10 flex items-baseline gap-4">
          <span
            className="size-3 rounded-full transition-colors duration-[1400ms]"
            style={{ backgroundColor: color.hex }}
          />
          <span
            key={color.id}
            className="animate-[fade-up_600ms_ease-out] text-3xl font-light text-[#F1EAE0] md:text-4xl"
            style={{ fontFamily: "var(--font-preview-serif)" }}
          >
            {color.name}
          </span>
        </div>

        <p className="mt-8 max-w-md leading-relaxed font-light text-[#C9D6CC]">
          Ошейники, шлейки и поводки из натуральной кожи. Латунная фурнитура,
          изготовление под конкретную собаку.
        </p>

        <div className="mt-12 flex flex-wrap gap-6">
          <a
            href="/catalog"
            className="border-b border-[#E5A4BE] pb-1 text-[0.72rem] tracking-[0.28em] text-[#F1EAE0] uppercase transition-colors hover:border-[#17A06A] hover:text-[#17A06A]"
          >
            Смотреть каталог
          </a>
          <a
            href="/sizing"
            className="border-b border-transparent pb-1 text-[0.72rem] tracking-[0.28em] text-[#9FBBA8] uppercase transition-colors hover:border-[#17A06A] hover:text-[#17A06A]"
          >
            Как замерить
          </a>
        </div>
      </div>
    </section>
  );
}
