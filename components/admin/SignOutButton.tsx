"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await supabaseBrowser.auth.signOut();
    router.push("/admin-login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="focus-ring inline-flex h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-semibold text-ink/70 hover:bg-ink/5 hover:text-ink"
    >
      <LogOut size={17} />
      Sair
    </button>
  );
}
