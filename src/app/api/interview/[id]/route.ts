// src/app/api/interview/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getMockInterview, getInterviewMessages,
  addInterviewMessage, updateInterviewProgress, completeInterview,
} from "@/lib/db/queries";
import { SYSTEM_PROMPT } from "@/lib/interview-prompt";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const interview = await getMockInterview(params.id);
  if (!interview) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (interview.userId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const messages = await getInterviewMessages(interview.id);
  return NextResponse.json({ interview, messages });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const interview = await getMockInterview(params.id);
  if (!interview) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (interview.userId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (interview.status === "completed") return NextResponse.json({ error: "Already completed" }, { status: 400 });

  const { answer } = await req.json();
  if (!answer?.trim()) return NextResponse.json({ error: "Answer required" }, { status: 400 });

  try {
    // Fetch history BEFORE saving new answer
    const history = await getInterviewMessages(interview.id);

    // Build conversation history for Groq
    // History from DB: [assistant(Q1), user(A1), assistant(Q2), ...]
    // Groq takes system separately, so messages alternate freely
    const merged: { role: "user" | "assistant"; content: string }[] = [];

    for (const msg of history) {
      const last = merged[merged.length - 1];
      if (last && last.role === msg.role) {
        last.content += "\n\n" + msg.content;
      } else {
        merged.push({ role: msg.role as "user" | "assistant", content: msg.content });
      }
    }

    // Append the new user answer
    const last = merged[merged.length - 1];
    if (last && last.role === "user") {
      last.content += "\n\n" + answer.trim();
    } else {
      merged.push({ role: "user", content: answer.trim() });
    }

    const systemPrompt = SYSTEM_PROMPT({
      jobTitle: interview.jobTitle ?? undefined,
      company:  interview.company  ?? undefined,
      type:     interview.interviewType,
      total:    interview.totalQuestions,
    });

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY not set in .env.local" }, { status: 500 });
    }

    // Groq uses OpenAI-compatible format — move system prompt out of messages
    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...merged.slice(1), // drop the leading synthetic "user: Ready." we added for Anthropic
    ];

    const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model:       "openai/gpt-oss-120b",
        max_tokens:  600,
        temperature: 0.7,
        messages:    groqMessages,
      }),
    });

    const aiData = await aiRes.json();
    console.log("[interview] Groq status:", aiRes.status);
    if (!aiRes.ok || aiData.error) {
      console.error("[interview] Groq error:", JSON.stringify(aiData, null, 2));
      return NextResponse.json({ error: "AI error", detail: aiData }, { status: 500 });
    }

    const aiReply = aiData.choices?.[0]?.message?.content ?? "";
    if (!aiReply) {
      return NextResponse.json({ error: "Empty AI response", detail: aiData }, { status: 500 });
    }

    const isComplete = aiReply.includes("INTERVIEW_COMPLETE");

    // Save user answer
    await addInterviewMessage({
      interviewId: interview.id,
      role:        "user",
      content:     answer.trim(),
      questionNo:  interview.currentQuestion,
    });

    if (isComplete) {
      let scores = {
        scoreOverall: 70, scoreClarity: 70,
        scoreRelevance: 70, scoreConfidence: 70,
        feedback: "Good effort overall.",
      };
      try {
        const jsonMatch = aiReply.match(/\{[\s\S]*?"feedback"\s*:\s*"[^"]*"[\s\S]*?\}/);
        if (jsonMatch) scores = { ...scores, ...JSON.parse(jsonMatch[0]) };
      } catch (e) {
        console.error("[interview] score parse error:", e);
      }

      const displayReply = aiReply
        .replace("INTERVIEW_COMPLETE", "")
        .replace(/\{[\s\S]*?"feedback"\s*:\s*"[^"]*"[\s\S]*?\}/, "")
        .trim() || "Thank you — that concludes our interview. I'll be in touch with feedback shortly.";

      await addInterviewMessage({ interviewId: interview.id, role: "assistant", content: displayReply });
      await completeInterview(interview.id, scores);

      return NextResponse.json({
        reply: displayReply, completed: true, scores,
        currentQuestion: interview.totalQuestions,
      });
    }

    const newQ = interview.currentQuestion + 1;
    await addInterviewMessage({
      interviewId: interview.id,
      role:        "assistant",
      content:     aiReply,
      questionNo:  newQ,
    });
    await updateInterviewProgress(interview.id, newQ);

    return NextResponse.json({ reply: aiReply, completed: false, currentQuestion: newQ });

  } catch (err: any) {
    console.error("[interview] unhandled error:", err);
    return NextResponse.json({ error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}