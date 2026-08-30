// coteadmin/src/app/(app)/new/orders/promo-actions.ts
"use server";

import { cotebek } from "@/lib/cotebek";

export type PromoCheckResult = {
  promoId: string;
  name: string;
  type: "PERCENTAGE" | "NOMINAL";
  discountAmount: number;
  finalAmount: number;
};

export async function checkPromo(
  code: string,
  orderAmount: number,
  customerId?: string,
): Promise<{ promo?: PromoCheckResult; error?: string }> {
  if (!code.trim()) return {};

  const qs = new URLSearchParams({ orderAmount: String(orderAmount) });
  if (customerId) qs.set("customerId", customerId);

  try {
    const res = await cotebek<{ data: PromoCheckResult }>(
      `/promos/check?${qs}`,
      {
        method: "POST",
        body: { code: code.trim().toUpperCase() },
      },
    );
    return { promo: res.data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Promo tidak valid." };
  }
}
