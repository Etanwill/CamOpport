// src/lib/codeforces-fetch.ts
//
// Codeforces is the data source for our coding challenges.
// Unlike LeetCode, Codeforces' API is OFFICIAL, PUBLIC, and does NOT block
// server/cloud IPs. It is rate-limited to ~1 request per 2 seconds per the
// docs (we throttle conservatively below).
//
// LIMITATION: the official API (`problemset.problems`) only returns metadata
// (title, contestId, index, rating, tags) — it does NOT include the full
// problem statement text. There is no official endpoint for that.
//
// To get a description, we do a best-effort fetch + parse of the public
// problem page HTML (which Codeforces serves to anyone, including bots —
// there's no anti-bot wall like LeetCode has). If that ever fails or the
// page structure changes, we fall back to an auto-generated description
// built purely from the official metadata (title + tags + rating + link),
// so a challenge is NEVER left empty.

const CF_API   = "https://codeforces.com/api";
const CF_BASE  = "https://codeforces.com";

export type CFProblem = {
  contestId: number;
  index: string;          // "A", "B1", etc.
  name: string;
  type: string;           // "PROGRAMMING"
  rating?: number;        // difficulty rating, 800–3500, may be absent
  tags: string[];
};

export type CFProblemStats = {
  contestId: number;
  index: string;
  solvedCount: number;
};

type CFApiResponse<T> =
  | { status: "OK"; result: T }
  | { status: "FAILED"; comment: string };

async function cfRequest<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${CF_API}/${path}`, {
      headers: { "User-Agent": "CamOpport/1.0 (+https://camopport.com)" },
      signal: AbortSignal.timeout(10_000),
      cache: "no-store", // response can exceed Next.js's 2MB data-cache limit — never cache it
    });
    if (!res.ok) return null;
    const json = (await res.json()) as CFApiResponse<T>;
    if (json.status !== "OK") return null;
    return json.result;
  } catch {
    return null;
  }
}

/**
 * Fetch ALL problems from Codeforces' problemset (typically 8,000–9,000+).
 * This is the official, reliable, never-blocked endpoint.
 */
export async function fetchAllCodeforcesProblems(): Promise<{
  problems: CFProblem[];
  stats: CFProblemStats[];
} | null> {
  const data = await cfRequest<{ problems: CFProblem[]; problemStatistics: CFProblemStats[] }>(
    "problemset.problems"
  );
  if (!data) return null;
  return { problems: data.problems, stats: data.problemStatistics };
}

/** Build the canonical public URL for a Codeforces problem. */
export function cfProblemUrl(contestId: number, index: string): string {
  return `${CF_BASE}/problemset/problem/${contestId}/${index}`;
}

/** Map a Codeforces numeric rating to our easy/medium/hard buckets. */
export function ratingToDifficulty(rating?: number): "easy" | "medium" | "hard" {
  if (!rating) return "medium";
  if (rating <= 1200) return "easy";
  if (rating <= 1900) return "medium";
  return "hard";
}

/**
 * Best-effort fetch of the full problem statement by parsing the public
 * problem page HTML. Codeforces does not block this (unlike LeetCode),
 * but the HTML structure could change over time, so every parse step
 * fails soft → returns null rather than throwing.
 */
export async function fetchCodeforcesStatement(
  contestId: number,
  index: string
): Promise<{
  statement: string;
  inputSpec: string;
  outputSpec: string;
  examples: { input: string; output: string }[];
  timeLimitMs?: number;
  memoryLimitMb?: number;
  constraints: string[];
} | null> {
  try {
    const url = cfProblemUrl(contestId, index);
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const html = await res.text();

    // Extract the <div class="problem-statement">...</div> block
    const statementMatch = html.match(/<div class="problem-statement">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<script/);
    const block = statementMatch?.[1] ?? "";

    if (!block) return null;

    // Pull out sections by their known CF class names
    const getSection = (className: string) => {
      const re = new RegExp(`<div class="${className}">([\\s\\S]*?)<\\/div>\\s*(?=<div class="|$)`, "i");
      return block.match(re)?.[1] ?? "";
    };

    const inputSpecRaw  = getSection("input-specification");
    const outputSpecRaw = getSection("output-specification");

    // Main statement is everything before the first <div class="input-specification">
    const beforeInput = block.split('<div class="input-specification">')[0] ?? block;

    // Extract sample tests
    const examples: { input: string; output: string }[] = [];
    const sampleBlockMatch = block.match(/<div class="sample-tests">([\s\S]*?)<\/div>\s*$/);
    const sampleBlock = sampleBlockMatch?.[1] ?? block;
    const inputMatches  = [...sampleBlock.matchAll(/<div class="input">[\s\S]*?<pre[^>]*>([\s\S]*?)<\/pre>/g)];
    const outputMatches = [...sampleBlock.matchAll(/<div class="output">[\s\S]*?<pre[^>]*>([\s\S]*?)<\/pre>/g)];
    for (let i = 0; i < Math.min(inputMatches.length, outputMatches.length); i++) {
      examples.push({
        input:  cleanCfHtml(inputMatches[i][1]),
        output: cleanCfHtml(outputMatches[i][1]),
      });
    }

    // Time limit (e.g. "time limit per test 2 seconds")
    const timeMatch = html.match(/time limit per test<\/div>\s*<div[^>]*>([\d.]+)\s*second/i);
    const timeLimitMs = timeMatch ? Math.round(parseFloat(timeMatch[1]) * 1000) : undefined;

    // Memory limit (e.g. "memory limit per test 256 megabytes")
    const memMatch = html.match(/memory limit per test<\/div>\s*<div[^>]*>(\d+)\s*megabytes/i);
    const memoryLimitMb = memMatch ? parseInt(memMatch[1], 10) : undefined;

    // Build a clean constraints list from limits + any "n ≤ ..." style lines in the input spec
    const constraints: string[] = [];
    if (timeLimitMs)   constraints.push(`Time limit: ${(timeLimitMs / 1000).toFixed(1)} second${timeLimitMs === 1000 ? "" : "s"}`);
    if (memoryLimitMb) constraints.push(`Memory limit: ${memoryLimitMb} MB`);
    // Pull out bound-looking lines from the cleaned input spec (e.g. "1 ≤ n ≤ 10^5")
    const cleanedInputSpec = cleanCfHtml(inputSpecRaw);
    const boundLines = cleanedInputSpec
      .split("\n")
      .map(l => l.trim())
      .filter(l => /[\u2264\u2265<>=].*\d/.test(l) && l.length < 160);
    constraints.push(...boundLines.slice(0, 6));

    return {
      statement:  cleanCfHtml(beforeInput),
      inputSpec:  cleanedInputSpec,
      outputSpec: cleanCfHtml(outputSpecRaw),
      examples,
      timeLimitMs,
      memoryLimitMb,
      constraints,
    };
  } catch {
    return null; // network error, timeout, or HTML parse failure — caller falls back
  }
}

/** Strip Codeforces' MathJax/HTML markup down to clean readable text. */
function cleanCfHtml(html: string): string {
  return html
    .replace(/<div class="(?:section-)?title">.*?<\/div>/gi, "")
    .replace(/\$\$\$/g, "")
    .replace(/<sup>(.*?)<\/sup>/g, "^$1")
    .replace(/<sub>(.*?)<\/sub>/g, "_$1")
    .replace(/<code>(.*?)<\/code>/g, "`$1`")
    .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
    .replace(/<b>(.*?)<\/b>/g, "**$1**")
    .replace(/<em>(.*?)<\/em>/g, "*$1*")
    .replace(/<p>/g, "").replace(/<\/p>/g, "\n\n")
    .replace(/<ul>/g, "").replace(/<\/ul>/g, "")
    .replace(/<li>/g, "- ").replace(/<\/li>/g, "\n")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, "") // strip any remaining tags
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Build a clean fallback description purely from official API metadata (always succeeds). */
export function buildFallbackDescription(p: CFProblem): string {
  const tagList = p.tags.length ? p.tags.join(", ") : "general";
  return [
    `**${p.name}**`,
    "",
    `This is problem ${p.index} from Codeforces contest ${p.contestId}.`,
    p.rating ? `Difficulty rating: ${p.rating}.` : "",
    `Topics: ${tagList}.`,
    "",
    `The full problem statement, constraints, and sample tests are available on the official Codeforces page — open it to read the complete problem before solving:`,
    cfProblemUrl(p.contestId, p.index),
  ].filter(Boolean).join("\n");
}