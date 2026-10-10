// src/components/layout/Sidebar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Home, Briefcase, Trophy, Zap, Brain, TrendingUp,
  ClipboardList, Bookmark, Bell, Search,
  ChevronLeft, ChevronRight, LogOut,
  LayoutDashboard, PlusCircle, X, CheckCheck,
  Star, User, ChevronDown, ChevronUp,
  Menu, Code2, MessageCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAvatarUrl } from "@/lib/avatar";
import { useSidebar } from "./SidebarWrapper";

const JOB_SEEKER_NAV = [
  { href: "/",             label: "Home",           icon: Home          },
  { href: "/messages",     label: "Messages",       icon: MessageCircle },
  { href: "/jobs",         label: "Jobs & Gigs",    icon: Briefcase     },
  { href: "/competitions", label: "Competitions",   icon: Trophy        },
  { href: "/quiz",         label: "Quizzes",        icon: Zap           },
  { href: "/interview",    label: "Mock Interview", icon: Brain         },
  { href: "/code",         label: "100 Days of Code", icon: Code2       },
  { href: "/leaderboard",  label: "Leaderboard",    icon: TrendingUp    },
  { href: "/my-activity",  label: "My Activity",    icon: ClipboardList },
];

const EMPLOYER_NAV = [
  { href: "/",                          label: "Home",             icon: Home            },
  { href: "/messages",                  label: "Messages",         icon: MessageCircle  },
  { href: "/jobs",                      label: "Browse Jobs",      icon: Briefcase       },
  { href: "/competitions",              label: "Competitions",     icon: Trophy          },
  { href: "/quiz",                      label: "All Quizzes",      icon: Zap             },
  { href: "__post__",                   label: "Post",             icon: PlusCircle      },
  { href: "/employer/dashboard",        label: "My Postings",      icon: ClipboardList   },
];

// Signed-out visitors only get Home — everything else requires an account,
// so there's no point showing nav items that just bounce them to login.
const GUEST_NAV = [
  { href: "/", label: "Home", icon: Home },
];

const POST_MENU_ITEMS = [
  { href: "/employer/post-job",         label: "Post a Job",         icon: Briefcase },
  { href: "/employer/post-competition", label: "Post a Competition", icon: Trophy    },
  { href: "/employer/create-quiz",      label: "Create a Quiz",      icon: Zap       },
];

function NotifIcon({ type }: { type: string }) {
  const map: Record<string, { emoji: string; color: string }> = {
    application_update: { emoji: "💼", color: "bg-primary-100 text-primary-700" },
    competition_update: { emoji: "🏆", color: "bg-purple-100 text-purple-700"  },
    new_job:            { emoji: "📋", color: "bg-green-100 text-green-700"    },
    new_competition:    { emoji: "⭐", color: "bg-amber-100 text-amber-700"    },
    quiz_result:        { emoji: "⚡", color: "bg-blue-100 text-blue-700"      },
    general:            { emoji: "ℹ️", color: "bg-gray-100 text-gray-600"      },
  };
  const { emoji, color } = map[type] ?? map.general;
  return (
    <span className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0", color)}>
      {emoji}
    </span>
  );
}

export default function Sidebar() {
  const pathname                   = usePathname();
  const router                     = useRouter();
  const { data: session, status }  = useSession();
  const sessionLoading             = status === "loading";

  const { collapsed, setCollapsed } = useSidebar();
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [searchQuery,   setSearchQuery]   = useState("");
  const [profileOpen,   setProfileOpen]   = useState(false);
  const [bellOpen,      setBellOpen]      = useState(false);
  const [postMenuOpen,  setPostMenuOpen]  = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Live user data from DB — gives us real role + companyLogo
  const [liveUser, setLiveUser] = useState<{
    role: string;
    companyLogo?: string | null;
    companyName?: string | null;
    xp?: number;
    avatar?: string | null;
  } | null>(null);

  const searchRef  = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const bellRef    = useRef<HTMLDivElement>(null);
  const postMenuRef = useRef<HTMLDivElement>(null);

  // Fetch live user from DB
  useEffect(() => {
    if (!session?.user?.id) { setLiveUser(null); return; }
    fetch("/api/user/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.user) setLiveUser({
          role:        data.user.role,
          companyLogo: data.user.companyLogo,
          companyName: data.user.companyName,
          xp:          data.user.xp,
          avatar:      data.user.avatar,
        });
      })
      .catch(() => {});
  }, [session?.user?.id]);

  // Use live DB role — falls back to session while loading
  const roleKnown   = status !== "loading";
  const isGuest     = status === "unauthenticated";
  const isEmployer  = (liveUser?.role ?? session?.user?.role) === "employer";
  const navLinks    = isGuest ? GUEST_NAV : (isEmployer ? EMPLOYER_NAV : JOB_SEEKER_NAV);
  // companyLogo is already present on the JWT/session as soon as we're
  // authenticated, so prefer it immediately and only use liveUser as a
  // (rarely-needed) fallback once it resolves.
  const companyLogo = session?.user?.companyLogo || liveUser?.companyLogo;
  const companyName = liveUser?.companyName ?? (session?.user as any)?.companyName;
  const xp          = liveUser?.xp ?? session?.user?.xp ?? 0;
  const displayAvatar = getAvatarUrl(
    session?.user?.id ?? session?.user?.email ?? session?.user?.name ?? "user",
    liveUser?.avatar
  );
  // Personal avatar isn't in the JWT (only fetched via /api/user/me), so we
  // don't actually know yet whether the user has one — showing the generated
  // fallback immediately would flash before the real photo swaps in. For
  // employers we already know companyLogo the moment the session resolves.
  const pictureReady = isEmployer ? status === "authenticated" : liveUser !== null;

  // Job seeker profile popup links
  const JOB_SEEKER_PROFILE_LINKS = [
    { href: "/profile",     label: "My Profile", icon: User          },
  ];

  // Employer profile popup links
  const EMPLOYER_PROFILE_LINKS = [
    { href: "/profile",              label: "My Profile",   icon: User          },
    { href: "/employer/dashboard",   label: "My Postings",  icon: LayoutDashboard },
    { href: "/employer/post-job",    label: "Post a Job",   icon: PlusCircle    },
  ];

  const profileLinks = isEmployer ? EMPLOYER_PROFILE_LINKS : JOB_SEEKER_PROFILE_LINKS;

  // Load notifications
  useEffect(() => {
    if (!session?.user?.id) return;
    const load = async () => {
      try {
        const res  = await fetch("/api/notifications");
        if (!res.ok) return;
        const data = await res.json();
        setNotifications(data.items ?? []);
        setUnreadCount(data.unreadCount ?? 0);
      } catch {}
    };
    load();
    const iv = setInterval(load, 60_000);
    return () => clearInterval(iv);
  }, [session?.user?.id]);

  // Load unread chat message count (badge on the "Messages" nav link)
  useEffect(() => {
    if (!session?.user?.id) return;
    const load = async () => {
      try {
        const res  = await fetch("/api/conversations");
        if (!res.ok) return;
        const data = await res.json();
        const total = (data.items ?? []).reduce((sum: number, i: any) => sum + (i.unreadCount ?? 0), 0);
        setUnreadMessages(total);
      } catch {}
    };
    load();
    const iv = setInterval(load, 20_000);
    return () => clearInterval(iv);
  }, [session?.user?.id, pathname]);

  // Mark read when bell opens
  useEffect(() => {
    if (!bellOpen || unreadCount === 0) return;
    fetch("/api/notifications/mark-read", { method: "POST" }).then(() => {
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }).catch(() => {});
  }, [bellOpen]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (bellRef.current    && !bellRef.current.contains(e.target as Node))    setBellOpen(false);
      if (postMenuRef.current && !postMenuRef.current.contains(e.target as Node)) setPostMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close the "Post" popover whenever we navigate somewhere
  useEffect(() => { setPostMenuOpen(false); }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/jobs?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const sidebarWidth = collapsed ? "w-[68px]" : "w-64";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* ── Logo + collapse toggle ── */}
      <div className={cn(
        "flex items-center h-14 px-3 border-b border-gray-100 flex-shrink-0",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <img src="/logo-icon.png" alt="Unbound" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
            <span className="font-display font-bold text-lg text-gray-900 whitespace-nowrap">
              Un<span className="text-primary-600">bound</span>
            </span>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="w-8 h-8 rounded-lg flex-shrink-0 overflow-hidden">
            <img src="/logo-icon.png" alt="Unbound" className="w-8 h-8 object-cover" />
          </Link>
        )}
        <button
          onClick={() => setCollapsed((c: boolean) => !c)}
          className={cn(
            "hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors flex-shrink-0",
            collapsed && "mt-0"
          )}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* ── Search bar ── */}
      <div className={cn("px-3 py-3 border-b border-gray-100 flex-shrink-0", collapsed && "px-2")}>
        {collapsed ? (
          <button
            onClick={() => { setCollapsed(false); }}
            className="w-full flex items-center justify-center p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <Search size={16} />
          </button>
        ) : (
          <form onSubmit={handleSearch} className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search jobs, competitions…"
              className="w-full pl-8 pr-3 py-2 text-sm bg-gray-100 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-300 placeholder-gray-400"
            />
          </form>
        )}
      </div>

      {/* ── Nav links ── */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {!roleKnown ? (
          // Role not resolved yet (fresh page load) — show a neutral skeleton
          // instead of guessing, so we never flash the wrong nav (e.g. job-seeker
          // links like "Mock Interview" / "100 Days of Code" for an employer).
          Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={cn(
              "flex items-center gap-3 rounded-xl animate-pulse",
              collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"
            )}>
              <div className="w-[18px] h-[18px] rounded bg-gray-200 flex-shrink-0" />
              {!collapsed && <div className="h-3.5 w-24 rounded bg-gray-200" />}
            </div>
          ))
        ) : navLinks.map(({ href, label, icon: Icon }) => {
          // Special-cased "Post" button: opens a small popover with
          // Post a Job / Post a Competition / Create a Quiz instead of
          // navigating directly, so employers get one entry point instead
          // of three separate nav rows.
          if (href === "__post__") {
            const postActive = POST_MENU_ITEMS.some(item => isActive(item.href));
            return (
              <div
                key={href}
                ref={postMenuRef}
                className="relative"
                onMouseEnter={() => setPostMenuOpen(true)}
                onMouseLeave={() => setPostMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setPostMenuOpen(o => !o)}
                  title={collapsed ? label : undefined}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-xl transition-all duration-150 group relative",
                    collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5",
                    postActive || postMenuOpen
                      ? "bg-primary-50 text-primary-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium"
                  )}
                >
                  <Icon size={18} className={cn(
                    "flex-shrink-0 transition-colors",
                    postActive || postMenuOpen ? "text-primary-600" : "text-gray-400 group-hover:text-gray-600"
                  )} />
                  {!collapsed && <span className="text-sm whitespace-nowrap">{label}</span>}
                  {!collapsed && (
                    <ChevronDown size={14} className={cn(
                      "ml-auto flex-shrink-0 transition-transform text-gray-400",
                      postMenuOpen && "rotate-180"
                    )} />
                  )}
                </button>

                {postMenuOpen && (
                  <div className={cn(
                    "absolute z-50 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 w-52",
                    collapsed ? "left-full ml-2 top-0" : "left-0 right-0 top-full mt-1"
                  )}>
                    {POST_MENU_ITEMS.map(({ href: itemHref, label: itemLabel, icon: ItemIcon }) => (
                      <Link
                        key={itemHref}
                        href={itemHref}
                        onClick={() => { setPostMenuOpen(false); setMobileOpen(false); }}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-700 transition-colors"
                      >
                        <ItemIcon size={15} className="text-gray-400 flex-shrink-0" />
                        {itemLabel}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          const active = isActive(href);
          const badgeCount = href === "/messages" ? unreadMessages : 0;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl transition-all duration-150 group relative",
                collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5",
                active
                  ? "bg-primary-50 text-primary-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium"
              )}
            >
              <div className="relative flex-shrink-0">
                <Icon size={18} className={cn(
                  "transition-colors",
                  active ? "text-primary-600" : "text-gray-400 group-hover:text-gray-600"
                )} />
                {badgeCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 px-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {badgeCount > 9 ? "9+" : badgeCount}
                  </span>
                )}
              </div>
              {!collapsed && <span className="text-sm whitespace-nowrap">{label}</span>}
              {!collapsed && badgeCount > 0 && (
                <span className="ml-auto min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                  {badgeCount > 9 ? "9+" : badgeCount}
                </span>
              )}
              {active && !badgeCount && <span className="absolute right-2 w-1.5 h-1.5 bg-primary-500 rounded-full" />}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  {label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom: Bell + Profile ── */}
      <div className="flex-shrink-0 border-t border-gray-100 p-2 space-y-1">
        {!roleKnown ? (
          // Session not resolved yet on this fresh load — show a neutral
          // skeleton instead of the "Sign In" buttons, otherwise an already
          // logged-in user briefly sees a sign-in prompt (and then xp/bits/
          // profile flash in once the session actually resolves).
          <div className={cn("flex items-center gap-3 px-2 py-2", collapsed && "justify-center px-0")}>
            <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
            {!collapsed && (
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="h-3.5 w-24 rounded bg-gray-100 animate-pulse" />
                <div className="h-3 w-16 rounded bg-gray-100 animate-pulse" />
              </div>
            )}
          </div>
        ) : session?.user ? (
          <>
            {/* ── Notification Bell ── */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => { setBellOpen(o => !o); setProfileOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-600 relative",
                  collapsed && "justify-center px-0"
                )}
                title={collapsed ? "Notifications" : undefined}
              >
                <div className="relative flex-shrink-0">
                  <Bell size={18} className="text-gray-400" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                {!collapsed && <span className="text-sm font-medium">Notifications</span>}
              </button>

              {bellOpen && (
                <div className="absolute bottom-full mb-2 left-0 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-[100] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">Notifications</p>
                    {notifications.length > 0 && (
                      <button
                        onClick={() => {
                          fetch("/api/notifications/mark-read", { method: "POST" });
                          setUnreadCount(0);
                          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                        }}
                        className="flex items-center gap-1 text-xs text-primary-600 font-medium hover:text-primary-800"
                      >
                        <CheckCheck size={12} /> Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center">
                        <Bell size={24} className="text-gray-200 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">No notifications yet</p>
                      </div>
                    ) : notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => { if (n.link) { router.push(n.link); setBellOpen(false); } }}
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
                        {!n.isRead && <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1.5" />}
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 px-4 py-2.5">
                    <Link href="/my-activity?tab=saved" onClick={() => setBellOpen(false)}
                      className="flex items-center gap-1.5 text-xs text-primary-600 font-medium hover:text-primary-800">
                      <Bookmark size={12} /> View saved opportunities
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* ── Profile button ── */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => { setProfileOpen(o => !o); setBellOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-100 transition-colors",
                  collapsed && "justify-center px-0"
                )}
                title={collapsed ? session.user.name ?? "Profile" : undefined}
              >
                {/* Avatar: company logo for employers, profile photo (or generated avatar) for job seekers */}
                {!pictureReady ? (
                  <div className="w-9 h-9 rounded-full border border-gray-200 bg-gray-100 animate-pulse flex-shrink-0" />
                ) : isEmployer && companyLogo ? (
                  <img
                    src={companyLogo}
                    alt={companyName || "Company"}
                    className="w-9 h-9 rounded-full object-cover border border-gray-200 flex-shrink-0"
                  />
                ) : (
                  <img
                    src={displayAvatar}
                    alt={session.user.name ?? "Profile"}
                    className="w-9 h-9 rounded-full object-cover border border-gray-200 bg-primary-50 flex-shrink-0"
                  />
                )}
                {!collapsed && (
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-gray-900 truncate">{session.user.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {isEmployer ? companyName ?? "Employer" : `${xp} XP`}
                    </p>
                  </div>
                )}
                {!collapsed && (
                  profileOpen
                    ? <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
                    : <ChevronUp   size={14} className="text-gray-400 flex-shrink-0" />
                )}
              </button>

              {/* Profile popup — opens upward */}
              {profileOpen && (
                <div className="absolute bottom-full mb-2 left-0 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-[100] overflow-hidden">

                  {/* Header */}
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
                  >
                    {!pictureReady ? (
                      <div className="w-12 h-12 rounded-full border border-gray-200 bg-gray-100 animate-pulse flex-shrink-0" />
                    ) : isEmployer && companyLogo ? (
                      <img
                        src={companyLogo}
                        alt={companyName || "Company"}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200 flex-shrink-0"
                      />
                    ) : (
                      <img
                        src={displayAvatar}
                        alt={session.user.name ?? "Profile"}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200 bg-primary-50 flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{session.user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                      <p className="text-xs text-primary-600 font-medium mt-0.5">
                        {isEmployer ? `🏢 ${companyName ?? "Employer"}` : `🎯 ${xp} XP earned`}
                      </p>
                    </div>
                  </Link>

                  {/* Role-specific links */}
                  <div className="py-1">
                    {profileLinks.map(({ href, label, icon: Icon }) => (
                      <Link key={href} href={href} onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Icon size={15} className="text-gray-400" /> {label}
                      </Link>
                    ))}
                  </div>

                  {/* Sign out */}
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={() => { setProfileOpen(false); signOut({ callbackUrl: "/" }); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
          // instead of flashing the Sign In / Create Account buttons.
          <div className={cn("space-y-2", collapsed ? "px-1" : "px-1")}>
            {collapsed ? (
              <div className="w-full h-10 rounded-xl bg-gray-100 animate-pulse" />
            ) : (
              <>
                <div className="w-full h-9 rounded-xl bg-gray-100 animate-pulse" />
                <div className="w-full h-9 rounded-xl bg-gray-100 animate-pulse" />
              </>
            )}
          </div>
        ) : (
          <div className={cn("space-y-2", collapsed ? "px-1" : "px-1")}>
            {collapsed ? (
              <Link href="/auth/login"
                className="w-full flex items-center justify-center p-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                title="Sign In">
                <User size={16} />
              </Link>
            ) : (
              <>
                <Link href="/auth/login"
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/register"
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors">
                  Create Account
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 w-10 h-10 bg-white shadow-md border border-gray-200 rounded-xl flex items-center justify-center text-gray-600"
      >
        <Menu size={18} />
      </button>

      {/* Mobile sidebar */}
      <div className={cn(
        "lg:hidden fixed top-0 left-0 h-full z-50 w-64 bg-white border-r border-gray-100 shadow-xl transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <button onClick={() => setMobileOpen(false)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
          <X size={16} />
        </button>
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className={cn(
        "hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-white border-r border-gray-100 z-30 transition-all duration-300",
        sidebarWidth
      )}>
        <SidebarContent />
      </div>
    </>
  );
}