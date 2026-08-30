// coteadmin/src/app/(app)/about/page.tsx
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { getBranding } from '@/lib/branding';

export default async function AboutPage() {
  const b = await getBranding();

  return (
    <div className="p-4 pb-24 space-y-5">
      <PageHeader title="Tentang" backHref="/more" />

      <Card className="shadow-sm">
        <CardContent className="p-4 space-y-2 text-sm">
          <div className="font-semibold text-foreground">{b.businessName}</div>
          <p className="text-muted-foreground">Aplikasi manajemen usaha berbasis CoTE System.</p>
        </CardContent>
      </Card>
    </div>
  );
}