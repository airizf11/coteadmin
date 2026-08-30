// coteadmin/src/app/(app)/transactions/MarkPaidInline.tsx
'use client';

import { useState } from 'react';
import { markTransactionPaid } from './actions';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function MarkPaidInline({ id }: { id: string }) {
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    try {
      const result = await markTransactionPaid(id);
      if (result?.error) {
        toast.error(result.error);
      }
    } catch {
      toast.error('Gagal menandai lunas.');
    } finally {
      setPending(false);
    }
  }

  return (
    <Button 
      onClick={handleClick} 
      disabled={pending} 
      variant="outline"
      size="sm"
      className="h-5 px-1.5 py-0 text-[9px] font-semibold border-warning/30 text-warning bg-warning/10 hover:bg-warning/20 transition-colors shadow-none shrink-0 cursor-pointer"
      title="Tandai sebagai Lunas"
    >
      {pending ? (
        <Loader2 size={10} className="animate-spin mr-1" />
      ) : (
        <CheckCircle2 size={10} className="mr-1 text-warning" />
      )}
      {pending ? 'Proses...' : 'Lunasi'}
    </Button>
  );
}