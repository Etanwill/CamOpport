// src/app/api/interview/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createMockInterview, addInterviewMessage, getUserInterviews } from "@/lib/db/queries";
import { SYSTEM_PROMPT } from "@/lib/interview-prompt";


export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const interviews = await getUserInterviews(session.user.id);
  return NextResponse.json(interviews);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId, jobTitle, company, interviewType, totalQuestions } = await req.json();

  if (!["behavioural","technical","hr","mixed"].includes(interviewType))
    return NextResponse.json({ error: "Invalid interview type" }, { status: 400 });
  if (![5,10,15].includes(totalQuestions))
    return NextResponse.json({ error: "Invalid question count" }, { status: 400 });

  const interview = await createMockInterview({
    userId: session.user.id,
    jobId, jobTitle, company, interviewType, totalQuestions,
  });

  const systemPrompt = SYSTEM_PROMPT({ jobTitle, company, type: interviewType, total: totalQuestions });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GROQ_API_KEY not set in .env.local" }, { status: 500 });
  }

  const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model:       "openai/gpt-oss-120b",
      max_tokens:  512,
      temperature: 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: "Ready." },
      ],
    }),
  });

  const aiData      = await aiRes.json();
  const firstMessage = aiData.choices?.[0]?.message?.content ?? "**Question 1 of " + totalQuestions + ":** Tell me about yourself and what drew you to this role.";

  await addInterviewMessage({
    interviewId: interview.id,
    role:        "assistant",
    content:     firstMessage,
    questionNo:  1,
  });

  return NextResponse.json({ interview, firstMessage });
}