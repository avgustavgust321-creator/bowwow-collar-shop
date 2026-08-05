import Link from "next/link";

export default function NotFound() {
  return (
    <section className="px-5 py-32 text-center md:px-8">
      <p className="display-hero">404</p>
      <p className="mt-6 text-muted">
        Такой страницы нет. Возможно, изделие сняли с производства.
      </p>
      <Link
        href="/catalog"
        className="label mt-8 inline-block bg-brass px-8 py-4 text-night transition-colors hover:bg-brass-light"
      >
        В каталог
      </Link>
    </section>
  );
}
