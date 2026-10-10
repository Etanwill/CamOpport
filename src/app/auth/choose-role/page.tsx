// src/app/auth/choose-role/page.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Building2, Search, Loader2 } from "lucide-react";
import { Input, Button } from "@/components/ui";

type Role = "job_seeker" | "employer";

export default function ChooseRolePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [role, setRole]               = useState<Role | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/auth/login");
    // Already chosen — nothing to do here.
    if (status === "authenticated" && session?.user?.roleSelected) router.replace("/my-activity");
  }, [status, session?.user?.roleSelected, router]);

  const handleContinue = async () => {
    if (!role) return;
    if (role === "employer" && !companyName.trim()) {
      setError("Please enter your company name");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, companyName: role === "employer" ? companyName.trim() : undefined }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong"); setLoading(false); return; }

      // Refresh the JWT/session so roleSelected + role are up to date app-wide.
      await update();
      router.push("/my-activity");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (status === "loading" || (status === "authenticated" && session?.user?.roleSelected)) {
    return (
      <div className="card p-7 flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="card p-7">
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-1">
        Welcome to CamOpport! 👋
      </h1>
      <p className="text-sm text-gray-500 mb-6">One last thing — how will you use CamOpport?</p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {([
          { value: "job_seeker", label: "Job Seeker", icon: Search,    desc: "Find jobs, competitions & grow your career" },
          { value: "employer",   label: "Employer",    icon: Building2, desc: "Post jobs, run competitions & find talent" },
        ] as const).map(({ value, label, icon: Icon, desc }) => (
          <button
            key={value}
            type="button"
            onClick={() => { setRole(value); setError(""); }}
            className={`rounded-xl border-2 p-4 text-left transition-all ${
              role === value
                ? "border-primary-500 bg-primary-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${
              role === value ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-500"
            }`}>
              <Icon size={16} />
            </div>
            <p className="font-semibold text-sm text-gray-900">{label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
          </button>
        ))}
      </div>

      {role === "employer" && (
        <div className="mb-5">
          <Input
            label="Company Name"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Afriland First Bank"
            leftIcon={<Building2 size={16} />}
            required
          />
          <p className="text-xs text-gray-400 mt-1.5">You can add your logo and more details later from your profile.</p>
        </div>
      )}

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <Button className="w-full" disabled={!role} isLoading={loading} onClick={handleContinue}>
        Continue
      </Button>
    </div>
  );
}