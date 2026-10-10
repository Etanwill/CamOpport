// src/lib/plans.ts

export type ListingPlan = "starter" | "standard" | "featured";

export interface Plan {
  id:            ListingPlan;
  name:          string;
  price:         number;          // XAF
  durationDays:  number;          // how long listing stays live
  badge:         string;
  color:         string;
  bgColor:       string;
  borderColor:   string;
  features:      string[];
  highlight?:    boolean;         // "Most Popular" tag
}

export const LISTING_PLANS: Plan[] = [
  {
    id:           "starter",
    name:         "Starter",
    price:        0,
    durationDays: 7,
    badge:        "🆓",
    color:        "text-gray-700",
    bgColor:      "bg-gray-50",
    borderColor:  "border-gray-200",
    features: [
      "Listed for 7 days",
      "Standard visibility",
      "Basic applicant tracking",
      "Up to 20 applications",
    ],
  },
  {
    id:           "standard",
    name:         "Standard",
    price:        5000,
    durationDays: 30,
    badge:        "⭐",
    color:        "text-blue-700",
    bgColor:      "bg-blue-50",
    borderColor:  "border-blue-300",
    highlight:    true,
    features: [
      "Listed for 30 days",
      "Higher search ranking",
      "Full applicant tracking",
      "Unlimited applications",
      "Email notifications",
    ],
  },
  {
    id:           "featured",
    name:         "Featured",
    price:        15000,
    durationDays: 60,
    badge:        "🔥",
    color:        "text-purple-700",
    bgColor:      "bg-purple-50",
    borderColor:  "border-purple-300",
    features: [
      "Listed for 60 days",
      "🔝 Top of search results",
      "Featured badge on listing",
      "Unlimited applications",
      "Priority email notifications",
      "Promoted on homepage",
      "Social media boost",
    ],
  },
];

export function getPlan(id: ListingPlan): Plan {
  return LISTING_PLANS.find(p => p.id === id) ?? LISTING_PLANS[0];
}

export function calcPlanExpiry(plan: ListingPlan): Date {
  const days = getPlan(plan).durationDays;
  const d    = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export function isPlanActive(planExpiresAt: Date | string | null): boolean {
  if (!planExpiresAt) return false;
  return new Date(planExpiresAt) > new Date();
}

export function formatXAFPrice(price: number): string {
  return price === 0 ? "Free" : `${price.toLocaleString()} XAF`;
}