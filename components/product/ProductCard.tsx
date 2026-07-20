import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { currency } from "@/lib/utils";
import { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";

export function ProductCard({ product }: { product: Product }) {
  const totalStock = product.variations.reduce((sum, variation) => sum + variation.stock, 0);

  return (
    <Link href={`/produto/${product.slug}`} className="group block overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="relative aspect-[4/5] overflow-hidden bg-champagne">
        <Image src={product.images[0]} alt={product.name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex gap-2">
          {product.promo && <Badge tone="danger">Promo</Badge>}
          {product.featured && <Badge tone="neutral">Mais vendido</Badge>}
        </div>
      </div>
      <div className="grid gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-ink">{product.name}</h3>
          <ShoppingBag size={18} className="shrink-0 text-gold" />
        </div>
        <p className="text-xs text-ink/55">{product.category}</p>
        <div className="flex items-center justify-between">
          <strong className="text-base">{currency(product.salePrice)}</strong>
          <span className="text-xs text-ink/50">{totalStock > 0 ? `${totalStock} em estoque` : "Esgotado"}</span>
        </div>
      </div>
    </Link>
  );
}
