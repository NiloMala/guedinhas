"use client";

import { MessageCircle, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { currency } from "@/lib/utils";
import { createCartItem } from "@/services/cart";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types";

export function AddToCartPanel({ product }: { product: Product }) {
  const available = product.variations.filter((variation) => variation.stock > 0);
  const [variationId, setVariationId] = useState(available[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const selected = available.find((variation) => variation.id === variationId);

  const whatsappHref = useMemo(() => {
    const text = `Ola! Quero comprar ${product.name}${selected ? ` - ${selected.size}/${selected.color}` : ""}.`;
    return `https://wa.me/55129988945359?text=${encodeURIComponent(text)}`;
  }, [product.name, selected]);

  return (
    <section className="grid gap-5 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-gold">{product.category}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">{product.name}</h1>
        <p className="mt-3 text-2xl font-bold">{currency(product.salePrice)}</p>
      </div>
      <p className="text-sm leading-6 text-ink/65">{product.description}</p>
      <div className="grid gap-3">
        <span className="text-sm font-semibold">Variacao disponivel</span>
        <div className="flex flex-wrap gap-2">
          {available.map((variation) => (
            <button
              key={variation.id}
              onClick={() => setVariationId(variation.id)}
              className={`focus-ring rounded-md border px-3 py-2 text-sm ${variationId === variation.id ? "border-ink bg-ink text-white" : "border-ink/15 bg-white hover:border-gold"}`}
            >
              {variation.size} / {variation.color}
            </button>
          ))}
          {available.length === 0 && <Badge tone="danger">Produto esgotado</Badge>}
        </div>
      </div>
      {selected && (
        <div className="flex items-center justify-between rounded-md bg-champagne px-3 py-2 text-sm">
          <span>SKU {selected.sku}</span>
          <Badge tone={selected.stock <= selected.minStock ? "warning" : "success"}>{selected.stock} disponiveis</Badge>
        </div>
      )}
      <label className="grid gap-2 text-sm font-semibold">
        Quantidade
        <input
          type="number"
          min={1}
          max={selected?.stock ?? 1}
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
          className="focus-ring h-11 w-28 rounded-md border border-ink/12 px-3"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          disabled={!selected}
          onClick={() => selected && addItem(createCartItem(product, selected, quantity))}
        >
          <ShoppingBag size={18} /> Adicionar ao carrinho
        </Button>
        <Button href={whatsappHref} variant="secondary">
          <MessageCircle size={18} /> Comprar pelo WhatsApp
        </Button>
      </div>
      <p className="text-xs text-ink/45">Ao concluir uma venda no backend, dar baixa automatica em POST /api/orders/:id/complete.</p>
    </section>
  );
}
