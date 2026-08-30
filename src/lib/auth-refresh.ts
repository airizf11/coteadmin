// coteadmin/src/lib/auth-refresh.ts
const BASE_URL = process.env.COTEBEK_API_URL!;

export async function callRefreshEndpoint(refreshToken: string) {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const { data } = await res.json();
    return data as { accessToken: string; refreshToken: string };
  } catch {
    return null;
  }
}
