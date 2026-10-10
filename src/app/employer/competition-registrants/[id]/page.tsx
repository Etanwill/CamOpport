// src/app/employer/competition-registrants/[id]/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, ArrowLeft, Mail, Clock, ChevronDown, ChevronUp, Trophy, MessageSquare } from "lucide-react";
import { getAvatarUrl } from "@/lib/avatar";

interface Registrant {
  registration: { id: string; status: string; teamName?: string; note?: string; registeredAt: string; updatedAt: string; };
  user:         { id: string; name: string; email: string; avatar?: string | null; city?: string; skills?: string[]; currentJobTitle?: string; experienceLevel?: string; };
}

const STATUS_OPTIONS = ["registered", "confirmed", "waitlisted", "disqualified", "winner"];
const STATUS_CONFIG: Record<string, { color: string; icon: string; border: string }> = {
  registered:   { icon: "✅", color: "bg-blue-50 text-blue-700",      border: "border-blue-200"    },
  confirmed:    { icon: "🎉", color: "bg-emerald-50 text-emerald-700", border: "border-emerald-200" },
  waitlisted:   { icon: "⏳", color: "bg-yellow-50 text-yellow-700",   border: "border-yellow-200"  },
  disqualified: { icon: "❌", color: "bg-red-50 text-red-700",          border: "border-red-200"     },
  winner:       { icon: "🏆", color: "bg-amber-50 text-amber-800",      border: "border-amber-300"   },
};

export default function CompetitionRegistrantsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const compId = params.id as string;

  const [registrants,   setRegistrants]   = useState<Registrant[]>([]);
  const [compTitle,     setCompTitle]      = useState("");
  const [loading,       setLoading]        = useState(true);
  const [expanded,      setExpanded]       = useState<string | null>(null);
  const [filterStatus,  setFilterStatus]   = useState("all");
  const [noteInputs,    setNoteInputs]     = useState<Record<string, string>>({});

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && session?.user?.role !== "employer") router.push("/my-activity");
  }, [status, session, router]);

  useEffect(() => {
    if (status !== "authenticated" || !compId) return;
    const load = async () => {
      try {
        const [rRes, cRes] = await Promise.all([
          fetch(`/api/competitions/${compId}/registrants`, { cache: "no-store" }),
          fetch(`/api/competitions/${compId}`, { cache: "no-store" }),
        ]);
        const [rData, cData] = await Promise.all([rRes.json(), cRes.json()]);
        setRegistrants(rData.registrants ?? []);
        setCompTitle(cData.competition?.title ?? "Competition");
      } catch { /* */ }
      setLoading(false);
    };
    load();
  }, [status, compId]);

  const updateStatus = async (registrationId: string, newStatus: string) => {
    const note = noteInputs[registrationId] || undefined;
    await fetch(`/api/registrations/${registrationId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status: newStatus, note }),
    });
    setRegistrants(prev => prev.map(r =>
      r.registration.id === registrationId
        ? { ...r, registration: { ...r.registration, status: newStatus, note: note ?? r.registration.note } }
        : r
    ));
  };

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = registrants.filter(r => r.registration.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  const filtered = filterStatus === "all" ? registrants : registrants.filter(r => r.registration.status === filterStatus);

  if (loading) return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
</div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 w-full flex-1">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/employer/dashboard" className="text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-display font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="text-yellow-500" size={20} /> Registrants
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {compTitle} · {registrants.length} registrant{registrants.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Pipeline */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {STATUS_OPTIONS.map(s => {
            const cfg = STATUS_CONFIG[s];
            return (
              <button key={s} onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
                className={`rounded-xl p-3 text-center border-2 transition-all ${
                  filterStatus === s ? `${cfg.color} ${cfg.border}` : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                }`}>
                <p className="text-lg">{cfg.icon}</p>
                <p className="text-lg font-bold text-gray-900">{counts[s]}</p>
                <p className="text-xs capitalize">{s}</p>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="card p-12 text-center text-gray-400">
            <Users size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">{filterStatus === "all" ? "No registrants yet" : `No ${filterStatus} registrants`}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(({ registration, user }) => {
              const cfg    = STATUS_CONFIG[registration.status] ?? STATUS_CONFIG.registered;
              const isOpen = expanded === registration.id;
              return (
                <div key={registration.id} className="card overflow-hidden">
                  <div className="p-4 flex items-start gap-4">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-100 flex-shrink-0" />
                    ) : (
                      <img src={getAvatarUrl(user.id ?? user.email ?? user.name)} alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-100 bg-primary-50 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {user.currentJobTitle || "Participant"}
                            {user.city ? ` · ${user.city}` : ""}
                            {registration.teamName ? ` · Team: ${registration.teamName}` : ""}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${cfg.color} ${cfg.border}`}>
                          {cfg.icon} {registration.status}
                        </span>
                      </div>
                      {user.skills && user.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {user.skills.slice(0, 5).map(skill => (
                            <span key={skill} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{skill}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button onClick={() => setExpanded(isOpen ? null : registration.id)}
                      className="text-gray-400 hover:text-gray-600 mt-1 flex-shrink-0 transition-colors">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>

                  {isOpen && (
                    <div className="border-t border-gray-50 bg-gray-50 p-4 space-y-4">
                      {/* Contact */}
                      <div className="flex flex-wrap gap-2">
                        <a href={`mailto:${user.email}`}
                          className="flex items-center gap-1.5 text-xs bg-white border border-gray-200 text-gray-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 px-3 py-1.5 rounded-lg transition-colors">
                          <Mail size={12} /> {user.email}
                        </a>
                      </div>

                      {/* Note from organizer (existing) */}
                      {registration.note && (
                        <div className="bg-white rounded-xl p-3 border border-gray-100">
                          <p className="text-xs font-semibold text-gray-500 mb-1">Your note to participant:</p>
                          <p className="text-sm text-gray-700 italic">"{registration.note}"</p>
                        </div>
                      )}

                      {/* Add/update note */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1">
                          <MessageSquare size={11} /> Note to participant (visible to them)
                        </label>
                        <textarea
                          value={noteInputs[registration.id] ?? registration.note ?? ""}
                          onChange={e => setNoteInputs(prev => ({ ...prev, [registration.id]: e.target.value }))}
                          rows={2} placeholder="e.g. Please check your email for next steps…"
                          className="input w-full resize-none text-sm"
                        />
                      </div>

                      {/* Status + registered date */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={11} /> Registered {new Date(registration.registeredAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Move to:</span>
                          <select
                            value={registration.status}
                            onChange={e => updateStatus(registration.id, e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-300">
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s}>
                                {STATUS_CONFIG[s].icon} {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
</div>
  );
}