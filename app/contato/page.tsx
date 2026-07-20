import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold">Contato</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <form className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <Input label="Nome" />
          <Input label="E-mail" type="email" />
          <Input label="Mensagem" placeholder="Como podemos ajudar?" />
          <Button type="button">Enviar mensagem</Button>
        </form>
        <div className="rounded-lg bg-ink p-6 text-white">
          <h2 className="font-display text-3xl">Atendimento pelo WhatsApp</h2>
          <p className="mt-3 text-sm leading-6 text-white/65">Tire duvidas sobre medidas, disponibilidade, entrega e formas de pagamento.</p>
          <Button href="https://wa.me/55129988945359" variant="secondary" className="mt-5"><MessageCircle size={18} /> Chamar no WhatsApp</Button>
        </div>
      </div>
    </section>
  );
}
