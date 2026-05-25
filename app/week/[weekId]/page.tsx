import Link from "next/link";
import { notFound } from "next/navigation";
import { findLesson, roadmap, getAllLessons } from "@/lib/content";
import { TopNav } from "@/components/TopNav";
import { LessonView } from "@/components/LessonView";
import { ArrowLeft, ArrowRight } from "lucide-react";

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

  const all = roadmap.months.flatMap((m) => m.weeks);
  const idx = all.findIndex((w) => w.id === weekId);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <nav className="mb-6 flex items-center gap-1.5 text-[13px] text-muted-foreground">
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

        <LessonView lesson={lesson} />

        <nav className="mt-12 grid grid-cols-2 gap-3 border-t border-border pt-6">
          <div>
            {prev && (
              <Link
                href={`/week/${prev.id}`}
                className="group block rounded-xl border border-border bg-surface p-4 shadow-soft transition-all hover:border-border-strong hover:shadow-soft-lg"
              >
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ArrowLeft className="h-3 w-3" /> Предыдущая
                </div>
                <div className="mt-1 text-sm font-medium leading-tight">
                  {prev.title}
                </div>
              </Link>
            )}
          </div>
          <div>
            {next && (
              <Link
                href={`/week/${next.id}`}
                className="group block rounded-xl border border-border bg-surface p-4 text-right shadow-soft transition-all hover:border-border-strong hover:shadow-soft-lg"
              >
                <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                  Следующая <ArrowRight className="h-3 w-3" />
                </div>
                <div className="mt-1 text-sm font-medium leading-tight">
                  {next.title}
                </div>
              </Link>
            )}
          </div>
        </nav>
      </main>
    </div>
  );
}
