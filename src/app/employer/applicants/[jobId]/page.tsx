// src/app/employer/applicants/[jobId]/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users, ArrowLeft, Mail, Linkedin, Globe,
  Phone, Clock, CheckCircle, Zap, FileText,
  ChevronDown, ChevronUp, Calendar
} from "lucide-react";
import MessageButton from "@/components/messaging/MessageButton";
import { getAvatarUrl } from "@/lib/avatar";

interface Applicant {
  application: {
    id: string; status: string; appliedAt: string;
    coverLetter?: string; resumeUrl?: string; linkedinUrl?: string; portfolioUrl?: string;
    phone?: string; availability?: string; note?: string;
    isCasual: boolean;
  };
  applicant: {
    id: string; name: string; email: string; avatar?: string | null; city?: string; region?: string;
    currentJobTitle?: string; experienceLevel?: string; skills?: string[];
    linkedinUrl?: string; portfolioUrl?: string; phone?: string;
  };
}

const STATUS_OPTIONS = ["pending", "reviewed", "shortlisted", "rejected", "hired"];
const STATUS_COLORS: Record<string, string> = {
  pending:     "bg-yellow-100 text-yellow-700 border-yellow-200",
  reviewed:    "bg-blue-100 text-blue-700 border-blue-200",
  shortlisted: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected:    "bg-red-100 text-red-600 border-red-200",
  hired:       "bg-purple-100 text-purple-700 border-purple-200",
};
const STATUS_ICONS: Record<string, string> = {
  pending: "🕐", reviewed: "👀", shortlisted: "⭐", rejected: "✕", hired: "🎉",
};

export default function ApplicantsPage() {
  const { data: session, status } = useSession();
  const router   = useRouter();
  const params   = useParams();
  const jobId    = params.jobId as string;

  const [applicants,  setApplicants]  = useState<Applicant[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [jobTitle,    setJobTitle]    = useState("");
  const [jobType,     setJobType]     = useState("");
  const [expanded,    setExpanded]    = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && session?.user?.role !== "employer") router.push("/my-activity");
  }, [status, session, router]);

  useEffect(() => {
    if (status !== "authenticated" || !jobId) return;
    const load = async () => {
      try {
        const [aRes, jRes] = await Promise.all([
          fetch(`/api/employer/applicants/${jobId}`),
          fetch(`/api/jobs/${jobId}`),
        ]);
        const [aData, jData] = await Promise.all([aRes.json(), jRes.json()]);
        setApplicants(aData.applicants ?? []);
        setJobTitle(jData.job?.title ?? "Job");
        setJobType(jData.job?.type ?? "");
      } catch { /* */ }
      setLoading(false);
    };
    load();
  }, [status, jobId]);

  const updateStatus = async (applicationId: string, newStatus: string) => {
    await fetch(`/api/applications/${applicationId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status: newStatus }),
    });
    setApplicants(prev => prev.map(a =>
      a.application.id === applicationId
        ? { ...a, application: { ...a.application, status: newStatus } }
        : a
    ));
  };

  const isCasualJob = ["gig", "one-day"].includes(jobType);

  const filtered = filterStatus === "all"
    ? applicants
    : applicants.filter(a => a.application.status === filterStatus);

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = applicants.filter(a => a.application.status === s).length;
    return acc;
  }, {} as Record<string, number>);

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
              <Users className="text-blue-600" size={20} />
              Applicants
              {isCasualJob && (
                <span className="flex items-center gap-1 text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                  <Zap size={10} /> Casual Job
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {jobTitle} · {applicants.length} applicant{applicants.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Status pipeline */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {STATUS_OPTIONS.map(s => (
            <button key={s} onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
              className={`rounded-xl p-3 text-center border transition-all ${
                filterStatus === s
                  ? STATUS_COLORS[s]
                  : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
              }`}>
              <p className="text-lg">{STATUS_ICONS[s]}</p>
              <p className="text-lg font-bold text-gray-900">{counts[s]}</p>
              <p className="text-xs capitalize">{s}</p>
            </button>
          ))}
        </div>

        {/* Applicant cards */}
        {filtered.length === 0 ? (
          <div className="card p-12 text-center text-gray-400">
            <Users size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">
              {filterStatus === "all" ? "No applicants yet" : `No ${filterStatus} applicants`}
            </p>
            <p className="text-sm mt-1">
              {filterStatus === "all" ? "Share the job posting to get more visibility" : "Try a different filter"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(({ application, applicant }) => {
              const isOpen = expanded === application.id;
              return (
                <div key={application.id} className="card overflow-hidden">
                  {/* Card header */}
                  <div className="p-4 flex items-start gap-4">
                    {applicant.avatar ? (
                      <img src={applicant.avatar} alt={applicant.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-100 flex-shrink-0" />
                    ) : (
                      <img src={getAvatarUrl(applicant.id ?? applicant.email ?? applicant.name)} alt={applicant.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-100 bg-primary-50 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-gray-900">{applicant.name}</p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {applicant.currentJobTitle || (isCasualJob ? "Casual Worker" : "Job Seeker")}
                            {applicant.city ? ` · ${applicant.city}` : ""}
                            {applicant.experienceLevel ? ` · ${applicant.experienceLevel}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Casual badge */}
                          {application.isCasual && (
                            <span className="flex items-center gap-1 text-xs bg-orange-50 text-orange-600 border border-orange-200 px-2 py-0.5 rounded-full">
                              <Zap size={9} />Quick
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${STATUS_COLORS[application.status]}`}>
                            {STATUS_ICONS[application.status]} {application.status}
                          </span>
                        </div>
                      </div>

                      {/* Skills */}
                      {applicant.skills && applicant.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {applicant.skills.slice(0, 5).map(skill => (
                            <span key={skill} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{skill}</span>
                          ))}
                        </div>
                      )}

                      {/* Casual: show phone + availability inline */}
                      {application.isCasual && (
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-600">
                          {(application.phone || applicant.phone) && (
                            <span className="flex items-center gap-1">
                              <Phone size={11} className="text-emerald-500" />
                              <a href={`tel:${application.phone || applicant.phone}`}
                                className="font-medium text-emerald-600 hover:underline">
                                {application.phone || applicant.phone}
                              </a>
                            </span>
                          )}
                          {application.availability && (
                            <span className="flex items-center gap-1">
                              <Calendar size={11} className="text-blue-500" />
                              {application.availability}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <button onClick={() => setExpanded(isOpen ? null : application.id)}
                      className="text-gray-400 hover:text-gray-600 mt-1 flex-shrink-0 transition-colors">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>

                  {/* Expanded details */}
                  {isOpen && (
                    <div className="border-t border-gray-50 bg-gray-50 p-4 space-y-4">

                      {/* CASUAL: note */}
                      {application.isCasual && application.note && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Note from applicant</p>
                          <div className="bg-white rounded-xl p-3 text-sm text-gray-700 border border-gray-100">
                            {application.note}
                          </div>
                        </div>
                      )}

                      {/* FORMAL: cover letter */}
                      {!application.isCasual && application.coverLetter && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                            <FileText size={11} /> Cover Letter
                          </p>
                          <div className="bg-white rounded-xl p-4 text-sm text-gray-700 leading-relaxed border border-gray-100 whitespace-pre-line max-h-48 overflow-y-auto">
                            {application.coverLetter}
                          </div>
                        </div>
                      )}

                      {/* Links row */}
                      <div className="flex flex-wrap gap-2">
                        <MessageButton jobId={jobId} jobSeekerId={applicant.id} variant="compact" label="Message" />
                        <a href={`mailto:${applicant.email}`}
                          className="flex items-center gap-1.5 text-xs bg-white border border-gray-200 text-gray-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 px-3 py-1.5 rounded-lg transition-colors">
                          <Mail size={12} /> {applicant.email}
                        </a>
                        {(application.linkedinUrl || applicant.linkedinUrl) && (
                          <a href={application.linkedinUrl || applicant.linkedinUrl}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                            <Linkedin size={12} /> LinkedIn
                          </a>
                        )}
                        {(application.portfolioUrl || applicant.portfolioUrl) && (
                          <a href={application.portfolioUrl || applicant.portfolioUrl}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                            <Globe size={12} /> Portfolio
                          </a>
                        )}
                        {application.resumeUrl && (
                          <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors">
                            <FileText size={12} /> Resume / CV
                          </a>
                        )}
                      </div>

                      {/* Applied at + status changer */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={11} />
                          Applied {new Date(application.appliedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Move to:</span>
                          <select
                            value={application.status}
                            onChange={e => updateStatus(application.id, e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-300">
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s}>
                                {STATUS_ICONS[s]} {s.charAt(0).toUpperCase() + s.slice(1)}
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