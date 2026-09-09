// coteadmin/src/app/(app)/assets/new/AssetForm.tsx
'use client';

import { useState } from 'react';
import { createAsset } from '../actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Save, Tag, CalendarDays, Clock, PiggyBank } from 'lucide-react';

export function AssetForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await createAsset(formData);
    setPending(false);
    if (result?.error) setError(result.error);
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <Card className="shadow-sm border-border">
        <CardContent className="p-4 space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-1.5"><Tag size={14} /> Nama Aset</Label>
            <Input name="name" required className="h-11" placeholder="cth: Mesin Cuci Front Loading 10kg" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Harga Beli (Total)</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground pointer-events-none">Rp</div>
              <Input name="purchaseCost" type="number" min="0" required className="pl-10 h-12 text-lg font-bold" placeholder="0" />
            </div>
            <p className="text-[11px] text-muted-foreground">Kalau dibayar bertahap (DP+pelunasan), jumlahin totalnya di sini.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-1.5"><CalendarDays size={14} /> Tanggal Beli</Label>
              <Input name="purchaseDate" type="date" required className="h-11" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-1.5"><Clock size={14} /> Umur Pakai (bulan)</Label>
              <Input name="usefulLifeMonths" type="number" min="1" required className="h-11" placeholder="cth: 36" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-1.5"><PiggyBank size={14} /> Nilai Sisa (Opsional)</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 font-medium text-muted-foreground pointer-events-none text-sm">Rp</div>
              <Input name="salvageValue" type="number" min="0" className="pl-9 h-11" placeholder="0" />
            </div>
            <p className="text-[11px] text-muted-foreground">Perkiraan nilai jual aset ini pas udah abis umur pakainya. Kosongkan kalau dianggap 0.</p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive font-medium text-center">{error}</div>
      )}

      <Button type="submit" disabled={pending} className="w-full h-12 text-base font-bold shadow-md">
        {pending ? <Loader2 size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
        {pending ? 'Menyimpan...' : 'Simpan Aset'}
      </Button>
    </form>
  );
}