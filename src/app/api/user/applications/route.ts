// src/app/api/user/applications/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserJobApplications } from "@/lib/db/queries";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const applications = await getUserJobApplications(session.user.id);
    return NextResponse.json({ applications });
  } catch (err) {
    console.error("GET /api/user/applications error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}