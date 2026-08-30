// coteadmin/src/lib/wa-templates/order-update.ts
type OrderUpdateParams = {
  customerName: string | null;
  orderNumber: string;
  trackingToken: string | null;
  currentStatus: string;
  paymentStatus: "PAID" | "UNPAID";
  timelineText: string;
  appUrl: string;
};

const STATUS_MESSAGE: Record<string, string> = {
  RECEIVED: "Cucian Anda sudah kami terima dan akan segera diproses ya 🙏",
  IN_PROCESS: "Cucian Anda sedang dalam proses pengerjaan.",
  READY: "Cucian Anda sudah *SIAP DIAMBIL*! Silakan mampir ke toko kami ya 😊",
  DONE: "Terima kasih, cucian sudah diambil. Sampai jumpa lagi! 🙏",
  CANCELLED: "Order ini telah dibatalkan.",
};

export function buildOrderUpdateMessage(params: OrderUpdateParams): string {
  const trackLink = params.trackingToken
    ? `${params.appUrl}/track/${params.trackingToken}`
    : `(link lacak belum tersedia untuk order ini)`;

  return [
    `Halo${params.customerName ? ` ${params.customerName}` : ""}! 👋`,
    "",
    `Update untuk order *${params.orderNumber}*:`,
    "",
    params.timelineText,
    "",
    STATUS_MESSAGE[params.currentStatus] ?? "",
    "",
    params.paymentStatus === "UNPAID"
      ? "\n💰 *Belum lunas* — jangan lupa bawa uangnya saat pengambilan ya!"
      : "",
    "",
    ...(trackLink ? [`Cek status detail kapan saja di:`, trackLink, ""] : []),
    "Terima kasih! 🙏",
  ].join("\n");
}
