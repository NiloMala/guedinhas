"use client";

import { AlertTriangle, DollarSign, ShoppingBag, Users } from "lucide-react";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { StatCard } from "@/components/admin/StatCard";
import { StockBadge } from "@/components/admin/StockBadge";
import { currency } from "@/lib/utils";
import { useStore } from "@/services/store";

export default function AdminDashboardPage() {
  const { orders, products } = useStore();
  const activeOrders = orders.filter((order) => order.status !== "cancelado");
  const today = new Date().toISOString().slice(0, 10);
  const month = today.slice(0, 7);
  const todayOrders = activeOrders.filter((order) => order.createdAt === today);
  const monthOrders = activeOrders.filter((order) => order.createdAt.startsWith(month));
  const todayTotal = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const monthTotal = monthOrders.reduce((sum, order) => sum + order.total, 0);
  const lowStock = products.flatMap((product) => product.variations.map((variation) => ({ product: product.name, ...variation }))).filter((variation) => variation.stock <= variation.minStock);

  const soldMap = new Map<string, { name: string; quantity: number; revenue: number }>();
  activeOrders.forEach((order) => {
    order.items.forEach((item) => {
      const current = soldMap.get(item.product) || { name: item.product, quantity: 0, revenue: 0 };
      soldMap.set(item.product, {
        name: item.product,
        quantity: current.quantity + item.quantity,
        revenue: current.revenue + (item.unitPrice || 0) * item.quantity
      });
    });
  });
  const bestSellers = Array.from(soldMap.values()).sort((a, b) => b.quantity - a.quantity).slice(0, 3);

  const revenueData = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    return {
      day: date.toLocaleDateString("pt-BR", { weekday: "short" }),
      value: activeOrders.filter((order) => order.createdAt === key).reduce((sum, order) => sum + order.total, 0)
    };
  });

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Vendas hoje" value={currency(todayTotal)} detail={`${todayOrders.length} pedidos ativos`} icon={<DollarSign size={20} />} />
        <StatCard title="Vendas do mes" value={currency(monthTotal)} detail={`${monthOrders.length} pedidos no periodo`} icon={<ShoppingBag size={20} />} />
        <StatCard title="Clientes" value={String(new Set(orders.map((order) => order.customer)).size)} detail="Clientes com pedidos registrados" icon={<Users size={20} />} />
        <StatCard title="Alertas de estoque" value={String(lowStock.length)} detail="Variacoes abaixo do minimo" icon={<AlertTriangle size={20} />} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <RevenueChart data={revenueData} />
        <aside className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Estoque baixo</h2>
          <div className="mt-4 grid gap-3">
            {lowStock.length === 0 && <p className="text-sm text-ink/55">Nenhum alerta no momento.</p>}
            {lowStock.map((variation) => (
              <div key={variation.sku} className="rounded-md bg-champagne p-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-medium">{variation.product}</span>
                  <StockBadge stock={variation.stock} min={variation.minStock} />
                </div>
                <p className="mt-1 text-ink/55">{variation.size} / {variation.color} · {variation.stock} un.</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
      <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">Produtos mais vendidos</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {bestSellers.length === 0 && <p className="text-sm text-ink/55">Nenhuma venda registrada ainda.</p>}
          {bestSellers.map((product) => (
            <div key={product.name} className="rounded-md border border-ink/10 p-3 text-sm">
              <span className="font-medium">{product.name}</span>
              <p className="mt-1 text-ink/55">{product.quantity} un. · {currency(product.revenue)}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">Pedidos recentes</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="text-ink/50">
              <tr><th className="py-2">Pedido</th><th>Cliente</th><th>Status</th><th>Total</th></tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-ink/8"><td className="py-3">{order.id}</td><td>{order.customer}</td><td>{order.status}</td><td>{currency(order.total)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
