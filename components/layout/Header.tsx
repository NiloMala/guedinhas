"use client";

import Link from "next/link";
import { LogOut, Search, ShoppingBag, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useAuthUser } from "@/hooks/useAuthUser";
import { supabaseBrowser } from "@/lib/supabase/client";

const baseLinks = [
  ["Home", "/"],
  ["Catalogo", "/catalogo"],
  ["Sobre", "/sobre"],
  ["Contato", "/contato"]
];

export function Header() {
  const router = useRouter();
  const { isLoggedIn, isAdmin } = useAuthUser();
  const { items } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const links = isAdmin ? [...baseLinks, ["Admin", "/admin"]] : baseLinks;

  async function handleSignOut() {
    await supabaseBrowser.auth.signOut();
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
          <Link href={isLoggedIn ? "/minha-conta" : "/login"} aria-label="Minha conta" className="focus-ring hidden rounded-md p-2 hover:bg-ink/5 md:inline-flex">
            <UserRound size={20} />
          </Link>
          <Link href="/carrinho" aria-label="Carrinho" className="focus-ring relative rounded-md p-2 hover:bg-ink/5">
            <ShoppingBag size={20} />
            {count > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-xs font-bold text-white">{count}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
