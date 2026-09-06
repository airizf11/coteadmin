// coteadmin/src/app/api/push/subscribe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cotebekPublicPost, ApiError } from "@/lib/cotebek";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body?.trackingToken || !body?.subscription) {
    return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
  }

  try {
    const data = await cotebekPublicPost(
      `/orders/track-token/${body.trackingToken}/subscribe`,
      body.subscription,
    );
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status || 502 },
      );
    }
    return NextResponse.json({ message: "Internal error." }, { status: 500 });
  }
}
