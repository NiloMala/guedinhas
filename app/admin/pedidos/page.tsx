"use client";

import { useMemo, useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { currency } from "@/lib/utils";
import { useStore } from "@/services/store";
import { OrderStatus } from "@/types";

const statuses: OrderStatus[] = ["pendente", "pago", "separado", "enviado", "entregue", "cancelado"];

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useStore();
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("");
  const [status, setStatus] = useState("");
  const [drafts, setDrafts] = useState<Record<string, { status: OrderStatus; trackingCode: string }>>({});
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const term = query.toLowerCase();
      const matchesQuery = !term || order.id.toLowerCase().includes(term) || order.customer.toLowerCase().includes(term);
      const matchesPeriod = !period || order.createdAt === period;
      const matchesStatus = !status || order.status === status;
      return matchesQuery && matchesPeriod && matchesStatus;
    });
  }, [orders, period, query, status]);

  function draftFor(orderId: string, fallback: { status: OrderStatus; trackingCode?: string }) {
    return drafts[orderId] || { status: fallback.status, trackingCode: fallback.trackingCode || "" };
  }

  async function saveStatus(orderId: string, dbId?: string) {
    const draft = drafts[orderId];
    if (!draft || !dbId) return;
    const result = await updateOrderStatus(dbId, draft.status, draft.trackingCode);
    setMessage(result.ok ? "Pedido atualizado." : result.message);
  }

  return (
    <div className="grid gap-6">
      {message && <p className="rounded-md border border-ink/10 bg-white p-3 text-sm text-ink/70">{message}</p>}
      <section className="grid gap-4 sm:grid-cols-3">
        <Input label="Buscar pedido ou cliente" placeholder="#1048 ou Mariana" value={query} onChange={(event) => setQuery(event.target.value)} />
        <Input label="Periodo" type="date" value={period} onChange={(event) => setPeriod(event.target.value)} />
        <label className="grid min-w-0 gap-2 text-sm font-medium">
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="focus-ring h-11 w-full min-w-0 rounded-md border border-ink/12 bg-white px-3 text-sm">
            <option value="">Todos</option>
            {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </section>
      <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <ClipboardCheck size={19} className="text-gold" />
          <h2 className="font-semibold">Gestao de pedidos</h2>
        </div>
        <div className="mt-4 grid gap-4">
          {filtered.length === 0 && <p className="rounded-md bg-champagne p-4 text-sm text-ink/60">Nenhum pedido encontrado.</p>}
          {filtered.map((order) => {
            const draft = draftFor(order.id, order);
            return (
              <article key={order.id} className="rounded-lg border border-ink/10 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{order.id} · {order.customer}</h3>
                    <p className="mt-1 text-sm text-ink/55">{order.createdAt} · {currency(order.total)}</p>
                  </div>
                  <Badge tone={order.status === "cancelado" ? "danger" : order.status === "entregue" ? "success" : "warning"}>{order.status}</Badge>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-ink/65">
                  {order.items.map((item) => (
                    <span key={`${order.id}-${item.product}-${item.variation}`}>{item.quantity}x {item.product} · {item.variation}</span>
                  ))}
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <select
                    value={draft.status}
                    onChange={(event) => setDrafts((current) => ({ ...current, [order.id]: { ...draft, status: event.target.value as OrderStatus } }))}
                    className="focus-ring h-11 w-full min-w-0 rounded-md border border-ink/12 bg-white px-3 text-sm"
                  >
                    {statuses.map((item) => <option key={item}>{item}</option>)}
                  </select>
                  <Input
                    aria-label="Codigo de rastreio"
                    placeholder="Codigo de rastreio"
                    value={draft.trackingCode}
                    onChange={(event) => setDrafts((current) => ({ ...current, [order.id]: { ...draft, trackingCode: event.target.value } }))}
                  />
                  <Button type="button" variant="secondary" onClick={() => saveStatus(order.id, order.dbId)}>Atualizar</Button>
                </div>
                <p className="mt-3 text-xs text-ink/45">Ao cancelar, updateOrderStatus devolve o estoque e registra StockMovement tipo estorno. Depois sera PATCH /api/orders/:id/status.</p>
              </article>
            );
          })}
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {["Clientes e historico de compras", "Cupons percentuais ou fixos", "Relatorios de vendas e giro"].map((title) => (
          <div key={title} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-ink/55">Modulo preparado para CRUD e filtros por periodo na integracao com API.</p>
          </div>
        ))}
      </section>
    </div>
  );
}
