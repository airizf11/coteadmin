// coteadmin/src/components/DatePresetFilter.tsx
'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { CalendarRange } from 'lucide-react';
import { DATE_PRESET_OPTIONS, getDatePresetRange, type DatePreset } from '@/lib/date-range';

export function DatePresetFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showCustom, setShowCustom] = useState(false);
  const [customStart, setCustomStart] = useState(searchParams.get('startDate') ?? '');
  const [customEnd, setCustomEnd] = useState(searchParams.get('endDate') ?? '');

  const currentStart = searchParams.get('startDate') ?? '';
  const currentEnd = searchParams.get('endDate') ?? '';

  const activePreset = DATE_PRESET_OPTIONS.find((opt) => {
    const r = getDatePresetRange(opt.value);
    return r.start === currentStart && r.end === currentEnd;
  })?.value;

  function pushParams(start: string, end: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (start) params.set('startDate', start); else params.delete('startDate');
    if (end) params.set('endDate', end); else params.delete('endDate');
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function applyPreset(preset: DatePreset) {
    const { start, end } = getDatePresetRange(preset);
    setShowCustom(false);
    pushParams(start, end);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {DATE_PRESET_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => applyPreset(opt.value)}
            className={cn(
              'text-xs px-3 py-1.5 rounded-full border font-medium transition-colors',
              activePreset === opt.value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-border hover:border-primary/40 cursor-pointer',
            )}
          >
            {opt.label}
          </button>
        ))}
        <button
          onClick={() => setShowCustom((v) => !v)}
          className={cn(
            'text-xs px-3 py-1.5 rounded-full border font-medium transition-colors flex items-center gap-1.5',
            !activePreset && (currentStart || currentEnd)
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-muted-foreground border-border hover:border-primary/40 cursor-pointer',
          )}
        >
          <CalendarRange size={12} /> Custom
        </button>
      </div>

      {showCustom && (
        <div className="flex flex-wrap items-end gap-2 rounded-xl border border-dashed border-border bg-muted/30 p-3">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Dari</label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Sampai</label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            />
          </div>
          <button
            onClick={() => pushParams(customStart, customEnd)}
            className="h-9 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground cursor-pointer"
          >
            Terapkan
          </button>
        </div>
      )}
    </div>
  );
}