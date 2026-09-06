// coteadmin/src/app/(app)/new/page.tsx
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ClipboardList, Wallet, UserPlus, Package, Paperclip, ChevronRight, Archive } from 'lucide-react';

const NEW_ITEMS = [
  { href: '/new/orders', label: 'Order Baru', icon: ClipboardList, ready: true },
  { href: '/new/tx', label: 'Transaksi Baru', icon: Wallet, ready: true },
  { href: '/customers/new', label: 'Pelanggan Baru', icon: UserPlus, ready: true },
  { href: '/items/new', label: 'Item Baru', icon: Package, ready: true },
  { href: '/new/upload', label: 'Upload File', icon: Paperclip, ready: true },
  { href: '/new/archive-order', label: 'Order Arsip', icon: Archive, ready: true },
];

export default function NewHubPage() {
  return (
    <div className="p-4 pb-24">
      <div className="mb-4">
        <h1 className="text-2xl font-heading font-bold text-primary tracking-tight">Input Baru</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Pilih yang mau kamu catat.</p>
      </div>

      <Card className="shadow-sm border-border overflow-hidden">
        <ul className="divide-y divide-border">
          {NEW_ITEMS.map(({ href, label, icon: Icon, ready }) => (
            <li key={href}>
              {ready ? (
                <Link
                  href={href}
                  className="flex items-center gap-3 p-3.5 bg-background hover:bg-muted/50 active:bg-muted transition-colors group focus-visible:outline-none focus-visible:bg-muted/50"
                >
                  <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0 group-hover:scale-105 transition-transform" aria-hidden="true">
                    <Icon size={18} />
                  </div>
                  <span className="font-semibold text-sm text-foreground flex-1">{label}</span>
                  <ChevronRight size={18} className="text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
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
  );
}