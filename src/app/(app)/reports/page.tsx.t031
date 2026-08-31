// coteadmin/src/app/(app)/reports/page.tsx
import { cotebek } from '@/lib/cotebek';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  TrendingUp,
  Wallet,
  ShoppingCart,
  Receipt,
  ArrowRight,
  Medal,
  CreditCard,
  Activity,
  CalendarDays,
  ArrowUpRight,
} from 'lucide-react';
import { formatCompactRupiah, formatRupiah } from '@/lib/format';
import { formatDate, last30DaysRangeWIB } from '@/lib/date-range';
import { DatePresetFilter } from '@/components/DatePresetFilter';
import { ApiErrorFallback } from '@/components/ApiErrorFallback';

type Summary = {
  revenue: number;
  cogs: number;
  grossProfit: number;
  totalOrders: number;
};

type TopItem = {
  itemName: string;
  totalSold: number;
};

type TrendPoint = {
  date: string;
  revenue: number;
  profit: number;
};

type PaymentMethodStat = {
  method: string;
  count: number;
  percentage: string;
};

/* function last30DaysRangeWIB() {
  const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
  const nowWIB = new Date(Date.now() + WIB_OFFSET_MS);
  const end = nowWIB.toISOString().slice(0, 10);

  const startDate = new Date(nowWIB);
  startDate.setDate(startDate.getDate() - 29);

  const start = startDate.toISOString().slice(0, 10);

  return { start, end };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
} */

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ startDate?: string; endDate?: string }>;
}) {
  const params = await searchParams;
  const defaultRange = last30DaysRangeWIB();
  const start = params.startDate || defaultRange.start;
  const end = params.endDate || defaultRange.end;
  const qs = `?startDate=${start}&endDate=${end}`;

  let summary: Summary;
  let topItems: TopItem[];
  let trend: TrendPoint[];
  let payments: PaymentMethodStat[];

  try {
    const [summaryRes, topItemsRes, trendRes, paymentRes] = await Promise.all([
      cotebek<{ data: Summary }>(`/reports/summary${qs}`),
      cotebek<{ data: TopItem[] }>(`/reports/top-items${qs}`),
      cotebek<{ data: TrendPoint[] }>(`/reports/sales-trend${qs}`),
      cotebek<{ data: PaymentMethodStat[] }>(`/reports/payment-methods${qs}`),
    ]);
    summary = summaryRes.data;
    topItems = topItemsRes.data;
    trend = trendRes.data;
    payments = paymentRes.data;
  } catch (error) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 pt-8">
        <ApiErrorFallback error={error} />
      </div>
    );
  }

  const maxTrendValue = Math.max(
    1,
    ...trend.flatMap((t) => [t.revenue, t.profit]),
  );

  const profitMargin =
    summary.revenue > 0
      ? (summary.grossProfit / summary.revenue) * 100
      : 0;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 px-4 pb-24 pt-5 sm:space-y-6 sm:pt-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            <BarChart3 size={14} />
            Analitik
          </div>

          <h1 className="mt-1 text-2xl font-heading font-bold tracking-tight text-foreground sm:text-3xl">
            Laporan
          </h1>

          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
            <CalendarDays size={14} />
            <span>
              {formatDate(start)} – {formatDate(end)}
            </span>
          </div>
        </div>

        <Link
          href="/reports/advanced"
          className="group shrink-0 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4 sm:py-2.5"
        >
          <span className="hidden sm:inline">Laporan Mendalam</span>
          <span className="sm:hidden">Detail</span>
          <ArrowRight
            size={14}
            className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <DatePresetFilter />

      {/* Hero financial metric */}
      <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/[0.12] via-card to-card shadow-md shadow-primary/5">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
        />

        <CardContent className="relative p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                <TrendingUp size={15} />
                Omzet
              </div>

              <div className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {formatRupiah(summary.revenue)}
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Total pendapatan dalam periode laporan
              </p>
            </div>

            <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:flex">
              <ArrowUpRight size={21} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border/60 pt-4">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Laba Kotor
              </div>
              <div className="mt-1 text-sm font-bold text-foreground">
                {formatRupiah(summary.grossProfit)}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Margin Kotor
              </div>
              <div className="mt-1 text-sm font-bold text-foreground">
                {profitMargin.toLocaleString('id-ID', {
                  maximumFractionDigits: 1,
                })}
                %
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Card className="border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-2 text-chart-1">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-chart-1/10">
                <Wallet size={14} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider sm:text-xs">
                Laba Kotor
              </span>
            </div>

            <div className="mt-3 text-base font-bold tracking-tight text-foreground sm:text-lg">
              {formatCompactRupiah(summary.grossProfit)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-2 text-chart-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-chart-3/10">
                <Receipt size={14} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider sm:text-xs">
                Total Order
              </span>
            </div>

            <div className="mt-3 text-base font-bold tracking-tight text-foreground sm:text-lg">
              {summary.totalOrders.toLocaleString('id-ID')}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                nota
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 border-border/80 bg-muted/30 shadow-sm transition-shadow hover:shadow-md sm:col-span-1">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted">
                <ShoppingCart size={14} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider sm:text-xs">
                COGS / Modal
              </span>
            </div>

            <div className="mt-3 text-base font-bold tracking-tight text-foreground sm:text-lg">
              {formatCompactRupiah(summary.cogs)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales trend */}
      <Card className="overflow-hidden border-border/80 shadow-sm">
        <CardHeader className="border-b border-border/60 px-4 pb-4 pt-5 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-sm font-bold">
                <Activity size={16} className="text-chart-1" />
                Tren Penjualan
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Omzet dan laba kotor per hari
              </p>
            </div>

            <div className="flex items-center gap-3 text-[10px] font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-chart-1" />
                Omzet
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-chart-2" />
                Laba
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          {trend.length === 0 ? (
            <div className="flex min-h-40 flex-col items-center justify-center text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <Activity size={18} />
              </div>
              <p className="mt-3 text-sm font-medium text-foreground">
                Belum ada data tren
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Data penjualan akan muncul setelah ada transaksi.
              </p>
            </div>
          ) : (
            <>
              <div className="relative h-56 w-full overflow-hidden">
                {/* Grid */}
                <div className="pointer-events-none absolute inset-x-0 top-2 bottom-7 flex flex-col justify-between">
                  <div className="border-t border-dashed border-border/50" />
                  <div className="border-t border-dashed border-border/50" />
                  <div className="border-t border-dashed border-border/50" />
                  <div className="border-t border-dashed border-border/50" />
                </div>

                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-x-0 top-2 h-[calc(100%-28px)] w-full overflow-visible"
                  aria-label="Grafik tren omzet dan laba"
                  role="img"
                >
                  {trend.length > 1 && (
                    <>
                      <polyline
                        points={trend
                          .map((t, i) => {
                            const x =
                              (i / (trend.length - 1)) * 100;
                            const y =
                              96 -
                              (t.revenue / maxTrendValue) * 88;
                            return `${x},${y}`;
                          })
                          .join(' ')}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        vectorEffect="non-scaling-stroke"
                        className="text-chart-1"
                      />

                      <polyline
                        points={trend
                          .map((t, i) => {
                            const x =
                              (i / (trend.length - 1)) * 100;
                            const y =
                              96 -
                              (t.profit / maxTrendValue) * 88;
                            return `${x},${y}`;
                          })
                          .join(' ')}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                        vectorEffect="non-scaling-stroke"
                        className="text-chart-2"
                      />
                    </>
                  )}

                  {trend.map((t, i) => {
                    const x =
                      trend.length === 1
                        ? 50
                        : (i / (trend.length - 1)) * 100;

                    const revenueY =
                      96 -
                      (t.revenue / maxTrendValue) * 88;

                    const profitY =
                      96 -
                      (t.profit / maxTrendValue) * 88;

                    return (
                      <g key={t.date}>
                        <circle
                          cx={x}
                          cy={revenueY}
                          r="1.4"
                          className="fill-chart-1"
                        />
                        <circle
                          cx={x}
                          cy={profitY}
                          r="1.2"
                          className="fill-chart-2"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* X-axis labels */}
                <div className="absolute inset-x-0 bottom-0 flex justify-between gap-2">
                  {trend
                    .filter((_, i) => {
                      if (trend.length <= 7) return true;
                      const step = Math.ceil(trend.length / 6);
                      return (
                        i % step === 0 ||
                        i === trend.length - 1
                      );
                    })
                    .map((t) => (
                      <span
                        key={t.date}
                        className="text-[9px] text-muted-foreground"
                      >
                        {formatDate(t.date)}
                      </span>
                    ))}
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Periode
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-foreground">
                    {formatDate(start)} – {formatDate(end)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Total omzet
                  </p>
                  <p className="mt-0.5 text-xs font-bold text-chart-1">
                    {formatCompactRupiah(summary.revenue)}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Top services */}
      <Card className="overflow-hidden border-border/80 shadow-sm">
        <CardHeader className="border-b border-border/60 px-4 pb-4 pt-5">
          <CardTitle className="flex items-center gap-2 text-sm font-bold">
            <Medal size={16} className="text-amber-500" />
            Layanan Terlaris
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Layanan dengan jumlah penjualan tertinggi
          </p>
        </CardHeader>

        <CardContent className="p-0">
          {topItems.length === 0 ? (
            <div className="flex min-h-32 items-center justify-center px-4 text-center">
              <p className="text-sm text-muted-foreground">
                Belum ada data layanan.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border/70">
              {topItems.map((item, i) => (
                <li
                  key={item.itemName}
                  className={cn(
                    'flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-muted/40',
                    i === 0 && 'bg-primary/[0.035]',
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold',
                        i === 0
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'
                          : i === 1
                            ? 'bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300'
                            : i === 2
                              ? 'bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-400'
                              : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {i + 1}
                    </div>

                    <span className="truncate text-sm font-medium text-foreground">
                      {item.itemName}
                    </span>
                  </div>

                  <span className="shrink-0 rounded-lg bg-muted px-2.5 py-1 text-xs font-bold text-foreground">
                    {item.totalSold.toLocaleString('id-ID')}x
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Payment methods */}
      <Card className="overflow-hidden border-border/80 shadow-sm">
        <CardHeader className="border-b border-border/60 px-4 pb-4 pt-5">
          <CardTitle className="flex items-center gap-2 text-sm font-bold">
            <CreditCard size={16} className="text-chart-2" />
            Metode Bayar
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Distribusi transaksi berdasarkan metode pembayaran
          </p>
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          {payments.length === 0 ? (
            <div className="flex min-h-28 items-center justify-center text-center">
              <p className="text-sm text-muted-foreground">
                Belum ada data pembayaran.
              </p>
            </div>
          ) : (
            <ul className="space-y-5">
              {payments.map((p) => {
                const pctValue = parseFloat(p.percentage);

                return (
                  <li key={p.method}>
                    <div className="mb-2 flex items-end justify-between gap-3">
                      <span className="text-sm font-semibold text-foreground">
                        {p.method}
                      </span>

                      <div className="shrink-0 text-right">
                        <span className="text-xs font-bold text-foreground">
                          {p.percentage}
                        </span>
                        <span className="ml-1.5 text-[10px] text-muted-foreground">
                          ({p.count.toLocaleString('id-ID')}x)
                        </span>
                      </div>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-chart-2 transition-all duration-700 ease-out"
                        style={{
                          width: `${Math.min(
                            Math.max(pctValue, 0),
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}