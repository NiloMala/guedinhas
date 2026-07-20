export function InstitutionalPage({ title, text }: { title: string; text: string }) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Guedinhas</p>
      <h1 className="mt-3 font-display text-4xl font-semibold">{title}</h1>
      <p className="mt-5 text-base leading-8 text-ink/65">{text}</p>
    </section>
  );
}
