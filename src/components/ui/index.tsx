"use client";

import { cn } from "@/lib/utils";
import { getAvatarUrl } from "@/lib/avatar";
import { ReactNode } from "react";

// Badge
interface BadgeProps { children: ReactNode; className?: string; variant?: "default" | "success" | "warning" | "danger" | "info" | "purple"; }
export function Badge({ children, className, variant = "default" }: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    purple: "bg-primary-100 text-primary-700",
  };
  return (
    <span className={cn("badge", variants[variant], className)}>{children}</span>
  );
}

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}
export function Button({ children, variant = "primary", size = "md", isLoading, className, disabled, ...props }: ButtonProps) {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
    danger: "bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors",
  };
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3 text-base" };
  return (
    <button
      className={cn(variants[variant], size !== "md" && sizes[size], className, (disabled || isLoading) && "opacity-60 cursor-not-allowed")}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />{children}</span> : children}
    </button>
  );
}

// Card
interface CardProps { children: ReactNode; className?: string; onClick?: () => void; }
export function Card({ children, className, onClick }: CardProps) {
  return (
    <div className={cn("card p-5", onClick && "cursor-pointer", className)} onClick={onClick}>
      {children}
    </div>
  );
}

// Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; leftIcon?: ReactNode; }
export function Input({ label, error, leftIcon, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <div className="relative">
        {leftIcon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{leftIcon}</span>}
        <input className={cn("input", leftIcon && "pl-10", error && "border-red-300 focus:ring-red-500", className)} {...props} />
      </div>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}

// Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { label?: string; options: { value: string; label: string }[]; placeholder?: string; }
export function Select({ label, options, placeholder, className, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <select className={cn("input appearance-none bg-white", className)} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// Stat Card
interface StatCardProps { label: string; value: string | number; icon: ReactNode; color?: string; }
export function StatCard({ label, value, icon, color = "purple" }: StatCardProps) {
  const colors: Record<string, string> = {
    purple: "bg-primary-50 text-primary-600",
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colors[color] || colors.purple)}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

// Empty State
interface EmptyStateProps { title: string; description: string; icon?: ReactNode; action?: ReactNode; }
export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      {icon && <div className="flex justify-center mb-4 text-gray-300">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-sm text-gray-400 mb-4">{description}</p>
      {action}
    </div>
  );
}

// Progress Bar
interface ProgressBarProps { value: number; max?: number; color?: string; }
export function ProgressBar({ value, max = 100, color = "bg-primary-500" }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div className={cn("h-full rounded-full transition-all duration-500", color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

// Avatar
interface AvatarProps { name: string; src?: string; seed?: string; size?: "sm" | "md" | "lg" | "xl"; }
export function Avatar({ name, src, seed, size = "md" }: AvatarProps) {
  const sizes = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-12 h-12 text-base", xl: "w-16 h-16 text-xl" };
  const imgSrc = src || getAvatarUrl(seed || name);
  return (
    <div className={cn("rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center flex-shrink-0 overflow-hidden", sizes[size])}>
      <img src={imgSrc} alt={name} className="w-full h-full object-cover" />
    </div>
  );
}

// Loading spinner
export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-4 h-4", md: "w-7 h-7", lg: "w-10 h-10" };
  return (
    <div className={cn("border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin", sizes[size])} />
  );
}