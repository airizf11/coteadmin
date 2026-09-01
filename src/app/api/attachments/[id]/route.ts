// coteadmin/src/app/api/attachments/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cotebekProxy } from "@/lib/cotebek";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const res = await cotebekProxy(`/attachments/${id}`, { method: "DELETE" });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
