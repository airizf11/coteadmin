// coteadmin/src/app/api/attachments/[id]/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cotebekProxy } from "@/lib/cotebek";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const res = await cotebekProxy(`/attachments/${id}/download`);

  if (!res.ok) {
    return NextResponse.json(
      { error: "Gagal ambil file." },
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
