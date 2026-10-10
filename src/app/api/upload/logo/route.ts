// src/app/api/upload/logo/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateUserProfile, syncEmployerLogoToListings } from "@/lib/db/queries";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("logo") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Use JPG, PNG, WebP, GIF or SVG." }, { status: 400 });
    }
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum is 2MB." }, { status: 400 });
    }

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext    = file.name.split(".").pop() || "png";
    const filename  = `${session.user.id}-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "logos");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    const logoUrl = `/uploads/logos/${filename}`;

    // 1. Save to user profile (companyLogo field)
    await updateUserProfile(session.user.id, { companyLogo: logoUrl } as any);

    // 2. Propagate to all jobs & competitions this employer has posted
    await syncEmployerLogoToListings(session.user.id, logoUrl);

    return NextResponse.json({ logoUrl });
  } catch (err) {
    console.error("Logo upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}