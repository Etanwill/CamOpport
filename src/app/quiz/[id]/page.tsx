// src/app/quiz/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, Clock, CheckCircle, XCircle, Zap, Trophy } from "lucide-react";
import { Button } from "@/components/ui";

type QuizState = "intro" | "playing" | "results";

export default function QuizDetailPage() {
  const { id }   = useParams();
  const router   = useRouter();
  const { data: session } = useSession();

  const [quiz,            setQuiz]            = useState<any>(null);
  const [loadingQuiz,     setLoadingQuiz]     = useState(true);
  const [state,           setState]           = useState<QuizState>("intro");
  const [currentQ,        setCurrentQ]        = useState(0);
  const [selected,        setSelected]        = useState<number | null>(null);
  const [answers,         setAnswers]         = useState<(number | null)[]>([]);
  const [timeLeft,        setTimeLeft]        = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  // Fetch quiz from API
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res  = await fetch(`/api/quiz/${id}`);
        if (!res.ok) { setQuiz(null); setLoadingQuiz(false); return; }
        const data = await res.json();
        setQuiz(data.quiz ?? null);
      } catch { setQuiz(null); }
      setLoadingQuiz(false);
    };
    if (id) fetchQuiz();
  }, [id]);

  const nextQuestion = useCallback(() => {
    if (!quiz) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = selected;
    setAnswers(newAnswers);
    setShowExplanation(false);
    if (currentQ + 1 < quiz.questions.length) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setTimeLeft(quiz.questions[currentQ + 1].timeLimit);
    } else {
      setState("results");
    }
  }, [quiz, answers, currentQ, selected]);

  useEffect(() => {
    if (state !== "playing" || !quiz) return;
    setTimeLeft(quiz.questions[currentQ].timeLimit);
  }, [currentQ, state, quiz]);

  useEffect(() => {
    if (state !== "playing") return;
    if (timeLeft <= 0) { nextQuestion(); return; }
    const t = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, state, nextQuestion]);

  // Save attempt when results reached
  useEffect(() => {
    if (state !== "results" || !quiz || !session) return;
    const score = answers.reduce((sum: number, ans, i) =>
      ans === quiz.questions[i]?.correctAnswer ? sum + quiz.questions[i].points : sum, 0);
    fetch(`/api/quiz/${quiz.id}/attempt`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ quizId: quiz.id, score, totalPoints: quiz.totalPoints, answers }),
    }).catch(() => {});
  }, [state]);

  if (loadingQuiz) return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-2xl mx-auto px-4 py-12 w-full flex-1 animate-pulse">
        <div className="card p-8 space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto" />
          <div className="h-6 bg-gray-100 rounded w-1/2 mx-auto" />
          <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto" />
        </div>
      </div>
    </div>
  );

  if (!quiz) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-3">
      <h2 className="text-xl font-bold text-gray-700">Quiz not found</h2>
      <Link href="/quiz" className="text-primary-600 hover:underline">← Back to Quizzes</Link>
    </div>
  );

  const score        = answers.reduce((sum: number, ans, i) => ans === quiz.questions[i]?.correctAnswer ? sum + quiz.questions[i].points : sum, 0);
  const correctCount = answers.filter((ans, i) => ans === quiz.questions[i]?.correctAnswer).length;
  const pct          = quiz.totalPoints > 0 ? Math.round((score / quiz.totalPoints) * 100) : 0;

  const startQuiz = () => {
    if (!session) { router.push("/auth/login"); return; }
    setAnswers(new Array(quiz.questions.length).fill(null));
    setCurrentQ(0);
    setSelected(null);
    setState("playing");
  };

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (state === "intro") return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-2xl mx-auto px-4 py-12 w-full flex-1">
        <Link href="/quiz" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6">
          <ArrowLeft size={15} />Back to Quizzes
        </Link>
        <div className="card p-8 text-center">
          <div className="w-16 h-16 hero-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">{quiz.title}</h1>
          {quiz.companyName && (
            <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1 mb-3">
              <span>🏢</span>
              <span>Created by <span className="font-semibold text-gray-700">{quiz.companyName}</span></span>
            </div>
          )}
          <p className="text-gray-500 mb-6">{quiz.description}</p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              ["Questions", quiz.questions.length],
              ["Time Limit", `${Math.floor(quiz.timeLimit / 60)} min`],
              ["Max Points", quiz.totalPoints],
            ].map(([k, v]) => (
              <div key={String(k)} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xl font-bold text-gray-900">{v}</p>
                <p className="text-xs text-gray-500">{k}</p>
              </div>
            ))}
          </div>
          <Button onClick={startQuiz} size="lg" className="w-full">Start Quiz</Button>
          <p className="text-xs text-gray-400 mt-3">Each question has a time limit. Answer before time runs out!</p>
        </div>
      </div>
    </div>
  );

  // ── PLAYING ────────────────────────────────────────────────────────────────
  if (state === "playing") {
    const q        = quiz.questions[currentQ];
    const progress = (currentQ / quiz.questions.length) * 100;
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-6 w-full flex-1">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
              <span>Question {currentQ + 1} of {quiz.questions.length}</span>
              <span className={`flex items-center gap-1.5 font-semibold ${timeLeft <= 10 ? "text-red-600 animate-pulse" : "text-gray-700"}`}>
                <Clock size={14} />{timeLeft}s
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="card p-7 mb-4">
            <div className="flex justify-center mb-4">
              <div className={`w-14 h-14 rounded-full border-4 ${timeLeft <= 10 ? "border-red-400 text-red-600" : "border-primary-400 text-primary-600"} flex items-center justify-center font-bold text-xl`}>
                {timeLeft}
              </div>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 text-center mb-5">{q.question}</h2>
            <div className="space-y-3">
              {q.options.map((opt: string, i: number) => {
                let cls = "border-2 border-gray-200 text-gray-700 hover:border-primary-400 hover:bg-primary-50";
                if (selected === i) cls = "border-2 border-primary-600 bg-primary-50 text-primary-700";
                if (showExplanation) {
                  if (i === q.correctAnswer)      cls = "border-2 border-green-500 bg-green-50 text-green-700";
                  else if (selected === i)        cls = "border-2 border-red-400 bg-red-50 text-red-700";
                  else                            cls = "border-2 border-gray-200 text-gray-500";
                }
                return (
                  <button key={i}
                    onClick={() => { if (!showExplanation) { setSelected(i); setShowExplanation(true); } }}
                    className={`w-full text-left p-3.5 rounded-xl text-sm font-medium transition-all ${cls}`}>
                    <span className="font-bold mr-2">{["A","B","C","D"][i]}.</span>{opt}
                  </button>
                );
              })}
            </div>
            {showExplanation && q.explanation && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
                <strong>Explanation:</strong> {q.explanation}
              </div>
            )}
          </div>

          {showExplanation && (
            <Button onClick={nextQuestion} className="w-full">
              {currentQ + 1 === quiz.questions.length ? "See Results" : "Next Question →"}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ── RESULTS ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-2xl mx-auto px-4 py-10 w-full flex-1">
        <div className="card p-8 text-center mb-5">
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold ${
            pct >= 80 ? "bg-green-100 text-green-600" : pct >= 50 ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"
          }`}>
            {pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "😅"}
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-1">Quiz Complete!</h1>
          <p className="text-gray-500 mb-5">{quiz.title}</p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-primary-50 rounded-xl p-3"><p className="text-2xl font-bold text-primary-700">{score}</p><p className="text-xs text-gray-500">Points</p></div>
            <div className={`rounded-xl p-3 ${pct >= 80 ? "bg-green-50" : pct >= 50 ? "bg-yellow-50" : "bg-red-50"}`}>
              <p className={`text-2xl font-bold ${pct >= 80 ? "text-green-600" : pct >= 50 ? "text-yellow-600" : "text-red-600"}`}>{pct}%</p>
              <p className="text-xs text-gray-500">Score</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3"><p className="text-2xl font-bold text-gray-700">{correctCount}/{quiz.questions.length}</p><p className="text-xs text-gray-500">Correct</p></div>
          </div>
          {pct >= 80 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 flex items-center gap-2 justify-center text-sm text-yellow-700">
              <Trophy size={16} /><span>Excellent! You earned <strong>+{score} XP</strong>!</span>
            </div>
          )}
          <div className="flex gap-3">
            <Button onClick={startQuiz} variant="secondary" className="flex-1">Try Again</Button>
            <Link href="/quiz" className="flex-1 btn-primary text-center py-2.5 text-sm">More Quizzes</Link>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold text-gray-900">Review Answers</h2>
          {quiz.questions.map((q: any, i: number) => {
            const isCorrect = answers[i] === q.correctAnswer;
            return (
              <div key={i} className={`card p-4 border-l-4 ${isCorrect ? "border-green-500" : "border-red-400"}`}>
                <div className="flex items-start gap-2 mb-1">
                  {isCorrect
                    ? <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    : <XCircle    size={16} className="text-red-400 mt-0.5 flex-shrink-0" />}
                  <p className="text-sm font-medium text-gray-900">{q.question}</p>
                </div>
                {!isCorrect && <p className="text-xs text-green-700 ml-6">Correct: {q.options[q.correctAnswer]}</p>}
                {q.explanation && <p className="text-xs text-gray-500 ml-6 mt-1">{q.explanation}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}