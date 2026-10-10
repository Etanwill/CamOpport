// src/app/api/competitions/[id]/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { registerForCompetition, getUserById, getCompetitionById } from "@/lib/db/queries";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getUserById(session.user.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.role === "employer")
      return NextResponse.json({ error: "Employers cannot register for competitions. Switch to a job seeker account." }, { status: 403 });

    // Enforce registration deadline
    const comp = await getCompetitionById(params.id);
    if (!comp) return NextResponse.json({ error: "Competition not found" }, { status: 404 });

    if (new Date(comp.registrationDeadline) < new Date())
      return NextResponse.json({ error: "Registration deadline for this competition has passed." }, { status: 410 });

    if (comp.status === "ended")
      return NextResponse.json({ error: "This competition has ended." }, { status: 410 });

    // Enforce listing plan expiry
    if (comp.planExpiresAt && new Date(comp.planExpiresAt) < new Date())
      return NextResponse.json({ error: "This competition listing is no longer active." }, { status: 410 });

    const body = await req.json().catch(() => ({}));
    const result = await registerForCompetition(params.id, session.user.id, body.teamName);

    if ((result as any).error)
      return NextResponse.json({ error: (result as any).error }, { status: 409 });

    return NextResponse.json({ registration: result }, { status: 201 });
  } catch (err) {
    console.error("POST /api/competitions/[id]/register error:", err);
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}