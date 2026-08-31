// coteadmin/src/app/(app)/orders/page.tsx
import Link from 'next/link';
import { cotebek } from '@/lib/cotebek';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Plus, ChevronRight, ReceiptText, SlidersHorizontal, User, CalendarClock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STATUS_CONFIG } from '@/lib/constants/order-status';
import { OrderFilterBar } from './OrderFilterBar';
import { formatDate } from '@/lib/date-range';
import { Money } from '@/components/Money';

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  finalAmount: number;
  paymentStatus: 'PAID' | 'UNPAID';
  customerName: string | null;
  dueDate: string | null;
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; paymentStatus?: string; startDate?: string; endDate?: string }>;
}) {
  const params = await searchParams;

  const queryParts: string[] = [];
  if (params.status) queryParts.push(`status=${params.status}`);
  if (params.paymentStatus) queryParts.push(`paymentStatus=${params.paymentStatus}`);

  if (params.startDate) queryParts.push(`startDate=${params.startDate}`);
  if (params.endDate) queryParts.push(`endDate=${params.endDate}`);

  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

  const res = await cotebek<{ data: Order[] }>(`/orders${queryString}`);
  const orders = res.data;

  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary tracking-tight">Daftar Order</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola semua transaksi usaha.</p>
        </div>
        <Link 
          href="/new/orders" 
          className={cn(
            buttonVariants({ size: "sm" }), 
            "rounded-full shadow-md shrink-0 flex items-center gap-1 whitespace-nowrap"
          )}
        >
          <Plus size={16} /> Order Baru
        </Link>
      </div>

      <OrderFilterBar currentStatus={params.status} currentPaymentStatus={params.paymentStatus} />

      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/30 rounded-2xl border border-dashed border-border">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 shadow-sm">
            <ReceiptText className="text-muted-foreground opacity-50" size={32} />
          </div>
          <p className="text-foreground font-medium">
            {params.status || params.paymentStatus ? 'Tidak ada order dengan filter ini' : 'Belum ada orderan'}
          </p>
          <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">
            {params.status || params.paymentStatus
              ? 'Coba ubah atau hapus filter.'
              : 'Orderan baru yang diinput akan muncul di daftar ini.'}
          </p>
        </div>
      )}

      <div className="grid gap-3">
        {orders.map((o) => {
          const statusVisual = STATUS_CONFIG[o.status] || { 
            label: o.status, 
            color: 'bg-gray-100 text-gray-700 border-gray-200', 
            icon: ReceiptText 
          };
          const StatusIcon = statusVisual.icon;

          return (
            <Link 
              key={o.id} 
              href={`/orders/${o.id}`} 
              className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
            >
              <Card className="shadow-sm border-border group-hover:border-primary/40 group-hover:shadow-md transition-all duration-200">
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-foreground tracking-wide">
                        {o.orderNumber}
                      </div>
                      {(o.customerName || o.dueDate) && (
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          {o.customerName && (
                            <span className="flex items-center gap-1">
                              <User size={12} /> {o.customerName}
                            </span>
                          )}
                          {o.dueDate && (
                            <span className="flex items-center gap-1">
                              <CalendarClock size={12} /> {formatDate(o.dueDate)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {o.paymentStatus === 'UNPAID' ? (
                      <Badge variant="destructive" className="text-[10px] px-2 py-0.5 rounded-full shadow-none font-medium">
                        Belum Lunas
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full text-success border-success/20 bg-success/10">
                        Lunas
                      </Badge>
                    )}
                  </div>

                  <div className="flex justify-between items-end mt-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-xs px-2.5 py-1 rounded-md border flex items-center gap-1.5 font-medium transition-colors ${statusVisual.color}`}>
                        <StatusIcon size={14} />
                        {statusVisual.label}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-0.5">Total Biaya</div>
                        <div className="font-bold text-primary">
                          <Money value={o.finalAmount} />
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-muted-foreground opacity-50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}