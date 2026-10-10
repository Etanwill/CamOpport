// src/app/profile/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Button, Input, Select } from "@/components/ui";
import {
  MapPin, Zap, Award, Edit3, Save, X, Upload, ImageIcon, Briefcase, Trophy, User,
  BadgeCheck, TrendingUp, Star, MoreVertical, Mail, Calendar, FileText,
} from "lucide-react";
import { CAMEROON_CITIES, CAMEROON_REGIONS } from "@/lib/data";
import { getAvatarUrl } from "@/lib/avatar";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ name: "", bio: "", city: "", region: "" });
  const [saving, setSaving]   = useState(false);

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [savingEmailPref, setSavingEmailPref]        = useState(false);

  // Live user data from DB
  const [liveUser, setLiveUser] = useState<any>(null);

  // Logo state
  const [logoFile, setLogoFile]           = useState<File | null>(null);
  const [logoPreview, setLogoPreview]     = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError]         = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Personal profile picture state
  const [avatarFile, setAvatarFile]             = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview]       = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading]   = useState(false);
  const [avatarRemoving, setAvatarRemoving]     = useState(false);
  const [avatarError, setAvatarError]           = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  // Fetch full live user from DB (role, companyLogo, bio, region, etc.)
  useEffect(() => {
    if (!session?.user?.id) return;
    fetch("/api/user/me")
      .then(r => r.json())
      .then(d => {
        if (!d.user) return;
        setLiveUser(d.user);
        setForm({
          name:   d.user.name   ?? "",
          bio:    d.user.bio    ?? "",
          city:   d.user.city   ?? "",
          region: d.user.region ?? "",
        });
        if (typeof d.user.emailNotifications === "boolean") setEmailNotifications(d.user.emailNotifications);
      })
      .catch(() => {});
  }, [session?.user?.id]);

  if (status === "loading" || !liveUser) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  if (!session) return null;

  const user       = liveUser;
  const xp         = user.xp ?? 0;
  const level      = Math.floor(xp / 1000) + 1;
  const isEmployer = user.role === "employer";

  // The logo to display: prefer local preview, then DB value
  const displayLogo = logoPreview ?? user.companyLogo ?? null;

  // The personal avatar to display: local preview, then DB value, then a
  // generated fallback so nobody is ever stuck with just a blank circle.
  const displayAvatar = avatarPreview ?? getAvatarUrl(user.id ?? user.email ?? user.name, user.avatar);

  // Avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setAvatarError("File too large. Max 2MB."); return; }
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) { setAvatarError("Invalid type. Use JPG, PNG, WebP or GIF."); return; }
    setAvatarError("");
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const cancelAvatarChange = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    setAvatarUploading(true);
    setAvatarError("");
    try {
      const fd = new FormData();
      fd.append("avatar", avatarFile);
      const res  = await fetch("/api/upload/avatar", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setAvatarError(data.error ?? "Upload failed"); return; }
      // Reflect the change immediately, without waiting on a refetch
      setLiveUser((prev: any) => ({ ...prev, avatar: data.avatarUrl }));
      setAvatarFile(null);
      setAvatarPreview(null);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    } catch {
      setAvatarError("Upload failed. Please try again.");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleAvatarRemove = async () => {
    setAvatarRemoving(true);
    setAvatarError("");
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: null }),
      });
      setLiveUser((prev: any) => ({ ...prev, avatar: null }));
      cancelAvatarChange();
    } catch {
      setAvatarError("Couldn't remove photo. Please try again.");
    } finally {
      setAvatarRemoving(false);
    }
  };

  // Logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setLogoError("File too large. Max 2MB."); return; }
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!validTypes.includes(file.type)) { setLogoError("Invalid type. Use JPG, PNG, WebP, GIF or SVG."); return; }
    setLogoError("");
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;
    setLogoUploading(true);
    setLogoError("");
    try {
      const fd = new FormData();
      fd.append("logo", logoFile);
      const res  = await fetch("/api/upload/logo", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setLogoError(data.error ?? "Upload failed"); return; }
      // Update liveUser with new logo
      setLiveUser((prev: any) => ({ ...prev, companyLogo: data.logoUrl }));
      setLogoFile(null);
      setLogoPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setLogoError("Upload failed. Please try again.");
    } finally {
      setLogoUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLiveUser((prev: any) => ({ ...prev, ...form }));
    setSaving(false);
    setEditing(false);
  };

  const handleToggleEmailNotifications = async () => {
    const next = !emailNotifications;
    setEmailNotifications(next); // optimistic
    setSavingEmailPref(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailNotifications: next }),
      });
      if (!res.ok) throw new Error("Failed to save");
    } catch {
      setEmailNotifications(!next); // revert on failure
    } finally {
      setSavingEmailPref(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7fb]">
      <div className="max-w-4xl mx-auto px-4 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Profile card (left) ── */}
          <div className="space-y-5">
            <div className="card !p-0 overflow-hidden">

              {/* Dark header */}
              <div className="relative bg-gradient-to-br from-[#12173a] via-[#191f4d] to-[#252c6e] px-5 pt-6 pb-6 text-center overflow-hidden">
                <div className="absolute top-5 left-5 grid grid-cols-4 gap-1.5">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i} className="w-1 h-1 rounded-full bg-white/25" />
                  ))}
                </div>

                {/* Avatar / logo — employer sees company logo (falls back to a
                    generated avatar), job seeker sees their own photo or a
                    generated avatar — never just a blank initial. */}
                {isEmployer && displayLogo ? (
                  <img
                    src={displayLogo}
                    alt="Company logo"
                    className="relative w-20 h-20 rounded-2xl object-contain border-4 border-white/90 bg-white mx-auto mb-3 p-1 shadow-lg"
                  />
                ) : (
                  <img
                    src={displayAvatar}
                    alt={user.name}
                    className="relative w-20 h-20 rounded-full object-cover border-4 border-white/90 mx-auto mb-3 shadow-lg"
                  />
                )}

                <div className="relative flex items-center justify-center gap-1.5">
                  <h2 className="font-display font-bold text-xl text-white">{user.name}</h2>
                  <BadgeCheck size={18} className="text-primary-400 fill-primary-400/20 flex-shrink-0" />
                </div>

                <span className="relative inline-block mt-2.5 px-3.5 py-1 rounded-full text-xs font-medium bg-white/15 text-white/90">
                  {isEmployer ? "Employer" : "Job Seeker"}
                </span>

                <p className="relative flex items-center justify-center gap-1.5 text-sm text-white/60 mt-3">
                  <MapPin size={13} /> {user.city ? `${user.city}, Cameroon` : "Cameroon"}
                </p>
              </div>

              {/* White footer */}
              <div className="p-5">
                {!isEmployer && (
                  <>
                    <div className="flex justify-between items-baseline text-sm mb-1.5">
                      <span className="text-gray-500">Level {level}</span>
                      <span className="text-primary-600 font-bold">{xp} XP</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-600 rounded-full" style={{ width: `${((xp % 1000) / 1000) * 100}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 mb-3">{1000 - (xp % 1000)} XP to level {level + 1}</p>
                  </>
                )}

                <Button onClick={() => setEditing(!editing)} variant="secondary" className="w-full" size="sm">
                  <Edit3 size={14} className="mr-1.5 inline" />{editing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </div>

            {!isEmployer ? (
              <div className="card p-5 text-center">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900">Badges</h3>
                  <a href="#" className="text-xs font-medium text-primary-600 hover:underline">View all</a>
                </div>
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto my-3">
                  <Trophy size={26} className="text-gray-300" strokeWidth={1.5} />
                </div>
                <p className="font-semibold text-gray-900">No badges yet</p>
                <p className="text-sm text-gray-400 mt-1.5 mb-4 leading-relaxed">
                  Complete quizzes and competitions to earn badges and showcase your achievements.
                </p>
                <a
                  href="/quiz"
                  className="block w-full py-2.5 rounded-xl bg-[#12173a] hover:bg-[#191f4d] text-white font-semibold text-sm text-center transition-colors"
                >
                  Explore Quizzes
                </a>
              </div>
            ) : (
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Award size={16} className="text-primary-600" />Badges
                </h3>
                <p className="text-sm text-gray-400 text-center py-3">
                  Post jobs and competitions to build your presence.
                </p>
              </div>
            )}
          </div>

          {/* ── Right side ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Edit form */}
            {editing && (
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Edit Profile</h3>
                <div className="space-y-4">
                  {/* Profile picture — everyone; falls back to a generated avatar if removed */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Picture <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 relative">
                        <img
                          src={displayAvatar}
                          alt="Profile picture preview"
                          className="w-20 h-20 rounded-full object-cover border border-gray-200 bg-primary-50"
                        />
                        {avatarPreview && (
                          <button
                            type="button"
                            onClick={cancelAvatarChange}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow hover:bg-red-50 hover:text-red-500 text-gray-400 transition"
                          >
                            <X size={10} />
                          </button>
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          ref={avatarInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                          onChange={handleAvatarChange}
                          className="hidden"
                          id="avatar-upload"
                        />
                        <div className="flex flex-wrap items-center gap-2">
                          <label
                            htmlFor="avatar-upload"
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 transition"
                          >
                            <Upload size={14} /> Choose photo
                          </label>
                          {user.avatar && !avatarPreview && (
                            <button
                              type="button"
                              onClick={handleAvatarRemove}
                              disabled={avatarRemoving}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 hover:text-red-500 transition disabled:opacity-50"
                            >
                              <User size={14} /> {avatarRemoving ? "Removing..." : "Use default avatar"}
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">JPG, PNG, WebP or GIF · Max 2 MB. No photo? We&apos;ll give you a default avatar.</p>
                        {avatarFile && (
                          <Button type="button" size="sm" className="mt-2" isLoading={avatarUploading} onClick={handleAvatarUpload}>
                            Save photo
                          </Button>
                        )}
                        {avatarError && <p className="text-red-600 text-xs mt-1">{avatarError}</p>}
                      </div>
                    </div>
                  </div>

                  <Input
                    label="Full Name"
                    value={form.name}
                    onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                  <div>
                    <label className="label">Bio</label>
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))}
                      rows={3}
                      className="input resize-none"
                      placeholder="Tell people about yourself..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      label="City"
                      value={form.city}
                      onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))}
                      options={CAMEROON_CITIES.map(c => ({ value: c, label: c }))}
                    />
                    <Select
                      label="Region"
                      value={form.region}
                      onChange={(e) => setForm(f => ({ ...f, region: e.target.value }))}
                      options={CAMEROON_REGIONS.map(r => ({ value: r, label: r }))}
                    />
                  </div>

                  {/* Logo upload — employers only */}
                  {isEmployer && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Logo <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {displayLogo ? (
                            <div className="relative">
                              <img
                                src={displayLogo}
                                alt="Logo preview"
                                className="w-20 h-20 rounded-xl object-contain border border-gray-200 bg-gray-50 p-1"
                              />
                              {logoPreview && (
                                <button
                                  type="button"
                                  onClick={removeLogo}
                                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow hover:bg-red-50 hover:text-red-500 text-gray-400 transition"
                                >
                                  <X size={10} />
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                              <ImageIcon size={22} className="text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml"
                            onChange={handleLogoChange}
                            className="hidden"
                            id="logo-upload"
                          />
                          <label
                            htmlFor="logo-upload"
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 transition"
                          >
                            <Upload size={14} /> Choose file
                          </label>
                          <p className="text-xs text-gray-400 mt-1.5">JPG, PNG, WebP, SVG · Max 2 MB</p>
                          {logoFile && (
                            <Button type="button" size="sm" className="mt-2" isLoading={logoUploading} onClick={handleLogoUpload}>
                              Upload logo
                            </Button>
                          )}
                          {logoError && <p className="text-red-600 text-xs mt-1">{logoError}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button onClick={handleSave} isLoading={saving}>
                      <Save size={14} className="mr-1.5 inline" />Save
                    </Button>
                    <Button onClick={() => setEditing(false)} variant="secondary">
                      <X size={14} className="mr-1.5 inline" />Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Stats — job seeker shows XP/Level/Badges, employer shows company info */}
            {isEmployer ? (
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Company Info</h3>
                <div className="space-y-3 text-sm">
                  {user.companyName && (
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">Company</span>
                      <span className="font-medium text-gray-800">{user.companyName}</span>
                    </div>
                  )}
                  {user.industrySector && (
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">Industry</span>
                      <span className="font-medium text-gray-800 capitalize">{user.industrySector}</span>
                    </div>
                  )}
                  {user.companySize && (
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">Company size</span>
                      <span className="font-medium text-gray-800">{user.companySize} employees</span>
                    </div>
                  )}
                  {user.companyWebsite && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500">Website</span>
                      <a href={user.companyWebsite} target="_blank" rel="noopener noreferrer"
                        className="font-medium text-primary-600 hover:underline truncate max-w-[60%]">
                        {user.companyWebsite.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="card p-5 relative overflow-hidden">
                  <div className="w-11 h-11 rounded-full bg-[#12173a] flex items-center justify-center mb-3.5">
                    <TrendingUp size={18} className="text-white" />
                  </div>
                  <p className="text-sm text-gray-500">XP Points</p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5">{xp.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-1">Keep going!</p>
                  <svg className="absolute bottom-4 right-4 w-14 h-7 text-primary-400" viewBox="0 0 60 30" fill="none">
                    <polyline points="0,25 12,20 22,22 32,10 42,14 52,3 58,6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div className="card p-5 relative overflow-hidden">
                  <div className="w-11 h-11 rounded-full bg-emerald-600 flex items-center justify-center mb-3.5">
                    <Trophy size={18} className="text-white" />
                  </div>
                  <p className="text-sm text-gray-500">Level</p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5">{level}</p>
                  <p className="text-xs text-gray-400 mt-1">{level === 1 ? "Beginner" : level < 5 ? "Rising star" : "Expert"}</p>
                  <Star size={56} className="absolute -bottom-3 -right-3 text-gray-100" strokeWidth={1.5} />
                </div>

                <div className="card p-5 relative overflow-hidden">
                  <div className="w-11 h-11 rounded-full bg-[#2b2470] flex items-center justify-center mb-3.5">
                    <Award size={18} className="text-white" />
                  </div>
                  <p className="text-sm text-gray-500">Badges</p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5">0</p>
                  <p className="text-xs text-gray-400 mt-1">Earn more</p>
                  <Award size={56} className="absolute -bottom-3 -right-3 text-gray-100" strokeWidth={1.5} />
                </div>
              </div>
            )}

            {/* Account Info */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Account Information</h3>
                <button type="button" className="text-gray-300 hover:text-gray-500 transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                <div className="flex items-center gap-3.5 py-3.5">
                  <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Mail size={16} className="text-primary-600" />
                  </div>
                  <span className="text-sm text-gray-500 flex-1">Email</span>
                  <span className="text-sm font-medium text-gray-800 truncate max-w-[55%] text-right">{user.email}</span>
                </div>
                <div className="flex items-center gap-3.5 py-3.5">
                  <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Briefcase size={16} className="text-primary-600" />
                  </div>
                  <span className="text-sm text-gray-500 flex-1">Role</span>
                  <span className="text-sm font-medium text-gray-800">{isEmployer ? "Employer" : "Job Seeker"}</span>
                </div>
                <div className="flex items-center gap-3.5 py-3.5">
                  <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} className="text-primary-600" />
                  </div>
                  <span className="text-sm text-gray-500 flex-1">Location</span>
                  <span className="text-sm font-medium text-gray-800">{user.city ? `${user.city}, Cameroon` : "—"}</span>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-1">Notification Preferences</h3>
              <p className="text-xs text-gray-400 mb-4">Choose how CamOpport keeps you updated.</p>
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Mail size={16} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Email notifications</p>
                    <p className="text-xs text-gray-400">Also get application updates, new matches & results by email</p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={emailNotifications}
                  disabled={savingEmailPref}
                  onClick={handleToggleEmailNotifications}
                  className={cn(
                    "relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors disabled:opacity-60",
                    emailNotifications ? "bg-primary-600" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
                      emailNotifications ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Recent Activity — job seekers only */}
            {!isEmployer && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                  <a href="/my-activity" className="text-xs font-medium text-primary-600 hover:underline">View all</a>
                </div>
                <div className="relative pl-1">
                  <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gray-100" />
                  <div className="space-y-6">
                    {[
                      { icon: Calendar, iconBg: "bg-green-50", iconColor: "text-green-600", dot: "bg-green-500", text: "Registered for CamTech Hackathon 2024", time: "2 days ago" },
                      { icon: FileText, iconBg: "bg-blue-50", iconColor: "text-blue-600", dot: "bg-blue-500", text: "Completed Cameroon General Knowledge quiz", time: "5 days ago" },
                      { icon: Briefcase, iconBg: "bg-purple-50", iconColor: "text-purple-600", dot: "bg-purple-500", text: "Applied to Junior Software Developer", time: "1 week ago" },
                    ].map((item, i) => (
                      <div key={i} className="relative flex items-start gap-4">
                        <span className={cn("absolute left-0 top-2 w-2.5 h-2.5 rounded-full ring-4 ring-white", item.dot)} />
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ml-6", item.iconBg)}>
                          <item.icon size={16} className={item.iconColor} />
                        </div>
                        <div className="flex-1 pt-1.5">
                          <p className="text-sm font-semibold text-gray-800">{item.text}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center mt-6">
                  <a
                    href="/my-activity"
                    className="inline-block px-5 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors"
                  >
                    View all activity
                  </a>
                </div>
              </div>
            )}

            {/* Employer quick actions */}
            {isEmployer && (
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase size={16} className="text-emerald-600" />Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <a href="/employer/post-job"
                    className="flex items-center gap-2 p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium hover:bg-emerald-100 transition">
                    <Briefcase size={15} /> Post a Job
                  </a>
                  <a href="/employer/dashboard"
                    className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-sm font-medium hover:bg-gray-100 transition">
                    <Trophy size={15} /> My Postings
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
</div>
  );
}