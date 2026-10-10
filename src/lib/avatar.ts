// src/lib/avatar.ts
// Deterministic, no-account-needed avatar generator (DiceBear) used whenever
// a user hasn't uploaded a real profile picture, so nobody is stuck with just
// a blank/plain initial circle.
export function getAvatarUrl(seed: string, uploadedUrl?: string | null): string {
  if (uploadedUrl) return uploadedUrl;
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed || "user")}&backgroundColor=ede9fe,ddd6fe,f5f3ff`;
}