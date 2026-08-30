// coteadmin/src/lib/wa-templates/receipt.ts
import { formatRupiah } from "@/lib/format";

type ReceiptWaParams = {
  business: {
    name: string;
    address: string | null;
    phone: string | null;
    footer: string;
  };
  order: {
    orderNumber: string;
    trackingToken: string | null;
    paymentMethod: string;
    paymentStatus: "PAID" | "UNPAID";
    createdAt: string;
    dueDate: string | null;
  };
  customer: { name: string | null };
  items: { itemName: string; qty: number; price: number; subtotal: number }[];
  summary: {
    subtotal: number;
    discountAmount: number;
    promoName: string | null;
    total: number;
  };
  appUrl: string;
};

export function buildReceiptMessage(params: ReceiptWaParams): string {
  const trackLink = params.order.trackingToken
    ? `${params.appUrl}/track/${params.order.trackingToken}`
    : null;

  const itemLines = params.items.map(
    (i) =>
      `${i.itemName}\n${i.qty} x ${formatRupiah(i.price)} = ${formatRupiah(i.subtotal)}`,
  );

  return [
    `🧾 *STRUK ELEKTRONIK ${params.business.name}*`,
    "",
    params.customer.name ? `Halo *${params.customer.name}*! 👋` : "Halo! 👋",
    `Berikut struk untuk order *${params.order.orderNumber}*:`,
    "",
    "━━━━━━━━━━━━━━━",
    ...itemLines,
    "━━━━━━━━━━━━━━━",
    "",
    `Subtotal: ${formatRupiah(params.summary.subtotal)}`,
    ...(params.summary.discountAmount > 0
      ? [
          `Diskon${params.summary.promoName ? ` (${params.summary.promoName})` : ""}: -${formatRupiah(params.summary.discountAmount)}`,
        ]
      : []),
    `*Total: ${formatRupiah(params.summary.total)}*`,
    `Bayar: ${params.order.paymentMethod}`,
    `Status: *${params.order.paymentStatus === "PAID" ? "LUNAS ✅" : "BELUM LUNAS ⚠️"}*`,
    "",
    ...(trackLink ? [`Lacak status order:`, trackLink, ""] : []),
    params.business.footer,
  ].join("\n");
}
