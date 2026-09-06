// coteadmin/src/app/(app)/new/tx/NewTxForm.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { createTransaction } from '../../transactions/actions';
import { PAYMENT_METHODS } from '@/lib/constants/payment';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingDown, TrendingUp, Wallet, Tags, AlignLeft, Loader2, Save, CalendarClock, Receipt, CheckCircle2, CalendarDays, X, Users } from 'lucide-react';

const CATEGORIES = [
  { value: 'EXPENSE', label: 'Pengeluaran (Gaji, Opex, dll)' },
  { value: 'FUND_IN', label: 'Modal Masuk' },
  { value: 'FUND_OUT', label: 'Modal Keluar' },
  { value: 'OTHER', label: 'Lainnya' },
];

const DRAFT_KEY = 'draft:new-tx';
const DRAFT_FIELDS = [
  'amount', 'category', 'paymentMethod', 'fee',
  'transactionDate', 'paymentStatus', 'dueDate', 'description', 'teamMemberId',
];

type TeamMember = { id: string; name: string };

export function NewTransactionForm({ teamMembers }: { teamMembers: TeamMember[] }) {
  const [type, setType] = useState<'IN' | 'OUT'>('OUT');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [hasHydratedDraft, setHasHydratedDraft] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function saveDraft() {
    if (!formRef.current) return;
    const data = new FormData(formRef.current);
    const draft: Record<string, string> = { type };
    for (const field of DRAFT_FIELDS) {
      const value = data.get(field);
      if (typeof value === 'string') draft[field] = value;
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }

  function scheduleSaveDraft() {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(saveDraft, 500);
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw && formRef.current) {
        const draft = JSON.parse(raw);
        let restoredSomething = false;
        for (const field of DRAFT_FIELDS) {
          const el = formRef.current.elements.namedItem(field) as
            | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
          if (el && draft[field]) {
            el.value = draft[field];
            restoredSomething = true;
          }
        }
        if (draft.type === 'IN' || draft.type === 'OUT') setType(draft.type);
        if (restoredSomething) setDraftRestored(true);
      }
    } catch {}
    setHasHydratedDraft(true);
  }, []);

  useEffect(() => {
    if (!hasHydratedDraft) return;
    saveDraft();
  }, [type, hasHydratedDraft]);

  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
    setDraftRestored(false);
  }

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    localStorage.removeItem(DRAFT_KEY);
    const result = await createTransaction(formData);
    setPending(false);
    if (result?.error) setError(result.error);
  }

  return (
    <>
      {draftRestored && (
        <div className="flex items-center justify-between gap-2 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-3 py-2 text-xs text-muted-foreground mb-4">
          <span>Draft transaksi sebelumnya dipulihkan.</span>
          <button type="button" onClick={clearDraft} className="flex items-center gap-1 text-destructive font-medium hover:underline cursor-pointer">
            <X size={12} /> Hapus draft
          </button>
        </div>
      )}

      <form ref={formRef} action={handleSubmit} onChange={() => { if (hasHydratedDraft) scheduleSaveDraft(); }} className="space-y-5">
        <Card className="shadow-sm border-border">
          <CardContent className="p-4 space-y-5">
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Jenis Arus Kas</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant={type === 'OUT' ? 'default' : 'outline'} onClick={() => setType('OUT')} className={type === 'OUT' ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-sm h-11' : 'h-11 cursor-pointer'}>
                  <TrendingDown size={18} className="mr-2" /> Uang Keluar
                </Button>
                <Button type="button" variant={type === 'IN' ? 'default' : 'outline'} onClick={() => setType('IN')} className={type === 'IN' ? 'bg-success hover:bg-success/90 text-success-foreground shadow-sm h-11' : 'h-11 cursor-pointer'}>
                  <TrendingUp size={18} className="mr-2" /> Uang Masuk
                </Button>
              </div>
              <input type="hidden" name="type" value={type} />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Jumlah Nominal</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground pointer-events-none">Rp</div>
                <Input name="amount" type="number" min="0" required className="pl-10 h-14 text-xl font-bold bg-background focus-visible:ring-primary/50" placeholder="0" />
              </div>
            </div>

            <div className="h-px w-full bg-border" aria-hidden="true" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-1.5"><Tags size={14} /> Kategori</Label>
                <select name="category" required className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-1.5"><Wallet size={14} /> Metode Bayar</Label>
                <select name="paymentMethod" className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            {teamMembers.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-1.5"><Users size={14} /> Terkait Anggota Tim (Opsional)</Label>
                <select name="teamMemberId" className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="">- Tanpa Keterangan -</option>
                  {teamMembers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <p className="text-[11px] text-muted-foreground leading-tight">Cth: bayar gaji/uang saku ke anggota tim tertentu.</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-1.5"><Receipt size={14} /> Fee / Biaya Admin (Opsional)</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 font-medium text-muted-foreground pointer-events-none text-sm">Rp</div>
                  <Input name="fee" type="number" min="0" className="pl-9 h-11 bg-background" placeholder="0" />
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">Nominal di atas yang terpotong biaya admin (misal MDR QRIS).</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-1.5"><CalendarClock size={14} /> Tanggal & Jam (Opsional)</Label>
                <Input name="transactionDate" type="datetime-local" className="h-11 bg-background" />
                <p className="text-[11px] text-muted-foreground leading-tight">Kosongkan jika ini adalah transaksi saat ini.</p>
              </div>
            </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label className="text-sm font-semibold flex items-center gap-1.5"><CheckCircle2 size={14} /> Status Bayar</Label>
               <select name="paymentStatus" defaultValue="PAID" className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                 <option value="PAID">Sudah Lunas</option>
                 <option value="UNPAID">Belum Lunas (Utang)</option>
               </select>
             </div>

             <div className="space-y-2">
               <Label className="text-sm font-semibold flex items-center gap-1.5"><CalendarDays size={14} /> Jatuh Tempo (Opsional)</Label>
               <Input name="dueDate" type="date" className="h-11 bg-background" />
               <p className="text-[11px] text-muted-foreground leading-tight">Batas waktu bayar (jika status belum lunas).</p>
             </div>
           </div>

            <div className="space-y-2 border-t border-dashed border-border pt-4">
              <Label className="text-sm font-semibold flex items-center gap-1.5"><AlignLeft size={14} /> Keterangan Catatan</Label>
              <Input name="description" className="h-11 bg-background" placeholder="Contoh: Beli deterjen cair 5L atau Bayar Tagihan Listrik" />
            </div>

          </CardContent>
        </Card>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive font-medium text-center">{error}</div>
        )}

        <Button type="submit" disabled={pending} className="w-full h-12 text-base font-bold shadow-md cursor-pointer">
          {pending ? <Loader2 size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
          {pending ? 'Menyimpan Transaksi...' : 'Simpan Transaksi'}
        </Button>
      </form>
    </>
  );
}