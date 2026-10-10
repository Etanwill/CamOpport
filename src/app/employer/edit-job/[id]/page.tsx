// src/app/employer/edit-job/[id]/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Input, Select } from "@/components/ui";
import BitsCostPicker from "@/components/ui/BitsCostPicker";
import ZoneLocationPicker from "@/components/map/ZoneLocationPicker";
import { CAMEROON_CITIES, CAMEROON_REGIONS } from "@/lib/data";
import { Briefcase, ArrowLeft, Loader2 } from "lucide-react";

const JOB_TYPES   = ["full-time","part-time","contract","one-day","gig","internship"];
const JOB_CATS    = ["technology","marketing","finance","agriculture","transport","healthcare","education","hospitality","creative","admin","manual","other"];
const SAL_PERIODS = ["hour","day","month","project"];

export default function EditJobPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");
  const [notFound, setNotFound] = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [bitsCost, setBitsCost] = useState(5);

  const [form, setForm] = useState({
    title: "", description: "", category: "", type: "",
    city: "", region: "", salaryMin: "", salaryMax: "", salaryPeriod: "month",
    isRemote: false, deadline: "", tags: "", requirements: "",
    zone: "", isActive: true,
  });
  const [zoneCoords, setZoneCoords] = useState<{ latitude: number | null; longitude: number | null }>({
    latitude: null, longitude: null,
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && session?.user?.role !== "employer") router.push("/dashboard");
  }, [status, session, router]);

  useEffect(() => {
    if (status !== "authenticated" || !id) return;
    (async () => {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        const data = await res.json();
        if (!res.ok || !data.job) { setNotFound(true); setLoading(false); return; }
        const job = data.job;

        // Ownership check on the client too — the API enforces it server-side,
        // but there's no reason to even render the edit form for someone else's job.
        if (job.postedById !== session?.user?.id) { setNotFound(true); setLoading(false); return; }

        setForm({
          title:        job.title ?? "",
          description:  job.description ?? "",
          category:     job.category ?? "",
          type:         job.type ?? "",
          city:         job.city ?? "",
          region:       job.region ?? "",
          salaryMin:    String(job.salaryMin ?? ""),
          salaryMax:    String(job.salaryMax ?? ""),
          salaryPeriod: job.salaryPeriod ?? "month",
          isRemote:     !!job.isRemote,
          deadline:     job.deadline ? new Date(job.deadline).toISOString().slice(0, 10) : "",
          tags:         (job.tags ?? []).join(", "),
          requirements: (job.requirements ?? []).join("\n"),
          zone:         job.zone ?? "",
          isActive:     job.isActive ?? true,
        });
        setZoneCoords({ latitude: job.latitude ?? null, longitude: job.longitude ?? null });
        setBitsCost(job.bitsCost ?? 5);
      } catch {
        setNotFound(true);
      }
      setLoading(false);
    })();
  }, [status, id, session?.user?.id]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          bitsCost,
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
      setTimeout(() => router.push("/employer/dashboard"), 1500);
    } catch {
      setError("Something went wrong."); setSaving(false);
    }
  };

  if (status === "loading" || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 size={28} className="animate-spin text-primary-500" />
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3 px-4 text-center">
      <p className="text-lg font-semibold text-gray-700">Job not found</p>
      <p className="text-sm text-gray-500">It may have been removed, or it doesn't belong to your account.</p>
      <Link href="/employer/dashboard" className="text-sm text-primary-600 font-medium hover:underline">← Back to My Postings</Link>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 w-full flex-1">
        <Link href="/employer/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={14} /> Back to My Postings
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="text-primary-600" size={24} /> Edit Job
          </h1>
          <p className="text-sm text-gray-500 mt-1">Update your listing — changes go live immediately.</p>
        </div>

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 mb-4 text-sm font-medium">
            ✅ Job updated! Redirecting…
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <input type="checkbox" id="isActive" checked={form.isActive}
                onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                className="w-4 h-4 rounded text-primary-600" />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Listing is active <span className="text-gray-400">(uncheck to close applications without deleting)</span>
              </label>
            </div>
          </div>

          <div className="card p-6">
            <BitsCostPicker value={bitsCost} onChange={setBitsCost} />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" className="w-full" isLoading={saving}>
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}