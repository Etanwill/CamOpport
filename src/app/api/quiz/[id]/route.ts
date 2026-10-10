// src/app/api/quiz/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getQuizWithQuestions } from "@/lib/db/queries";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const quiz = await getQuizWithQuestions(params.id);
    if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ quiz });
  } catch (err) {
    console.error("GET /api/quiz/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 });
  }
}