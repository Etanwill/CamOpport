// src/app/saved/page.tsx
// Saved opportunities now live inside the "Saved" tab on My Activity.
// This route is kept so old links/bookmarks still land somewhere useful.
import { redirect } from "next/navigation";

export default function SavedRedirectPage() {
  redirect("/my-activity?tab=saved");
}