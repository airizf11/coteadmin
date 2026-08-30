// coteadmin/src/app/(app)/orders/[id]/receipt/ReceiptWaButton.tsx
'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';
import { buildReceiptMessage } from '@/lib/wa-templates/receipt';
import type { ReceiptData } from './page';
import { waLink } from '@/lib/whatsapp';

export function ReceiptWaButton({ data, customerPhone }: { data: ReceiptData; customerPhone: string | null }) {
  if (!customerPhone) return null;
  const phone = customerPhone;

  function handleClick() {
    const message = buildReceiptMessage({
      business: data.business,
      order: data.order,
      customer: data.customer,
      items: data.items,
      summary: data.summary,
      appUrl: window.location.origin,
    });
    window.open(waLink(phone, message), '_blank', 'noopener,noreferrer');
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        buttonVariants({ variant: "default" }),
        "w-full max-w-[320px] mx-auto mb-3 flex items-center justify-center gap-2 bg-success hover:bg-success/90 text-success-foreground print:hidden cursor-pointer"
      )}
    >
      <MessageCircle size={18} />
      Kirim Struk via WhatsApp
    </button>
  );
}