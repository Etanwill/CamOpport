// src/app/api/conversations/[id]/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getConversationById, getConversationMessages,
  sendMessage, markConversationRead,
} from "@/lib/db/queries";

// GET /api/conversations/[id]/messages — fetch the thread, then mark incoming messages read
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conversation = await getConversationById(params.id);
  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (conversation.jobSeekerId !== session.user.id && conversation.employerId !== session.user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const items = await getConversationMessages(params.id);
  await markConversationRead(params.id, session.user.id).catch(() => {});

  return NextResponse.json({ items });
}

// POST /api/conversations/[id]/messages — send a message in this conversation
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conversation = await getConversationById(params.id);
  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (conversation.jobSeekerId !== session.user.id && conversation.employerId !== session.user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { body } = await req.json().catch(() => ({}));
  const text = typeof body === "string" ? body.trim() : "";
  if (!text) return NextResponse.json({ error: "Message can't be empty" }, { status: 400 });
  if (text.length > 4000) return NextResponse.json({ error: "Message is too long" }, { status: 400 });

  const message = await sendMessage(params.id, session.user.id, text);
  return NextResponse.json({ message }, { status: 201 });
}