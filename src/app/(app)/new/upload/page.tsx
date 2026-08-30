// coteadmin/src/app/(app)/new/upload/page.tsx
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Paperclip, Loader2, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit() {
    if (!file) { setError('Pilih file dulu.'); return; }
    setPending(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (note.trim()) formData.append('note', note.trim());

      const res = await fetch('/api/attachments', { method: 'POST', body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? 'Gagal upload file.');
      }
      setSuccess(true);
      setFile(null);
      setNote('');
      if (inputRef.current) inputRef.current.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal upload file.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="p-4 pb-24 space-y-5">
      <PageHeader
        title="Upload File"
        subtitle="Kirim laporan/foto harian langsung ke sini, gak perlu lewat WA."
        backHref="/new"
      />

      <Card className="shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2 cursor-pointer">
            <Label htmlFor="file">File</Label>
            <input
              ref={inputRef}
              id="file"
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="flex h-10 w-full rounded-md border border-input bg-background text-sm file:mr-3 file:h-full file:border-0 file:bg-primary file:text-primary-foreground file:px-3 file:text-sm file:font-medium"
            />
            {file && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Paperclip size={12} /> {file.name} ({(file.size / 1024).toFixed(0)} KB)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Catatan (opsional)</Label>
            <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Cth: Laporan kas harian 17 Agustus" />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-success flex items-center gap-1"><CheckCircle2 size={14} /> Terupload.</p>}

          <Button onClick={handleSubmit} disabled={pending} className="w-full h-11 font-medium cursor-pointer">
            {pending && <Loader2 size={16} className="mr-2 animate-spin" />}
            {pending ? 'Mengupload...' : 'Upload'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}