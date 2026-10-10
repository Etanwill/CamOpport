// src/app/api/competitions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCompetitions, createCompetition, getUserById } from "@/lib/db/queries";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calcPlanExpiry } from "@/lib/plans";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const competitions = await getCompetitions({
      status: searchParams.get("status") ?? undefined,
      type:   searchParams.get("type")   ?? undefined,
      search: searchParams.get("search") ?? undefined,
    });
    return NextResponse.json({ competitions });
  } catch (err) {
    console.error("GET /api/competitions error:", err);
    return NextResponse.json({ error: "Failed to fetch competitions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await getUserById(session.user.id);
    if (!dbUser || dbUser.role !== "employer")
      return NextResponse.json({ error: "Only employers can post competitions" }, { status: 403 });

    const body = await req.json();

    const plan          = body.plan ?? "starter";
    const planExpiresAt = calcPlanExpiry(plan);
    const isFeatured    = plan === "featured";

    const competition = await createCompetition({
      ...body,
      startDate:            new Date(body.startDate),
      endDate:              new Date(body.endDate),
      registrationDeadline: new Date(body.registrationDeadline),
      plan,
      planExpiresAt,
      isFeatured,
      postedById:    session.user.id,
      // Automatically attach the employer's saved company logo
      organizerLogo: dbUser.companyLogo ?? body.organizerLogo ?? null,
    });
    return NextResponse.json({ competition }, { status: 201 });
  } catch (err) {
    console.error("POST /api/competitions error:", err);
    return NextResponse.json({ error: "Failed to create competition" }, { status: 500 });
  }
}