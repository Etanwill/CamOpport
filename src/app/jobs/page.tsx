// src/app/jobs/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Briefcase, Filter, Clock, Users, Zap } from "lucide-react";
import { Select } from "@/components/ui";
import { formatSalary, getJobTypeColor } from "@/lib/utils";
import SaveButton from "@/components/ui/SaveButton";
import LikeButton from "@/components/ui/LikeButton";

const JOB_TYPES  = ["all","full-time","part-time","contract","one-day","gig","internship"];
const CATEGORIES = ["all","technology","marketing","finance","agriculture","transport","healthcare","education","creative","admin","manual","other"];
const REGIONS    = ["all","Centre","Littoral","West","Northwest","Southwest","North","Adamawa","East","South","Far North"];

function JobCard({ job }: { job: any }) {
  const isExpired   = job.deadline && new Date(job.deadline) < new Date();
  const planExpired = job.planExpiresAt && new Date(job.planExpiresAt) < new Date();
  const closed      = isExpired || planExpired || !job.isActive;

  return (
    <Link href={`/jobs/${job.id}`} className={`card p-5 block hover:-translate-y-0.5 transition-all duration-200 ${closed ? "opacity-60" : ""} ${job.isFeatured && !closed ? "ring-2 ring-purple-300 ring-offset-1" : ""}`}>
      {job.isFeatured && !closed && (
        <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full w-fit mb-2">
          🔥 Featured
        </div>
      )}
      {closed && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full w-fit mb-2">
          🔒 {isExpired ? "Applications Closed" : "Listing Expired"}
        </div>
      )}
      <div className="flex gap-4 items-start">
        {job.companyLogo ? (
          <img
            src={job.companyLogo}
            alt={job.company}
            className="w-14 h-14 rounded-xl object-contain border border-gray-100 bg-white p-1 flex-shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 text-primary-700 font-bold text-xl">
            {job.company?.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">{job.title}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{job.company}</p>
              <p className="text-sm font-bold text-primary-700 mt-1">
                {job.salaryMin?.toLocaleString()} – {job.salaryMax?.toLocaleString()} XAF/{job.salaryPeriod}
              </p>
              {job.isRemote && <span className="text-xs text-green-600 font-medium">Remote OK</span>}
            </div>
            {/* Like + Save — top right, stop propagation so they don't navigate */}
            <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.preventDefault()}>
              <LikeButton targetType="job" targetId={job.id} variant="icon" />
              <SaveButton targetType="job" targetId={job.id} variant="icon" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{job.description}</p>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className={`badge ${getJobTypeColor(job.type)} capitalize`}>{job.type?.replace("-"," ")}</span>
            <span className="badge bg-gray-100 text-gray-600 capitalize">{job.category}</span>
            <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11} />{job.city}</span>
            <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              <Zap size={10} className="text-amber-500" />{job.bitsCost ?? 5} bits to apply
            </span>
          </div>
          {job.tags?.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {job.tags.slice(0,3).map((t: string) => (
                <span key={t} className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md">#{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function JobsPage() {
  const [search,      setSearch]      = useState("");
  const [type,        setType]        = useState("all");
  const [category,    setCategory]    = useState("all");
  const [region,      setRegion]      = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [jobs,        setJobs]        = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);

  // Fetch from API whenever filters change
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (search)               params.set("search",   search);
      if (type     !== "all")   params.set("type",     type);
      if (category !== "all")   params.set("category", category);
      if (region   !== "all")   params.set("region",   region);
      try {
        const res  = await fetch(`/api/jobs?${params.toString()}`);
        const data = await res.json();
        setJobs(data.jobs ?? []);
      } catch { setJobs([]); }
      setLoading(false);
    };
    const debounce = setTimeout(fetchJobs, search ? 350 : 0);
    return () => clearTimeout(debounce);
  }, [search, type, category, region]);

  return (
    <div className="min-h-screen flex flex-col">

      <section className="hero-gradient py-10 px-4 text-white">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-display font-bold mb-1">Jobs & Gigs in Cameroon</h1>
          <p className="text-purple-200 text-sm mb-5">From daily gigs to full careers — find what fits you</p>
          <div className="bg-white rounded-2xl p-1 flex gap-2">
            <div className="flex-1 relative">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs, companies, skills..."
                className="w-full pl-9 pr-4 py-2.5 text-gray-900 text-sm outline-none rounded-xl" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors">
              <Filter size={15} /> Filters
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8 w-full flex-1">
        {showFilters && (
          <div className="card p-4 mb-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select label="Job Type" value={type} onChange={(e) => setType(e.target.value)}
              options={JOB_TYPES.map((t) => ({ value: t, label: t === "all" ? "All Types" : t.replace("-"," ").replace(/\b\w/g,(c)=>c.toUpperCase()) }))} />
            <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}
              options={CATEGORIES.map((c) => ({ value: c, label: c === "all" ? "All Categories" : c.replace(/\b\w/g,(ch)=>ch.toUpperCase()) }))} />
            <Select label="Region" value={region} onChange={(e) => setRegion(e.target.value)}
              options={REGIONS.map((r) => ({ value: r, label: r === "all" ? "All Regions" : r }))} />
          </div>
        )}

        <div className="flex gap-2 flex-wrap mb-5">
          {JOB_TYPES.map((t) => (
            <button key={t} onClick={() => setType(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                type === t ? "bg-primary-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-primary-300"
              }`}>
              {t === "all" ? "All" : t.replace("-"," ").replace(/\b\w/g,(c)=>c.toUpperCase())}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            <strong className="text-gray-900">{jobs.length}</strong> opportunities found
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={12} /> Live data
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-3">
            {jobs.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <Briefcase size={48} className="text-gray-200 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-600">No jobs found</h3>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
</div>
  );
}