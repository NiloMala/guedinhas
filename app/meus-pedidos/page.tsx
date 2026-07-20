"use client";

import { PackageCheck, Truck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { currency } from "@/lib/utils";
import { useStore } from "@/services/store";

export default function MyOrdersPage() {
  const { orders } = useStore();

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold">Meus Pedidos</h1>
      <div className="mt-8 grid gap-4">
        {orders.length === 0 && <p className="rounded-lg border border-ink/10 bg-white p-5 text-sm text-ink/60">Nenhum pedido encontrado.</p>}
        {orders.map((order) => (
          <article key={order.id} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">Pedido {order.id}</h2>
                <p className="mt-1 text-sm text-ink/55">{order.createdAt} · {currency(order.total)}</p>
              </div>
              <Badge tone={order.status === "cancelado" ? "danger" : order.status === "entregue" ? "success" : "warning"}>{order.status}</Badge>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-ink/65">
              {order.items.map((item) => (
                <span key={`${order.id}-${item.product}-${item.variation}`}>{item.quantity}x {item.product} · {item.variation}</span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-md bg-champagne p-3 text-sm">
              {order.trackingCode ? <Truck size={18} className="text-gold" /> : <PackageCheck size={18} className="text-gold" />}
              {order.trackingCode ? `Rastreio: ${order.trackingCode}` : "Rastreio sera exibido quando o pedido for enviado."}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
