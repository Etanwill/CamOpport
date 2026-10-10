// src/app/api/jobs/[id]/apply/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { applyToJob, getJobById, getUserById, getUserApplicationForJob } from "@/lib/db/queries";

// GET /api/jobs/[id]/apply — check whether the current user has already applied
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ applied: false, application: null });

  const application = await getUserApplicationForJob(session.user.id, params.id);
  return NextResponse.json({ applied: !!application, application });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getUserById(session.user.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.role === "employer")
      return NextResponse.json({ error: "Employers cannot apply for jobs. Switch to a job seeker account." }, { status: 403 });

    const job = await getJobById(params.id);
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    // Enforce application deadline
    if (job.deadline && new Date(job.deadline) < new Date())
      return NextResponse.json({ error: "The application deadline for this job has passed." }, { status: 410 });

    // Enforce listing plan expiry
    if (job.planExpiresAt && new Date(job.planExpiresAt) < new Date())
      return NextResponse.json({ error: "This job listing is no longer active." }, { status: 410 });

    const body = await req.json().catch(() => ({}));
    const isCasual = ["gig", "one-day"].includes(job.type);

    const result = await applyToJob(params.id, session.user.id, {
      isCasual,
      coverLetter:  body.coverLetter,
      resumeUrl:    body.resumeUrl    || user.resumeUrl    || undefined,
      linkedinUrl:  body.linkedinUrl  || user.linkedinUrl  || undefined,
      portfolioUrl: body.portfolioUrl || user.portfolioUrl || undefined,
      phone:        body.phone        || user.phone        || undefined,
      availability: body.availability,
      note:         body.note,
    });

    if ((result as any).error === "insufficient_bits") {
      return NextResponse.json({
        error:    `You need ${(result as any).bitsCost} bits to apply for this job. Buy more bits to continue.`,
        code:     "insufficient_bits",
        bitsCost: (result as any).bitsCost,
      }, { status: 402 });
    }
    if ((result as any).error)
      return NextResponse.json({ error: (result as any).error }, { status: 409 });

    return NextResponse.json({ application: result }, { status: 201 });
  } catch (err) {
    console.error("POST /api/jobs/[id]/apply error:", err);
    return NextResponse.json({ error: "Failed to apply" }, { status: 500 });
  }
}