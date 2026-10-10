// src/app/api/faqs/[id]/answer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { answerFaq } from "@/lib/db/queries";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "employer")
    return NextResponse.json({ error: "Only employers can answer FAQs" }, { status: 403 });
  const { answer } = await req.json();
  if (!answer?.trim()) return NextResponse.json({ error: "Answer cannot be empty" }, { status: 400 });
  const faq = await answerFaq(params.id, answer, session.user.id);
  return NextResponse.json({ faq });
}