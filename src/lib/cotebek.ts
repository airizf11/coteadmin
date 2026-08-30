// coteadmin/src/lib/cotebek.ts
import { headers as getRequestHeaders } from "next/headers";
import { getStaffToken } from "./session";

const BASE_URL = process.env.COTEBEK_API_URL!;
const API_KEY = process.env.COTEBEK_API_KEY!;

type FetchOpts = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  requireAuth?: boolean;
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Buat data publik/read-only yang boleh di-cache (misal branding).
// Sengaja gak manggil next/headers biar route yang makein ini
// bisa tetap statis/ISR, bukan otomatis dynamic kayak cotebek().
export async function cotebekPublic<T = unknown>(
  path: string,
  // revalidateSeconds = 300,
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { "x-api-key": API_KEY },
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Gagal terhubung ke server.", 0);
  }

  if (!res.ok) {
    throw new ApiError(`CoTEBek error ${res.status}`, res.status);
  }

  return res.json();
}

export async function cotebek<T = unknown>(
  path: string,
  opts: FetchOpts = {},
): Promise<T> {
  const { method = "GET", body, requireAuth = true } = opts;

  const incomingHeaders = await getRequestHeaders();
  const forwardedFor = incomingHeaders.get("x-forwarded-for");
  const realIp =
    forwardedFor?.split(",")[0]?.trim() ??
    incomingHeaders.get("x-real-ip") ??
    null;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
    ...(realIp ? { "x-forwarded-for": realIp } : {}),
  };

  if (requireAuth) {
    const token = await getStaffToken();
    if (!token) throw new Error("UNAUTHENTICATED");
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Gagal terhubung ke server.", 0);
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new ApiError(
      errBody.message ?? `CoTEBek error ${res.status}`,
      res.status,
    );
  }

  return res.json();
}
