"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Month } from "@/lib/content/types";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, Lock } from "lucide-react";
import { getLessonCompletionPercent } from "@/lib/progress";
import { cn } from "@/lib/utils";

// Цвет полоски сверху в зависимости от номера месяца
const monthAccent: Record<number, { bar: string; glow: string }> = {
  1: { bar: "from-theory to-primary", glow: "group-hover:shadow-[0_0_24px_-8px_rgb(var(--cat-theory))]" },
  2: { bar: "from-primary to-quiz", glow: "group-hover:shadow-[0_0_24px_-8px_rgb(var(--primary))]" },
  3: { bar: "from-quiz to-pink-500", glow: "group-hover:shadow-[0_0_24px_-8px_rgb(var(--cat-quiz))]" },
  4: { bar: "from-practice to-theory", glow: "group-hover:shadow-[0_0_24px_-8px_rgb(var(--cat-practice))]" },
  5: { bar: "from-checkpoint to-orange-500", glow: "group-hover:shadow-[0_0_24px_-8px_rgb(var(--cat-checkpoint))]" },
  6: { bar: "from-pink-500 to-quiz", glow: "group-hover:shadow-[0_0_24px_-8px_rgb(var(--cat-quiz))]" },
};

export function MonthCard({ month }: { month: Month }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    function recompute() {
      if (month.weeks.length === 0) {
        setPercent(0);
        return;
      }
      const sum = month.weeks.reduce(
        (acc, w) =>
          acc +
          getLessonCompletionPercent(w.id, w.theory.length, w.quiz.length, w.practice.length),
        0,
      );
      setPercent(Math.round(sum / month.weeks.length));
    }
    recompute();
    const handler = () => recompute();
    window.addEventListener("progress-updated", handler);
    return () => window.removeEventListener("progress-updated", handler);
  }, [month]);

  const accent = monthAccent[month.number] ?? monthAccent[1];

  const content = (
    <div
      className={cn(
        "group relative h-full overflow-hidden rounded-xl border border-border bg-surface shadow-soft transition-all duration-300",
        month.available
          ? "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-soft-lg"
          : "opacity-60",
      )}
    >
      {/* Цветная полоска сверху */}
      <div className={cn("h-1 bg-gradient-to-r", accent.bar)} />

      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <span className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            M{String(month.number).padStart(2, "0")}
          </span>
          {month.available ? (
            <div className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          ) : (
            <span className="flex items-center gap-1 rounded-md bg-surface-2 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              <Lock className="h-2.5 w-2.5" /> Скоро
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <h3 className="text-[15px] font-semibold leading-tight tracking-tight">
            {month.title}
          </h3>
          <p className="text-[13px] leading-relaxed text-muted-foreground line-clamp-3">
            {month.description}
          </p>
        </div>

        {month.available && month.weeks.length > 0 && (
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

  if (!month.available) return content;
  return <Link href={`/month/${month.id}`}>{content}</Link>;
}
