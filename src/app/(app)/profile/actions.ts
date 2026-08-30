// coteadmin/src/app/(app)/profile/actions.ts
"use server";

import { redirect } from "next/navigation";
import { getRefreshToken, clearStaffTokens } from "@/lib/session";

const BASE_URL = process.env.COTEBEK_API_URL!;

export async function logout() {
  const refreshToken = await getRefreshToken();

  if (refreshToken) {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // gagal invalidate di server gapapa, tetep lanjut hapus cookie lokal
    }
  }

  await clearStaffTokens();
  redirect("/login");
}
