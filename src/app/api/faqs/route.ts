// src/app/api/faqs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFaqs, createFaq } from "@/lib/db/queries";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetType = searchParams.get("targetType") ?? "";
  const targetId   = searchParams.get("targetId")   ?? "";
  if (!targetType || !targetId)
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  const faqList = await getFaqs(targetType, targetId);
  return NextResponse.json({ faqs: faqList });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Sign in to ask a question" }, { status: 401 });
    const { targetType, targetId, question } = await req.json();
    if (!question?.trim()) return NextResponse.json({ error: "Question cannot be empty" }, { status: 400 });
    const faq = await createFaq({ targetType, targetId, question, askedById: session.user.id });
    return NextResponse.json({ faq }, { status: 201 });
  } catch (err) {
    console.error("POST /api/faqs error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}