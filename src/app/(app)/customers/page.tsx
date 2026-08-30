// coteadmin/src/app/(app)/customers/page.tsx
import Link from 'next/link';
import { cotebek } from '@/lib/cotebek';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  MessageCircle, 
  ChevronRight, 
  UserPlus, 
  Users, 
  MapPin, 
  Phone, 
  User, 
  UserRound
} from 'lucide-react';

type Customer = {
  id: string;
  name: string;
  phone: string;
  city: string | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null };

function waLink(phone: string) {
  const digits = phone.replace(/\D/g, '');
  const normalized = digits.startsWith('0') ? '62' + digits.slice(1) : digits;
  return `https://wa.me/${normalized}`;
}

function genderStyle(gender: Customer['gender']) {
   if (gender === 'MALE') {
     return { icon: User, bg: 'bg-info/10', text: 'text-info', border: 'border-l-info/40' };
   }
   if (gender === 'FEMALE') {
     return { icon: UserRound, bg: 'bg-chart-5/10', text: 'text-chart-5', border: 'border-l-chart-5/40' };
   }
   return { icon: User, bg: 'bg-primary/10', text: 'text-primary', border: 'border-l-border' };
 }

export default async function CustomersPage() {
  const res = await cotebek<{ data: Customer[] }>('/customers');
  const customers = res.data;

  return (
    <div className="p-4 pb-24 space-y-6">
      
      {/* 1. HEADER & TOMBOL TAMBAH */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary tracking-tight">Pelanggan</h1>
          <p className="text-sm text-muted-foreground mt-1">Daftar kontak pelanggan.</p>
        </div>
        <Link 
          href="/customers/new" 
          className={cn(
            buttonVariants({ size: "sm" }), 
            "rounded-full shadow-md shrink-0 flex items-center gap-1 whitespace-nowrap"
          )}
        >
          <UserPlus size={16} aria-hidden="true" /> Tambah
        </Link>
      </div>

      {/* 2. EMPTY STATE */}
      {customers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/30 rounded-2xl border border-dashed border-border mt-4">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Users className="text-muted-foreground opacity-50" size={32} aria-hidden="true" />
          </div>
          <p className="text-foreground font-medium">Belum ada data pelanggan</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-[250px]">
            Data pelanggan akan otomatis tersimpan saat Anda membuat order baru.
          </p>
        </div>
      )}

      {/* 3. LIST PELANGGAN */}
      <ul className="grid gap-3" aria-label="Daftar Pelanggan">
        {customers.map((c) => (
          <li key={c.id}>
            <Card className={cn(
             "relative group overflow-hidden border-border hover:border-primary/40 shadow-sm hover:shadow-md transition-all duration-200 border-l-4",
             genderStyle(c.gender).border,
           )}>
              
              {/* LINK DETAIL PELANGGAN (Hitbox merentang ke seluruh Card) */}
              <Link 
                href={`/customers/${c.id}`} 
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl before:absolute before:inset-0 z-0"
                aria-label={`Lihat detail pelanggan ${c.name}`}
              >
                <span className="sr-only">Lihat detail pelanggan {c.name}</span>
              </Link>

              <CardContent className="p-3 flex items-center gap-3">
                
                {/* AVATAR PLACEHOLDER */}
                {(() => {
                 const style = genderStyle(c.gender);
                 const Icon = style.icon;
                 return (
                   <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0", style.bg, style.text)} aria-hidden="true">
                     <Icon size={20} />
                   </div>
                 );
               })()}

                {/* INFO TEXT */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-foreground text-sm truncate">
                    {c.name}
                  </div>
                  
                  <div className="flex flex-col mt-0.5 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                      <Phone size={12} className="shrink-0" aria-hidden="true" />
                      <span className="sr-only">Nomor telepon: </span>
                      {c.phone ?? <span className="italic opacity-70">Tanpa No. HP</span>}
                    </div>
                    {c.city && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                        <MapPin size={12} className="shrink-0" aria-hidden="true" />
                        <span className="sr-only">Kota: </span>
                        {c.city}
                      </div>
                    )}
                  </div>
                </div>

                {/* ACTION BUTTONS (Z-10 agar bisa diklik mandiri) */}
                <div className="flex items-center gap-1 shrink-0 relative z-10">
                  {c.phone && (
                    <a 
                      href={waLink(c.phone)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "w-9 h-9 rounded-full text-success hover:text-success/90 hover:bg-success/10 active:scale-95"
                      )}
                      aria-label={`Chat WhatsApp dengan ${c.name}`}
                      title="Chat WhatsApp"
                    >
                      <MessageCircle size={18} />
                    </a>
                  )}
                  <div className="w-8 h-8 flex items-center justify-center text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all pointer-events-none" aria-hidden="true">
                    <ChevronRight size={18} />
                  </div>
                </div>

              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

    </div>
  );
}