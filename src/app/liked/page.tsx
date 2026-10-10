// src/app/liked/page.tsx
// Liked opportunities now live inside the "Liked" tab on My Activity.
// This route is kept so old links/bookmarks still land somewhere useful.
import { redirect } from "next/navigation";

export default function LikedRedirectPage() {
  redirect("/my-activity?tab=liked");
}