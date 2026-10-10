// src/app/api/competitions/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCompetitionById, updateCompetition } from "@/lib/db/queries";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Same fix as /api/jobs/[id]: this route has no dynamic APIs (cookies/headers/
// searchParams), so Next.js can statically cache it and keep serving a stale
// snapshot — e.g. an old registrationDeadline/endDate — even after the row is
// updated directly in the database.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const competition = await getCompetitionById(params.id);
    if (!competition) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ competition }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("GET /api/competitions/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch competition" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await getCompetitionById(params.id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (existing.postedById !== session.user.id)
      return NextResponse.json({ error: "You can only edit your own competition postings" }, { status: 403 });

    const body = await req.json();
    const update: Record<string, any> = {};

    const passthrough = [
      "title", "description", "type", "status",
      "maxTeamSize", "minTeamSize", "eligibility", "tags",
      "city", "region", "isOnline", "prizes", "zone", "latitude", "longitude",
    ];
    for (const key of passthrough) {
      if (body[key] !== undefined) update[key] = body[key];
    }
    for (const dateKey of ["startDate", "endDate", "registrationDeadline"] as const) {
      if (body[dateKey] !== undefined) {
        const d = new Date(body[dateKey]);
        if (isNaN(d.getTime())) return NextResponse.json({ error: `Invalid ${dateKey}` }, { status: 400 });
        update[dateKey] = d;
      }
    }

    const competition = await updateCompetition(params.id, session.user.id, update);
    if (!competition) return NextResponse.json({ error: "Failed to update competition" }, { status: 404 });
    return NextResponse.json({ competition });
  } catch (err) {
    console.error("PATCH /api/competitions/[id] error:", err);
    return NextResponse.json({ error: "Failed to update competition" }, { status: 500 });
  }
}