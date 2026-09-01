// coteadmin/src/components/ConnectionIndicator.tsx
'use client';

import { useEffect, useState } from 'react';

export function ConnectionIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function checkHealth() {
      try {
        const res = await fetch('/api/health', { cache: 'no-store' });
        if (!cancelled) setIsOnline(res.ok);
      } catch {
        if (!cancelled) setIsOnline(false);
      }
    }

    function handleOnline() {
      checkHealth(); // pastiin beneran nyampe backend, bukan cuma device connect wifi
    }

    checkHealth();
    const interval = setInterval(checkHealth, 20000);
    window.addEventListener('offline', () => setIsOnline(false));
    window.addEventListener('online', handleOnline);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener('offline', () => setIsOnline(false));
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <div
      className="flex items-center px-1.5"
      title={isOnline ? 'Terhubung ke server' : 'Gak ada koneksi ke server'}
    >
      <span className="relative flex h-2.5 w-2.5">
        {isOnline && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50" />
        )}
        <span className={`relative h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-success' : 'bg-destructive'}`} />
      </span>
    </div>
  );
}