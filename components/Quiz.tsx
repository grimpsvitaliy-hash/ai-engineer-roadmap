"use client";

import { useEffect, useMemo, useState } from "react";
import type { QuizQuestion } from "@/lib/content/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Callout } from "@/components/ui/callout";
import { cn } from "@/lib/utils";
import { Check, X, Lightbulb, RotateCcw, Trophy } from "lucide-react";
import { getLessonProgress, recordQuizAnswer } from "@/lib/progress";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type Status = "unanswered" | "correct" | "wrong";

function MD({ children }: { children: string }) {
  return (
    <div className="prose-custom">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function checkAnswer(q: QuizQuestion, selected: string | string[]): boolean {
  if (q.type === "single-choice") return selected === q.correctOptionId;
  if (q.type === "multiple-choice") {
    if (!Array.isArray(selected)) return false;
    const a = [...selected].sort();
    const b = [...q.correctOptionIds].sort();
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }
  if (q.type === "text-input") {
    if (typeof selected !== "string") return false;
    const user = q.caseSensitive ? selected.trim() : normalize(selected);
    return q.correctAnswers.some((ans) =>
      q.caseSensitive ? ans.trim() === user : normalize(ans) === user,
    );
  }
  return false;
}

function QuestionCard({
  q,
  index,
  total,
  lessonId,
  onAnswered,
  prevAnswer,
}: {
  q: QuizQuestion;
  index: number;
  total: number;
  lessonId: string;
  onAnswered: (correct: boolean) => void;
  prevAnswer?: { selected: string | string[]; correct: boolean };
}) {
  const [selectedSingle, setSelectedSingle] = useState<string>("");
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);
  const [textInput, setTextInput] = useState<string>("");
  const [status, setStatus] = useState<Status>("unanswered");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (prevAnswer) {
      if (q.type === "single-choice" && typeof prevAnswer.selected === "string") {
        setSelectedSingle(prevAnswer.selected);
      }
      if (q.type === "multiple-choice" && Array.isArray(prevAnswer.selected)) {
        setSelectedMulti(prevAnswer.selected);
      }
      if (q.type === "text-input" && typeof prevAnswer.selected === "string") {
        setTextInput(prevAnswer.selected);
      }
      setStatus(prevAnswer.correct ? "correct" : "wrong");
    } else {
      setSelectedSingle("");
      setSelectedMulti([]);
      setTextInput("");
      setStatus("unanswered");
    }
    setShowHint(false);
  }, [q.id, prevAnswer]);

  function handleSubmit() {
    let selected: string | string[];
    if (q.type === "single-choice") selected = selectedSingle;
    else if (q.type === "multiple-choice") selected = selectedMulti;
    else selected = textInput;

    if (
      (typeof selected === "string" && selected.length === 0) ||
      (Array.isArray(selected) && selected.length === 0)
    )
      return;

    const ok = checkAnswer(q, selected);
    setStatus(ok ? "correct" : "wrong");
    recordQuizAnswer(lessonId, q.id, selected, ok);
    onAnswered(ok);
  }

  function handleReset() {
    setSelectedSingle("");
    setSelectedMulti([]);
    setTextInput("");
    setStatus("unanswered");
    setShowHint(false);
  }

  const accentBorder =
    status === "correct"
      ? "border-success/40 bg-success/[0.02]"
      : status === "wrong"
        ? "border-danger/40 bg-danger/[0.02]"
        : "border-border";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-surface shadow-soft transition-all fade-in-up",
        accentBorder,
      )}
    >
      {/* Цветовой акцент сверху */}
      <div
        className={cn(
          "h-1 w-full transition-colors",
          status === "correct"
            ? "bg-success"
            : status === "wrong"
              ? "bg-danger"
              : "bg-quiz/30",
        )}
      />
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-muted-foreground">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          {status === "correct" && (
            <span className="flex items-center gap-1 rounded-md bg-success/10 px-2 py-1 text-xs font-medium text-success">
              <Check className="h-3 w-3" /> Верно
            </span>
          )}
          {status === "wrong" && (
            <span className="flex items-center gap-1 rounded-md bg-danger/10 px-2 py-1 text-xs font-medium text-danger">
              <X className="h-3 w-3" /> Неверно
            </span>
          )}
        </div>

        <h3 className="text-[15px] font-semibold leading-snug tracking-tight">
          <MD>{q.question}</MD>
        </h3>

        {q.type === "single-choice" && (
          <div className="space-y-1.5">
            {q.options.map((opt) => {
              const isSelected = selectedSingle === opt.id;
              const isCorrectOpt = q.correctOptionId === opt.id;
              const showResult = status !== "unanswered";
              return (
                <button
                  key={opt.id}
                  disabled={showResult}
                  onClick={() => setSelectedSingle(opt.id)}
                  className={cn(
                    "w-full rounded-xl border p-3 text-left text-sm transition-all",
                    "disabled:cursor-not-allowed",
                    !showResult && isSelected && "border-quiz bg-quiz/5 ring-2 ring-quiz/20",
                    !showResult &&
                      !isSelected &&
                      "border-border hover:border-quiz/40 hover:bg-quiz/[0.02]",
                    showResult && isCorrectOpt && "border-success/40 bg-success/5",
                    showResult &&
                      isSelected &&
                      !isCorrectOpt &&
                      "border-danger/40 bg-danger/5",
                    showResult &&
                      !isSelected &&
                      !isCorrectOpt &&
                      "border-border opacity-50",
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        "mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2",
                        !showResult && isSelected && "border-quiz bg-quiz",
                        !showResult && !isSelected && "border-border-strong",
                        showResult && isCorrectOpt && "border-success bg-success",
                        showResult && isSelected && !isCorrectOpt && "border-danger bg-danger",
                      )}
                    >
                      {showResult && isCorrectOpt && (
                        <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                      )}
                      {showResult && isSelected && !isCorrectOpt && (
                        <X className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                      )}
                      {!showResult && isSelected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </span>
                    <span className="flex-1 leading-relaxed">{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {q.type === "multiple-choice" && (
          <div className="space-y-1.5">
            <div className="text-[11px] italic text-muted-foreground">
              Можно выбрать несколько
            </div>
            {q.options.map((opt) => {
              const isSelected = selectedMulti.includes(opt.id);
              const isCorrectOpt = q.correctOptionIds.includes(opt.id);
              const showResult = status !== "unanswered";
              return (
                <button
                  key={opt.id}
                  disabled={showResult}
                  onClick={() => {
                    setSelectedMulti((prev) =>
                      prev.includes(opt.id)
                        ? prev.filter((x) => x !== opt.id)
                        : [...prev, opt.id],
                    );
                  }}
                  className={cn(
                    "w-full rounded-xl border p-3 text-left text-sm transition-all",
                    "disabled:cursor-not-allowed",
                    !showResult && isSelected && "border-quiz bg-quiz/5 ring-2 ring-quiz/20",
                    !showResult &&
                      !isSelected &&
                      "border-border hover:border-quiz/40 hover:bg-quiz/[0.02]",
                    showResult && isCorrectOpt && "border-success/40 bg-success/5",
                    showResult &&
                      isSelected &&
                      !isCorrectOpt &&
                      "border-danger/40 bg-danger/5",
                    showResult &&
                      !isSelected &&
                      !isCorrectOpt &&
                      "border-border opacity-50",
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        "mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-sm border-2",
                        !showResult && isSelected && "border-quiz bg-quiz",
                        !showResult && !isSelected && "border-border-strong",
                        showResult && isCorrectOpt && "border-success bg-success",
                        showResult && isSelected && !isCorrectOpt && "border-danger bg-danger",
                      )}
                    >
                      {(isSelected || (showResult && isCorrectOpt)) && (
                        <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                      )}
                    </span>
                    <span className="flex-1 leading-relaxed">{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {q.type === "text-input" && (
          <input
            type="text"
            disabled={status !== "unanswered"}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Твой ответ..."
            className={cn(
              "w-full rounded-xl border bg-surface px-3.5 py-2.5 font-mono text-sm transition-all",
              "focus:outline-none focus:ring-2 focus:ring-quiz/30 focus:border-quiz",
              "disabled:cursor-not-allowed",
              status === "correct" && "border-success/40 focus:border-success focus:ring-success/30",
              status === "wrong" && "border-danger/40 focus:border-danger focus:ring-danger/30",
              status === "unanswered" && "border-border",
            )}
          />
        )}

        {q.hint && status !== "correct" && (
          <div>
            {!showHint ? (
              <Button variant="ghost" size="sm" onClick={() => setShowHint(true)}>
                <Lightbulb className="h-3.5 w-3.5" />
                Подсказка
              </Button>
            ) : (
              <Callout variant="tip" title="Подсказка">
                {q.hint}
              </Callout>
            )}
          </div>
        )}

        {status !== "unanswered" && (
          <Callout variant={status === "correct" ? "tip" : "info"} title="Объяснение">
            <MD>{q.explanation}</MD>
          </Callout>
        )}

        <div className="flex justify-end gap-2 pt-1">
          {status !== "unanswered" && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="h-3.5 w-3.5" />
              Сбросить
            </Button>
          )}
          {status === "unanswered" && <Button onClick={handleSubmit}>Проверить</Button>}
        </div>
      </div>
    </div>
  );
}

export function Quiz({
  questions,
  lessonId,
}: {
  questions: QuizQuestion[];
  lessonId: string;
}) {
  const [answers, setAnswers] = useState<
    Record<string, { selected: string | string[]; correct: boolean }>
  >({});

  useEffect(() => {
    const p = getLessonProgress(lessonId);
    setAnswers(
      Object.fromEntries(
        Object.entries(p.quizAnswers).map(([k, v]) => [
          k,
          { selected: v.selected, correct: v.correct },
        ]),
      ),
    );
  }, [lessonId]);

  const stats = useMemo(() => {
    const correct = questions.filter((q) => answers[q.id]?.correct).length;
    return {
      correct,
      total: questions.length,
      percent:
        questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0,
    };
  }, [answers, questions]);

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-xl border border-quiz/20 bg-gradient-to-br from-quiz/5 to-primary/5 shadow-soft">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-quiz/10 blur-2xl" />
        <div className="relative flex items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-quiz/15 text-quiz">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Прогресс по квизу
              </div>
              <div className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight">
                {stats.correct}
                <span className="text-muted-foreground"> / {stats.total}</span>
              </div>
            </div>
          </div>
          <div className="w-36 space-y-1.5">
            <Progress value={stats.percent} className="h-2" />
            <div className="text-right text-[11px] font-medium tabular-nums text-quiz">
              {stats.percent}%
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            q={q}
            index={i}
            total={questions.length}
            lessonId={lessonId}
            prevAnswer={answers[q.id]}
            onAnswered={() => {
              const p = getLessonProgress(lessonId);
              setAnswers(
                Object.fromEntries(
                  Object.entries(p.quizAnswers).map(([k, v]) => [
                    k,
                    { selected: v.selected, correct: v.correct },
                  ]),
                ),
              );
            }}
          />
        ))}
      </div>
    </div>
  );
}
