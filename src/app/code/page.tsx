// src/app/code/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Flame, CheckCircle, ChevronDown,
  ChevronUp, Zap, Target, Bookmark, Lock, Search,
  SlidersHorizontal, Quote, Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import HeroIllustration from "@/components/code/HeroIllustration";
import TodaysChallengeIllustration from "@/components/code/TodaysChallengeIllustration";

type DayInfo = {
  dayNumber: number; topic: string; lesson: string;
  problemCount: number; isSeeded: boolean;
  isCompleted: boolean; isUnlocked: boolean; isCurrent: boolean;
};

type Problem = {
  id: string; slug: string; title: string;
  difficulty: string; xpReward: number;
};

const DIFF_LABEL: Record<string, { label: string; cls: string }> = {
  easy:   { label: "Easy",   cls: "text-green-600 font-semibold" },
  medium: { label: "Medium", cls: "text-amber-500 font-semibold" },
  hard:   { label: "Hard",   cls: "text-red-500  font-semibold" },
};

function highlight(text: string, query: string) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 text-yellow-900 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// Local (browser-timezone) YYYY-MM-DD, used to line submission timestamps up
// with real calendar days in the streak strip.
function localISODate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function CodeChallengePage() {
  const router            = useRouter();
  const { data: session } = useSession();

  const [days,       setDays]       = useState<DayInfo[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [streak,     setStreak]     = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [completed,  setCompleted]  = useState(0);
  const [solvedAt,   setSolvedAt]   = useState<string[]>([]); // ISO timestamps of accepted submissions

  const [search, setSearch] = useState("");

  // Which day accordion is open + its loaded problems
  const [openDay,   setOpenDay]   = useState<number | null>(null);
  const [dayProbs,  setDayProbs]  = useState<Record<number, Problem[]>>({});
  const [loadingDay,setLoadingDay]= useState<number | null>(null);

  // Solved problem IDs set from submissions
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());

  // When user starts searching, pre-load all unseeded day problem lists
  useEffect(() => {
    if (!search.trim()) return;
    days.forEach(day => {
      if (!dayProbs[day.dayNumber] && !loadingDay) {
        fetch(`/api/code/challenges/${day.dayNumber}`)
          .then(r => r.json())
          .then(d => {
            setDayProbs(prev => ({ ...prev, [day.dayNumber]: d.problems ?? [] }));
          })
          .catch(() => {});
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, days]);

  useEffect(() => {
    fetch("/api/code/challenges")
      .then(r => r.json())
      .then(d => {
        setDays(d.days ?? []);
        setStreak(d.streak ?? 0);
        setCurrentDay(d.currentDay ?? 1);
        setCompleted(d.completedCount ?? 0);
        setSolvedAt(d.solvedAt ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleDay = useCallback(async (dayNum: number) => {
    if (openDay === dayNum) { setOpenDay(null); return; }
    setOpenDay(dayNum);
    if (dayProbs[dayNum]) return; // already loaded

    setLoadingDay(dayNum);
    try {
      const d = await fetch(`/api/code/challenges/${dayNum}`).then(r => r.json());
      setDayProbs(prev => ({ ...prev, [dayNum]: d.problems ?? [] }));
      // Track solved problems from submissions
      if (d.submissions?.length) {
        const accepted = new Set<string>(
          d.submissions.filter((s: any) => s.status === "accepted").map((s: any) => s.challengeId)
        );
        setSolvedIds(prev => new Set([...prev, ...accepted]));
      }
    } finally {
      setLoadingDay(null);
    }
  }, [openDay, dayProbs]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  // Real Mon–Sun calendar strip for "Your Streak", built from actual dates
  // and the user's actual accepted-submission timestamps (not day numbers).
  const solvedDaySet = new Set(solvedAt.map(ts => localISODate(new Date(ts))));
  const today = new Date();
  const todayIso = localISODate(today);
  const mondayOffset = (today.getDay() + 6) % 7; // 0 = Monday ... 6 = Sunday
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-3xl shadow-sm min-h-[380px] sm:min-h-[420px]">
        <HeroIllustration />
        {/* soft fade so text stays legible over the illustration */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/40 to-transparent sm:from-white/80 sm:via-white/25" />

        <div className="relative px-6 sm:px-10 pt-8 pb-8 flex flex-col h-full">
          <div className="flex items-start justify-between gap-4">
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 bg-white/90 px-3.5 py-1.5 rounded-full shadow-sm w-fit">
              🔥 100 Days of Code
            </span>
            <button
              onClick={() => router.push(`/code/day/${currentDay}`)}
              className="btn-primary flex items-center gap-2 text-sm shadow-md"
            >
              <Target size={15} /> Continue Day {currentDay}
            </button>
          </div>

          <div className="mt-6 max-w-md">
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-900 leading-tight">
              Keep Building.<br />
              Keep <span className="text-primary-600">Growing.</span>
            </h1>
            <p className="text-gray-500 text-sm mt-2">5 problems per day · Build the habit · Track your streak</p>
          </div>

          {/* ── Search bar ── */}
          <div className="relative max-w-md w-full mt-8">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search a day, topic or problem title..."
              className="w-full pl-10 pr-10 py-3 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 placeholder-gray-400 shadow-md"
            />
            {search ? (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>
            ) : (
              <SlidersHorizontal size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-500 pointer-events-none" />
            )}
          </div>
        </div>
      </div>

      {/* ── Today's Challenge + Your Streak ── */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Today's Challenge */}
        <div className="card p-6 flex items-center justify-between gap-4 overflow-hidden">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-bold text-primary-600 mb-3">
              🔥 Today&apos;s Challenge
            </p>
            <span className="inline-block text-[11px] font-bold text-white bg-primary-600 px-2.5 py-1 rounded-full mb-2">
              Day {currentDay}
            </span>
            <h2 className="font-display font-extrabold text-xl text-gray-900">Ready to solve?</h2>
            <p className="text-sm text-gray-500 mt-1 max-w-[220px]">
              5 carefully selected problems to sharpen your skills today.
            </p>
            <button
              onClick={() => router.push(`/code/day/${currentDay}`)}
              className="btn-primary flex items-center gap-1.5 text-sm mt-4"
            >
              Start Solving <ChevronDown size={14} className="-rotate-90" />
            </button>
          </div>
          {/* monitor + plant illustration */}
          <div className="hidden sm:block flex-shrink-0 w-40 h-32 -mr-2">
            <TodaysChallengeIllustration />
          </div>
        </div>

        {/* Your Streak */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="flex items-center gap-1.5 text-sm font-bold text-primary-600">
              <Calendar size={15} /> Your Streak
            </p>
            <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
              {streak} day streak <span>🔥</span>
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {weekDates.map((date) => {
              const iso = localISODate(date);
              const label = date.toLocaleDateString(undefined, { weekday: "short" });
              const isSolved = solvedDaySet.has(iso);
              const isToday = iso === todayIso;
              return (
                <div key={iso} className="flex flex-col items-center gap-1.5">
                  <span className="text-[11px] text-gray-400">{label}</span>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2",
                    isSolved
                      ? "bg-green-50 border-green-500 text-green-600"
                      : isToday
                      ? "bg-orange-50 border-orange-400 text-orange-500"
                      : "bg-gray-50 border-gray-200 text-gray-300"
                  )}>
                    {isSolved ? <CheckCircle size={14} /> : isToday ? <Flame size={14} /> : null}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-5">Consistency today, mastery tomorrow. 💜</p>
        </div>
      </div>

      {/* ── Quote banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-primary-50 px-6 py-4 flex items-center gap-3">
        <Quote size={18} className="text-primary-400 flex-shrink-0" />
        <p className="text-sm text-primary-800">
          <span className="font-bold">Small</span> progress is still <span className="font-bold">progress</span>. Keep showing up! 🚀
        </p>
      </div>

      {/* ── Accordion Day List ── */}
      <div className="card overflow-hidden divide-y divide-gray-100">
        {days.filter(day => {
          if (!search.trim()) return true;
          const q = search.toLowerCase();
          // Match day number, topic, lesson
          if (
            `day ${day.dayNumber}`.includes(q) ||
            day.topic.toLowerCase().includes(q) ||
            day.lesson.toLowerCase().includes(q)
          ) return true;
          // Also match any loaded problem titles for this day
          const probs = dayProbs[day.dayNumber] ?? [];
          return probs.some(p => p.title.toLowerCase().includes(q));
        }).map(day => {
          // Auto-expand days that match on a problem title (not the day/topic itself)
          const q = search.trim().toLowerCase();
          const matchesDay = !q ||
            `day ${day.dayNumber}`.includes(q) ||
            day.topic.toLowerCase().includes(q) ||
            day.lesson.toLowerCase().includes(q);
          const probs = dayProbs[day.dayNumber] ?? [];
          const matchesProb = q && probs.some(p => p.title.toLowerCase().includes(q));
          // If search matches a problem, highlight it (accordion stays under user control)
          const isOpen    = openDay === day.dayNumber;
          const problems  = dayProbs[day.dayNumber] ?? [];
          const isLoading = loadingDay === day.dayNumber;
          const locked    = !day.isUnlocked && !!session;

          // Parse topic tags
          const tags = day.topic.split(/[,·]/).map(t => t.trim()).filter(Boolean);

          return (
            <div key={day.dayNumber}>
              {/* ── Day header row ── */}
              <button
                className={cn(
                  "w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50",
                  isOpen && "bg-gray-50"
                )}
                onClick={() => toggleDay(day.dayNumber)}
                disabled={locked}
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Day number + status */}
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                    day.isCompleted ? "bg-green-500 text-white" :
                    day.isCurrent   ? "bg-primary-600 text-white" :
                    locked          ? "bg-gray-100 text-gray-400" :
                                      "bg-gray-100 text-gray-600"
                  )}>
                    {day.isCompleted
                      ? <CheckCircle size={14} />
                      : locked
                      ? <Lock size={12} />
                      : day.dayNumber}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-900 text-sm">Day {day.dayNumber}</span>
                      {day.isCurrent && (
                        <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded-full border border-primary-100">TODAY</span>
                      )}
                      {day.isCompleted && (
                        <span className="text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-100">DONE</span>
                      )}
                    </div>
                    {/* Topic tags */}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {tags.join(", ")}
                    </p>
                  </div>
                </div>

                {isOpen
                  ? <ChevronUp  size={18} className="text-gray-400 flex-shrink-0" />
                  : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
              </button>

              {/* ── Expanded problem table ── */}
              {isOpen && (
                <div className="border-t border-gray-100">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                    </div>
                  ) : problems.length === 0 ? (
                    <div className="px-5 py-6 text-center text-sm text-gray-400">
                      Problems not seeded yet —{" "}
                      <a href="/api/code/seed" className="text-primary-600 underline">run seed</a>
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      {/* Table header */}
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="pl-14 pr-4 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wide w-[45%]">Problem Title</th>
                          <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Difficulty</th>
                          <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Points</th>
                          <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {problems.filter(prob =>
                          !search.trim() || prob.title.toLowerCase().includes(search.toLowerCase())
                        ).map((prob, i) => {
                          const isSolved = solvedIds.has(prob.id);
                          const diff     = DIFF_LABEL[prob.difficulty] ?? { label: prob.difficulty, cls: "text-gray-500" };
                          return (
                            <tr key={prob.id} className="hover:bg-gray-50 transition-colors">
                              {/* Bookmark icon + title */}
                              <td className="pl-5 pr-4 py-3.5">
                                <div className="flex items-center gap-3">
                                  {isSolved
                                    ? <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                                    : <Bookmark    size={16} className="text-gray-300 flex-shrink-0" />}
                                  <span className={cn("font-semibold", isSolved ? "text-green-700" : "text-gray-900")}>
                                    {highlight(prob.title, search)}
                                  </span>
                                </div>
                              </td>
                              {/* Difficulty */}
                              <td className={cn("px-4 py-3.5", diff.cls)}>
                                {diff.label}
                              </td>
                              {/* Points */}
                              <td className="px-4 py-3.5 text-gray-500">
                                <span className="flex items-center gap-1">
                                  {isSolved
                                    ? <span className="text-green-600 font-semibold">{prob.xpReward}/{prob.xpReward}</span>
                                    : <span>0/{prob.xpReward}</span>}
                                </span>
                              </td>
                              {/* Solve button */}
                              <td className="px-4 py-3.5">
                                <Link
                                  href={`/code/day/${day.dayNumber}?problem=${prob.slug}`}
                                  className={cn(
                                    "inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors",
                                    isSolved
                                      ? "border-green-200 text-green-700 bg-green-50 hover:bg-green-100"
                                      : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-primary-300 hover:text-primary-600"
                                  )}
                                >
                                  {isSolved ? "Review" : "Solve"}
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}