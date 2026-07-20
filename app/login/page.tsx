"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { supabaseBrowser } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"entrar" | "cadastrar">("entrar");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function redirectAfterLogin(role: string | undefined) {
    const next = searchParams.get("next");
    router.push(next || (role === "admin" ? "/admin" : "/minha-conta"));
    router.refresh();
  }

  async function handleSignIn(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const { data, error } = await supabaseBrowser.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMessage("E-mail ou senha invalidos.");
      return;
    }
    redirectAfterLogin(data.user?.app_metadata?.role);
  }

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const json = await response.json();
    if (!json.ok) {
      setLoading(false);
      setMessage(json.message);
      return;
    }
    const { data, error } = await supabaseBrowser.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMessage("Cadastro criado. Faca login.");
      setMode("entrar");
      return;
    }
    redirectAfterLogin(data.user?.app_metadata?.role);
  }

  return (
    <section className="mx-auto grid min-h-[70vh] max-w-5xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-2 lg:px-8">
      <div className="rounded-lg bg-ink p-8 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Minha Conta</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Entre para acompanhar seus pedidos.</h1>
        <p className="mt-4 text-sm leading-6 text-white/65">Historico, enderecos e rastreio ficam reunidos em uma area simples para a cliente voltar sem friccao.</p>
      </div>
      <form onSubmit={mode === "entrar" ? handleSignIn : handleSignUp} className="grid h-fit gap-4 rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
        {mode === "cadastrar" && (
          <Input required label="Nome completo" value={name} onChange={(event) => setName(event.target.value)} />
        )}
        <Input required label="E-mail" type="email" placeholder="voce@email.com" value={email} onChange={(event) => setEmail(event.target.value)} />
        <Input required label="Senha" type="password" placeholder="Sua senha" value={password} onChange={(event) => setPassword(event.target.value)} />
        {message && <p className="text-sm text-rose">{message}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Aguarde..." : mode === "entrar" ? "Entrar" : "Criar cadastro"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => { setMode(mode === "entrar" ? "cadastrar" : "entrar"); setMessage(""); }}>
          {mode === "entrar" ? "Criar cadastro" : "Ja tenho conta, entrar"}
        </Button>
      </form>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
