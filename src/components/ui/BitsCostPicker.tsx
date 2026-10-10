// src/components/ui/BitsCostPicker.tsx
"use client";

import { BITS_COST_OPTIONS } from "@/lib/bits";
import { Zap } from "lucide-react";

interface BitsCostPickerProps {
  value:    number;
  onChange: (bits: number) => void;
}

export default function BitsCostPicker({ value, onChange }: BitsCostPickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Bits Required to Apply <span className="text-red-500">*</span>
      </label>
      <p className="text-xs text-gray-500 mb-3">
        Posting is free. Instead, job seekers spend bits to apply — a higher cost
        naturally filters for more serious applicants.
      </p>
      <div className="flex flex-wrap gap-2">
        {BITS_COST_OPTIONS.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
              value === opt
                ? "border-amber-400 bg-amber-50 text-amber-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            <Zap size={13} className={value === opt ? "text-amber-500" : "text-gray-400"} />
            {opt} {opt === 1 ? "bit" : "bits"}
          </button>
        ))}
      </div>
    </div>
  );
}