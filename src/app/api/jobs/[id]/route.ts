// src/app/api/jobs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getJobById, updateJob } from "@/lib/db/queries";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Force this route to always hit the database on every request. Without this,
// Next.js can statically cache a GET route handler that has no dynamic APIs
// (no cookies/headers/searchParams), which would keep serving a stale
// snapshot of the job — e.g. an old `deadline` — even after the row is
// updated directly in the database.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const job = await getJobById(params.id);
    if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ job }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("GET /api/jobs/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await getJobById(params.id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (existing.postedById !== session.user.id)
      return NextResponse.json({ error: "You can only edit your own job postings" }, { status: 403 });

    const body = await req.json();
    const update: Record<string, any> = {};

    // Only pull through fields that were actually sent — a PATCH here is a
    // full-form re-save from the edit page, but we still guard field-by-field
    // so a partial payload can never wipe out other columns.
    const passthrough = [
      "title", "description", "requirements", "category", "type",
      "city", "region", "salaryMin", "salaryMax", "salaryPeriod",
      "isRemote", "tags", "bitsCost", "isActive", "zone", "latitude", "longitude",
    ];
    for (const key of passthrough) {
      if (body[key] !== undefined) update[key] = body[key];
    }
    if (body.deadline !== undefined) {
      const deadline = new Date(body.deadline);
      if (isNaN(deadline.getTime())) return NextResponse.json({ error: "Invalid deadline date" }, { status: 400 });
      update.deadline = deadline;
    }
    if (update.bitsCost !== undefined) {
      update.bitsCost = Math.max(0, Math.min(50, Math.round(Number(update.bitsCost))));
    }

    const job = await updateJob(params.id, session.user.id, update);
    if (!job) return NextResponse.json({ error: "Failed to update job" }, { status: 404 });
    return NextResponse.json({ job });
  } catch (err) {
    console.error("PATCH /api/jobs/[id] error:", err);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}