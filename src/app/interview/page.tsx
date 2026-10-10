// src/app/interview/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Mic, Brain, Clock, Trophy, ArrowRight, Briefcase,
  ChevronRight, CheckCircle, Star, BarChart2, Loader2,
  Sparkles,
} from "lucide-react";

// Real employer logos already seeded in this app's own database
// (src/app/api/seed/route.ts) — these are actual companies with employer
// accounts and job listings on this platform, not third-party brand marks.
const HERO_EMPLOYERS = [
  { name: "MTN Cameroon",            initials: "MTN", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/MTN_Logo.svg/200px-MTN_Logo.svg.png",         bg: "bg-yellow-400",  text: "text-black",  rotate: "-rotate-6" },
  { name: "Orange Cameroun",         initials: "OR",  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/200px-Orange_logo.svg.png",      bg: "bg-orange-500",  text: "text-white",  rotate: "rotate-3"  },
  { name: "TotalEnergies Cameroun",  initials: "TE",  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/TotalEnergies_logo.svg/200px-TotalEnergies_logo.svg.png", bg: "bg-red-600", text: "text-white", rotate: "-rotate-3" },
];

const TYPES = [
  {
    value: "behavioural", label: "Behavioural", desc: "Situational & STAR-method questions",
    image: "https://images.unsplash.com/photo-1758691737246-95bf8f09a997?w=500&q=75&auto=format&fit=crop",
  },
  {
    value: "technical", label: "Technical", desc: "Skills, tools & problem solving",
    image: "https://images.unsplash.com/photo-1630524274689-2950ac0fc91e?w=500&q=75&auto=format&fit=crop",
  },
  {
    value: "hr", label: "HR / General", desc: "Culture fit, salary, career goals",
    image: "https://images.unsplash.com/photo-1758518730384-be3d205838e8?w=500&q=75&auto=format&fit=crop",
  },
  {
    value: "mixed", label: "Mixed", desc: "A blend of all types",
    image: "https://images.unsplash.com/photo-1758518731706-be5d5230e5a5?w=500&q=75&auto=format&fit=crop",
  },
];

const COUNTS = [5, 10, 15];

// Shows the real logo; if it fails to load (dead hotlink, blocked, etc.)
// falls back to a colored initials badge instead of a broken image icon.
function LogoTile({ employer }: { employer: typeof HERO_EMPLOYERS[number] }) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      title={employer.name}
      className={`w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white shadow-md border border-gray-100 flex items-center justify-center overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg ${employer.rotate}`}
    >
      {failed ? (
        <div className={`w-full h-full ${employer.bg} ${employer.text} flex items-center justify-center text-[10px] font-extrabold`}>
          {employer.initials}
        </div>
      ) : (
        <img
          src={employer.logo}
          alt={employer.name}
          className="max-w-full max-h-full object-contain p-1.5"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export default function InterviewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [step,           setStep]           = useState<"setup" | "starting">("setup");
  const [interviewType,  setInterviewType]  = useState("mixed");
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [jobTitle,       setJobTitle]       = useState("");
  const [company,        setCompany]        = useState("");
  const [pastInterviews, setPastInterviews] = useState<any[]>([]);
  const [loadingPast,    setLoadingPast]    = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch("/api/interview")
      .then(r => r.json())
      .then(data => setPastInterviews(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoadingPast(false));
  }, [session?.user?.id]);

  const startInterview = async () => {
    setStep("starting");
    try {
      const res  = await fetch("/api/interview", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ interviewType, totalQuestions, jobTitle: jobTitle || undefined, company: company || undefined }),
      });
      const data = await res.json();
      if (data.interview?.id) {
        router.push(`/interview/${data.interview.id}`);
      } else {
        setStep("setup");
        alert("Failed to start interview. Please try again.");
      }
    } catch {
      setStep("setup");
      alert("Something went wrong. Please try again.");
    }
  };

  const scoreColor = (s: number) =>
    s >= 80 ? "text-emerald-600" : s >= 60 ? "text-amber-600" : "text-red-500";

  // Don't flash the full interview page before we know whether the person
  // is signed in — show a loading spinner while the session resolves, and
  // render nothing at all once we know they're logged out (the useEffect
  // above is already redirecting them to login).
  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 size={28} className="animate-spin text-primary-500" />
    </div>
  );
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <div className="max-w-4xl mx-auto px-4 py-8 w-full flex-1">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 via-indigo-100 to-sky-50 border border-primary-100/60 mb-6 px-5 py-5 md:px-8 md:py-6">
          <div
            className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-primary-300/30 blur-3xl transition-opacity duration-700"
            aria-hidden="true"
          />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
            {/* Text */}
            <div>
              <div className="inline-flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1 rounded-full text-[11px] font-semibold mb-2.5">
                <Sparkles size={12} className="text-yellow-300" /> AI-Powered
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-extrabold text-gray-900 leading-tight">
                AI <span className="text-primary-600">Mock Interview</span> Practice
              </h1>
              <p className="text-gray-500 mt-1.5 text-sm max-w-md">
                Practice with real interview-style questions and get instant AI feedback.
              </p>
            </div>

            {/* Laptop illustration with real seeded employer logos */}
            <div className="flex-shrink-0 relative flex items-center justify-center w-full md:w-auto min-h-[110px] pt-6">
              <div className="relative w-36 md:w-40">
                <div className="rounded-t-lg border-[4px] border-slate-800 bg-white aspect-[16/10] shadow-lg" />
                <div className="h-1.5 bg-slate-300 rounded-b-md shadow-sm" style={{ width: "112%", marginLeft: "-6%" }} />
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-1.5">
                {HERO_EMPLOYERS.map(c => (
                  <LogoTile key={c.name} employer={c} />
                ))}
              </div>

            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Setup Card ── */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 text-lg mb-5">Configure your session</h2>

              {/* Job context (optional) */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title <span className="text-gray-400 font-normal">(optional — makes questions more relevant)</span>
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  placeholder="e.g. Software Engineer, Marketing Manager…"
                  className="input w-full"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Company <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="e.g. MTN Cameroon, Orange…"
                  className="input w-full"
                />
              </div>

              {/* Interview type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Interview Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {TYPES.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setInterviewType(t.value)}
                      className={`overflow-hidden rounded-xl border-2 text-left transition-all group ${
                        interviewType === t.value
                          ? "border-primary-500 ring-2 ring-primary-100"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="relative h-20 w-full overflow-hidden bg-gray-100">
                        <img
                          src={t.image}
                          alt={t.label}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className={`absolute inset-0 transition-colors ${
                          interviewType === t.value ? "bg-primary-900/10" : "bg-black/10 group-hover:bg-black/0"
                        }`} />
                        {interviewType === t.value && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                            <CheckCircle size={13} className="text-white" fill="currentColor" />
                          </div>
                        )}
                      </div>
                      <div className="p-3 bg-white">
                        <p className={`text-sm font-semibold ${interviewType === t.value ? "text-primary-700" : "text-gray-800"}`}>
                          {t.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question count */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Number of Questions</label>
                <div className="flex gap-3">
                  {COUNTS.map(n => (
                    <button
                      key={n}
                      onClick={() => setTotalQuestions(n)}
                      className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                        totalQuestions === n
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      {n} questions
                      <p className="text-xs font-normal text-gray-400 mt-0.5">
                        ~{n * 3} min
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Start button */}
              <button
                onClick={startInterview}
                disabled={step === "starting"}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-base"
              >
                {step === "starting"
                  ? <><Loader2 size={18} className="animate-spin" /> Preparing your interview…</>
                  : <><Mic size={18} /> Start Interview <ArrowRight size={16} /></>
                }
              </button>

              {/* Tips */}
              <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 font-medium mb-1">💡 Tips for best results</p>
                <ul className="text-xs text-gray-400 space-y-0.5">
                  <li>• Use the microphone button to speak your answer</li>
                  <li>• Take your time — there's no time limit per question</li>
                  <li>• Try the STAR method for behavioural questions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── Sidebar: past interviews ── */}
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart2 size={16} className="text-primary-600" /> Past Sessions
              </h3>

              {loadingPast ? (
                <div className="flex justify-center py-6"><Loader2 size={20} className="animate-spin text-gray-300" /></div>
              ) : pastInterviews.length === 0 ? (
                <div className="text-center py-6">
                  <Brain size={28} className="text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No interviews yet</p>
                  <p className="text-xs text-gray-300 mt-1">Start one above!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pastInterviews.slice(0, 5).map(iv => (
                    <Link key={iv.id} href={`/interview/${iv.id}`}
                      className="block p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold text-gray-700 capitalize">
                          {iv.interviewType} · {iv.totalQuestions}Q
                        </p>
                        {iv.status === "completed" && iv.scoreOverall != null ? (
                          <span className={`text-sm font-bold ${scoreColor(iv.scoreOverall)}`}>
                            {iv.scoreOverall}%
                          </span>
                        ) : (
                          <span className="text-xs text-amber-600 font-medium">In progress</span>
                        )}
                      </div>
                      {iv.jobTitle && <p className="text-xs text-gray-500 truncate">{iv.jobTitle}</p>}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(iv.createdAt).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                  {pastInterviews.length > 5 && (
                    <p className="text-xs text-center text-gray-400">
                      +{pastInterviews.length - 5} more in your profile
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Stats card */}
            {pastInterviews.filter(i => i.status === "completed").length > 0 && (() => {
              const done = pastInterviews.filter(i => i.status === "completed" && i.scoreOverall != null);
              const avg  = Math.round(done.reduce((s, i) => s + i.scoreOverall, 0) / done.length);
              const best = Math.max(...done.map(i => i.scoreOverall));
              return (
                <div className="card p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Star size={16} className="text-amber-500" /> Your Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">Sessions</p>
                      <p className="font-bold text-gray-800">{done.length}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">Avg score</p>
                      <p className={`font-bold ${scoreColor(avg)}`}>{avg}%</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">Best score</p>
                      <p className={`font-bold ${scoreColor(best)}`}>{best}%</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
</div>
  );
}