// src/app/api/employer/applicants/[jobId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getJobApplicants, getJobById } from "@/lib/db/queries";

export async function GET(_req: NextRequest, { params }: { params: { jobId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const job = await getJobById(params.jobId);
  if (!job || job.postedById !== session.user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const applicants = await getJobApplicants(params.jobId);
  return NextResponse.json({ applicants });
}