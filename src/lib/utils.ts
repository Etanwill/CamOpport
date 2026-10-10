import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatXAF(amount: number): string {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M XAF`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K XAF`;
  return `${amount.toLocaleString()} XAF`;
}

export function formatSalary(salary: { min: number; max: number; currency: string; period: string }): string {
  const { min, max, period } = salary;
  const periodLabel = period === "month" ? "/mois" : period === "day" ? "/jour" : period === "hour" ? "/heure" : "";
  if (min === max) return `${formatXAF(min)}${periodLabel}`;
  return `${formatXAF(min)} – ${formatXAF(max)}${periodLabel}`;
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 2592000)}mo ago`;
}

export function daysUntil(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.max(0, Math.ceil((date.getTime() - now.getTime()) / 86400000));
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "active": return "bg-green-100 text-green-700";
    case "upcoming": return "bg-blue-100 text-blue-700";
    case "ended": return "bg-gray-100 text-gray-600";
    default: return "bg-gray-100 text-gray-600";
  }
}

export function getJobTypeColor(type: string): string {
  switch (type) {
    case "full-time": return "bg-purple-100 text-purple-700";
    case "part-time": return "bg-blue-100 text-blue-700";
    case "contract": return "bg-orange-100 text-orange-700";
    case "one-day": return "bg-red-100 text-red-700";
    case "gig": return "bg-yellow-100 text-yellow-700";
    case "internship": return "bg-teal-100 text-teal-700";
    default: return "bg-gray-100 text-gray-600";
  }
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "beginner": return "bg-green-100 text-green-700";
    case "intermediate": return "bg-yellow-100 text-yellow-700";
    case "advanced": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-600";
  }
}
