// src/app/code/day/[day]/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

// Load Monaco lazily — it's large and must be client-only
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ChevronLeft, ChevronRight, CheckCircle,
  BookOpen, Code2, Lightbulb, Trophy, Play, RotateCcw, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

type TestCase = { input: string; expectedOutput: string };
type Problem  = {
  id: string;
  title: string;
  slug: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  hints: string[];
  tags: string[];
  starterCode: Record<string, string>;
  testCases: TestCase[];
  xpReward: number;
};
type DayData = {
  day: number;
  topic: string;
  lesson: string;
  problems: Problem[];
  progress: any;
  submissions: any[];
};

const LANGUAGES = ["javascript", "python", "typescript", "java", "cpp"];


// Monaco language ID map
const MONACO_LANG: Record<string, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python:     "python",
  java:       "java",
  cpp:        "cpp",
  c:          "c",
};

const DIFF_COLOR: Record<string, string> = {
  easy:   "text-green-600 bg-green-50 border-green-200",
  medium: "text-amber-600 bg-amber-50 border-amber-200",
  hard:   "text-red-600 bg-red-50 border-red-200",
};

export default function ChallengeDay() {
  const { day }             = useParams<{ day: string }>();
  const router              = useRouter();
  const { data: session }   = useSession();

  const [data,       setData]       = useState<DayData | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [activeIdx,  setActiveIdx]  = useState(0);
  const [lang,       setLang]       = useState("javascript");
  const [code,       setCode]       = useState("");
  const [tab,        setTab]        = useState<"problem" | "hints" | "lesson">("problem");
  const [submitting, setSubmitting] = useState(false);
  const [result,     setResult]     = useState<any>(null);
  const [solved,     setSolved]     = useState<Set<string>>(new Set());

  // Fetch day data — auto-seeds if DB is empty
  useEffect(() => {
    setLoading(true);
    setResult(null);
    setTab("problem");

    const loadDay = async () => {
      try {
        // Step 1: try fetching the day
        let res = await fetch(`/api/code/challenges/${day}`);
        let d   = await res.json();

        // Step 2: if empty or error, seed first then retry
        if (!d.problems || d.problems.length === 0 || d.error) {
          console.log("No problems found, seeding...");
          const seedRes = await fetch("/api/code/seed");
          const seedData = await seedRes.json();
          console.log("Seed result:", seedData);

          // Step 3: retry fetch after seed
          res = await fetch(`/api/code/challenges/${day}`);
          d   = await res.json();
          console.log("After seed fetch:", d?.problems?.length, "problems");
        }

        // Step 4: only set data if we actually got problems
        if (d.problems && d.problems.length > 0) {
          setData(d);
          setCode(d.problems[0].starterCode?.javascript ?? "// Write your solution here");
          const solvedIds = new Set<string>(
            (d.submissions ?? [])
              .filter((s: any) => s.status === "accepted")
              .map((s: any) => s.slug ?? s.challengeId)
          );
          setSolved(solvedIds);
        } else {
          // Still nothing — show error state with seed button
          setData({ day: parseInt(day), topic: "", lesson: "", problems: [], progress: null, submissions: [], seedError: true } as any);
        }
      } catch (e) {
        console.error("loadDay error:", e);
        setData({ day: parseInt(day), topic: "", lesson: "", problems: [], progress: null, submissions: [], seedError: true } as any);
      } finally {
        setLoading(false);
      }
    };

    loadDay();
  }, [day]);

  const problem  = data?.problems?.[activeIdx];
  const dayNum   = parseInt(day);
  const allSolved = data?.problems?.every(p => solved.has(p.slug)) ?? false;

  const switchProblem = (idx: number) => {
    setActiveIdx(idx);
    setResult(null);
    setTab("problem");
    if (data?.problems?.[idx]) {
      setCode(data.problems[idx].starterCode?.[lang] ?? "");
    }
  };

  const switchLang = (l: string) => {
    setLang(l);
    if (problem) setCode(problem.starterCode?.[l] ?? `// Write your ${l} solution here`);
  };

  const handleSubmit = async () => {
    if (!problem || !session) return;
    setSubmitting(true);
    setResult(null);
    try {
      const res  = await fetch("/api/code/submit", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ challengeId: problem.slug, language: lang, code }),
      });
      const data = await res.json();
      setResult(data);
      if (data.status === "accepted") setSolved(prev => new Set([...prev, problem.slug]));
    } catch {
      setResult({ error: "Submission failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ──
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3">
      <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-400">Loading challenges…</p>
    </div>
  );

  // ── Not found / seed needed ──
  if (!data || !problem) {
    const [seeding, setSeeding] = useState(false);
    const [seedDone, setSeedDone] = useState(false);

    const runSeed = async () => {
      setSeeding(true);
      try {
        await fetch("/api/code/seed");
        setSeedDone(true);
        // Reload the page after seed
        setTimeout(() => window.location.reload(), 800);
      } catch {
        setSeeding(false);
      }
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-5 text-center px-4">
        <Code2 size={48} className="text-gray-200" />
        <div>
          <p className="text-gray-700 font-semibold text-lg">Challenges not loaded yet</p>
          <p className="text-sm text-gray-400 mt-1">The database needs to be populated once before you can start.</p>
        </div>
        <button
          onClick={runSeed}
          disabled={seeding || seedDone}
          className="btn-primary flex items-center gap-2 px-6 py-3"
        >
          {seedDone ? "✓ Done! Reloading…" : seeding ? "Seeding 100 days…" : "🚀 Load All 100 Days"}
        </button>
        <button onClick={() => router.push("/code")} className="text-sm text-gray-400 hover:text-gray-600">
          ← Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ══════════════════════════════════════════════
          TOP BAR
      ══════════════════════════════════════════════ */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between gap-4">

        {/* Left: back + title */}
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => router.push("/code")}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 flex-shrink-0">
            <ChevronLeft size={18} />
          </button>
          <div className="min-w-0">
            <p className="text-[11px] text-gray-400 font-medium">Day {day} / 100</p>
            <h1 className="font-display font-bold text-gray-900 text-sm leading-tight truncate max-w-[180px] sm:max-w-xs">
              {data.topic}
            </h1>
          </div>
        </div>

        {/* Center: problem number tabs */}
        <div className="flex items-center gap-1">
          {data.problems.map((p, i) => (
            <button
              key={p.id}
              onClick={() => switchProblem(i)}
              title={p.title}
              className={cn(
                "w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center flex-shrink-0",
                solved.has(p.slug)
                  ? "bg-green-500 text-white"
                  : i === activeIdx
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              )}
            >
              {solved.has(p.slug) ? <CheckCircle size={13} /> : i + 1}
            </button>
          ))}
        </div>

        {/* Right: complete badge + prev/next */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {allSolved && (
            <span className="hidden sm:flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full font-semibold">
              <Trophy size={11} /> Complete!
            </span>
          )}
          <button disabled={dayNum <= 1}   onClick={() => router.push(`/code/day/${dayNum - 1}`)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30">
            <ChevronLeft size={15} />
          </button>
          <button disabled={dayNum >= 100} onClick={() => router.push(`/code/day/${dayNum + 1}`)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30">
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MAIN SPLIT LAYOUT
      ══════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

        {/* ────────────────────────────────────────────
            LEFT PANEL — Problem description
        ──────────────────────────────────────────── */}
        <div className="w-full lg:w-[45%] bg-white border-r border-gray-100 flex flex-col min-h-0">

          {/* Problem header */}
          <div className="px-5 pt-4 pb-0 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h2 className="font-display font-bold text-gray-900 text-base leading-snug">{problem.title}</h2>
                <div className="flex items-center flex-wrap gap-2 mt-1.5">
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full capitalize border", DIFF_COLOR[problem.difficulty])}>
                    {problem.difficulty}
                  </span>
                  <span className="text-xs text-gray-400 capitalize">{problem.category.replace(/-/g, " ")}</span>
                  <span className="flex items-center gap-0.5 text-xs text-amber-600 font-semibold">
                    <Zap size={11} /> {problem.xpReward} XP
                  </span>
                  {solved.has(problem.slug) && (
                    <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full font-semibold">
                      <CheckCircle size={11} /> Solved
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="flex gap-0 -mb-px">
              {(["problem", "hints", "lesson"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors",
                    tab === t
                      ? "text-primary-600 border-primary-600"
                      : "text-gray-500 border-transparent hover:text-gray-700"
                  )}
                >
                  {t === "problem" && <><Code2 size={11} /> Problem</>}
                  {t === "hints"   && <><Lightbulb size={11} /> Hints ({problem.hints?.length ?? 0})</>}
                  {t === "lesson"  && <><BookOpen size={11} /> Lesson</>}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content — scrollable */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm text-gray-700">

            {/* ── PROBLEM TAB ── */}
            {tab === "problem" && (
              <>
                {/* Description */}
                <p className="leading-relaxed">{problem.description}</p>

                {/* Examples */}
                {problem.examples?.length > 0 && (
                  <div className="space-y-3">
                    {problem.examples.map((ex, i) => (
                      <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-1.5 font-mono text-xs">
                        <p className="font-sans text-xs font-semibold text-gray-600 mb-2">Example {i + 1}</p>
                        <div>
                          <span className="text-gray-400 font-sans">Input:  </span>
                          <span className="text-gray-800">{ex.input}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-sans">Output: </span>
                          <span className="text-primary-700 font-semibold">{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div className="pt-1 border-t border-gray-100 mt-1">
                            <span className="text-gray-400 font-sans">Explanation: </span>
                            <span className="font-sans text-gray-600">{ex.explanation}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Constraints */}
                {problem.constraints?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Constraints</p>
                    <ul className="space-y-1.5">
                      {problem.constraints.map((c, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary-300 mt-0.5 flex-shrink-0">•</span>
                          <span className="font-mono text-xs text-gray-600">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sample test cases */}
                {problem.testCases?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sample Test Cases</p>
                    <div className="space-y-2">
                      {problem.testCases.slice(0, 2).map((tc, i) => (
                        <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg p-3 font-mono text-xs">
                          <p><span className="text-gray-400">Input:  </span>{tc.input}</p>
                          <p><span className="text-gray-400">Output: </span><span className="text-green-700 font-semibold">{tc.expectedOutput}</span></p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {problem.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {problem.tags.map(tag => (
                      <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium border border-blue-100">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── HINTS TAB ── */}
            {tab === "hints" && (
              <div className="space-y-3">
                {problem.hints?.length > 0 ? (
                  <>
                    <p className="text-xs text-gray-400">Read hints one at a time — try to solve it yourself first!</p>
                    {problem.hints.map((hint, i) => (
                      <div key={i} className="border border-amber-200 bg-amber-50 rounded-xl p-4">
                        <p className="text-xs font-bold text-amber-700 mb-1.5">Hint {i + 1}</p>
                        <p className="text-sm text-amber-900 leading-relaxed">{hint}</p>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Lightbulb size={28} className="mx-auto mb-2 text-gray-200" />
                    <p className="text-sm">No hints for this problem.</p>
                    <p className="text-xs mt-1">You've got this — think it through!</p>
                  </div>
                )}
              </div>
            )}

            {/* ── LESSON TAB ── */}
            {tab === "lesson" && (
              <div className="space-y-4">
                <div className="bg-primary-50 border border-primary-100 rounded-xl p-5">
                  <p className="text-xs font-bold text-primary-500 uppercase tracking-wider mb-1">Day {day} Topic</p>
                  <h3 className="font-display font-bold text-primary-900 text-lg mb-3">{data.topic}</h3>
                  <p className="text-sm text-primary-800 leading-relaxed">{data.lesson}</p>
                </div>
                <p className="text-xs text-gray-400 text-center">
                  Apply what you've learned to solve today's {data.problems.length} challenges.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ────────────────────────────────────────────
            RIGHT PANEL — Code editor
        ──────────────────────────────────────────── */}
        <div className="w-full lg:w-[55%] flex flex-col bg-[#1e1e2e]">

          {/* Language selector */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-1 flex-wrap">
              {LANGUAGES.map(l => (
                <button
                  key={l}
                  onClick={() => switchLang(l)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors",
                    lang === l
                      ? "bg-primary-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCode(problem.starterCode?.[lang] ?? "")}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              title="Reset to starter code"
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          {/* Monaco Code Editor */}
          <div className="flex-1 relative min-h-[300px]">
            <MonacoEditor
              height="100%"
              language={MONACO_LANG[lang] ?? "javascript"}
              value={code}
              onChange={val => setCode(val ?? "")}
              theme="vs-dark"
              options={{
                fontSize:             14,
                fontFamily:           "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, monospace",
                fontLigatures:        true,
                minimap:              { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers:          "on",
                glyphMargin:          false,
                folding:              true,
                wordWrap:             "on",
                automaticLayout:      true,
                tabSize:              2,
                insertSpaces:         true,
                bracketPairColorization: { enabled: true },
                renderLineHighlight:  "all",
                cursorBlinking:       "smooth",
                cursorSmoothCaretAnimation: "on",
                padding:              { top: 16, bottom: 16 },
                scrollbar:            { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
              }}
            />
          </div>

          {/* Submit + result */}
          <div className="border-t border-white/10 p-4 space-y-3 flex-shrink-0">
            {!session && (
              <p className="text-xs text-amber-400 text-center py-1">
                Sign in to submit and track your progress
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting || !session}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all",
                submitting
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : !session
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700 text-white active:scale-[0.98]"
              )}
            >
              {submitting
                ? <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Judging…</>
                : <><Play size={15} /> Run & Submit</>
              }
            </button>

            {/* Result card */}
            {result && (
              <div className="rounded-xl border border-white/10 text-sm overflow-hidden">
                {result.error ? (
                  <div className="p-4 bg-red-900/30">
                    <p className="text-red-400">{result.error}</p>
                  </div>
                ) : (
                  <>
                    {/* Status header */}
                    <div className={cn(
                      "flex items-center justify-between px-4 py-3 border-b border-white/10",
                      result.status === "accepted" ? "bg-green-900/30" : "bg-amber-900/30"
                    )}>
                      <span className={cn(
                        "font-bold text-base",
                        result.status === "accepted" ? "text-green-400" :
                        result.status === "wrong_answer" ? "text-amber-400" : "text-red-400"
                      )}>
                        {result.status === "accepted"     ? "✓ Accepted"     :
                         result.status === "wrong_answer" ? "✗ Wrong Answer" : "⚠ Runtime Error"}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">{result.passed}/{result.total} passed</span>
                    </div>

                    {/* Per-test results */}
                    {result.results?.length > 0 && (
                      <div className="divide-y divide-white/5 max-h-64 overflow-y-auto">
                        {result.results.map((r: any, i: number) => (
                          <div key={i} className={cn(
                            "px-4 py-3 space-y-1.5",
                            r.passed ? "bg-green-900/10" : "bg-red-900/10"
                          )}>
                            <div className="flex items-center gap-2">
                              <span className={r.passed ? "text-green-400" : "text-red-400"}>
                                {r.passed ? "✓" : "✗"}
                              </span>
                              <span className="text-xs font-semibold text-gray-300">Test {r.testNumber}</span>
                            </div>
                            <div className="grid grid-cols-1 gap-1 font-mono text-xs ml-4">
                              <div className="flex gap-2">
                                <span className="text-gray-500 w-20 flex-shrink-0">Input:</span>
                                <span className="text-gray-300 truncate">{r.input}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="text-gray-500 w-20 flex-shrink-0">Expected:</span>
                                <span className="text-green-400">{r.expectedOutput}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="text-gray-500 w-20 flex-shrink-0">Got:</span>
                                <span className={r.passed ? "text-green-400" : "text-red-400"}>{r.actualOutput}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Feedback + XP */}
                    <div className="px-4 py-3 bg-black/20 space-y-2">
                      {result.feedback && (
                        <p className="text-gray-400 text-xs leading-relaxed">{result.feedback}</p>
                      )}
                      {result.isFirstSolve && (
                        <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                          <Zap size={12} /> First solve! +{result.xpEarned} XP earned
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}