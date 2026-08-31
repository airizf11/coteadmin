// coteadmin/src/components/charts/PaymentMethodDonut.tsx
'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'];

type PaymentMethodStat = { method: string; count: number; percentage: string };

export function PaymentMethodDonut({ data }: { data: PaymentMethodStat[] }) {
  if (data.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center text-center text-sm text-muted-foreground">
        Belum ada data pembayaran.
      </div>
    );
  }

  const chartData = data.map((d) => ({ name: d.method, value: d.count }));

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={2}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: any, name: any) => [`${value}x`, name]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}