// src/app/api/competitions/[id]/registrants/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCompetitionRegistrants, getCompetitionById } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const comp = await getCompetitionById(params.id);
    if (!comp || comp.postedById !== session.user.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const registrants = await getCompetitionRegistrants(params.id);
    return NextResponse.json({ registrants });
  } catch (err) {
    console.error("GET /api/competitions/[id]/registrants error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}