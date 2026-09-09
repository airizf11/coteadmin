// coteadmin/src/app/(app)/assets/new/page.tsx
import { AssetForm } from './AssetForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewAssetPage() {
  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/assets" className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" aria-label="Kembali ke daftar aset">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground tracking-tight">Catat Aset Baru</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Alat/mesin yang biayanya mau disebar (penyusutan).</p>
        </div>
      </div>
      <AssetForm />
    </div>
  );
}