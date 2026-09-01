// coteadmin/src/app/(app)/orders/[id]/receipt/BlePrintButton.tsx
'use client';

import { useState } from 'react';
import { BlePrinter } from '@/lib/printer/ble';
import { EscPos } from '@/lib/printer/escpos';
import type { ReceiptData } from './page';

export function BlePrintButton({ data }: { data: ReceiptData }) {
  const [printer] = useState(() => new BlePrinter());
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'printing' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handlePrint() {
    try {
      setErrorMsg('');
      if (!printer.isConnected) {
        setStatus('connecting');
        await printer.connect();
      }
      setStatus('printing');

      await printer.write(EscPos.receipt(data), { chunkSize: 200, delay: 20 });

      // temp off
      /* const trackUrl = data.order.trackingToken
        ? `${window.location.origin}/track/${data.order.trackingToken}`
        : null;
      await printer.write(
        EscPos.receipt({ ...data, order: { ...data.order, trackUrl } }),
        { chunkSize: 200, delay: 20 },
      ); */

      setStatus('connected');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="max-w-[320px] mx-auto mb-3 print:hidden">
      <button
        onClick={handlePrint}
        disabled={status === 'connecting' || status === 'printing'}
        className="w-full bg-primary text-primary-foreground rounded-lg p-3 font-medium disabled:opacity-60 cursor-pointer"
      >
        {status === 'connecting' ? 'Menghubungkan printer...' : status === 'printing' ? 'Mencetak...' : 'Cetak via Bluetooth'}
      </button>
      {status === 'error' && <p className="text-xs text-destructive mt-1">{errorMsg}</p>}
    </div>
  );
}