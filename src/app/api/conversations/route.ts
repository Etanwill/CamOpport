// src/app/api/conversations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getUserById, getJobById, getUserApplicationForJob,
  getOrCreateConversation, getUserConversations,
} from "@/lib/db/queries";

// GET /api/conversations — list the current user's conversations (as job seeker or employer)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await getUserConversations(session.user.id);
  return NextResponse.json({ items });
}

// POST /api/conversations — get or create the conversation for a given job.
// Job seekers: start a chat with the job's employer (must have applied first).
// Employers: start a chat with a specific applicant on their own job listing.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getUserById(session.user.id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { jobId, jobSeekerId } = await req.json().catch(() => ({}));
  if (!jobId) return NextResponse.json({ error: "jobId is required" }, { status: 400 });

  const job = await getJobById(jobId);
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  if (!job.postedById) return NextResponse.json({ error: "This job has no employer to message" }, { status: 400 });

  let seekerId: string;

  if (user.role === "employer") {
    // Employer must own this job, and must supply which applicant to message
    if (job.postedById !== user.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (!jobSeekerId)
      return NextResponse.json({ error: "jobSeekerId is required" }, { status: 400 });

    const application = await getUserApplicationForJob(jobSeekerId, jobId);
    if (!application)
      return NextResponse.json({ error: "That person hasn't applied to this job" }, { status: 404 });

    seekerId = jobSeekerId;
  } else {
    // Job seeker chatting about a job they applied to
    const application = await getUserApplicationForJob(user.id, jobId);
    if (!application)
      return NextResponse.json({ error: "Apply to this job before messaging the employer" }, { status: 403 });

    seekerId = user.id;
  }

  const conversation = await getOrCreateConversation(jobId, seekerId, job.postedById);
  return NextResponse.json({ conversation }, { status: 201 });
}