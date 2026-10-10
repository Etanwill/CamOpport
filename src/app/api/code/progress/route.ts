// src/app/api/code/progress/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserCodingProgress, upsertCodingProgress } from "@/lib/db/queries";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const progress = await getUserCodingProgress(session.user.id);
  return NextResponse.json({ progress });
}

export async function POST() {
  // Start the 100 days challenge (initialise progress row)
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const existing = await getUserCodingProgress(session.user.id);
  if (existing) return NextResponse.json({ progress: existing });
  const progress = await upsertCodingProgress(session.user.id, {
    currentDay: 1, streak: 0, totalSolved: 0, completedDays: [],
  });
  return NextResponse.json({ progress });
}