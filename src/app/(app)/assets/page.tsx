// coteadmin/src/app/(app)/assets/page.tsx
import { cotebek } from '@/lib/cotebek';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Money } from '@/components/Money';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Boxes, Plus, CalendarClock } from 'lucide-react';
import { ApiErrorFallback } from '@/components/ApiErrorFallback';
import { DeleteAssetButton } from './DeleteAssetButton';

type Asset = {
  id: string;
  name: string;
  purchaseCost: string | number;
  purchaseDate: string;
  usefulLifeMonths: number;
  salvageValue: string | number;
};

export default async function AssetsPage() {
  let assets: Asset[];
  try {
    const res = await cotebek<{ data: Asset[] }>('/assets');
    assets = res.data;
  } catch (error) {
    return (
      <div className="p-4 pt-8">
        <ApiErrorFallback error={error} />
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 space-y-5">
      <PageHeader title="Aset" subtitle="Daftar aset & penyusutan" backHref="/reports" />

      <Link href="/assets/new" className={cn(buttonVariants({ variant: 'default' }), 'w-full h-11')}>
        <Plus size={16} className="mr-2" /> Catat Aset Baru
      </Link>

      {assets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/30 rounded-2xl border border-dashed border-border">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Boxes className="text-muted-foreground opacity-50" size={32} />
          </div>
          <p className="text-foreground font-medium">Belum ada aset tercatat</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-[250px]">
            Catat alat/mesin yang dibeli biar biayanya kesebar rapi (penyusutan), gak numpuk di 1 bulan.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {assets.map((a) => {
            const cost = Number(a.purchaseCost);
            const salvage = Number(a.salvageValue);
            const monthlyDepr = (cost - salvage) / a.usefulLifeMonths;
            const purchaseDate = new Date(a.purchaseDate);
            const endDate = new Date(purchaseDate);
            endDate.setMonth(endDate.getMonth() + a.usefulLifeMonths);
            const isFullyDepreciated = endDate < new Date();

            return (
              <Card key={a.id} className="shadow-sm border-border">
                <CardContent className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-foreground">{a.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <CalendarClock size={12} />
                        {purchaseDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-foreground shrink-0"><Money value={cost} /></span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-dashed border-border">
                    <span className="text-muted-foreground">
                      Penyusutan/bln: <span className="font-semibold text-foreground"><Money value={Math.round(monthlyDepr)} /></span>
                    </span>
                    <span className={cn('font-medium', isFullyDepreciated ? 'text-muted-foreground' : 'text-success')}>
                      {isFullyDepreciated ? 'Lunas susut' : `${a.usefulLifeMonths} bln umur pakai`}
                    </span>
                  </div>
                  <DeleteAssetButton assetId={a.id} assetName={a.name} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}