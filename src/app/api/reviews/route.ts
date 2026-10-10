// src/app/api/reviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getReviews, createReview, getReviewStats, getJobById, getCompetitionById } from "@/lib/db/queries";
import { db } from "@/lib/db";
import { jobApplications, competitionRegistrations } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetType = searchParams.get("targetType") ?? "";
  const targetId   = searchParams.get("targetId")   ?? "";
  if (!targetType || !targetId)
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  const [reviewList, stats] = await Promise.all([
    getReviews(targetType, targetId),
    getReviewStats(targetType, targetId),
  ]);
  return NextResponse.json({ reviews: reviewList, stats });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { targetType, targetId, rating, title, body } = await req.json();
    if (!targetType || !targetId || !rating || !body)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    if (rating < 1 || rating > 5)
      return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });

    // Check if user applied/registered (verified review)
    let isVerified = false;
    if (targetType === "job") {
      const app = await db.select().from(jobApplications)
        .where(and(eq(jobApplications.jobId, targetId), eq(jobApplications.userId, session.user.id))).limit(1);
      isVerified = app.length > 0;
    } else if (targetType === "competition") {
      const reg = await db.select().from(competitionRegistrations)
        .where(and(eq(competitionRegistrations.competitionId, targetId), eq(competitionRegistrations.userId, session.user.id))).limit(1);
      isVerified = reg.length > 0;
    }

    const result = await createReview({ targetType, targetId, userId: session.user.id, rating, title, body, isVerified });
    if ((result as any).error) return NextResponse.json({ error: (result as any).error }, { status: 409 });
    return NextResponse.json({ review: result }, { status: 201 });
  } catch (err) {
    console.error("POST /api/reviews error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}