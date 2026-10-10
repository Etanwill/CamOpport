// src/app/my-activity/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Briefcase, Trophy, Clock, Zap, MapPin,
  Bookmark, Heart, Loader2, X, Star,
  ArrowRight, PlusCircle, ClipboardList, ChevronRight,
} from "lucide-react";
import { mockQuizzes } from "@/lib/data";
import { formatSalary, getStatusColor } from "@/lib/utils";
import { getAvatarUrl } from "@/lib/avatar";

const APP_STATUS_CONFIG: Record<string, { label: string; color: string; icon: string; desc: string }> = {
  pending:     { label: "Pending",     icon: "🕐", color: "bg-yellow-50 border-yellow-200 text-yellow-800",   desc: "Your application is waiting to be reviewed." },
  reviewed:    { label: "Reviewed",    icon: "👀", color: "bg-blue-50 border-blue-200 text-blue-800",         desc: "The employer has seen your application." },
  shortlisted: { label: "Shortlisted", icon: "⭐", color: "bg-emerald-50 border-emerald-200 text-emerald-800", desc: "Great news! You've been shortlisted." },
  rejected:    { label: "Rejected",    icon: "✕",  color: "bg-red-50 border-red-200 text-red-700",            desc: "This application was not successful." },
  hired:       { label: "Hired! 🎉",   icon: "🎉", color: "bg-purple-50 border-purple-300 text-purple-800",   desc: "Congratulations! You got the job!" },
};

const REG_STATUS_CONFIG: Record<string, { label: string; color: string; icon: string; desc: string }> = {
  registered:   { label: "Registered",   icon: "✅", color: "bg-blue-50 border-blue-200 text-blue-800",        desc: "Registration received. Waiting for confirmation." },
  confirmed:    { label: "Confirmed",    icon: "🎉", color: "bg-emerald-50 border-emerald-200 text-emerald-800", desc: "You're in! Get ready for the competition." },
  waitlisted:   { label: "Waitlisted",   icon: "⏳", color: "bg-yellow-50 border-yellow-200 text-yellow-800",   desc: "You're on the waitlist." },
  disqualified: { label: "Disqualified", icon: "❌", color: "bg-red-50 border-red-200 text-red-700",            desc: "Your registration was not accepted." },
  winner:       { label: "Winner! 🏆",   icon: "🏆", color: "bg-amber-50 border-amber-300 text-amber-900",      desc: "Congratulations! You won!" },
};

interface AppEntry   { application: any; job: any; }
interface RegEntry   { registration: any; competition: any; }
interface SavedItem  { id: string; targetType: "job" | "competition"; targetId: string; savedAt: string; }
interface LikedItem  { id: string; targetType: "job" | "competition"; targetId: string; createdAt: string; }

type Tab = "all" | "applications" | "competitions" | "saved" | "liked";

// Horizontal scroller used by every activity tab below.
function ScrollRow({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => scrollRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  return (
    <div className="relative">
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
        {children}
      </div>
      <button
        type="button"
        onClick={() => scrollBy(1)}
        aria-label="Scroll right"
        className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 items-center justify-center text-gray-400 hover:text-gray-700 hover:shadow-lg transition-all"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// One card in the activity feed — used for applications, competitions, saved & liked items.
function ActivityCard({
  href, logoUrl, fallbackIcon, fallbackColor, title, subtitle, dateLabel,
  progress, status, onRemove, removing, removeLabel,
}: {
  href: string;
  logoUrl?: string | null;
  fallbackIcon: React.ReactNode;
  fallbackColor: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  progress?: { total: number; active: number; danger?: boolean } | null;
  status?: { icon: string; label: string; color: string } | null;
  onRemove?: () => void;
  removing?: boolean;
  removeLabel?: string;
}) {
  return (
    <div className="relative min-w-[230px] max-w-[230px] bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex-shrink-0 snap-start hover:shadow-md transition-shadow">
      {onRemove && (
        <button
          onClick={onRemove}
          disabled={removing}
          title={removeLabel}
          className="absolute top-2.5 right-2.5 p-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors z-10"
        >
          {removing ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
        </button>
      )}
      <Link href={href} className="flex items-center gap-2.5 mb-3 pr-5">
        {logoUrl ? (
          <img src={logoUrl} alt={title} className="w-12 h-12 rounded-lg object-contain border border-gray-100 bg-white p-1 flex-shrink-0" />
        ) : (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${fallbackColor}`}>
            {fallbackIcon}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{title}</p>
          <p className="text-xs text-gray-500 truncate">{subtitle}</p>
        </div>
      </Link>
      <p className="text-xs text-gray-400 mb-3">{dateLabel}</p>
      {progress && (
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: progress.total }).map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${
              i < progress.active ? (progress.danger ? "bg-red-400" : "bg-primary-500") : "bg-gray-200"
            }`} />
          ))}
        </div>
      )}
      {status && (
        <div className="flex justify-end">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${status.color}`}>
            {status.icon} {status.label}
          </span>
        </div>
      )}
    </div>
  );
}

function MyActivityInner() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTab = (searchParams.get("tab") as Tab) ?? "all";
  const [tab,   setTab]   = useState<Tab>(
    ["all", "applications", "competitions", "saved", "liked"].includes(initialTab) ? initialTab : "all"
  );

  const [apps,  setApps]  = useState<AppEntry[]>([]);
  const [regs,  setRegs]  = useState<RegEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Saved tab state
  const [saved,        setSaved]        = useState<SavedItem[]>([]);
  const [savedDetails,  setSavedDetails]  = useState<Record<string, any>>({});
  const [savedLoading,  setSavedLoading]  = useState(true);
  const [savedRemoving, setSavedRemoving] = useState<string | null>(null);

  // Liked tab state
  const [liked,         setLiked]         = useState<LikedItem[]>([]);
  const [likedDetails,  setLikedDetails]  = useState<Record<string, any>>({});
  const [likedLoading,  setLikedLoading]  = useState(true);
  const [likedRemoving, setLikedRemoving] = useState<string | null>(null);

  // Dashboard-merged state: bits balance (job seekers only) + live XP
  // (session.user.xp is a JWT snapshot taken at login time and can go stale
  // if xp changes server-side afterwards, so we refresh it here like Sidebar does)
  const [bits, setBits] = useState<number | null>(null);
  const [liveXp, setLiveXp] = useState<number | null>(null);
  const [liveAvatar, setLiveAvatar] = useState<string | null>(null);
  const [avatarReady, setAvatarReady] = useState(false);
  // Live jobs & competitions (real employer-uploaded logos, not mock placeholders)
  const [jobs, setJobs] = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/jobs?limit=4")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.jobs) setJobs(data.jobs); })
      .catch(() => {});
    fetch("/api/competitions?status=active")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.competitions) setCompetitions(data.competitions); })
      .catch(() => {});
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated" || session?.user?.role === "employer") return;
    fetch("/api/bits")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setBits(data.bits); })
      .catch(() => {});
  }, [status, session?.user?.role]);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch("/api/user/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.user?.xp != null) setLiveXp(data.user.xp);
        if (data?.user?.avatar) setLiveAvatar(data.user.avatar);
      })
      .catch(() => {})
      .finally(() => setAvatarReady(true));
  }, [session?.user?.id]);

  const changeTab = (t: Tab) => {
    setTab(t);
    router.replace(`/my-activity?tab=${t}`, { scroll: false });
  };

  // Applications + competitions
  useEffect(() => {
    if (status !== "authenticated") return;
    const load = async () => {
      try {
        const [aRes, rRes] = await Promise.all([
          fetch("/api/user/applications"),
          fetch("/api/user/registrations"),
        ]);
        const [aData, rData] = await Promise.all([aRes.json(), rRes.json()]);
        setApps(aData.applications ?? []);
        setRegs(rData.registrations ?? []);
      } catch { /* */ }
      setLoading(false);
    };
    load();
  }, [status]);

  // Saved items — load once user is authenticated
  useEffect(() => {
    if (!session?.user?.id) return;
    const load = async () => {
      setSavedLoading(true);
      try {
        const res   = await fetch("/api/saved");
        const items: SavedItem[] = await res.json();
        setSaved(items);
        const results: Record<string, any> = {};
        await Promise.all(
          items.map(async item => {
            const endpoint = item.targetType === "job"
              ? `/api/jobs/${item.targetId}`
              : `/api/competitions/${item.targetId}`;
            try {
              const r = await fetch(endpoint);
              if (r.ok) {
                const d = await r.json();
                results[item.targetId] = item.targetType === "job" ? d.job : d.competition;
              }
            } catch {}
          })
        );
        setSavedDetails(results);
      } catch {}
      setSavedLoading(false);
    };
    load();
  }, [session?.user?.id]);

  // Liked items — load once user is authenticated
  useEffect(() => {
    if (!session?.user?.id) return;
    const load = async () => {
      setLikedLoading(true);
      try {
        const res   = await fetch("/api/likes?all=true");
        const items: LikedItem[] = await res.json();
        setLiked(items);
        const results: Record<string, any> = {};
        await Promise.all(
          items.map(async item => {
            const endpoint = item.targetType === "job"
              ? `/api/jobs/${item.targetId}`
              : `/api/competitions/${item.targetId}`;
            try {
              const r = await fetch(endpoint);
              if (r.ok) {
                const d = await r.json();
                results[item.targetId] = item.targetType === "job" ? d.job : d.competition;
              }
            } catch {}
          })
        );
        setLikedDetails(results);
      } catch {}
      setLikedLoading(false);
    };
    load();
  }, [session?.user?.id]);

  const handleUnsave = async (item: SavedItem) => {
    setSavedRemoving(item.targetId);
    try {
      const res = await fetch("/api/saved", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ targetType: item.targetType, targetId: item.targetId }),
      });
      if (res.ok) setSaved(prev => prev.filter(s => s.targetId !== item.targetId));
    } catch {}
    setSavedRemoving(null);
  };

  const handleUnlike = async (item: LikedItem) => {
    setLikedRemoving(item.targetId);
    try {
      const res = await fetch("/api/likes", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ targetType: item.targetType, targetId: item.targetId }),
      });
      if (res.ok) setLiked(prev => prev.filter(l => l.targetId !== item.targetId));
    } catch {}
    setLikedRemoving(null);
  };

  const applicationCard = ({ application, job }: AppEntry) => {
    const cfg   = APP_STATUS_CONFIG[application.status] ?? APP_STATUS_CONFIG.pending;
    const order = ["pending", "reviewed", "shortlisted", "hired"];
    const idx   = order.indexOf(application.status === "rejected" ? "reviewed" : application.status);
    return (
      <ActivityCard
        key={`app-${application.id}`}
        href={`/jobs/${job.id}`}
        logoUrl={job.companyLogo}
        fallbackIcon={<span className="font-bold text-lg">{job.company?.charAt(0) ?? "?"}</span>}
        fallbackColor="bg-primary-50 text-primary-700"
        title={job.title}
        subtitle={job.company}
        dateLabel={`Applied on ${new Date(application.appliedAt).toLocaleDateString()}`}
        progress={{ total: order.length, active: idx + 1, danger: application.status === "rejected" }}
        status={{ icon: cfg.icon, label: cfg.label, color: cfg.color }}
      />
    );
  };

  const registrationCard = ({ registration, competition }: RegEntry) => {
    const cfg    = REG_STATUS_CONFIG[registration.status] ?? REG_STATUS_CONFIG.registered;
    const order  = ["registered", "confirmed", "winner"];
    const mapped = registration.status === "waitlisted" || registration.status === "disqualified" ? "registered" : registration.status;
    const idx    = Math.max(order.indexOf(mapped), 0);
    return (
      <ActivityCard
        key={`reg-${registration.id}`}
        href={`/competitions/${competition.id}`}
        logoUrl={competition.organizerLogo}
        fallbackIcon={<Trophy size={22} />}
        fallbackColor="bg-yellow-50 text-yellow-600"
        title={competition.title}
        subtitle={competition.organizer}
        dateLabel={`Registered on ${new Date(registration.registeredAt).toLocaleDateString()}`}
        progress={{ total: order.length, active: idx + 1, danger: registration.status === "disqualified" }}
        status={{ icon: cfg.icon, label: cfg.label, color: cfg.color }}
      />
    );
  };

  const savedCard = (item: SavedItem) => {
    const detail = savedDetails[item.targetId];
    if (!detail) return null;
    const isJob = item.targetType === "job";
    return (
      <ActivityCard
        key={`saved-${item.targetId}`}
        href={isJob ? `/jobs/${item.targetId}` : `/competitions/${item.targetId}`}
        logoUrl={isJob ? detail.companyLogo : detail.organizerLogo}
        fallbackIcon={isJob ? <span className="font-bold text-lg">{detail.company?.charAt(0) ?? "?"}</span> : <Trophy size={22} />}
        fallbackColor={isJob ? "bg-primary-50 text-primary-700" : "bg-purple-50 text-purple-700"}
        title={detail.title}
        subtitle={isJob ? detail.company : detail.organizer}
        dateLabel={`Saved on ${new Date(item.savedAt).toLocaleDateString()}`}
        onRemove={() => handleUnsave(item)}
        removing={savedRemoving === item.targetId}
        removeLabel="Remove from saved"
      />
    );
  };

  const likedCard = (item: LikedItem) => {
    const detail = likedDetails[item.targetId];
    if (!detail) return null;
    const isJob = item.targetType === "job";
    return (
      <ActivityCard
        key={`liked-${item.targetId}`}
        href={isJob ? `/jobs/${item.targetId}` : `/competitions/${item.targetId}`}
        logoUrl={isJob ? detail.companyLogo : detail.organizerLogo}
        fallbackIcon={isJob ? <span className="font-bold text-lg">{detail.company?.charAt(0) ?? "?"}</span> : <Trophy size={22} />}
        fallbackColor={isJob ? "bg-primary-50 text-primary-700" : "bg-purple-50 text-purple-700"}
        title={detail.title}
        subtitle={isJob ? detail.company : detail.organizer}
        dateLabel={`Liked on ${new Date(item.createdAt).toLocaleDateString()}`}
        onRemove={() => handleUnlike(item)}
        removing={likedRemoving === item.targetId}
        removeLabel="Unlike"
      />
    );
  };

  // Combined, most-recent-first feed for the "All" tab
  const combinedCards = [
    ...apps.map(a  => ({ date: a.application.appliedAt,     node: applicationCard(a)  })),
    ...regs.map(r  => ({ date: r.registration.registeredAt, node: registrationCard(r) })),
    ...saved.map(s => ({ date: s.savedAt,                   node: savedCard(s)        })),
    ...liked.map(l => ({ date: l.createdAt,                 node: likedCard(l)        })),
  ]
    .filter((e): e is { date: string; node: JSX.Element } => !!e.node)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(e => e.node);

  const anyActivityLoading = loading || savedLoading || likedLoading;

  if (loading || status === "loading" || !avatarReady) return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
</div>
  );

  if (!session) return null;

  const user         = session.user;
  const isEmployer   = user.role === "employer";
  const xp           = liveXp ?? user.xp ?? 0;
  const level        = Math.floor(xp / 1000) + 1;
  const xpProgress   = ((xp % 1000) / 1000) * 100;
  const displayAvatar = getAvatarUrl(user.id ?? user.email ?? user.name ?? "user", liveAvatar);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">

        {/* Hero banner */}
        <div className="relative overflow-hidden rounded-2xl border border-primary-100/70 bg-gradient-to-br from-white via-primary-50/60 to-primary-100/50 p-6 mb-6">
          {/* Decorative wave background */}
          <svg
            className="pointer-events-none absolute bottom-0 right-0 w-64 sm:w-80 h-32 opacity-80"
            viewBox="0 0 320 130" preserveAspectRatio="none" aria-hidden="true"
          >
            <path d="M0,90 C60,60 100,110 160,80 C220,50 260,100 320,70 L320,130 L0,130 Z" fill="#c4b5fd" fillOpacity="0.35" />
            <path d="M40,110 C100,80 150,125 210,95 C260,70 290,110 320,90 L320,130 L0,130 Z" fill="#a78bfa" fillOpacity="0.35" />
          </svg>

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <img
                  src={displayAvatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm bg-primary-50"
                />
                <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-gray-900 mb-1">
                  Welcome back, {user.name?.split(" ")[0]}! 👋
                </h1>
                <p className="text-gray-500 text-sm">
                  {isEmployer
                    ? `${(user as any).companyName || "Your company"} — Employer Overview`
                    : "Here's what's happening in Cameroon today"}
                </p>
                {!isEmployer && (
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-sm font-semibold text-primary-700">Level {level}</span>
                    <div className="h-2 w-36 sm:w-52 bg-gray-200/80 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-600 rounded-full transition-all" style={{ width: `${xpProgress}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {xp % 1000} / 1000 XP to Level {level + 1}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {!isEmployer && (
              <div className="flex items-start gap-6 relative z-10 pl-1 sm:pl-0">
                <div className="hidden sm:block w-px h-12 bg-gray-200" />
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Star size={18} className="text-amber-500 fill-amber-500" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900 leading-tight">{xp}</p>
                    <p className="text-xs text-gray-500">Total XP</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      <Zap size={18} className="text-yellow-500 fill-yellow-500" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900 leading-tight">{bits ?? "…"}</p>
                      <p className="text-xs text-gray-500">Bits</p>
                    </div>
                  </div>
                  <Link href="/bits" className="block mt-1 ml-[50px] text-xs text-primary-600 hover:text-primary-700 hover:underline underline-offset-2 font-medium">
                    Buy more
                  </Link>
                </div>
              </div>
            )}
            {isEmployer && (
              <Link href="/employer/dashboard"
                className="relative z-10 flex items-center gap-2 bg-primary-600 hover:bg-primary-700 transition-colors text-white text-sm font-medium px-4 py-2 rounded-xl w-fit">
                <ClipboardList size={16} /> Manage Postings
              </Link>
            )}
          </div>
        </div>

        {/* ── EMPLOYER OVERVIEW ── */}
        {isEmployer ? (
          <>
            {/* Quick actions */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { href: "/employer/post-job",        icon: Briefcase, label: "Post a Job",       color: "text-emerald-700 bg-emerald-50 border-emerald-200", btn: "bg-emerald-600 hover:bg-emerald-700" },
                { href: "/employer/post-competition", icon: Trophy,    label: "Post Competition", color: "text-blue-700 bg-blue-50 border-blue-200",           btn: "bg-blue-600 hover:bg-blue-700"       },
                { href: "/employer/create-quiz",      icon: Zap,       label: "Create Quiz",      color: "text-purple-700 bg-purple-50 border-purple-200",     btn: "bg-purple-600 hover:bg-purple-700"   },
              ].map(({ href, icon: Icon, label, color, btn }) => (
                <Link key={href} href={href}
                  className={`card p-5 border flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow ${color}`}>
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{label}</p>
                    <p className="text-xs opacity-70 mt-0.5">Click to get started</p>
                  </div>
                  <span className={`text-xs text-white px-3 py-1 rounded-full font-medium ${btn}`}>
                    <PlusCircle size={12} className="inline mr-1" />Create
                  </span>
                </Link>
              ))}
            </div>

            {/* Browse links for employers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">Latest Job Postings on Platform</h2>
                  <Link href="/jobs" className="text-sm text-primary-600 hover:underline flex items-center gap-1">View all <ArrowRight size={13} /></Link>
                </div>
                <div className="space-y-3">
                  {jobs.slice(0, 4).map((job) => (
                    <Link href={`/jobs/${job.id}`} key={job.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt={job.company} className="w-14 h-14 rounded-xl object-contain border border-gray-100 bg-white p-1 flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-primary-50 text-primary-700 font-bold text-lg flex items-center justify-center flex-shrink-0">{job.company.charAt(0)}</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary-700">{job.title}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10} />{job.city} · {job.type.replace("-"," ")}</p>
                      </div>
                      <p className="text-xs font-semibold text-primary-700 flex-shrink-0">{formatSalary({ min: job.salaryMin, max: job.salaryMax, currency: "XAF", period: job.salaryPeriod })}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className="card p-5 bg-emerald-50 border border-emerald-100">
                  <h3 className="font-semibold text-emerald-800 mb-2">Your Account</h3>
                  <p className="text-sm text-emerald-700">{user.email}</p>
                  <p className="text-xs text-emerald-600 mt-1">{(user as any).companyName || "Employer"} · {(user as any).city || "Cameroon"}</p>
                  <Link href="/employer/dashboard" className="mt-3 block text-center text-sm py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                    Employer Dashboard
                  </Link>
                </div>
                <div className="card p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Company Quizzes</h3>
                  <p className="text-xs text-gray-500 mb-3">Create quizzes to show job seekers your company's technical standards.</p>
                  <Link href="/employer/create-quiz" className="block text-center text-sm py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                    Create a Quiz
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ── JOB SEEKER OVERVIEW ── */
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 space-y-5">
                <div className="card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900">Recommended Jobs</h2>
                    <Link href="/jobs" className="text-sm text-primary-600 hover:underline flex items-center gap-1">View all <ArrowRight size={13} /></Link>
                  </div>
                  <div className="space-y-3">
                    {jobs.slice(0, 3).map((job) => (
                      <Link href={`/jobs/${job.id}`} key={job.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                        {job.companyLogo ? (
                          <img src={job.companyLogo} alt={job.company} className="w-14 h-14 rounded-xl object-contain border border-gray-100 bg-white p-1 flex-shrink-0" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-primary-50 text-primary-700 font-bold text-lg flex items-center justify-center flex-shrink-0">{job.company.charAt(0)}</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary-700">{job.title}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10} />{job.city} · {job.type.replace("-"," ")}</p>
                        </div>
                        <p className="text-xs font-semibold text-primary-700 flex-shrink-0">{formatSalary({ min: job.salaryMin, max: job.salaryMax, currency: "XAF", period: job.salaryPeriod })}</p>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900">Active Competitions</h2>
                    <Link href="/competitions" className="text-sm text-primary-600 hover:underline flex items-center gap-1">View all <ArrowRight size={13} /></Link>
                  </div>
                  <div className="space-y-3">
                    {competitions.map((comp) => (
                      <Link href={`/competitions/${comp.id}`} key={comp.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                        {comp.organizerLogo ? (
                          <img src={comp.organizerLogo} alt={comp.organizer} className="w-14 h-14 rounded-xl object-contain border border-gray-100 bg-white p-1 flex-shrink-0" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center flex-shrink-0"><Trophy size={24} /></div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary-700">{comp.title}</p>
                          <p className="text-xs text-gray-500">{comp.organizer} · {comp.type?.replace("-"," ")}</p>
                        </div>
                        <span className={`badge ${getStatusColor(comp.status)} text-xs`}>{comp.status}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="card p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Company Quizzes</h3>
                  <p className="text-xs text-gray-500 mb-3">Test yourself with quizzes created by top Cameroonian employers.</p>
                  <div className="space-y-2">
                    {mockQuizzes.map((q) => (
                      <Link href={`/quiz/${q.id}`} key={q.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Zap size={14} /></div>
                          <div>
                            <p className="text-xs font-semibold text-gray-800 truncate max-w-28 group-hover:text-primary-700">{q.title}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1"><Clock size={9} />{Math.floor(q.timeLimit / 60)} min</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-primary-600">+{q.totalPoints} XP</span>
                      </Link>
                    ))}
                  </div>
                  <Link href="/quiz" className="mt-3 block text-center text-xs text-primary-600 hover:underline">Browse all quizzes →</Link>
                </div>

                <div className="card p-5 bg-primary-50 border border-primary-100">
                  <h3 className="font-semibold text-primary-800 mb-2">Your Profile</h3>
                  <p className="text-sm text-primary-700">{user.email}</p>
                  <p className="text-xs text-primary-500 mt-1">Job Seeker · {(user as any).city || "Cameroon"}</p>
                  <Link href="/profile" className="mt-3 block text-center btn-primary text-sm py-2">View Profile</Link>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="mb-5">
          <h2 className="text-xl font-display font-bold text-gray-900">My Activity</h2>
          <p className="text-sm text-gray-500 mt-1">Track your progress across applications, competitions and opportunities.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
          {([
           
            { key: "applications",  label: "Applications",   icon: Briefcase, count: apps.length  },
            { key: "competitions",  label: "Competitions",    icon: Trophy,    count: regs.length  },
            { key: "saved",         label: "Saved",           icon: Bookmark,  count: saved.length },
            { key: "liked",         label: "Liked",           icon: Heart,     count: liked.length },
          ] as const).map(({ key, label, icon: Icon, count }) => (
            <button key={key} onClick={() => changeTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                tab === key ? "border-primary-600 text-primary-700" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              {Icon && <Icon size={15} />} {label}
              {count !== null && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                  tab === key ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-500"
                }`}>{count}</span>
              )}
            </button>
          ))}
        </div>

    

        {/* ── Applications Tab ── */}
        {tab === "applications" && (
          apps.length === 0 ? (
            <div className="card p-12 text-center text-gray-400">
              <Briefcase size={40} className="mx-auto mb-3 opacity-40" />
              <p className="font-medium">No applications yet</p>
              <Link href="/jobs" className="mt-3 inline-block text-sm text-primary-600 font-medium hover:underline">
                Browse jobs →
              </Link>
            </div>
          ) : (
            <ScrollRow>{apps.map(applicationCard)}</ScrollRow>
          )
        )}

        {/* ── Competitions Tab ── */}
        {tab === "competitions" && (
          regs.length === 0 ? (
            <div className="card p-12 text-center text-gray-400">
              <Trophy size={40} className="mx-auto mb-3 opacity-40" />
              <p className="font-medium">No competition registrations yet</p>
              <Link href="/competitions" className="mt-3 inline-block text-sm text-primary-600 font-medium hover:underline">
                Browse competitions →
              </Link>
            </div>
          ) : (
            <ScrollRow>{regs.map(registrationCard)}</ScrollRow>
          )
        )}

        {/* ── Saved Tab ── */}
        {tab === "saved" && (
          savedLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 size={28} className="animate-spin text-primary-500" />
            </div>
          ) : saved.length === 0 ? (
            <div className="card p-12 text-center">
              <Bookmark size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Nothing saved yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Tap the bookmark icon on any job or competition to save it here.
              </p>
              <div className="flex gap-3 justify-center mt-6">
                <Link href="/jobs" className="btn-primary text-sm">Browse Jobs</Link>
                <Link href="/competitions" className="btn-ghost text-sm">Competitions</Link>
              </div>
            </div>
          ) : (
            <ScrollRow>{saved.map(savedCard).filter(Boolean)}</ScrollRow>
          )
        )}

        {/* ── Liked Tab ── */}
        {tab === "liked" && (
          likedLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 size={28} className="animate-spin text-primary-500" />
            </div>
          ) : liked.length === 0 ? (
            <div className="card p-12 text-center">
              <Heart size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Nothing liked yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Tap the ❤️ on any job or competition to add it here.
              </p>
              <div className="flex gap-3 justify-center mt-6">
                <Link href="/jobs" className="btn-primary text-sm">Browse Jobs</Link>
                <Link href="/competitions" className="btn-ghost text-sm">Competitions</Link>
              </div>
            </div>
          ) : (
            <ScrollRow>{liked.map(likedCard).filter(Boolean)}</ScrollRow>
          )
        )}
      </div>
</div>
  );
}

export default function MyActivityPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      </div>
    }>
      <MyActivityInner />
    </Suspense>
  );
}