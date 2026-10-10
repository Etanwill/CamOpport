// src/app/page.tsx
// LOCATION: src/app/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Trophy, Briefcase, Award, Users, ArrowRight,
  MapPin, Star, CheckCircle, Brain, Clock, ChevronRight, Search,
  ChevronLeft,
} from "lucide-react";
import { getStatusColor, daysUntil } from "@/lib/utils";
import Footer from "@/components/layout/Footer";

// ── Category cards ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    label: "Jobs & Gigs",
    href:  "/jobs",
    sub:   "Full-time, part-time & gigs",
    img:   "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80",
    alt:   "Professional office",
  },
  {
    label: "Competitions",
    href:  "/competitions",
    sub:   "Win prizes & recognition",
    img:   "https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=400&q=80",
    alt:   "Team competition",
  },
  {
    label: "Quizzes",
    href:  "/quiz",
    sub:   "Test & prove your skills",
    img:   "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80",
    alt:   "Student studying",
  },
  {
    label: "Mock Interview",
    href:  "/interview",
    sub:   "AI-powered · Free",
    img:   "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    alt:   "Professional interview",
  },
  {
    label: "Internships",
    href:  "/jobs?type=internship",
    sub:   "Kickstart your career",
    img:   "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80",
    alt:   "Young professionals",
  },
  {
    label: "Finance Roles",
    href:  "/jobs?category=finance",
    sub:   "Banking & accounting",
    img:   "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
    alt:   "Finance professional",
  },
  {
    label: "Tech Roles",
    href:  "/jobs?category=technology",
    sub:   "Engineering & development",
    img:   "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80",
    alt:   "Developer coding",
  },
  {
    label: "Saved",
    href:  "/saved",
    sub:   "Your bookmarks",
    img:   "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=80",
    alt:   "Planning and organisation",
  },
];

// ── Skeleton placeholder card ──────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-72 bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-3/4 mb-3" />
      <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
      <div className="h-3 bg-gray-100 rounded w-full mb-2" />
      <div className="h-3 bg-gray-100 rounded w-2/3" />
    </div>
  );
}

// ── Step-scroll hook — scrolls one card-width at a time with a pause ──────────
function useStepScroll(
  ref: React.RefObject<HTMLDivElement | null>,
  items: any[],
  cardWidth = 288 + 16 // w-72 = 288px + gap-4 = 16px
) {
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);
  const indexRef  = useRef(0);

  const scrollToIndex = useCallback(
    (idx: number) => {
      const el = ref.current;
      if (!el) return;
      const maxIndex = Math.max(0, items.length - 1);
      const clamped  = Math.max(0, Math.min(idx, maxIndex));
      indexRef.current = clamped;
      el.scrollTo({ left: clamped * cardWidth, behavior: "smooth" });
    },
    [ref, items.length, cardWidth]
  );

  const scheduleNext = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (pausedRef.current || !ref.current) return;
      const el = ref.current;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      const nextIndex = atEnd ? 0 : indexRef.current + 1;
      scrollToIndex(nextIndex);
      scheduleNext();
    }, 2800); // pause between steps
  }, [ref, scrollToIndex]);

  useEffect(() => {
    const el = ref.current;
    if (!el || items.length === 0) return;

    const pause  = () => { pausedRef.current = true;  if (timerRef.current) clearTimeout(timerRef.current); };
    const resume = () => { pausedRef.current = false; scheduleNext(); };

    el.addEventListener("mouseenter",  pause);
    el.addEventListener("mouseleave",  resume);
    el.addEventListener("touchstart",  pause,  { passive: true });
    el.addEventListener("touchend",    resume, { passive: true });

    // Kick off after 1.5 s
    const startDelay = setTimeout(() => scheduleNext(), 1500);

    return () => {
      clearTimeout(startDelay);
      if (timerRef.current) clearTimeout(timerRef.current);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend",   resume);
    };
  }, [items, ref, scheduleNext]);

  return { scrollToIndex };
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { data: session }  = useSession();
  const router = useRouter();
  const [jobs,         setJobs]         = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [forYou,       setForYou]       = useState<any[]>([]);
  const [loadingJobs,  setLoadingJobs]  = useState(true);
  const [loadingComps, setLoadingComps] = useState(true);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [featuredIdx,  setFeaturedIdx]  = useState(0);
  const [companyCount, setCompanyCount] = useState<number | null>(null);

  const featuredRef = useRef<HTMLDivElement>(null);

  // Fetch data
  useEffect(() => {
    fetch("/api/jobs?limit=20")
      .then(r => r.json())
      .then(d => setJobs(d.jobs ?? []))
      .catch(() => {})
      .finally(() => setLoadingJobs(false));

    fetch("/api/competitions")
      .then(r => r.json())
      .then(d => setCompetitions(d.competitions ?? []))
    fetch("/api/stats/counts")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.companyCount != null) setCompanyCount(d.companyCount); })
      .catch(() => {})
      .catch(() => {})
      .finally(() => setLoadingComps(false));
  }, []);

  // Build personalised "For You" feed
  useEffect(() => {
    if (loadingJobs || loadingComps) return;
    const userCats   = (session?.user as any)?.preferredCategories as string[] | undefined;
    const userRegion = (session?.user as any)?.region as string | undefined;

    const scoredJobs = jobs.map(j => ({
      ...j,
      _type:  "job" as const,
      _score: (j.isFeatured ? 3 : 0)
            + (userCats?.includes(j.category) ? 2 : 0)
            + (userRegion && j.region === userRegion ? 1 : 0),
    })).sort((a, b) => b._score - a._score).slice(0, 8);

    const scoredComps = competitions
      .filter(c => c.status === "active" || c.status === "upcoming")
      .map(c => ({ ...c, _type: "competition" as const, _score: 1 }))
      .slice(0, 4);

    const mixed: any[] = [];
    let ji = 0, ci = 0;
    while (ji < scoredJobs.length || ci < scoredComps.length) {
      if (ji < scoredJobs.length)  mixed.push(scoredJobs[ji++]);
      if (ji < scoredJobs.length)  mixed.push(scoredJobs[ji++]);
      if (ci < scoredComps.length) mixed.push(scoredComps[ci++]);
    }
    setForYou(mixed);
  }, [loadingJobs, loadingComps, jobs, competitions, session]);

  // Step-scroll the "For You" section one card at a time
  const { scrollToIndex } = useStepScroll(featuredRef, forYou);

  // Keep dot indicator in sync with scroll position
  useEffect(() => {
    const el = featuredRef.current;
    if (!el) return;
    const cardWidth = 288 + 16;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / cardWidth);
      setFeaturedIdx(idx);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const handleFeaturedPrev = () => scrollToIndex(featuredIdx - 1);
  const handleFeaturedNext = () => scrollToIndex(featuredIdx + 1);

  return (
    <div className="min-h-screen bg-[#f6f7fb] flex flex-col">

      {/* ── Top search bar ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <form
            onSubmit={e => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(`/jobs?q=${encodeURIComponent(searchQuery.trim())}`);
                setSearchQuery("");
              }
            }}
            className="relative"
          >
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search jobs, competitions, companies…"
              className="w-full pl-11 pr-24 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 placeholder-gray-400 transition"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white text-sm font-semibold px-4 py-1.5 rounded-xl hover:bg-primary-700 transition"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* ── Hero banner ── */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=80"
          alt="Professionals collaborating in Cameroon"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-800/75 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-3 py-1 text-xs text-white w-fit mb-3">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            100% Made for Cameroon 🇨🇲
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2 leading-tight">
            Unlock Your Career<br />
            <span className="text-yellow-300">in Cameroon</span>
          </h1>
          <p className="text-purple-100 text-sm md:text-base max-w-md mb-5">
            Jobs, competitions, AI mock interviews and more — everything to land your next opportunity.
          </p>
          <div className="flex gap-3">
            <Link href="/jobs"
              className="bg-white text-primary-700 font-bold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition shadow-lg text-sm">
              Browse Jobs
            </Link>
            <Link href="/interview"
              className="bg-yellow-400 text-gray-900 font-bold px-5 py-2.5 rounded-xl hover:bg-yellow-300 transition shadow-lg text-sm flex items-center gap-1.5">
              <Brain size={15} /> Try Mock Interview
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
          {[
            { value: "50K+",   label: "Job Seekers",   sub: "Registered & growing"      },
            { value: "1,200+", label: "Opportunities", sub: "Jobs, gigs & competitions"  },
            { value: "300+",   label: "Companies",     sub: "Hiring on CamOpport"        },
            { value: "5M XAF", label: "Prize Pool",    sub: "Across active competitions" },
          ].map(({ value, label, sub }) => (
            <div key={label} className="flex flex-col justify-center px-8 py-6">
              <p className="text-3xl font-display font-extrabold text-gray-900 leading-none tracking-tight">{value}</p>
              <p className="text-sm font-semibold text-gray-700 mt-2">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Page sections ── */}
      <div className="px-4 md:px-6 py-6 space-y-10">

        {/* ── Explore Opportunities ── */}
        <section>
          <h2 className="font-display font-bold text-lg text-gray-900 mb-4">Explore Opportunities</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
            {CATEGORIES.map(({ label, href, sub, img, alt }) => (
              <Link
                key={label}
                href={href}
                className="flex-shrink-0 w-44 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden group"
                style={{ scrollSnapAlign: "start" }}
              >
                <div className="relative h-28 overflow-hidden">
                  <Image
                    src={img}
                    alt={alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-3">
                  <p className="font-semibold text-gray-800 text-sm">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── For You — step-scroll feed with prev/next controls ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-lg text-gray-900">
                {session?.user ? `For You, ${session.user.name?.split(" ")[0]}` : "Featured"}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {session?.user
                  ? "Personalised picks based on your profile"
                  : "Top jobs and competitions handpicked for you"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Prev / Next arrow buttons */}
              {forYou.length > 0 && (
                <>
                  <button
                    onClick={handleFeaturedPrev}
                    disabled={featuredIdx === 0}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 disabled:opacity-30 transition"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    onClick={handleFeaturedNext}
                    disabled={featuredIdx >= forYou.length - 1}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 disabled:opacity-30 transition"
                    aria-label="Next"
                  >
                    <ChevronRight size={15} />
                  </button>
                </>
              )}
              <Link href="/jobs" className="flex items-center gap-1 text-primary-600 font-semibold text-sm hover:gap-2 transition-all ml-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Scroll container — snap per card */}
          <div
            ref={featuredRef}
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide select-none"
            style={{ scrollSnapType: "x mandatory", scrollBehavior: "smooth" }}
          >
            {(loadingJobs || loadingComps)
              ? [1,2,3,4].map(i => <SkeletonCard key={i} />)
              : forYou.length === 0
              ? (
                <div className="w-full text-center py-10 text-gray-400 text-sm">
                  No opportunities yet — <Link href="/api/seed" className="text-primary-600 underline">seed the database</Link>
                </div>
              )
              : forYou.map((item) => {
                  if (item._type === "competition") {
                    const days     = daysUntil(item.endDate);
                    const topPrize = item.prizes?.[0];
                    return (
                      <Link
                        key={`comp-${item.id}`}
                        href={`/competitions/${item.id}`}
                        className="flex-shrink-0 w-72 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden block"
                        style={{ scrollSnapAlign: "start" }}
                      >
                        <div className="h-1.5 bg-gradient-to-r from-purple-500 to-primary-500" />
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`badge ${getStatusColor(item.status)} capitalize text-[10px]`}>{item.status}</span>
                            <span className="badge bg-purple-100 text-purple-700 text-[10px]">Competition</span>
                          </div>
                          <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{item.title}</h3>
                          <div className="flex items-center gap-2 mb-3">
                            {item.organizerLogo ? (
                              <img
                                src={item.organizerLogo}
                                alt={item.organizer}
                                className="w-8 h-8 rounded-lg object-contain border border-gray-100 bg-white flex-shrink-0 p-0.5"
                                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center flex-shrink-0">
                                <Trophy size={14} />
                              </div>
                            )}
                            <p className="text-xs text-gray-500 truncate">{item.organizer}</p>
                          </div>
                          <div className="flex items-center justify-between pt-2.5 border-t border-gray-50">
                            {topPrize && (
                              <div className="flex items-center gap-1 text-sm font-bold text-amber-600">
                                <Trophy size={12} />
                                {(topPrize.amount / 1000).toFixed(0)}K XAF
                              </div>
                            )}
                            {days !== null && days >= 0 && (
                              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                <Clock size={9} /> {days}d left
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  }
                  // Job card
                  return (
                    <Link
                      key={`job-${item.id}`}
                      href={`/jobs/${item.id}`}
                      className="flex-shrink-0 w-72 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5 block"
                      style={{ scrollSnapAlign: "start" }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        {item.companyLogo ? (
                          <img
                            src={item.companyLogo}
                            alt={item.company}
                            className="w-14 h-14 rounded-xl object-contain border border-gray-100 bg-white flex-shrink-0 p-1"
                            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-primary-50 text-primary-700 font-bold text-lg flex items-center justify-center flex-shrink-0">
                            {item.company?.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.company}</p>
                        </div>
                        {item.isFeatured && (
                          <span className="ml-auto text-[10px] text-amber-500">⭐</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="badge bg-primary-100 text-primary-700 capitalize text-[10px]">{item.type?.replace("-"," ")}</span>
                        {item.isRemote && <span className="badge bg-green-100 text-green-700 text-[10px]">Remote</span>}
                        <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                          <MapPin size={9} />{item.city}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <p className="text-sm font-bold text-primary-700">
                          {(item.salaryMin / 1000).toFixed(0)}K–{(item.salaryMax / 1000).toFixed(0)}K XAF
                        </p>
                        <span className="text-[10px] text-gray-400">/{item.salaryPeriod}</span>
                      </div>
                    </Link>
                  );
                })
            }
          </div>

          {/* Dot indicators */}
          {forYou.length > 0 && (
            <div className="flex justify-center gap-1.5 mt-3">
              {forYou.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  className={`rounded-full transition-all ${
                    i === featuredIdx
                      ? "w-4 h-1.5 bg-primary-600"
                      : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to card ${i + 1}`}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Latest Jobs ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-lg text-gray-900">Latest Jobs</h2>
              <p className="text-xs text-gray-400 mt-0.5">Scroll to explore all openings</p>
            </div>
            <Link href="/jobs" className="flex items-center gap-1 text-primary-600 font-semibold text-sm hover:gap-2 transition-all">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
            {loadingJobs
              ? [1,2,3,4,5].map(i => <SkeletonCard key={i} />)
              : jobs.map(job => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="flex-shrink-0 w-80 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5 block"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-12 h-12 rounded-lg object-contain border border-gray-100 bg-white flex-shrink-0 p-1"
                          onError={e => { (e.target as HTMLImageElement).style.display="none"; }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-primary-50 text-primary-700 font-bold text-base flex items-center justify-center flex-shrink-0">
                          {job.company?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900 text-sm leading-tight">{job.title}</p>
                        <p className="text-xs text-gray-400">{job.company}</p>
                      </div>
                    </div>
                    {job.isFeatured && <span className="badge bg-yellow-100 text-yellow-700 text-[10px] flex-shrink-0">⭐</span>}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="badge bg-gray-100 text-gray-600 capitalize text-[10px]">{job.type?.replace("-"," ")}</span>
                    <span className="badge bg-gray-100 text-gray-600 capitalize text-[10px]">{job.category}</span>
                    {job.isRemote && <span className="badge bg-green-100 text-green-700 text-[10px]">Remote</span>}
                  </div>
                  <div className="flex items-center justify-between pt-2.5 border-t border-gray-50">
                    <div>
                      <p className="text-sm font-bold text-primary-700">
                        {(job.salaryMin / 1000).toFixed(0)}K–{(job.salaryMax / 1000).toFixed(0)}K XAF
                      </p>
                      <p className="text-[10px] text-gray-400 flex items-center gap-0.5 mt-0.5">
                        <MapPin size={9} />{job.city}
                      </p>
                    </div>
                    <ChevronRight size={15} className="text-gray-300" />
                  </div>
                </Link>
              ))
            }
          </div>
        </section>

        {/* ── Competitions ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-lg text-gray-900">Competitions</h2>
              <p className="text-xs text-gray-400 mt-0.5">Win prizes, earn XP, build your name</p>
            </div>
            <Link href="/competitions" className="flex items-center gap-1 text-primary-600 font-semibold text-sm hover:gap-2 transition-all">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
            {loadingComps
              ? [1,2,3].map(i => <SkeletonCard key={i} />)
              : competitions.length === 0
              ? <p className="text-gray-400 text-sm py-4">No competitions yet.</p>
              : competitions.map(comp => {
                  const days      = daysUntil(comp.endDate);
                  const topPrize  = comp.prizes?.[0];
                  return (
                    <Link
                      key={comp.id}
                      href={`/competitions/${comp.id}`}
                      className="flex-shrink-0 w-72 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden block"
                      style={{ scrollSnapAlign: "start" }}
                    >
                      <div className="h-1.5 bg-gradient-to-r from-purple-500 to-primary-500" />
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`badge ${getStatusColor(comp.status)} capitalize text-[10px]`}>{comp.status}</span>
                          <span className="text-[10px] text-gray-400 capitalize">{comp.type?.replace("-"," ")}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{comp.title}</h3>
                        <div className="flex items-center gap-2 mb-4">
                          {comp.organizerLogo ? (
                            <img
                              src={comp.organizerLogo}
                              alt={comp.organizer}
                              className="w-8 h-8 rounded-lg object-contain border border-gray-100 bg-white flex-shrink-0 p-0.5"
                              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center flex-shrink-0">
                              <Trophy size={14} />
                            </div>
                          )}
                          <p className="text-xs text-gray-500 truncate">{comp.organizer}</p>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                          {topPrize && (
                            <div className="flex items-center gap-1.5 text-sm font-bold text-amber-600">
                              <Trophy size={13} />
                              {(topPrize.amount / 1000).toFixed(0)}K XAF
                            </div>
                          )}
                          {days !== null && days >= 0 && (
                            <span className="flex items-center gap-1 text-[10px] text-gray-400">
                              <Clock size={10} /> {days}d left
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })
            }
          </div>
        </section>

        {/* ── AI Interview promo ── */}
        <section>
          <div className="relative rounded-3xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=80"
              alt="Professional interview"
              width={1200}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-700/70 flex items-center">
              <div className="px-8 flex items-center justify-between w-full gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Brain size={18} className="text-yellow-300" />
                    <span className="text-yellow-300 text-xs font-bold uppercase tracking-wide">Free AI Tool</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-1">Mock Interview</h3>
                  <p className="text-purple-200 text-sm">Practice with a real-feel AI interviewer. Get scored and improve.</p>
                </div>
                <Link
                  href="/interview"
                  className="flex-shrink-0 bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition shadow-xl text-sm flex items-center gap-2"
                >
                  Start Now <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="pb-6">
          <h2 className="font-display font-bold text-lg text-gray-900 mb-4">What Cameroonians Say</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { name: "Jean-Pierre M.", city: "Yaoundé", text: "Found a dev job at MTN through CamOpport in 3 weeks. The platform really understands the Cameroonian market!", avatar: "JP", role: "Software Engineer"  },
              { name: "Aisha F.",       city: "Douala",  text: "Won the Silicon Mountain coding contest and landed my first full-time role. The competitions are incredible.",   avatar: "AF", role: "Full Stack Developer"},
              { name: "Carine N.",      city: "Buea",    text: "The AI mock interview helped me prepare for my Orange interview. I got the job! This is a game-changer.",        avatar: "CN", role: "Product Manager"    },
              { name: "Paul A.",        city: "Yaoundé", text: "As a fresh graduate I had zero experience. CamOpport's quiz leaderboard got me noticed by Afriland Bank.",       avatar: "PA", role: "Credit Analyst"      },
            ].map(({ name, city, text, avatar, role }) => (
              <div key={name} className="flex-shrink-0 w-72 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex gap-0.5 text-yellow-400 mb-3">
                  {Array(5).fill(0).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">"{text}"</p>
                <div className="flex items-center gap-2.5 pt-3 border-t border-gray-50">
                  <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{name}</p>
                    <p className="text-xs text-gray-400">{role} · {city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer CTA ── */}
        <section className="text-center py-8 border-t border-gray-200">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Ready to Find Your Opportunity?</h2>
          <p className="text-gray-500 text-sm mb-5">Join thousands of Cameroonians already on the platform.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/register" className="btn-primary px-8 py-3">Create Free Account</Link>
            <Link href="/jobs"          className="btn-ghost  px-8 py-3">Explore Jobs</Link>
          </div>
          <div className="flex items-center justify-center gap-5 mt-4 text-sm text-gray-400">
            {["Free to join", "100% Cameroonian", "No spam"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={12} className="text-green-500" />{t}
              </span>
            ))}
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
}