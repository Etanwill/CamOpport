// src/components/ui/BitPackagePicker.tsx
"use client";

import { BIT_PACKAGES, BitPackage, formatXAFPrice } from "@/lib/bits";
import { CheckCircle, Zap } from "lucide-react";

interface BitPackagePickerProps {
  value:    string;
  onChange: (packageId: string) => void;
}

export default function BitPackagePicker({ value, onChange }: BitPackagePickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Choose a Bits Package <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {BIT_PACKAGES.map((pkg: BitPackage) => {
          const selected = value === pkg.id;
          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => onChange(pkg.id)}
              className={`relative rounded-2xl border-2 p-4 text-left transition-all hover:shadow-md ${
                selected
                  ? "border-amber-300 bg-amber-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {pkg.bestValue && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-0.5 rounded-full whitespace-nowrap">
                  Best Value
                </span>
              )}

              {selected && (
                <div className="absolute top-3 right-3">
                  <CheckCircle size={18} className="text-amber-600" />
                </div>
              )}

              <div className="mb-3">
                <span className="text-2xl">{pkg.badge}</span>
              </div>

              <p className={`font-bold text-base ${selected ? "text-amber-700" : "text-gray-900"}`}>
                {pkg.name}
              </p>
              <p className="flex items-center gap-1 text-lg font-extrabold text-gray-900 mt-0.5">
                <Zap size={16} className="text-amber-500" /> {pkg.bits} bits
              </p>
              <p className="text-sm text-gray-500 mt-1">{formatXAFPrice(pkg.price)}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700">
        💳 <strong>Payment:</strong> MTN MoMo and Orange Money accepted. Your bits are credited to your account as soon as payment is confirmed.
      </div>
    </div>
  );
}