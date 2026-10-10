// src/app/api/employer/quizzes/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getQuizzesByEmployer } from "@/lib/db/queries";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const quizzes = await getQuizzesByEmployer(session.user.id);
  return NextResponse.json({ quizzes });
}