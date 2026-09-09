// coteadmin/src/app/(app)/more/page.tsx
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { 
  Package, 
  Receipt, 
  Tag, 
  BarChart3, 
  UserCircle, 
  Settings, 
  ClipboardList, 
  Users, 
  ChevronRight, 
  Paperclip, 
  HelpCircle, 
  Info,
  ShieldCheck,
  Boxes,
  BookOpen,
  Wrench
} from 'lucide-react';

const MENU_GROUPS = [
  {
    title: 'Operasional',
    items: [
      { href: '/orders', label: 'Pesanan / Order', description: 'Daftar & status riwayat pesanan pelanggan', icon: ClipboardList, ready: true },
      { href: '/items', label: 'Item & Layanan', description: 'Katalog produk, paket, dan tarif jasa', icon: Package, ready: true },
      { href: '/raw-materials', label: 'Bahan / Barang Beli', description: 'Stok bahan baku & belanja operasional', icon: Boxes, ready: true },
      { href: '/customers', label: 'Pelanggan', description: 'Database kontak & riwayat pelanggan', icon: Users, ready: true },
      { href: '/promos', label: 'Promo & Diskon', description: 'Kode voucher & program diskon khusus', icon: Tag, ready: true },
      { href: '/attachments', label: 'Lampiran & Berkas', description: 'Manajemen file & bukti berkas terunggah', icon: Paperclip, ready: true },
    ]
  },
  {
    title: 'Keuangan & Data',
    items: [
      { href: '/transactions', label: 'Transaksi Kas', description: 'Pencatatan arus kas masuk & keluar', icon: Receipt, ready: true },
      { href: '/assets', label: 'Aset & Penyusutan', description: 'Alat, mesin, dan penyusutan nilai aset usaha', icon: Wrench, ready: true },
      { href: '/reports', label: 'Laporan Keuangan', description: 'Ringkasan omzet, laba rugi & performa', icon: BarChart3, ready: true },
      { href: '/audit-logs', label: 'Log Audit', description: 'Rekam jejak riwayat aktivitas sistem', icon: ShieldCheck, ready: true },
    ]
  },
  {
    title: 'Pengaturan & Akun',
    items: [
      { href: '/teams', label: 'Anggota Tim', description: 'Kelola akun staf & hak akses tim', icon: Users, ready: true },
      { href: '/settings', label: 'Pengaturan Sistem', description: 'Profil usaha, nota struk & preferensi', icon: Settings, ready: true },
      { href: '/profile', label: 'Profil Saya', description: 'Detail informasi & keamanan akun kamu', icon: UserCircle, ready: true },
    ]
  },
  {
    title: 'Lainnya',
    items: [
      { href: '/help', label: 'Bantuan', description: 'Panduan penggunaan & pusat bantuan', icon: HelpCircle, ready: true },
      { href: '/about', label: 'Tentang', description: 'Informasi versi aplikasi & sistem', icon: Info, ready: true },
      { href: '/tutorials', label: 'Tutorial', description: 'Panduan lengkap cara penggunaan aplikasi dan sistem', icon: BookOpen, ready: false },
    ]
  }
];

export default function MorePage() {
  return (
    <div className="p-4 pb-24 space-y-6">
      
      {/* HEADER */}
      <div className="mb-2">
        <h1 className="text-2xl font-heading font-bold text-primary tracking-tight">Menu Lainnya</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Kelola seluruh aspek operasional usahamu.</p>
      </div>

      {/* MENU GROUPS */}
      <div className="space-y-5">
        {MENU_GROUPS.map((group) => (
          <div key={group.title} className="space-y-2">
            
            {/* Judul Grup */}
            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">
              {group.title}
            </h2>
            
            {/* Kartu Menu */}
            <Card className="shadow-sm border-border overflow-hidden">
              <ul className="divide-y divide-border">
                {group.items.map(({ href, label, description, icon: Icon, ready }) => (
                  <li key={href}>
                    {ready ? (
                      <Link 
                        href={href} 
                        className="flex items-center gap-3 p-3.5 bg-background hover:bg-muted/50 active:bg-muted transition-colors group focus-visible:outline-none focus-visible:bg-muted/50"
                      >
                        <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0 group-hover:scale-105 transition-transform" aria-hidden="true">
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-sm text-foreground block">{label}</span>
                          <span className="text-xs text-muted-foreground block truncate">{description}</span>
                        </div>
                        <ChevronRight size={18} className="text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" aria-hidden="true" />
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 p-3.5 bg-background/50 opacity-60 cursor-not-allowed select-none">
                        <div className="p-2 bg-muted text-muted-foreground rounded-lg shrink-0" aria-hidden="true">
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-sm text-muted-foreground block">{label}</span>
                          <span className="text-xs text-muted-foreground/70 block truncate">{description}</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded-md shrink-0">
                          Segera
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </Card>

          </div>
        ))}
      </div>

    </div>
  );
}