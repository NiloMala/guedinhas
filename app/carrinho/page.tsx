"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { currency } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useStore } from "@/services/store";

export default function CartPage() {
  const { items, couponCode, setCouponCode, calculateTotals, updateQuantity, removeItem } = useCart();
  const { getCoupon } = useStore();
  const coupon = couponCode ? getCoupon(couponCode) : undefined;
  const totals = calculateTotals(coupon);

  if (items.length === 0) {
    return (
      <section className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-4 py-16 text-center">
        <div>
          <h1 className="font-display text-4xl font-semibold">Carrinho vazio</h1>
          <p className="mt-3 text-ink/60">Escolha suas pecas favoritas para montar o pedido.</p>
          <Button href="/catalogo" className="mt-6">Ver catalogo</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold">Carrinho</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          {items.map((item) => (
            <article key={item.variationId} className="grid gap-4 rounded-lg border border-ink/10 bg-white p-4 shadow-sm sm:grid-cols-[96px_1fr_auto]">
              <div className="relative aspect-square overflow-hidden rounded-md bg-champagne">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="mt-1 text-sm text-ink/55">{item.size} / {item.color} · SKU {item.sku}</p>
                <div className="mt-4 flex w-fit items-center rounded-md border border-ink/12">
                  <button aria-label="Diminuir" onClick={() => updateQuantity(item.variationId, item.quantity - 1)} className="p-2"><Minus size={16} /></button>
                  <span className="w-10 text-center text-sm">{item.quantity}</span>
                  <button aria-label="Aumentar" onClick={() => updateQuantity(item.variationId, item.quantity + 1)} className="p-2"><Plus size={16} /></button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 sm:grid sm:justify-items-end">
                <strong>{currency(item.price * item.quantity)}</strong>
                <button aria-label="Remover item" onClick={() => removeItem(item.variationId)} className="focus-ring rounded-md p-2 text-rose hover:bg-rose/10">
                  <Trash2 size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
        <aside className="h-fit rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Resumo</h2>
          <Input label="Cupom de desconto" placeholder="GUEDINHAS8" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} className="mt-3" />
          {couponCode && (
            <p className={`mt-2 text-xs ${coupon ? "text-emerald-700" : "text-rose"}`}>
              {coupon ? `Cupom ${coupon.code} aplicado.` : "Cupom invalido ou expirado."}
            </p>
          )}
          <div className="mt-5 grid gap-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{currency(totals.subtotal)}</span></div>
            <div className="flex justify-between text-emerald-700"><span>Desconto</span><span>- {currency(totals.discount)}</span></div>
            <div className="flex justify-between"><span>Frete</span><span>{currency(totals.shipping)}</span></div>
            <div className="border-t border-ink/10 pt-3 text-base font-bold flex justify-between"><span>Total</span><span>{currency(totals.total)}</span></div>
          </div>
          <Button href="/checkout" className="mt-5 w-full">Finalizar compra</Button>
        </aside>
      </div>
    </section>
  );
}
