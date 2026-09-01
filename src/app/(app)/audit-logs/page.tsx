// coteadmin/src/app/(app)/audit-logs/page.tsx
import { cotebek } from '@/lib/cotebek';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  ShieldCheck, 
  User, 
  Cpu, 
  Clock, 
  Database, 
  Fingerprint, 
  ChevronDown,
  Activity
} from 'lucide-react';

type AuditLog = {
  id: string;
  actorType: 'HUMAN' | 'SYSTEM';
  userName: string | null;
  userEmail: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
};

export default async function AuditLogsPage() {
  const res = await cotebek<{ data: AuditLog[] }>('/audit-logs?limit=50');
  const logs = res.data;

  return (
    <div className="p-4 pb-24 space-y-6">
      
      {/* 1. HEADER */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-primary tracking-tight flex items-center gap-2">
          <ShieldCheck size={24} /> Audit Log
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Rekaman 50 aktivitas terakhir di sistem.</p>
      </div>

      {/* 2. EMPTY STATE */}
      {logs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-2xl border border-dashed border-border mt-4">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Activity className="text-muted-foreground opacity-50" size={32} aria-hidden="true" />
          </div>
          <p className="text-foreground font-medium">Belum ada aktivitas</p>
          <p className="text-sm text-muted-foreground mt-1">Sistem belum mencatat log apapun.</p>
        </div>
      )}

      {/* 3. LIST LOGS */}
      <ul className="space-y-3" aria-label="Riwayat Aktivitas Sistem">
        {logs.map((log) => {
          const isHuman = log.actorType === 'HUMAN';
          
          return (
            <li key={log.id}>
              <Card className="shadow-sm border-border hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-3.5">
                  
                  {/* --- Header: Action & Actor --- */}
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <div className="font-bold text-sm text-foreground uppercase tracking-tight break-all">
                      {log.action}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 shrink-0 flex items-center gap-1 shadow-none border-0",
                        isHuman ? "bg-info/10 text-info" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isHuman ? <User size={12} /> : <Cpu size={12} />}
                      {isHuman ? 'MANUSIA' : 'SISTEM'}
                    </Badge>
                  </div>

                  {/* --- Entity & ID --- */}
                  <div className="flex items-center gap-2 text-xs mb-3">
                    <Database size={14} className="text-muted-foreground shrink-0" />
                    <span className="font-medium text-foreground bg-muted px-1.5 py-0.5 rounded-md">
                      {log.entity}
                    </span>
                    {log.entityId && (
                      <span className="text-muted-foreground font-mono">
                        #{log.entityId.slice(0, 8)}...
                      </span>
                    )}
                  </div>

                  {/* --- Footer Metadata --- */}
                  <div className="flex flex-col gap-1.5 text-[11px] text-muted-foreground border-t border-dashed border-border pt-3">
                    <div className="flex items-center gap-1.5">
                      <User size={12} className="shrink-0" /> 
                      <span className="font-medium truncate">
                        {isHuman ? (log.userName ?? log.userEmail ?? 'Pengguna tidak diketahui') : 'Panggilan Sistem (API Key)'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="shrink-0" />
                        {new Date(log.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })} WIB
                      </div>
                      {log.ipAddress && (
                        <div className="flex items-center gap-1.5 bg-muted/50 px-1.5 py-0.5 rounded text-[10px] font-mono">
                          <Fingerprint size={10} className="shrink-0" /> {log.ipAddress}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* --- JSON Viewer (Detail Perubahan) --- */}
                  {(log.before || log.after) && (
                    <details className="mt-3 group">
                      <summary className="text-[11px] font-semibold text-primary cursor-pointer flex items-center gap-1 hover:underline select-none bg-primary/5 w-max px-2 py-1 rounded-md transition-colors">
                        Lihat Detail Perubahan <ChevronDown size={12} className="group-open:rotate-180 transition-transform" />
                      </summary>
                      
                      {/* Grid responsif: 1 kolom di HP, 2 kolom di tablet/desktop */}
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {log.before && (
                          <div className="space-y-1">
                            <div className="text-[10px] font-bold text-destructive uppercase tracking-wider flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" /> Sebelum
                            </div>
                            <pre className="text-[10px] bg-slate-950 text-slate-300 p-2.5 rounded-lg overflow-auto max-h-48 font-mono border border-slate-800 custom-scrollbar">
                              {JSON.stringify(log.before, null, 2)}
                            </pre>
                          </div>
                        )}
                        
                        {log.after && (
                          <div className="space-y-1">
                            <div className="text-[10px] font-bold text-success uppercase tracking-wider flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Sesudah
                            </div>
                            <pre className="text-[10px] bg-slate-950 text-slate-300 p-2.5 rounded-lg overflow-auto max-h-48 font-mono border border-slate-800 custom-scrollbar">
                              {JSON.stringify(log.after, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </details>
                  )}

                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}