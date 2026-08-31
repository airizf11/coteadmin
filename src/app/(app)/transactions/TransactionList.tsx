// coteadmin/src/app/(app)/transactions/TransactionList.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatRupiah } from '@/lib/format';
import { TX_CATEGORY_LABEL } from '@/lib/constants/transaction';
import { MarkPaidInline } from './MarkPaidInline';
import type { Transaction } from './page';

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return transactions;
    const q = query.trim().toLowerCase();
    return transactions.filter((tx) => tx.description?.toLowerCase().includes(q));
  }, [transactions, query]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari keterangan (misal: Gojek, YouTube)..."
          className="pl-9 bg-background"
        />
      </div>

      {query.trim() && filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-2xl border border-dashed border-border">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Search className="text-muted-foreground opacity-50" size={32} />
          </div>
          <p className="text-foreground font-medium">Gak ada yang cocok</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-[240px]">
            Coba kata kunci lain. Pencarian ini cuma nyari di data yang lagi ketampil (sesuai filter tanggal).
          </p>
        </div>
      ) : (
        <ul className="space-y-3" aria-label="Daftar Riwayat Transaksi">
          {filtered.map((tx) => {
            const isIncome = tx.type === 'IN';
            const catLabel = TX_CATEGORY_LABEL[tx.category] || tx.category;

            return (
              <li key={tx.id}>
                <Card className="relative shadow-sm border-border hover:shadow-md transition-all duration-200">
                  <Link
                    href={`/transactions/${tx.id}`}
                    className="absolute inset-0 z-0 rounded-xl"
                    aria-label={`Lihat detail transaksi ${tx.description || catLabel}`}
                  />
                  <CardContent className="relative z-10 p-3.5 flex justify-between items-start gap-3">
                    <div className="flex items-start gap-3 overflow-hidden mt-0.5">
                      <div
                        className={cn(
                          "p-2.5 rounded-full shrink-0",
                          isIncome ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                        )}
                        aria-hidden="true"
                      >
                        {isIncome ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                      </div>

                      <dl className="flex flex-col overflow-hidden">
                        <dt className="sr-only">Keterangan</dt>
                        <dd className="font-semibold text-sm text-foreground truncate" title={tx.description || catLabel}>
                          {tx.description || catLabel}
                        </dd>

                        <dt className="sr-only">Tanggal dan ID</dt>
                        <dd className="text-xs text-muted-foreground mt-0.5 truncate">
                          {tx.txNumber} &bull; {new Date(tx.createdAt).toLocaleString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })} WIB
                        </dd>
                      </dl>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end">
                      <div
                        className={cn(
                          "text-sm font-bold",
                          isIncome ? "text-success" : "text-destructive"
                        )}
                      >
                        <span className="sr-only">{isIncome ? 'Pemasukan sebesar' : 'Pengeluaran sebesar'}</span>
                        {isIncome ? '+' : '-'}{formatRupiah(tx.amount)}
                      </div>

                      {tx.fee != null && tx.fee > 0 && (
                        <div className="text-[10px] text-warning font-medium mt-0.5" aria-label={`Dipotong biaya admin Rp${tx.fee}`}>
                          Fee: {formatRupiah(tx.fee)}
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-1.5 mt-1.5 pointer-events-auto relative z-20">
                        {tx.paymentStatus === 'UNPAID' && <MarkPaidInline id={tx.id} />}
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 text-muted-foreground shadow-none shrink-0">
                          {catLabel}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}