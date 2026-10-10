// src/app/competitions/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowLeft, Trophy, Calendar, MapPin, CheckCircle,
  Wifi, Share2, Users, X, AlertCircle, Clock, Star
} from "lucide-react";
import { formatXAF, getStatusColor, daysUntil } from "@/lib/utils";
import dynamic from "next/dynamic";
import EngagementTabs from "@/components/engagement/EngagementTabs";
import SaveButton from "@/components/ui/SaveButton";
import LikeButton from "@/components/ui/LikeButton";
const LocationMap = dynamic(() => import("@/components/map/LocationMap"), { ssr: false });

const REG_STATUS_CONFIG: Record<string, { label: string; color: string; icon: string; desc: string }> = {
  registered:   { label: "Registered",   icon: "✅", color: "bg-blue-50 border-blue-200 text-blue-800",      desc: "Your registration is received. Waiting for confirmation." },
  confirmed:    { label: "Confirmed",    icon: "🎉", color: "bg-emerald-50 border-emerald-200 text-emerald-800", desc: "You're confirmed! Get ready for the competition." },
  waitlisted:   { label: "Waitlisted",   icon: "⏳", color: "bg-yellow-50 border-yellow-200 text-yellow-800",  desc: "You're on the waitlist. We'll notify you if a spot opens." },
  disqualified: { label: "Disqualified", icon: "❌", color: "bg-red-50 border-red-200 text-red-800",          desc: "Your registration was not accepted for this competition." },
  winner:       { label: "Winner! 🏆",   icon: "🏆", color: "bg-yellow-50 border-yellow-400 text-yellow-900", desc: "Congratulations! You won this competition!" },
};

// ─── Registration Modal ───────────────────────────────────────────────────────
function RegisterModal({
  comp, user, onClose, onSuccess,
}: {
  comp: any; user: any; onClose: () => void; onSuccess: (reg: any) => void;
}) {
  const needsTeam = comp.maxTeamSize > 1;
  const [teamName, setTeamName] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (needsTeam && !teamName.trim()) { setError("Please enter your team name."); return; }
    setLoading(true); setError("");
    try {
      const res  = await fetch(`/api/competitions/${comp.id}/register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ teamName: teamName || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to register"); setLoading(false); return; }
      onSuccess(data.registration);
    } catch { setError("Something went wrong."); setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Trophy size={18} className="text-yellow-500" /> Register for Competition
            </h2>
            <p className="text-sm text-gray-500 truncate mt-0.5">{comp.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Applicant profile summary */}
        <div className="mx-5 mt-4 p-3 bg-primary-50 border border-primary-100 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-200 text-primary-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email} · {user?.city || "Cameroon"}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Competition info */}
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: "Type",       value: comp.type?.replace("-"," ") },
              { label: "Team Size",  value: comp.minTeamSize === comp.maxTeamSize ? `${comp.maxTeamSize} person${comp.maxTeamSize > 1 ? "s":""}` : `${comp.minTeamSize}–${comp.maxTeamSize}` },
              { label: "Reg. closes", value: `${daysUntil(comp.registrationDeadline)}d` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-2.5">
                <p className="text-sm font-bold text-gray-900 capitalize">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          {/* Team name field — only if team competition */}
          {needsTeam ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text" value={teamName} onChange={e => setTeamName(e.target.value)}
                placeholder="e.g. Team Phoenix, CodeCrafters Yaoundé"
                className="input w-full" required
              />
              <p className="text-xs text-gray-400 mt-1">
                Team size: {comp.minTeamSize}–{comp.maxTeamSize} members. Add teammates after registering.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
              This is a solo competition. You'll be registered as an individual participant.
            </div>
          )}

          {/* Eligibility note */}
          {comp.eligibility && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
              <strong>Eligibility:</strong> {comp.eligibility}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl p-3">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Registering…</>
                : <><CheckCircle size={15} />Confirm Registration</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Registration Status Banner ───────────────────────────────────────────────
function RegStatusBanner({ registration }: { registration: any }) {
  const cfg = REG_STATUS_CONFIG[registration.status] ?? REG_STATUS_CONFIG.registered;
  return (
    <div className={`rounded-2xl border p-4 ${cfg.color}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{cfg.icon}</span>
        <p className="font-bold text-sm">{cfg.label}</p>
      </div>
      <p className="text-xs opacity-80">{cfg.desc}</p>
      {registration.note && (
        <p className="text-xs mt-2 italic opacity-70">Note from organizer: {registration.note}</p>
      )}
      <p className="text-xs opacity-60 mt-2 flex items-center gap-1">
        <Clock size={10} /> Registered {new Date(registration.registeredAt).toLocaleDateString()}
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CompetitionDetailPage() {
  const { id }   = useParams();
  const router   = useRouter();
  const { data: session } = useSession();

  const [comp,         setComp]         = useState<any>(null);
  const [dbUser,       setDbUser]       = useState<any>(null);
  const [myReg,        setMyReg]        = useState<any>(null);
  const [loading,      setLoading]      = useState(true);
  const [showModal,    setShowModal]    = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, uRes] = await Promise.all([
          fetch(`/api/competitions/${id}`, { cache: "no-store" }),
          session?.user ? fetch("/api/user/me") : Promise.resolve(null),
        ]);
        const cData = await cRes.json();
        setComp(cData.competition ?? null);
        if (uRes) {
          const uData = await uRes.json();
          setDbUser(uData.user ?? null);
        }
        // fetch existing registration
        if (session?.user && cData.competition) {
          const rRes  = await fetch(`/api/competitions/${id}/my-registration`, { cache: "no-store" });
          if (rRes.ok) { const rData = await rRes.json(); setMyReg(rData.registration ?? null); }
        }
      } catch { setComp(null); }
      setLoading(false);
    };
    if (id) fetchData();
  }, [id, session]);

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-5xl mx-auto px-4 py-8 w-full flex-1 animate-pulse space-y-4">
        <div className="h-4 bg-gray-100 rounded w-24" />
        <div className="card p-6 space-y-3">
          <div className="h-6 bg-gray-100 rounded w-1/2" />
          <div className="h-4 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
</div>
  );

  if (!comp) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-3">
      <h2 className="text-xl font-bold text-gray-700">Competition not found</h2>
      <Link href="/competitions" className="text-primary-600 hover:underline">← Back to Competitions</Link>
    </div>
  );

  const days     = daysUntil(comp.endDate);
  const regDays  = daysUntil(comp.registrationDeadline);
  const topPrize = comp.prizes?.[0];
  const isOwner  = session?.user?.id === comp.postedById;

  return (
    <div className="min-h-screen flex flex-col">

      {showModal && !myReg && (
        <RegisterModal
          comp={comp} user={dbUser}
          onClose={() => setShowModal(false)}
          onSuccess={(reg) => { setMyReg(reg); setShowModal(false); }}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 py-8 w-full flex-1">
        <Link href="/competitions" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors">
          <ArrowLeft size={15} /> Back to Competitions
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-5">
            <div className="card p-6">
              <div className="flex items-start gap-4">
                {/* Organizer logo — falls back to trophy icon */}
                {comp.organizerLogo ? (
                  <img
                    src={comp.organizerLogo}
                    alt={comp.organizer}
                    className="w-14 h-14 rounded-xl object-contain border border-gray-100 bg-white p-1 flex-shrink-0"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600 flex-shrink-0">
                    <Trophy size={28} />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`badge ${getStatusColor(comp.status)} capitalize`}>{comp.status}</span>
                    <span className="badge bg-purple-100 text-purple-700 capitalize">{comp.type?.replace("-"," ")}</span>
                    {comp.isOnline && <span className="badge bg-blue-100 text-blue-700 flex items-center gap-1"><Wifi size={10} />Online</span>}
                  </div>
                  <h1 className="text-xl font-display font-bold text-gray-900">{comp.title}</h1>
                  {/* "Hosted by" organizer row */}
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-gray-600">{comp.organizer}</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-semibold rounded-full border border-purple-100">
                      Hosted by {comp.organizer}
                    </span>
                  </div>
                  {/* ── Like & Save ── */}
                  <div className="flex items-center gap-2 mt-4">
                    <LikeButton targetType="competition" targetId={comp.id} variant="icon" />
                    <SaveButton targetType="competition" targetId={comp.id} variant="icon" className="border border-gray-200 rounded-full px-3 py-1.5 text-sm" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Top Prize</p>
                  <p className="text-sm font-bold text-yellow-600">{topPrize ? formatXAF(topPrize.amount) : "TBA"}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Team Size</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {comp.minTeamSize === comp.maxTeamSize ? `${comp.minTeamSize} person${comp.maxTeamSize > 1 ? "s" : ""}` : `${comp.minTeamSize}–${comp.maxTeamSize}`}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Ends in</p>
                  <p className="text-sm font-semibold text-gray-700">{days}d</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Location</p>
                  <p className="text-sm font-semibold text-gray-700 flex items-center justify-center gap-1">
                    {comp.isOnline ? <><Wifi size={12} />Online</> : <><MapPin size={12} />{comp.city ?? "TBA"}</>}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-3">About this Competition</h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{comp.description}</p>
            </div>

            {comp.prizes?.length > 0 && (
              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 mb-4">🏆 Prizes</h2>
                <div className="space-y-3">
                  {comp.prizes.map((prize: any) => (
                    <div key={prize.rank} className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-100">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{prize.rank === 1 ? "🥇" : prize.rank === 2 ? "🥈" : "🥉"}</span>
                        <span className="font-semibold text-gray-800">{prize.label}</span>
                      </div>
                      <span className="font-bold text-yellow-700 text-lg">{formatXAF(prize.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {comp.eligibility && (
              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 mb-2">Eligibility</h2>
                <p className="text-sm text-gray-700">{comp.eligibility}</p>
              </div>
            )}

            {comp.tags?.length > 0 && (
              <div className="card p-5">
                <div className="flex flex-wrap gap-2">
                  {comp.tags.map((t: string) => (
                    <span key={t} className="text-sm text-primary-700 bg-primary-50 px-3 py-1 rounded-full">#{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews, FAQ & Discussion */}
            <EngagementTabs
              targetType="competition"
              targetId={comp.id}
              ownerId={comp.postedById}
            />

            <div className="lg:hidden">
              <LocationMap venueName={comp.organizer} venueCity={comp.city ?? ""} venueRegion={comp.region ?? ""} isOnline={comp.isOnline} zone={comp.zone} latitude={comp.latitude} longitude={comp.longitude} />
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="space-y-4">
            <div className="card p-5">
              {topPrize && (
                <div className="text-center mb-4 pb-4 border-b border-gray-100">
                  <p className="text-2xl font-bold text-yellow-600">{formatXAF(topPrize.amount)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Top prize</p>
                </div>
              )}

              {/* Employer owner: link to manage registrants */}
              {isOwner ? (
                <Link href={`/employer/competition-registrants/${comp.id}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors">
                  <Users size={16} /> Manage Registrants
                </Link>
              ) : session?.user?.role === "employer" ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                  <p className="text-sm font-semibold text-amber-700">🏢 Employer Account</p>
                  <p className="text-xs text-amber-600 mt-1">Employers cannot register for competitions. This is for job seekers only.</p>
                </div>
              ) : myReg ? (
                <RegStatusBanner registration={myReg} />
              ) : (
                <>
                  <button
                    onClick={() => { if (!session) router.push("/auth/login"); else setShowModal(true); }}
                    disabled={comp.status === "ended" || regDays <= 0}
                    className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2">
                    <Trophy size={16} />
                    {comp.status === "ended" ? "Competition Ended" : regDays <= 0 ? "Registration Closed" : "Register Now"}
                  </button>
                  {!session && (
                    <p className="text-xs text-center text-gray-400 mt-2">Sign in to register for this competition</p>
                  )}
                </>
              )}

              <div className="flex gap-2 mt-2">
                {/* Save button — full width for job seekers */}
                <SaveButton targetType="competition" targetId={comp.id} variant="full" className="flex-1" />
                {/* Share */}
                <button
                  onClick={() => navigator.share?.({ title: comp.title, url: window.location.href })}
                  className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 hover:bg-gray-50 rounded-xl transition-colors"
                  title="Share this competition"
                >
                  <Share2 size={14} />
                </button>
              </div>

              <div className="border-t border-gray-100 mt-4 pt-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1.5"><Calendar size={13} />Starts</span>
                  <span className="font-medium text-gray-700">{new Date(comp.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1.5"><Calendar size={13} />Ends</span>
                  <span className="font-medium text-gray-700">{new Date(comp.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1.5"><Clock size={13} />Reg. closes</span>
                  <span className={`font-medium ${regDays < 3 ? "text-red-600" : "text-gray-700"}`}>{regDays > 0 ? `${regDays}d left` : "Closed"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1.5"><Users size={13} />Team</span>
                  <span className="font-medium text-gray-700">{comp.minTeamSize}–{comp.maxTeamSize} members</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <LocationMap venueName={comp.organizer} venueCity={comp.city ?? ""} venueRegion={comp.region ?? ""} isOnline={comp.isOnline} zone={comp.zone} latitude={comp.latitude} longitude={comp.longitude} />
            </div>
          </div>
        </div>
      </div>
</div>
  );
}