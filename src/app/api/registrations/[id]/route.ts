// src/app/api/registrations/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateRegistrationStatus, getCompetitionById } from "@/lib/db/queries";
import { db } from "@/lib/db";
import { competitionRegistrations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { status, note } = await req.json();
    const valid = ["registered", "confirmed", "waitlisted", "disqualified", "winner"];
    if (!valid.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

    // Verify the registration belongs to a competition this employer owns
    const [reg] = await db.select().from(competitionRegistrations)
      .where(eq(competitionRegistrations.id, params.id)).limit(1);
    if (!reg) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const comp = await getCompetitionById(reg.competitionId);
    if (!comp || comp.postedById !== session.user.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const updated = await updateRegistrationStatus(params.id, status, note);
    return NextResponse.json({ registration: updated[0] });
  } catch (err) {
    console.error("PATCH /api/registrations/[id] error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}