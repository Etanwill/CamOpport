// src/components/messaging/MessageButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageButtonProps {
  jobId: string;
  /** Only needed when an employer is messaging a specific applicant */
  jobSeekerId?: string;
  label?: string;
  className?: string;
  variant?: "full" | "compact";
}

/**
 * MessageButton — gets or creates the chat conversation for a job (+ job seeker)
 * and navigates to the thread. Used on the job detail page (job seeker → employer)
 * and the applicants page (employer → applicant).
 */
export default function MessageButton({
  jobId,
  jobSeekerId,
  label = "Message",
  className,
  variant = "full",
}: MessageButtonProps) {
  const router = useRouter();
  const [loading, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const openConversation = async () => {
    if (loading) return;
    setError(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/conversations", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ jobId, jobSeekerId }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error || "Couldn't start chat"); setError(false); return; }
      router.push(`/messages/${data.conversation.id}`);
    } catch {
      setErrorMsg("Couldn't start chat");
      setError(false);
    }
  };

  if (variant === "compact") {
    return (
      <button
        onClick={openConversation}
        disabled={loading}
        title={errorMsg || label}
        className={cn(
          "flex items-center gap-1.5 text-xs bg-primary-50 border border-primary-200 text-primary-700 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60",
          className
        )}
      >
        <MessageCircle size={12} /> {loading ? "Opening…" : label}
      </button>
    );
  }

  return (
    <div className={className}>
      <button
        onClick={openConversation}
        disabled={loading}
        className="w-full py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-60"
      >
        <MessageCircle size={16} />
        {loading ? "Opening chat…" : label}
      </button>
      {errorMsg && <p className="text-xs text-red-500 mt-1.5 text-center">{errorMsg}</p>}
    </div>
  );
}