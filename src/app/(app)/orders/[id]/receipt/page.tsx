// coteadmin/src/app/(app)/orders/[id]/receipt/page.tsx
import { cotebek } from '@/lib/cotebek';
// import { PrintButton } from './PrintButton';
import { BlePrintButton } from './BlePrintButton';
import { ReceiptWaButton } from './ReceiptWaButton';
import { formatRupiah } from '@/lib/format';
import { headers } from 'next/headers';
import QRCode from 'qrcode';

export type ReceiptData = {
  business: { name: string; address: string | null; phone: string | null; footer: string };
  order: { orderNumber: string; trackingToken: string | null; paymentMethod: string; paymentStatus: 'PAID' | 'UNPAID'; createdAt: string; dueDate: string | null;
     handledByName: string | null; note: string | null; };
  customer: { name: string | null; phone: string | null };
  items: { itemName: string; qty: number; price: number; subtotal: number }[];
  summary: { subtotal: number; discountAmount: number; promoName: string | null; total: number };
};

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await cotebek<{ data: ReceiptData }>(`/orders/${id}/receipt`);
  const r = res.data;

  const h = await headers();
  const appUrl = `${h.get('x-forwarded-proto') ?? 'https'}://${h.get('host')}`;
  const trackUrl = r.order.trackingToken ? `${appUrl}/track/${r.order.trackingToken}` : null;
  const qrSvg = trackUrl
    ? await QRCode.toString(trackUrl, { type: 'svg', margin: 0, width: 110 })
    : null;

  return (
    <div className="p-4">
      <BlePrintButton data={r} />

      <ReceiptWaButton data={r} customerPhone={r.customer.phone} />

      <style>{`@page { size: 58mm auto; margin: 2mm; }`}</style>

      <div className="max-w-[320px] print:max-w-[200px] mx-auto font-mono text-[11px] print:text-[10px] bg-white p-4 border rounded-lg print:border-0 print:shadow-none print:p-0">
        <div className="text-center mb-3">
          <div className="font-bold text-sm">{r.business.name}</div>
          {r.business.address && <div>{r.business.address}</div>}
          {r.business.phone && <div>{r.business.phone}</div>}
        </div>

        <div className="border-t border-dashed border-black py-2 space-y-0.5">
          <div className="flex justify-between"><span>No. Order</span><span>{r.order.orderNumber}</span></div>
          {r.order.trackingToken && (
           <div className="flex justify-between"><span>Kode Lacak</span><span>{r.order.trackingToken}</span></div>
         )}
          <div className="flex justify-between"><span>Tanggal</span><span>{new Date(r.order.createdAt).toLocaleString('id-ID')}</span></div>
          {r.order.dueDate && (
            <div className="flex justify-between"><span>Estimasi Selesai</span><span>{new Date(r.order.dueDate).toLocaleString('id-ID')}</span></div>
          )}
          {r.customer.name && <div className="flex justify-between"><span>Customer</span><span>{r.customer.name}</span></div>}
        </div>

        <div className="border-t border-dashed border-black py-2 space-y-1">
          {r.items.map((item, i) => (
            <div key={i}>
              <div>{item.itemName}</div>
              <div className="flex justify-between text-gray-600">
                <span>{item.qty} x {formatRupiah(item.price)}</span>
                <span>{formatRupiah(item.subtotal)}</span>
              </div>
            </div>
          ))}
        </div>

        {r.order.note && (
          <div className="border-t border-dashed border-black py-2">
            <div className="flex justify-between"><span>Keterangan</span><span>{r.order.note}</span></div>
          </div>
        )}

        <div className="border-t border-dashed border-black py-2 space-y-0.5">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatRupiah(r.summary.subtotal)}</span></div>
          {r.summary.discountAmount > 0 && (
            <div className="flex justify-between">
              <span>Diskon{r.summary.promoName ? ` (${r.summary.promoName})` : ''}</span>
              <span>-{formatRupiah(r.summary.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold border-t border-black pt-1 mt-1">
            <span>Total</span><span>{formatRupiah(r.summary.total)}</span>
          </div>
          <div className="flex justify-between"><span>Bayar</span><span>{r.order.paymentMethod}</span></div>

          <div className="flex justify-between font-bold">
           <span>Status</span>
           <span>{r.order.paymentStatus === 'PAID' ? 'LUNAS' : 'BELUM LUNAS'}</span>
         </div>

         {r.order.handledByName && (
          <div className="flex justify-between"><span>Kasir</span><span>{r.order.handledByName}</span></div>
        )}
        </div>

        {qrSvg && (
          <div className="border-t border-dashed border-black py-3 flex flex-col items-center gap-1">
            <div dangerouslySetInnerHTML={{ __html: qrSvg }} />
            <span className="text-[9px] text-gray-500">Scan untuk status Order</span>
          </div>
        )}

        <div className="border-t border-dashed border-black pt-2 text-center">{r.business.footer}</div>
      </div>
    </div>
  );
}