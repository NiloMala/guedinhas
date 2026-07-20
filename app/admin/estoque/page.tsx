"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, History } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StockBadge } from "@/components/admin/StockBadge";
import { useStore } from "@/services/store";

export default function AdminStockPage() {
  const { products, stockMovements, addStockMovement } = useStore();
  const [entry, setEntry] = useState({ sku: "", quantity: 1, supplier: "", responsible: "Admin", reason: "Compra de fornecedor" });
  const [exit, setExit] = useState({ sku: "", quantity: 1, reason: "Ajuste manual", responsible: "Admin" });
  const [message, setMessage] = useState("");

  const variations = useMemo(
    () => products.flatMap((product) => product.variations.map((variation) => ({ product: product.name, category: product.category, ...variation }))),
    [products]
  );

  async function registerEntry(event: FormEvent) {
    event.preventDefault();
    const result = await addStockMovement({
      sku: entry.sku,
      type: "entrada",
      quantity: Number(entry.quantity),
      reason: entry.reason || `Compra de fornecedor ${entry.supplier}`,
      responsible: entry.responsible
    });
    setMessage(result.ok ? "Entrada registrada e estoque atualizado." : result.message);
  }

  async function registerExit(event: FormEvent) {
    event.preventDefault();
    const result = await addStockMovement({
      sku: exit.sku,
      type: "saida",
      quantity: Number(exit.quantity),
      reason: exit.reason,
      responsible: exit.responsible
    });
    setMessage(result.ok ? "Saida registrada e estoque atualizado." : result.message);
  }

  return (
    <div className="grid gap-6">
      {message && <p className="rounded-md border border-ink/10 bg-white p-3 text-sm text-ink/70">{message}</p>}
      <section className="grid gap-4 lg:grid-cols-2">
        <form onSubmit={registerEntry} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <ArrowUpCircle size={20} className="text-emerald-600" />
            <h2 className="font-semibold">Entrada de mercadoria</h2>
          </div>
          <div className="mt-4">
            <SkuSelect value={entry.sku} onChange={(sku) => setEntry((current) => ({ ...current, sku }))} variations={variations} />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Input label="Quantidade" type="number" min={1} value={entry.quantity} onChange={(event) => setEntry((current) => ({ ...current, quantity: Number(event.target.value) }))} />
            <Input label="Fornecedor" placeholder="Atelie Rosa" value={entry.supplier} onChange={(event) => setEntry((current) => ({ ...current, supplier: event.target.value }))} />
            <Input label="Responsavel" value={entry.responsible} onChange={(event) => setEntry((current) => ({ ...current, responsible: event.target.value }))} />
          </div>
          <Input label="Motivo" value={entry.reason} onChange={(event) => setEntry((current) => ({ ...current, reason: event.target.value }))} className="mt-3" />
          <p className="mt-3 text-xs text-ink/45">A mutacao addStockMovement soma ao estoque. Depois sera POST /api/stock-movements.</p>
          <Button type="submit" className="mt-4">Registrar entrada</Button>
        </form>
        <form onSubmit={registerExit} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <ArrowDownCircle size={20} className="text-rose" />
            <h2 className="font-semibold">Saida manual</h2>
          </div>
          <div className="mt-4">
            <SkuSelect value={exit.sku} onChange={(sku) => setExit((current) => ({ ...current, sku }))} variations={variations} />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Input label="Quantidade" type="number" min={1} value={exit.quantity} onChange={(event) => setExit((current) => ({ ...current, quantity: Number(event.target.value) }))} />
            <Input label="Motivo" value={exit.reason} onChange={(event) => setExit((current) => ({ ...current, reason: event.target.value }))} />
            <Input label="Responsavel" value={exit.responsible} onChange={(event) => setExit((current) => ({ ...current, responsible: event.target.value }))} />
          </div>
          <p className="mt-3 text-xs text-ink/45">A mutacao addStockMovement subtrai do estoque e bloqueia saldo negativo.</p>
          <Button type="submit" className="mt-4">Registrar saida</Button>
        </form>
      </section>

      <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">Estoque por variacao</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="text-ink/50">
              <tr><th className="py-2">Produto</th><th>SKU</th><th>Tamanho</th><th>Cor</th><th>Atual</th><th>Minimo</th><th>Status</th></tr>
            </thead>
            <tbody>
              {variations.map((variation) => (
                <tr key={variation.sku} className="border-t border-ink/8">
                  <td className="py-3 font-medium">{variation.product}</td><td>{variation.sku}</td><td>{variation.size}</td><td>{variation.color}</td><td>{variation.stock}</td><td>{variation.minStock}</td><td><StockBadge stock={variation.stock} min={variation.minStock} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <History size={19} className="text-gold" />
          <h2 className="font-semibold">Historico de movimentacoes</h2>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-ink/50">
              <tr><th className="py-2">Data</th><th>Produto</th><th>SKU</th><th>Tipo</th><th>Qtd.</th><th>Motivo</th><th>Responsavel</th></tr>
            </thead>
            <tbody>
              {stockMovements.map((movement) => (
                <tr key={movement.id} className="border-t border-ink/8">
                  <td className="py-3">{movement.date}</td><td>{movement.product}</td><td>{movement.sku}</td><td>{movement.type}</td><td>{movement.quantity}</td><td>{movement.reason}</td><td>{movement.responsible}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SkuSelect({ value, onChange, variations }: { value: string; onChange: (sku: string) => void; variations: Array<{ product: string; sku: string; size: string; color: string }> }) {
  return (
    <label className="grid min-w-0 gap-2 text-sm font-medium">
      SKU
      <select required value={value} onChange={(event) => onChange(event.target.value)} className="focus-ring h-11 w-full min-w-0 rounded-md border border-ink/12 bg-white px-3 text-sm">
        <option value="">Selecione</option>
        {variations.map((variation) => (
          <option key={variation.sku} value={variation.sku}>{variation.sku} · {variation.product} · {variation.size}/{variation.color}</option>
        ))}
      </select>
    </label>
  );
}
