"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Input, Select } from "@/components/ui";
import { Zap, PlusCircle, Trash2 } from "lucide-react";

const DIFFICULTIES = ["beginner","intermediate","advanced"];
const CATEGORIES   = ["technology","marketing","finance","healthcare","education","agriculture","general"];

interface Question {
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
  explanation: string;
  points: number;
  timeLimit: number;
}

const emptyQuestion = (): Question => ({
  question: "", options: ["","","",""], correctAnswer: 0,
  explanation: "", points: 10, timeLimit: 30,
});

export default function CreateQuizPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: "", description: "", category: "", difficulty: "intermediate",
    timeLimit: "600", tags: "",
  });
  const [questions, setQuestions] = useState<Question[]>([emptyQuestion()]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && session?.user?.role !== "employer")
      router.push("/my-activity");
  }, [status, session, router]);

  const setField = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const setQ = (i: number, k: keyof Question, val: any) =>
    setQuestions(qs => qs.map((q, idx) => idx === i ? { ...q, [k]: val } : q));

  const setOption = (qi: number, oi: number, val: string) =>
    setQuestions(qs => qs.map((q, idx) => {
      if (idx !== qi) return q;
      const opts = [...q.options] as [string,string,string,string];
      opts[oi] = val;
      return { ...q, options: opts };
    }));

  const addQuestion = () => setQuestions(qs => [...qs, emptyQuestion()]);
  const removeQuestion = (i: number) => setQuestions(qs => qs.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (questions.some(q => !q.question.trim() || q.options.some(o => !o.trim()))) {
      setError("Please fill in all question fields and options."); return;
    }
    setSaving(true); setError("");
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          timeLimit:   Number(form.timeLimit),
          tags:        form.tags.split(",").map(s => s.trim()).filter(Boolean),
          totalPoints,
          questions,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setSaving(false); return; }
      setSuccess(true);
      setTimeout(() => router.push("/employer/dashboard"), 1500);
    } catch {
      setError("Something went wrong."); setSaving(false);
    }
  };

  if (status === "loading") return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8 w-full flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-2">
            <Zap className="text-purple-600" size={24} /> Create Company Quiz
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Build an assessment so job seekers can gauge your company standards before applying.
          </p>
        </div>

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 mb-4 text-sm font-medium">
            ✅ Quiz created successfully! Redirecting…
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quiz Meta */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Quiz Details</h2>
            <Input label="Quiz Title" value={form.title} onChange={setField("title")} required
              placeholder="e.g. MTN Cameroon Technical Assessment" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={setField("description")} rows={3}
                placeholder="Tell candidates what this quiz tests and why it matters for working at your company…"
                className="input w-full resize-none" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Select label="Category" value={form.category} onChange={setField("category")} required
                placeholder="Select category"
                options={CATEGORIES.map(c => ({ value: c, label: c.charAt(0).toUpperCase()+c.slice(1) }))} />
              <Select label="Difficulty" value={form.difficulty} onChange={setField("difficulty")}
                options={DIFFICULTIES.map(d => ({ value: d, label: d.charAt(0).toUpperCase()+d.slice(1) }))} />
              <Input label="Time Limit (seconds)" type="number" value={form.timeLimit}
                onChange={setField("timeLimit")} placeholder="600" />
            </div>
            <Input label="Tags" value={form.tags} onChange={setField("tags")}
              placeholder="e.g. networking, javascript, accounting" />
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Questions ({questions.length})</h2>
              <button type="button" onClick={addQuestion}
                className="flex items-center gap-1.5 text-sm text-primary-600 font-medium hover:text-primary-700">
                <PlusCircle size={16} /> Add Question
              </button>
            </div>

            {questions.map((q, qi) => (
              <div key={qi} className="card p-5 space-y-4 border-l-4 border-purple-400">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-purple-700">Question {qi + 1}</span>
                  {questions.length > 1 && (
                    <button type="button" onClick={() => removeQuestion(qi)}
                      className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question <span className="text-red-500">*</span></label>
                  <textarea value={q.question} onChange={e => setQ(qi, "question", e.target.value)}
                    rows={2} placeholder="Type your question here…" className="input w-full resize-none" required />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Options (select correct answer)</label>
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-3">
                      <input type="radio" name={`correct-${qi}`} checked={q.correctAnswer === oi}
                        onChange={() => setQ(qi, "correctAnswer", oi)}
                        className="w-4 h-4 text-emerald-600" />
                      <input type="text" value={opt} onChange={e => setOption(qi, oi, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                        className={`input flex-1 ${q.correctAnswer === oi ? "border-emerald-400 bg-emerald-50" : ""}`}
                        required />
                      {q.correctAnswer === oi && (
                        <span className="text-xs text-emerald-600 font-semibold whitespace-nowrap">✓ Correct</span>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Explanation <span className="text-gray-400">(optional)</span></label>
                  <input type="text" value={q.explanation}
                    onChange={e => setQ(qi, "explanation", e.target.value)}
                    placeholder="Briefly explain why the correct answer is right…"
                    className="input w-full" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                    <input type="number" value={q.points} min={1}
                      onChange={e => setQ(qi, "points", Number(e.target.value))}
                      className="input w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (seconds)</label>
                    <input type="number" value={q.timeLimit} min={5}
                      onChange={e => setQ(qi, "timeLimit", Number(e.target.value))}
                      className="input w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-purple-800">Total: {questions.length} questions</p>
              <p className="text-xs text-purple-600">{questions.reduce((s,q)=>s+q.points,0)} points • ~{Math.ceil(questions.reduce((s,q)=>s+q.timeLimit,0)/60)} min</p>
            </div>
            <button type="button" onClick={addQuestion}
              className="flex items-center gap-1.5 text-sm font-medium text-purple-700 hover:text-purple-900">
              <PlusCircle size={15} /> Add Another Question
            </button>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" className="w-full" isLoading={saving}>Publish Quiz</Button>
        </form>
      </div>
</div>
  );
}