// coteadmin/src/components/track/notification-opt-in.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellRing, BellOff } from 'lucide-react';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from([...atob(base64)].map((c) => c.charCodeAt(0)));
}

type Status = 'idle' | 'unsupported' | 'subscribing' | 'subscribed' | 'denied' | 'error';

export function NotificationOptIn({ trackingToken }: { trackingToken: string }) {
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported');
      return;
    }
    navigator.serviceWorker.register('/sw.js').then(async (reg) => {
      const existing = await reg.pushManager.getSubscription();
      if (existing) setStatus('subscribed');
    });
  }, []);

  async function handleSubscribe() {
    setStatus('subscribing');
    try {
      const reg = await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setStatus('denied');
        return;
      }

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        ),
      });

      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingToken,
          subscription: subscription.toJSON(),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? `Subscribe failed (${res.status})`);
      }
      setStatus('subscribed');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  if (status === 'unsupported') return null;

  if (status === 'subscribed') {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-success/25 bg-success-subtle p-3 text-xs font-medium text-success">
        <BellRing size={16} />
        Notifikasi aktif — kamu akan diberi tahu saat status berubah.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full rounded-xl"
        onClick={handleSubscribe}
        disabled={status === 'subscribing'}
      >
        <Bell size={16} className="mr-2" />
        {status === 'subscribing' ? 'Mengaktifkan...' : 'Aktifkan Notifikasi'}
      </Button>

      {status === 'denied' && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <BellOff size={13} />
          Izin notifikasi ditolak. Ubah lewat pengaturan browser kalau berubah pikiran.
        </p>
      )}
      {status === 'error' && (
        <p className="text-xs text-destructive">Gagal mengaktifkan notifikasi, coba lagi ya.</p>
      )}
    </div>
  );
}