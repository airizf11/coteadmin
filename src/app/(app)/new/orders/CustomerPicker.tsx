// coteadmin/src/app/(app)/new/orders/CustomerPicker.tsx
'use client';

import { useState, useEffect, useTransition } from 'react';
import { searchCustomersByPhone, createQuickCustomer, type CustomerMatch } from './customer-actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Search, UserPlus, UserCheck, X } from 'lucide-react';

export function CustomerPicker({ onSelect }: { onSelect: (customer: CustomerMatch | null) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CustomerMatch[]>([]);
  const [selected, setSelected] = useState<CustomerMatch | null>(null);
  const [creating, setCreating] = useState(false);
  const [noPhoneMode, setNoPhoneMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (selected) return;
    const timer = setTimeout(() => {
      startTransition(async () => {
        const matches = await searchCustomersByPhone(query);
        setResults(matches);
      });
    }, 550);
    return () => clearTimeout(timer);
  }, [query, selected]);

  function handleSelect(customer: CustomerMatch) {
    setSelected(customer);
    setResults([]);
    onSelect(customer);
  }

  function handleClear() {
    setSelected(null);
    setQuery('');
    setNewName('');
    setCreating(false);
    onSelect(null);
  }

  async function handleCreateQuick() {
    setError(null);
    if (!newName.trim()) {
      setError('Nama wajib diisi.');
      return;
    }
    const result = await createQuickCustomer(newName.trim(), query.trim());
    if (result?.error) {
      setError(result.error);
      return;
    }
    if (result?.customer) handleSelect(result.customer);
  }

  // TAMPILAN JIKA CUSTOMER SUDAH DIPILIH
  if (selected) {
    return (
      <Card className="border-primary/20 bg-primary/5 shadow-sm">
        <CardContent className="p-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <UserCheck size={18} />
            </div>
            <div>
              <div className="font-semibold text-primary">{selected.name}</div>
              <div className="text-xs text-muted-foreground">{selected.phone ?? 'Tanpa No. HP'}</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClear} className="text-destructive hover:text-destructive hover:bg-destructive/10">
            Ganti
          </Button>
        </CardContent>
      </Card>
    );
  }

  // TAMPILAN FORM CUSTOMER TANPA HP
  if (noPhoneMode) {
    return (
      <Card className="border-dashed shadow-sm">
        <CardContent className="p-4 space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Nama Customer (Tanpa HP)</Label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Masukkan nama pelanggan..."
              className="bg-background"
            />
            {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => { setNoPhoneMode(false); setNewName(''); setError(null); }}>
              Batal
            </Button>
            <Button onClick={async () => {
              if (!newName.trim()) { setError('Nama wajib diisi.'); return; }
              const result = await createQuickCustomer(newName.trim());
              if (result?.error) setError(result.error);
              else if (result?.customer) { handleSelect(result.customer); setNoPhoneMode(false); }
            }} className="flex-1">
              Simpan & Pilih
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // TAMPILAN PENCARIAN DEFAULT
  return (
    <div className="space-y-2 relative">
      <Label className="text-sm font-semibold text-foreground">Customer (Opsional)</Label>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setCreating(false); }}
          placeholder="Cari No. HP atau Nama..."
          className="pl-9 bg-background"
        />
        {isPending && (
          <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin" />
        )}
      </div>

      {!isPending && query.length >= 3 && results.length > 0 && (
        <Card className="absolute w-full z-10 mt-1 shadow-md border-border max-h-60 overflow-y-auto">
          <ul className="divide-y divide-border">
            {results.map((c) => (
              <li key={c.id}>
                <button 
                  onClick={() => handleSelect(c)} 
                  className="w-full text-left p-3 hover:bg-muted focus:bg-muted transition-colors focus-visible:outline-none cursor-pointer"
                >
                  <div className="text-sm font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.phone}</div>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {!isPending && query.length >= 3 && results.length === 0 && !creating && (
        <Button variant="ghost" className="w-full text-primary mt-1 text-sm justify-start border border-dashed" onClick={() => setCreating(true)}>
          <UserPlus size={16} className="mr-2" /> Tambah "{query}"
        </Button>
      )}

      {creating && (
        <Card className="border-primary/20 shadow-sm mt-2">
          <CardContent className="p-3 space-y-3">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nama customer baru"
            />
            <p className="text-xs text-muted-foreground">No. HP: <span className="font-medium text-foreground">{query}</span></p>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button onClick={handleCreateQuick} className="w-full">
              Simpan & Pilih
            </Button>
          </CardContent>
        </Card>
      )}

      {!creating && query.length < 3 && (
        <button onClick={() => setNoPhoneMode(true)} className="text-xs text-muted-foreground mt-1 hover:text-primary transition-colors underline underline-offset-2">
          Pelanggan tidak punya HP?
        </button>
      )}
    </div>
  );
}