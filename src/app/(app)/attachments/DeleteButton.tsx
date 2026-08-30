// coteadmin/src/app/(app)/attachments/DeleteButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, X, Check, Loader2 } from 'lucide-react';

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setPending(true);
    setError(null);
    const res = await fetch(`/api/attachments/${id}`, { method: 'DELETE' });
    setPending(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.message ?? 'Gagal hapus. Mungkin kamu bukan Admin/Owner.');
      setConfirming(false);
      return;
    }
    router.refresh();
  }

  if (error) {
    return <span className="text-[10px] text-destructive">{error}</span>;
  }

  if (!confirming) {
    return (
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirming(true); }}
        className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
        aria-label="Hapus file"
      >
        <Trash2 size={15} />
      </button>
    );
  }

  return (
    <span className="flex items-center gap-1">
      <button onClick={handleDelete} disabled={pending} className="p-1.5 rounded-md text-destructive hover:bg-destructive/10" aria-label="Konfirmasi hapus">
        {pending ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
      </button>
      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirming(false); }} className="p-1.5 rounded-md text-muted-foreground hover:bg-muted" aria-label="Batal">
        <X size={15} />
      </button>
    </span>
  );
}