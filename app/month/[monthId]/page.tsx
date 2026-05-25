import Link from "next/link";
import { notFound } from "next/navigation";
import { findMonth, roadmap } from "@/lib/content";
import { TopNav } from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Trophy } from "lucide-react";
import { WeekCard } from "@/components/WeekCard";

export async function generateStaticParams() {
  return roadmap.months.map((m) => ({ monthId: m.id }));
}

export default async function MonthPage({
  params,
}: {
  params: Promise<{ monthId: string }>;
}) {
  const { monthId } = await params;
  const month = findMonth(monthId);
  if (!month) notFound();

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> К плану
        </Link>

        <header className="mb-10 space-y-5">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-primary px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
              M{String(month.number).padStart(2, "0")}
            </span>
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl">
              {month.title}
            </h1>
            <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {month.description}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-4 shadow-soft">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <Target className="h-3.5 w-3.5 text-primary" />
                Цель месяца
              </div>
              <p className="mt-2 text-sm leading-relaxed">{month.goal}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4 shadow-soft">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <Trophy className="h-3.5 w-3.5 text-checkpoint" />
                Главный артефакт
              </div>
              <p className="mt-2 text-sm leading-relaxed">{month.mainArtifact}</p>
            </div>
          </div>
        </header>

        {month.available && month.weeks.length > 0 ? (
          <div className="space-y-3">
            <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Недели
            </div>
            <div className="space-y-3">
              {month.weeks.map((week, i) => (
                <WeekCard key={week.id} week={week} index={i} />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-surface p-12 text-center shadow-soft">
            <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Скоро
            </div>
            <div className="mt-3 text-base font-semibold">Контент готовится</div>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Этот месяц добавим, когда закроешь предыдущий — чтобы не отвлекаться.
            </p>
            <Link href="/" className="mt-4 inline-block">
              <Button variant="outline">К плану</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
