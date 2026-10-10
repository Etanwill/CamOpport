// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUserProfile, getUserBadges, getUserApplications, getUserQuizAttempts } from "@/lib/db/queries";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [user, badges, applications, quizAttempts] = await Promise.all([
      getUserById(session.user.id),
      getUserBadges(session.user.id),
      getUserApplications(session.user.id),
      getUserQuizAttempts(session.user.id),
    ]);

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { passwordHash: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser, badges, applications, quizAttempts });
  } catch (err) {
    console.error("GET /api/profile error:", err);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const updated = await updateUserProfile(session.user.id, data);
    const { passwordHash: _, ...safeUser } = updated;
    return NextResponse.json({ user: safeUser });
  } catch (err) {
    console.error("PATCH /api/profile error:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}