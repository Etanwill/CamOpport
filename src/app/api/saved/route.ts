import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getSavedOpportunities,
  saveOpportunity,
  unsaveOpportunity,
  isOpportunitySaved,
} from "@/lib/db/queries";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const saved = await getSavedOpportunities(session.user.id);
  return NextResponse.json(saved);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { targetType, targetId } = await req.json();
  if (!targetType || !targetId || !["job", "competition"].includes(targetType)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const alreadySaved = await isOpportunitySaved(session.user.id, targetType, targetId);
  if (alreadySaved) {
    await unsaveOpportunity(session.user.id, targetType, targetId);
    return NextResponse.json({ saved: false });
  }
  await saveOpportunity(session.user.id, targetType, targetId);
  return NextResponse.json({ saved: true });
}