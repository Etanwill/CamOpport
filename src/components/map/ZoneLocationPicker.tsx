// src/components/map/ZoneLocationPicker.tsx
"use client";

import { useState } from "react";
import { MapPin, Loader, CheckCircle, AlertCircle } from "lucide-react";

interface ZoneLocationPickerProps {
  zone: string;
  city: string;
  region: string;
  latitude:  number | null;
  longitude: number | null;
  onChange: (data: { zone: string; latitude: number | null; longitude: number | null }) => void;
}

// Lets an employer type the specific neighbourhood/landmark where their
// company or venue is (e.g. "Bonapriso, near Total station") and resolve it
// to real coordinates via OpenStreetMap. Those coordinates are what let the
// job/competition detail page's map drop a precise pin and draw an actual
// road route from a job seeker's current location, instead of only falling
// back to the city's center point.
export default function ZoneLocationPicker({
  zone, city, region, latitude, longitude, onChange,
}: ZoneLocationPickerProps) {
  const [locating, setLocating] = useState(false);
  const [error,    setError]    = useState("");
  const located = latitude != null && longitude != null;

  const handleLocate = async () => {
    if (!zone.trim()) { setError("Enter a zone or landmark first."); return; }
    setLocating(true); setError("");
    try {
      const query = [zone, city, region, "Cameroon"].filter(Boolean).join(", ");
      const res  = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn't find that location.");
        onChange({ zone, latitude: null, longitude: null });
        return;
      }
      onChange({ zone, latitude: data.latitude, longitude: data.longitude });
    } catch {
      setError("Something went wrong while locating that zone.");
    } finally {
      setLocating(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Zone / Specific Location <span className="text-gray-400">(optional but recommended)</span>
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={zone}
          onChange={(e) => { onChange({ zone: e.target.value, latitude: null, longitude: null }); setError(""); }}
          placeholder="e.g. Bonapriso, near Total station"
          className="input flex-1"
        />
        <button
          type="button"
          onClick={handleLocate}
          disabled={locating}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          {locating ? <Loader size={14} className="animate-spin" /> : <MapPin size={14} />}
          Locate
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-1">
        This pinpoints your venue on the map so job seekers can get real directions to it.
      </p>
      {located && (
        <p className="flex items-center gap-1.5 text-xs text-green-600 mt-1.5">
          <CheckCircle size={13} /> Location found — the map will use this exact pin.
        </p>
      )}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-600 mt-1.5">
          <AlertCircle size={13} /> {error}
        </p>
      )}
    </div>
  );
}