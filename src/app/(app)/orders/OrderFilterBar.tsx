// coteadmin/src/app/(app)/orders/OrderFilterBar.tsx
'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STATUS_CONFIG } from '@/lib/constants/order-status';
import { DatePresetFilter } from '@/components/DatePresetFilter';

const ORDER_STATUSES = ['RECEIVED', 'IN_PROCESS', 'READY', 'DONE', 'CANCELLED'];

export function OrderFilterBar({
  currentStatus,
  currentPaymentStatus,
}: {
  currentStatus?: string;
  currentPaymentStatus?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const hasDateFilter = !!(searchParams.get('startDate') || searchParams.get('endDate'));
  const activeCount =
    (currentStatus ? 1 : 0) + (currentPaymentStatus ? 1 : 0) + (hasDateFilter ? 1 : 0);

  function updateStatusFilter(key: 'status' | 'paymentStatus', value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <SlidersHorizontal size={16} />
        Filter
        {activeCount > 0 && (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 rounded-full">
            {activeCount}
          </Badge>
        )}
      </button>

      {open && (
        <div className="space-y-4 p-3 bg-muted/30 rounded-xl border border-border animate-in fade-in slide-in-from-top-2 duration-200">
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2">Status Order</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateStatusFilter('status', null)}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-full border font-medium transition-colors',
                  !currentStatus
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:border-primary/40 cursor-pointer',
                )}
              >
                Semua
              </button>
              {ORDER_STATUSES.map((status) => {
                const config = STATUS_CONFIG[status];
                return (
                  <button
                    key={status}
                    onClick={() => updateStatusFilter('status', status)}
                    className={cn(
                      'text-xs px-3 py-1.5 rounded-full border font-medium transition-colors',
                      currentStatus === status
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-border hover:border-primary/40 cursor-pointer',
                    )}
                  >
                    {config?.label ?? status}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2">Status Bayar</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateStatusFilter('paymentStatus', null)}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-full border font-medium transition-colors',
                  !currentPaymentStatus
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:border-primary/40 cursor-pointer',
                )}
              >
                Semua
              </button>
              <button
                onClick={() => updateStatusFilter('paymentStatus', 'PAID')}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-full border font-medium transition-colors',
                  currentPaymentStatus === 'PAID'
                    ? 'bg-success text-white border-success'
                    : 'bg-background text-muted-foreground border-border hover:border-success/40 cursor-pointer',
                )}
              >
                Lunas
              </button>
              <button
                onClick={() => updateStatusFilter('paymentStatus', 'UNPAID')}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-full border font-medium transition-colors',
                  currentPaymentStatus === 'UNPAID'
                    ? 'bg-destructive text-white border-destructive'
                    : 'bg-background text-muted-foreground border-border hover:border-destructive/40 cursor-pointer',
                )}
              >
                Belum Lunas
              </button>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2">Tanggal Order</div>
            <DatePresetFilter />
          </div>

          {activeCount > 0 && (
            <button
              onClick={() => router.push(pathname)}
              className="flex items-center gap-1 text-xs text-destructive font-medium cursor-pointer"
            >
              <X size={12} /> Hapus semua filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}