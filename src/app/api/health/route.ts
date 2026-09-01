// coteadmin/src/app/api/health/route.ts
import { NextResponse } from "next/server";
import { cotebekPublic } from "@/lib/cotebek";

export async function GET() {
  try {
    await cotebekPublic("/app-settings/public/branding");
    return NextResponse.json({ status: "ok" });
  } catch {
    return NextResponse.json({ status: "down" }, { status: 503 });
  }
}
