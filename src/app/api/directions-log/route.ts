// src/app/api/directions-log/route.ts
//
// Fire-and-forget endpoint the map pings whenever someone clicks
// "Get Directions". It exists purely so you can watch your server console
// (or your hosting provider's log viewer, e.g. `vercel logs`) and confirm
// the browser really did read the user's live location and compute a route
// to the venue's real coordinates — nothing here affects the UI, it's just
// a verification/debugging log.
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      venueName, venueCity, zone,
      userLat, userLng, accuracy, venueLat, venueLng,
      distance, duration, source,
    } = body ?? {};

    const accuracyNote = typeof accuracy === "number"
      ? (accuracy > 1000 ? `${Math.round(accuracy)}m accuracy — ⚠️ IP/network estimate, not real GPS` : `${Math.round(accuracy)}m accuracy`)
      : "accuracy unknown";

    console.log(
      `[directions] "${venueName ?? "?"}" (${zone ? zone + ", " : ""}${venueCity ?? "?"}) ` +
      `| user=(${userLat}, ${userLng}) [${accuracyNote}] → venue=(${venueLat}, ${venueLng}) ` +
      `| ${distance ?? "?"} / ${duration ?? "?"} | source=${source ?? "?"} ` +
      `| at ${new Date().toISOString()}`
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/directions-log error:", err);
    // Never let logging failures affect the map — just report it and move on.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}