// coteadmin/src/app/(app)/new/archive-order/page.tsx
import { cotebek } from '@/lib/cotebek';
import { ArchiveOrderForm } from './ArchiveOrderForm';
import { PageHeader } from '@/components/PageHeader';
import { ShieldOff } from 'lucide-react';

type Item = { id: string; name: string; price: number; cogs: number };
type TeamMember = { id: string; name: string };

export default async function ArchiveOrderPage() {
  const membership = await cotebek<{ data: { isMember: boolean; role: string | null } }>('/auth/membership');
  const canAccess = membership.data.role === 'ADMIN' || membership.data.role === 'OWNER';

  if (!canAccess) {
    return (
      <div className="p-4 pb-24 space-y-5">
        <PageHeader title="Order Arsip" backHref="/new" />
        <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/30 rounded-2xl border border-dashed border-border">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 shadow-sm">
            <ShieldOff className="text-muted-foreground opacity-50" size={32} />
          </div>
          <p className="text-foreground font-medium">Khusus Admin/Owner</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-[240px]">Fitur input data arsip cuma bisa diakses Admin/Owner.</p>
        </div>
      </div>
    );
  }

  const [itemsRes, teamRes] = await Promise.all([
    cotebek<{ data: Item[] }>('/items'),
    cotebek<{ data: TeamMember[] }>('/team-members'),
  ]);

  return (
    <div className="p-4 pb-24 space-y-5">
      <PageHeader title="Order Arsip" subtitle="Input data order lampau/migrasi (backdate)" backHref="/new" />
      <ArchiveOrderForm items={itemsRes.data} teamMembers={teamRes.data} />
    </div>
  );
}