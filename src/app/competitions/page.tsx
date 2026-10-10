// src/app/competitions/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trophy, Search, Users, Calendar, MapPin, Wifi } from "lucide-react";
import { formatXAF, getStatusColor, daysUntil } from "@/lib/utils";
import SaveButton from "@/components/ui/SaveButton";
import LikeButton from "@/components/ui/LikeButton";

const STATUSES = ["all","active","upcoming","ended"];
const TYPES    = ["all","hackathon","case-study","coding","business","creative","quiz"];

function CompCard({ comp }: { comp: any }) {
  const days     = daysUntil(comp.endDate);
  const topPrize = comp.prizes?.[0];

  return (
    <Link href={`/competitions/${comp.id}`} className="card p-5 block group hover:-translate-y-1 transition-all duration-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2 flex-wrap">
          <span className={`badge ${getStatusColor(comp.status)} capitalize`}>{comp.status}</span>
          <span className="badge bg-purple-100 text-purple-700 capitalize">{comp.type?.replace("-"," ")}</span>
        </div>
        <div className="flex items-center gap-2">
          {comp.isOnline
            ? <span className="flex items-center gap-1 text-xs text-blue-600"><Wifi size={11} />Online</span>
            : comp.city && <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11} />{comp.city}</span>
          }
          {/* Like + Save inline — stop propagation so they don't navigate */}
          <div className="flex items-center gap-1" onClick={e => e.preventDefault()}>
            <LikeButton targetType="competition" targetId={comp.id} variant="icon" />
            <SaveButton targetType="competition" targetId={comp.id} variant="icon" />
          </div>
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors mb-1">{comp.title}</h3>
      <div className="flex items-center gap-2.5 mb-3">
        {comp.organizerLogo ? (
          <img
            src={comp.organizerLogo}
            alt={comp.organizer}
            className="w-9 h-9 rounded-lg object-contain border border-gray-100 bg-white p-0.5 flex-shrink-0"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="w-9 h-9 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center flex-shrink-0">
            <Trophy size={16} />
          </div>
        )}
        <p className="text-sm text-gray-500 truncate">{comp.organizer}</p>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{comp.description}</p>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-yellow-600">
          <Trophy size={14} />
          {topPrize ? `${formatXAF(topPrize.amount)} prize` : "Prize TBA"}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {comp.status !== "ended" && <span className="flex items-center gap-1"><Calendar size={11} />{days}d left</span>}
        </div>
      </div>
    </Link>
  );
}

export default function CompetitionsPage() {
  const [search,  setSearch]  = useState("");
  const [status,  setStatus]  = useState("all");
  const [type,    setType]    = useState("all");
  const [all,     setAll]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComps = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (status !== "all") params.set("status", status);
      if (type   !== "all") params.set("type",   type);
      if (search)           params.set("search", search);
      try {
        const res  = await fetch(`/api/competitions?${params.toString()}`, { cache: "no-store" });
        const data = await res.json();
        setAll(data.competitions ?? []);
      } catch { setAll([]); }
      setLoading(false);
    };
    const debounce = setTimeout(fetchComps, search ? 350 : 0);
    return () => clearTimeout(debounce);
  }, [search, status, type]);

  const active   = all.filter(c => c.status === "active");
  const upcoming = all.filter(c => c.status === "upcoming");
  const ended    = all.filter(c => c.status === "ended");

  return (
    <div className="min-h-screen flex flex-col">

      <section className="hero-gradient py-10 px-4 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Trophy size={28} className="text-yellow-300" />
            <h1 className="text-3xl font-display font-bold">Competitions</h1>
          </div>
          <p className="text-purple-200 text-sm mb-5">Hackathons, coding battles, case studies and more — all in Cameroon</p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1 flex gap-2 border border-white/20">
            <div className="flex-1 relative">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search competitions..."
                className="w-full pl-9 pr-4 py-2.5 bg-transparent text-white placeholder-white/50 text-sm outline-none" />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8 w-full flex-1">
        <div className="flex gap-2 flex-wrap mb-6">
          <div className="flex gap-1.5 flex-wrap">
            {STATUSES.map(s => (
              <button key={s} onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
                  status === s ? "bg-primary-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-primary-300"
                }`}>
                {s === "all" ? "All Status" : s}
              </button>
            ))}
          </div>
          <div className="w-px bg-gray-200 mx-1 hidden sm:block" />
          <div className="flex gap-1.5 flex-wrap">
            {TYPES.map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
                  type === t ? "bg-purple-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-purple-300"
                }`}>
                {t === "all" ? "All Types" : t.replace("-"," ")}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="card p-5 animate-pulse space-y-3">
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="h-5 bg-gray-100 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {(status === "all" || status === "active") && active.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <h2 className="font-semibold text-gray-900">Active Now</h2>
                  <span className="text-xs text-gray-400">({active.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {active.map(c => <CompCard key={c.id} comp={c} />)}
                </div>
              </div>
            )}

            {(status === "all" || status === "upcoming") && upcoming.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  <h2 className="font-semibold text-gray-900">Coming Soon</h2>
                  <span className="text-xs text-gray-400">({upcoming.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcoming.map(c => <CompCard key={c.id} comp={c} />)}
                </div>
              </div>
            )}

            {(status === "all" || status === "ended") && ended.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-gray-400 rounded-full" />
                  <h2 className="font-semibold text-gray-700">Past Competitions</h2>
                  <span className="text-xs text-gray-400">({ended.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75">
                  {ended.map(c => <CompCard key={c.id} comp={c} />)}
                </div>
              </div>
            )}

            {all.length === 0 && (
              <div className="text-center py-16">
                <Trophy size={48} className="text-gray-200 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-600">No competitions found</h3>
                <p className="text-sm text-gray-400 mt-1">Try different filters or check back soon</p>
              </div>
            )}
          </>
        )}
      </div>
</div>
  );
}