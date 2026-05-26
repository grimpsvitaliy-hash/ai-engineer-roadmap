"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Month } from "@/lib/content/types";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, Lock, Trophy } from "lucide-react";
import { getLessonCompletionPercent, getMonthExam } from "@/lib/progress";
import { canAccessMonth, findPreviousMonth } from "@/lib/exam";
import { cn } from "@/lib/utils";

const monthAccent: Record<number, { bar: string }> = {
  1: { bar: "from-theory to-primary" },
  2: { bar: "from-primary to-quiz" },
  3: { bar: "from-quiz to-pink-500" },
  4: { bar: "from-practice to-theory" },
  5: { bar: "from-checkpoint to-orange-500" },
  6: { bar: "from-pink-500 to-quiz" },
};

export function MonthCard({ month }: { month: Month }) {
  const [percent, setPercent] = useState(0);
  const [accessible, setAccessible] = useState(true);
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    function recompute() {
      if (month.weeks.length === 0) {
        setPercent(0);
      } else {
        const sum = month.weeks.reduce(
          (acc, w) =>
            acc +
            getLessonCompletionPercent(w.id, w.theory.length, w.quiz.length, w.practice.length),
          0,
        );
        setPercent(Math.round(sum / month.weeks.length));
      }
      setAccessible(canAccessMonth(month.id));
      const exam = getMonthExam(month.id);
      setPassed(exam.attempts.some((a) => a.passed));
    }
    recompute();
    const handler = () => recompute();
    window.addEventListener("progress-updated", handler);
    return () => window.removeEventListener("progress-updated", handler);
  }, [month]);

  const accent = monthAccent[month.number] ?? monthAccent[1];
  const isLocked = month.available && month.weeks.length > 0 && !accessible;
  const prevMonth = isLocked ? findPreviousMonth(month.id) : null;

  const content = (
    <div
      className={cn(
        "group relative h-full overflow-hidden rounded-xl border bg-surface shadow-soft transition-all duration-300",
        passed
          ? "border-success/30"
          : isLocked
            ? "border-border opacity-70"
            : month.available
              ? "border-border hover:-translate-y-0.5 hover:border-border-strong hover:shadow-soft-lg"
              : "border-border opacity-60",
      )}
    >
      <div className={cn("h-1 bg-gradient-to-r", accent.bar)} />

      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <span className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            M{String(month.number).padStart(2, "0")}
          </span>
          {passed ? (
            <span className="flex items-center gap-1 rounded-md bg-success/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-success">
              <Trophy className="h-3 w-3" /> сдан
            </span>
          ) : isLocked ? (
            <span className="flex items-center gap-1 rounded-md bg-surface-2 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              <Lock className="h-2.5 w-2.5" /> Заблокировано
            </span>
          ) : !month.available ? (
            <span className="flex items-center gap-1 rounded-md bg-surface-2 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              <Lock className="h-2.5 w-2.5" /> Скоро
            </span>
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <h3 className="text-[15px] font-semibold leading-tight tracking-tight">
            {month.title}
          </h3>
          <p className="text-[13px] leading-relaxed text-muted-foreground line-clamp-3">
            {month.description}
          </p>
          {isLocked && prevMonth && (
            <p className="mt-2 text-[11px] font-medium text-warning">
              🔒 Сдай экзамен месяца {prevMonth.number} чтобы открыть
            </p>
          )}
        </div>

        {month.available && month.weeks.length > 0 && !isLocked && (
          <div className="space-y-1.5 pt-1">
            <Progress value={percent} />
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">
                {month.weeks.length} недел{month.weeks.length === 1 ? "я" : "и"}
              </span>
              <span className="font-medium tabular-nums text-foreground">{percent}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!month.available || isLocked) return content;
  return <Link href={`/month/${month.id}`}>{content}</Link>;
}
