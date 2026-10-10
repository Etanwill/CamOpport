// src/app/api/competitions/[id]/my-registration/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserRegistration } from "@/lib/db/queries";

// Reads the session via cookies, which already makes Next.js treat this as
// dynamic — but setting it explicitly removes any ambiguity.
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ registration: null });
    const registration = await getUserRegistration(params.id, session.user.id);
    return NextResponse.json({ registration });
  } catch (err) {
    console.error("GET /api/competitions/[id]/my-registration error:", err);
    return NextResponse.json({ registration: null });
  }
}