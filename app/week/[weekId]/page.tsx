import Link from "next/link";
import { notFound } from "next/navigation";
import { findLesson, roadmap, getAllLessons } from "@/lib/content";
import { TopNav } from "@/components/TopNav";
import { LessonView, type NextDestination } from "@/components/LessonView";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  return getAllLessons().map(({ lesson }) => ({ weekId: lesson.id }));
}

export default async function WeekPage({
  params,
}: {
  params: Promise<{ weekId: string }>;
}) {
  const { weekId } = await params;
  const result = findLesson(weekId);
  if (!result) notFound();

  const { lesson, month } = result;

  // Определяем куда идти после чекпоинта:
  // - если в текущем месяце ещё есть недели — следующая неделя
  // - иначе — финальный экзамен текущего месяца
  const currentMonthWeeks = month.weeks;
  const idxInMonth = currentMonthWeeks.findIndex((w) => w.id === weekId);
  const nextInMonth = idxInMonth >= 0 ? currentMonthWeeks[idxInMonth + 1] : undefined;

  let nextDestination: NextDestination;
  if (nextInMonth) {
    nextDestination = {
      kind: "week",
      id: nextInMonth.id,
      title: nextInMonth.title,
    };
  } else {
    // Это последняя неделя месяца → экзамен
    nextDestination = {
      kind: "exam",
      monthId: month.id,
      monthNumber: month.number,
    };
  }

  // Предыдущая неделя — только в рамках текущего месяца для простоты,
  // но если её нет — попробуем последнюю неделю предыдущего месяца
  const all = roadmap.months.flatMap((m) => m.weeks);
  const globalIdx = all.findIndex((w) => w.id === weekId);
  const prev = globalIdx > 0 ? all[globalIdx - 1] : null;

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <nav className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
            <Link href="/" className="rounded-md px-1.5 py-0.5 hover:bg-surface-2 hover:text-foreground">
              План
            </Link>
            <span className="text-border-strong">/</span>
            <Link
              href={`/month/${month.id}`}
              className="rounded-md px-1.5 py-0.5 hover:bg-surface-2 hover:text-foreground"
            >
              Месяц {month.number}
            </Link>
            <span className="text-border-strong">/</span>
            <span className="px-1.5 text-foreground">Неделя {lesson.weekNumber}</span>
          </div>
          {prev && (
            <Link
              href={`/week/${prev.id}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-border-strong hover:bg-surface-2 hover:text-foreground"
              title={`Предыдущая: ${prev.title}`}
            >
              <ArrowLeft className="h-3 w-3" />
              Предыдущая
            </Link>
          )}
        </nav>

        <header className="mb-8 space-y-3">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-gradient-to-br from-primary to-quiz px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-white shadow-soft">
              W{String(lesson.weekNumber).padStart(2, "0")}
            </span>
            <span className="rounded-md border border-border bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {lesson.estimatedHours}
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl">
            {lesson.title}
          </h1>
          <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {lesson.goal}
          </p>
        </header>

        <LessonView lesson={lesson} nextDestination={nextDestination} />
      </main>
    </div>
  );
}
