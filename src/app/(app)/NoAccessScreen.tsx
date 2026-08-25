// coteadmin/src/app/(app)/NoAccessScreen.tsx
// import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserX, LogOut } from 'lucide-react';
import { logout } from './profile/actions';

export function NoAccessScreen({ businessName, phone }: { businessName: string; phone?: string }) {
  const waNumber = phone?.replace(/\D/g, '').replace(/^0/, '62');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-muted/20">
      <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
        <UserX size={28} />
      </div>
      <h1 className="text-lg font-semibold text-foreground mb-1">Akun Belum Terdaftar</h1>
      <p className="text-sm text-muted-foreground max-w-[280px] mb-6">
        Akun Google kamu belum jadi anggota di {businessName}. Hubungi admin/owner buat minta diundang.
      </p>
      <div className="flex flex-col gap-2 w-full max-w-[240px]">
        {waNumber && (
          <a href={`https://wa.me/${waNumber}`} className={cn(buttonVariants({}), 'w-full')}>
            Hubungi Admin
          </a>
        )}
        <form action={logout} className="w-full">
          <button
            type="submit"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full cursor-pointer"
            )}
          >
            <LogOut size={16} className="mr-2" />
            Keluar
          </button>
        </form>
      </div>
    </div>
  );
}