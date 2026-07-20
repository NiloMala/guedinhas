"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { currency } from "@/lib/utils";
import { supabaseBrowser } from "@/lib/supabase/client";
import { mapOrder } from "@/lib/supabase/mappers";
import { Order } from "@/types";

export default function AccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [editingAddress, setEditingAddress] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabaseBrowser.auth.getUser();
      if (!data.user) {
        router.push("/login?next=/minha-conta");
        return;
      }
      setEmail(data.user.email || "");
      setName(data.user.user_metadata?.name || "");
      setWhatsapp(data.user.user_metadata?.whatsapp || "");
      setAddress(data.user.user_metadata?.address || "");

      const { data: orderRows } = await supabaseBrowser
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      setOrders((orderRows || []).map(mapOrder));
    })();
  }, [router]);

  async function saveProfile() {
    setLoading(true);
    setMessage("");
    const { error } = await supabaseBrowser.auth.updateUser({ data: { name, whatsapp } });
    setLoading(false);
    setMessage(error ? "Nao foi possivel salvar." : "Dados atualizados.");
  }

  async function saveAddress() {
    setLoading(true);
    const { error } = await supabaseBrowser.auth.updateUser({ data: { address } });
    setLoading(false);
    if (!error) setEditingAddress(false);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold">Minha Conta</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="grid h-fit gap-4 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Dados pessoais</h2>
          <Input label="Nome" value={name} onChange={(event) => setName(event.target.value)} />
          <Input label="E-mail" value={email} disabled />
          <Input label="WhatsApp" value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} />
          {message && <p className="text-sm text-ink/60">{message}</p>}
          <Button type="button" disabled={loading} onClick={saveProfile}>Salvar dados</Button>
        </div>
        <div className="grid gap-6">
          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <h2 className="font-semibold">Endereco principal</h2>
            {editingAddress ? (
              <div className="mt-3 grid gap-3">
                <Input label="Endereco" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Rua, numero - Cidade/UF" />
                <div className="flex gap-2">
                  <Button type="button" disabled={loading} onClick={saveAddress}>Salvar</Button>
                  <Button type="button" variant="secondary" onClick={() => setEditingAddress(false)}>Cancelar</Button>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-3 text-sm text-ink/60">{address || "Nenhum endereco cadastrado."}</p>
                <Button variant="secondary" className="mt-4" onClick={() => setEditingAddress(true)}>Editar endereco</Button>
              </>
            )}
          </div>
          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <h2 className="font-semibold">Historico de pedidos</h2>
            <div className="mt-4 grid gap-3">
              {orders.length === 0 && <p className="text-sm text-ink/55">Nenhum pedido ainda.</p>}
              {orders.map((order) => (
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
