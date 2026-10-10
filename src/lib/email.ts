// src/lib/email.ts
//
// Thin wrapper around Resend for transactional email. Kept deliberately
// separate from the notifications logic in queries.ts so any part of the
// app can send a one-off email later (welcome emails, digests, etc.) without
// going through the notifications table.
//
// If RESEND_API_KEY isn't set (e.g. local dev without it configured), every
// call here just logs and no-ops instead of throwing — so nothing else in
// the app ever breaks because email isn't configured yet.

import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = process.env.EMAIL_FROM || "Unbound <onboarding@resend.dev>";
const APP_URL = (process.env.NEXTAUTH_URL || "http://localhost:3000").replace(/\/$/, "");

export async function sendEmail(opts: { to: string; subject: string; html: string }) {
  if (!resend) {
    console.log(`[email] RESEND_API_KEY not set — skipping email "${opts.subject}" to ${opts.to}`);
    return { skipped: true };
  }
  try {
    const result = await resend.emails.send({ from: FROM, to: opts.to, subject: opts.subject, html: opts.html });
    return result;
  } catch (err) {
    // Email failures should never break the feature that triggered them
    // (e.g. an application status change) — just log and move on.
    console.error("[email] send failed:", err);
    return { error: true };
  }
}

const NOTIFICATION_TYPE_LABEL: Record<string, string> = {
  application_update:  "Application Update",
  competition_update:  "Competition Update",
  new_job:              "New Job Match",
  new_competition:      "New Competition",
  quiz_result:          "Quiz Result",
  general:              "Notification",
};

export async function sendNotificationEmail(opts: {
  to: string;
  name: string;
  type: string;
  title: string;
  body: string;
  link?: string | null;
}) {
  const label = NOTIFICATION_TYPE_LABEL[opts.type] ?? "Notification";
  const ctaUrl = opts.link ? `${APP_URL}${opts.link.startsWith("/") ? "" : "/"}${opts.link}` : APP_URL;

  const html = `
  <div style="background:#f6f7fb;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #eef0f6;">
      <div style="background:linear-gradient(135deg,#7c3aed,#4c1d95);padding:22px 28px;">
        <span style="color:#ffffff;font-weight:700;font-size:18px;">Un<span style="color:#d8b4fe;">bound</span></span>
      </div>
      <div style="padding:28px;">
        <p style="display:inline-block;background:#f3f0ff;color:#7c3aed;font-size:12px;font-weight:600;padding:4px 10px;border-radius:999px;margin:0 0 14px;">
          ${label}
        </p>
        <h1 style="font-size:19px;color:#111827;margin:0 0 10px;">${opts.title}</h1>
        <p style="font-size:14px;line-height:1.6;color:#4b5563;margin:0 0 22px;">${opts.body}</p>
        <a href="${ctaUrl}"
           style="display:inline-block;background:#7c3aed;color:#ffffff;font-size:14px;font-weight:600;
                  padding:11px 22px;border-radius:10px;text-decoration:none;">
          View on Unbound
        </a>
      </div>
      <div style="padding:16px 28px;border-top:1px solid #f1f2f6;">
        <p style="font-size:12px;color:#9ca3af;margin:0;">
          Hi ${opts.name}, you're receiving this because you have email notifications turned on.
          You can turn them off anytime from your <a href="${APP_URL}/profile" style="color:#7c3aed;">Unbound profile</a>.
        </p>
      </div>
    </div>
  </div>`;

  return sendEmail({ to: opts.to, subject: opts.title, html });
}