// src/components/ui/PlanPicker.tsx
"use client";

import { LISTING_PLANS, ListingPlan, formatXAFPrice } from "@/lib/plans";
import { CheckCircle } from "lucide-react";

interface PlanPickerProps {
  value:    ListingPlan;
  onChange: (plan: ListingPlan) => void;
}

export default function PlanPicker({ value, onChange }: PlanPickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Listing Plan <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {LISTING_PLANS.map(plan => {
          const selected = value === plan.id;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => onChange(plan.id)}
              className={`relative rounded-2xl border-2 p-4 text-left transition-all hover:shadow-md ${
                selected
                  ? `${plan.borderColor} ${plan.bgColor} shadow-md`
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {/* Most Popular badge */}
              {plan.highlight && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-0.5 rounded-full whitespace-nowrap">
                  Most Popular
                </span>
              )}

              {/* Selected checkmark */}
              {selected && (
                <div className="absolute top-3 right-3">
                  <CheckCircle size={18} className={plan.color} />
                </div>
              )}

              <div className="mb-3">
                <span className="text-2xl">{plan.badge}</span>
              </div>

              <p className={`font-bold text-base ${selected ? plan.color : "text-gray-900"}`}>
                {plan.name}
              </p>
              <p className="text-lg font-extrabold text-gray-900 mt-0.5">
                {formatXAFPrice(plan.price)}
              </p>
              <p className="text-xs text-gray-500 mb-3">Active for {plan.durationDays} days</p>

              <ul className="space-y-1.5">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                    <CheckCircle size={11} className="text-green-500 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      {/* Payment note */}
      {value !== "starter" && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700">
          💳 <strong>Payment:</strong> After submitting, you will receive payment instructions via email to activate your {value} plan. Your listing will go live once payment is confirmed (MTN MoMo / Orange Money accepted).
        </div>
      )}
    </div>
  );
}