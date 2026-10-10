// src/app/api/geocode/route.ts
//
// Turns a free-text "zone" (e.g. "Bonapriso, near Total station") plus a
// city/region into real coordinates, using OpenStreetMap's Nominatim search
// API — free, no API key required. This is proxied through our own server
// (rather than called from the browser) because Nominatim's usage policy
// requires a descriptive User-Agent / Referer, and because it keeps the
// endpoint swappable later without touching any client code.
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    if (!q) return NextResponse.json({ error: "Missing query" }, { status: 400 });

    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=cm&q=${encodeURIComponent(q)}`;

    const res = await fetch(url, {
      headers: {
        // Nominatim's usage policy asks for an identifying User-Agent.
        "User-Agent": "CamOpport/1.0 (job & competition listings, Cameroon)",
        "Accept-Language": "en",
      },
      cache: "no-store",
    });

    if (!res.ok) return NextResponse.json({ error: "Geocoding service unavailable" }, { status: 502 });

    const results = await res.json();
    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ error: "Location not found. Try a more specific zone (e.g. neighbourhood + landmark)." }, { status: 404 });
    }

    const match = results[0];
    return NextResponse.json({
      latitude:    parseFloat(match.lat),
      longitude:   parseFloat(match.lon),
      displayName: match.display_name as string,
    });
  } catch (err) {
    console.error("GET /api/geocode error:", err);
    return NextResponse.json({ error: "Failed to geocode location" }, { status: 500 });
  }
}