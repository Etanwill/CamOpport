// src/app/api/employer/jobs/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getJobsByEmployerWithCounts } from "@/lib/db/queries";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const jobs = await getJobsByEmployerWithCounts(session.user.id);
  return NextResponse.json({ jobs });
}