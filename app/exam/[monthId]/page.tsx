import Link from "next/link";
import { notFound } from "next/navigation";
import { findMonth, roadmap } from "@/lib/content";
import { TopNav } from "@/components/TopNav";
import { ExamView } from "@/components/ExamView";
import { MonthAccessGate } from "@/components/MonthAccessGate";

export async function generateStaticParams() {
  return roadmap.months.filter((m) => m.available).map((m) => ({ monthId: m.id }));
}

export default async function ExamPage({
  params,
}: {
  params: Promise<{ monthId: string }>;
}) {
  const { monthId } = await params;
  const month = findMonth(monthId);
  if (!month) notFound();
  if (!month.available || month.weeks.length === 0) notFound();

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
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
          <span className="px-1.5 text-foreground">Экзамен</span>
        </nav>

        <header className="mb-8 space-y-3">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-gradient-to-br from-primary to-quiz px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-white shadow-soft">
              Экзамен M{String(month.number).padStart(2, "0")}
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl">
            {month.title}
          </h1>
          <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Финальная проверка по всему материалу месяца. Случайная выборка из всех недель.
          </p>
        </header>

        <MonthAccessGate monthId={month.id}>
          <ExamView month={month} />
        </MonthAccessGate>
      </main>
    </div>
  );
}
