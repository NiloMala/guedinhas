"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { currency } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { useStore } from "@/services/store";

export default function AccountPage() {
  const { orders } = useStore();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold">Minha Conta</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <form className="grid h-fit gap-4 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Dados pessoais</h2>
          <Input label="Nome" defaultValue="Mariana Alves" />
          <Input label="E-mail" defaultValue="mariana@email.com" />
          <Input label="WhatsApp" defaultValue="(11) 99999-0000" />
          <Button type="button">Salvar dados</Button>
        </form>
        <div className="grid gap-6">
          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <h2 className="font-semibold">Endereco principal</h2>
            <p className="mt-3 text-sm text-ink/60">Rua das Flores, 120 - Sao Paulo/SP</p>
            <Button variant="secondary" className="mt-4">Editar endereco</Button>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <h2 className="font-semibold">Historico de pedidos</h2>
            <div className="mt-4 grid gap-3">
              {orders.slice(0, 2).map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-md bg-champagne p-3 text-sm">
                  <span>{order.id} · {order.createdAt}</span>
                  <span className="flex items-center gap-3"><Badge>{order.status}</Badge>{currency(order.total)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
