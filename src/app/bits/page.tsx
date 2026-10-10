// src/app/bits/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, ArrowLeft, History } from "lucide-react";
import { Button } from "@/components/ui";
import BitPackagePicker from "@/components/ui/BitPackagePicker";
import { BIT_PACKAGES } from "@/lib/bits";

export default function BuyBitsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [bits,         setBits]         = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [packageId,    setPackageId]    = useState(BIT_PACKAGES[1]?.id ?? BIT_PACKAGES[0].id);
  const [buying,       setBuying]       = useState(false);
  const [error,        setError]        = useState("");
  const [success,      setSuccess]      = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && session?.user?.role !== "job_seeker") router.push("/my-activity");
  }, [status, session, router]);

  const loadBits = async () => {
    const res = await fetch("/api/bits");
    if (res.ok) {
      const data = await res.json();
      setBits(data.bits);
      setTransactions(data.transactions ?? []);
    }
  };

  useEffect(() => { if (status === "authenticated") loadBits(); }, [status]);

  const handlePurchase = async () => {
    setBuying(true); setError(""); setSuccess(false);
    try {
      const res = await fetch("/api/bits/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Purchase failed"); setBuying(false); return; }
      setBits(data.bits);
      setSuccess(true);
      await loadBits();
    } catch {
      setError("Something went wrong.");
    } finally {
      setBuying(false);
    }
  };

  if (status === "loading" || !session) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8 w-full flex-1">
        <Link href="/my-activity" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={14} /> Back to My Activity
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-2">
            <Zap className="text-amber-500" size={24} /> Buy Bits
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Bits are what you spend to apply for jobs. You got {" "}
            <span className="font-semibold">20 free bits</span> when you joined — top up here whenever you run low.
          </p>
        </div>

        <div className="card p-5 mb-6 flex items-center justify-between bg-amber-50 border border-amber-100">
          <div>
            <p className="text-xs text-amber-700 font-medium uppercase tracking-wide">Current Balance</p>
            <p className="text-3xl font-extrabold text-amber-800 flex items-center gap-2">
              <Zap size={22} className="text-amber-500" /> {bits ?? "…"} bits
            </p>
          </div>
        </div>

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 mb-4 text-sm font-medium">
            ✅ Bits added to your account!
          </div>
        )}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="card p-6 mb-6">
          <BitPackagePicker value={packageId} onChange={setPackageId} />
          <Button className="w-full mt-4" onClick={handlePurchase} isLoading={buying}>
            Buy Bits
          </Button>
        </div>

        {transactions.length > 0 && (
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <History size={16} /> Recent Activity
            </h2>
            <div className="space-y-2">
              {transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-sm border-b border-gray-50 pb-2 last:border-0">
                  <div>
                    <p className="text-gray-700">{t.description}</p>
                    <p className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`font-semibold ${t.amount > 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {t.amount > 0 ? "+" : ""}{t.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}