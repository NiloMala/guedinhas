import { CatalogClient } from "@/components/product/CatalogClient";

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const params = await searchParams;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Catalogo</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Produtos Guedinhas</h1>
      </div>
      <CatalogClient initialCategory={params.categoria ?? ""} />
    </section>
  );
}
