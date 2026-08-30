// coteadmin/src/app/(app)/orders/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cotebek } from "@/lib/cotebek";

type CartItem = {
  itemId: string;
  itemName: string;
  qty: number;
  price: number;
  cogs: number;
  subtotal: number;
};

export async function createOrder(payload: {
  items: CartItem[];
  paymentMethod: string;
  dueDate?: string;
  customerId?: string;
  promoCode?: string;
  note?: string;
  paymentStatus?: "PAID" | "UNPAID";
  teamMemberId?: string;
  orderDate?: string;
  status?: string;
  paidAt?: string;
}) {
  const totalAmount = payload.items.reduce((sum, i) => sum + i.subtotal, 0);
  const totalCogs = payload.items.reduce((sum, i) => sum + i.cogs * i.qty, 0);

  try {
    await cotebek("/orders", {
      method: "POST",
      body: {
        items: payload.items,
        totalAmount,
        totalCogs,
        paymentMethod: payload.paymentMethod,
        dueDate: payload.dueDate || undefined,
        customerId: payload.customerId,
        promoCode: payload.promoCode,
        metadata: payload.note ? { note: payload.note } : undefined,
        paymentStatus: payload.paymentStatus,
        teamMemberId: payload.teamMemberId,
        orderDate: payload.orderDate,
        status: payload.status,
        paidAt: payload.paidAt,
      },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal membuat order." };
  }

  revalidatePath("/orders");
  redirect("/orders");
}
