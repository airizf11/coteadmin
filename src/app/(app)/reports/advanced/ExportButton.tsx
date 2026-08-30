// coteadmin/src/app/(app)/reports/advanced/ExportButton.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function ExportButton({ startDate, endDate, compareStartDate, compareEndDate }: {
  startDate: string; endDate: string; compareStartDate?: string; compareEndDate?: string;
}) {
  const [pending, setPending] = useState<'xlsx' | 'pdf' | null>(null);

  async function handleExport(format: 'xlsx' | 'pdf') {
    setPending(format);
    try {
      const qs = new URLSearchParams({
        startDate, endDate, format,
        ...(compareStartDate && compareEndDate ? { compareStartDate, compareEndDate } : {}),
      });
      const res = await fetch(`/api/reports/export?${qs.toString()}`);
      if (!res.ok) throw new Error('Gagal generate laporan.');
      const blob = await res.blob();
      const filename = res.headers.get('content-disposition')?.match(/filename="(.+)"/)?.[1] ?? `laporan.${format}`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal export.');
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="flex gap-2">
      <Button onClick={() => handleExport('xlsx')} disabled={pending !== null} variant="outline" size="sm" className="gap-2 cursor-pointer">
        {pending === 'xlsx' ? <Loader2 size={14} className="animate-spin" /> : <FileSpreadsheet size={14} />}
        Excel
      </Button>
      <Button onClick={() => handleExport('pdf')} disabled={pending !== null} variant="outline" size="sm" className="gap-2 cursor-pointer">
        {pending === 'pdf' ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
        PDF
      </Button>
    </div>
  );
}