// coteadmin/src/components/SystemHealthCard.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSystemHealth } from '@/lib/hooks/useSystemHealth';
import { SignalHigh, SignalLow, SignalZero, Wifi, Server, Database, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SystemHealthCard() {
  const { status, internet, api, db, lastChecked } = useSystemHealth();
  const [open, setOpen] = useState(false);

  const config = {
    ok: { label: 'Semua Sistem Normal', icon: SignalHigh, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' },
    degraded: { label: 'Sebagian Bermasalah', icon: SignalLow, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
    down: { label: 'Gak Terhubung', icon: SignalZero, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20' },
  }[status];
  const Icon = config.icon;

  return (
    <Card className={cn('shadow-sm transition-all', config.border)}>
      <CardContent className="p-0">
        <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-3 p-4 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl', config.bg, config.color)}>
              <Icon size={18} />
            </div>
            <div className="text-left">
              <div className={cn('text-sm font-semibold', config.color)}>{config.label}</div>
              {lastChecked && <div className="text-[10px] text-muted-foreground">Dicek {lastChecked.toLocaleTimeString('id-ID')}</div>}
            </div>
          </div>
          {open ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
        </button>

        {open && (
          <div className="border-t border-border/60 px-4 py-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-muted-foreground"><Wifi size={13} /> Internet</span>
              <span className={internet ? 'text-success font-medium' : 'text-destructive font-medium'}>{internet ? 'Terhubung' : 'Terputus'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-muted-foreground"><Server size={13} /> Server</span>
              <span className={api === 'ok' ? 'text-success font-medium' : 'text-destructive font-medium'}>{api === 'ok' ? 'Normal' : 'Bermasalah'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-muted-foreground"><Database size={13} /> Database</span>
              <span className={db === 'ok' ? 'text-success font-medium' : db === 'down' ? 'text-destructive font-medium' : 'text-muted-foreground'}>{db === 'ok' ? 'Normal' : db === 'down' ? 'Bermasalah' : 'Gak diketahui'}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}