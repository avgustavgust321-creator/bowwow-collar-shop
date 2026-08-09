import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader, Prose } from "@/components/ui/Page";
import { selectableLeatherColors } from "@/content/leather";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "О бренде",
  description:
    "BOW WOW COLLAR — мастерская кожаной амуниции для собак и кошек в Бресте.",
};

/**
 * ЗАПОЛНИТЬ: текст ниже — черновик, собранный по материалам инстаграма.
 * Перепишите его своими словами: как начался бренд, кто шьёт, откуда кожа,
 * сколько изделий уже сделано. Личная история продаёт лучше любого описания.
 */
export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="О бренде"
        lead="Мастерская кожаной амуниции для собак и кошек. Брест."
      />

      {/* Мастер и верстак до текста: в ручной работе человек за столом
          убеждает быстрее, чем абзац про ценности бренда. */}
      <section className="px-5 pb-4 md:px-8">
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          <Image
            src="/images/workshop/master.jpg"
            alt="Мастер за рабочим столом собирает ошейник"
            width={936}
            height={1400}
            sizes="(min-width: 640px) 50vw, 100vw"
            className="h-full w-full object-cover"
          />
          <Image
            src="/images/workshop/verstak.jpg"
            alt="Инструменты и заготовка ошейника на раскройном мате"
            width={1052}
            height={1400}
            sizes="(min-width: 640px) 50vw, 100vw"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <Prose>
        <p>
          BOW WOW COLLAR — небольшая мастерская, где ошейники, шлейки и поводки
          шьются поштучно. Не партиями на склад, а под конкретного питомца:
          с его замерами, в выбранном цвете и с его именем на бирке.
        </p>
        <p>
          Мы работаем с натуральной кожей и латунной фурнитурой. Кожа со
          временем темнеет и полируется от носки — вещь не изнашивается,
          а приобретает характер. Латунь не ржавеет и не облезает, как
          крашеный металл на массовых ошейниках.
        </p>
        <p>
          Двенадцать цветов кожи — от почти чёрного «Слизерина» до мятной
          «Тиффани». У каждого своё имя, и это не маркетинг: так проще
          выбирать, когда цвет — половина решения.
        </p>
      </Prose>

      <section className="px-5 pb-16 md:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="label text-muted">Палитра кожи</h2>
          <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {selectableLeatherColors.map((color) => (
              <div key={color.id} className="bg-cream">
                <div
                  className="aspect-4/3"
                  style={{ backgroundColor: color.hex }}
                />
                <p className="label px-3 py-3">{color.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 text-center md:px-8">
        <Link
          href="/catalog"
          className="label inline-block bg-forest px-8 py-4 text-cream transition-colors hover:bg-forest-lift"
        >
          Смотреть каталог
        </Link>
        <p className="mt-6 text-sm text-muted">
          Каждый день выкладываем работы в{" "}
          <a
            href={site.contacts.instagram}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-forest"
          >
            Instagram {site.contacts.instagramHandle}
          </a>
        </p>
      </section>
    </>
  );
}
