// src/components/engagement/EngagementTabs.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Star, MessageSquare, HelpCircle, ThumbsUp, Trash2,
  Send, CheckCircle, ChevronDown, ChevronUp, Lock, BadgeCheck
} from "lucide-react";

interface Props {
  targetType: "job" | "competition";
  targetId:   string;
  ownerId?:   string; // employer who posted it — can answer FAQs
}

// ── Star Rating ───────────────────────────────────────────────────────────────
function StarRating({ value, onChange, readonly = false }: {
  value: number; onChange?: (v: number) => void; readonly?: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" disabled={readonly}
          onClick={() => onChange?.(n)}
          onMouseEnter={() => !readonly && setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className={`transition-colors ${readonly ? "cursor-default" : "cursor-pointer"}`}>
          <Star size={readonly ? 14 : 22}
            className={`transition-colors ${
              n <= (hovered || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`} />
        </button>
      ))}
    </div>
  );
}

// ── Review Stats Bar ──────────────────────────────────────────────────────────
function ReviewStats({ stats }: { stats: any }) {
  if (!stats || stats.count === 0) return null;
  return (
    <div className="flex items-center gap-6 p-4 bg-yellow-50 border border-yellow-100 rounded-2xl mb-5">
      <div className="text-center flex-shrink-0">
        <p className="text-4xl font-extrabold text-gray-900">{stats.avg.toFixed(1)}</p>
        <StarRating value={Math.round(stats.avg)} readonly />
        <p className="text-xs text-gray-500 mt-1">{stats.count} review{stats.count !== 1 ? "s" : ""}</p>
      </div>
      <div className="flex-1 space-y-1.5">
        {[5,4,3,2,1].map(star => {
          const count = stats.breakdown[star] ?? 0;
          const pct   = stats.count > 0 ? Math.round((count / stats.count) * 100) : 0;
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-3">{star}</span>
              <Star size={10} className="fill-yellow-400 text-yellow-400 flex-shrink-0" />
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ name, role }: { name: string; role?: string }) {
  const isEmployer = role === "employer";
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
      isEmployer ? "bg-emerald-100 text-emerald-700" : "bg-primary-100 text-primary-700"
    }`}>
      {name?.charAt(0)?.toUpperCase()}
    </div>
  );
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function EngagementTabs({ targetType, targetId, ownerId }: Props) {
  const { data: session } = useSession();
  const [tab, setTab] = useState<"reviews" | "faq" | "discussion">("discussion");

  // Reviews state
  const [reviewList,   setReviewList]   = useState<any[]>([]);
  const [reviewStats,  setReviewStats]  = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle,  setReviewTitle]  = useState("");
  const [reviewBody,   setReviewBody]   = useState("");
  const [reviewLoading,setReviewLoading]= useState(false);
  const [reviewError,  setReviewError]  = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  // FAQ state
  const [faqList,    setFaqList]    = useState<any[]>([]);
  const [faqQ,       setFaqQ]       = useState("");
  const [faqLoading, setFaqLoading] = useState(false);
  const [expandedFaq,setExpandedFaq]= useState<string | null>(null);
  const [answerInputs, setAnswerInputs] = useState<Record<string, string>>({});

  // Discussion state
  const [discList,    setDiscList]    = useState<any[]>([]);
  const [discBody,    setDiscBody]    = useState("");
  const [replyTo,     setReplyTo]     = useState<string | null>(null);
  const [replyBody,   setReplyBody]   = useState("");
  const [discLoading, setDiscLoading] = useState(false);

  const isOwner = session?.user?.id === ownerId;

  const fetchAll = useCallback(async () => {
    const qs = `targetType=${targetType}&targetId=${targetId}`;
    const [rRes, fRes, dRes] = await Promise.all([
      fetch(`/api/reviews?${qs}`),
      fetch(`/api/faqs?${qs}`),
      fetch(`/api/discussions?${qs}`),
    ]);
    const [rData, fData, dData] = await Promise.all([rRes.json(), fRes.json(), dRes.json()]);
    setReviewList(rData.reviews ?? []);
    setReviewStats(rData.stats ?? null);
    setFaqList(fData.faqs ?? []);
    setDiscList(dData.discussions ?? []);
  }, [targetType, targetId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Submit review ──
  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewRating) { setReviewError("Please select a star rating."); return; }
    if (!reviewBody.trim()) { setReviewError("Please write your review."); return; }
    setReviewLoading(true); setReviewError("");
    const res  = await fetch("/api/reviews", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType, targetId, rating: reviewRating, title: reviewTitle, body: reviewBody }),
    });
    const data = await res.json();
    if (!res.ok) { setReviewError(data.error); setReviewLoading(false); return; }
    setReviewList(prev => [{ review: data.review, user: { name: session?.user?.name, role: session?.user?.role, id: session?.user?.id } }, ...prev]);
    setReviewStats((prev: any) => prev
      ? { ...prev, count: prev.count + 1, avg: Math.round(((prev.avg * prev.count + reviewRating) / (prev.count + 1)) * 10) / 10 }
      : { avg: reviewRating, count: 1, breakdown: { 1:0,2:0,3:0,4:0,5:0, [reviewRating]: 1 } }
    );
    setReviewRating(0); setReviewTitle(""); setReviewBody(""); setShowReviewForm(false);
    setReviewLoading(false);
  };

  const deleteReview = async (id: string) => {
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    setReviewList(prev => prev.filter(r => r.review.id !== id));
  };

  // ── Submit FAQ ──
  const submitFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQ.trim()) return;
    setFaqLoading(true);
    const res  = await fetch("/api/faqs", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType, targetId, question: faqQ }),
    });
    const data = await res.json();
    if (res.ok) {
      setFaqList(prev => [...prev, { faq: data.faq, askedBy: { name: session?.user?.name } }]);
      setFaqQ("");
    }
    setFaqLoading(false);
  };

  const submitAnswer = async (faqId: string) => {
    const answer = answerInputs[faqId]?.trim();
    if (!answer) return;
    const res = await fetch(`/api/faqs/${faqId}/answer`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    });
    if (res.ok) {
      setFaqList(prev => prev.map(f =>
        f.faq.id === faqId ? { ...f, faq: { ...f.faq, answer, answeredAt: new Date().toISOString() } } : f
      ));
      setAnswerInputs(prev => ({ ...prev, [faqId]: "" }));
    }
  };

  const deleteFaq = async (id: string, askedById: string) => {
    if (session?.user?.id !== askedById) return;
    await fetch(`/api/faqs/${id}`, { method: "DELETE" });
    setFaqList(prev => prev.filter(f => f.faq.id !== id));
  };

  // ── Submit discussion ──
  const submitDisc = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    const body = parentId ? replyBody : discBody;
    if (!body.trim()) return;
    setDiscLoading(true);
    const res  = await fetch("/api/discussions", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType, targetId, body, parentId }),
    });
    const data = await res.json();
    if (res.ok) {
      setDiscList(prev => [...prev, { discussion: data.discussion, user: { name: session?.user?.name, role: session?.user?.role, id: session?.user?.id } }]);
      if (parentId) { setReplyBody(""); setReplyTo(null); } else setDiscBody("");
    }
    setDiscLoading(false);
  };

  const likeDisc = async (id: string) => {
    await fetch(`/api/discussions/${id}/like`, { method: "POST" });
    setDiscList(prev => prev.map(d =>
      d.discussion.id === id ? { ...d, discussion: { ...d.discussion, likes: (d.discussion.likes ?? 0) + 1 } } : d
    ));
  };

  const deleteDisc = async (id: string) => {
    await fetch(`/api/discussions/${id}`, { method: "DELETE" });
    setDiscList(prev => prev.filter(d => d.discussion.id !== id));
  };

  // Organise discussions into threads
  const topLevel = discList.filter(d => !d.discussion.parentId);
  const replies  = discList.filter(d =>  d.discussion.parentId);

  const tabCounts = {
    reviews:    reviewList.length,
    faq:        faqList.length,
    discussion: discList.length,
  };

  return (
    <div className="mt-6">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-gray-200 mb-5">
        {([
          { key: "discussion", label: "Discussion",  icon: MessageSquare },
          { key: "faq",        label: "FAQ",          icon: HelpCircle    },
          { key: "reviews",    label: "Reviews",      icon: Star          },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === key ? "border-primary-600 text-primary-700" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            <Icon size={15} /> {label}
            {tabCounts[key] > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                tab === key ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-500"
              }`}>{tabCounts[key]}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── DISCUSSION TAB ── */}
      {tab === "discussion" && (
        <div className="space-y-4">
          {/* Post box */}
          {session ? (
            <form onSubmit={e => submitDisc(e)} className="card p-4">
              <div className="flex gap-3">
                <Avatar name={session.user?.name ?? "?"} role={session.user?.role} />
                <div className="flex-1">
                  <textarea value={discBody} onChange={e => setDiscBody(e.target.value)} rows={2}
                    placeholder="Share a thought, ask a question, or start a discussion…"
                    className="input w-full resize-none text-sm" />
                  <div className="flex justify-end mt-2">
                    <button type="submit" disabled={!discBody.trim() || discLoading}
                      className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl disabled:opacity-40 transition-colors">
                      <Send size={13} /> Post
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="card p-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
              <Lock size={14} /> Sign in to join the discussion
            </div>
          )}

          {/* Thread list */}
          {topLevel.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-6">No comments yet. Be the first!</p>
          ) : topLevel.map(({ discussion: d, user: u }) => {
            const threadReplies = replies.filter(r => r.discussion.parentId === d.id);
            return (
              <div key={d.id} className="card p-4">
                <div className="flex gap-3">
                  <Avatar name={u.name} role={u.role} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">{u.name}</span>
                      {u.role === "employer" && (
                        <span className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">🏢 Employer</span>
                      )}
                      <span className="text-xs text-gray-400">{timeAgo(d.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{d.body}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => likeDisc(d.id)}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary-600 transition-colors">
                        <ThumbsUp size={12} /> {d.likes > 0 && d.likes}
                      </button>
                      {session && (
                        <button onClick={() => setReplyTo(replyTo === d.id ? null : d.id)}
                          className="text-xs text-gray-400 hover:text-primary-600 transition-colors">
                          Reply
                        </button>
                      )}
                      {session?.user?.id === u.id && (
                        <button onClick={() => deleteDisc(d.id)}
                          className="text-xs text-red-400 hover:text-red-600 transition-colors ml-auto">
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>

                    {/* Replies */}
                    {threadReplies.length > 0 && (
                      <div className="mt-3 pl-3 border-l-2 border-gray-100 space-y-3">
                        {threadReplies.map(({ discussion: r, user: ru }) => (
                          <div key={r.id} className="flex gap-2">
                            <Avatar name={ru.name} role={ru.role} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs font-semibold text-gray-900">{ru.name}</span>
                                {ru.role === "employer" && (
                                  <span className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">🏢</span>
                                )}
                                <span className="text-xs text-gray-400">{timeAgo(r.createdAt)}</span>
                              </div>
                              <p className="text-sm text-gray-700">{r.body}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <button onClick={() => likeDisc(r.id)}
                                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary-600 transition-colors">
                                  <ThumbsUp size={11} /> {r.likes > 0 && r.likes}
                                </button>
                                {session?.user?.id === ru.id && (
                                  <button onClick={() => deleteDisc(r.id)}
                                    className="text-xs text-red-400 hover:text-red-600 transition-colors ml-auto">
                                    <Trash2 size={11} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply box */}
                    {replyTo === d.id && (
                      <form onSubmit={e => submitDisc(e, d.id)} className="mt-3 pl-3 border-l-2 border-primary-200">
                        <div className="flex gap-2">
                          <Avatar name={session?.user?.name ?? "?"} role={session?.user?.role} />
                          <div className="flex-1">
                            <textarea value={replyBody} onChange={e => setReplyBody(e.target.value)} rows={2}
                              placeholder={`Replying to ${u.name}…`}
                              className="input w-full resize-none text-sm" autoFocus />
                            <div className="flex gap-2 justify-end mt-1.5">
                              <button type="button" onClick={() => setReplyTo(null)}
                                className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                                Cancel
                              </button>
                              <button type="submit" disabled={!replyBody.trim()}
                                className="flex items-center gap-1 text-xs text-white bg-primary-600 hover:bg-primary-700 px-3 py-1.5 rounded-lg disabled:opacity-40 transition-colors">
                                <Send size={11} /> Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── FAQ TAB ── */}
      {tab === "faq" && (
        <div className="space-y-4">
          {/* Ask box */}
          {session ? (
            <form onSubmit={submitFaq} className="card p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ask a question</label>
              <div className="flex gap-2">
                <input value={faqQ} onChange={e => setFaqQ(e.target.value)}
                  placeholder="e.g. Is relocation assistance provided? Can I apply remotely?"
                  className="input flex-1 text-sm" />
                <button type="submit" disabled={!faqQ.trim() || faqLoading}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl disabled:opacity-40 transition-colors whitespace-nowrap">
                  <Send size={13} /> Ask
                </button>
              </div>
            </form>
          ) : (
            <div className="card p-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
              <Lock size={14} /> Sign in to ask a question
            </div>
          )}

          {faqList.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-6">No questions yet. Ask the first one!</p>
          ) : faqList.map(({ faq: f, askedBy }) => (
            <div key={f.id} className="card overflow-hidden">
              <button onClick={() => setExpandedFaq(expandedFaq === f.id ? null : f.id)}
                className="w-full p-4 flex items-start gap-3 text-left hover:bg-gray-50 transition-colors">
                <HelpCircle size={17} className={f.answer ? "text-emerald-500" : "text-gray-300"} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{f.question}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Asked by {askedBy?.name ?? "Anonymous"} · {timeAgo(f.createdAt)}
                    {f.answer && <span className="ml-2 text-emerald-600 font-medium">✓ Answered</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {session?.user?.id === f.askedById && (
                    <button onClick={e => { e.stopPropagation(); deleteFaq(f.id, f.askedById); }}
                      className="text-red-400 hover:text-red-600 p-1 rounded transition-colors">
                      <Trash2 size={13} />
                    </button>
                  )}
                  {expandedFaq === f.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </div>
              </button>

              {expandedFaq === f.id && (
                <div className="border-t border-gray-50 bg-gray-50 p-4">
                  {f.answer ? (
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 text-xs font-bold">A</div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-xs font-semibold text-emerald-700">Official Answer</span>
                          <BadgeCheck size={12} className="text-emerald-500" />
                          <span className="text-xs text-gray-400">{f.answeredAt ? timeAgo(f.answeredAt) : ""}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{f.answer}</p>
                      </div>
                    </div>
                  ) : isOwner ? (
                    <div className="flex gap-2">
                      <input value={answerInputs[f.id] ?? ""} onChange={e => setAnswerInputs(p => ({ ...p, [f.id]: e.target.value }))}
                        placeholder="Write an official answer…"
                        className="input flex-1 text-sm" />
                      <button onClick={() => submitAnswer(f.id)} disabled={!answerInputs[f.id]?.trim()}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl disabled:opacity-40 transition-colors">
                        <CheckCircle size={13} /> Answer
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Waiting for an official answer from the employer…</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── REVIEWS TAB ── */}
      {tab === "reviews" && (
        <div className="space-y-4">
          <ReviewStats stats={reviewStats} />

          {/* Write review */}
          {session ? (
            showReviewForm ? (
              <form onSubmit={submitReview} className="card p-5 space-y-4">
                <h3 className="font-semibold text-gray-900 text-sm">Write a Review</h3>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Rating <span className="text-red-500">*</span></label>
                  <StarRating value={reviewRating} onChange={setReviewRating} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                  <input value={reviewTitle} onChange={e => setReviewTitle(e.target.value)}
                    placeholder="Summarize your experience in one line"
                    className="input w-full text-sm" maxLength={150} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Review <span className="text-red-500">*</span></label>
                  <textarea value={reviewBody} onChange={e => setReviewBody(e.target.value)} rows={4}
                    placeholder="Share your honest experience — what was good, what could improve?"
                    className="input w-full resize-none text-sm" />
                </div>
                {reviewError && <p className="text-xs text-red-500">{reviewError}</p>}
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={reviewLoading}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl disabled:opacity-40 transition-colors">
                    <Star size={13} /> Submit Review
                  </button>
                </div>
              </form>
            ) : (
              <button onClick={() => setShowReviewForm(true)}
                className="w-full card p-4 flex items-center justify-center gap-2 text-sm text-primary-600 font-medium hover:bg-primary-50 transition-colors border-dashed border-2 border-primary-200">
                <Star size={15} /> Write a Review
              </button>
            )
          ) : (
            <div className="card p-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
              <Lock size={14} /> Sign in to write a review
            </div>
          )}

          {/* Review list */}
          {reviewList.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-6">No reviews yet. Be the first to review!</p>
          ) : reviewList.map(({ review: r, user: u }) => (
            <div key={r.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <Avatar name={u.name} role={u.role} />
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-gray-900">{u.name}</span>
                      {r.isVerified && (
                        <span className="flex items-center gap-0.5 text-xs text-emerald-600 font-medium">
                          <BadgeCheck size={12} /> Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <StarRating value={r.rating} readonly />
                      <span className="text-xs text-gray-400">{timeAgo(r.createdAt)}</span>
                    </div>
                  </div>
                </div>
                {session?.user?.id === u.id && (
                  <button onClick={() => deleteReview(r.id)}
                    className="text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              {r.title && <p className="font-semibold text-gray-900 mt-3 text-sm">{r.title}</p>}
              <p className="text-sm text-gray-700 mt-1 leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}