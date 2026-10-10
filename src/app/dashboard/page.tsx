"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase, Trophy, Zap, TrendingUp, ArrowRight,
  MapPin, Clock, PlusCircle, Users, ClipboardList,
} from "lucide-react";
import { mockQuizzes } from "@/lib/data";
import { formatSalary, getStatusColor } from "@/lib/utils";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bits, setBits] = useState<number | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);

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

  // Live jobs & competitions (real employer-uploaded logos, not mock placeholders)
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

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );
  if (!session) return null;

  const user       = session.user;
  const isEmployer = user.role === "employer";
  const xp         = user.xp ?? 0;
  const level      = Math.floor(xp / 1000) + 1;
  const xpProgress = ((xp % 1000) / 1000) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">

        {/* Hero banner */}
        <div className="hero-gradient rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold mb-1">
                Welcome back, {user.name?.split(" ")[0]}! 👋
              </h1>
              <p className="text-purple-200 text-sm">
                {isEmployer
                  ? `${(user as any).companyName || "Your company"} — Employer Dashboard`
                  : "Here's what's happening in Cameroon today"}
              </p>
            </div>
            {!isEmployer && (
              <div className="hidden sm:flex items-start gap-6">
                <div className="text-right">
                  <p className="text-3xl font-bold">{xp}</p>
                  <p className="text-purple-200 text-sm">Total XP</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold flex items-center gap-1 justify-end">
                    <Zap size={22} className="text-yellow-300" />{bits ?? "…"}
                  </p>
                  <Link href="/bits" className="text-purple-200 text-sm hover:text-white underline underline-offset-2">
                    Buy more bits
                  </Link>
                </div>
              </div>
            )}
            {isEmployer && (
              <Link href="/employer/dashboard"
                className="hidden sm:flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors text-white text-sm font-medium px-4 py-2 rounded-xl">
                <ClipboardList size={16} /> Manage Postings
              </Link>
            )}
          </div>
          {!isEmployer && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-purple-200 mb-1">
                <span>Level {level}</span>
                <span>{xp % 1000}/1000 XP to Level {level + 1}</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${xpProgress}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* ── EMPLOYER VIEW ── */}
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          /* ── JOB SEEKER VIEW ── */
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Applications", value: "3",              icon: Briefcase,  color: "text-purple-600 bg-purple-50" },
                { label: "Competitions", value: "1",              icon: Trophy,     color: "text-yellow-600 bg-yellow-50" },
                { label: "Quizzes Done", value: "5",              icon: Zap,        color: "text-blue-600 bg-blue-50"     },
                { label: "XP Earned",    value: xp.toLocaleString(), icon: TrendingUp, color: "text-green-600 bg-green-50"  },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="card p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon size={18} /></div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
      </div>
</div>
  );
}