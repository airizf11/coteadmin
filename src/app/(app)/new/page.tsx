// coteadmin/src/app/(app)/new/page.tsx
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ClipboardList, Wallet, UserPlus, Package, Paperclip, ChevronRight, Archive, ShieldAlert, Wrench } from 'lucide-react';

const NEW_GROUPS = [
  {
    title: 'Transaksi Harian',
    items: [
      { href: '/new/orders', label: 'Order Baru', description: 'Catat transaksi pesanan masuk pelanggan', icon: ClipboardList, ready: true },
      { href: '/new/tx', label: 'Transaksi Kas Baru', description: 'Catat pemasukan atau pengeluaran kas', icon: Wallet, ready: true },
    ],
  },
  {
    title: 'Data Master',
    items: [
      { href: '/customers/new', label: 'Pelanggan Baru', description: 'Tambah kontak pelanggan baru', icon: UserPlus, ready: true },
      { href: '/items/new', label: 'Item / Layanan Baru', description: 'Tambah produk atau jasa ke katalog', icon: Package, ready: true },
    ],
  },
  {
    title: 'Dokumen',
    items: [
      { href: '/new/upload', label: 'Upload File', description: 'Unggah berkas atau dokumen kelengkapan', icon: Paperclip, ready: true },
    ],
  },
  {
    title: 'Khusus Admin / Owner',
    items: [
      { href: '/new/archive-order', label: 'Order Arsip (Backdate)', description: 'Input data transaksi lampau / migrasi', icon: Archive, ready: true },
      { href: '/assets/new', label: 'Catat Aset Baru', description: 'Tambah aset/alat usaha untuk penyusutan', icon: Wrench, ready: true },
    ],
  },
];

export default function NewHubPage() {
  return (
    <div className="p-4 pb-24 space-y-6">
      
      {/* HEADER */}
      <div className="mb-2">
        <h1 className="text-2xl font-heading font-bold text-primary tracking-tight">Input Baru</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Pilih jenis pencatatan yang ingin kamu buat.</p>
      </div>

      {/* MENU GROUPS */}
      <div className="space-y-5">
        {NEW_GROUPS.map((group) => (
          <div key={group.title} className="space-y-2">
            
            {/* Judul Grup */}
            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1 flex items-center gap-1.5">
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
                        <span className="font-medium text-sm text-muted-foreground flex-1">{label}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded-md">
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