// coteadmin/src/app/api/reports/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cotebekProxy } from "@/lib/cotebek";

export async function GET(req: NextRequest) {
  const qs = req.nextUrl.search;
  const res = await cotebekProxy(`/reports/export${qs}`);

  if (!res.ok) {
    return NextResponse.json(
      { error: "Gagal generate laporan." },
      { status: res.status },
    );
  }

  return new NextResponse(res.body, {
    headers: {
      "Content-Type":
        res.headers.get("content-type") ?? "application/octet-stream",
      "Content-Disposition":
        res.headers.get("content-disposition") ?? "attachment",
    },
  });
}
