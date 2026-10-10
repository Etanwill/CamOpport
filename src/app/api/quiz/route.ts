// src/app/api/quiz/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getQuizzes, createQuiz, getUserById } from "@/lib/db/queries";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const quizzes = await getQuizzes(searchParams.get("category") ?? undefined);
    return NextResponse.json({ quizzes });
  } catch (err) {
    console.error("GET /api/quiz error:", err);
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await getUserById(session.user.id);
    if (!dbUser || dbUser.role !== "employer")
      return NextResponse.json({ error: "Only employers can create quizzes" }, { status: 403 });

    const body = await req.json();
    const quiz = await createQuiz({
      ...body,
      createdById: session.user.id,
      companyName: dbUser.companyName ?? dbUser.name,
    });
    return NextResponse.json({ quiz }, { status: 201 });
  } catch (err) {
    console.error("POST /api/quiz error:", err);
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
  }
}