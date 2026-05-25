"use client";

import { useEffect, useState } from "react";
import { loadProgress, type Progress } from "@/lib/progress";
import { Flame, Trophy, Code2, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type Stat = {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ReactNode;
  color: string;
};

export function GlobalStats() {
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
    const handler = () => setProgress(loadProgress());
    window.addEventListener("progress-updated", handler);
    return () => window.removeEventListener("progress-updated", handler);
  }, []);

  if (!progress) {
    return (
      <div className="grid h-[110px] grid-cols-2 gap-3 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-surface shadow-soft" />
        ))}
      </div>
    );
  }

  const acc =
    progress.totalQuizAttempted > 0
      ? Math.round((progress.totalQuizCorrect / progress.totalQuizAttempted) * 100)
      : 0;

  const stats: Stat[] = [
    {
      label: "Серия дней",
      value: progress.streak,
      icon: <Flame className="h-4 w-4" />,
      color: "text-orange-500 bg-orange-500/10",
    },
    {
      label: "Точность квизов",
      value: progress.totalQuizAttempted > 0 ? `${acc}%` : "—",
      hint:
        progress.totalQuizAttempted > 0
          ? `${progress.totalQuizCorrect}/${progress.totalQuizAttempted}`
          : "",
      icon: <Trophy className="h-4 w-4" />,
      color: "text-quiz bg-quiz/10",
    },
    {
      label: "Практик закрыто",
      value: progress.totalPracticeCompleted,
      icon: <Code2 className="h-4 w-4" />,
      color: "text-practice bg-practice/10",
    },
    {
      label: "Уроков начато",
      value: Object.keys(progress.lessons).length,
      icon: <BookOpen className="h-4 w-4" />,
      color: "text-theory bg-theory/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="group rounded-xl border border-border bg-surface p-4 shadow-soft transition-all hover:shadow-soft-lg"
        >
          <div className="flex items-center justify-between">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-110",
                s.color,
              )}
            >
              {s.icon}
            </div>
          </div>
          <div className="mt-3 text-2xl font-semibold tabular-nums tracking-tighter">
            {s.value}
          </div>
          <div className="mt-0.5 flex items-baseline gap-1.5 text-xs">
            <span className="text-muted-foreground">{s.label}</span>
            {s.hint && <span className="text-muted-foreground/70">· {s.hint}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
