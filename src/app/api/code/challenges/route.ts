// src/app/api/code/challenges/route.ts
// Returns the list of all 100 days with metadata and user progress.

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { codingChallenges, codingProgress, codingSubmissions } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CODING_DAYS } from "@/lib/db/coding-seed-data";

export async function GET() {
  try {
    // Get topic, lesson and count from DB (first problem per day has the day's topic via seed)
    const dayCounts = await db
      .select({
        dayNumber: codingChallenges.dayNumber,
        count:     sql<number>`count(*)::int`,
      })
      .from(codingChallenges)
      .groupBy(codingChallenges.dayNumber);

    // Also fetch one representative row per day to get category (topic stored in seed-data)
    const countMap = Object.fromEntries(dayCounts.map(r => [r.dayNumber, r.count]));

    // Build a topic map from DB titles for days not in CODING_DAYS
    // We get the actual topic from CODING_DAYS or fall back to DB slugs
    const dbTopicMap: Record<number, { topic: string; lesson: string }> = {};

    const session = await getServerSession(authOptions);
    let completedDays: number[] = [];
    let currentDay = 1;
    let streak = 0;
    let solvedAt: string[] = [];

    if (session?.user?.id) {
      const prog = await db
        .select()
        .from(codingProgress)
        .where(eq(codingProgress.userId, session.user.id))
        .limit(1);
      if (prog[0]) {
        completedDays = (prog[0].completedDays as number[]) ?? [];
        currentDay    = Math.min(100, prog[0].currentDay);
        streak        = prog[0].streak;
      }

      // Real accepted-submission timestamps for the last 14 days, used to
      // render an actual (not simulated) daily solve streak in the UI.
      const fortnightAgo = new Date();
      fortnightAgo.setDate(fortnightAgo.getDate() - 14);
      const recentAccepted = await db
        .select({ submittedAt: codingSubmissions.submittedAt })
        .from(codingSubmissions)
        .where(and(
          eq(codingSubmissions.userId, session.user.id),
          eq(codingSubmissions.status, "accepted"),
          sql`${codingSubmissions.submittedAt} >= ${fortnightAgo}`
        ));
      solvedAt = recentAccepted.map(r => new Date(r.submittedAt).toISOString());
    }

    // Build response — one entry per day
    // Import topic data from the separate day routes' seed data
    const DAY_TOPICS: Record<number, { topic: string; lesson: string }> = {
      16: { topic: "Binary Search Trees", lesson: "BST: left < root < right. Inorder traversal gives sorted output. Validate by passing min/max bounds recursively." },
      17: { topic: "Heaps & Priority Queues", lesson: "Min-heap: parent <= children. Insert/extract O(log n). Get min O(1). Use for top-K problems, Dijkstra, and task scheduling." },
      18: { topic: "Tries (Prefix Trees)", lesson: "Trie stores strings character by character. Each node has 26 children and an isEnd flag. Insert/search/startsWith all O(L)." },
      19: { topic: "Advanced DP — Knapsack", lesson: "0/1 Knapsack: dp[i][w] = max value using first i items with capacity w. Space optimize to 1D by traversing backwards." },
      20: { topic: "Advanced DP — Strings", lesson: "String DP uses a 2D table where dp[i][j] = answer for substrings ending at indices i and j. LCS, Edit Distance, Palindromes." },
      21: { topic: "Union Find", lesson: "Union-Find tracks connected components. find(x) with path compression is nearly O(1). union by rank keeps trees flat." },
      22: { topic: "Shortest Path — Dijkstra", lesson: "Dijkstra finds shortest paths with non-negative weights. Min-heap: always process node with smallest known distance first." },
      23: { topic: "Bit Manipulation", lesson: "n&(n-1) clears lowest bit. a^a=0. XOR finds unique elements in O(n) O(1). Check bit i: (n>>i)&1." },
      24: { topic: "Math & Number Theory", lesson: "GCD via Euclidean: gcd(a,b)=gcd(b,a%b). Sieve for primes in O(n log log n). Fast power: a^n in O(log n)." },
      25: { topic: "Monotonic Stack", lesson: "Monotonic stack maintains increasing or decreasing order. Used for Next Greater Element, Largest Rectangle, Trapping Rain Water. O(n)." },
      26: { topic: "Design Problems", lesson: "Design: identify which operations need O(1) then build accordingly. LRU Cache = doubly linked list + hashmap." },
      27: { topic: "Intervals", lesson: "Sort by start to merge. Sort by end to greedily keep non-overlapping. Meeting rooms: sort + min-heap of end times." },
      28: { topic: "Topological Sort", lesson: "Orders DAG nodes so all edges point forward. Kahn's: track in-degrees, process 0-in-degree queue. Cycle = impossible." },
      29: { topic: "Minimum Spanning Trees", lesson: "MST connects all nodes with minimum total edge weight. Kruskal: sort edges, add if no cycle. Prim: min-heap greedy." },
      30: { topic: "DP Review Day", lesson: "DP review: define state, write recurrence, handle base cases. Patterns: linear, grid, knapsack, string DP." },
    };

    const days = Array.from({ length: 100 }, (_, i) => {
      const dayNum   = i + 1;
      const meta     = CODING_DAYS.find(d => d.dayNumber === dayNum);
      const override = DAY_TOPICS[dayNum];
      const isSeeded = (countMap[dayNum] ?? 0) > 0;
      return {
        dayNumber:    dayNum,
        topic:        override?.topic  ?? meta?.topic  ?? `Day ${dayNum}`,
        lesson:       override?.lesson ?? meta?.lesson ?? "",
        problemCount: countMap[dayNum] ?? 5,
        isSeeded,
        isCompleted:  completedDays.includes(dayNum),
        isUnlocked:   dayNum <= currentDay,
        isCurrent:    dayNum === currentDay,
      };
    });

    return NextResponse.json({ days, streak, currentDay, completedCount: completedDays.length, solvedAt });

  } catch (err: any) {
    console.error("GET /api/code/challenges error:", err);
    return NextResponse.json({ error: "Failed to fetch challenges" }, { status: 500 });
  }
}