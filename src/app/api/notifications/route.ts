// src/app/api/notifications/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getNotifications, getUnreadNotificationCount } from "@/lib/db/queries";

// GET /api/notifications — fetch notifications + unread count
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [items, unreadCount] = await Promise.all([
    getNotifications(session.user.id, 20),
    getUnreadNotificationCount(session.user.id),
  ]);

  return NextResponse.json({ items, unreadCount });
}