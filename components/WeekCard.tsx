"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Lesson } from "@/lib/content/types";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, Brain, Code2 } from "lucide-react";
import { getLessonCompletionPercent } from "@/lib/progress";
import { cn } from "@/lib/utils";

export function WeekCard({ week, index }: { week: Lesson; index: number }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    function recompute() {
      setPercent(
        getLessonCompletionPercent(
          week.id,
          week.theory.length,
          week.quiz.length,
          week.practice.length,
        ),
      );
    }
    recompute();
    const h = () => recompute();
    window.addEventListener("progress-updated", h);
    return () => window.removeEventListener("progress-updated", h);
  }, [week]);

  const isComplete = percent === 100;

  return (
    <Link href={`/week/${week.id}`}>
      <div
        className={cn(
          "group relative flex gap-5 overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-soft transition-all duration-300",
          "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-soft-lg",
        )}
      >
        {/* Цветовой индикатор слева */}
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-1 bg-gradient-to-b transition-opacity",
            isComplete
              ? "from-practice to-success opacity-100"
              : percent > 0
                ? "from-primary to-quiz opacity-60"
                : "from-border-strong to-border opacity-30",
          )}
        />

        <div
          className={cn(
            "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl font-mono text-base font-semibold tabular-nums transition-all",
            isComplete
              ? "bg-practice/10 text-practice"
              : percent > 0
                ? "bg-primary/10 text-primary"
                : "border border-border bg-surface-2 text-muted-foreground",
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-[15px] font-semibold leading-snug tracking-tight">
              {week.title}
            </h3>
            <span className="flex flex-shrink-0 items-center gap-1 rounded-md bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              <Clock className="h-3 w-3" />
              {week.estimatedHours}
            </span>
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
            {week.goal}
          </p>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3 text-theory" /> {week.theory.length}
              </span>
              <span className="flex items-center gap-1">
                <Brain className="h-3 w-3 text-quiz" /> {week.quiz.length}
              </span>
              <span className="flex items-center gap-1">
                <Code2 className="h-3 w-3 text-practice" /> {week.practice.length}
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2">
              <Progress value={percent} className="h-1" />
              <span className="text-[11px] font-medium tabular-nums text-muted-foreground">
                {percent}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
