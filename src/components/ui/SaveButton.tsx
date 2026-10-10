// src/components/ui/SaveButton.tsx
"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
  targetType: "job" | "competition";
  targetId: string;
  /** Optional extra class for the wrapping button */
  className?: string;
  /** Render as compact icon-only pill (default) or full-width button */
  variant?: "icon" | "full";
}

/**
 * SaveButton — lets job seekers bookmark a job or competition.
 * Calls POST /api/saved to toggle the saved state.
 */
export default function SaveButton({
  targetType,
  targetId,
  className,
  variant = "icon",
}: SaveButtonProps) {
  const { data: session } = useSession();
  const [saved,   setSaved]   = useState(false);
  const [loading, setLoading] = useState(false);

  // Check initial saved state
  useEffect(() => {
    if (!session?.user?.id) return;
    fetch("/api/saved")
      .then(r => r.json())
      .then((items: { targetType: string; targetId: string }[]) => {
        const isSaved = items.some(
          i => i.targetType === targetType && i.targetId === targetId
        );
        setSaved(isSaved);
      })
      .catch(() => {});
  }, [session?.user?.id, targetType, targetId]);

  // Don't render for employers or unauthenticated users
  if (!session?.user || session.user.role === "employer") return null;

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // prevent Link navigation if inside a card
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      const res  = await fetch("/api/saved", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ targetType, targetId }),
      });
      if (res.ok) {
        const data = await res.json();
        setSaved(data.saved);
      }
    } catch { /* silent */ }
    setLoading(false);
  };

  if (variant === "full") {
    return (
      <button
        onClick={toggle}
        disabled={loading}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-colors",
          saved
            ? "bg-primary-50 text-primary-700 hover:bg-primary-100"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
          className
        )}
      >
        {saved
          ? <><BookmarkCheck size={15} className="text-primary-600" /> Saved</>
          : <><Bookmark size={15} /> Save this {targetType}</>
        }
      </button>
    );
  }

  // Icon-only pill variant
  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={saved ? "Remove from saved" : `Save this ${targetType}`}
      className={cn(
        "p-2 rounded-lg transition-colors",
        saved
          ? "text-primary-600 bg-primary-50 hover:bg-primary-100"
          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
        className
      )}
    >
      {saved
        ? <BookmarkCheck size={17} />
        : <Bookmark size={17} />
      }
    </button>
  );
}