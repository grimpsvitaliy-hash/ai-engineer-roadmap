import Link from "next/link";
import { roadmap } from "@/lib/content";
import { TopNav } from "@/components/TopNav";
import { GlobalStats } from "@/components/GlobalStats";
import { MonthCard } from "@/components/MonthCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Target } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        <div className="space-y-16">
          {/* HERO */}
          <section className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
            {/* Декоративный фон */}
            <div className="absolute inset-0 bg-dot-pattern opacity-50" />
            <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-quiz/15 blur-3xl" />

            <div className="relative space-y-6 p-8 sm:p-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3 w-3" />
                6 месяцев · 5–10 ч/нед · с нуля
              </div>

              <div className="space-y-3">
                <h1 className="max-w-2xl text-4xl font-semibold tracking-tighter sm:text-5xl">
                  От нуля к{" "}
                  <span className="gradient-text">Applied AI Engineer</span>
                  <span className="text-muted-foreground">.</span>
                </h1>
                <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                  Интерактивная программа: теория, проверочные вопросы и практика на Python
                  с запуском прямо в браузере. Прогресс сохраняется автоматически.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link href="/week/m1-w1">
                  <Button size="lg">
                    Начать с недели 1
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/month/month-01">
                  <Button size="lg" variant="outline">
                    Обзор месяца 1
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* STATS */}
          <section className="space-y-3">
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Прогресс
              </h2>
            </div>
            <GlobalStats />
          </section>

          {/* PLAN */}
          <section className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                План
              </h2>
              <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
                {roadmap.months.filter((m) => m.available).length} /{" "}
                {roadmap.months.length}
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {roadmap.months.map((month) => (
                <MonthCard key={month.id} month={month} />
              ))}
            </div>
          </section>

          {/* PRINCIPLES */}
          <section className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Без математики",
                text: "Applied AI — про сборку продуктов на готовых LLM, а не обучение моделей.",
                icon: <Zap className="h-4 w-4" />,
                color: "text-theory bg-theory/10",
              },
              {
                title: "GitHub с первой недели",
                text: "26 недель публичных коммитов — лучшее портфолио для джуна.",
                icon: <Sparkles className="h-4 w-4" />,
                color: "text-quiz bg-quiz/10",
              },
              {
                title: "Цель — оффер",
                text: "К концу: 3 проекта, 1 задеплоенный, резюме на английском, опыт интервью.",
                icon: <Target className="h-4 w-4" />,
                color: "text-practice bg-practice/10",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-surface p-5 shadow-soft transition-shadow hover:shadow-soft-lg"
              >
                <div
                  className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg ${f.color}`}
                >
                  {f.icon}
                </div>
                <div className="text-sm font-semibold tracking-tight">{f.title}</div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  {f.text}
                </p>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
