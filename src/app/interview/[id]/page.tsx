// src/app/interview/[id]/page.tsx
"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Mic, MicOff, Send, Brain, Loader2,
  RotateCcw, MessageSquare, Volume2, VolumeX,
  ChevronRight, PhoneOff, User
} from "lucide-react";

interface Message { role: "user" | "assistant"; content: string; questionNo?: number }
interface Scores  {
  scoreOverall: number; scoreClarity: number;
  scoreRelevance: number; scoreConfidence: number; feedback: string
}

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r, pct = (score / 100) * c;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="#f3f4f6" strokeWidth="6" />
          <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={`${pct} ${c}`} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-800">{score}</span>
      </div>
      <p className="text-xs text-gray-500 text-center leading-tight">{label}</p>
    </div>
  );
}

function AIAvatar({ speaking, thinking }: { speaking: boolean; thinking: boolean }) {
  return (
    <div className="relative flex flex-col items-center">
      {speaking && (
        <>
          <div className="absolute inset-0 rounded-full border-4 border-primary-400 animate-ping opacity-25 scale-110" />
          <div className="absolute inset-0 rounded-full border-2 border-primary-300 animate-ping opacity-15 scale-125" style={{ animationDelay: "200ms" }} />
        </>
      )}
      <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-2xl transition-all duration-300 ${
        thinking ? "bg-amber-900/40 border-4 border-amber-500/50" :
        speaking  ? "bg-primary-900/40 border-4 border-primary-400 scale-105" :
                    "bg-gray-700 border-4 border-gray-600"
      }`}>
        {thinking ? "🤔" : speaking ? "🎙️" : "👔"}
      </div>
      <div className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
        thinking ? "bg-amber-500/20 text-amber-400" :
        speaking  ? "bg-primary-500/20 text-primary-400" :
                    "bg-gray-700 text-gray-400"
      }`}>
        {thinking ? "Thinking…" : speaking ? "Speaking" : "Waiting"}
      </div>
    </div>
  );
}

export default function InterviewSessionPage() {
  const { id }              = useParams<{ id: string }>();
  const router               = useRouter();
  const { data: session, status } = useSession();

  const [interview,    setInterview]    = useState<any>(null);
  const [messages,     setMessages]     = useState<Message[]>([]);
  const [answer,       setAnswer]       = useState("");
  const [sending,      setSending]      = useState(false);
  const [aiThinking,   setAiThinking]   = useState(false);
  const [aiSpeaking,   setAiSpeaking]   = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [completed,    setCompleted]    = useState(false);
  const [scores,       setScores]       = useState<Scores | null>(null);
  const [currentQ,     setCurrentQ]     = useState(0);
  const [ttsEnabled,   setTtsEnabled]   = useState(true);
  const [listening,    setListening]    = useState(false);
  const [voiceSupport, setVoiceSupport] = useState(false);
  const [elapsed,      setElapsed]      = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  const recognitionRef = useRef<any>(null);
  const bottomRef      = useRef<HTMLDivElement>(null);
  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef   = useRef<number>(Date.now());
  const ttsEnabledRef  = useRef(true);

  useEffect(() => { ttsEnabledRef.current = ttsEnabled; }, [ttsEnabled]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  const speakText = useCallback((text: string) => {
    if (!text || !ttsEnabledRef.current || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const clean = String(text).replace(/\*\*/g, "").replace(/\*/g, "").replace(/`/g, "").replace(/#{1,6} /g, "").trim();
    const utt   = new SpeechSynthesisUtterance(clean);
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find(v => v.name.includes("Daniel")) ||
      voices.find(v => v.name.includes("Google UK English Male")) ||
      voices.find(v => v.lang === "en-GB") ||
      voices.find(v => v.lang.startsWith("en"));
    if (preferred) utt.voice = preferred;
    utt.rate   = 0.9;
    utt.pitch  = 0.95;
    utt.volume = 1;
    utt.onstart = () => setAiSpeaking(true);
    utt.onend   = () => setAiSpeaking(false);
    utt.onerror = () => setAiSpeaking(false);
    window.speechSynthesis.speak(utt);
  }, []);

  useEffect(() => {
    if (!id || status !== "authenticated") return;
    fetch(`/api/interview/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.interview) {
          setInterview(data.interview);
          setMessages(data.messages ?? []);
          setCurrentQ(data.interview.currentQuestion);
          if (data.interview.status === "completed") {
            setCompleted(true);
            setScores({
              scoreOverall:    data.interview.scoreOverall,
              scoreClarity:    data.interview.scoreClarity,
              scoreRelevance:  data.interview.scoreRelevance,
              scoreConfidence: data.interview.scoreConfidence,
              feedback:        data.interview.feedback,
            });
          } else {
            const lastAI = [...(data.messages ?? [])].reverse().find((m: Message) => m.role === "assistant");
            if (lastAI) setTimeout(() => speakText(lastAI.content), 1000);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, status, speakText]);

  useEffect(() => {
    if (completed) { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000)), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [completed]);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    setVoiceSupport(true);
    const rec          = new SR();
    rec.continuous     = true;
    rec.interimResults = true;
    rec.lang           = "en-US";
    rec.onresult = (e: any) => {
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join("");
      setAnswer(t);
    };
    rec.onend   = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
  }, []);

  const toggleVoice = useCallback(() => {
    if (!recognitionRef.current) return;
    window.speechSynthesis?.cancel();
    setAiSpeaking(false);
    if (listening) { recognitionRef.current.stop(); setListening(false); }
    else { setAnswer(""); recognitionRef.current.start(); setListening(true); }
  }, [listening]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, aiThinking]);

  const sendAnswer = async () => {
    const text = answer.trim();
    if (!text || sending || completed || aiThinking) return;
    if (listening) { recognitionRef.current?.stop(); setListening(false); }
    window.speechSynthesis?.cancel();
    setAiSpeaking(false);
    setSending(true);
    setAiThinking(true);
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setAnswer("");
    try {
      const res  = await fetch(`/api/interview/${id}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: text }),
      });
      const data = await res.json();
      setAiThinking(false);
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      setCurrentQ(data.currentQuestion);
      setTimeout(() => speakText(data.reply), 300);
      if (data.completed) { setCompleted(true); setScores(data.scores); }
    } catch {
      setAiThinking(false);
      setMessages(prev => [...prev, { role: "assistant", content: "I'm sorry, could you repeat that?" }]);
    }
    setSending(false);
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  // Same guard pattern as /interview: don't flash any interview content
  // before we know whether the person is signed in.
  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 size={28} className="animate-spin text-primary-500" />
    </div>
  );
  if (!session) return null;

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-4">
      <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center text-4xl animate-pulse">👔</div>
      <p className="text-gray-400 text-sm">Connecting to your interviewer…</p>
    </div>
  );

  if (!interview) return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center flex-col gap-3">
        <p className="text-gray-600">Interview not found.</p>
        <Link href="/interview" className="btn-primary text-sm">← Back</Link>
      </div>
    </div>
  );

  // ── Results ─────────────────────────────────────────────────────────────────
  if (completed && scores) {
    const sc    = scores.scoreOverall;
    const grade = sc >= 85 ? { label: "Excellent",       emoji: "🏆", bg: "from-emerald-50 to-green-50",  ring: "text-emerald-600" }
      : sc >= 70           ? { label: "Good",            emoji: "⭐", bg: "from-blue-50 to-indigo-50",    ring: "text-blue-600"    }
      : sc >= 55           ? { label: "Fair",            emoji: "📈", bg: "from-amber-50 to-yellow-50",   ring: "text-amber-600"   }
      :                      { label: "Keep Practising", emoji: "💪", bg: "from-red-50 to-rose-50",       ring: "text-red-600"     };
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-2xl mx-auto px-4 py-8 w-full">
          <div className={`card p-8 text-center mb-5 bg-gradient-to-br ${grade.bg}`}>
            <span className="text-6xl mb-3 block">{grade.emoji}</span>
            <h1 className="text-2xl font-display font-bold text-gray-900 mb-1">Interview Complete</h1>
            {interview.jobTitle && <p className="text-gray-500 text-sm mb-1">{interview.jobTitle}{interview.company ? ` at ${interview.company}` : ""}</p>}
            <p className="text-xs text-gray-400 mb-5">Duration: {formatTime(elapsed)}</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm mb-6">
              <span className={`text-2xl font-bold ${grade.ring}`}>{sc}</span>
              <span className="text-gray-400 text-sm">/ 100 · {grade.label}</span>
            </div>
            <div className="flex justify-center gap-8">
              <ScoreRing score={scores.scoreClarity}    label="Clarity"    color="#10b981" />
              <ScoreRing score={scores.scoreRelevance}  label="Relevance"  color="#f59e0b" />
              <ScoreRing score={scores.scoreConfidence} label="Confidence" color="#6366f1" />
            </div>
          </div>
          <div className="card p-5 mb-4">
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Brain size={16} className="text-primary-600" /> Interviewer Feedback
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">{scores.feedback}</p>
          </div>
          <div className="card p-5 mb-5">
            <button onClick={() => setShowTranscript(s => !s)} className="w-full flex items-center justify-between text-sm font-semibold text-gray-800">
              <span className="flex items-center gap-2"><MessageSquare size={15} className="text-gray-400" /> Interview Transcript</span>
              <ChevronRight size={15} className={`transition-transform ${showTranscript ? "rotate-90" : ""}`} />
            </button>
            {showTranscript && (
              <div className="mt-4 space-y-3 max-h-80 overflow-y-auto pr-1 border-t border-gray-100 pt-4">
                {messages.map((m, i) => (
                  <div key={i} className={`text-sm rounded-xl p-3 ${m.role === "assistant" ? "bg-primary-50 text-primary-900" : "bg-gray-100 text-gray-800"}`}>
                    <p className="text-xs font-semibold mb-1 opacity-60">{m.role === "assistant" ? "👔 Interviewer" : "👤 You"}</p>
                    <p className="leading-relaxed whitespace-pre-line">{m.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Link href="/interview" className="flex-1 btn-primary flex items-center justify-center gap-2">
              <RotateCcw size={15} /> Practice Again
            </Link>
            <Link href="/my-activity" className="flex-1 btn-ghost flex items-center justify-center gap-2">
              My Profile <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Live interview ──────────────────────────────────────────────────────────
  const progress      = Math.round((currentQ / interview.totalQuestions) * 100);
  const lastAiMessage = [...messages].reverse().find(m => m.role === "assistant")?.content ?? "";

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col text-white select-none">

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900/95 backdrop-blur border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400 font-mono">{formatTime(elapsed)}</span>
          </div>
          <span className="text-gray-700">·</span>
          <span className="text-xs text-gray-400 capitalize">{interview.interviewType} interview</span>
          <span className="text-gray-700">·</span>
          <span className="text-xs text-gray-400">Q {Math.min(currentQ + 1, interview.totalQuestions)}/{interview.totalQuestions}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setTtsEnabled(t => !t); window.speechSynthesis?.cancel(); setAiSpeaking(false); }}
            className={`p-2 rounded-lg transition-colors ${ttsEnabled ? "bg-primary-700 text-white" : "bg-gray-800 text-gray-500"}`}
            title={ttsEnabled ? "Mute" : "Unmute"}
          >
            {ttsEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
          <button onClick={() => router.push("/interview")} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-medium transition-colors">
            <PhoneOff size={13} /> End
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-0.5 bg-gray-800">
        <div className="h-full bg-primary-500 transition-all duration-700" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-5xl mx-auto w-full px-4 py-5 gap-5">

        {/* AI Interviewer panel */}
        <div className="lg:w-64 flex-shrink-0 flex flex-col gap-3">
          <div className="bg-gray-800 rounded-2xl p-5 flex flex-col items-center gap-4 border border-gray-700/50">
            <AIAvatar speaking={aiSpeaking} thinking={aiThinking} />
            <div className="text-center">
              <p className="font-semibold text-white text-sm">
                {interview.company ? `${interview.company}` : "AI Interviewer"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Senior Hiring Manager</p>
            </div>

            {/* Animated sound bars */}
            <div className="flex items-end gap-0.5 h-8">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i}
                  className={`w-1 rounded-full transition-all duration-75 ${aiSpeaking ? "bg-primary-400" : "bg-gray-600"}`}
                  style={{ height: aiSpeaking ? `${6 + Math.abs(Math.sin(i * 0.7)) * 18}px` : "4px" }}
                />
              ))}
            </div>

            {/* Current question text */}
            {lastAiMessage && !aiThinking && (
              <div className="w-full bg-gray-700/40 rounded-xl p-3 border border-gray-700/50">
                <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-5">{lastAiMessage}</p>
              </div>
            )}
          </div>

          {/* Candidate panel */}
          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700/50 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
              listening ? "bg-red-500 text-white" : "bg-primary-700 text-primary-200"
            }`}>
              {session?.user?.name?.charAt(0) ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{session?.user?.name ?? "You"}</p>
              <p className={`text-xs mt-0.5 ${listening ? "text-red-400 font-medium" : "text-gray-500"}`}>
                {listening ? "🔴 Recording…" : "Candidate"}
              </p>
            </div>
          </div>
        </div>

        {/* Chat + input */}
        <div className="flex-1 flex flex-col min-h-0">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1" style={{ maxHeight: "400px", minHeight: "280px" }}>
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-600 text-sm">Your interview will appear here…</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                  m.role === "assistant"
                    ? "bg-gray-800 text-gray-100 border border-gray-700/60 rounded-tl-sm"
                    : "bg-primary-600 text-white rounded-tr-sm"
                }`}>
                  {m.role === "assistant" && (
                    <p className="text-[10px] font-bold text-primary-400 uppercase tracking-wide mb-1.5">Interviewer</p>
                  )}
                  {m.content}
                </div>
              </div>
            ))}

            {aiThinking && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700/60 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <p className="text-[10px] font-bold text-primary-400 uppercase tracking-wide mb-1.5">Interviewer</p>
                  <div className="flex gap-1.5 items-center h-4">
                    {[0, 150, 300].map(d => (
                      <span key={d} className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700/50">
            {listening && (
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <p className="text-xs text-red-400 font-medium">Listening — speak your answer clearly</p>
              </div>
            )}
            <div className="flex gap-3 items-end">
              <textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAnswer(); } }}
                placeholder={listening ? "Your words will appear here as you speak…" : "Type your answer… or use the mic to speak"}
                rows={3}
                disabled={sending || completed || aiThinking}
                className="flex-1 resize-none rounded-xl bg-gray-700/70 border border-gray-600/50 text-gray-100 placeholder-gray-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-40 transition-colors"
              />
              <div className="flex flex-col gap-2">
                {voiceSupport && (
                  <button onClick={toggleVoice} disabled={sending || completed || aiThinking}
                    title={listening ? "Stop recording" : "Speak your answer"}
                    className={`p-3 rounded-xl transition-all ${
                      listening ? "bg-red-500 text-white shadow-lg shadow-red-500/30 scale-110" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    } disabled:opacity-40`}>
                    {listening ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                )}
                <button onClick={sendAnswer} disabled={!answer.trim() || sending || completed || aiThinking}
                  className="p-3 rounded-xl bg-primary-600 text-white hover:bg-primary-500 disabled:opacity-40 transition-colors">
                  {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
            </div>
            <p className="text-[11px] text-gray-600 mt-2 px-1">
              <kbd className="px-1 bg-gray-700 rounded font-mono">Enter</kbd> to send ·
              <kbd className="px-1 bg-gray-700 rounded font-mono ml-1">Shift+Enter</kbd> new line
              {voiceSupport && " · Mic to speak"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}