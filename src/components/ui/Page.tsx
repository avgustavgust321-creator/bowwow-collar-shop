
/** Общая обёртка для текстовых страниц: заголовок во всю ширину + колонка текста. */
export function PageHeader({
  title,
  lead,
}: {
  title: string;
  lead?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="relative px-5 pt-12 pb-10 md:px-8">
        <h1 className="display-hero text-center">{title}</h1>
        {lead && (
          <p className="mx-auto mt-8 max-w-xl text-center text-muted">{lead}</p>
        )}
      </div>
    </section>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-5 py-14 md:px-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-5 text-muted">
        {children}
      </div>
    </div>
  );
}
