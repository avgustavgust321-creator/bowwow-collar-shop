import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/ui/Page";
import { dogPhotos } from "@/content/dogs";
import { site } from "@/content/site";
import { getProduct } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Собаки в BOW WOW COLLAR",
  description:
    "Ошейники, шлейки и поводки BOW WOW COLLAR на собаках: на прогулке, " +
    "в городе и дома. Под снимком — модель, если захотите такую же.",
};

/**
 * Галерея собак в наших изделиях.
 *
 * Раскладка колонками, а не сеткой: снимки разной высоты встают без
 * обрезки, и собака целиком остаётся в кадре. Подпись есть только там,
 * где модель на фото видно наверняка — она ведёт прямо в карточку товара.
 */
export default function DogsPage() {
  return (
    <>
      <PageHeader
        title="Собаки"
        lead="Наши ошейники, шлейки и поводки в деле: на прогулке, в городе и дома. Под снимком — модель, если захотите такую же."
      />

      <section className="wrap px-5 py-12 md:px-10 md:py-16">
        <ul className="columns-2 gap-4 md:columns-3 md:gap-6 xl:columns-4">
          {dogPhotos.map((photo, i) => {
            const product = photo.product ? getProduct(photo.product) : undefined;
            const listed = product && !product.draft;
            return (
              <li
                key={photo.src}
                className="mb-4 break-inside-avoid bg-cream p-2 shadow-card md:mb-6 md:p-2.5"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  // Первые снимки видны сразу — грузим без очереди
                  loading={i < 4 ? "eager" : "lazy"}
                  sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"
                  className="h-auto w-full"
                />
                {listed && (
                  <Link
                    href={`/product/${product.slug}`}
                    className="group flex min-h-11 items-center justify-between gap-2 px-1 pt-2 text-sm text-ink"
                  >
                    <span>
                      <span className="label block text-muted">На фото</span>
                      <span className="transition-colors group-hover:text-forest">
                        {product.title}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="label text-forest transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="leather-texture -mb-20 bg-forest px-5 py-16 text-cream on-dark md:px-10 md:py-20">
        <div className="wrap flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="hand -rotate-3 text-3xl text-gold-light md:text-4xl">
              ваша собака тоже
            </p>
            <h2 className="display-xl mt-1">Хотите в галерею?</h2>
            <p className="mt-4 max-w-md text-cream-muted">
              Отметьте {site.contacts.instagramHandle} в инстаграме — лучшие
              снимки добавим сюда.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="label inline-flex min-h-11 items-center bg-rose px-7 py-4 text-forest transition-colors hover:bg-cream"
            >
              В каталог
            </Link>
            <a
              href={site.contacts.instagram}
              target="_blank"
              rel="noreferrer"
              className="label inline-flex min-h-11 items-center border border-cream/40 px-7 py-4 transition-colors hover:border-cream"
            >
              Инстаграм
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
