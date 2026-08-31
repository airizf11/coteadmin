// coteadmin/src/app/(app)/transactions/page.tsx
import { cotebek } from '@/lib/cotebek';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ReceiptText, 
  ArrowDownLeft, 
  ArrowUpRight 
} from 'lucide-react';
// import { MarkPaidInline } from './MarkPaidInline';
import { formatRupiah } from '@/lib/format';
import { TransactionFilterBar } from './TransactionFilterBar';
import { TransactionList } from './TransactionList';
import { Money } from '@/components/Money';

export type Transaction = {
  id: string;
  txNumber: string;
  type: 'IN' | 'OUT';
  category: string;
  amount: number;
  fee: number | null;
  description: string | null;
  createdAt: string;
  paymentStatus: 'PAID' | 'UNPAID';
};

type TransactionsResponse = {
  data: Transaction[];
  meta: {
    summary: { totalIn: number; totalOut: number; balance: number };
  };
};

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ startDate?: string; endDate?: string; type?: string }>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  if (params.startDate) qs.set('startDate', params.startDate);
  if (params.endDate) qs.set('endDate', params.endDate);
  if (params.type) qs.set('type', params.type);

  let res: TransactionsResponse;
  try {
    res = await cotebek<TransactionsResponse>(`/transactions${qs.toString() ? `?${qs}` : ''}`);
  } catch {
    return (
      <div className="p-4 flex flex-col items-center justify-center text-center py-16">
        <p className="text-sm text-muted-foreground max-w-[240px]">
          Riwayat transaksi cuma bisa dilihat Admin/Owner. Kamu tetap bisa catat transaksi baru.
        </p>
        <Link href="/new/tx" className={cn(buttonVariants({ size: 'sm' }), 'mt-4')}>
          + Catat Transaksi
        </Link>
      </div>
    );
  }
  const { data } = res;
  const { summary } = res.meta;

  return (
    <div className="p-4 pb-24 space-y-5">
      
      {/* 1. HEADER & TOMBOL CATAT */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary tracking-tight">Transaksi</h1>
          <p className="text-sm text-muted-foreground mt-1">Pantau arus kas usahamu.</p>
        </div>
        <Link 
          href="/new/tx" 
          className={cn(
            buttonVariants({ size: "sm" }), 
            "rounded-full shadow-md shrink-0 flex items-center gap-1 whitespace-nowrap"
          )}
        >
          <Plus size={16} aria-hidden="true" /> Catat
        </Link>
      </div>

      {/* 2. RINGKASAN SALDO (SUMMARY CARDS) */}
      <div className="grid grid-cols-3 gap-2" aria-label="Ringkasan Keuangan">
        {/* Pemasukan */}
        <Card className="shadow-sm border-success/30 bg-success/5">
          <CardContent className="p-3 flex flex-col items-center text-center gap-1">
            <div className="p-1.5 bg-success/10 rounded-full text-success mb-1" aria-hidden="true">
              <TrendingUp size={16} />
            </div>
            <div className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Masuk</div>
            <div className="text-sm font-bold text-success truncate w-full" title={formatRupiah(summary.totalIn)}>
              <span className="sr-only">Total Pemasukan: </span>
              <Money value={summary.totalIn} />
            </div>
          </CardContent>
        </Card>

        {/* Pengeluaran */}
        <Card className="shadow-sm border-destructive/20 bg-destructive/5">
          <CardContent className="p-3 flex flex-col items-center text-center gap-1">
            <div className="p-1.5 bg-destructive/10 rounded-full text-destructive mb-1" aria-hidden="true">
              <TrendingDown size={16} />
            </div>
            <div className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Keluar</div>
            <div className="text-sm font-bold text-destructive truncate w-full" title={formatRupiah(summary.totalOut)}>
              <span className="sr-only">Total Pengeluaran: </span>
              <Money value={summary.totalOut} />
            </div>
          </CardContent>
        </Card>

        {/* Saldo */}
        <Card className="shadow-sm border-primary/20 bg-primary/5">
          <CardContent className="p-3 flex flex-col items-center text-center gap-1">
            <div className="p-1.5 bg-primary/10 rounded-full text-primary mb-1" aria-hidden="true">
              <Wallet size={16} />
            </div>
            <div className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Saldo</div>
            <div className="text-sm font-bold text-primary truncate w-full" title={formatRupiah(summary.balance)}>
              <span className="sr-only">Sisa Saldo: </span>
              <Money value={summary.balance} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. KOMPONEN FILTER TRANSAKSI */}
      <TransactionFilterBar currentType={params.type} />

      {/* 4. EMPTY STATE */}
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-2xl border border-dashed border-border mt-2">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 shadow-sm">
            <ReceiptText className="text-muted-foreground opacity-50" size={32} aria-hidden="true" />
          </div>
          <p className="text-foreground font-medium">Tidak ada data</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">
            Cobalah ubah filter tanggal atau jenis transaksi Anda.
          </p>
        </div>
      
      ) : (
        <TransactionList transactions={data} />
      )}

    </div>
  );
}