import Image from "next/image";
import { workshopShots } from "@/content/workshop";

/**
 * «Как это шьётся» — четыре кадра из мастерской подряд.
 *
 * Для ручной работы это самый убедительный блок на странице: он показывает,
 * что за ценой стоит человек с ножом и иглой, а не склад. Поэтому кадры
 * идут в порядке работы и подписаны действием, а не настроением.
 *
 * Блок тёмно-зелёный: съёмка сделана при зелёном свете мастерской, на
 * кремовом фоне эти кадры выглядели бы грязными.
 */
export function Workshop() {
  return (
    <section className="bg-forest py-16 text-cream md:py-24">
      <div className="wrap px-5 md:px-10">
        <p className="hand text-rose">мастерская</p>
        <h2 className="display mt-3 max-w-2xl text-3xl md:text-5xl">
          Как это шьётся
        </h2>
        <p className="mt-4 max-w-lg text-cream-muted">
          Ошейник проходит через руки от куска кожи до готовой вещи: раскрой,
          пробойник, строчка. Длинные швы идут на машинке, а узлы, до которых
          машинка не достаёт, прошиваются иглой.
        </p>
      </div>

      <ol className="wrap mt-12 grid grid-cols-2 gap-px bg-forest-lift md:grid-cols-4">
        {workshopShots.map((shot, i) => (
          <li key={shot.src} className="relative bg-forest">
            <div className="relative aspect-[3/4]">
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
            <p className="label flex items-baseline gap-2 px-4 py-4">
              <span aria-hidden className="text-rose">
                {i + 1}
              </span>
              {shot.caption}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
