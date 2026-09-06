// coteadmin/src/app/api/health/route.ts
import { NextResponse } from "next/server";

const BASE_URL = process.env.COTEBEK_API_URL!;
const API_KEY = process.env.COTEBEK_API_KEY!;

export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/health`, {
      headers: { "x-api-key": API_KEY },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ api: "down", db: "unknown" }, { status: 503 });
    }

    const data = await res.json();
    const payload = data.data ?? data.meta ?? data;
    return NextResponse.json({ api: payload.api, db: payload.db });
  } catch {
    return NextResponse.json({ api: "down", db: "unknown" }, { status: 503 });
  }
}
