// src/app/api/employer/competitions/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCompetitionsByEmployerWithCounts } from "@/lib/db/queries";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const competitions = await getCompetitionsByEmployerWithCounts(session.user.id);
  return NextResponse.json({ competitions });
}