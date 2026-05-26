"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Month, QuizQuestion, PracticeTask } from "@/lib/content/types";
import { Quiz } from "@/components/Quiz";
import { PracticeTaskBlock } from "@/components/PracticeTask";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Code2,
  Trophy,
  RotateCw,
  AlertOctagon,
  Check,
  Sparkles,
  ArrowRight,
  Play,
  ListChecks,
  Target,
} from "lucide-react";
import {
  EXAM_CONFIG,
  generateExamSelection,
  resolveExamQuestion,
  resolveExamPractice,
  evaluateExamState,
  buildExamAttempt,
  findNextMonth,
} from "@/lib/exam";
import {
  examLessonId,
  finishExam,
  getMonthExam,
  startExam,
  type ExamAttempt,
  type ExamConfig,
} from "@/lib/progress";
import { cn } from "@/lib/utils";

type ViewMode = "setup" | "active" | "result";

function renderQuizQuestionsFromExam(
  month: Month,
  current: ExamConfig,
): QuizQuestion[] {
  return current.questionIds
    .map((examQid) => {
      const q = resolveExamQuestion(month, examQid);
      if (!q) return null;
      // Переопределяем id на полный, чтобы Quiz хранил ответы без конфликтов
      return { ...q, id: examQid };
    })
    .filter((q): q is QuizQuestion => q !== null);
}

function renderPracticesFromExam(
  month: Month,
  current: ExamConfig,
): PracticeTask[] {
  return current.practiceIds
    .map((examPid) => {
      const t = resolveExamPractice(month, examPid);
      if (!t) return null;
      return { ...t, id: examPid };
    })
    .filter((t): t is PracticeTask => t !== null);
}

export function ExamView({ month }: { month: Month }) {
  const [mode, setMode] = useState<ViewMode>("setup");
  const [tab, setTab] = useState<string>("quiz");
  const [tick, setTick] = useState(0);
  const [lastAttempt, setLastAttempt] = useState<ExamAttempt | null>(null);

  // Инициализация: определяем начальный режим
  useEffect(() => {
    const exam = getMonthExam(month.id);
    if (exam.current) {
      setMode("active");
    } else if (exam.attempts.length > 0) {
      setMode("result");
      setLastAttempt(exam.attempts[0]);
    } else {
      setMode("setup");
    }

    const handler = () => setTick((t) => t + 1);
    window.addEventListener("progress-updated", handler);
    return () => window.removeEventListener("progress-updated", handler);
  }, [month.id]);

  // Текущая конфигурация
  const exam = useMemo(() => getMonthExam(month.id), [month.id, tick]);
  const current = exam.current;

  // Реальные объекты квизов и практик
  const quizQuestions = useMemo(
    () => (current ? renderQuizQuestionsFromExam(month, current) : []),
    [month, current],
  );
  const practiceTasks = useMemo(
    () => (current ? renderPracticesFromExam(month, current) : []),
    [month, current],
  );

  // Текущая статистика
  const stats = useMemo(() => evaluateExamState(month.id), [month.id, tick]);

  function handleStart() {
    const selection = generateExamSelection(month);
    startExam(month.id, selection.questionIds, selection.practiceIds);
    setMode("active");
    setTab("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmit() {
    const attempt = buildExamAttempt(month.id);
    if (!attempt) return;
    finishExam(month.id, attempt);
    setLastAttempt(attempt);
    setMode("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleRetry() {
    handleStart();
  }

  // ────────── SETUP MODE ──────────
  if (mode === "setup") {
    return <SetupView month={month} onStart={handleStart} attempts={exam.attempts} />;
  }

  // ────────── RESULT MODE ──────────
  if (mode === "result" && lastAttempt) {
    return (
      <ResultView
        month={month}
        attempt={lastAttempt}
        onRetry={handleRetry}
      />
    );
  }

  // ────────── ACTIVE MODE ──────────
  if (!current) {
    // safeguard
    return <SetupView month={month} onStart={handleStart} attempts={exam.attempts} />;
  }

  const canSubmit = stats.correctQuizCount > 0 || stats.donePracticeCount > 0;

  return (
    <div className="space-y-6">
      {/* Прогресс-панель */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-quiz/30 bg-quiz/5 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-quiz" />
              <span className="text-xs font-semibold uppercase tracking-wider text-quiz">
                Опросник
              </span>
            </div>
            <span
              className={cn(
                "text-xs font-medium",
                stats.correctQuizCount >= EXAM_CONFIG.requiredQuizCorrect
                  ? "text-success"
                  : "text-muted-foreground",
              )}
            >
              нужно ≥ {EXAM_CONFIG.requiredQuizCorrect}
            </span>
          </div>
          <div className="mt-2 text-2xl font-semibold tabular-nums">
            {stats.correctQuizCount}
            <span className="text-base text-muted-foreground"> / {stats.totalQuiz}</span>
          </div>
          <Progress
            value={(stats.correctQuizCount / Math.max(1, stats.totalQuiz)) * 100}
            className="mt-2 h-1.5"
          />
        </div>

        <div className="rounded-xl border border-practice/30 bg-practice/5 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-practice" />
              <span className="text-xs font-semibold uppercase tracking-wider text-practice">
                Практика
              </span>
            </div>
            <span
              className={cn(
                "text-xs font-medium",
                stats.donePracticeCount >= EXAM_CONFIG.requiredPracticeDone
                  ? "text-success"
                  : "text-muted-foreground",
              )}
            >
              нужно ≥ {EXAM_CONFIG.requiredPracticeDone}
            </span>
          </div>
          <div className="mt-2 text-2xl font-semibold tabular-nums">
            {stats.donePracticeCount}
            <span className="text-base text-muted-foreground"> / {stats.totalPractice}</span>
          </div>
          <Progress
            value={(stats.donePracticeCount / Math.max(1, stats.totalPractice)) * 100}
            className="mt-2 h-1.5"
          />
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="quiz" accentColor="quiz">
            <Brain className="h-3.5 w-3.5" />
            Опросник
            <span className="text-[10px] opacity-70 tabular-nums">
              {quizQuestions.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="practice" accentColor="practice">
            <Code2 className="h-3.5 w-3.5" />
            Практика
            <span className="text-[10px] opacity-70 tabular-nums">
              {practiceTasks.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quiz">
          <Quiz questions={quizQuestions} lessonId={examLessonId(month.id)} />
          <button
            onClick={() => {
              setTab("practice");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="mt-8 group block w-full overflow-hidden rounded-xl border border-border bg-surface text-left shadow-soft transition-all hover:-translate-y-0.5 hover:border-practice/40"
          >
            <div className="h-1 w-full bg-gradient-to-r from-practice to-emerald-400" />
            <div className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-practice/10 text-practice">
                <Code2 className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Дальше
                </div>
                <div className="mt-0.5 text-base font-semibold leading-tight tracking-tight">
                  Перейти к практике
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        </TabsContent>

        <TabsContent value="practice">
          <div className="mb-4">
            <Callout variant="tip">
              Запусти код в браузере, проверь что работает, нажми «Отметить сделанной». Засчитывается само нажатие — Pyodide не проверяет правильность результата.
            </Callout>
          </div>
          <div className="space-y-4">
            {practiceTasks.map((task, i) => (
              <PracticeTaskBlock
                key={task.id}
                task={task}
                index={i}
                total={practiceTasks.length}
                lessonId={examLessonId(month.id)}
              />
            ))}
          </div>

          <div className="mt-10 overflow-hidden rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-quiz/5 shadow-soft">
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <Target className="h-4 w-4" />
                Сдать экзамен
              </div>
              <h3 className="mt-2 text-xl font-semibold tracking-tight">
                Готов завершить?
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Текущий результат: <strong>{stats.correctQuizCount} / {stats.totalQuiz}</strong> правильных ответов и{" "}
                <strong>{stats.donePracticeCount} / {stats.totalPractice}</strong> отмеченных практик.
                {!stats.wouldPass && (
                  <>
                    {" "}Для прохождения нужно ≥ {EXAM_CONFIG.requiredQuizCorrect} ответов и ≥ {EXAM_CONFIG.requiredPracticeDone} практик.
                  </>
                )}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={handleSubmit} disabled={!canSubmit}>
                  <ListChecks className="h-4 w-4" />
                  {stats.wouldPass ? "Завершить и сдать" : "Завершить с текущим результатом"}
                </Button>
                {!stats.wouldPass && (
                  <span className="self-center text-xs text-muted-foreground">
                    Можно продолжить отвечать и нажать позже
                  </span>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Setup view — приглашение начать экзамен
// ────────────────────────────────────────────────────────────

function SetupView({
  month,
  onStart,
  attempts,
}: {
  month: Month;
  onStart: () => void;
  attempts: ExamAttempt[];
}) {
  const failedAttempts = attempts.filter((a) => !a.passed);

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-quiz/5 shadow-soft">
        <div className="h-1 bg-gradient-to-r from-primary to-quiz" />
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-4 w-4" />
            Финальный экзамен
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tighter sm:text-3xl">
            Готов проверить себя?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Экзамен покрывает все недели месяца {month.number}. Вопросы и задачи выбираются <strong>случайно</strong> из материалов недель — при каждом старте они новые.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-quiz/30 bg-quiz/5 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-quiz">
                <Brain className="h-3.5 w-3.5" />
                Опросник
              </div>
              <div className="mt-1.5 text-2xl font-semibold tabular-nums">
                {EXAM_CONFIG.questionCount} вопросов
              </div>
              <div className="text-xs text-muted-foreground">
                Для прохождения: <strong>≥ {EXAM_CONFIG.requiredQuizCorrect} правильных</strong>
              </div>
            </div>
            <div className="rounded-lg border border-practice/30 bg-practice/5 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-practice">
                <Code2 className="h-3.5 w-3.5" />
                Практика
              </div>
              <div className="mt-1.5 text-2xl font-semibold tabular-nums">
                {EXAM_CONFIG.practiceCount} задач
              </div>
              <div className="text-xs text-muted-foreground">
                Для прохождения: <strong>≥ {EXAM_CONFIG.requiredPracticeDone} сделанных</strong>
              </div>
            </div>
          </div>

          {failedAttempts.length > 0 && (
            <div className="mt-5">
              <Callout variant="warning" title="Предыдущие попытки">
                Не пройдено: <strong>{failedAttempts.length}</strong>. Каждый раз вопросы и задачи выбираются заново.
              </Callout>
            </div>
          )}

          <div className="mt-6">
            <Button size="lg" onClick={onStart}>
              <Play className="h-4 w-4" />
              Начать экзамен
            </Button>
          </div>
        </div>
      </div>

      <Callout variant="info" title="Важно про блокировку">
        Пока экзамен этого месяца не сдан — следующий месяц <strong>заблокирован</strong>. Это нужно чтобы ты не пропускал важные основы.
      </Callout>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Result view — итог попытки
// ────────────────────────────────────────────────────────────

function ResultView({
  month,
  attempt,
  onRetry,
}: {
  month: Month;
  attempt: ExamAttempt;
  onRetry: () => void;
}) {
  const next = findNextMonth(month.id);

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "overflow-hidden rounded-xl border shadow-soft",
          attempt.passed
            ? "border-success/40 bg-gradient-to-br from-success/10 to-practice/5"
            : "border-danger/40 bg-gradient-to-br from-danger/10 to-warning/5",
        )}
      >
        <div
          className={cn(
            "h-1.5 bg-gradient-to-r",
            attempt.passed ? "from-success to-practice" : "from-danger to-warning",
          )}
        />
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl",
                attempt.passed ? "bg-success/15 text-success" : "bg-danger/15 text-danger",
              )}
            >
              {attempt.passed ? (
                <Trophy className="h-6 w-6" />
              ) : (
                <AlertOctagon className="h-6 w-6" />
              )}
            </div>
            <div>
              <div
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider",
                  attempt.passed ? "text-success" : "text-danger",
                )}
              >
                {attempt.passed ? "Экзамен сдан" : "Экзамен не пройден"}
              </div>
              <h2 className="mt-0.5 text-2xl font-semibold tracking-tight">
                {attempt.passed ? "🎉 Поздравляю!" : "Попробуй ещё раз"}
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Brain className="h-3.5 w-3.5" />
                Опросник
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-semibold tabular-nums">
                  {attempt.correctQuizCount}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {attempt.questionIds.length}
                </span>
                <span
                  className={cn(
                    "ml-auto text-xs font-medium",
                    attempt.correctQuizCount >= EXAM_CONFIG.requiredQuizCorrect
                      ? "text-success"
                      : "text-danger",
                  )}
                >
                  {attempt.correctQuizCount >= EXAM_CONFIG.requiredQuizCorrect ? "✓" : "✗"} нужно ≥ {EXAM_CONFIG.requiredQuizCorrect}
                </span>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Code2 className="h-3.5 w-3.5" />
                Практика
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-semibold tabular-nums">
                  {attempt.donePracticeCount}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {attempt.practiceIds.length}
                </span>
                <span
                  className={cn(
                    "ml-auto text-xs font-medium",
                    attempt.donePracticeCount >= EXAM_CONFIG.requiredPracticeDone
                      ? "text-success"
                      : "text-danger",
                  )}
                >
                  {attempt.donePracticeCount >= EXAM_CONFIG.requiredPracticeDone ? "✓" : "✗"} нужно ≥ {EXAM_CONFIG.requiredPracticeDone}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {attempt.passed ? (
              next ? (
                <Link href={`/month/${next.id}`}>
                  <Button size="lg">
                    Перейти к месяцу {next.number}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Это был последний месяц курса. Поздравляю с финишем!
                </div>
              )
            ) : (
              <Button size="lg" onClick={onRetry}>
                <RotateCw className="h-4 w-4" />
                Попробовать снова
              </Button>
            )}

            <Link href={`/month/${month.id}`}>
              <Button size="lg" variant="outline">
                К обзору месяца
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {!attempt.passed && (
        <Callout variant="info" title="Что делать">
          Вернись к неделям где ошибся — заглянь в Теорию и Опросник, разберись с пробелами. При новой попытке вопросы и задачи будут <strong>другие</strong> — это не зубрёжка, это понимание.
        </Callout>
      )}

      {attempt.passed && next && (
        <Callout variant="tip">
          Следующий месяц <strong>{next.title}</strong> теперь доступен. Удачи!
        </Callout>
      )}
    </div>
  );
}
