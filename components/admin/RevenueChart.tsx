"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function RevenueChart({ data }: { data: Array<{ day: string; value: number }> }) {
  return (
    <div className="h-72 rounded-lg border border-ink/10 bg-white p-4 shadow-sm">
      <h2 className="mb-3 font-semibold">Faturamento da semana</h2>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c9a45d" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#c9a45d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#eee7df" vertical={false} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip formatter={(value) => `R$ ${value}`} />
          <Area type="monotone" dataKey="value" stroke="#171313" fill="url(#revenue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
