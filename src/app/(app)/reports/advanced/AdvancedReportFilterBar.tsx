// coteadmin/src/app/(app)/reports/advanced/AdvancedReportFilterBar.tsx
'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, X } from 'lucide-react';
import { DatePresetFilter } from '@/components/DatePresetFilter';

export function AdvancedReportFilterBar({
  compareStartDate,
  compareEndDate,
}: {
  compareStartDate?: string;
  compareEndDate?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showCompare, setShowCompare] = useState(!!compareStartDate);
  const [cStart, setCStart] = useState(compareStartDate ?? '');
  const [cEnd, setCEnd] = useState(compareEndDate ?? '');

  function applyCompare() {
    const params = new URLSearchParams(searchParams.toString());
    if (cStart) params.set('compareStartDate', cStart); else params.delete('compareStartDate');
    if (cEnd) params.set('compareEndDate', cEnd); else params.delete('compareEndDate');
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function clearCompare() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('compareStartDate');
    params.delete('compareEndDate');
    setCStart('');
    setCEnd('');
    setShowCompare(false);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="space-y-3">
      <DatePresetFilter />

      {showCompare ? (
        <Card className="border-dashed">
          <CardContent className="p-3 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <ArrowRightLeft size={14} className="text-warning" /> Bandingkan Dengan
              </Label>
              <button
                type="button"
                onClick={clearCompare}
                className="text-xs text-destructive font-medium flex items-center gap-1 hover:underline cursor-pointer"
              >
                <X size={12} /> Hapus
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Dari</label>
                <input
                  type="date"
                  value={cStart}
                  onChange={(e) => setCStart(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Sampai</label>
                <input
                  type="date"
                  value={cEnd}
                  onChange={(e) => setCEnd(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                />
              </div>
            </div>
            <Button onClick={applyCompare} size="sm" className="w-full">
              Terapkan Perbandingan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <button
          type="button"
          onClick={() => setShowCompare(true)}
          className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowRightLeft size={12} /> Tambah Periode Pembanding
        </button>
      )}
    </div>
  );
}