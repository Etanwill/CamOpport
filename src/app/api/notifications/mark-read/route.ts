// src/app/api/notifications/mark-read/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { markNotificationsRead } from "@/lib/db/queries";

// POST /api/notifications/mark-read
// body (optional): { ids: string[] }  — omit to mark ALL as read
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let ids: string[] | undefined;
  try {
    const body = await req.json();
    ids = body?.ids;
  } catch {
    // body is empty — mark all
  }

  await markNotificationsRead(session.user.id, ids);
  return NextResponse.json({ ok: true });
}