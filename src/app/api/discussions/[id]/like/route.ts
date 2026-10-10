// src/app/api/discussions/[id]/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import { likeDiscussion } from "@/lib/db/queries";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  await likeDiscussion(params.id);
  return NextResponse.json({ success: true });
}