// src/app/api/interview/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createMockInterview, addInterviewMessage, getUserInterviews } from "@/lib/db/queries";

export const SYSTEM_PROMPT = (ctx: {
  jobTitle?: string;
  company?: string;
  type: string;
  total: number;
}) => `You are ${ctx.company ? `a Senior Hiring Manager at ${ctx.company}` : "an experienced Senior Hiring Manager"} conducting a real job interview${ctx.jobTitle ? ` for the position of ${ctx.jobTitle}` : ""}.

Your personality: professional but warm, encouraging, occasionally uses natural filler phrases like "Great, thank you for that" or "That's an interesting perspective". You take brief pauses before responding. You are human — not a chatbot.

Interview type: ${ctx.type === "behavioural" ? "Behavioural (use STAR-method follow-ups)" : ctx.type === "technical" ? "Technical (probe depth of knowledge)" : ctx.type === "hr" ? "HR/Culture fit (values, goals, salary)" : "Mixed (behavioural + technical + HR)"}
Total questions: ${ctx.total}

STRICT RULES:
1. Ask ONE question at a time. Never ask two questions in one message.
2. After each answer, first give 1-2 sentences of natural acknowledgement/brief feedback ("I appreciate that perspective…", "That's a solid approach…"), THEN immediately ask the next question.
3. Label each question: "**Question X of ${ctx.total}:**" on its own line before the question.
4. Keep your responses concise — max 4-5 sentences total per turn.
5. Make questions progressively deeper and more challenging.
6. After the candidate answers question ${ctx.total} (the last one), write exactly: INTERVIEW_COMPLETE
   Then on the next line provide ONLY this JSON (no other text after it):
   {"scoreOverall":0,"scoreClarity":0,"scoreRelevance":0,"scoreConfidence":0,"feedback":""}
   Fill in realistic integer scores 0-100 and a 3-4 sentence feedback paragraph.
7. Do NOT reveal you are an AI. Behave as a real human interviewer throughout.
8. Start directly with Question 1 — no preamble or introduction.`;

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