// coteadmin/src/app/(app)/new/tx/page.tsx
import { cotebek } from '@/lib/cotebek';
import { NewTransactionForm } from './NewTxForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type TeamMember = { id: string; name: string };

export default async function NewTransactionPage() {
  const teamRes = await cotebek<{ data: TeamMember[] }>('/team-members');

  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/transactions" className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" aria-label="Kembali ke daftar transaksi">
          <ArrowLeft size={20} aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground tracking-tight">Catat Transaksi</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Input pemasukan atau pengeluaran manual.</p>
        </div>
      </div>

      <NewTransactionForm teamMembers={teamRes.data} />
    </div>
  );
}