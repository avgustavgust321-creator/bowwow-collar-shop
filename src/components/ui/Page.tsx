/**
 * Общая обёртка текстовых страниц: заголовок и колонка текста.
 *
 * Заголовок и текст прижаты к одному левому краю. Раньше заголовок стоял
 * по центру, а всё под ним — слева, и глаз спотыкался на каждой странице.
 * Абзацы тоже были центрированы: в тексте из нескольких строк это мешает
 * читать — глазу негде найти начало следующей строки.
 */
export function PageHeader({
  title,
  lead,
}: {
  title: string;
  lead?: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="wrap relative px-5 pt-14 pb-12 md:px-10 md:pt-20">
        <h1 className="display-xl text-ink">{title}</h1>
        {lead && <p className="mt-6 max-w-xl text-muted">{lead}</p>}
      </div>
      {/* Полосатая кромка — фирменный приём, как над шагами на главной */}
      <div aria-hidden className="stripes-rose h-2" />
    </section>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="wrap px-5 py-14 md:px-10">
      <div className="flex max-w-2xl flex-col gap-5 text-muted">{children}</div>
    </div>
  );
}
