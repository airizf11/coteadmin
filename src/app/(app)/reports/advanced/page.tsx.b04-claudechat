// coteadmin/src/app/(app)/reports/advanced/page.tsx
import { cotebek } from '@/lib/cotebek';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Wallet,
  ShoppingCart,
  Receipt,
  Medal,
  CreditCard,
  Activity,
  TicketPercent,
  Minus,
  Calculator,
  PieChart,
  BarChart3,
} from 'lucide-react';
import { ExportButton } from './ExportButton';
import { formatCompactRupiah, formatRupiah } from '@/lib/format';
import { formatDate, last30DaysRangeWIB } from '@/lib/date-range';
import { AdvancedReportFilterBar } from './AdvancedReportFilterBar';
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

type PromoBudget = {
  totalDiscount: number;
  ordersWithPromo: number;
  discountPercentage: string;
};

type NetProfit = {
  revenue: number;
  cogs: number;
  grossProfit: number;
  operatingExpense: number;
  netProfit: number;
};

type ExpenseByCategory = {
  category: string;
  total: number;
  count: number;
};

const EXPENSE_CATEGORY_LABEL: Record<string, string> = {
  EXPENSE: 'Operasional',
  CAPEX: 'Aset/Modal',
  ADJUSTMENT: 'Penyesuaian',
  FUND_OUT: 'Modal Keluar',
  OTHER: 'Lainnya',
};

/* function last30DaysRangeWIB() {
  const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
  const nowWIB = new Date(Date.now() + WIB_OFFSET_MS);
  const end = nowWIB.toISOString().slice(0, 10);

  const start = new Date(nowWIB);
  start.setDate(start.getDate() - 29);

  return {
    start: start.toISOString().slice(0, 10),
    end,
  };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
} */

function getChangeData(current: number, previous: number) {
  if (previous === 0) return null;

  const change = ((current - previous) / previous) * 100;

  return {
    value: `${Math.abs(change).toFixed(1)}%`,
    trend:
      change > 0
        ? 'up'
        : change < 0
          ? 'down'
          : 'neutral',
  };
}

function CompareBadge({
  data,
}: {
  data: { value: string; trend: string } | null;
}) {
  if (!data) {
    return (
      <span className="ml-1.5 text-[10px] text-muted-foreground">
        —
      </span>
    );
  }

  const isUp = data.trend === 'up';
  const isDown = data.trend === 'down';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold',
        isUp
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : isDown
            ? 'bg-destructive/10 text-destructive'
            : 'bg-muted text-muted-foreground',
      )}
    >
      {isUp ? (
        <TrendingUp size={10} />
      ) : isDown ? (
        <TrendingDown size={10} />
      ) : (
        <Minus size={10} />
      )}

      {data.value}
    </div>
  );
}

export default async function AdvancedReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  const defaultRange = last30DaysRangeWIB();

  const startDate = params.startDate || defaultRange.start;
  const endDate = params.endDate || defaultRange.end;
  const compareStartDate = params.compareStartDate;
  const compareEndDate = params.compareEndDate;

  const hasCompare = !!(
    compareStartDate && compareEndDate
  );

  const qs = `?startDate=${startDate}&endDate=${endDate}`;

  let summary: Summary;
  let topItems: TopItem[];
  let trend: TrendPoint[];
  let payments: PaymentMethodStat[];
  let promo: PromoBudget;
  let netProfit: NetProfit;
  let expenseByCategory: ExpenseByCategory[];
  let compareSummary: Summary | null = null;
  let comparePromo: PromoBudget | null = null;
  let compareNetProfit: NetProfit | null = null;

  try {
    const [
      summaryRes, topItemsRes, trendRes, paymentRes, promoRes, netProfitRes, expenseCategoryRes,
    ] = await Promise.all([
      cotebek<{ data: Summary }>(`/reports/summary${qs}`),
      cotebek<{ data: TopItem[] }>(`/reports/top-items${qs}`),
      cotebek<{ data: TrendPoint[] }>(`/reports/sales-trend${qs}`),
      cotebek<{ data: PaymentMethodStat[] }>(`/reports/payment-methods${qs}`),
      cotebek<{ data: PromoBudget }>(`/reports/promo-budget${qs}`),
      cotebek<{ data: NetProfit }>(`/reports/net-profit${qs}`),
      cotebek<{ data: ExpenseByCategory[] }>(`/reports/expense-by-category${qs}`),
    ]);
    summary = summaryRes.data;
    topItems = topItemsRes.data;
    trend = trendRes.data;
    payments = paymentRes.data;
    promo = promoRes.data;
    netProfit = netProfitRes.data;
    expenseByCategory = expenseCategoryRes.data;

    if (hasCompare) {
      const compareQs = `?startDate=${compareStartDate}&endDate=${compareEndDate}`;
      const [cSummaryRes, cPromoRes, cNetProfitRes] = await Promise.all([
        cotebek<{ data: Summary }>(`/reports/summary${compareQs}`),
        cotebek<{ data: PromoBudget }>(`/reports/promo-budget${compareQs}`),
        cotebek<{ data: NetProfit }>(`/reports/net-profit${compareQs}`),
      ]);
      compareSummary = cSummaryRes.data;
      comparePromo = cPromoRes.data;
      compareNetProfit = cNetProfitRes.data;
    }
  } catch (error) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 pt-8">
        <ApiErrorFallback error={error} />
      </div>
    );
  }

  const maxRevenue = Math.max(
    1,
    ...trend.map((t) => t.revenue),
  );

  const maxExpense = Math.max(
    1,
    ...expenseByCategory.map((e) => e.total),
  );

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 pb-24 pt-4 sm:px-6">

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/[0.08] via-background to-background p-5 shadow-sm">
        <div className="absolute -right-16 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Link
              href="/reports"
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background/80 text-muted-foreground shadow-sm backdrop-blur transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
              aria-label="Kembali ke laporan utama"
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </Link>

            <div>
              <div className="mb-1 flex items-center gap-2">
                <BarChart3
                  size={15}
                  className="text-primary"
                />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                  Analytics
                </span>
              </div>

              <h1 className="text-xl font-heading font-bold tracking-tight text-foreground sm:text-2xl">
                Laporan Lanjutan
              </h1>

              <p className="mt-1 text-xs text-muted-foreground">
                Filter kustom & komparasi data
              </p>
            </div>
          </div>

          <ExportButton
            startDate={startDate}
            endDate={endDate}
            compareStartDate={
              hasCompare
                ? compareStartDate
                : undefined
            }
            compareEndDate={
              hasCompare
                ? compareEndDate
                : undefined
            }
          />
        </div>
      </div>

      {/* Filters */}
     <AdvancedReportFilterBar
        compareStartDate={compareStartDate}
        compareEndDate={compareEndDate}
      />

      {/* KPI */}
      <div className="grid grid-cols-2 gap-3">

        <Card className="group relative overflow-hidden border-chart-1/30 bg-gradient-to-br from-chart-1/10 via-chart-1/[0.03] to-background shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-chart-1/10 blur-2xl transition-transform group-hover:scale-125" />

          <CardContent className="relative p-4">
            <div className="mb-2 flex items-center gap-1.5 text-chart-1">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-chart-1/10">
                <TrendingUp size={13} />
              </div>

              <div className="text-[10px] font-bold uppercase tracking-wider">
                Omzet
              </div>
            </div>

            <div className="flex flex-wrap items-baseline gap-1">
              <span className="text-lg font-bold tracking-tight text-chart-1 sm:text-xl">
                {formatRupiah(summary.revenue)}
              </span>

              {hasCompare && compareSummary && (
                <CompareBadge
                  data={getChangeData(
                    summary.revenue,
                    compareSummary.revenue,
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-chart-2/30 bg-gradient-to-br from-chart-2/10 via-chart-2/[0.03] to-background shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-chart-2/10 blur-2xl transition-transform group-hover:scale-125" />

          <CardContent className="relative p-4">
            <div className="mb-2 flex items-center gap-1.5 text-chart-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-chart-2/10">
                <Wallet size={13} />
              </div>

              <div className="text-[10px] font-bold uppercase tracking-wider">
                Laba Kotor
              </div>
            </div>

            <div className="flex flex-wrap items-baseline gap-1">
              <span className="text-lg font-bold tracking-tight text-chart-2 sm:text-xl">
                {formatRupiah(summary.grossProfit)}
              </span>

              {hasCompare && compareSummary && (
                <CompareBadge
                  data={getChangeData(
                    summary.grossProfit,
                    compareSummary.grossProfit,
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-border bg-gradient-to-br from-muted/60 via-background to-background shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-1.5 text-muted-foreground">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted">
                <ShoppingCart size={13} />
              </div>

              <div className="text-[10px] font-bold uppercase tracking-wider">
                Modal
              </div>
            </div>

            <div className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              {formatRupiah(summary.cogs)}
            </div>

            <div className="mt-0.5 text-[10px] text-muted-foreground">
              COGS
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-chart-3/30 bg-gradient-to-br from-chart-3/10 via-chart-3/[0.03] to-background shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-1.5 text-chart-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-chart-3/10">
                <Receipt size={13} />
              </div>

              <div className="text-[10px] font-bold uppercase tracking-wider">
                Total Order
              </div>
            </div>

            <div className="flex flex-wrap items-baseline gap-1">
              <span className="text-lg font-bold tracking-tight text-chart-3 sm:text-xl">
                {summary.totalOrders}
              </span>

              <span className="text-xs text-chart-3/70">
                nota
              </span>

              {hasCompare && compareSummary && (
                <CompareBadge
                  data={getChangeData(
                    summary.totalOrders,
                    compareSummary.totalOrders,
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profit & Loss */}
      <Card className="overflow-hidden border-border shadow-sm">
        <CardHeader className="border-b border-border/60 bg-muted/20 px-4 pb-3 pt-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
              <Calculator size={15} />
            </div>

            Ringkasan Laba Rugi
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 p-4">

          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground">
              Omzet Penjualan
            </span>

            <span className="font-semibold text-foreground">
              {formatRupiah(netProfit.revenue)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 text-sm text-destructive">
            <span className="opacity-80">
              Modal (COGS)
            </span>

            <span className="font-medium">
              -{formatRupiah(netProfit.cogs)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-dashed border-border pt-3 text-sm">
            <span className="font-medium text-foreground">
              Laba Kotor
            </span>

            <span className="font-bold text-foreground">
              {formatRupiah(netProfit.grossProfit)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 text-sm text-destructive">
            <span className="opacity-80">
              Beban Operasional
            </span>

            <span className="font-medium">
              -{formatRupiah(netProfit.operatingExpense)}
            </span>
          </div>

          <div
            className={cn(
              'mt-2 rounded-xl border p-4',
              netProfit.netProfit >= 0
                ? 'border-success/20 bg-success/5'
                : 'border-destructive/20 bg-destructive/5',
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Laba Bersih
                </div>

                <div
                  className={cn(
                    'mt-1 text-xl font-bold tracking-tight',
                    netProfit.netProfit >= 0
                      ? 'text-success'
                      : 'text-destructive',
                  )}
                >
                  {formatRupiah(netProfit.netProfit)}
                </div>
              </div>

              {hasCompare && compareNetProfit && (
                <CompareBadge
                  data={getChangeData(
                    netProfit.netProfit,
                    compareNetProfit.netProfit,
                  )}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Promo */}
      <Card className="overflow-hidden border-chart-4/30 bg-gradient-to-br from-chart-4/10 via-background to-background shadow-sm">
        <CardHeader className="px-4 pb-2 pt-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-chart-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-chart-4/10">
              <TicketPercent size={15} />
            </div>

            Budget Promo & Diskon
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 p-4 pt-2">
          <div className="flex items-center justify-between gap-4 border-b border-chart-4/15 pb-3">
            <span className="text-sm text-chart-4/80">
              Total Diskon Diberikan
            </span>

            <span className="font-bold text-chart-4">
              {formatRupiah(promo.totalDiscount)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 border-b border-chart-4/15 pb-3">
            <span className="text-sm text-chart-4/80">
              Order Pakai Promo
            </span>

            <span className="font-bold text-chart-4">
              {promo.ordersWithPromo}{' '}
              <span className="text-xs font-normal opacity-70">
                nota
              </span>
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-chart-4/80">
              Persentase dari Omzet
            </span>

            <Badge
              variant="outline"
              className="border-chart-4/30 bg-chart-4/10 text-chart-4"
            >
              {promo.discountPercentage}
            </Badge>
          </div>

          {hasCompare && comparePromo && (
            <div className="mt-4 rounded-xl border border-chart-4/15 bg-background/60 p-3 text-xs text-muted-foreground">
              <span className="mb-1.5 block font-semibold text-foreground">
                Data Periode Pembanding
              </span>

              Total Diskon:{' '}
              <span className="font-medium text-foreground">
                Rp{comparePromo.totalDiscount.toLocaleString('id-ID')}
              </span>

              <br />

              Digunakan di{' '}
              <span className="font-medium text-foreground">
                {comparePromo.ordersWithPromo} order
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expense */}
      <Card className="overflow-hidden border-border shadow-sm">
        <CardHeader className="border-b border-border/60 px-4 pb-3 pt-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-chart-5/10 text-chart-5">
              <PieChart size={15} />
            </div>

            Pengeluaran Berdasarkan Kategori
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4">
          {expenseByCategory.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Belum ada catatan pengeluaran.
            </p>
          ) : (
            <div className="space-y-4">
              {expenseByCategory.map((e) => {
                const percentage =
                  (e.total / maxExpense) * 100;

                const catLabel =
                  EXPENSE_CATEGORY_LABEL[e.category] ?? e.category;

                return (
                  <div
                    key={e.category}
                    className="space-y-1.5"
                  >
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <span className="text-sm font-semibold text-foreground">
                          {catLabel}
                        </span>

                        <span className="ml-1.5 text-[10px] text-muted-foreground">
                          {e.count} transaksi
                        </span>
                      </div>

                      <span className="text-xs font-bold text-chart-5">
                        {formatRupiah(e.total)}
                      </span>
                    </div>

                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-chart-5/60 to-chart-5 transition-all duration-1000 ease-out"
                        style={{
                          width: `${Math.max(percentage, 1)}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sales Trend */}
      <Card className="overflow-hidden border-border shadow-sm">
        <CardHeader className="border-b border-border/60 px-4 pb-3 pt-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1">
              <Activity size={15} />
            </div>

            Tren Penjualan Harian
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4">
          {trend.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Belum ada data tren penjualan.
            </p>
          ) : (
            <div className="custom-scrollbar max-h-72 space-y-3 overflow-y-auto pr-1">
              {trend.map((t) => {
                const percentage =
                  (t.revenue / maxRevenue) * 100;

                return (
                  <div
                    key={t.date}
                    className="flex items-center gap-3"
                  >
                    <span className="w-12 shrink-0 text-[11px] font-medium text-muted-foreground">
                      {formatDate(t.date)}
                    </span>

                    <div className="relative h-5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-r-full bg-gradient-to-r from-chart-1/60 to-chart-1 transition-all duration-1000 ease-out"
                        style={{
                          width: `${Math.max(
                            percentage,
                            2,
                          )}%`,
                        }}
                      />
                    </div>

                    <span className="w-[75px] shrink-0 text-right text-xs font-bold">
                      {t.revenue > 0 ? formatCompactRupiah(t.revenue) : '0'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Services */}
      <Card className="overflow-hidden border-border shadow-sm">
        <CardHeader className="border-b border-border/60 px-4 pb-3 pt-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Medal size={15} />
            </div>

            Layanan Terlaris
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {topItems.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Belum ada data layanan.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {topItems.map((item, i) => (
                <li
                  key={item.itemName}
                  className="group flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-muted/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                        i === 0
                          ? 'bg-amber-500/15 text-amber-600'
                          : i === 1
                            ? 'bg-slate-500/10 text-slate-600 dark:text-slate-300'
                            : i === 2
                              ? 'bg-orange-500/15 text-orange-600'
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
                    {item.totalSold}x
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="overflow-hidden border-border shadow-sm">
        <CardHeader className="border-b border-border/60 px-4 pb-3 pt-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
              <CreditCard size={15} />
            </div>

            Metode Bayar
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4">
          {payments.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Belum ada data pembayaran.
            </p>
          ) : (
            <ul className="space-y-5">
              {payments.map((p) => {
                const pctValue = parseFloat(p.percentage);

                return (
                  <li key={p.method}>
                    <div className="mb-1.5 flex items-end justify-between gap-3">
                      <span className="text-sm font-medium text-foreground">
                        {p.method}
                      </span>

                      <div className="text-right">
                        <span className="text-xs font-bold">
                          {p.percentage}
                        </span>

                        <span className="ml-1.5 text-[10px] text-muted-foreground">
                          ({p.count}x)
                        </span>
                      </div>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-chart-2/60 to-chart-2 transition-all duration-1000 ease-out"
                        style={{
                          width: `${pctValue}%`,
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