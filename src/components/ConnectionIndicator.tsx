// coteadmin/src/components/ConnectionIndicator.tsx
'use client';

import { useSystemHealth } from '@/lib/hooks/useSystemHealth';

export function ConnectionIndicator() {
  const { status, internet, api, db } = useSystemHealth();
  const color = status === 'ok' ? 'bg-success' : status === 'degraded' ? 'bg-warning' : 'bg-destructive';
  const label = !internet ? 'Perangkat gak ada koneksi internet' : api === 'down' ? 'Server cotebek gak kejangkau' : db === 'down' ? 'Server nyala tapi database bermasalah' : 'Semua sistem normal';

  return (
    <div className="flex items-center px-1.5" title={label} aria-label={label}>
      <span className="relative flex h-2.5 w-2.5">
        {status === 'ok' && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50" />}
        <span className={`relative h-2.5 w-2.5 rounded-full ${color}`} />
      </span>
    </div>
  );
}