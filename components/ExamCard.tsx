"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Month } from "@/lib/content/types";
import { Trophy, Check, Sparkles, ArrowRight } from "lucide-react";
import { getMonthExam } from "@/lib/progress";
import { EXAM_CONFIG } from "@/lib/exam";
import { cn } from "@/lib/utils";

export function ExamCard({ month }: { month: Month }) {
  const [status, setStatus] = useState<{
    passed: boolean;
    attempts: number;
    hasInProgress: boolean;
  }>({ passed: false, attempts: 0, hasInProgress: false });

  useEffect(() => {
    function refresh() {
      const exam = getMonthExam(month.id);
      setStatus({
        passed: exam.attempts.some((a) => a.passed),
        attempts: exam.attempts.length,
        hasInProgress: !!exam.current,
      });
    }
    refresh();
    const handler = () => refresh();
    window.addEventListener("progress-updated", handler);
    return () => window.removeEventListener("progress-updated", handler);
  }, [month.id]);

  const ctaLabel = status.passed
    ? "Открыть результат"
    : status.hasInProgress
      ? "Продолжить экзамен"
      : status.attempts > 0
        ? "Попробовать снова"
        : "Начать экзамен";

  return (
    <Link
      href={`/exam/${month.id}`}
      className={cn(
        "group block overflow-hidden rounded-xl border shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft-lg",
        status.passed
          ? "border-success/30 bg-gradient-to-br from-success/5 to-practice/5"
          : "border-primary/30 bg-gradient-to-br from-primary/5 to-quiz/5",
      )}
    >
      <div
        className={cn(
          "h-1 w-full bg-gradient-to-r",
          status.passed ? "from-success to-practice" : "from-primary to-quiz",
        )}
      />
      <div className="flex items-center gap-5 p-5">
        <div
          className={cn(
            "flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl",
            status.passed
              ? "bg-success/15 text-success"
              : "bg-primary/15 text-primary",
          )}
        >
          {status.passed ? (
            <Trophy className="h-6 w-6" />
          ) : (
            <Sparkles className="h-6 w-6" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
            <span className={status.passed ? "text-success" : "text-primary"}>
              {status.passed ? "Экзамен сдан" : "Финальный экзамен"}
            </span>
            {status.hasInProgress && !status.passed && (
              <span className="rounded-md border border-warning/30 bg-warning/10 px-1.5 py-0.5 text-[10px] uppercase text-warning">
                в процессе
              </span>
            )}
          </div>
          <div className="mt-0.5 text-base font-semibold leading-tight tracking-tight">
            {status.passed
              ? `Месяц ${month.number} пройден`
              : `Проверка по всему месяцу ${month.number}`}
          </div>
          <div className="mt-1 text-[12.5px] text-muted-foreground">
            {EXAM_CONFIG.questionCount} вопросов · {EXAM_CONFIG.practiceCount} задач · нужно ≥ {EXAM_CONFIG.requiredQuizCorrect} ответов и ≥ {EXAM_CONFIG.requiredPracticeDone} практик
            {status.attempts > 0 && !status.passed && ` · попыток: ${status.attempts}`}
          </div>
        </div>
        <div className="hidden flex-shrink-0 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground sm:flex">
          {ctaLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

/** Компактная плашка статуса для использования в других местах */
export function ExamStatusBadge({ monthId }: { monthId: string }) {
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    function refresh() {
      const exam = getMonthExam(monthId);
      setPassed(exam.attempts.some((a) => a.passed));
    }
    refresh();
    const handler = () => refresh();
    window.addEventListener("progress-updated", handler);
    return () => window.removeEventListener("progress-updated", handler);
  }, [monthId]);

  if (!passed) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success">
      <Check className="h-2.5 w-2.5" /> сдан
    </span>
  );
}
