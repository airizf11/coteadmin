// coteadmin/src/app/(app)/new/orders/page.tsx
import { cotebek } from '@/lib/cotebek';
import { OrderForm } from './OrderForm';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, PackageX, Plus } from 'lucide-react';

type Item = { id: string; name: string; price: number; cogs: number };
type Promo = { id: string; name: string; code: string | null; isActive: boolean; type: 'PERCENTAGE' | 'NOMINAL'; value: number };
type TeamMember = { id: string; name: string }; // Tambahan tipe pekerja

export default async function NewOrderPage() {
  // Tambahkan teamRes ke dalam Promise.all agar fetch-nya paralel (cepat)
  const [itemsRes, promosRes, teamRes, membership] = await Promise.all([
    cotebek<{ data: Item[] }>('/items'),
    cotebek<{ data: Promo[] }>('/promos'),
    cotebek<{ data: TeamMember[] }>('/team-members'),
    cotebek<{ data: { isMember: boolean; role: string | null } }>('/auth/membership'),
  ]);

  // Promo tanpa kode gak bisa dipakai lewat mekanisme checkout sekarang, jadi disaring
  const activePromos = promosRes.data.filter(
    (p): p is Promo & { code: string } => p.isActive && !!p.code,
  );

  const canBackdate = membership.data.role === 'OWNER' || membership.data.role === 'ADMIN' || membership.data.role === 'DEV';

  return (
    <div className="p-4 pb-24 space-y-5">
      
      {/* HEADER DENGAN TOMBOL BACK */}
      <div className="flex items-center gap-3">
        <Link 
          href="/orders" 
          className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Kembali ke daftar order"
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground tracking-tight">
            Order Baru
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Catat transaksi usaha kamu.</p>
        </div>
      </div>

      {/* RENDER EMPTY STATE ATAU FORM ORDER */}
      {itemsRes.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/30 rounded-2xl border border-dashed border-border mt-6">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 shadow-sm">
            <PackageX className="text-muted-foreground opacity-50" size={32} aria-hidden="true" />
          </div>
          <h2 className="text-foreground font-medium">Belum ada layanan/item</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-[250px] mb-6">
            Kamu harus menambahkan setidaknya satu layanan/item (misal Cuci Kiloan, Nasi Goreng) sebelum bisa membuat order.
          </p>
          <Link 
            href="/items" 
            className={cn(buttonVariants({ variant: "default" }), "shadow-sm")}
          >
            <Plus size={16} className="mr-1" aria-hidden="true" />
            Kelola Item Sekarang
          </Link>
        </div>
      ) : (
        <div className="mt-2">
          {/* Form sekarang menerima tambahan props teamMembers */}
          <OrderForm 
              items={itemsRes.data}
              promos={activePromos}
              teamMembers={teamRes.data}
              canBackdate={canBackdate}
          />
        </div>
      )}
      
    </div>
  );
}