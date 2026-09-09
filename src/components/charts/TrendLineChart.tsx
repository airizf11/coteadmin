// coteadmin/src/components/charts/TrendLineChart.tsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCompactRupiah } from '@/lib/format';
import { formatDate } from '@/lib/date-range';

type Series = { dataKey: string; name: string; color: string };

const formatNumber = (v: number) => new Intl.NumberFormat('id-ID').format(v);

export function TrendLineChart({
  data,
  series,
  valueFormat = 'currency',
}: {
  data: Record<string, any>[];
  series: Series[];
  /** 'currency' (default, format Rupiah) atau 'number' (angka polos, buat data hitungan kayak jumlah order). */
  valueFormat?: 'currency' | 'number';
}) {
  if (data.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center text-center text-sm text-muted-foreground">
        Belum ada data tren.
      </div>
    );
  }

  const format = valueFormat === 'number' ? formatNumber : formatCompactRupiah;
  const showLegend = series.length > 1;

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
          <XAxis
            dataKey="date"
            tickFormatter={(d: string) => formatDate(d)}
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={(v: number) => format(v)}
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={48}
            allowDecimals={valueFormat !== 'number'}
          />
          <Tooltip
            formatter={(value: any) => format(Number(value))}
            labelFormatter={(label: any) => formatDate(String(label))}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          {showLegend && <Legend wrapperStyle={{ fontSize: 11 }} />}
          {series.map((s) => (
            <Line
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}