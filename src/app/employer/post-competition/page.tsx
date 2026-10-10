// src/app/employer/post-competition/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Input, Select } from "@/components/ui";
import ZoneLocationPicker from "@/components/map/ZoneLocationPicker";
import { CAMEROON_CITIES, CAMEROON_REGIONS } from "@/lib/data";
import { Trophy } from "lucide-react";

const COMP_TYPES  = ["hackathon","case-study","coding","business","creative","quiz"];
const COMP_STATUS = ["upcoming","active"];

export default function PostCompetitionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: "", description: "", type: "", status: "upcoming",
    startDate: "", endDate: "", registrationDeadline: "",
    maxTeamSize: "1", minTeamSize: "1",
    eligibility: "", tags: "",
    city: "", region: "", isOnline: false, zone: "",
    prize1Label: "1st Place", prize1Amount: "",
    prize2Label: "2nd Place", prize2Amount: "",
    prize3Label: "3rd Place", prize3Amount: "",
  });
  const [zoneCoords, setZoneCoords] = useState<{ latitude: number | null; longitude: number | null }>({
    latitude: null, longitude: null,
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && session?.user?.role !== "employer") router.push("/my-activity");
  }, [status, session, router]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    const prizes = [
      form.prize1Amount && { rank: 1, label: form.prize1Label, amount: Number(form.prize1Amount) },
      form.prize2Amount && { rank: 2, label: form.prize2Label, amount: Number(form.prize2Amount) },
      form.prize3Amount && { rank: 3, label: form.prize3Label, amount: Number(form.prize3Amount) },
    ].filter(Boolean);
    try {
      const res = await fetch("/api/competitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:                form.title,
          organizer:            (session?.user as any)?.companyName || session?.user?.name,
          description:          form.description,
          type:                 form.type,
          status:               form.status,
          startDate:            new Date(form.startDate),
          endDate:              new Date(form.endDate),
          registrationDeadline: new Date(form.registrationDeadline),
          maxTeamSize:          Number(form.maxTeamSize),
          minTeamSize:          Number(form.minTeamSize),
          eligibility:          form.eligibility,
          tags:                 form.tags.split(",").map(s => s.trim()).filter(Boolean),
          city:                 form.city || undefined,
          region:               form.region || undefined,
          isOnline:             form.isOnline,
          zone:                 form.isOnline ? null : (form.zone || null),
          latitude:             form.isOnline ? null : zoneCoords.latitude,
          longitude:            form.isOnline ? null : zoneCoords.longitude,
          prizes,
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
            <Trophy className="text-blue-600" size={24} /> Post a Competition
          </h1>
          <p className="text-sm text-gray-500 mt-1">Engage talent through hackathons, challenges & more.</p>
        </div>

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 mb-4 text-sm font-medium">
            ✅ Competition posted! Redirecting…
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Competition Details */}
          <div className="card p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Competition Details</h2>
            <Input label="Competition Title" value={form.title} onChange={set("title")} required
              placeholder="e.g. FinTech Cameroon Hackathon 2025" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
              <textarea value={form.description} onChange={set("description")} rows={4} required
                placeholder="Describe the competition, theme, and goals…"
                className="input w-full resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Type" value={form.type} onChange={set("type")} required placeholder="Select type"
                options={COMP_TYPES.map(t => ({ value: t, label: t.replace("-"," ") }))} />
              <Select label="Status" value={form.status} onChange={set("status")}
                options={COMP_STATUS.map(s => ({ value: s, label: s }))} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input label="Start Date"    type="date" value={form.startDate}            onChange={set("startDate")} required />
              <Input label="End Date"      type="date" value={form.endDate}              onChange={set("endDate")} required />
              <Input label="Reg. Deadline" type="date" value={form.registrationDeadline} onChange={set("registrationDeadline")} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Min Team Size" type="number" value={form.minTeamSize} onChange={set("minTeamSize")} />
              <Input label="Max Team Size" type="number" value={form.maxTeamSize} onChange={set("maxTeamSize")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prizes (XAF)</label>
              <div className="space-y-3">
                {([1,2,3] as const).map(rank => (
                  <div key={rank} className="flex gap-3 items-center">
                    <span className="text-lg">{rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}</span>
                    <Input label="" value={(form as any)[`prize${rank}Label`]}
                      onChange={set(`prize${rank}Label`)} placeholder={`${rank === 1 ? "1st" : rank === 2 ? "2nd" : "3rd"} Place`} />
                    <Input label="" type="number" value={(form as any)[`prize${rank}Amount`]}
                      onChange={set(`prize${rank}Amount`)} placeholder="Amount in XAF" />
                  </div>
                ))}
              </div>
            </div>
            <Input label="Eligibility" value={form.eligibility} onChange={set("eligibility")}
              placeholder="e.g. Open to all Cameroonians aged 18–35" />
            <div className="flex items-center gap-3">
              <input type="checkbox" id="isOnline" checked={form.isOnline}
                onChange={e => setForm(f => ({ ...f, isOnline: e.target.checked }))}
                className="w-4 h-4 rounded text-primary-600" />
              <label htmlFor="isOnline" className="text-sm text-gray-700">Online / Virtual competition</label>
            </div>
            {!form.isOnline && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Select label="City" value={form.city} onChange={set("city")} placeholder="Select city"
                    options={CAMEROON_CITIES.map(c => ({ value: c, label: c }))} />
                  <Select label="Region" value={form.region} onChange={set("region")} placeholder="Select region"
                    options={CAMEROON_REGIONS.map(r => ({ value: r, label: r }))} />
                </div>
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
              </>
            )}
            <Input label="Tags" value={form.tags} onChange={set("tags")} placeholder="fintech, AI, open-source" />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" className="w-full" isLoading={saving}>
            Post Competition
          </Button>
        </form>
      </div>
</div>
  );
}