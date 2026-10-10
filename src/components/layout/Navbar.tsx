// src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Bell, Menu, X, Trophy, Briefcase, Zap, Mic, User, LogOut,
  ChevronDown, PlusCircle, ClipboardList, Code2,
  Bookmark, CheckCheck, Star, Info, LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const jobSeekerLinks = [
  { href: "/jobs",         label: "Jobs & Gigs",     icon: Briefcase },
  { href: "/competitions", label: "Competitions",    icon: Trophy },
  { href: "/quiz",         label: "Company Quizzes", icon: Zap },
  { href: "/interview",    label: "Mock Interview",  icon: Mic },
  { href: "/my-activity",  label: "My Activity",     icon: ClipboardList },
  { href: "/leaderboard",  label: "Leaderboard",     icon: Trophy },
];

const employerLinks = [
  { href: "/jobs",         label: "Browse Jobs",  icon: Briefcase },
  { href: "/competitions", label: "Competitions", icon: Trophy },
  { href: "/quiz",         label: "All Quizzes",  icon: Zap },
];

// Map notification type to icon + colour
function NotifIcon({ type }: { type: string }) {
  const map: Record<string, { icon: React.ElementType; cls: string }> = {
    application_update: { icon: Briefcase, cls: "text-primary-600 bg-primary-50" },
    competition_update: { icon: Trophy,    cls: "text-purple-600 bg-purple-50"  },
    new_job:            { icon: Briefcase, cls: "text-emerald-600 bg-emerald-50" },
    new_competition:    { icon: Star,      cls: "text-amber-600 bg-amber-50"    },
    quiz_result:        { icon: Zap,       cls: "text-blue-600 bg-blue-50"      },
    general:            { icon: Info,      cls: "text-gray-600 bg-gray-100"     },
  };
  const { icon: Icon, cls } = map[type] ?? map.general;
  return (
    <span className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", cls)}>
      <Icon size={15} />
    </span>
  );
}

export default function Navbar() {
  const pathname                   = usePathname();
  const { data: session, status }  = useSession();
  const sessionLoading             = status === "loading";
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [bellOpen,    setBellOpen]    = useState(false);

  // Live user data fetched from DB (gives us fresh companyLogo + confirmed role)
  const [liveUser, setLiveUser] = useState<{
    role: string;
    companyLogo?: string | null;
    companyName?: string | null;
    bits?: number | null;
  } | null>(null);

  // Notification state
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const bellRef    = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Fetch live user data from DB whenever session is available
  useEffect(() => {
    if (!session?.user?.id) { setLiveUser(null); return; }
    fetch("/api/user/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.user) {
          setLiveUser({
            role:        data.user.role,
            companyLogo: data.user.companyLogo,
            companyName: data.user.companyName,
            bits:        data.user.bits,
          });
        }
      })
      .catch(() => {});
  }, [session?.user?.id]);

  // Use live DB role — falls back to session role while loading
  const isEmployer = (liveUser?.role ?? session?.user?.role) === "employer";
  const navLinks   = isEmployer ? employerLinks : jobSeekerLinks;

  // Company logo from DB (most up to date)
  const companyLogo = liveUser?.companyLogo ?? (session?.user as any)?.companyLogo;
  const companyName = liveUser?.companyName ?? (session?.user as any)?.companyName;
  const bits         = liveUser?.bits;

  // Fetch notifications
  useEffect(() => {
    if (!session?.user?.id) return;
    const load = async () => {
      try {
        const res  = await fetch("/api/notifications");
        if (!res.ok) return;
        const data = await res.json();
        setNotifications(data.items ?? []);
        setUnreadCount(data.unreadCount ?? 0);
      } catch { /* silent */ }
    };
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, [session?.user?.id]);

  // Mark all read when bell opens
  useEffect(() => {
    if (!bellOpen || unreadCount === 0) return;
    fetch("/api/notifications/mark-read", { method: "POST" })
      .then(() => {
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      })
      .catch(() => {});
  }, [bellOpen]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bellRef.current    && !bellRef.current.contains(e.target as Node))    setBellOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-icon.png" alt="Unbound" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-display font-bold text-xl text-gray-900">
              Un<span className="text-primary-600">bound</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname.startsWith(href) ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}>{label}</Link>
            ))}

            {/* Employer quick-post links */}
            {isEmployer && (
              <div className="flex items-center gap-1 ml-2 pl-2 border-l border-gray-200">
                <Link href="/employer/post-job" className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-emerald-700 hover:bg-emerald-50",
                  pathname === "/employer/post-job" && "bg-emerald-50"
                )}>
                  <PlusCircle size={15} /> Post Job
                </Link>
                <Link href="/employer/post-competition" className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-blue-700 hover:bg-blue-50",
                  pathname === "/employer/post-competition" && "bg-blue-50"
                )}>
                  <PlusCircle size={15} /> Competition
                </Link>
                <Link href="/employer/create-quiz" className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-purple-700 hover:bg-purple-50",
                  pathname === "/employer/create-quiz" && "bg-purple-50"
                )}>
                  <PlusCircle size={15} /> Quiz
                </Link>
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {session?.user ? (
              <>
                {/* ── Notification Bell ─────────────────────────────── */}
                <div className="relative" ref={bellRef}>
                  <button
                    onClick={() => { setBellOpen(o => !o); setProfileOpen(false); }}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative"
                    aria-label="Notifications"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Bell dropdown */}
                  {bellOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">Notifications</p>
                        {notifications.length > 0 && (
                          <button
                            onClick={() => {
                              fetch("/api/notifications/mark-read", { method: "POST" });
                              setUnreadCount(0);
                              setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                            }}
                            className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 font-medium"
                          >
                            <CheckCheck size={13} /> Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                        {notifications.length === 0 ? (
                          <div className="py-10 text-center">
                            <Bell size={28} className="text-gray-200 mx-auto mb-2" />
                            <p className="text-sm text-gray-400">No notifications yet</p>
                            <p className="text-xs text-gray-300 mt-1">We'll let you know when something happens</p>
                          </div>
                        ) : (
                          notifications.map(n => (
                            <div
                              key={n.id}
                              onClick={() => { if (n.link) { window.location.href = n.link; setBellOpen(false); } }}
                              className={cn(
                                "flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors",
                                n.link && "cursor-pointer",
                                !n.isRead && "bg-primary-50/40"
                              )}
                            >
                              <NotifIcon type={n.type} />
                              <div className="flex-1 min-w-0">
                                <p className={cn("text-sm", !n.isRead ? "font-semibold text-gray-900" : "font-medium text-gray-700")}>
                                  {n.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                                <p className="text-xs text-gray-300 mt-1">
                                  {new Date(n.createdAt).toLocaleDateString()} · {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                              {!n.isRead && (
                                <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      <div className="border-t border-gray-100 px-4 py-2.5">
                        <Link
                          href="/my-activity?tab=saved"
                          onClick={() => setBellOpen(false)}
                          className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-800 font-medium"
                        >
                          <Bookmark size={13} /> View saved opportunities
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Bits balance (job seekers only) ─────────────────── */}
                {!isEmployer && (
                  <Link
                    href="/bits"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 text-sm font-semibold hover:bg-amber-100 transition-colors"
                    title="Buy more bits"
                  >
                    <Zap size={14} className="text-amber-500" />
                    {bits ?? "…"}
                  </Link>
                )}

                {/* ── Profile Dropdown ──────────────────────────────── */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => { setProfileOpen(!profileOpen); setBellOpen(false); }}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    {/* Show company logo for employers, initial avatar for job seekers */}
                    {isEmployer && companyLogo ? (
                      <img
                        src={companyLogo}
                        alt={companyName || "Company"}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                        isEmployer ? "bg-emerald-100 text-emerald-700" : "bg-primary-100 text-primary-700"
                      )}>
                        {session.user.name?.charAt(0)}
                      </div>
                    )}
                    <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-24 truncate">
                      {session.user.name?.split(" ")[0]}
                    </span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      {/* Profile header */}
                      <div className="px-4 py-2 border-b border-gray-50">
                        <p className="text-sm font-semibold text-gray-900">{session.user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {isEmployer
                            ? `🏢 ${companyName || "Employer"}`
                            : `🔍 Job Seeker · ${session.user.xp ?? 0} XP · ${bits ?? "…"} bits`}
                        </p>
                      </div>

                      {/* My Activity — shown to all */}
                      <Link href="/my-activity"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setProfileOpen(false)}>
                        <LayoutDashboard size={15} /> My Activity
                      </Link>

                      {/* My Profile — shown to all */}
                      <Link href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setProfileOpen(false)}>
                        <User size={15} /> My Profile
                      </Link>

                      {!isEmployer && (
                        <Link href="/bits"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50"
                          onClick={() => setProfileOpen(false)}>
                          <Zap size={15} /> Buy Bits
                        </Link>
                      )}

                      {/* Employer only links */}
                      {isEmployer && (
                        <div className="border-t border-gray-50 mt-1 pt-1">
                          <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase">Employer Tools</p>
                          <Link href="/employer/post-job"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50"
                            onClick={() => setProfileOpen(false)}>
                            <PlusCircle size={15} /> Post a Job
                          </Link>
                          <Link href="/employer/post-competition"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
                            onClick={() => setProfileOpen(false)}>
                            <PlusCircle size={15} /> Post Competition
                          </Link>
                          <Link href="/employer/create-quiz"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50"
                            onClick={() => setProfileOpen(false)}>
                            <PlusCircle size={15} /> Create Quiz
                          </Link>
                          <Link href="/employer/dashboard"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setProfileOpen(false)}>
                            <ClipboardList size={15} /> My Postings
                          </Link>
                        </div>
                      )}

                      <div className="border-t border-gray-50 mt-1 pt-1">
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : sessionLoading ? (
              // Session status not resolved yet — show a neutral placeholder
              // instead of flashing the logged-out buttons.
              <div className="flex items-center gap-2">
                <div className="w-16 h-8 rounded-lg bg-gray-100 animate-pulse" />
                <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="btn-ghost text-sm">Sign In</Link>
                <Link href="/auth/register" className="btn-primary text-sm">Join Free</Link>
              </div>
            )}
            <button
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-3 pt-1 border-t border-gray-100">
            {session?.user && (
              <Link href="/my-activity" onClick={() => setMobileOpen(false)}
                className={cn("flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  pathname === "/my-activity" ? "bg-primary-50 text-primary-700" : "text-gray-600")}>
                <LayoutDashboard size={17} /> My Activity
              </Link>
            )}
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                className={cn("flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  pathname.startsWith(href) ? "bg-primary-50 text-primary-700" : "text-gray-600")}>
                <Icon size={17} /> {label}
              </Link>
            ))}
            {!isEmployer && session?.user && (
              <>
                <Link href="/code" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-gray-600">
                  <Code2 size={17} /> 100 Days of Code
                </Link>
                <Link href="/bits" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-amber-700">
                  <Zap size={17} /> Buy Bits ({bits ?? "…"})
                </Link>
              </>
            )}
            {isEmployer && (
              <>
                <div className="border-t border-gray-100 mt-2 pt-2 px-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Employer Actions</p>
                </div>
                {[
                  { href: "/employer/post-job",         label: "Post a Job",       icon: PlusCircle    },
                  { href: "/employer/post-competition",  label: "Post Competition", icon: PlusCircle    },
                  { href: "/employer/create-quiz",       label: "Create Quiz",      icon: PlusCircle    },
                  { href: "/employer/dashboard",         label: "My Postings",      icon: ClipboardList },
                ].map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-emerald-700">
                    <Icon size={17} /> {label}
                  </Link>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}