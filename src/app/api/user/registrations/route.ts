// src/app/api/user/registrations/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserCompetitionRegistrations } from "@/lib/db/queries";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const registrations = await getUserCompetitionRegistrations(session.user.id);
    return NextResponse.json({ registrations });
  } catch (err) {
    console.error("GET /api/user/registrations error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}