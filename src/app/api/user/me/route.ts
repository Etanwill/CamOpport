// src/app/api/user/me/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/db/queries";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await getUserById(session.user.id);
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const { passwordHash: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (err) {
    console.error("GET /api/user/me error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}