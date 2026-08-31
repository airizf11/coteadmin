// coteadmin/src/app/(app)/orders/[id]/page.tsx
import { cotebek } from '@/lib/cotebek';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, 
  ReceiptText, 
  UserCircle, 
  CalendarClock, 
  CreditCard,
  Printer
} from 'lucide-react';
import { OrderActionButtons } from './OrderActionButtons';
import { STATUS_CONFIG } from '@/lib/constants/order-status';
import { Money } from '@/components/Money';

type OrderItem = { id: string; itemName: string; qty: number; subtotal: number };
type OrderDetail = {
  id: string;
  orderNumber: string;
  trackingToken: string | null;
  status: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: string;
  items: OrderItem[];
  customerName: string | null;
  customerPhone: string | null;
  handledByName: string | null;
  teamMemberName: string | null;
  promoCode: string | null;
  dueDate: string | null;
  metadata: { note?: string } | null;
  createdAt: string;
  paymentStatus: 'PAID' | 'UNPAID';
};

type TrackingData = { statusHistory: { status: string | null; timestamp: string }[] };

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await cotebek<{ data: OrderDetail }>(`/orders/${id}`);
  const order = res.data;

  const trackRes = await cotebek<{ data: TrackingData }>(`/orders/track/${order.orderNumber}`);
  const statusHistory = trackRes.data.statusHistory;

  const statusVisual = STATUS_CONFIG[order.status] || { label: order.status, color: 'bg-muted text-muted-foreground' };

  return (
    <div className="p-4 pb-24 space-y-5">
      
      {/* 1. TOP NAVIGATION / HEADER */}
      <div className="flex items-center gap-3">
        <Link 
          href="/orders" 
          className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground tracking-tight">
            {order.orderNumber}
          </h1>
        </div>
      </div>

      {/* 2. STATUS ROW */}
      <div className="flex gap-2 items-center">
        <Badge variant="outline" className={cn("px-3 py-1 font-medium", statusVisual.color)}>
          {statusVisual.label}
        </Badge>
        {order.paymentStatus === 'PAID' ? (
          <Badge variant="outline" className="px-3 py-1 font-medium bg-success/10 text-success border-success/20">
            Lunas
          </Badge>
        ) : (
          <Badge variant="destructive" className="px-3 py-1 font-medium shadow-none">
            Belum Lunas
          </Badge>
        )}
      </div>

      {/* 3. INFO CUSTOMER & TANGGAL */}
      <Card className="shadow-sm">
        <CardContent className="p-4 space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <UserCircle className="text-muted-foreground shrink-0 mt-0.5" size={18} />
            <div className="flex-1 space-y-0.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pelanggan</span>
                <span className="font-medium text-right">{order.customerName ?? 'Walk-in'}</span>
              </div>
              {order.customerPhone && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">No. HP</span>
                  <span className="text-right">{order.customerPhone}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="h-px bg-border w-full" />

          <div className="flex items-start gap-3">
            <CalendarClock className="text-muted-foreground shrink-0 mt-0.5" size={18} />
            <div className="flex-1 space-y-0.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tgl Order</span>
                <span className="text-right">{new Date(order.createdAt).toLocaleDateString('id-ID')}</span>
              </div>
              {order.dueDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Selesai</span>
                  <span className="text-right font-medium text-primary">
                    {new Date(order.dueDate).toLocaleDateString('id-ID')}
                  </span>
                </div>
              )}

              {/* Tambahan Info Pegawai/Kasir */}
             {order.teamMemberName && (
               <div className="flex justify-between pt-1.5 mt-1.5 border-t border-border/40">
                 <span className="text-muted-foreground text-xs">Dilayani oleh</span>
                 <span className="text-right text-xs font-semibold">{order.teamMemberName}</span>
               </div>
             )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. ITEMS ORDER */}
      <Card className="shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <ReceiptText size={16} /> Rincian Item
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <ul className="space-y-2 mb-3">
            {order.items.map((i) => (
              <li key={i.id} className="flex justify-between text-sm">
                <span className="text-foreground">
                  {i.itemName} <span className="text-muted-foreground ml-1">x{i.qty}</span>
                </span>
                <span className="font-medium"><Money value={i.subtotal} /></span>
              </li>
            ))}
          </ul>
          
          {/* Garis Pemisah Bill */}
          <div className="border-t border-dashed border-border pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span><Money value={order.totalAmount} /></span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-success">
                <span>Diskon {order.promoCode && `(${order.promoCode})`}</span>
                <span>-<Money value={order.discountAmount} /></span>
              </div>
            )}
            
            <div className="flex justify-between items-center pt-2 mt-2 border-t border-border">
              <span className="font-semibold text-foreground">Total Tagihan</span>
              <span className="text-lg font-bold text-primary">
                <Money value={order.finalAmount} />
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. INFO PEMBAYARAN & CATATAN */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="shadow-sm bg-muted/30 border-dashed">
          <CardContent className="p-3 flex flex-col justify-center items-center text-center gap-1">
            <CreditCard size={18} className="text-muted-foreground mb-1" />
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              Metode Bayar
            </div>
            <div className="text-sm font-medium text-foreground">
              {order.paymentMethod}
            </div>
          </CardContent>
        </Card>

        {order.metadata?.note ? (
          <Card className="shadow-sm bg-warning/10 border-warning/30">
            <CardContent className="p-3">
              <div className="text-[10px] text-warning uppercase tracking-wider font-semibold mb-1">
                Catatan
              </div>
              <div className="text-xs text-foreground leading-relaxed italic">
                "{order.metadata.note}"
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-sm bg-muted/30 border-dashed">
            <CardContent className="p-3 flex flex-col justify-center items-center text-center h-full">
              <div className="text-xs text-muted-foreground opacity-70">
                Tidak ada catatan
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 6. ACTION BUTTONS AREA */}
      <div className="space-y-3 pt-4 border-t border-border">
        
        {/* Panggil komponen Gabungan kita di sini! */}
        <OrderActionButtons 
          orderId={order.id}
          currentStatus={order.status}
          paymentStatus={order.paymentStatus}
          defaultPaymentMethod={order.paymentMethod}
          customerName={order.customerName}
          customerPhone={order.customerPhone}
          orderNumber={order.orderNumber}
          trackingToken={order.trackingToken}
          createdAt={order.createdAt}
          statusHistory={statusHistory}
        />

        {/* Tombol Cetak Struk */}
        <Link 
          href={`/orders/${order.id}/receipt`} 
          className={cn(
            buttonVariants({ variant: "outline", className: "w-full flex items-center justify-center gap-2 h-11" })
          )}
        >
          <Printer size={18} className="text-muted-foreground" />
          Lihat / Cetak Struk
        </Link>
      </div>

    </div>
  );
}