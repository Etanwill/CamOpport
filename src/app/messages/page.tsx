// src/app/messages/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, Briefcase, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversationItem {
  conversation: { id: string; lastMessageAt: string };
  job: { id: string; title: string; company: string; type: string } | null;
  otherUser: { id: string; name: string; companyLogo?: string | null; avatar?: string | null } | null;
  lastMessage: { body: string; senderId: string; createdAt: string } | null;
  unreadCount: number;
}

const CASUAL_TYPES = ["gig", "one-day"];

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString();
}

function Avatar({ name, logoUrl, size = 44 }: { name?: string | null; logoUrl?: string | null; size?: number }) {
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

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const load = async () => {
      try {
        const res = await fetch("/api/conversations");
        if (res.ok) {
          const data = await res.json();
          setItems(data.items ?? []);
        }
      } catch { /* silent */ }
      setLoading(false);
    };
    load();
    const interval = setInterval(load, 20_000);
    return () => clearInterval(interval);
  }, [status]);

  if (status === "loading" || loading) return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-50/40 via-gray-50 to-gray-50">
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
</div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-50/40 via-gray-50 to-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8 w-full flex-1">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
            <MessageCircle className="text-primary-600" size={16} />
          </div>
          <h1 className="text-xl font-display font-bold text-gray-900">Messages</h1>
        </div>

        {items.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={26} className="text-primary-600" />
            </div>
            <p className="font-semibold text-gray-700">No conversations yet</p>
            <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">
              {session?.user?.role === "employer"
                ? "Message an applicant from your job's applicant list to start chatting."
                : "Apply to a gig or job, then message the employer directly from the job page."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map(item => {
              const isCasual = CASUAL_TYPES.includes(item.job?.type ?? "");
              const isUnread = item.unreadCount > 0;
              return (
                <Link
                  key={item.conversation.id}
                  href={`/messages/${item.conversation.id}`}
                  className={cn(
                    "card flex items-center gap-3 p-4 hover:border-primary-200 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200",
                    isUnread && "border-primary-200 bg-primary-50/30"
                  )}
                >
                  <Avatar name={item.otherUser?.name} logoUrl={item.otherUser?.companyLogo ?? item.otherUser?.avatar} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn("text-sm truncate", isUnread ? "font-bold text-gray-900" : "font-semibold text-gray-800")}>
                        {item.otherUser?.name ?? "Unknown"}
                      </p>
                      {item.lastMessage && (
                        <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo(item.lastMessage.createdAt)}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                      {isCasual ? <Zap size={10} className="text-orange-500 flex-shrink-0" /> : <Briefcase size={10} className="flex-shrink-0" />}
                      {item.job?.title ?? "Job"}
                    </p>
                    <p className={cn("text-sm truncate mt-1", isUnread ? "font-medium text-gray-800" : "text-gray-500")}>
                      {item.lastMessage?.body ?? "Say hello 👋"}
                    </p>
                  </div>
                  {isUnread && (
                    <span className="min-w-[20px] h-5 px-1.5 bg-primary-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                      {item.unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
</div>
  );
}