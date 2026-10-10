// src/app/messages/[id]/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Briefcase, Zap, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

interface ConversationDetail {
  conversation: { id: string; jobId: string; jobSeekerId: string; employerId: string };
  job: { id: string; title: string; company: string; type: string } | null;
  otherUser: { id: string; name: string; companyLogo?: string | null; companyName?: string | null; avatar?: string | null } | null;
  isEmployer: boolean;
}

const CASUAL_TYPES = ["gig", "one-day"];

function Avatar({ name, logoUrl, size = 40 }: { name?: string | null; logoUrl?: string | null; size?: number }) {
  const dim = { width: size, height: size };
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name ?? "avatar"}
        style={dim}
        className="rounded-full object-cover border border-gray-100 bg-white flex-shrink-0"
      />
    );
  }
  return (
    <div
      style={dim}
      className="rounded-full bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 flex items-center justify-center font-bold flex-shrink-0"
    >
      {name?.charAt(0)?.toUpperCase() ?? "?"}
    </div>
  );
}

export default function ConversationThreadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const conversationId = params.id as string;

  const [detail, setDetail]     = useState<ConversationDetail | null>(null);
  const [msgs, setMsgs]         = useState<Message[]>([]);
  const [loading, setLoading]   = useState(true);
  const [draft, setDraft]       = useState("");
  const [sending, setSending]   = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  // Initial load of conversation header
  useEffect(() => {
    if (status !== "authenticated" || !conversationId) return;
    fetch(`/api/conversations/${conversationId}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setDetail(data))
      .catch(() => setDetail(null));
  }, [status, conversationId]);

  // Poll messages
  useEffect(() => {
    if (status !== "authenticated" || !conversationId) return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/conversations/${conversationId}/messages`);
        if (res.ok && !cancelled) {
          const data = await res.json();
          setMsgs(data.items ?? []);
        } else if (res.status === 403 || res.status === 404) {
          if (!cancelled) setErrorMsg("You don't have access to this conversation.");
        }
      } catch { /* silent */ }
      if (!cancelled) setLoading(false);
    };
    load();
    const interval = setInterval(load, 4_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [status, conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    setDraft("");
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ body: text }),
      });
      if (res.ok) {
        const data = await res.json();
        setMsgs(prev => [...prev, data.message]);
      } else {
        setDraft(text); // restore draft on failure
      }
    } catch {
      setDraft(text);
    }
    setSending(false);
  };

  if (status === "loading" || loading) return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-50/40 via-gray-50 to-gray-50">
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
</div>
  );

  if (errorMsg || !detail) return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-50/40 via-gray-50 to-gray-50">
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <MessageCircle size={36} className="text-gray-300" />
        <p className="text-gray-500">{errorMsg || "Conversation not found."}</p>
        <Link href="/messages" className="text-primary-600 hover:underline text-sm">← Back to Messages</Link>
      </div>
</div>
  );

  const isCasual = CASUAL_TYPES.includes(detail.job?.type ?? "");
  const myId = session?.user?.id;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-50/40 via-gray-50 to-gray-50">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col px-4 py-6">

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-4">
          <Link href="/messages" className="text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0">
            <ArrowLeft size={20} />
          </Link>
          <Avatar name={detail.otherUser?.name} logoUrl={detail.otherUser?.companyLogo ?? detail.otherUser?.avatar} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{detail.otherUser?.name ?? "Unknown"}</p>
            {detail.job && (
              <Link href={`/jobs/${detail.job.id}`} className="text-xs text-gray-500 hover:text-primary-600 flex items-center gap-1 truncate">
                {isCasual ? <Zap size={10} className="text-orange-500 flex-shrink-0" /> : <Briefcase size={10} className="flex-shrink-0" />}
                {detail.job.title} · {detail.job.company}
              </Link>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pb-4">
          {msgs.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mx-auto mb-3">
                <MessageCircle size={22} className="text-primary-600" />
              </div>
              <p className="text-sm">Say hello 👋 — discuss availability, hours, or next steps.</p>
            </div>
          ) : (
            msgs.map(m => {
              const isMe = m.senderId === myId;
              return (
                <div key={m.id} className={cn("flex message-in", isMe ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2 text-sm whitespace-pre-line break-words",
                    isMe
                      ? "bg-primary-600 text-white rounded-br-sm"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                  )}>
                    {m.body}
                    <p className={cn("text-[10px] mt-1", isMe ? "text-primary-100" : "text-gray-400")}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Composer */}
        <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-gray-200 pt-4">
          <input
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="Type a message…"
            maxLength={4000}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          <button
            type="submit"
            disabled={!draft.trim() || sending}
            className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-colors flex-shrink-0"
            aria-label="Send message"
          >
            <Send size={17} />
          </button>
        </form>
      </div>
</div>
  );
}