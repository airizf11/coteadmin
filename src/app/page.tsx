// coteadmin/src/app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Package, Search, ShieldCheck } from 'lucide-react';
import { getBranding } from '@/lib/branding';

export default async function HomePage() {
  const b = await getBranding();

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" aria-hidden="true" />
      <main className="w-full max-w-sm flex flex-col items-center text-center space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full shadow-inner border border-primary/20 mb-2">
            <Package size={48} className="text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-heading font-extrabold text-primary tracking-tight">
              {b.businessName}
            </h1>
            <p className="text-base text-muted-foreground font-medium leading-relaxed max-w-[280px] mx-auto">
              Layanan cepat, transparan, dan gampang dipantau langsung dari HP.
            </p>
          </div>
        </div>

        <div className="w-full space-y-4 flex flex-col items-center">
          <Link href="/track" className="w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl block">
            <Button size="lg" className="w-full h-14 text-base font-bold shadow-lg hover:shadow-xl transition-all active:scale-[0.98] cursor-pointer">
              <Search size={20} className="mr-2" aria-hidden="true" />
              Lacak Status Pesanan
            </Button>
          </Link>

          {b.websiteUrl && (
            <>
              <div className="flex items-center gap-3 w-full max-w-[200px] opacity-60">
                <div className="h-px bg-muted-foreground flex-1" />
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Atau</span>
                <div className="h-px bg-muted-foreground flex-1" />
              </div>
              <Link href={b.websiteUrl} className="w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl block">
                <Button variant="outline" size="lg" className="w-full h-12 text-sm font-semibold border-primary/20 hover:bg-primary/5 text-primary cursor-pointer">
                  <ShieldCheck size={18} className="mr-2" aria-hidden="true" />
                  Kunjungi Halaman Utama
                </Button>
              </Link>
            </>
          )}
        </div>
      </main>

      <div className="absolute bottom-6 text-center text-xs text-muted-foreground/60 font-medium">
        &copy; {new Date().getFullYear()} {b.businessName}.
      </div>
    </div>
  );
}