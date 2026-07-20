import Link from "next/link";
import { Boxes, ClipboardList, LayoutDashboard, Package } from "lucide-react";
import { SignOutButton } from "@/components/admin/SignOutButton";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/estoque", label: "Estoque", icon: Boxes },
  { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardList }
];

export function AdminNav() {
  return (
    <nav className="mb-6 flex items-center justify-between gap-2 overflow-x-auto rounded-lg border border-ink/10 bg-white p-2 shadow-sm">
      <div className="flex gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="focus-ring inline-flex h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-semibold text-ink/70 hover:bg-ink/5 hover:text-ink">
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </div>
      <SignOutButton />
    </nav>
  );
}
