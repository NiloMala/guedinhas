"use client";

import Link from "next/link";
import { LogOut, Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useCart } from "@/hooks/useCart";
import { supabaseBrowser } from "@/lib/supabase/client";

const baseLinks = [
  ["Home", "/"],
  ["Catalogo", "/catalogo"],
  ["Sobre", "/sobre"],
  ["Contato", "/contato"]
];

export function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { items } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    function applyUser(user: User | null | undefined) {
      setIsLoggedIn(Boolean(user));
      setIsAdmin((user?.app_metadata as { role?: string } | undefined)?.role === "admin");
    }
    supabaseBrowser.auth.getUser().then(({ data }) => applyUser(data.user));
    const { data: subscription } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      applyUser(session?.user);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  const links = isAdmin ? [...baseLinks, ["Admin", "/admin"]] : baseLinks;

  async function handleSignOut() {
    await supabaseBrowser.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-2xl font-semibold tracking-normal text-ink">
          Guedinhas
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="text-ink/70 transition hover:text-ink">
              {label}
            </Link>
          ))}
          {isLoggedIn && (
            <button onClick={handleSignOut} className="focus-ring inline-flex items-center gap-1.5 text-ink/70 transition hover:text-ink">
              <LogOut size={16} /> Sair
            </button>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/catalogo" aria-label="Buscar produtos" className="focus-ring rounded-md p-2 hover:bg-ink/5">
            <Search size={20} />
          </Link>
          <Link href={isLoggedIn ? "/minha-conta" : "/login"} aria-label="Minha conta" className="focus-ring rounded-md p-2 hover:bg-ink/5">
            <UserRound size={20} />
          </Link>
          <Link href="/carrinho" aria-label="Carrinho" className="focus-ring relative rounded-md p-2 hover:bg-ink/5">
            <ShoppingBag size={20} />
            {count > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-xs font-bold text-white">{count}</span>}
          </Link>
          <button aria-label="Abrir menu" onClick={() => setOpen(!open)} className="focus-ring rounded-md p-2 hover:bg-ink/5 md:hidden">
            <Menu size={22} />
          </button>
        </div>
      </div>
      {open && (
        <nav className="grid gap-1 border-t border-ink/10 bg-white px-4 py-3 text-sm font-medium md:hidden">
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-md px-2 py-2 text-ink/75 hover:bg-ink/5">
              {label}
            </Link>
          ))}
          {isLoggedIn && (
            <button onClick={handleSignOut} className="flex items-center gap-1.5 rounded-md px-2 py-2 text-left text-ink/75 hover:bg-ink/5">
              <LogOut size={16} /> Sair
            </button>
          )}
        </nav>
      )}
    </header>
  );
}
