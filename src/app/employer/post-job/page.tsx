// src/app/employer/post-job/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Input, Select } from "@/components/ui";
import BitsCostPicker from "@/components/ui/BitsCostPicker";
import ZoneLocationPicker from "@/components/map/ZoneLocationPicker";
import { CAMEROON_CITIES, CAMEROON_REGIONS } from "@/lib/data";
import { Briefcase } from "lucide-react";
import { suggestedBitsCost } from "@/lib/bits";

const JOB_TYPES   = ["full-time","part-time","contract","one-day","gig","internship"];
const JOB_CATS    = ["technology","marketing","finance","agriculture","transport","healthcare","education","hospitality","creative","admin","manual","other"];
const SAL_PERIODS = ["hour","day","month","project"];

export default function PostJobPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);
  const [bitsCost, setBitsCost] = useState(5);
  const [bitsCostTouched, setBitsCostTouched] = useState(false);

  const [form, setForm] = useState({
    title: "", description: "", category: "", type: "",
    city: "", region: "", salaryMin: "", salaryMax: "", salaryPeriod: "month",
    isRemote: false, deadline: "", tags: "", requirements: "",
    zone: "",
  });
  const [zoneCoords, setZoneCoords] = useState<{ latitude: number | null; longitude: number | null }>({
    latitude: null, longitude: null,
  });

  // Once the employer picks a job type, suggest a sensible bits cost unless
  // they've already customised it themselves.
  useEffect(() => {
    if (form.type && !bitsCostTouched) setBitsCost(suggestedBitsCost(form.type));
  }, [form.type, bitsCostTouched]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && session?.user?.role !== "employer") router.push("/dashboard");
  }, [status, session, router]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          bitsCost,
          company:      (session?.user as any)?.companyName || session?.user?.name,
          salaryMin:    Number(form.salaryMin),
          salaryMax:    Number(form.salaryMax),
          deadline:     new Date(form.deadline),
          requirements: form.requirements.split("\n").map(s => s.trim()).filter(Boolean),
          tags:         form.tags.split(",").map(s => s.trim()).filter(Boolean),
          zone:         form.isRemote ? null : (form.zone || null),
          latitude:     form.isRemote ? null : zoneCoords.latitude,
          longitude:    form.isRemote ? null : zoneCoords.longitude,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setSaving(false); return; }
      setSuccess(true);
      setTimeout(() => router.push("/employer/dashboard"), 2000);
    } catch {
      setError("Something went wrong."); setSaving(false);
    }
  };

  if (status === "loading") return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 w-full flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="text-primary-600" size={24} /> Post a Job
          </h1>
          <p className="text-sm text-gray-500 mt-1">Posting is free — just fill in the details and set the bits cost to apply.</p>
        </div>

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 mb-4 text-sm font-medium">
            ✅ Job posted successfully — it's live now, free of charge! Redirecting…
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Details card */}
          <div className="card p-6 space-y-5">
            <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide text-gray-400">Job Details</h2>
            <Input label="Job Title" value={form.title} onChange={set("title")} placeholder="e.g. Senior Software Engineer" required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description <span className="text-red-500">*</span></label>
              <textarea value={form.description} onChange={set("description")} rows={5} required
                placeholder="Describe the role, responsibilities, and what a great candidate looks like…"
                className="input w-full resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Requirements <span className="text-gray-400">(one per line)</span></label>
              <textarea value={form.requirements} onChange={set("requirements")} rows={4}
                placeholder={"Bachelor's degree in CS\n3+ years React experience\nStrong communication skills"}
                className="input w-full resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Category" value={form.category} onChange={set("category")} required
                placeholder="Select category"
                options={JOB_CATS.map(c => ({ value: c, label: c.charAt(0).toUpperCase()+c.slice(1) }))} />
              <Select label="Job Type" value={form.type} onChange={set("type")} required
                placeholder="Select type"
                options={JOB_TYPES.map(t => ({ value: t, label: t.replace("-"," ") }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label="City" value={form.city} onChange={set("city")} required
                placeholder="Select city"
                options={CAMEROON_CITIES.map(c => ({ value: c, label: c }))} />
              <Select label="Region" value={form.region} onChange={set("region")} required
                placeholder="Select region"
                options={CAMEROON_REGIONS.map(r => ({ value: r, label: r }))} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input label="Salary Min (XAF)" type="number" value={form.salaryMin} onChange={set("salaryMin")} placeholder="50000" required />
              <Input label="Salary Max (XAF)" type="number" value={form.salaryMax} onChange={set("salaryMax")} placeholder="200000" required />
              <Select label="Period" value={form.salaryPeriod} onChange={set("salaryPeriod")}
                options={SAL_PERIODS.map(p => ({ value: p, label: p }))} />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="isRemote" checked={form.isRemote}
                onChange={e => setForm(f => ({ ...f, isRemote: e.target.checked }))}
                className="w-4 h-4 rounded text-primary-600" />
              <label htmlFor="isRemote" className="text-sm text-gray-700">This position is remote / hybrid</label>
            </div>
            {!form.isRemote && (
              <ZoneLocationPicker
                zone={form.zone}
                city={form.city}
                region={form.region}
                latitude={zoneCoords.latitude}
                longitude={zoneCoords.longitude}
                onChange={({ zone, latitude, longitude }) => {
                  setForm(f => ({ ...f, zone }));
                  setZoneCoords({ latitude, longitude });
                }}
              />
            )}
            <Input label="Application Deadline" type="date" value={form.deadline} onChange={set("deadline")} required />
            <Input label="Tags" value={form.tags} onChange={set("tags")} placeholder="React, Node.js, Remote-friendly" />
          </div>

          {/* Bits Cost card */}
          <div className="card p-6">
            <BitsCostPicker value={bitsCost} onChange={(b) => { setBitsCost(b); setBitsCostTouched(true); }} />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" className="w-full" isLoading={saving}>
            Post Job — Free
          </Button>
        </form>
      </div>
</div>
  );
}