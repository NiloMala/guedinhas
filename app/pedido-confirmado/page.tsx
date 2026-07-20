"use client";

import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/Button";

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={<section className="min-h-[65vh]" />}>
      <OrderConfirmedContent />
    </Suspense>
  );
}

function OrderConfirmedContent() {
  const params = useSearchParams();
  const orderId = params.get("pedido");

  return (
    <section className="mx-auto grid min-h-[65vh] max-w-3xl place-items-center px-4 py-16 text-center">
      <div>
        <CheckCircle2 size={52} className="mx-auto text-emerald-600" />
        <h1 className="mt-5 font-display text-4xl font-semibold">Pedido confirmado</h1>
        <p className="mt-3 text-ink/60">
          {orderId ? `Recebemos o pedido ${orderId}.` : "Recebemos seu pedido."} O estoque das variacoes compradas ja foi atualizado.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/meus-pedidos">Ver meus pedidos</Button>
          <Button href="/catalogo" variant="secondary">Continuar comprando</Button>
        </div>
      </div>
    </section>
  );
}
