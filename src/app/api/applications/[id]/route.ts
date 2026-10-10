// src/app/api/applications/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateApplicationStatus, getJobById, getUserById, createNotification } from "@/lib/db/queries";
import { db } from "@/lib/db";
import { jobApplications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const STATUS_LABELS: Record<string, string> = {
  reviewed:    "Your application has been reviewed",
  shortlisted: "🎉 You've been shortlisted!",
  rejected:    "Application decision received",
  hired:       "🎊 Congratulations — you've been hired!",
  pending:     "Application status updated",
};

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getUserById(session.user.id);
  if (!user || user.role !== "employer")
    return NextResponse.json({ error: "Only employers can update application status" }, { status: 403 });

  const { status } = await req.json();
  const valid = ["pending","reviewed","shortlisted","rejected","hired"];
  if (!valid.includes(status))
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  // Verify the application belongs to a job owned by this employer
  const [application] = await db.select().from(jobApplications).where(eq(jobApplications.id, params.id)).limit(1);
  if (!application) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const job = await getJobById(application.jobId);
  if (!job || job.postedById !== session.user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const updated = await updateApplicationStatus(params.id, status as any);

  // 🔔 Notify the applicant of the status change
  if (status !== "pending") {
    try {
      await createNotification({
        userId: application.userId,
        type:   "application_update",
        title:  STATUS_LABELS[status] ?? "Application status updated",
        body:   `Your application for "${job.title}" at ${job.company} is now: ${status}.`,
        link:   `/jobs/${job.id}`,
      });
    } catch { /* non-blocking */ }
  }

  return NextResponse.json({ application: updated[0] });
}