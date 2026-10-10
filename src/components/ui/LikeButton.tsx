// src/components/ui/LikeButton.tsx
"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  targetType: "job" | "competition";
  targetId: string;
  className?: string;
  /** "icon" = compact pill with count, "full" = wide button */
  variant?: "icon" | "full";
}

/**
 * LikeButton — heart button that toggles a like on a job or competition.
 * Shows the current like count. Redirects to login if unauthenticated.
 */
export default function LikeButton({
  targetType,
  targetId,
  className,
  variant = "icon",
}: LikeButtonProps) {
  const { data: session } = useSession();
  const router            = useRouter();
  const [liked,   setLiked]   = useState(false);
  const [count,   setCount]   = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch initial state
  useEffect(() => {
    if (!targetId) return;
    fetch(`/api/likes?targetType=${targetType}&targetId=${targetId}`)
      .then(r => r.json())
      .then(data => {
        setLiked(data.liked  ?? false);
        setCount(data.count  ?? 0);
      })
      .catch(() => {});
  }, [targetType, targetId, session?.user?.id]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session?.user) { router.push("/auth/login"); return; }
    if (loading) return;

    // Optimistic update
    const wasLiked = liked;
    setLiked(!wasLiked);
    setCount(c => wasLiked ? c - 1 : c + 1);
    setLoading(true);

    try {
      const res  = await fetch("/api/likes", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ targetType, targetId }),
      });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setCount(data.count);
      } else {
        // Revert on error
        setLiked(wasLiked);
        setCount(c => wasLiked ? c + 1 : c - 1);
      }
    } catch {
      setLiked(wasLiked);
      setCount(c => wasLiked ? c + 1 : c - 1);
    }
    setLoading(false);
  };

  if (variant === "full") {
    return (
      <button
        onClick={toggle}
        disabled={loading}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all",
          liked
            ? "bg-red-50 text-red-600 hover:bg-red-100"
            : "text-gray-500 hover:text-red-500 hover:bg-red-50",
          className
        )}
      >
        <Heart
          size={15}
          className={cn("transition-all", liked && "fill-red-500 text-red-500")}
        />
        {liked ? "Liked" : "Like"}
        {count > 0 && <span className="text-xs opacity-70">({count})</span>}
      </button>
    );
  }

  // Icon pill variant (default)
  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={liked ? "Unlike" : "Like"}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
        liked
          ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
          : "bg-white text-gray-500 border-gray-200 hover:text-red-500 hover:border-red-200 hover:bg-red-50",
        loading && "opacity-60",
        className
      )}
    >
      <Heart
        size={14}
        className={cn("transition-all", liked && "fill-red-500 text-red-500")}
      />
      <span>{count > 0 ? count : liked ? "1" : "Like"}</span>
    </button>
  );
}