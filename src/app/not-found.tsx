import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Страница не найдена",
};

/**
 * 404. Раньше здесь была одна цифра посреди пустого поля — страница
 * выпадала из сайта. Теперь она в его же языке: фото собаки в рамке,
 * рукописная подпись и два понятных пути дальше.
 */
export default function NotFound() {
  return (
    <section className="wrap grid items-center gap-10 px-5 py-16 md:grid-cols-[1fr_1.1fr] md:gap-16 md:px-10 md:py-24">
      <div>
        <p className="hand -rotate-3 text-3xl text-gold-ink md:text-4xl">
          ошибка 404
        </p>
        <h1 className="display-xl text-ink">
          Здесь <em className="text-gold-ink">пусто</em>
        </h1>
        <p className="mt-6 max-w-md text-muted">
          Такой страницы нет: ссылка устарела или в адресе опечатка. Возможно,
          изделие сняли с производства — загляните в каталог.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/catalog"
            className="label inline-flex min-h-12 items-center bg-forest px-8 text-cream transition-colors hover:bg-forest-lift"
          >
            В каталог
          </Link>
          <Link
            href="/"
            className="label inline-flex min-h-12 items-center border border-forest px-8 text-forest transition-colors hover:bg-forest hover:text-cream"
          >
            На главную
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-60 -rotate-2 bg-cream p-2.5 pb-10 shadow-card md:max-w-sm md:p-3 md:pb-14">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src="/images/sajt/sobaki/korgi.jpg"
            alt="Корги смотрит в камеру, будто что-то потерял"
            fill
            sizes="(min-width: 768px) 24rem, 90vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
