// coteadmin/src/app/(app)/orders/[id]/receipt/OpenDrawerButton.tsx
'use client';

import { useState } from 'react';
import { BlePrinter } from '@/lib/printer/ble';
import { EscPos } from '@/lib/printer/escpos';

export function OpenDrawerButton() {
  const [printer] = useState(() => new BlePrinter());
  const [status, setStatus] = useState<'idle' | 'connecting' | 'opening' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleOpen() {
    try {
      setErrorMsg('');
      if (!printer.isConnected) {
        setStatus('connecting');
        await printer.connect();
      }
      setStatus('opening');
      await printer.write(EscPos.openDrawer());
      setStatus('idle');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="max-w-[320px] mx-auto mb-3 print:hidden">
      <button
        onClick={handleOpen}
        disabled={status === 'connecting' || status === 'opening'}
        className="w-full bg-secondary text-secondary-foreground rounded-lg p-3 font-medium disabled:opacity-60 cursor-pointer"
      >
        {status === 'connecting' ? 'Menghubungkan printer...' : status === 'opening' ? 'Membuka laci...' : 'Buka Laci Uang'}
      </button>
      {status === 'error' && <p className="text-xs text-destructive mt-1">{errorMsg}</p>}
    </div>
  );
}