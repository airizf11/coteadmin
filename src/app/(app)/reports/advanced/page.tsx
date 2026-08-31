// coteadmin/src/app/(app)/reports/advanced/page.tsx
import { cotebek } from '@/lib/cotebek';
import { AdvancedReportFilterBar } from './AdvancedReportFilterBar';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  TrendingUp, TrendingDown, Wallet, ShoppingCart, Receipt, Medal, CreditCard,
  Activity, TicketPercent, Minus, Calculator, PieChart,
  Users,
} from 'lucide-react';
import { ExportButton } from './ExportButton';
import { ReportTabs } from './ReportTabs';
import { TrendLineChart } from '@/components/charts/TrendLineChart';
import { PaymentMethodDonut } from '@/components/charts/PaymentMethodDonut';
// import { formatRupiah } from '@/lib/format';
import { last30DaysRangeWIB } from '@/lib/date-range';
import { ApiErrorFallback } from '@/components/ApiErrorFallback';
import { Money } from '@/components/Money';

type Summary = { revenue: number; cogs: number; grossProfit: number; totalOrders: number };
type TopItem = { itemName: string; totalSold: number };
type TrendPoint = { date: string; revenue: number; profit: number };
type PaymentMethodStat = { method: string; count: number; percentage: string };
type PromoBudget = { totalDiscount: number; ordersWithPromo: number; discountPercentage: string };
type NetProfit = { revenue: number; cogs: number; grossProfit: number; operatingExpense: number; netProfit: number };
type ExpenseByCategory = { category: string; total: number; count: number };
type IncomeByCategory = { category: string; total: number; count: number };
type CashFlowPoint = { date: string; totalIn: number; totalOut: number; net: number };
type TopCustomer = { customerId: string; customerName: string; totalOrders: number; totalSpent: number };

const EXPENSE_CATEGORY_LABEL: Record<string, string> = {
  EXPENSE: 'Operasional',
  CAPEX: 'Aset/Modal',
  ADJUSTMENT: 'Penyesuaian',
  FUND_OUT: 'Modal Keluar',
  OTHER: 'Lainnya',
};

const INCOME_CATEGORY_LABEL: Record<string, string> = {
  SALES: 'Penjualan',
  FUND_IN: 'Modal Masuk',
  OTHER: 'Lainnya',
};

function getChangeData(current: number, previous: number) {
  if (previous === 0) return null;
  const change = ((current - previous) / previous) * 100;
  return { value: `${Math.abs(change).toFixed(1)}%`, trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral' };
}

function CompareBadge({ data }: { data: { value: string; trend: string } | null }) {
  if (!data) return <span className="ml-1.5 text-[10px] text-muted-foreground">—</span>;
  const isUp = data.trend === 'up';
  const isDown = data.trend === 'down';
  return (
    <div className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold',
      isUp ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : isDown ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground')}>
      {isUp ? <TrendingUp size={10} /> : isDown ? <TrendingDown size={10} /> : <Minus size={10} />}
      {data.value}
    </div>
  );
}

function SectionHeader({ icon: Icon, color, title }: { icon: any; color: string; title: string }) {
  return (
    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
      <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-${color}/10 text-${color}`}>
        <Icon size={14} />
      </div>
      {title}
    </CardTitle>
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
  const hasCompare = !!(compareStartDate && compareEndDate);
  const qs = `?startDate=${startDate}&endDate=${endDate}`;

  let summary: Summary;
  let topItems: TopItem[];
  let trend: TrendPoint[];
  let payments: PaymentMethodStat[];
  let promo: PromoBudget;
  let netProfit: NetProfit;
  let expenseByCategory: ExpenseByCategory[];
  let incomeByCategory: IncomeByCategory[];
  let cashFlowTrend: CashFlowPoint[];
  let topCustomers: TopCustomer[];
  let compareSummary: Summary | null = null;
  let comparePromo: PromoBudget | null = null;
  let compareNetProfit: NetProfit | null = null;

  try {
    const [
      summaryRes, topItemsRes, trendRes, paymentRes, promoRes, netProfitRes,
      expenseCategoryRes, incomeCategoryRes, cashFlowRes, topCustomersRes,
    ] = await Promise.all([
      cotebek<{ data: Summary }>(`/reports/summary${qs}`),
      cotebek<{ data: TopItem[] }>(`/reports/top-items${qs}`),
      cotebek<{ data: TrendPoint[] }>(`/reports/sales-trend${qs}`),
      cotebek<{ data: PaymentMethodStat[] }>(`/reports/payment-methods${qs}`),
      cotebek<{ data: PromoBudget }>(`/reports/promo-budget${qs}`),
      cotebek<{ data: NetProfit }>(`/reports/net-profit${qs}`),
      cotebek<{ data: ExpenseByCategory[] }>(`/reports/expense-by-category${qs}`),
      cotebek<{ data: IncomeByCategory[] }>(`/reports/income-by-category${qs}`),
      cotebek<{ data: CashFlowPoint[] }>(`/reports/cash-flow-trend${qs}`),
      cotebek<{ data: TopCustomer[] }>(`/reports/top-customers${qs}`),
    ]);
    summary = summaryRes.data;
    topItems = topItemsRes.data;
    trend = trendRes.data;
    payments = paymentRes.data;
    promo = promoRes.data;
    netProfit = netProfitRes.data;
    expenseByCategory = expenseCategoryRes.data;
    incomeByCategory = incomeCategoryRes.data;
    cashFlowTrend = cashFlowRes.data;
    topCustomers = topCustomersRes.data;

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

  const maxExpense = Math.max(1, ...expenseByCategory.map((e) => e.total));
  const maxIncome = Math.max(1, ...incomeByCategory.map((i) => i.total));

  const ringkasanContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-chart-1/30 bg-chart-1/5">
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-1.5 text-chart-1">
              <TrendingUp size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Omzet</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-1">
              <span className="text-lg font-bold tracking-tight text-chart-1"><Money value={summary.revenue} /></span>
              {hasCompare && compareSummary && <CompareBadge data={getChangeData(summary.revenue, compareSummary.revenue)} />}
            </div>
          </CardContent>
        </Card>
        <Card className="border-chart-2/30 bg-chart-2/5">
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-1.5 text-chart-2">
              <Wallet size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Laba Kotor</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-1">
              <span className="text-lg font-bold tracking-tight text-chart-2"><Money value={summary.grossProfit} /></span>
              {hasCompare && compareSummary && <CompareBadge data={getChangeData(summary.grossProfit, compareSummary.grossProfit)} />}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-muted/40">
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-1.5 text-muted-foreground">
              <ShoppingCart size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Modal (COGS)</span>
            </div>
            <div className="text-lg font-bold tracking-tight text-foreground"><Money value={summary.cogs} /></div>
          </CardContent>
        </Card>
        <Card className="border-chart-3/30 bg-chart-3/5">
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-1.5 text-chart-3">
              <Receipt size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Order</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-1">
              <span className="text-lg font-bold tracking-tight text-chart-3">{summary.totalOrders}</span>
              <span className="text-xs text-chart-3/70">nota</span>
              {hasCompare && compareSummary && <CompareBadge data={getChangeData(summary.totalOrders, compareSummary.totalOrders)} />}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-border shadow-sm">
        <CardHeader className="border-b border-border/60 px-4 pb-3 pt-4">
          <SectionHeader icon={Calculator} color="chart-2" title="Ringkasan Laba Rugi" />
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground">Omzet Penjualan</span>
            <span className="font-semibold text-foreground"><Money value={netProfit.revenue} /></span>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm text-destructive">
            <span className="opacity-80">Modal (COGS)</span>
            <span className="font-medium">-<Money value={netProfit.cogs} /></span>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-dashed border-border pt-3 text-sm">
            <span className="font-medium text-foreground">Laba Kotor</span>
            <span className="font-bold text-foreground"><Money value={netProfit.grossProfit} /></span>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm text-destructive">
            <span className="opacity-80">Beban Operasional</span>
            <span className="font-medium">-<Money value={netProfit.operatingExpense} /></span>
          </div>
          <div className={cn('mt-2 rounded-xl border p-4', netProfit.netProfit >= 0 ? 'border-success/20 bg-success/5' : 'border-destructive/20 bg-destructive/5')}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Laba Bersih</div>
                <div className={cn('mt-1 text-xl font-bold tracking-tight', netProfit.netProfit >= 0 ? 'text-success' : 'text-destructive')}>
                  <Money value={netProfit.netProfit} />
                </div>
              </div>
              {hasCompare && compareNetProfit && <CompareBadge data={getChangeData(netProfit.netProfit, compareNetProfit.netProfit)} />}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const penjualanContent = (
    <div className="space-y-4">
      <Card className="overflow-hidden border-border shadow-sm">
        <CardHeader className="border-b border-border/60 px-4 pb-3 pt-4">
          <SectionHeader icon={Activity} color="chart-1" title="Tren Penjualan Harian" />
        </CardHeader>
        <CardContent className="p-4">
          <TrendLineChart
            data={trend}
            series={[
              { dataKey: 'revenue', name: 'Omzet', color: 'var(--chart-1)' },
              { dataKey: 'profit', name: 'Laba', color: 'var(--chart-2)' },
            ]}
          />
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border shadow-sm">
        <CardHeader className="border-b border-border/60 px-4 pb-3 pt-4">
          <SectionHeader icon={Medal} color="amber-500" title="Layanan Terlaris" />
        </CardHeader>
        <CardContent className="p-0">
          {topItems.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Belum ada data layanan.</p>
          ) : (
            <ul className="divide-y divide-border">
              {topItems.map((item, i) => (
                <li key={item.itemName} className="flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-muted/40">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                      i === 0 ? 'bg-amber-500/15 text-amber-600' : i === 1 ? 'bg-slate-500/10 text-slate-600 dark:text-slate-300' : i === 2 ? 'bg-orange-500/15 text-orange-600' : 'bg-muted text-muted-foreground')}>
                      {i + 1}
                    </div>
                    <span className="truncate text-sm font-medium text-foreground">{item.itemName}</span>
                  </div>
                  <span className="shrink-0 rounded-lg bg-muted px-2.5 py-1 text-xs font-bold text-foreground">{item.totalSold}x</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border shadow-sm">
        <CardHeader className="border-b border-border/60 px-4 pb-3 pt-4">
          <SectionHeader icon={CreditCard} color="chart-2" title="Metode Bayar" />
        </CardHeader>
        <CardContent className="p-4">
          <PaymentMethodDonut data={payments} />
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-chart-4/30 bg-gradient-to-br from-chart-4/10 via-background to-background shadow-sm">
        <CardHeader className="px-4 pb-2 pt-4">
          <SectionHeader icon={TicketPercent} color="chart-4" title="Budget Promo & Diskon" />
        </CardHeader>
        <CardContent className="space-y-3 p-4 pt-2">
          <div className="flex items-center justify-between gap-4 border-b border-chart-4/15 pb-3">
            <span className="text-sm text-chart-4/80">Total Diskon Diberikan</span>
            <span className="font-bold text-chart-4"><Money value={promo.totalDiscount} /></span>
          </div>
          <div className="flex items-center justify-between gap-4 border-b border-chart-4/15 pb-3">
            <span className="text-sm text-chart-4/80">Order Pakai Promo</span>
            <span className="font-bold text-chart-4">{promo.ordersWithPromo} <span className="text-xs font-normal opacity-70">nota</span></span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-chart-4/80">Persentase dari Omzet</span>
            <Badge variant="outline" className="border-chart-4/30 bg-chart-4/10 text-chart-4">{promo.discountPercentage}</Badge>
          </div>
          {hasCompare && comparePromo && (
            <div className="mt-4 rounded-xl border border-chart-4/15 bg-background/60 p-3 text-xs text-muted-foreground">
              <span className="mb-1.5 block font-semibold text-foreground">Data Periode Pembanding</span>
              Total Diskon: <span className="font-medium text-foreground"><Money value={comparePromo.totalDiscount} /></span>
              <br />
              Digunakan di <span className="font-medium text-foreground">{comparePromo.ordersWithPromo} order</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const arusKasContent = (
    <div className="space-y-4">
      <Card className="overflow-hidden border-border shadow-sm">
        <CardHeader className="border-b border-border/60 px-4 pb-3 pt-4">
          <SectionHeader icon={Activity} color="success" title="Tren Arus Kas" />
        </CardHeader>
        <CardContent className="p-4">
          <TrendLineChart
            data={cashFlowTrend}
            series={[
              { dataKey: 'totalIn', name: 'Masuk', color: 'var(--success)' },
              { dataKey: 'totalOut', name: 'Keluar', color: 'var(--destructive)' },
            ]}
          />
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border shadow-sm">
        <CardHeader className="border-b border-border/60 px-4 pb-3 pt-4">
          <SectionHeader icon={TrendingUp} color="success" title="Pemasukan Berdasarkan Kategori" />
        </CardHeader>
        <CardContent className="p-4">
          {incomeByCategory.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Belum ada catatan pemasukan.</p>
          ) : (
            <div className="space-y-4">
              {incomeByCategory.map((i) => {
                const percentage = (i.total / maxIncome) * 100;
                const catLabel = INCOME_CATEGORY_LABEL[i.category] ?? i.category;
                return (
                  <div key={i.category} className="space-y-1.5">
                    <div className="flex items-end justify-between gap-3">
                      <span className="text-sm font-semibold text-foreground">
                        {catLabel} <span className="ml-1.5 text-[10px] font-normal text-muted-foreground">{i.count} transaksi</span>
                      </span>
                      <span className="text-xs font-bold text-success"><Money value={i.total} /></span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-gradient-to-r from-success/60 to-success transition-all duration-1000 ease-out" style={{ width: `${Math.max(percentage, 1)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border shadow-sm">
        <CardHeader className="border-b border-border/60 px-4 pb-3 pt-4">
          <SectionHeader icon={PieChart} color="chart-5" title="Pengeluaran Berdasarkan Kategori" />
        </CardHeader>
        <CardContent className="p-4">
          {expenseByCategory.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Belum ada catatan pengeluaran.</p>
          ) : (
            <div className="space-y-4">
              {expenseByCategory.map((e) => {
                const percentage = (e.total / maxExpense) * 100;
                const catLabel = EXPENSE_CATEGORY_LABEL[e.category] ?? e.category;
                return (
                  <div key={e.category} className="space-y-1.5">
                    <div className="flex items-end justify-between gap-3">
                      <span className="text-sm font-semibold text-foreground">
                        {catLabel} <span className="ml-1.5 text-[10px] font-normal text-muted-foreground">{e.count} transaksi</span>
                      </span>
                      <span className="text-xs font-bold text-destructive"><Money value={e.total} /></span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-gradient-to-r from-destructive/60 to-destructive transition-all duration-1000 ease-out" style={{ width: `${Math.max(percentage, 1)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const pelangganContent = (
  <div className="space-y-4">
    <Card className="overflow-hidden border-border shadow-sm">
      <CardHeader className="border-b border-border/60 px-4 pb-3 pt-4">
        <SectionHeader icon={Users} color="chart-3" title="Pelanggan Teratas" />
        <p className="mt-1 text-xs text-muted-foreground">Berdasarkan total belanja dalam periode ini</p>
      </CardHeader>
      <CardContent className="p-0">
        {topCustomers.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Belum ada data pelanggan.</p>
        ) : (
          <ul className="divide-y divide-border">
            {topCustomers.map((c, i) => (
              <li key={c.customerId} className="flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-muted/40">
                <div className="flex min-w-0 items-center gap-3">
                  <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    i === 0 ? 'bg-amber-500/15 text-amber-600' : i === 1 ? 'bg-slate-500/10 text-slate-600 dark:text-slate-300' : i === 2 ? 'bg-orange-500/15 text-orange-600' : 'bg-muted text-muted-foreground')}>
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-foreground">{c.customerName}</div>
                    <div className="text-[10px] text-muted-foreground">{c.totalOrders} order</div>
                  </div>
                </div>
                <span className="shrink-0 text-sm font-bold text-foreground"><Money value={c.totalSpent} /></span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  </div>
);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 px-4 pb-24 pt-5 sm:px-6">
      <PageHeader title="Laporan Lanjutan" subtitle="Filter kustom & komparasi data" backHref="/reports" />

      <div className="flex flex-wrap gap-2">
        <ExportButton
          startDate={startDate}
          endDate={endDate}
          compareStartDate={hasCompare ? compareStartDate : undefined}
          compareEndDate={hasCompare ? compareEndDate : undefined}
        />
      </div>

      <AdvancedReportFilterBar compareStartDate={compareStartDate} compareEndDate={compareEndDate} />

      <ReportTabs
        tabs={[
          { id: 'ringkasan', label: 'Ringkasan', content: ringkasanContent },
          { id: 'penjualan', label: 'Penjualan', content: penjualanContent },
          { id: 'arus-kas', label: 'Arus Kas', content: arusKasContent },
          { id: 'pelanggan', label: 'Pelanggan', content: pelangganContent },
        ]}
      />
    </div>
  );
}