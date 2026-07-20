"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { AddToCartPanel } from "@/components/product/AddToCartPanel";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/services/store";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const { products, findProduct } = useStore();
  const product = findProduct(params.slug);

  if (!product) {
    return (
      <section className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-4 text-center">
        <div>
          <h1 className="font-display text-4xl font-semibold">Produto nao encontrado</h1>
          <Button href="/catalogo" className="mt-6">Voltar ao catalogo</Button>
        </div>
      </section>
    );
  }

  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-champagne">
            <Image src={product.images[0]} alt={product.name} fill priority className="object-cover" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {product.images.map((image) => (
              <div key={image} className="relative aspect-square overflow-hidden rounded-md bg-champagne">
                <Image src={image} alt={product.name} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <AddToCartPanel product={product} />
      </div>
      <div className="mt-14">
        <h2 className="font-display text-3xl font-semibold">Tambem combina</h2>
        <div className="mt-6"><ProductGrid products={related.length ? related : products.slice(0, 4)} /></div>
      </div>
    </section>
  );
}
