import { ReactNode } from "react";

export function StatCard({ title, value, detail, icon }: { title: string; value: string; detail: string; icon: ReactNode }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-ink/55">{title}</span>
        <span className="text-gold">{icon}</span>
      </div>
      <strong className="mt-3 block text-2xl">{value}</strong>
      <p className="mt-1 text-xs text-ink/45">{detail}</p>
    </div>
  );
}
