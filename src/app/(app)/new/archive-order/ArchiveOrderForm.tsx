// coteadmin/src/app/(app)/new/archive-order/ArchiveOrderForm.tsx
'use client';

import { useState, useMemo } from 'react';
import { createOrder } from '../../orders/actions';
import { CustomerMatch } from '../orders/customer-actions';
import { CustomerPicker } from '../orders/CustomerPicker';
import { ItemCartPicker } from '@/components/ItemCartPicker';
import { PAYMENT_METHODS } from '@/lib/constants/payment';
import { STATUS_CONFIG } from '@/lib/constants/order-status';
import { formatRupiah } from '@/lib/format';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ShoppingCart, Banknote, UserCheck, CalendarClock } from 'lucide-react';

type Item = { id: string; name: string; price: number; cogs: number };
type CartLine = { itemId: string; itemName: string; qty: number; price: number; cogs: number };
type TeamMember = { id: string; name: string };

export function ArchiveOrderForm({ items, teamMembers }: { items: Item[]; teamMembers: TeamMember[] }) {
  const [cart, setCart] = useState<Record<string, CartLine>>({});
  const [manualMode, setManualMode] = useState(false);
  const [manualAmount, setManualAmount] = useState('');
  const [customer, setCustomer] = useState<CustomerMatch | null>(null);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [paymentStatus, setPaymentStatus] = useState<'PAID' | 'UNPAID'>('UNPAID');
  const [teamMemberId, setTeamMemberId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('');
  const [orderDate, setOrderDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [archiveStatus, setArchiveStatus] = useState('DONE');
  const [paidAtDate, setPaidAtDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function addItem(item: Item) {
    setCart((prev) => {
      const qty = (prev[item.id]?.qty ?? 0) + 1;
      return { ...prev, [item.id]: { itemId: item.id, itemName: item.name, qty, price: item.price, cogs: item.cogs } };
    });
  }
  function setQty(itemId: string, qty: number) {
    setCart((prev) => {
      const line = prev[itemId];
      if (!line) return prev;
      if (qty <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: { ...line, qty } };
    });
  }
  function removeItem(itemId: string) {
    setCart((prev) => {
      const { [itemId]: _, ...rest } = prev;
      return rest;
    });
  }

  const cartLines = Object.values(cart);
  const totalAmount = useMemo(() => {
    if (manualMode) return Number(manualAmount) || 0;
    return cartLines.reduce((sum, l) => sum + l.price * l.qty, 0);
  }, [cartLines, manualMode, manualAmount]);

  async function handleSubmit() {
    if (!manualMode && cartLines.length === 0) {
      setError('Pilih minimal 1 layanan, atau aktifkan mode input manual.');
      return;
    }
    if (manualMode && (!manualAmount || Number(manualAmount) <= 0)) {
      setError('Isi nominal order dulu.');
      return;
    }
    setError(null);
    setPending(true);

    const result = await createOrder({
      items: manualMode
        ? [{ itemName: 'Order Arsip (Item tanpa Keterangan)', qty: 1, price: totalAmount, cogs: 0, subtotal: totalAmount }]
        : cartLines.map((l) => ({ itemId: l.itemId, itemName: l.itemName, qty: l.qty, price: l.price, cogs: l.cogs, subtotal: l.price * l.qty })),
      paymentMethod,
      dueDate: dueDate || undefined,
      customerId: customer?.id,
      note: note.trim() || undefined,
      paymentStatus,
      teamMemberId: teamMemberId || undefined,
      orderDate,
      status: archiveStatus !== 'RECEIVED' ? archiveStatus : undefined,
      paidAt: paymentStatus === 'PAID' && paidAtDate ? paidAtDate : undefined,
    });

    setPending(false);
    if (result?.error) setError(result.error);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-dashed border-warning/40 bg-warning/5 p-3 space-y-3">
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-warning"><CalendarClock size={14} /> Tanggal Order</Label>
          <Input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} className="h-10 text-sm bg-background" />
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-warning/20 pt-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Status Akhir</Label>
            <select value={archiveStatus} onChange={(e) => setArchiveStatus(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {Object.entries(STATUS_CONFIG).map(([value, cfg]) => <option key={value} value={value}>{cfg.label}</option>)}
            </select>
          </div>
          {paymentStatus === 'PAID' && (
            <div className="space-y-1.5">
              <Label className="text-xs">Tanggal Bayar</Label>
              <Input type="date" value={paidAtDate} onChange={(e) => setPaidAtDate(e.target.value)} className="h-10 text-sm bg-background" />
              <p className="text-[10px] text-muted-foreground">Kosongkan kalau sama tanggal order.</p>
            </div>
          )}
        </div>

        <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer border-t border-warning/20 pt-3">
          <input type="checkbox" checked={manualMode} onChange={(e) => setManualMode(e.target.checked)} className="h-4 w-4 accent-warning" />
          Tanpa rincian item (input nominal manual)
        </label>
      </div>

      <CustomerPicker onSelect={setCustomer} />

      {manualMode ? (
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2"><ShoppingCart size={16}/> Nominal Order</Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground pointer-events-none">Rp</div>
            <Input type="number" min="0" value={manualAmount} onChange={(e) => setManualAmount(e.target.value)} className="pl-10 h-14 text-xl font-bold" placeholder="0" />
          </div>
        </div>
      ) : (
        <ItemCartPicker items={items} cart={cart} onAddItem={addItem} onSetQty={setQty} onRemoveItem={removeItem} />
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Metode Bayar</Label>
            <div className="relative">
              <Banknote size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm">
                {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Estimasi Selesai (Opsional)</Label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="h-10 text-sm" />
          </div>
        </div>

        {teamMembers.length > 0 && (
          <div className="space-y-1.5">
            <Label>Dilayani Oleh (Opsional)</Label>
            <div className="relative">
              <UserCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <select value={teamMemberId} onChange={(e) => setTeamMemberId(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm">
                <option value="">- Tanpa Keterangan -</option>
                {teamMembers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <Label>Status Pembayaran</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant={paymentStatus === 'PAID' ? 'default' : 'outline'} onClick={() => setPaymentStatus('PAID')} className={paymentStatus === 'PAID' ? 'bg-success hover:bg-success/90 text-success-foreground' : ''}>Sudah Lunas</Button>
            <Button type="button" variant={paymentStatus === 'UNPAID' ? 'default' : 'outline'} onClick={() => setPaymentStatus('UNPAID')} className={paymentStatus === 'UNPAID' ? 'bg-secondary hover:bg-secondary/90' : ''}>Belum Bayar</Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Catatan (Opsional)</Label>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="resize-none" />
        </div>
      </div>

      <div className="sticky bottom-20 -mx-4 mt-6 space-y-2 border-t border-border bg-background/95 backdrop-blur px-4 pt-3 pb-2 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <Card className="border-dashed shadow-sm bg-muted/10">
          <CardContent className="p-4 flex justify-between items-center">
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-bold text-primary">{formatRupiah(totalAmount)}</span>
          </CardContent>
        </Card>

        {error && <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive font-medium text-center">{error}</div>}

        <Button size="lg" onClick={handleSubmit} disabled={pending} className="w-full text-base font-bold shadow-md h-12">
          {pending ? <Loader2 size={20} className="animate-spin mr-2" /> : <ShoppingCart size={20} className="mr-2" />}
          {pending ? 'Menyimpan...' : 'Simpan Order Arsip'}
        </Button>
      </div>
    </div>
  );
}