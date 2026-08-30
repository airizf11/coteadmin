// coteadmin/src/app/(app)/layout.tsx
import Link from 'next/link';
import { Store, Zap } from 'lucide-react';
import { getBranding, NAV_PRESETS } from '@/lib/branding';
import { cotebek } from '@/lib/cotebek';
import { NoAccessScreen } from './NoAccessScreen';
import { ThemeToggle } from '@/components/ThemeToggle';

// export const dynamic = 'force-dynamic';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const b = await getBranding();
  const nav = NAV_PRESETS[b.businessType];

  const membership = await cotebek<{ data: { isMember: boolean; role: string | null } }>('/auth/membership');
  if (!membership.data.isMember) {
    return <NoAccessScreen businessName={b.businessName} phone={b.phone} />;
  }
  return (
    <div className="min-h-screen pb-20 bg-background text-foreground flex flex-col">
      {/* HEADER ATAS (Sticky) 
        Adopsi dari index.html biar nama brand kelihatan profesional
      */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Store size={18} />
            </div>
            <span className="font-heading font-bold text-xl text-primary tracking-tight truncate">
              {b.businessName} by CoTE
            </span>
          </Link>
          <ThemeToggle />
          {/* Tempat untuk letak Toggle Bahasa nanti */}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* BOTTOM NAVIGATION (Mobile-First) */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background flex items-center justify-around px-2 py-2 print:hidden z-50">
        {nav.left.map(({ href, label, icon: Icon }) => (
          <Link 
            key={href} 
            href={href} 
            className="flex flex-col items-center gap-1 px-3 py-1 text-xs text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}

        {/* TOMBOL INPUT BESAR 
          Kita pakai bg-secondary (Warna Gold) agar kontras dengan warna Navy
        */}
        <Link href={nav.fab.href} className="flex flex-col items-center -mt-6 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full">
          <span className="w-14 h-14 rounded-full bg-primary text-secondary-foreground flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
            <Zap size={24} className="fill-current" />
          </span>
          <span className="text-[10px] text-muted-foreground mt-1 font-medium group-hover:text-primary transition-colors">
            {nav.fab.label}
          </span>
        </Link>

        {nav.right.map(({ href, label, icon: Icon }) => (
          <Link 
            key={href} 
            href={href} 
            className="flex flex-col items-center gap-1 px-3 py-1 text-xs text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}