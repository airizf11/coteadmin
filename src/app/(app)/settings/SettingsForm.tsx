// coteadmin/src/app/(app)/settings/SettingsForm.tsx
'use client';

import { useState } from 'react';
import { saveSettings } from './actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Store, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Hash, 
  ReceiptText, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Palette,
  Clock,
  ListChecks
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type Settings = { 
  order_prefix?: string; 
  tx_prefix?: string;
  business_name?: string;
  business_address?: string;
  business_phone?: string;
  receipt_footer?: string;
  business_type?: string;
  primary_color?: string;
  website_url?: string;
  dashboard_window_days?: string;
  order_flow?: string[];
};

export function SettingsForm({ settings }: { settings: Settings }) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  // State untuk Real-time Preview Penomoran
  const [orderPrefix, setOrderPrefix] = useState(settings.order_prefix ?? 'ORD');
  const [txPrefix, setTxPrefix] = useState(settings.tx_prefix ?? 'TRX');

  const [businessName, setBusinessName] = useState(settings.business_name ?? '');
  const [businessType, setBusinessType] = useState(settings.business_type ?? 'JASA');
  const [businessPhone, setBusinessPhone] = useState(settings.business_phone ?? '');
  const [businessAddress, setBusinessAddress] = useState(settings.business_address ?? '');

  const [websiteUrl, setWebsiteUrl] = useState(settings.website_url ?? '');
  const [receiptFooter, setReceiptFooter] = useState(settings.receipt_footer ?? '');

  const [primaryColor, setPrimaryColor] = useState(settings.primary_color ?? '#f0a500');
  const [dashboardWindowDays, setDashboardWindowDays] = useState(settings.dashboard_window_days ?? '7');
  const [orderFlow, setOrderFlow] = useState<string[]>(
    Array.isArray(settings.order_flow) ? settings.order_flow : ['IN_PROCESS', 'READY'],
  );

  function togglePhase(phase: string) {
    setOrderFlow((prev) => (prev.includes(phase) ? prev.filter((p) => p !== phase) : [...prev, phase]));
  }

  // Menghasilkan string tanggal hari ini untuk preview (Contoh: 20260711)
  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    setSaved(false);
    const result = await saveSettings(formData);
    setPending(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setSaved(true);
      // Sembunyikan pesan sukses setelah 3 detik
      setTimeout(() => setSaved(false), 3000);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      
      {/* 1. KARTU PROFIL TOKO & STRUK */}
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-4 border-b border-border/50">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Store size={18} className="text-primary" /> Profil Toko & Struk
          </CardTitle>
          <CardDescription className="text-xs">
            Informasi ini akan tercetak pada nota pelanggan Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-1.5">
              Nama Usaha
            </Label>
            <Input 
              name="business_name" 
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="h-11 bg-background font-medium" 
              placeholder="cth: Toko Berkah Jaya" 
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-1.5">
              <Phone size={14} className="text-muted-foreground" /> No. Telepon / WhatsApp
            </Label>
            <Input 
              name="business_phone" 
              value={businessPhone}
              onChange={(e) => setBusinessPhone(e.target.value)}
              className="h-11 bg-background" 
              placeholder="cth: 081234567890" 
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-1.5">
              <MapPin size={14} className="text-muted-foreground" /> Alamat Lengkap
            </Label>
            {/* Menggunakan textarea standar Tailwind agar alamat panjang bisa muat */}
            <textarea 
              name="business_address" 
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] resize-none"
              placeholder="cth: Jl. Sudirman No. 123, Surabaya"
            />
          </div>

          <div className="space-y-2">
        <Label htmlFor="website_url" className="text-sm font-semibold">Website (Opsional)</Label>
        <Input
          id="website_url"
          name="website_url"
          type="url"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="https://usahamu.com"
        />
        <p className="text-xs text-muted-foreground">Kalau diisi, muncul tombol "Kunjungi Halaman Utama" di halaman awal.</p>
      </div>

          <div className="space-y-2 pt-2 border-t border-dashed border-border">
            <Label className="text-sm font-semibold flex items-center gap-1.5">
              <MessageSquare size={14} className="text-muted-foreground" /> Pesan Penutup (Footer Struk)
            </Label>
            <Textarea
              name="receipt_footer" 
              value={receiptFooter}
              onChange={(e) => setReceiptFooter(e.target.value)}
              className="h-11 bg-background" 
              placeholder="cth: Terima kasih telah mencuci di tempat kami!" 
            />
          </div>

        </CardContent>
      </Card>

      {/* Branding Card */}
      <Card className="shadow-sm border-border">
  <CardHeader className="pb-4 border-b border-border/50">
    <CardTitle className="text-base font-bold flex items-center gap-2">
      <Palette size={18} className="text-primary" /> Tampilan Aplikasi
    </CardTitle>
    <CardDescription className="text-xs">
      Menentukan menu navigasi & warna utama aplikasi.
    </CardDescription>
  </CardHeader>
  <CardContent className="p-4 space-y-4">
    <div className="space-y-2">
      <Label className="text-sm font-semibold">Jenis Usaha</Label>
      <input type="hidden" name="business_type" value={businessType} />
      <Select value={businessType} onValueChange={(v) => setBusinessType(v ?? 'JASA')}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="JASA">Jasa (laundry, cukur, dll)</SelectItem>
          <SelectItem value="FNB">Makanan & Minuman</SelectItem>
          <SelectItem value="RETAIL">Retail / Toko</SelectItem>
          <SelectItem value="PERSONAL">Pribadi (arisan, kas bersama)</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">Menentukan menu apa yang muncul di navigasi bawah.</p>
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-semibold">Warna Utama</Label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          name="primary_color"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
          className="h-10 w-14 rounded-md border border-border cursor-pointer bg-transparent"
        />
        <span className="text-sm text-muted-foreground font-mono">{primaryColor}</span>
      </div>
    </div>
    
  </CardContent>
</Card>

<Card className="shadow-sm border-border">
       <CardHeader className="pb-4 border-b border-border/50">
         <CardTitle className="text-base font-bold flex items-center gap-2">
           <Clock size={18} className="text-primary" /> Dashboard Staf
         </CardTitle>
         <CardDescription className="text-xs">
           Rentang hari yang ditampilkan di dashboard untuk akun Staf.
         </CardDescription>
       </CardHeader>
       <CardContent className="p-4 space-y-2">
         <Label className="text-sm font-semibold">Tampilkan Order (hari terakhir)</Label>
         <Input
           name="dashboard_window_days"
           type="number"
           min={1}
           max={90}
           value={dashboardWindowDays}
           onChange={(e) => setDashboardWindowDays(e.target.value)}
           className="h-11 bg-background"
           placeholder="7"
         />
         <p className="text-xs text-muted-foreground">
           Staf hanya melihat order dalam rentang hari ini di dashboard mereka. Pemilik/Admin tetap melihat data sejak awal.
         </p>
       </CardContent>
     </Card>

     <Card className="shadow-sm border-border">
  <CardHeader className="pb-4 border-b border-border/50">
    <CardTitle className="text-base font-bold flex items-center gap-2">
      <ListChecks size={18} className="text-primary" /> Alur Status Order
    </CardTitle>
    <CardDescription className="text-xs">
      Pilih fase yang dipakai usahamu. Diterima & Selesai selalu ada.
    </CardDescription>
  </CardHeader>
  <CardContent className="p-4 space-y-3">
    <input type="hidden" name="order_flow" value={JSON.stringify(orderFlow)} />
    <label className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-muted/40 transition-colors">
      <input type="checkbox" checked={orderFlow.includes('IN_PROCESS')} onChange={() => togglePhase('IN_PROCESS')} className="h-4 w-4 accent-primary" />
      <div>
        <div className="text-sm font-medium">Diproses</div>
        <div className="text-xs text-muted-foreground">Order butuh waktu pengerjaan (laundry, servis, dll).</div>
      </div>
    </label>
    <label className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-muted/40 transition-colors">
      <input type="checkbox" checked={orderFlow.includes('READY')} onChange={() => togglePhase('READY')} className="h-4 w-4 accent-primary" />
      <div>
        <div className="text-sm font-medium">Siap Diambil</div>
        <div className="text-xs text-muted-foreground">Ada jeda antara "selesai dikerjakan" dan "diambil".</div>
      </div>
    </label>
    <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md mt-1">
      Alur sekarang: <span className="font-semibold text-foreground">
        Diterima{orderFlow.includes('IN_PROCESS') ? ' → Diproses' : ''}{orderFlow.includes('READY') ? ' → Siap Diambil' : ''} → Selesai
      </span>
    </div>
  </CardContent>
</Card>

      {/* 2. KARTU FORMAT PENOMORAN */}
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-4 border-b border-border/50">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Hash size={18} className="text-primary" /> Format Penomoran Sistem
          </CardTitle>
          <CardDescription className="text-xs">
            Atur kode awalan untuk nota pesanan dan bukti transaksi kas.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-5">
          
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-1.5">
              <ReceiptText size={14} className="text-muted-foreground" /> Prefix Nomor Order
            </Label>
            <Input
              name="order_prefix"
              value={orderPrefix}
              onChange={(e) => setOrderPrefix(e.target.value.toUpperCase())}
              maxLength={10}
              className="h-11 bg-background uppercase font-bold tracking-widest"
              placeholder="ORD"
            />
            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md font-mono mt-1">
              Pratinjau: <span className="font-bold text-foreground">{orderPrefix || 'ORD'}-{todayStr}-0001</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-1.5">
              <ReceiptText size={14} className="text-muted-foreground" /> Prefix Transaksi Kas
            </Label>
            <Input
              name="tx_prefix"
              value={txPrefix}
              onChange={(e) => setTxPrefix(e.target.value.toUpperCase())}
              maxLength={10}
              className="h-11 bg-background uppercase font-bold tracking-widest"
              placeholder="TRX"
            />
            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md font-mono mt-1">
              Pratinjau: <span className="font-bold text-foreground">{txPrefix || 'TRX'}-{todayStr}-0001</span>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* 3. NOTIFIKASI & TOMBOL SUBMIT */}
      <div className="space-y-3">
        {error && (
          <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm font-medium animate-in slide-in-from-bottom-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
        
        {saved && !error && (
          <div className="flex items-start gap-2 p-3 bg-success/10 border border-success/20 text-success rounded-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <p>Pengaturan berhasil disimpan!</p>
          </div>
        )}

        <Button 
          type="submit" 
          disabled={pending} 
          className="w-full h-12 text-base font-bold shadow-md cursor-pointer"
        >
          {pending ? (
            <Loader2 size={18} className="animate-spin mr-2" />
          ) : (
            <Save size={18} className="mr-2" />
          )}
          {pending ? 'Menyimpan Perubahan...' : 'Simpan Pengaturan'}
        </Button>
      </div>

    </form>
  );
}