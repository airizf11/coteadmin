// coteadmin/src/app/(app)/help/page.tsx
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';
import { getBranding } from '@/lib/branding';

export default async function HelpPage() {
  const b = await getBranding();
  const waNumber = b.phone?.replace(/\D/g, '').replace(/^0/, '62');

  return (
    <div className="p-4 pb-24 space-y-5">
      <PageHeader title="Bantuan" backHref="/more" />

      <Card className="shadow-sm">
        <CardContent className="p-4 text-sm text-muted-foreground">
          Ada kendala atau pertanyaan seputar penggunaan aplikasi? Hubungi admin lewat WhatsApp.
        </CardContent>
      </Card>

      {waNumber && (
        <a
          href={`https://wa.me/${waNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'default' }), 'w-full flex items-center justify-center gap-2 h-11')}
        >
          <MessageCircle size={18} />
          Hubungi Admin
        </a>
      )}
    </div>
  );
}