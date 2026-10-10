// src/app/api/quiz/[id]/attempt/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { saveQuizAttempt } from "@/lib/db/queries";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { score, totalPoints, answers } = await req.json();
    const result = await saveQuizAttempt({ quizId: params.id, userId: session.user.id, score, totalPoints, answers });
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("POST /api/quiz/[id]/attempt error:", err);
    return NextResponse.json({ error: "Failed to save attempt" }, { status: 500 });
  }
}