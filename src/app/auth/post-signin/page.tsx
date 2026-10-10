// src/app/auth/post-signin/page.tsx
// Neutral landing spot for OAuth callbacks. We don't know yet whether this is
// a first-time Google sign-in (needs role selection) until the session loads,
// so we park here briefly and then route accordingly.
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function PostSignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") { router.replace("/auth/login"); return; }
    if (status !== "authenticated" || !session?.user) return;
    router.replace(session.user.roleSelected ? "/my-activity" : "/auth/choose-role");
  }, [status, session, router]);

  return (
    <div className="card p-7 flex items-center justify-center py-16">
      <Loader2 size={24} className="animate-spin text-primary-600" />
    </div>
  );
}