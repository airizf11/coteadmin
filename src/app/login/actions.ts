// coteadmin/src/app/login/actions.ts
"use server";

import { redirect } from "next/navigation";
import { setStaffTokens } from "@/lib/session";

const BASE_URL = process.env.COTEBEK_API_URL!;

export async function googleLogin(idToken: string) {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
  } catch (e) {
    console.error("googleLogin fetch failed:", e);
    return { error: "Gagal menghubungi server. Coba lagi." };
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { error: err.message ?? "Login gagal." };
  }

  const { data } = await res.json();
  await setStaffTokens(data.accessToken, data.refreshToken);
  redirect("/dashboard");
}
