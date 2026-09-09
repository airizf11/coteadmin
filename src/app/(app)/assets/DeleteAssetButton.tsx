// coteadmin/src/app/(app)/assets/DeleteAssetButton.tsx
'use client';

import { useState } from 'react';
import { deleteAsset } from './actions';
import { Trash2, Loader2 } from 'lucide-react';

export function DeleteAssetButton({ assetId, assetName }: { assetId: string; assetName: string }) {
  const [pending, setPending] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    setPending(true);
    await deleteAsset(assetId);
    setPending(false);
  }

  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors">
        <Trash2 size={12} /> Hapus
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-muted-foreground">Hapus &quot;{assetName}&quot;?</span>
      <button onClick={handleDelete} disabled={pending} className="font-semibold text-destructive hover:underline">
        {pending ? <Loader2 size={12} className="animate-spin" /> : 'Ya, hapus'}
      </button>
      <button onClick={() => setConfirming(false)} className="text-muted-foreground hover:underline">Batal</button>
    </div>
  );
}