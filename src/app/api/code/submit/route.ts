// src/app/api/code/submit/route.ts
// Uses Judge0 CE public API — free, no key required.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { codingChallenges, codingSubmissions, codingProgress, users } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

export const dynamic     = "force-dynamic";
export const maxDuration = 30;

const JUDGE0  = "https://ce.judge0.com";
const LANG_ID: Record<string, number> = {
  javascript: 63,
  typescript: 74,
  python:     71,
  java:       62,
  cpp:        54,
  c:          50,
};

// ─── Parse input lines into typed JS values ───────────────────────────────────
function parseArgs(input: string): any[] {
  return input.trim().split("\n")
    .map(l => l.trim()).filter(Boolean)
    .map(l => { try { return JSON.parse(l); } catch { return l; } });
}

// ─── Convert a JS value to a Java literal expression ─────────────────────────
function javaLiteral(val: any): string {
  if (Array.isArray(val)) {
    if (val.length === 0) return "new int[]{}";
    if (typeof val[0] === "number") return `new int[]{${val.join(", ")}}`;
    if (typeof val[0] === "string") return `new String[]{${val.map((s: string) => `"${s}"`).join(", ")}}`;
    return `new Object[]{${val.map(javaLiteral).join(", ")}}`;
  }
  if (typeof val === "string") return `"${val}"`;
  if (typeof val === "boolean") return String(val);
  if (val === null) return "null";
  return String(val);
}

// ─── Build the full runnable source for a test case ──────────────────────────
function buildSource(language: string, userCode: string, input: string): string {
  const args    = parseArgs(input);
  const argsStr = args.map((a: any) => JSON.stringify(a)).join(", ");

  // ── JavaScript ────────────────────────────────────────────────────────────
  if (language === "javascript") {
    const m  = userCode.match(/^function\s+(\w+)\s*\(/m)
            ?? userCode.match(/^(?:const|let|var)\s+(\w+)\s*=\s*(?:function|\()/m);
    const fn = m?.[1];
    if (!fn) return userCode;
    return `${userCode}\n\nconst __r = ${fn}(${argsStr});\nif (__r !== undefined && __r !== null) process.stdout.write(JSON.stringify(__r));`;
  }

  // ── TypeScript (ts-node on Judge0) ────────────────────────────────────────
  if (language === "typescript") {
    // Strip return type annotations so ts-node doesn't complain about strict types
    const m  = userCode.match(/^function\s+(\w+)\s*\(/m)
            ?? userCode.match(/^(?:const|let|var)\s+(\w+)\s*=\s*(?:function|\()/m);
    const fn = m?.[1];
    if (!fn) return userCode;
    return `${userCode}\n\nconst __r: any = (${fn} as any)(${argsStr});\nif (__r !== undefined && __r !== null) process.stdout.write(JSON.stringify(__r));`;
  }

  // ── Python ────────────────────────────────────────────────────────────────
  if (language === "python") {
    const header = "from typing import List, Optional, Dict, Tuple, Any, Set\nimport json as _json\n";
    // class Solution style
    const method = userCode.match(/class\s+Solution[\s\S]*?def\s+(\w+)\s*\(self/m);
    if (method) {
      const fn = method[1];
      return `${header}\n${userCode}\n\n_sol = Solution()\n_r = _sol.${fn}(${argsStr})\nprint(_json.dumps(_r), end="")`;
    }
    // plain def style
    const plain = userCode.match(/^def\s+(\w+)\s*\(/m);
    if (plain) {
      const fn = plain[1];
      return `${header}\n${userCode}\n\n_r = ${fn}(${argsStr})\nif _r is not None:\n    print(_json.dumps(_r), end="")`;
    }
    return `${header}\n${userCode}`;
  }

  // ── Java ──────────────────────────────────────────────────────────────────
  if (language === "java") {
    // Find user's method (not main)
    const allMethods = [...userCode.matchAll(/public\s+\S+\s+(\w+)\s*\([^)]*\)\s*\{/g)];
    const fn = allMethods.map(m => m[1]).find(n => n !== "main") ?? "solve";
    const javaArgs = args.map(javaLiteral).join(", ");

    const toJsonHelper = `
    static String _toJson(Object o) {
        if (o == null) return "null";
        if (o instanceof int[]) {
            int[] a = (int[]) o;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
            return sb.append("]").toString();
        }
        if (o instanceof boolean[]) {
            boolean[] a = (boolean[]) o;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
            return sb.append("]").toString();
        }
        if (o instanceof List) {
            @SuppressWarnings("unchecked") List<Object> list = (List<Object>) o;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < list.size(); i++) { if (i > 0) sb.append(","); sb.append(_toJson(list.get(i))); }
            return sb.append("]").toString();
        }
        if (o instanceof String) return "\\"" + o.toString().replace("\\\\","\\\\\\\\").replace("\\"","\\\\\\"") + "\\"";
        return o.toString();
    }`;

    const newMain = `    public static void main(String[] args) {
        Solution _sol = new Solution();
        Object _r = _sol.${fn}(${javaArgs});
        System.out.print(_toJson(_r));
    }${toJsonHelper}`;

    // Replace existing main body
    const replaced = userCode.replace(
      /public\s+static\s+void\s+main\s*\(String\[\]\s+\w+\)\s*\{[\s\S]*?\n(\s*)\}/,
      newMain
    );
    // If no main was found, inject one before the last closing brace
    if (replaced === userCode) {
      return userCode.replace(/\}\s*$/, `\n${newMain}\n}`);
    }
    return replaced;
  }

  // ── C++ / C — user writes their own main ─────────────────────────────────
  return userCode;
}

// ─── Run one test case through Judge0 ────────────────────────────────────────
async function runTest(language: string, userCode: string, input: string) {
  const id = LANG_ID[language];
  if (!id) return { stdout: "", error: `Unsupported language: ${language}` };

  const source = buildSource(language, userCode, input);

  const res = await fetch(`${JUDGE0}/submissions?wait=true&base64_encoded=false`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language_id:     id,
      source_code:     source,
      stdin:           "",          // args are baked into source
      cpu_time_limit:  5,
      wall_time_limit: 10,
      memory_limit:    128000,
    }),
    signal: AbortSignal.timeout(20000),
  });

  if (!res.ok) return { stdout: "", error: `Judge0 HTTP ${res.status}` };

  const d = await res.json();
  const isErr = (d.status?.id ?? 0) > 3;
  return {
    stdout: (d.stdout ?? "").trim(),
    error:  isErr ? (d.compile_output || d.stderr || d.status?.description || "Runtime error").trim() : null,
    status: d.status?.description,
  };
}

// ─── Flexible output comparison ───────────────────────────────────────────────
function match(actual: string, expected: string): boolean {
  const a = actual.trim(), e = expected.trim();
  if (a === e || a.toLowerCase() === e.toLowerCase()) return true;
  try {
    const pa = JSON.parse(a), pe = JSON.parse(e);
    if (Array.isArray(pa) && Array.isArray(pe))
      return JSON.stringify([...pa].sort()) === JSON.stringify([...pe].sort());
    return JSON.stringify(pa) === JSON.stringify(pe);
  } catch {}
  return !isNaN(Number(a)) && !isNaN(Number(e)) && Math.abs(+a - +e) < 1e-9;
}

// ─── POST /api/code/submit ────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { challengeId, language, code } = await req.json();
    if (!challengeId || !language || !code)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // Find challenge
    let rows = await db.select().from(codingChallenges)
      .where(eq(codingChallenges.slug, challengeId)).limit(1);
    if (!rows.length) rows = await db.select().from(codingChallenges)
      .where(eq(codingChallenges.id, challengeId)).limit(1);
    if (!rows.length)
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });

    const challenge    = rows[0];
    const testCases    = (challenge.testCases as any[]) ?? [];
    const visibleTests = testCases.filter((t: any) => !t.isHidden);

    // Run each test sequentially (Judge0 rate limit: 5 req/s)
    const results: any[] = [];
    for (let i = 0; i < visibleTests.length; i++) {
      const tc  = visibleTests[i];
      const run = await runTest(language, code, tc.input);
      const got = run.error ? `Error: ${run.error}` : (run.stdout || "(no output)");
      const ok  = !run.error && match(run.stdout, tc.expectedOutput);
      results.push({
        testNumber:     i + 1,
        input:          tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput:   got,
        passed:         ok,
        error:          run.error ?? undefined,
        judgeStatus:    run.status,
      });
      if (i < visibleTests.length - 1) await new Promise(r => setTimeout(r, 300));
    }

    const passed     = results.filter(r => r.passed).length;
    const total      = results.length;
    const accepted   = passed === total && total > 0;
    const firstFail  = results.find(r => !r.passed);
    const feedback   = accepted
      ? "All test cases passed!"
      : firstFail?.error
        ? `Error on test ${firstFail.testNumber}: ${firstFail.error}`
        : `Test ${firstFail?.testNumber} failed — got "${firstFail?.actualOutput}", expected "${firstFail?.expectedOutput}"`;

    // First solve?
    const prev = await db.select({ id: codingSubmissions.id })
      .from(codingSubmissions)
      .where(and(
        eq(codingSubmissions.challengeId, challenge.id),
        eq(codingSubmissions.userId, session.user.id),
        eq(codingSubmissions.status, "accepted"),
      )).limit(1);
    const isFirstSolve = accepted && prev.length === 0;

    // Save submission
    const [sub] = await db.insert(codingSubmissions).values({
      challengeId:  challenge.id,
      userId:       session.user.id,
      language:     language as any,
      code,
      status:       accepted ? "accepted" : "wrong_answer" as any,
      passedTests:  passed,
      totalTests:   total,
      isFirstSolve,
    }).returning();

    // Award XP + update streak
    if (isFirstSolve) {
      const xp = (challenge.xpReward as number) ?? 50;
      await db.update(users).set({ xp: sql`xp + ${xp}` }).where(eq(users.id, session.user.id));

      const [prog] = await db.select().from(codingProgress)
        .where(eq(codingProgress.userId, session.user.id)).limit(1);

      if (prog) {
        const done   = (prog.completedDays as number[]) ?? [];
        const now    = new Date();
        const gap    = prog.lastSolvedAt
          ? Math.floor((now.getTime() - new Date(prog.lastSolvedAt).getTime()) / 86400000) : 999;
        const streak = gap <= 1 ? prog.streak + 1 : 1;
        await db.update(codingProgress).set({
          currentDay:    Math.min(100, Math.max(prog.currentDay, challenge.dayNumber + 1)),
          streak,
          longestStreak: Math.max(prog.longestStreak, streak),
          totalSolved:   prog.totalSolved + 1,
          lastSolvedAt:  now,
          completedDays: done.includes(challenge.dayNumber) ? done : [...done, challenge.dayNumber],
        }).where(eq(codingProgress.userId, session.user.id));
      } else {
        await db.insert(codingProgress).values({
          userId: session.user.id, currentDay: 2, streak: 1,
          longestStreak: 1, totalSolved: 1, lastSolvedAt: new Date(),
          completedDays: [challenge.dayNumber],
        }).onConflictDoNothing();
      }
    }

    return NextResponse.json({
      submission: sub, isFirstSolve,
      xpEarned: isFirstSolve ? (challenge.xpReward ?? 50) : 0,
      passed, total,
      status: accepted ? "accepted" : "wrong_answer",
      feedback, results,
    });

  } catch (err: any) {
    console.error("submit error:", err);
    return NextResponse.json({ error: err.message ?? "Failed" }, { status: 500 });
  }
}