// src/app/jobs/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  MapPin, Clock, ArrowLeft, CheckCircle, Calendar,
  Wifi, WifiOff, Share2, X, Upload, Linkedin, Globe,
  Phone, Zap, FileText, User, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui";
import SaveButton from "@/components/ui/SaveButton";
import LikeButton from "@/components/ui/LikeButton";
import { getJobTypeColor, daysUntil } from "@/lib/utils";
import dynamic from "next/dynamic";
import EngagementTabs from "@/components/engagement/EngagementTabs";
import MessageButton from "@/components/messaging/MessageButton";
const LocationMap = dynamic(() => import("@/components/map/LocationMap"), { ssr: false });

const CASUAL_TYPES = ["gig", "one-day"];

// ─── Casual Apply Modal ───────────────────────────────────────────────────────
function CasualApplyModal({
  job, user, onClose, onSuccess,
}: {
  job: any; user: any; onClose: () => void; onSuccess: () => void;
}) {
  const [phone,        setPhone]        = useState(user?.phone ?? "");
  const [availability, setAvailability] = useState("");
  const [note,         setNote]         = useState("");
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [insufficientBits, setInsufficientBits] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) { setError("Phone number is required so the employer can reach you."); return; }
    setLoading(true); setError(""); setInsufficientBits(false);
    try {
      const res  = await fetch(`/api/jobs/${job.id}/apply`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ phone, availability, note }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to apply");
        setInsufficientBits(data.code === "insufficient_bits");
        setLoading(false);
        return;
      }
      onSuccess();
    } catch { setError("Something went wrong."); setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-lg">⚡</span>
              <h2 className="font-bold text-gray-900">Quick Apply</h2>
              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full capitalize">
                {job.type.replace("-", " ")} job
              </span>
            </div>
            <p className="text-sm text-gray-500 truncate">{job.title} · {job.company}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Info banner */}
        <div className="mx-5 mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2.5">
          <Zap size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            This is a casual job — no CV needed. Just leave your phone number and the employer will contact you directly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Phone — required */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="+237 6XX XXX XXX" required
                className="input w-full pl-9"
              />
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">When are you available?</label>
            <input
              type="text" value={availability} onChange={e => setAvailability(e.target.value)}
              placeholder="e.g. Tomorrow morning, Weekends, Anytime this week"
              className="input w-full"
            />
          </div>

          {/* Short note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Note <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              value={note} onChange={e => setNote(e.target.value)} rows={2}
              placeholder="e.g. I have my own tools, I can start immediately…"
              className="input w-full resize-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl p-3">
              <AlertCircle size={15} /> {error}
            </div>
          )}
          {insufficientBits && (
            <a href="/bits" className="block text-center text-sm py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors">
              ⚡ Buy More Bits
            </a>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</> : <><Zap size={15} />Apply Now</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Formal Apply Modal ───────────────────────────────────────────────────────
function FormalApplyModal({
  job, user, onClose, onSuccess,
}: {
  job: any; user: any; onClose: () => void; onSuccess: () => void;
}) {
  const [step,         setStep]         = useState(1);
  const [coverLetter,  setCoverLetter]  = useState("");
  const [resumeUrl,    setResumeUrl]    = useState(user?.resumeUrl ?? "");
  const [linkedinUrl,  setLinkedinUrl]  = useState(user?.linkedinUrl ?? "");
  const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolioUrl ?? "");
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [insufficientBits, setInsufficientBits] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverLetter.trim()) { setError("A cover letter is required."); return; }
    setLoading(true); setError(""); setInsufficientBits(false);
    try {
      const res  = await fetch(`/api/jobs/${job.id}/apply`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ coverLetter, resumeUrl, linkedinUrl, portfolioUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to apply");
        setInsufficientBits(data.code === "insufficient_bits");
        setLoading(false);
        return;
      }
      onSuccess();
    } catch { setError("Something went wrong."); setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="font-bold text-gray-900">Apply for this Role</h2>
            <p className="text-sm text-gray-500 truncate">{job.title} · {job.company}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-5 pt-4 flex-shrink-0">
          <div className="flex items-center gap-2 mb-1">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step >= s ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-400"
                }`}>{s}</div>
                {s < 2 && <div className={`flex-1 h-0.5 w-12 transition-colors ${step > s ? "bg-primary-600" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
          <div className="flex gap-16 text-xs text-gray-400 mt-1 mb-3">
            <span className={step === 1 ? "text-primary-600 font-medium" : ""}>Your Profile</span>
            <span className={step === 2 ? "text-primary-600 font-medium" : ""}>Cover Letter</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-5 overflow-y-auto flex-1 space-y-4 pb-4">
            {step === 1 && (
              <>
                {/* Pre-filled profile summary */}
                <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-200 text-primary-700 font-bold flex items-center justify-center flex-shrink-0">
                      {user?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.currentJobTitle || "Job Seeker"} · {user?.city || "Cameroon"}</p>
                    </div>
                  </div>
                  {user?.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {user.skills.slice(0, 5).map((s: string) => (
                        <span key={s} className="text-xs bg-white text-primary-700 border border-primary-200 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn URL <span className="text-gray-400">(optional)</span>
                  </label>
                  <div className="relative">
                    <Linkedin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="url" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="input w-full pl-9 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Portfolio / GitHub URL <span className="text-gray-400">(optional)</span>
                  </label>
                  <div className="relative">
                    <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="url" value={portfolioUrl} onChange={e => setPortfolioUrl(e.target.value)}
                      placeholder="https://yourportfolio.com"
                      className="input w-full pl-9 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resume / CV Link <span className="text-gray-400">(optional — Google Drive, Dropbox, etc.)</span>
                  </label>
                  <div className="relative">
                    <FileText size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="url" value={resumeUrl} onChange={e => setResumeUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/..."
                      className="input w-full pl-9 text-sm" />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Letter <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-400 mb-2">
                    Tell {job.company} why you're a great fit for this role. Be specific and genuine.
                  </p>
                  <textarea
                    value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
                    rows={8} required
                    placeholder={`Dear ${job.company} Hiring Team,\n\nI am writing to express my interest in the ${job.title} position...\n\n[Why you're a good fit]\n[Relevant experience]\n[Why this company]\n\nBest regards,\n${user?.name}`}
                    className="input w-full resize-none text-sm leading-relaxed"
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">{coverLetter.length} / 2000 chars</p>
                </div>

                {/* Requirements reminder */}
                {job.requirements?.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Key requirements to address:</p>
                    <ul className="space-y-1">
                      {job.requirements.slice(0, 3).map((r: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-gray-500">
                          <CheckCircle size={11} className="text-green-500 mt-0.5 flex-shrink-0" />{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl p-3">
                <AlertCircle size={15} /> {error}
              </div>
            )}
            {insufficientBits && (
              <a href="/bits" className="block text-center text-sm py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors">
                ⚡ Buy More Bits
              </a>
            )}
          </div>

          {/* Footer buttons */}
          <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
            {step === 1 ? (
              <>
                <button type="button" onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="button" onClick={() => setStep(2)}
                  className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold transition-colors">
                  Next: Cover Letter →
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
                  ← Back
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting…</>
                    : <><CheckCircle size={15} />Submit Application</>}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function JobDetailPage() {
  const { id }   = useParams();
  const router   = useRouter();
  const { data: session } = useSession();

  const [job,     setJob]     = useState<any>(null);
  const [dbUser,  setDbUser]  = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [applied,   setApplied]   = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jRes, uRes] = await Promise.all([
          fetch(`/api/jobs/${id}`, { cache: "no-store" }),
          session?.user ? fetch(`/api/user/me`) : Promise.resolve(null),
        ]);
        const jData = await jRes.json();
        setJob(jData.job ?? null);
        if (uRes) { const uData = await uRes.json(); setDbUser(uData.user ?? null); }
      } catch { setJob(null); }
      setLoading(false);
    };
    if (id) fetchData();
  }, [id, session]);

  // Check whether the current job seeker already applied (so the Message button
  // shows correctly on a revisit/refresh, not just right after applying).
  useEffect(() => {
    if (!id || !session?.user || session.user.role === "employer") return;
    fetch(`/api/jobs/${id}/apply`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.applied) setApplied(true); })
      .catch(() => {});
  }, [id, session]);

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-5xl mx-auto px-4 py-8 w-full flex-1 animate-pulse space-y-4">
        <div className="h-4 bg-gray-100 rounded w-24" />
        <div className="card p-6 space-y-3">
          <div className="flex gap-4"><div className="w-14 h-14 bg-gray-100 rounded-xl" /><div className="flex-1 space-y-2"><div className="h-5 bg-gray-100 rounded w-1/2" /><div className="h-4 bg-gray-100 rounded w-1/3" /></div></div>
        </div>
      </div>
</div>
  );

  if (!job) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-3">
      <h2 className="text-xl font-bold text-gray-700">Job not found</h2>
      <Link href="/jobs" className="text-primary-600 hover:underline">← Back to Jobs</Link>
    </div>
  );

  const isCasual         = CASUAL_TYPES.includes(job.type);
  const days             = daysUntil(job.deadline);
  const isDeadlinePassed = job.deadline && new Date(job.deadline) < new Date();
  const isPlanExpired    = job.planExpiresAt && new Date(job.planExpiresAt) < new Date();
  const isClosed         = isDeadlinePassed || isPlanExpired || !job.isActive;

  const handleApplyClick = () => {
    if (!session) { router.push("/auth/login"); return; }
    setShowModal(true);
  };

  const handleSuccess = () => {
    setShowModal(false);
    setApplied(true);
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* Modals */}
      {showModal && !applied && (
        isCasual
          ? <CasualApplyModal  job={job} user={dbUser} onClose={() => setShowModal(false)} onSuccess={handleSuccess} />
          : <FormalApplyModal  job={job} user={dbUser} onClose={() => setShowModal(false)} onSuccess={handleSuccess} />
      )}

      <div className="max-w-5xl mx-auto px-4 py-8 w-full flex-1">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors">
          <ArrowLeft size={15} /> Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-5">
            <div className="card p-6">
              <div className="flex items-start gap-4">
                {/* Company logo — falls back to coloured initial */}
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-14 h-14 rounded-xl object-contain border border-gray-100 bg-white p-1 flex-shrink-0"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center text-primary-700 font-bold text-2xl flex-shrink-0">
                    {job.company?.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-xl font-display font-bold text-gray-900">{job.title}</h1>
                  {/* "Hosted by" company row */}
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-gray-600">{job.company}</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 text-primary-700 text-[10px] font-semibold rounded-full border border-primary-100">
                      Hosted by {job.company}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className={`badge ${getJobTypeColor(job.type)} capitalize`}>{job.type?.replace("-"," ")}</span>
                    <span className="badge bg-gray-100 text-gray-600 capitalize">{job.category}</span>
                    {job.isRemote && <span className="badge bg-green-100 text-green-700">Remote OK</span>}
                    {isCasual && (
                      <span className="badge bg-orange-100 text-orange-700 flex items-center gap-1">
                        <Zap size={10} /> Quick Apply
                      </span>
                    )}
                  </div>
                  {/* ── Like & Save ── */}
                  <div className="flex items-center gap-2 mt-4">
                    <LikeButton targetType="job" targetId={job.id} variant="icon" />
                    <SaveButton targetType="job" targetId={job.id} variant="icon" className="border border-gray-200 rounded-full px-3 py-1.5 text-sm" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Pay</p>
                  <p className="text-sm font-bold text-primary-700">
                    {job.salaryMin?.toLocaleString()} – {job.salaryMax?.toLocaleString()} XAF
                  </p>
                  <p className="text-xs text-gray-400">per {job.salaryPeriod}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Location</p>
                  <p className="text-sm font-semibold text-gray-700 flex items-center justify-center gap-1"><MapPin size={12} />{job.city}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Type</p>
                  <p className="text-sm font-semibold text-gray-700 capitalize">{job.type?.replace("-"," ")}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Deadline</p>
                  <p className={`text-sm font-semibold flex items-center justify-center gap-1 ${days < 3 ? "text-red-600" : "text-gray-700"}`}>
                    <Calendar size={12} />{days}d left
                  </p>
                </div>
              </div>
            </div>

            {/* Casual job info banner */}
            {isCasual && (
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-start gap-3">
                <Zap size={20} className="text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-orange-800 text-sm">Casual / Quick Job</p>
                  <p className="text-xs text-orange-600 mt-0.5">
                    No CV required. Just tap Apply, leave your phone number and availability — the employer contacts you directly.
                  </p>
                </div>
              </div>
            )}

            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-3">About this Role</h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            {job.requirements?.length > 0 && (
              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 mb-3">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <CheckCircle size={15} className="text-green-500 mt-0.5 flex-shrink-0" />{req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.tags?.length > 0 && (
              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((t: string) => (
                    <span key={t} className="text-sm text-primary-700 bg-primary-50 px-3 py-1 rounded-full">#{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews, FAQ & Discussion */}
            <EngagementTabs
              targetType="job"
              targetId={job.id}
              ownerId={job.postedById}
            />

            <div className="lg:hidden">
              <LocationMap venueName={job.company} venueCity={job.city} venueRegion={job.region} isOnline={job.isRemote} zone={job.zone} latitude={job.latitude} longitude={job.longitude} />
            </div>
          </div>

          {/* ── Right column ── */}
          <div>
            <div className="card p-5">
              <div className="text-center mb-4">
                <p className="text-2xl font-bold text-primary-700">
                  {job.salaryMin?.toLocaleString()} XAF
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Starting / per {job.salaryPeriod}</p>
              </div>

              {session?.user?.role === "employer" ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                  <p className="text-sm font-semibold text-amber-700">🏢 Employer Account</p>
                  <p className="text-xs text-amber-600 mt-1">Employers cannot apply for jobs. This feature is for job seekers only.</p>
                </div>
              ) : isClosed ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">🔒</div>
                  <p className="text-sm font-bold text-red-700">Applications Closed</p>
                  <p className="text-xs text-red-500 mt-1">
                    {isDeadlinePassed
                      ? "The application deadline for this job has passed."
                      : "This job listing is no longer active."}
                  </p>
                </div>
              ) : applied ? (
                <div className="space-y-2">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <CheckCircle size={28} className="text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-green-700">
                      {isCasual ? "Request Sent! 📲" : "Application Submitted! 🎉"}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {isCasual
                        ? "The employer will call or message you soon."
                        : "They will review your application and get back to you."}
                    </p>
                  </div>
                  {job.postedById && (
                    <MessageButton jobId={job.id} label="Message Employer" />
                  )}
                </div>
              ) : (
                <>
                  <p className="flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 rounded-full px-3 py-1.5 mb-2 w-fit mx-auto">
                    <Zap size={12} className="text-amber-500" /> Costs {job.bitsCost ?? 5} bits to apply
                  </p>
                  <button onClick={handleApplyClick}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
                      isCasual
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "bg-primary-600 hover:bg-primary-700 text-white"
                    }`}>
                    {isCasual ? <><Zap size={16} />Quick Apply</> : <><FileText size={16} />Apply Now</>}
                  </button>
                </>
              )}

              <div className="flex gap-2 mt-2">
                {/* Save button — full width for job seekers */}
                <SaveButton targetType="job" targetId={job.id} variant="full" className="flex-1" />
                {/* Share */}
                <button
                  onClick={() => navigator.share?.({ title: job.title, url: window.location.href })}
                  className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 hover:bg-gray-50 rounded-xl transition-colors"
                  title="Share this job"
                >
                  <Share2 size={14} />
                </button>
              </div>

              <div className="border-t border-gray-100 mt-4 pt-4 space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1.5"><Clock size={13} />Posted</span>
                  <span className="font-medium text-gray-700">{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1.5"><Calendar size={13} />Deadline</span>
                  <span className={`font-medium ${days <= 0 ? "text-red-600 font-bold" : days < 5 ? "text-red-600" : "text-gray-700"}`}>
                  {days <= 0 ? "Closed" : `${days} days left`}
                </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1.5">{job.isRemote ? <Wifi size={13} /> : <WifiOff size={13} />}Work</span>
                  <span className="font-medium text-gray-700">{job.isRemote ? "Remote" : "On-site"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1.5"><MapPin size={13} />Region</span>
                  <span className="font-medium text-gray-700">{job.region}</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block mt-4">
              <LocationMap venueName={job.company} venueCity={job.city} venueRegion={job.region} isOnline={job.isRemote} zone={job.zone} latitude={job.latitude} longitude={job.longitude} />
            </div>
          </div>
        </div>
      </div>
</div>
  );
}