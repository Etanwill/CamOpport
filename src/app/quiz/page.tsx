// src/app/quiz/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Clock, Users, Star, Building2 } from "lucide-react";
import { getDifficultyColor } from "@/lib/utils";

export default function QuizPage() {
  const [filter,  setFilter]  = useState("all");
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== "all") params.set("category", filter);
      try {
        const res  = await fetch(`/api/quiz?${params.toString()}`);
        const data = await res.json();
        setQuizzes(data.quizzes ?? []);
      } catch { setQuizzes([]); }
      setLoading(false);
    };
    fetchQuizzes();
  }, [filter]);

  // Build category list from loaded quizzes
  const categories = ["all", ...Array.from(new Set(quizzes.map(q => q.category))).filter(Boolean)];

  return (
    <div className="min-h-screen flex flex-col">

      <section className="hero-gradient py-10 px-4 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Zap size={28} className="text-yellow-300" />
            <h1 className="text-3xl font-display font-bold">Company Quizzes</h1>
          </div>
          <p className="text-purple-200">
            Take quizzes created by top Cameroonian employers. Understand their standards before you apply.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8 w-full flex-1">
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                filter === cat ? "bg-primary-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-primary-300"
              }`}>
              {cat === "all" ? "All Categories" : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1,2,3,4].map(i => (
              <div key={i} className="card p-5 animate-pulse space-y-3">
                <div className="flex justify-between">
                  <div className="h-5 bg-gray-100 rounded w-1/4" />
                  <div className="h-5 bg-gray-100 rounded w-1/4" />
                </div>
                <div className="h-5 bg-gray-100 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-16">
            <Zap size={48} className="text-gray-200 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-600">No quizzes yet</h3>
            <p className="text-sm text-gray-400 mt-1">Employers haven't published any quizzes yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {quizzes.map(quiz => (
              <Link href={`/quiz/${quiz.id}`} key={quiz.id}
                className="card p-5 block group hover:-translate-y-1 transition-all duration-200">
                <div className="flex justify-between items-start mb-3">
                  <span className="badge bg-primary-100 text-primary-700 capitalize">{quiz.category}</span>
                  <span className={`badge ${getDifficultyColor(quiz.difficulty)} capitalize`}>{quiz.difficulty}</span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors mb-1">{quiz.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{quiz.description}</p>

                {quiz.companyName && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3 bg-gray-50 rounded-lg px-3 py-1.5">
                    <Building2 size={12} className="text-gray-400" />
                    <span>By <span className="font-medium text-gray-700">{quiz.companyName}</span></span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><Clock size={13} />{Math.floor((quiz.timeLimit ?? 600) / 60)} min</span>
                  <span className="flex items-center gap-1.5"><Zap size={13} />{quiz.totalPoints} pts</span>
                  <span className="flex items-center gap-1.5 font-semibold text-primary-700"><Star size={13} />+XP</span>
                </div>

                {quiz.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {quiz.tags.map((t: string) => (
                      <span key={t} className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">#{t}</span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
</div>
  );
}