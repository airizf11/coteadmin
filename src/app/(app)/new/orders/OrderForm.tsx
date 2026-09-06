// coteadmin/src/app/(app)/new/orders/OrderForm.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { createOrder } from '../../orders/actions';
import { CustomerMatch } from './customer-actions';
import { CustomerPicker } from './CustomerPicker';
import { ItemCartPicker } from '@/components/ItemCartPicker';
import { checkPromo, PromoCheckResult } from './promo-actions';
import { PAYMENT_METHODS } from '@/lib/constants/payment';
import { formatRupiah } from '@/lib/format';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Circle, Loader2, ShoppingCart, Banknote, UserCheck } from 'lucide-react';

type Item = { id: string; name: string; price: number; cogs: number };
type CartLine = { itemId: string; itemName: string; qty: number; price: number; cogs: number };
type PromoOption = { id: string; name: string; code: string; type: 'PERCENTAGE' | 'NOMINAL'; value: number };
type TeamMember = { id: string; name: string };

const DRAFT_KEY = 'draft:new-order';

export function OrderForm({ items, promos, teamMembers }: { items: Item[]; promos: PromoOption[]; teamMembers: TeamMember[] }) {
  const [cart, setCart] = useState<Record<string, CartLine>>({});
  const [customer, setCustomer] = useState<CustomerMatch | null>(null);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [paymentStatus, setPaymentStatus] = useState<'PAID' | 'UNPAID'>('UNPAID');
  const [teamMemberId, setTeamMemberId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [hasHydratedDraft, setHasHydratedDraft] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);

  const [selectedPromoId, setSelectedPromoId] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCheckResult | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoChecking, setPromoChecking] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft.cart && Object.keys(draft.cart).length > 0) {
          setCart(draft.cart);
          setDraftRestored(true);
        }
        if (draft.customer) setCustomer(draft.customer);
        if (draft.paymentMethod) setPaymentMethod(draft.paymentMethod);
        if (draft.paymentStatus) setPaymentStatus(draft.paymentStatus);
        if (draft.teamMemberId) setTeamMemberId(draft.teamMemberId);
        if (draft.dueDate) setDueDate(draft.dueDate);
        if (draft.note) setNote(draft.note);
        if (draft.selectedPromoId) setSelectedPromoId(draft.selectedPromoId);
      }
    } catch {}
    setHasHydratedDraft(true);
  }, []);

  useEffect(() => {
    if (!hasHydratedDraft) return;
    const timer = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        cart, customer, paymentMethod, paymentStatus, teamMemberId, dueDate, note, selectedPromoId,
      }));
    }, 500);
    return () => clearTimeout(timer);
  }, [hasHydratedDraft, cart, customer, paymentMethod, paymentStatus, teamMemberId, dueDate, note, selectedPromoId]);

  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
    setDraftRestored(false);
  }

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
  const totalAmount = useMemo(() => cartLines.reduce((sum, l) => sum + l.price * l.qty, 0), [cartLines]);

  useEffect(() => {
    if (!selectedPromoId) {
      setAppliedPromo(null);
      return;
    }
    const promo = promos.find((p) => p.id === selectedPromoId);
    if (!promo) return;

    let cancelled = false;
    setPromoChecking(true);
    setPromoError(null);

    const timer = setTimeout(() => {
      checkPromo(promo.code, totalAmount, customer?.id).then((result) => {
        if (cancelled) return;
        setPromoChecking(false);
        if (result.error) {
          setPromoError(result.error);
          setAppliedPromo(null);
        } else if (result.promo) {
          setAppliedPromo(result.promo);
        }
      });
    }, 400);

    return () => { cancelled = true; clearTimeout(timer); };
  }, [selectedPromoId, totalAmount, customer?.id, promos]);

  const finalAmount = appliedPromo ? appliedPromo.finalAmount : totalAmount;

  async function handleSubmit() {
    if (cartLines.length === 0) {
      setError('Pilih minimal 1 layanan dulu.');
      return;
    }
    setError(null);
    setPending(true);
    localStorage.removeItem(DRAFT_KEY);

    const selectedPromo = promos.find((p) => p.id === selectedPromoId);

    const result = await createOrder({
      items: cartLines.map((l) => ({
        itemId: l.itemId, itemName: l.itemName, qty: l.qty, price: l.price, cogs: l.cogs, subtotal: l.price * l.qty,
      })),
      paymentMethod,
      dueDate: dueDate || undefined,
      customerId: customer?.id,
      promoCode: appliedPromo && selectedPromo ? selectedPromo.code : undefined,
      note: note.trim() || undefined,
      paymentStatus,
      teamMemberId: teamMemberId || undefined,
    });

    setPending(false);
    if (result?.error) setError(result.error);
  }

  return (
    <div className="space-y-6">
      {draftRestored && (
        <div className="flex items-center justify-between gap-2 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
          <span>Draft order sebelumnya dipulihkan.</span>
          <button type="button" onClick={clearDraft} className="text-destructive font-medium hover:underline cursor-pointer">Hapus draft</button>
        </div>
      )}

      <CustomerPicker onSelect={setCustomer} />

      <ItemCartPicker items={items} cart={cart} onAddItem={addItem} onSetQty={setQty} onRemoveItem={removeItem} />

      <div className="space-y-4">
        {cartLines.length > 0 && promos.length > 0 && (
          <div className="space-y-1.5">
            <Label>Promo (Opsional)</Label>
            <select value={selectedPromoId} onChange={(e) => setSelectedPromoId(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option value="">Tanpa promo</option>
              {promos.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.type === 'PERCENTAGE' ? `${p.value}%` : formatRupiah(p.value)})</option>
              ))}
            </select>
            {promoChecking && <p className="text-xs text-muted-foreground flex items-center gap-1"><Loader2 size={12} className="animate-spin"/> Mengecek promo...</p>}
            {promoError && <p className="text-xs text-destructive">{promoError}</p>}
            {appliedPromo && !promoChecking && <p className="text-xs text-success font-medium">✨ Asik! Hemat {formatRupiah(appliedPromo.discountAmount)}</p>}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Metode Bayar</Label>
            <div className="relative">
              <Banknote size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Estimasi Selesai</Label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="h-10 text-sm" />
          </div>
        </div>

        {teamMembers.length > 0 && (
          <div className="space-y-1.5">
            <Label>Dilayani Oleh (Opsional)</Label>
            <div className="relative">
              <UserCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <select value={teamMemberId} onChange={(e) => setTeamMemberId(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="">- Tanpa Keterangan -</option>
                {teamMembers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <Label>Status Pembayaran</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant={paymentStatus === 'PAID' ? 'default' : 'outline'} onClick={() => setPaymentStatus('PAID')} className={paymentStatus === 'PAID' ? 'bg-success hover:bg-success/90 text-success-foreground text-white shadow-sm' : ''}>
              {paymentStatus === 'PAID' ? <CheckCircle2 size={16} className="mr-2"/> : <Circle size={16} className="mr-2 text-muted-foreground"/>} Sudah Lunas
            </Button>
            <Button type="button" variant={paymentStatus === 'UNPAID' ? 'default' : 'outline'} onClick={() => setPaymentStatus('UNPAID')} className={paymentStatus === 'UNPAID' ? 'bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-sm' : ''}>
              {paymentStatus === 'UNPAID' ? <CheckCircle2 size={16} className="mr-2"/> : <Circle size={16} className="mr-2 text-muted-foreground"/>} Belum Bayar
            </Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Catatan (Opsional)</Label>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Contoh: Pewangi lavender, jangan disetrika..." className="resize-none" />
        </div>
      </div>

      <div className="sticky bottom-20 -mx-4 mt-6 space-y-2 border-t border-border bg-background/95 backdrop-blur px-4 pt-3 pb-2 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
       <Card className="border-dashed shadow-sm bg-muted/10">
         <CardContent className="p-4 space-y-2">
           <div className="flex justify-between text-sm">
             <span className="text-muted-foreground">Subtotal</span>
             <span className="font-medium">{formatRupiah(totalAmount)}</span>
           </div>
           {appliedPromo && (
             <div className="flex justify-between text-sm text-success">
               <span>Diskon</span>
               <span className="font-medium">-{formatRupiah(appliedPromo.discountAmount)}</span>
             </div>
           )}
           <div className="flex justify-between items-center pt-2 mt-2 border-t border-border">
             <span className="font-semibold">Total Tagihan</span>
             <span className="text-2xl font-bold text-primary">{formatRupiah(finalAmount)}</span>
           </div>
         </CardContent>
       </Card>

       {error && <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive font-medium text-center">{error}</div>}

       <Button size="lg" onClick={handleSubmit} disabled={pending || cartLines.length === 0} className="w-full text-base font-bold shadow-md h-12">
         {pending ? <Loader2 size={20} className="animate-spin mr-2" /> : <ShoppingCart size={20} className="mr-2" />}
         {pending ? 'Memproses Order...' : 'Buat Order Sekarang'}
       </Button>
     </div>
    </div>
  );
}