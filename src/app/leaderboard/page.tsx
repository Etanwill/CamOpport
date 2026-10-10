"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Trophy, Star, Zap, Award, MapPin, TrendingUp } from "lucide-react";
import { Avatar, Spinner } from "@/components/ui";

type LeaderboardEntry = {
  id: string;
  name: string;
  avatar: string | null;
  city: string | null;
  region: string | null;
  xp: number;
  competitionsCount: number;
  quizzesCount: number;
  badgesCount: number;
  topBadgeName: string | null;
  topBadgeIcon: string | null;
};

const TABS = [
  { key: "xp",           label: "Overall" },
  { key: "competitions", label: "Competitions" },
  { key: "quizzes",      label: "Quizzes" },
] as const;

const REGIONS = [
  "Centre", "Littoral", "West", "Northwest", "Southwest",
  "North", "Adamawa", "East", "South", "Far North",
];

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [tab, setTab]       = useState<(typeof TABS)[number]["key"]>("xp");
  const [region, setRegion] = useState("all");

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    const qs = region !== "all" ? `?region=${encodeURIComponent(region)}` : "";
    fetch(`/api/leaderboard${qs}`)
      .then(r => r.json())
      .then(d => setEntries(d.leaderboard ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [region]);

  const sorted = useMemo(() => {
    const key = tab === "xp" ? "xp" : tab === "competitions" ? "competitionsCount" : "quizzesCount";
    return [...entries].sort((a, b) => b[key] - a[key]);
  }, [entries, tab]);

  const myId = (session?.user as any)?.id as string | undefined;

  return (
    <div className="min-h-screen flex flex-col">

      {/* Header */}
      <section className="hero-gradient py-10 px-4 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Trophy size={28} className="text-yellow-300" />
            <h1 className="text-3xl font-display font-bold">Leaderboard</h1>
          </div>
          <p className="text-purple-200">Top talents across Cameroon — ranked by XP and achievements</p>
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">
          Couldn&apos;t load the leaderboard right now. Please try again shortly.
        </div>
      ) : sorted.length === 0 ? (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">
          No ranked job seekers {region !== "all" ? `in ${region} ` : ""}yet — be the first to earn XP!
        </div>
      ) : (
        <>
          {/* Top 3 podium */}
          <div className="bg-white border-b border-gray-100 py-8 px-4">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-end justify-center gap-4">
                {/* 2nd */}
                <div className="text-center">
                  <div className="relative inline-block mb-2">
                    <Avatar name={sorted[1]?.name || "2"} src={sorted[1]?.avatar ?? undefined} seed={sorted[1]?.id} size="lg" />
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold">2</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 truncate max-w-24">{sorted[1]?.name.split(" ")[0]}</p>
                  <p className="text-xs text-gray-500">{sorted[1]?.xp.toLocaleString()} XP</p>
                  <div className="h-16 bg-gray-200 rounded-t-lg w-16 mx-auto mt-2" />
                </div>

                {/* 1st */}
                <div className="text-center">
                  <div className="text-3xl mb-1">👑</div>
                  <div className="relative inline-block mb-2">
                    <Avatar name={sorted[0]?.name || "1"} src={sorted[0]?.avatar ?? undefined} seed={sorted[0]?.id} size="xl" />
                    <span className="absolute -top-1 -right-1 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 text-xs font-bold">1</span>
                  </div>
                  <p className="font-bold text-gray-900 truncate max-w-28">{sorted[0]?.name.split(" ")[0]}</p>
                  <p className="text-xs text-primary-600 font-semibold">{sorted[0]?.xp.toLocaleString()} XP</p>
                  <div className="h-24 bg-gradient-to-t from-yellow-300 to-yellow-400 rounded-t-lg w-20 mx-auto mt-2" />
                </div>

                {/* 3rd */}
                <div className="text-center">
                  <div className="relative inline-block mb-2">
                    <Avatar name={sorted[2]?.name || "3"} src={sorted[2]?.avatar ?? undefined} seed={sorted[2]?.id} size="lg" />
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-white text-xs font-bold">3</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 truncate max-w-24">{sorted[2]?.name.split(" ")[0]}</p>
                  <p className="text-xs text-gray-500">{sorted[2]?.xp.toLocaleString()} XP</p>
                  <div className="h-10 bg-orange-200 rounded-t-lg w-16 mx-auto mt-2" />
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 py-8 w-full flex-1">
            {/* Tabs + region filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="flex gap-1 bg-gray-100 p-1 rounded-xl max-w-md">
                {TABS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? "bg-white shadow-sm text-primary-700" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <select
                value={region}
                onChange={e => setRegion(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                <option value="all">All regions</option>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Rank</th>
                      <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">User</th>
                      <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">XP</th>
                      <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3 hidden sm:table-cell">Competitions</th>
                      <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3 hidden sm:table-cell">Quizzes</th>
                      <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3 hidden md:table-cell">Badges</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {sorted.map((entry, i) => (
                      <tr
                        key={entry.id}
                        className={`hover:bg-gray-50 transition-colors ${i < 3 ? "bg-yellow-50/30" : ""} ${entry.id === myId ? "bg-primary-50/60" : ""}`}
                      >
                        <td className="px-4 py-3">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? "bg-yellow-400 text-gray-900" : i === 1 ? "bg-gray-300 text-gray-700" : i === 2 ? "bg-orange-300 text-gray-700" : "text-gray-500 bg-gray-100"}`}>
                            {i + 1}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={entry.name} src={entry.avatar ?? undefined} seed={entry.id} size="sm" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                                {entry.name}
                                {entry.id === myId && (
                                  <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded-full border border-primary-100">YOU</span>
                                )}
                              </p>
                              {entry.city && (
                                <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10} />{entry.city}</p>
                              )}
                            </div>
                            {entry.topBadgeIcon && (
                              <span className="text-base" title={entry.topBadgeName ?? undefined}>{entry.topBadgeIcon}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-bold text-primary-700 flex items-center justify-end gap-1">
                            <Zap size={12} />{entry.xp.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-600 hidden sm:table-cell">
                          <span className="flex items-center justify-end gap-1"><Trophy size={12} />{entry.competitionsCount}</span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-600 hidden sm:table-cell">
                          <span className="flex items-center justify-end gap-1"><Star size={12} />{entry.quizzesCount}</span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-600 hidden md:table-cell">
                          <span className="flex items-center justify-end gap-1"><Award size={12} />{entry.badgesCount}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* XP Info */}
            <div className="mt-6 card p-5 bg-primary-50 border border-primary-100">
              <h3 className="font-semibold text-primary-800 mb-3 flex items-center gap-2"><TrendingUp size={16} />How to earn XP</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[["Complete a quiz", "+50 XP"], ["Win a competition", "+500 XP"], ["Apply to a job", "+10 XP"], ["Complete your profile", "+100 XP"]].map(([a, b]) => (
                  <div key={String(a)} className="bg-white rounded-xl p-3 text-center">
                    <p className="text-sm font-bold text-primary-700">{b}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}