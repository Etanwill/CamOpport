// src/app/api/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getJobs, createJob, getUserById } from "@/lib/db/queries";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { suggestedBitsCost } from "@/lib/bits";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const jobs = await getJobs({
      search:   searchParams.get("search")   ?? undefined,
      type:     searchParams.get("type")     ?? undefined,
      category: searchParams.get("category") ?? undefined,
      region:   searchParams.get("region")   ?? undefined,
      limit:    Number(searchParams.get("limit") ?? 50),
    });
    return NextResponse.json({ jobs });
  } catch (err) {
    console.error("GET /api/jobs error:", err);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await getUserById(session.user.id);
    if (!dbUser || dbUser.role !== "employer")
      return NextResponse.json({ error: "Only employers can post jobs" }, { status: 403 });

    const body = await req.json();

    const deadline = body.deadline ? new Date(body.deadline) : null;
    if (!deadline || isNaN(deadline.getTime()))
      return NextResponse.json({ error: "Invalid deadline date" }, { status: 400 });

    // Posting a job is free. The employer instead sets how many bits a job
    // seeker must spend to apply — this replaces the old paid-listing plans.
    let bitsCost = Number(body.bitsCost);
    if (!Number.isFinite(bitsCost) || bitsCost < 0) bitsCost = suggestedBitsCost(body.type);
    bitsCost = Math.max(0, Math.min(50, Math.round(bitsCost)));

    const job = await createJob({
      ...body,
      deadline,
      bitsCost,
      postedById:  session.user.id,
      // Automatically attach the employer's saved company logo
      companyLogo: dbUser.companyLogo ?? body.companyLogo ?? null,
    });
    return NextResponse.json({ job }, { status: 201 });
  } catch (err) {
    console.error("POST /api/jobs error:", err);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}