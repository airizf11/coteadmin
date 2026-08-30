// coteadmin/src/app/(app)/new/orders/customer-actions.ts
"use server";

import { cotebek } from "@/lib/cotebek";

export type CustomerMatch = { id: string; name: string; phone: string | null };

export async function searchCustomersByPhone(
  query: string,
): Promise<CustomerMatch[]> {
  if (!query || query.length < 3) return [];
  const res = await cotebek<{ data: CustomerMatch[] }>(
    `/customers?search=${encodeURIComponent(query)}`,
  );
  return res.data;
}

export async function createQuickCustomer(name: string, phone?: string) {
  try {
    const res = await cotebek<{ data: CustomerMatch }>("/customers", {
      method: "POST",
      body: { name, phone },
    });
    return { customer: res.data };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Gagal menambah customer.",
    };
  }
}
