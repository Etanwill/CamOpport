// src/app/auth/register/page.tsx
// LOCATION: src/app/auth/register/page.tsx
"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { User, Mail, Lock, Building2, Phone, Globe, Briefcase, Linkedin, Upload, ImageIcon, X } from "lucide-react";
import { Input, Button, Select } from "@/components/ui";
import { CAMEROON_CITIES, CAMEROON_REGIONS } from "@/lib/data";
import { COMPANY_SIZES, INDUSTRY_SECTORS, EXPERIENCE_LEVELS } from "@/types";

type Role = "job_seeker" | "employer";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.71v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.61z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.9v2.33A9 9 0 009 18z"/>
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 013.68 9c0-.59.1-1.17.27-1.7V4.97H.9A9 9 0 000 9c0 1.45.35 2.83.9 4.03l3.05-2.33z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.9 4.97l3.05 2.33C4.66 5.17 6.65 3.58 9 3.58z"/>
    </svg>
  );
}

const JOB_TYPES = [
  "full-time", "part-time", "contract", "internship", "gig", "one-day"
];
const JOB_CATEGORIES = [
  "technology", "marketing", "finance", "agriculture", "transport",
  "healthcare", "education", "hospitality", "creative", "admin", "manual", "other"
];

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("job_seeker");
  const [step, setStep] = useState(1);

  // Step 3 is the optional logo upload step for employers
  const [registeredUserId, setRegisteredUserId] = useState<string | null>(null);

  const [form, setForm] = useState({
    // Common
    name: "", email: "", password: "", city: "", region: "",
    // Job Seeker
    currentJobTitle: "", experienceLevel: "", linkedinUrl: "", portfolioUrl: "",
    preferredJobTypes: [] as string[], preferredCategories: [] as string[],
    skills: "",
    // Employer
    companyName: "", companySize: "", industrySector: "",
    companyWebsite: "", companyDescription: "", contactPhone: "",
  });

  // Logo upload state
  const [logoFile, setLogoFile]       = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError]     = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleMulti = (key: "preferredJobTypes" | "preferredCategories", val: string) => {
    setForm((f) => {
      const arr = f[key] as string[];
      return { ...f, [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] };
    });
  };

  // Handle logo file selection
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

  // Step 1 → Step 2 → (employer) Step 3 logo → my activity
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload: any = {
        name: form.name, email: form.email, password: form.password,
        role, city: form.city, region: form.region,
      };
      if (role === "job_seeker") {
        payload.currentJobTitle     = form.currentJobTitle;
        payload.experienceLevel     = form.experienceLevel;
        payload.linkedinUrl         = form.linkedinUrl;
        payload.portfolioUrl        = form.portfolioUrl;
        payload.skills              = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
        payload.preferredJobTypes   = form.preferredJobTypes;
        payload.preferredCategories = form.preferredCategories;
      } else {
        payload.companyName        = form.companyName;
        payload.companySize        = form.companySize;
        payload.industrySector     = form.industrySector;
        payload.companyWebsite     = form.companyWebsite;
        payload.companyDescription = form.companyDescription;
        payload.contactPhone       = form.contactPhone;
      }

      const res  = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }

      // Sign in immediately after register
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      setRegisteredUserId(data.user?.id ?? "ok");

      if (role === "employer") {
        // Go to logo upload step before landing on My Activity
        setStep(3);
        setLoading(false);
      } else {
        router.push("/my-activity");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // Upload logo then go to My Activity
  const handleLogoUpload = async (skip = false) => {
    if (skip || !logoFile) { router.push("/my-activity"); return; }
    setLogoUploading(true);
    setLogoError("");
    try {
      const fd = new FormData();
      fd.append("logo", logoFile);
      const res = await fetch("/api/upload/logo", { method: "POST", body: fd });
      if (!res.ok) {
        const d = await res.json();
        setLogoError(d.error ?? "Upload failed");
        setLogoUploading(false);
        return;
      }
      router.push("/my-activity");
    } catch {
      setLogoError("Upload failed. You can add a logo later from your profile.");
      setLogoUploading(false);
    }
  };

  return (
    <div className="card p-7 w-full max-w-lg mx-auto">
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-1">Create your account</h1>
      <p className="text-sm text-gray-500 mb-5">Join CamOpport — Cameroon&apos;s opportunity platform</p>

      {/* Step 3 — Logo upload (employer only, shown after account is created) */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ImageIcon size={28} className="text-primary-600" />
            </div>
            <h2 className="text-lg font-display font-bold text-gray-900 mb-1">Add your company logo</h2>
            <p className="text-sm text-gray-500">Help candidates recognise your brand. You can skip this and add it later.</p>
          </div>

          {/* Drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
              logoPreview ? "border-primary-400 bg-primary-50" : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
            }`}
          >
            {logoPreview ? (
              <>
                <img src={logoPreview} alt="Logo preview" className="h-24 w-auto object-contain rounded-xl mb-2" />
                <p className="text-xs text-gray-500">{logoFile?.name}</p>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); removeLogo(); }}
                  className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                >
                  <X size={12} />
                </button>
              </>
            ) : (
              <>
                <Upload size={28} className="text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700">Click to upload your logo</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP, SVG · Max 2 MB</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml"
              onChange={handleLogoChange}
              className="hidden"
            />
          </div>

          {logoError && <p className="text-red-600 text-sm">{logoError}</p>}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => handleLogoUpload(true)}
              disabled={logoUploading}
            >
              Skip for now
            </Button>
            <Button
              type="button"
              className="flex-1"
              isLoading={logoUploading}
              onClick={() => handleLogoUpload(false)}
              disabled={!logoFile || logoUploading}
            >
              Upload & Continue
            </Button>
          </div>
          <p className="text-center text-xs text-gray-400">You can always update your logo from your profile settings.</p>
        </div>
      )}

      {/* Steps 1 & 2 — Registration form */}
      {step !== 3 && (
        <>
          <Button
            type="button"
            variant="secondary"
            className="w-full flex items-center justify-center gap-2 mb-5"
            onClick={() => { setGoogleLoading(true); signIn("google", { callbackUrl: "/auth/post-signin" }); }}
            isLoading={googleLoading}
          >
            <GoogleIcon /> Continue with Google
          </Button>

          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">or sign up with email</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {([
              { value: "job_seeker", label: "Job Seeker", icon: "🔍", desc: "Find jobs, competitions & grow your career" },
              { value: "employer",   label: "Employer",   icon: "🏢", desc: "Post jobs, run competitions & find talent" },
            ] as const).map(({ value, label, icon, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => { setRole(value); setStep(1); }}
                className={`rounded-xl border-2 p-4 text-left transition-all ${
                  role === value
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-2xl">{icon}</span>
                <p className="font-semibold text-sm text-gray-900 mt-1">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1 — Common fields */}
            {step === 1 && (
              <>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Basic Information</p>
                <Input label="Full Name" type="text" value={form.name} onChange={set("name")}
                  placeholder={role === "employer" ? "Contact person name" : "Jean-Pierre Mbarga"}
                  leftIcon={<User size={16} />} required />
                <Input label="Email Address" type="email" value={form.email} onChange={set("email")}
                  placeholder="you@example.com" leftIcon={<Mail size={16} />} required />
                <Input label="Password" type="password" value={form.password} onChange={set("password")}
                  placeholder="Min. 6 characters" leftIcon={<Lock size={16} />} required />
                <div className="grid grid-cols-2 gap-3">
                  <Select label="City" value={form.city} onChange={set("city")} placeholder="Select city"
                    options={CAMEROON_CITIES.map((c) => ({ value: c, label: c }))} />
                  <Select label="Region" value={form.region} onChange={set("region")} placeholder="Select region"
                    options={CAMEROON_REGIONS.map((r) => ({ value: r, label: r }))} />
                </div>
                <Button type="button" className="w-full" onClick={() => setStep(2)}>
                  Continue →
                </Button>
              </>
            )}

            {/* Step 2 — Job seeker fields */}
            {step === 2 && role === "job_seeker" && (
              <>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Career Profile</p>
                <Input label="Current / Most Recent Job Title" type="text" value={form.currentJobTitle}
                  onChange={set("currentJobTitle")} placeholder="e.g. Software Engineer"
                  leftIcon={<Briefcase size={16} />} />
                <Select label="Experience Level" value={form.experienceLevel} onChange={set("experienceLevel")}
                  placeholder="Select level"
                  options={EXPERIENCE_LEVELS.map((l) => ({ value: l.value, label: l.label }))} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills <span className="text-gray-400">(comma-separated)</span></label>
                  <input
                    type="text"
                    value={form.skills}
                    onChange={set("skills")}
                    placeholder="e.g. Python, Marketing, Excel"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Job Types</label>
                  <div className="flex flex-wrap gap-2">
                    {JOB_TYPES.map((t) => (
                      <button key={t} type="button"
                        onClick={() => toggleMulti("preferredJobTypes", t)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                          form.preferredJobTypes.includes(t)
                            ? "bg-primary-600 text-white border-primary-600"
                            : "border-gray-300 text-gray-600 hover:border-primary-400"
                        }`}>{t.replace("-", " ")}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Categories of Interest</label>
                  <div className="flex flex-wrap gap-2">
                    {JOB_CATEGORIES.map((c) => (
                      <button key={c} type="button"
                        onClick={() => toggleMulti("preferredCategories", c)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                          form.preferredCategories.includes(c)
                            ? "bg-primary-600 text-white border-primary-600"
                            : "border-gray-300 text-gray-600 hover:border-primary-400"
                        }`}>{c}</button>
                    ))}
                  </div>
                </div>
                <Input label="LinkedIn Profile URL" type="url" value={form.linkedinUrl}
                  onChange={set("linkedinUrl")} placeholder="https://linkedin.com/in/yourprofile"
                  leftIcon={<Linkedin size={16} />} />
                <Input label="Portfolio / GitHub URL" type="url" value={form.portfolioUrl}
                  onChange={set("portfolioUrl")} placeholder="https://yourportfolio.com"
                  leftIcon={<Globe size={16} />} />
                <div className="flex gap-3">
                  <Button type="button" variant="secondary" className="flex-1" onClick={() => setStep(1)}>← Back</Button>
                  {error && <p className="text-red-600 text-sm col-span-2">{error}</p>}
                  <Button type="submit" className="flex-1" isLoading={loading}>Create Account</Button>
                </div>
              </>
            )}

            {/* Step 2 — Employer fields */}
            {step === 2 && role === "employer" && (
              <>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Company Information</p>
                <Input label="Company Name" type="text" value={form.companyName} onChange={set("companyName")}
                  placeholder="e.g. Afriland First Bank" leftIcon={<Building2 size={16} />} required />
                <Select label="Industry Sector" value={form.industrySector} onChange={set("industrySector")}
                  placeholder="Select sector"
                  options={INDUSTRY_SECTORS.map((s) => ({ value: s.value, label: s.label }))} />
                <Select label="Company Size" value={form.companySize} onChange={set("companySize")}
                  placeholder="Select size"
                  options={COMPANY_SIZES.map((s) => ({ value: s.value, label: s.label }))} />
                <Input label="Company Website" type="url" value={form.companyWebsite} onChange={set("companyWebsite")}
                  placeholder="https://yourcompany.cm" leftIcon={<Globe size={16} />} />
                <Input label="Contact Phone" type="tel" value={form.contactPhone} onChange={set("contactPhone")}
                  placeholder="+237 6XX XXX XXX" leftIcon={<Phone size={16} />} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
                  <textarea
                    value={form.companyDescription}
                    onChange={set("companyDescription")}
                    placeholder="Brief description of your company, mission, and what you do..."
                    rows={3}
                    className="input w-full resize-none"
                  />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <div className="flex gap-3">
                  <Button type="button" variant="secondary" className="flex-1" onClick={() => setStep(1)}>← Back</Button>
                  <Button type="submit" className="flex-1" isLoading={loading}>
                    Next: Add Logo →
                  </Button>
                </div>
              </>
            )}
          </form>
        </>
      )}

      {step !== 3 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary-600 font-semibold hover:underline">Sign In</Link>
        </div>
      )}
    </div>
  );
}