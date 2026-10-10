// src/app/api/discussions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDiscussions, createDiscussion } from "@/lib/db/queries";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetType = searchParams.get("targetType") ?? "";
  const targetId   = searchParams.get("targetId")   ?? "";
  if (!targetType || !targetId)
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  const list = await getDiscussions(targetType, targetId);
  return NextResponse.json({ discussions: list });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Sign in to comment" }, { status: 401 });
    const { targetType, targetId, body, parentId } = await req.json();
    if (!body?.trim()) return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
    const discussion = await createDiscussion({ targetType, targetId, userId: session.user.id, body, parentId });
    return NextResponse.json({ discussion }, { status: 201 });
  } catch (err) {
    console.error("POST /api/discussions error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}