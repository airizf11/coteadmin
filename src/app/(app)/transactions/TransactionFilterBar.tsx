// coteadmin/src/app/(app)/transactions/TransactionFilterBar.tsx
'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DatePresetFilter } from '@/components/DatePresetFilter';

const TX_TYPES = [
  { value: 'IN', label: 'Uang Masuk' },
  { value: 'OUT', label: 'Uang Keluar' },
];

export function TransactionFilterBar({ currentType }: { currentType?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const hasDateFilter = !!(searchParams.get('startDate') || searchParams.get('endDate'));
  const activeCount = (currentType ? 1 : 0) + (hasDateFilter ? 1 : 0);

  function updateType(value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('type', value);
    else params.delete('type');
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
            <div className="text-xs font-semibold text-muted-foreground mb-2">Jenis Arus Kas</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateType(null)}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-full border font-medium transition-colors',
                  !currentType
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:border-primary/40 cursor-pointer',
                )}
              >
                Semua
              </button>
              {TX_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => updateType(t.value)}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-full border font-medium transition-colors',
                    currentType === t.value
                      ? t.value === 'IN'
                        ? 'bg-success text-white border-success'
                        : 'bg-destructive text-white border-destructive'
                      : 'bg-background text-muted-foreground border-border hover:border-primary/40 cursor-pointer',
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2">Tanggal Transaksi</div>
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