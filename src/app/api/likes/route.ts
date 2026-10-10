// src/app/api/likes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { toggleLike, isLiked, getLikeCount, getLikedOpportunities } from "@/lib/db/queries";

// GET /api/likes
//   ?targetType=job&targetId=xxx  → { liked, count } for one item
//   ?all=true                     → array of all likes for current user
export async function GET(req: NextRequest) {
  const session          = await getServerSession(authOptions);
  const { searchParams } = req.nextUrl;
  const all              = searchParams.get("all");

  // Return all liked items for current user
  if (all === "true") {
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const items = await getLikedOpportunities(session.user.id);
    return NextResponse.json(items);
  }

  // Return like state + count for a single item
  const targetType = searchParams.get("targetType") as "job" | "competition";
  const targetId   = searchParams.get("targetId") ?? "";

  if (!targetType || !targetId || !["job", "competition"].includes(targetType)) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  const [count, liked] = await Promise.all([
    getLikeCount(targetType, targetId),
    session?.user?.id ? isLiked(session.user.id, targetType, targetId) : Promise.resolve(false),
  ]);

  return NextResponse.json({ liked, count });
}

// POST /api/likes — toggle like
// body: { targetType: "job" | "competition", targetId: string }
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { targetType, targetId } = await req.json();
  if (!targetType || !targetId || !["job", "competition"].includes(targetType)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const nowLiked = await toggleLike(session.user.id, targetType, targetId);
  const count    = await getLikeCount(targetType, targetId);

  return NextResponse.json({ liked: nowLiked, count });
}