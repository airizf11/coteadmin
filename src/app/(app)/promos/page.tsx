// adminqinq/src/app/(app)/promos/page.tsx
import Link from 'next/link';
import { cotebek } from '@/lib/cotebek';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Promo = {
  id: string;
  name: string;
  code: string | null;
  type: 'PERCENTAGE' | 'NOMINAL';
  value: number;
  isActive: boolean;
  usageCount: number;
  usageLimit: number | null;
};

export default async function PromosPage() {
  const res = await cotebek<{ data: Promo[] }>('/promos');
  const promos = res.data;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-heading font-bold text-primary tracking-tight">Promo</h1>
        <Link href="/promos/new" className={cn(buttonVariants({ size: "sm" }))}>
          + Buat
        </Link>
      </div>

      {promos.length === 0 && <p className="text-sm text-muted-foreground">Belum ada promo.</p>}

      <ul className="space-y-2">
        {promos.map((p) => (
          <li key={p.id}>
            <Link
              href={`/promos/${p.id}`}
              className={`border rounded-lg p-3 flex justify-between items-center block active:bg-muted ${!p.isActive ? 'opacity-50' : ''}`}
            >
              <div>
                <div className="font-medium flex items-center gap-2">
                  {p.name}
                  {!p.isActive && <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">Nonaktif</span>}
                </div>
                <div className="text-xs text-muted-foreground">
                  {p.code ?? 'Tanpa kode'} · {p.type === 'PERCENTAGE' ? `${p.value}%` : `Rp${p.value.toLocaleString('id-ID')}`}
                  {p.usageLimit ? ` · ${p.usageCount}/${p.usageLimit} dipakai` : ''}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}