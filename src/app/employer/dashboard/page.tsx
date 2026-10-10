// src/app/employer/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase, Trophy, Zap, PlusCircle, Users,
  MapPin, Clock, Loader2, ChevronRight, ClipboardList, Pencil,
} from "lucide-react";

interface EmployerJob {
  job: {
    id: string; title: string; company: string; companyLogo: string | null;
    city: string; type: string;
    isActive: boolean; deadline: string; createdAt: string;
  };
  applicantCount: number;
}

interface EmployerCompetition {
  competition: {
    id: string; title: string; organizer: string; organizerLogo: string | null;
    type: string; status: string;
    startDate: string; createdAt: string;
  };
  registrantCount: number;
}

export default function MyPostingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [jobs,          setJobs]          = useState<EmployerJob[]>([]);
  const [competitions,  setCompetitions]  = useState<EmployerCompetition[]>([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && session?.user?.role !== "employer") router.push("/my-activity");
  }, [status, session, router]);

  useEffect(() => {
    if (status !== "authenticated" || session?.user?.role !== "employer") return;
    (async () => {
      try {
        const [jobsRes, compsRes] = await Promise.all([
          fetch("/api/employer/jobs"),
          fetch("/api/employer/competitions"),
        ]);
        if (jobsRes.ok)  setJobs((await jobsRes.json()).jobs ?? []);
        if (compsRes.ok) setCompetitions((await compsRes.json()).competitions ?? []);
      } catch {}
      setLoading(false);
    })();
  }, [status, session?.user?.role]);

  if (status === "loading" || (status === "authenticated" && loading)) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 size={28} className="animate-spin text-primary-500" />
    </div>
  );

  if (!session) return null;

  const totalApplicants  = jobs.reduce((sum, j) => sum + j.applicantCount, 0);
  const totalRegistrants = competitions.reduce((sum, c) => sum + c.registrantCount, 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">My Postings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your job and competition listings, and see who applied.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/employer/post-job"
              className="flex items-center gap-1.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition-colors">
              <PlusCircle size={15} /> Post a Job
            </Link>
            <Link href="/employer/post-competition"
              className="flex items-center gap-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors">
              <PlusCircle size={15} /> Post Competition
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Job Postings",        value: jobs.length,         icon: Briefcase, color: "text-emerald-600 bg-emerald-50" },
            { label: "Total Applicants",    value: totalApplicants,     icon: Users,     color: "text-purple-600 bg-purple-50"   },
            { label: "Competitions",        value: competitions.length, icon: Trophy,    color: "text-blue-600 bg-blue-50"       },
            { label: "Total Registrants",   value: totalRegistrants,    icon: Users,     color: "text-yellow-600 bg-yellow-50"   },
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

        {/* Job postings */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Briefcase size={16} /> Your Job Postings ({jobs.length})
            </h2>
          </div>
          {jobs.length === 0 ? (
            <div className="card p-10 text-center text-gray-400">
              <Briefcase size={36} className="mx-auto mb-3 opacity-40" />
              <p className="font-medium">You haven't posted any jobs yet</p>
              <Link href="/employer/post-job" className="mt-3 inline-block text-sm text-primary-600 font-medium hover:underline">
                Post your first job →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map(({ job, applicantCount }) => (
                <div key={job.id} className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow group">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.company}
                      className="w-11 h-11 rounded-xl object-contain border border-gray-100 bg-white p-1 flex-shrink-0" />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Briefcase size={20} />
                    </div>
                  )}
                  <Link href={`/employer/applicants/${job.id}`} className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors truncate">{job.title}</p>
                      {!job.isActive && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 flex-shrink-0">Closed</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <MapPin size={10} />{job.city} · {job.type.replace("-", " ")}
                      <span className="mx-1">·</span>
                      <Clock size={10} />Deadline {new Date(job.deadline).toLocaleDateString()}
                    </p>
                  </Link>
                  <Link href={`/employer/edit-job/${job.id}`}
                    className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-primary-700 px-2.5 py-1.5 rounded-lg hover:bg-primary-50 transition-colors flex-shrink-0">
                    <Pencil size={13} /> Edit
                  </Link>
                  <Link href={`/employer/applicants/${job.id}`} className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{applicantCount}</p>
                      <p className="text-xs text-gray-400">{applicantCount === 1 ? "applicant" : "applicants"}</p>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-primary-500 transition-colors" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Competitions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Trophy size={16} /> Your Competitions ({competitions.length})
            </h2>
          </div>
          {competitions.length === 0 ? (
            <div className="card p-10 text-center text-gray-400">
              <Trophy size={36} className="mx-auto mb-3 opacity-40" />
              <p className="font-medium">You haven't posted any competitions yet</p>
              <Link href="/employer/post-competition" className="mt-3 inline-block text-sm text-primary-600 font-medium hover:underline">
                Post your first competition →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {competitions.map(({ competition, registrantCount }) => (
                <div key={competition.id} className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow group">
                  {competition.organizerLogo ? (
                    <img src={competition.organizerLogo} alt={competition.organizer}
                      className="w-11 h-11 rounded-xl object-contain border border-gray-100 bg-white p-1 flex-shrink-0" />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center flex-shrink-0">
                      <Trophy size={20} />
                    </div>
                  )}
                  <Link href={`/employer/competition-registrants/${competition.id}`} className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors truncate">{competition.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      {competition.type} · <span className="capitalize">{competition.status}</span>
                      <span className="mx-1">·</span>
                      <Clock size={10} />Starts {new Date(competition.startDate).toLocaleDateString()}
                    </p>
                  </Link>
                  <Link href={`/employer/edit-competition/${competition.id}`}
                    className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-primary-700 px-2.5 py-1.5 rounded-lg hover:bg-primary-50 transition-colors flex-shrink-0">
                    <Pencil size={13} /> Edit
                  </Link>
                  <Link href={`/employer/competition-registrants/${competition.id}`} className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{registrantCount}</p>
                      <p className="text-xs text-gray-400">{registrantCount === 1 ? "registrant" : "registrants"}</p>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-primary-500 transition-colors" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quiz shortcut */}
        <div className="mt-8 card p-5 bg-purple-50 border border-purple-100 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-purple-600">
              <Zap size={18} />
            </div>
            <div>
              <p className="font-semibold text-purple-900 text-sm">Company Quizzes</p>
              <p className="text-xs text-purple-600">Show job seekers your technical standards.</p>
            </div>
          </div>
          <Link href="/employer/create-quiz"
            className="text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5">
            <ClipboardList size={14} /> Create a Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}