import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Painel administrativo</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Gestao Guedinhas</h1>
      </div>
      <AdminNav />
      {children}
    </section>
  );
}
