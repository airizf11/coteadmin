// coteadmin/src/app/(app)/orders/[id]/OrderActionButtons.tsx
'use client';

import { useState } from 'react';
import { markOrderPaid, updateOrderStatus } from './actions';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  MessageCircle, 
  Banknote, 
  Loader2, 
  CheckSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { buildOrderUpdateMessage } from '@/lib/wa-templates';
import { STATUS_CONFIG, buildTransitions// , TRANSITIONS
} from '@/lib/constants/order-status';
import { PAYMENT_METHODS } from '@/lib/constants/payment';
import { waLink } from '@/lib/whatsapp';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// --- DATA & CONFIG ---
// --- MAIN COMPONENT ---
type OrderActionButtonsProps = {
  orderId: string;
  currentStatus: string;
  paymentStatus: 'PAID' | 'UNPAID';
  defaultPaymentMethod: string;
  customerName: string | null;
  customerPhone: string | null;
  orderNumber: string;
  trackingToken: string | null;
  createdAt: string;
  statusHistory: { status: string | null; timestamp: string }[];
  enabledPhases: string[];
};

export function OrderActionButtons(props: OrderActionButtonsProps) {
  const [payMethod, setPayMethod] = useState(props.defaultPaymentMethod || PAYMENT_METHODS[0]);
  const [isPaying, setIsPaying] = useState(false);
  const [showPayForm, setShowPayForm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null);

  // 1. Handler Mark Paid
  async function handleMarkPaid() {
    setIsPaying(true);
    const result = await markOrderPaid(props.orderId, payMethod);
    setIsPaying(false);
    
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Order berhasil ditandai lunas!');
      setShowPayForm(false);
    }
  }

  // 2. Handler Change Status
  async function handleUpdateStatus(status: string) {
    setPendingStatus(status);
    const result = await updateOrderStatus(props.orderId, status);
    setPendingStatus(null);
    
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(`Status diubah ke ${STATUS_CONFIG[status]?.label ?? status}`);
    }
  }

  // 3. Generate WA Message
  const steps = [
    { label: STATUS_CONFIG.RECEIVED.label, timestamp: props.createdAt },
    ...props.statusHistory
      .filter((h) => h.status && h.status !== 'RECEIVED')
      .map((h) => ({ label: STATUS_CONFIG[h.status!]?.label ?? h.status!, timestamp: h.timestamp })),
  ];
  
  const timelineText = steps
    .map((s) => `✓ ${s.label} - ${new Date(s.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}`)
    .join('\n');

  function handleSendWa() {
    if (!props.customerPhone) return;
    const message = buildOrderUpdateMessage({
      customerName: props.customerName,
      orderNumber: props.orderNumber,
      trackingToken: props.trackingToken,
      currentStatus: props.currentStatus,
      paymentStatus: props.paymentStatus,
      timelineText,
      appUrl: window.location.origin,
    });
    window.open(waLink(props.customerPhone, message), '_blank', 'noopener,noreferrer');
  }

  // V1
  // const statusOptions = TRANSITIONS[props.currentStatus] ?? [];

  // V2
  const statusOptions = buildTransitions(props.enabledPhases)[props.currentStatus] ?? [];

  return (
    <div className="space-y-3">
      
      {/* --- FORM MARK PAID --- */}
      {props.paymentStatus === 'UNPAID' && props.currentStatus !== 'CANCELLED' && (
        !showPayForm ? (
          <Button 
            variant="secondary" 
            className="w-full h-11 text-base shadow-sm cursor-pointer" 
            onClick={() => setShowPayForm(true)}
          >
            <Banknote size={18} className="mr-2" />
            Tandai Lunas
          </Button>
        ) : (
          <Card className="border-secondary/50 shadow-md">
            <CardContent className="p-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Pilih Metode Bayar
                </label>
                <select 
                  value={payMethod} 
                  onChange={(e) => setPayMethod(e.target.value)} 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowPayForm(false)} disabled={isPaying}>
                  Batal
                </Button>
                <Button className="flex-1" onClick={handleMarkPaid} disabled={isPaying}>
                  {isPaying ? <Loader2 size={16} className="animate-spin mr-1" /> : <CheckSquare size={16} className="mr-1" />}
                  {isPaying ? 'Menyimpan...' : 'Konfirmasi'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      )}

      {/* --- STATUS ACTIONS --- */}
      {statusOptions.length > 0 && (
        <div className="grid gap-2">
          {statusOptions.map((opt) => {
  const Icon = opt.icon;
  const isThisPending = pendingStatus === opt.status;
  return (
    <Button
      key={opt.status}
      variant={opt.danger ? "destructive" : "default"}
      // Kita pastikan semua rata kiri dengan 'justify-start'
      className="w-full h-11 shadow-sm cursor-pointer" 
      disabled={pendingStatus !== null}
      onClick={() => (opt.danger ? setConfirmTarget(opt.status) : handleUpdateStatus(opt.status))}
    >
      {isThisPending ? (
        <Loader2 size={18} className="animate-spin mr-2 opacity-70" />
      ) : (
        <Icon size={18} className="mr-2 opacity-70" />
      )}
      {isThisPending ? 'Memproses...' : opt.label}
    </Button>
  );
})}
        </div>
      )}

      {/* --- WHATSAPP BUTTON --- */}
      {props.customerPhone && (
  <button
    onClick={handleSendWa}
    className={cn(
      buttonVariants({ variant: "default" }),
      "w-full h-11 bg-success hover:bg-success/90 text-success-foreground shadow-sm cursor-pointer"
    )}
  >
    <MessageCircle size={18} className="mr-2" />
    Kirim Update via WhatsApp
  </button>
)}

      {/* Teks Bantuan jika Order sudah final */}
      {statusOptions.length === 0 && (
        <p className="text-xs text-center text-muted-foreground pt-2 pb-1 italic">
          Order ini telah {STATUS_CONFIG[props.currentStatus]?.label?.toLowerCase()} dan difinalisasi.
        </p>
      )}

      <Dialog open={!!confirmTarget} onOpenChange={(open) => !open && setConfirmTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Batalkan Order?</DialogTitle>
            <DialogDescription>
              Order <strong>{props.orderNumber}</strong> akan dibatalkan
              {props.paymentStatus === 'PAID'
                ? ', dan pembayaran yang udah masuk otomatis dicatat sebagai penyesuaian (adjustment) di kas'
                : ''}
              . Tindakan ini gak bisa dibatalkan lagi.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmTarget(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={pendingStatus !== null}
              onClick={() => {
                if (confirmTarget) handleUpdateStatus(confirmTarget);
                setConfirmTarget(null);
              }}
            >
              {pendingStatus !== null && <Loader2 size={16} className="animate-spin mr-2" />}
              Ya, Batalkan Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}