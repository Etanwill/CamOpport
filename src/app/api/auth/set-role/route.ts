// src/app/api/auth/set-role/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { setUserRole } from "@/lib/db/queries";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { role, companyName } = body;

    if (!["job_seeker", "employer"].includes(role))
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    if (role === "employer" && !companyName)
      return NextResponse.json({ error: "Company name is required for employers" }, { status: 400 });

    const user = await setUserRole(session.user.id, role, { companyName });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { passwordHash: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (err) {
    console.error("POST /api/auth/set-role error:", err);
    return NextResponse.json({ error: "Failed to set role" }, { status: 500 });
  }
}