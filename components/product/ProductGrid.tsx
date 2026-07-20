import { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="grid min-h-72 place-items-center rounded-lg border border-dashed border-ink/20 bg-white p-8 text-center">
        <div>
          <h3 className="font-semibold">Nenhum produto encontrado</h3>
          <p className="mt-2 text-sm text-ink/55">Ajuste os filtros ou busque por outro termo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
