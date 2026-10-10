// src/app/api/debug-session/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserByEmail } from "@/lib/db/queries";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not logged in" });
  }

  // Also pull directly from DB so we can compare
  const dbUser = await getUserByEmail(session.user.email);

  return NextResponse.json({
    session_user: session.user,
    db_user: dbUser ? {
      id:          dbUser.id,
      name:        dbUser.name,
      role:        dbUser.role,
      companyName: dbUser.companyName,
      companyLogo: dbUser.companyLogo,
    } : null,
  });
}