"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Boxes, ClipboardList, Home, Info, LayoutDashboard, LayoutGrid, LogOut, MessageCircle, Package, ShieldCheck, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthUser } from "@/hooks/useAuthUser";
import { supabaseBrowser } from "@/lib/supabase/client";

const storeTabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/catalogo", label: "Catalogo", icon: LayoutGrid },
  { href: "/sobre", label: "Sobre", icon: Info },
  { href: "/contato", label: "Contato", icon: MessageCircle }
];

const adminTabs = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/estoque", label: "Estoque", icon: Boxes },
  { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardList }
];

export function MobileTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, isAdmin } = useAuthUser();
  const isAdminSection = pathname === "/admin" || pathname.startsWith("/admin/");

  async function handleSignOut() {
    await supabaseBrowser.auth.signOut();
    router.push(isAdminSection ? "/login" : "/");
    router.refresh();
  }

  function tabClass(active: boolean) {
    return cn(
      "flex shrink-0 flex-col items-center gap-1 rounded-md px-4 py-1.5 text-[11px] font-medium transition",
      active ? "text-ink" : "text-ink/50 hover:text-ink/75"
    );
  }

  const tabs = isAdminSection ? adminTabs : storeTabs;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 backdrop-blur md:hidden">
      <div className="flex items-center gap-1 overflow-x-auto px-2 py-1.5">
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
        {!isAdminSection && (
          <Link href={isLoggedIn ? "/minha-conta" : "/login"} className={tabClass(pathname === "/minha-conta" || pathname === "/login")}>
            <UserRound size={20} />
            Conta
          </Link>
        )}
        {!isAdminSection && isAdmin && (
          <Link href="/admin" className={tabClass(false)}>
            <ShieldCheck size={20} />
            Admin
          </Link>
        )}
        {(isAdminSection || isLoggedIn) && (
          <button type="button" onClick={handleSignOut} className={tabClass(false)}>
            <LogOut size={20} />
            Sair
          </button>
        )}
      </div>
    </nav>
  );
}
