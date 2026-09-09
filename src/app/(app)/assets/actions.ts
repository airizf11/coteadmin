// coteadmin/src/app/(app)/assets/actions.ts
"use server";

import { cotebek, ApiError } from "@/lib/cotebek";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createAsset(formData: FormData) {
  const name = formData.get("name") as string;
  const purchaseCost = Number(formData.get("purchaseCost"));
  const purchaseDate = formData.get("purchaseDate") as string;
  const usefulLifeMonths = Number(formData.get("usefulLifeMonths"));
  const salvageValueRaw = formData.get("salvageValue");
  const salvageValue = salvageValueRaw ? Number(salvageValueRaw) : undefined;

  try {
    await cotebek("/assets", {
      method: "POST",
      body: {
        name,
        purchaseCost,
        purchaseDate,
        usefulLifeMonths,
        salvageValue,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    return { error: "Gagal mencatat aset." };
  }

  revalidatePath("/assets");
  redirect("/assets");
}

export async function deleteAsset(id: string, reason?: string) {
  try {
    await cotebek(`/assets/${id}`, { method: "DELETE", body: { reason } });
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    return { error: "Gagal menghapus aset." };
  }
  revalidatePath("/assets");
  return { success: true };
}
