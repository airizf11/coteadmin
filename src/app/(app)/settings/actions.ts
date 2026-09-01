// coteadmin/src/app/(app)/settings/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { cotebek } from "@/lib/cotebek";

export async function saveSettings(formData: FormData) {
  const orderPrefix = (formData.get("order_prefix") as string)
    ?.toUpperCase()
    .trim();
  const txPrefix = (formData.get("tx_prefix") as string)?.toUpperCase().trim();
  const businessName = (formData.get("business_name") as string)?.trim();
  const businessAddress = (formData.get("business_address") as string)?.trim();
  const businessPhone = (formData.get("business_phone") as string)?.trim();
  const receiptFooter = (formData.get("receipt_footer") as string)?.trim();
  const businessType = (formData.get("business_type") as string)?.trim();
  const primaryColor = (formData.get("primary_color") as string)?.trim();
  const websiteUrl = (formData.get("website_url") as string)?.trim();
  const dashboardWindowDays = (
    formData.get("dashboard_window_days") as string
  )?.trim();
  const orderFlow = (formData.get("order_flow") as string)?.trim();

  try {
    await cotebek("/app-settings/bulk", {
      method: "POST",
      body: {
        settings: [
          { key: "order_prefix", value: orderPrefix },
          { key: "tx_prefix", value: txPrefix },
          { key: "business_name", value: businessName },
          { key: "business_address", value: businessAddress },
          { key: "business_phone", value: businessPhone },
          { key: "receipt_footer", value: receiptFooter },
          { key: "business_type", value: businessType },
          { key: "primary_color", value: primaryColor },
          { key: "website_url", value: websiteUrl },
          { key: "dashboard_window_days", value: dashboardWindowDays },
          { key: "order_flow", value: orderFlow },
        ],
      },
    });
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Gagal menyimpan pengaturan.",
    };
  }

  revalidatePath("/settings");
  return { success: true };
}
