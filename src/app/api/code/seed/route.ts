// src/app/api/code/seed/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { codingChallenges } from "@/lib/db/schema";
import { CODING_DAYS } from "@/lib/db/coding-seed-data";
import { eq, sql } from "drizzle-orm";

export const dynamic     = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const onlyDay = searchParams.get("day") ? parseInt(searchParams.get("day")!) : null;

  try {
    const days = onlyDay
      ? CODING_DAYS.filter(d => d.dayNumber === onlyDay)
      : CODING_DAYS;

    if (days.length === 0)
      return NextResponse.json({ error: `Day ${onlyDay} not found` }, { status: 404 });

    // Wipe existing data first — use DELETE (TRUNCATE can fail with FK constraints on Neon)
    if (onlyDay) {
      await db.execute(sql`DELETE FROM coding_challenges WHERE day_number = ${onlyDay}`);
    } else {
      await db.execute(sql`DELETE FROM coding_submissions`);
      await db.execute(sql`DELETE FROM coding_challenges`);
    }

    let inserted = 0;
    let lastSlug = "";

    for (const day of days) {
      for (const problem of day.problems) {
        lastSlug = problem.slug;
        // Sanitise every jsonb field — replace undefined with safe defaults
        const row = {
          dayNumber:   day.dayNumber,
          title:       problem.title       ?? `Day ${day.dayNumber} Problem`,
          slug:        problem.slug,
          difficulty:  problem.difficulty  ?? "easy",
          category:    problem.category    ?? "mixed",
          description: problem.description ?? "",
          examples:    Array.isArray(problem.examples)    ? problem.examples    : [],
          constraints: Array.isArray(problem.constraints) ? problem.constraints : [],
          hints:       Array.isArray(problem.hints)       ? problem.hints       : [],
          tags:        Array.isArray(problem.tags)        ? problem.tags        : [],
          starterCode: (problem.starterCode && typeof problem.starterCode === "object")
                         ? problem.starterCode
                         : { javascript: "// your code here" },
          testCases:   Array.isArray(problem.testCases)   ? problem.testCases   : [],
          xpReward:    problem.xpReward    ?? 50,
          source:      "custom" as const,
          externalUrl: null,
          cfRating:    null,
        };

        await db.insert(codingChallenges)
          .values(row)
          .onConflictDoUpdate({
            target: codingChallenges.slug,
            set: {
              title:       row.title,
              difficulty:  row.difficulty,
              category:    row.category,
              description: row.description,
              examples:    row.examples,
              constraints: row.constraints,
              hints:       row.hints,
              tags:        row.tags,
              starterCode: row.starterCode,
              testCases:   row.testCases,
              xpReward:    row.xpReward,
            },
          });
        inserted++;
      }
    }

    return NextResponse.json({
      success:    true,
      message:    `Seeded ${days.length} day(s) — ${inserted} problems inserted`,
      daysSeeded: days.length,
      inserted,
    });

  } catch (err: any) {
    console.error("Seed error at slug:", err);
    return NextResponse.json({ error: err.message ?? "Seed failed" }, { status: 500 });
  }
}