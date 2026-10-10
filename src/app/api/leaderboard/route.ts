import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/db/queries";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit  = Number(searchParams.get("limit") ?? 100);
    const region = searchParams.get("region") ?? undefined;
    const leaderboard = await getLeaderboard({ limit, region });
    return NextResponse.json({ leaderboard });
  } catch (err) {
    console.error("GET /api/leaderboard error:", err);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}