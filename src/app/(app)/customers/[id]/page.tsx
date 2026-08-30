// adminqinq/src/app/(app)/customers/[id]/page.tsx
import Link from 'next/link';
import { cotebek } from '@/lib/cotebek';
import { DeleteButton } from './DeleteButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, 
  Edit, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  StickyNote, 
  ReceiptText,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';

type OrderHistoryItem = { id: string; orderNumber: string; status: string; totalAmount: number };
type CustomerDetail = {
  id: string; name: string; phone: string; email: string | null;
  addressDetail: string | null; city: string | null; province: string | null;
  notes: string | null; orderHistory: OrderHistoryItem[];
};

// Kita samakan warnanya dengan halaman Order agar konsisten
const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  RECEIVED: { label: 'Diterima', color: 'bg-info/10 text-info border-info/20' },
  IN_PROCESS: { label: 'Diproses', color: 'bg-primary/10 text-primary border-primary/20' },
  READY: { label: 'Siap Diambil', color: 'bg-secondary/20 text-secondary-foreground border-secondary/30' },
  DONE: { label: 'Selesai', color: 'bg-success/10 text-success border-success/20' },
  CANCELLED: { label: 'Dibatalkan', color: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await cotebek<{ data: CustomerDetail }>(`/customers/${id}`);
  const c = res.data;

  const fullAddress = [c.addressDetail, c.city, c.province].filter(Boolean).join(', ');

  return (
    <div className="p-4 pb-24 space-y-6">
      
      {/* 1. TOP NAVIGATION */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link 
            href="/customers" 
            className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Kembali ke daftar pelanggan"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </Link>
          <h1 className="text-xl font-heading font-bold text-foreground tracking-tight">
            Profil Pelanggan
          </h1>
        </div>
        <Link 
          href={`/customers/${c.id}/edit`} 
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8 px-3 rounded-full")}
        >
          <Edit size={14} className="mr-1.5" aria-hidden="true" /> Edit
        </Link>
      </div>

      {/* 2. HERO PROFILE */}
      <div className="flex flex-col items-center text-center space-y-3 pt-2 pb-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary shadow-sm border border-primary/20" aria-hidden="true">
          <User size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">{c.name}</h2>
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground mt-1 text-sm font-medium">
            <Phone size={14} aria-hidden="true" /> 
            <span>{c.phone}</span>
          </div>
        </div>
      </div>

      {/* 3. DETAIL KONTAK & ALAMAT */}
      {(c.email || fullAddress || c.notes) && (
        <Card className="shadow-sm border-border">
          <CardContent className="p-4 space-y-4 text-sm">
            
            {(c.email || fullAddress) && (
              <dl className="space-y-3">
                {c.email && (
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-muted-foreground mt-0.5 shrink-0" aria-hidden="true" />
                    <div className="flex-1">
                      <dt className="sr-only">Email</dt>
                      <dd className="font-medium text-foreground">{c.email}</dd>
                    </div>
                  </div>
                )}
                {fullAddress && (
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-muted-foreground mt-0.5 shrink-0" aria-hidden="true" />
                    <div className="flex-1">
                      <dt className="text-xs text-muted-foreground mb-0.5 block">Alamat Pengiriman</dt>
                      <dd className="font-medium text-foreground leading-relaxed">{fullAddress}</dd>
                    </div>
                  </div>
                )}
              </dl>
            )}

            {c.notes && (
              <div className={cn(
                "p-3 rounded-lg text-sm",
                (c.email || fullAddress) ? "bg-warning/5 border border-warning/20" : ""
              )}>
                <div className="flex items-center gap-1.5 text-warning font-semibold text-xs uppercase tracking-wider mb-1">
                  <StickyNote size={14} aria-hidden="true" /> Catatan Khusus
                </div>
                <p className="text-foreground italic leading-relaxed">"{c.notes}"</p>
              </div>
            )}

          </CardContent>
        </Card>
      )}

      {/* 4. RIWAYAT ORDER */}
      <div className="space-y-3 pt-2">
        <h2 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground px-1">
          <ReceiptText size={16} aria-hidden="true" /> Riwayat Order ({c.orderHistory.length})
        </h2>

        {c.orderHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/30 rounded-xl border border-dashed border-border">
            <ShoppingBag className="text-muted-foreground opacity-30 mb-2" size={28} aria-hidden="true" />
            <p className="text-sm text-muted-foreground">Belum ada riwayat transaksi.</p>
          </div>
        ) : (
          <ul className="space-y-2" aria-label="Daftar riwayat order">
            {c.orderHistory.map((o) => {
              const statusVisual = STATUS_CONFIG[o.status] || { label: o.status, color: 'bg-muted text-muted-foreground border-border' };

              return (
                <li key={o.id}>
                  <Card className="relative group shadow-sm border-border hover:border-primary/40 hover:shadow-md transition-all duration-200">
                    <CardContent className="p-3.5 flex justify-between items-center gap-3">
                      
                      <div className="flex-1 min-w-0">
                        {/* Area Klik (Hitbox) merentang seluas Card */}
                        <Link 
                          href={`/orders/${o.id}`} 
                          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm before:absolute before:inset-0 text-sm font-bold text-foreground truncate block mb-1"
                        >
                          {o.orderNumber}
                        </Link>
                        
                        <div className="flex items-center gap-2 relative z-10 pointer-events-none">
                          <Badge variant="outline" className={cn("text-[10px] px-2 py-0 shadow-none font-medium", statusVisual.color)}>
                            {statusVisual.label}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 relative z-10 pointer-events-none">
                        <div className="text-right">
                          <div className="text-sm font-bold text-primary">
                            Rp{o.totalAmount.toLocaleString('id-ID')}
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all" aria-hidden="true" />
                      </div>

                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* 5. DANGER ZONE (HAPUS PELANGGAN) */}
      <div className="pt-8 mt-8 border-t border-dashed border-destructive/20">
        <DeleteButton customerId={c.id} hasOrders={c.orderHistory.length > 0} />
      </div>

    </div>
  );
}