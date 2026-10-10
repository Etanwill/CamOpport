// src/app/api/bits/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserById, getUserBitTransactions } from "@/lib/db/queries";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getUserById(session.user.id);
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const transactions = await getUserBitTransactions(session.user.id, 30);

    return NextResponse.json({ bits: user.bits, transactions });
  } catch (err) {
    console.error("GET /api/bits error:", err);
    return NextResponse.json({ error: "Failed to fetch bits" }, { status: 500 });
  }
}