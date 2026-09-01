// coteadmin/src/app/api/attachments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cotebekProxy } from "@/lib/cotebek";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const res = await cotebekProxy("/attachments", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
