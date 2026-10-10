// src/lib/bits.ts
//
// "Bits" are the currency job seekers spend to apply to jobs. Posting a job
// is free for employers; instead, every new job seeker account starts with
// a free balance of bits, and can buy more once they run out.

export const SIGNUP_FREE_BITS = 20;

// Suggested bits cost employers can choose from when posting a job. Casual
// gigs/one-day jobs default lower (low barrier), formal roles default higher.
export const DEFAULT_BITS_COST: Record<string, number> = {
  "gig":         2,
  "one-day":     2,
  "part-time":   4,
  "internship":  4,
  "contract":    6,
  "full-time":   6,
};

export const BITS_COST_OPTIONS = [1, 2, 3, 5, 8, 10, 15] as const;

export function suggestedBitsCost(jobType: string): number {
  return DEFAULT_BITS_COST[jobType] ?? 5;
}

export interface BitPackage {
  id:         string;
  name:       string;
  bits:       number;
  price:      number;   // XAF
  badge:      string;
  bestValue?: boolean;
}

export const BIT_PACKAGES: BitPackage[] = [
  {
    id:    "starter",
    name:  "Starter Pack",
    bits:  20,
    price: 500,
    badge: "✨",
  },
  {
    id:        "popular",
    name:      "Popular Pack",
    bits:      60,
    price:     1200,
    badge:     "🔥",
    bestValue: true,
  },
  {
    id:    "power",
    name:  "Power Pack",
    bits:  150,
    price: 2500,
    badge: "⚡",
  },
  {
    id:    "unlimited",
    name:  "Mega Pack",
    bits:  400,
    price: 5000,
    badge: "🚀",
  },
];

export function getBitPackage(id: string): BitPackage | undefined {
  return BIT_PACKAGES.find(p => p.id === id);
}

export function formatXAFPrice(price: number): string {
  return price === 0 ? "Free" : `${price.toLocaleString()} XAF`;
}