// coteadmin/src/app/(app)/profile/page.tsx
import { getCurrentUserEmail } from '@/lib/session';
import { logout } from './actions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/PageHeader';

export default async function ProfilePage() {
  const email = await getCurrentUserEmail();

  return (
    <div className="p-4 space-y-5">
      <PageHeader title="Profil" backHref="/more" />

      <Card className="shadow-sm mb-6">
        <CardContent className="p-3">
          <div className="text-xs text-muted-foreground">Login sebagai</div>
          <div className="font-medium text-foreground">{email ?? 'Tidak diketahui'}</div>
        </CardContent>
      </Card>

      <form action={logout}>
        <Button type="submit" variant="outline" className="w-full h-11 font-medium border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer">
          Keluar
        </Button>
      </form>
    </div>
  );
}