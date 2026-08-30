// coteadmin/src/app/(app)/orders/[id]/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { cotebek } from "@/lib/cotebek";

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await cotebek(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: { status },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal update status." };
  }

  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/orders");
}

export async function markOrderPaid(orderId: string, paymentMethod?: string) {
  try {
    await cotebek(`/orders/${orderId}/pay`, {
      method: "PATCH",
      body: paymentMethod ? { paymentMethod } : {},
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal menandai lunas." };
  }
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/orders");
  return { success: true };
}
