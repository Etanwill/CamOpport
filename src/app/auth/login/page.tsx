"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { Input, Button } from "@/components/ui";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.71v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.61z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.9v2.33A9 9 0 009 18z"/>
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 013.68 9c0-.59.1-1.17.27-1.7V4.97H.9A9 9 0 000 9c0 1.45.35 2.83.9 4.03l3.05-2.33z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.9 4.97l3.05 2.33C4.66 5.17 6.65 3.58 9 3.58z"/>
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("jp@example.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.ok) {
      router.push("/my-activity");
    } else {
      setError("Invalid email or password");
    }
    setLoading(false);
  };

  const handleGoogle = () => {
    setGoogleLoading(true);
    signIn("google", { callbackUrl: "/auth/post-signin" });
  };

  return (
    <div className="card p-7">
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-1">Welcome back!</h1>
      <p className="text-sm text-gray-500 mb-6">Sign in to your CamOpport account</p>

      <Button
        type="button"
        variant="secondary"
        className="w-full flex items-center justify-center gap-2 mb-5"
        onClick={handleGoogle}
        isLoading={googleLoading}
      >
        <GoogleIcon /> Continue with Google
      </Button>

      <div className="flex items-center gap-3 mb-5">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">or sign in with email</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="bg-primary-50 border border-primary-100 rounded-xl p-3 mb-5 text-sm text-primary-700">
        <strong>Demo:</strong> Email is pre-filled. Password: <strong>demo123</strong>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} leftIcon={<Mail size={16} />} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} leftIcon={<Lock size={16} />} required />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button type="submit" className="w-full" isLoading={loading}>Sign In</Button>
      </form>
      <div className="mt-5 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-primary-600 font-semibold hover:underline">Join Free</Link>
      </div>
    </div>
  );
}