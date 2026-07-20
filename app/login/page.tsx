import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  return (
    <section className="mx-auto grid min-h-[70vh] max-w-5xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-2 lg:px-8">
      <div className="rounded-lg bg-ink p-8 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Minha Conta</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Entre para acompanhar seus pedidos.</h1>
        <p className="mt-4 text-sm leading-6 text-white/65">Historico, enderecos e rastreio ficam reunidos em uma area simples para a cliente voltar sem friccao.</p>
      </div>
      <form className="grid h-fit gap-4 rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
        <Input label="E-mail" type="email" placeholder="voce@email.com" />
        <Input label="Senha" type="password" placeholder="Sua senha" />
        <Button type="button">Entrar</Button>
        <Button href="/minha-conta" variant="secondary">Criar cadastro</Button>
      </form>
    </section>
  );
}
