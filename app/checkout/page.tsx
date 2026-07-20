"use client";

import { CreditCard, MapPin, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { currency } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useStore } from "@/services/store";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, couponCode, calculateTotals, clear } = useCart();
  const { getCoupon, findVariation, createOrderFromCheckout } = useStore();
  const [customer, setCustomer] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const coupon = couponCode ? getCoupon(couponCode) : undefined;
  const totals = calculateTotals(coupon);

  async function finishOrder() {
    setMessage("");
    if (items.length === 0) {
      setMessage("Seu carrinho esta vazio.");
      return;
    }
    if (!customer.trim()) {
      setMessage("Informe seu nome para concluir o pedido.");
      return;
    }
    for (const item of items) {
      const record = findVariation(item.variationId);
      if (!record || record.variation.stock < item.quantity) {
        setMessage(`Estoque insuficiente para ${item.name} (${item.size}/${item.color}).`);
        return;
      }
    }
    const result = await createOrderFromCheckout({
      customer,
      email,
      whatsapp,
      items: items.map((item) => ({
        productId: item.productId,
        variationId: item.variationId,
        product: item.name,
        variation: `${item.size} / ${item.color}`,
        quantity: item.quantity,
        sku: item.sku,
        unitPrice: item.price
      })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      total: totals.total
    });
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    clear();
    router.push(`/pedido-confirmado?pedido=${encodeURIComponent(result.order.id)}`);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold">Checkout</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <form className="grid gap-5 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <SectionTitle icon={<CreditCard size={18} />} title="Dados pessoais" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nome completo" placeholder="Seu nome" value={customer} onChange={(event) => setCustomer(event.target.value)} />
            <Input label="CPF" placeholder="000.000.000-00" />
            <Input label="E-mail" type="email" placeholder="voce@email.com" value={email} onChange={(event) => setEmail(event.target.value)} />
            <Input label="WhatsApp" placeholder="(00) 00000-0000" value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} />
          </div>
          <SectionTitle icon={<MapPin size={18} />} title="Endereco" />
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="CEP" placeholder="00000-000" />
            <Input label="Rua" className="sm:col-span-2" />
            <Input label="Numero" />
            <Input label="Bairro" />
            <Input label="Cidade/UF" />
          </div>
          <SectionTitle icon={<Truck size={18} />} title="Frete e pagamento" />
          <div className="grid gap-3 sm:grid-cols-3">
            {["PAC", "Sedex", "Retirada combinada"].map((item) => (
              <label key={item} className="rounded-md border border-ink/12 p-3 text-sm">
                <input type="radio" name="shipping" className="mr-2 accent-ink" /> {item}
              </label>
            ))}
            {["Pix", "Cartao", "Boleto"].map((item) => (
              <label key={item} className="rounded-md border border-ink/12 p-3 text-sm">
                <input type="radio" name="payment" className="mr-2 accent-ink" /> {item}
              </label>
            ))}
          </div>
          <p className="text-xs text-ink/45">A mutacao createOrderFromCheckout concentra a regra. Depois ela sera substituida por POST /api/orders.</p>
          {message && <p className="rounded-md bg-rose/10 p-3 text-sm text-rose">{message}</p>}
          <Button type="button" onClick={finishOrder}>Concluir pedido</Button>
        </form>
        <aside className="h-fit rounded-lg border border-ink/10 bg-ink p-5 text-white shadow-sm">
          <h2 className="font-semibold">Total do pedido</h2>
          <div className="mt-5 grid gap-3 text-sm text-white/75">
            <div className="flex justify-between"><span>Subtotal</span><span>{currency(totals.subtotal)}</span></div>
            <div className="flex justify-between"><span>Desconto</span><span>- {currency(totals.discount)}</span></div>
            <div className="flex justify-between"><span>Frete</span><span>{currency(totals.shipping)}</span></div>
            <div className="border-t border-white/10 pt-3 text-lg font-bold text-white flex justify-between"><span>Total</span><span>{currency(totals.total)}</span></div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mt-2 flex items-center gap-2 border-t border-ink/10 pt-5 first:mt-0 first:border-t-0 first:pt-0">
      <span className="text-gold">{icon}</span>
      <h2 className="font-semibold">{title}</h2>
    </div>
  );
}
