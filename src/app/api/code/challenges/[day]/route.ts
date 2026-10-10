// src/app/api/code/challenges/[day]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { codingChallenges, codingSubmissions, codingProgress } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CODING_DAYS } from "@/lib/db/coding-seed-data";

export async function GET(req: NextRequest, { params }: { params: { day: string } }) {
  try {
    const day = parseInt(params.day);
    if (isNaN(day) || day < 1 || day > 100)
      return NextResponse.json({ error: "Invalid day" }, { status: 400 });

    const dayMeta  = CODING_DAYS.find(d => d.dayNumber === day);
    const problems = await db
      .select()
      .from(codingChallenges)
      .where(eq(codingChallenges.dayNumber, day))
      .orderBy(codingChallenges.createdAt);

    if (problems.length === 0)
      return NextResponse.json({ error: "Day not found", problems: [] }, { status: 404 });

    // Strip hidden test cases
    const safeProblems = problems.map(p => ({
      ...p,
      testCases: ((p.testCases as any[]) ?? []).filter((t: any) => !t.isHidden),
    }));

    const session = await getServerSession(authOptions);
    let submissions: any[] = [];

    if (session?.user?.id) {
      const problemIds = problems.map(p => p.id);
      const allSubs    = await db
        .select()
        .from(codingSubmissions)
        .where(eq(codingSubmissions.userId, session.user.id));

      // Attach slug from the problem list we already have
      submissions = allSubs
        .filter(s => problemIds.includes(s.challengeId))
        .map(s => ({
          ...s,
          slug: problems.find(p => p.id === s.challengeId)?.slug ?? null,
        }));
    }

    return NextResponse.json({
      day,
      topic:    dayMeta?.topic  ?? `Day ${day}`,
      lesson:   dayMeta?.lesson ?? "",
      problems: safeProblems,
      submissions,
    });

  } catch (err: any) {
    console.error("GET /api/code/challenges/[day] error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}