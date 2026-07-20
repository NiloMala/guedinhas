"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { supabaseBrowser } from "@/lib/supabase/client";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMessage("E-mail ou senha invalidos.");
      return;
    }
    router.push(searchParams.get("next") || "/admin");
    router.refresh();
  }

  return (
    <section className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-16">
      <form onSubmit={handleSubmit} className="grid w-full gap-4 rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Painel administrativo</p>
          <h1 className="mt-2 font-display text-2xl font-semibold">Entrar</h1>
        </div>
        <Input required label="E-mail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <Input required label="Senha" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        {message && <p className="text-sm text-rose">{message}</p>}
        <Button type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button>
      </form>
    </section>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  );
}
