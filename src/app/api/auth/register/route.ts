import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/db/queries";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, email, password, role, city, region,
      // Job Seeker
      currentJobTitle, experienceLevel, linkedinUrl, portfolioUrl,
      skills, preferredJobTypes, preferredCategories,
      // Employer
      companyName, companySize, industrySector,
      companyWebsite, companyDescription, contactPhone,
    } = body;

    if (!name || !email || !password)
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    if (password.length < 6)
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    if (!["job_seeker", "employer"].includes(role))
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    if (role === "employer" && !companyName)
      return NextResponse.json({ error: "Company name is required for employers" }, { status: 400 });

    const existing = await getUserByEmail(email);
    if (existing)
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });

    const user = await createUser({
      name, email, password, role, city, region,
      currentJobTitle, experienceLevel, linkedinUrl, portfolioUrl,
      skills, preferredJobTypes, preferredCategories,
      companyName, companySize, industrySector,
      companyWebsite, companyDescription, contactPhone,
    });

    const { passwordHash: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
