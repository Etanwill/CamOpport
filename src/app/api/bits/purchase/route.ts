// src/app/api/bits/purchase/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { purchaseBits, getUserById } from "@/lib/db/queries";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getUserById(session.user.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.role !== "job_seeker")
      return NextResponse.json({ error: "Only job seekers use bits" }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    if (!body.packageId)
      return NextResponse.json({ error: "packageId is required" }, { status: 400 });

    const result = await purchaseBits(session.user.id, body.packageId);
    if ((result as any).error)
      return NextResponse.json({ error: (result as any).error }, { status: 400 });

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("POST /api/bits/purchase error:", err);
    return NextResponse.json({ error: "Failed to purchase bits" }, { status: 500 });
  }
}