"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Info, LayoutGrid, LogOut, MessageCircle, ShieldCheck, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthUser } from "@/hooks/useAuthUser";
import { supabaseBrowser } from "@/lib/supabase/client";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/catalogo", label: "Catalogo", icon: LayoutGrid },
  { href: "/sobre", label: "Sobre", icon: Info },
  { href: "/contato", label: "Contato", icon: MessageCircle }
];

export function MobileTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, isAdmin } = useAuthUser();

  async function handleSignOut() {
    await supabaseBrowser.auth.signOut();
    router.push("/");
    router.refresh();
  }

  function tabClass(active: boolean) {
    return cn(
      "flex shrink-0 flex-col items-center gap-1 rounded-md px-4 py-1.5 text-[11px] font-medium transition",
      active ? "text-ink" : "text-ink/50 hover:text-ink/75"
    );
  }

  // O painel /admin tem sua propria navegacao (AdminNav); evita duplicar.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-1 overflow-x-auto border-t border-ink/10 bg-white/95 px-2 py-1.5 backdrop-blur md:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = pathname === tab.href;
        return (
          <Link key={tab.href} href={tab.href} className={tabClass(active)}>
            <Icon size={20} />
            {tab.label}
          </Link>
        );
      })}
      <Link href={isLoggedIn ? "/minha-conta" : "/login"} className={tabClass(pathname === "/minha-conta" || pathname === "/login")}>
        <UserRound size={20} />
        Conta
      </Link>
      {isAdmin && (
        <Link href="/admin" className={tabClass(pathname === "/admin" || pathname.startsWith("/admin/"))}>
          <ShieldCheck size={20} />
          Admin
        </Link>
      )}
      {isLoggedIn && (
        <button type="button" onClick={handleSignOut} className={tabClass(false)}>
          <LogOut size={20} />
          Sair
        </button>
      )}
    </nav>
  );
}
