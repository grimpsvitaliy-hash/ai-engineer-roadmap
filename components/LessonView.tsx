"use client";

import { useEffect, useState } from "react";
import type { Lesson } from "@/lib/content/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TheoryRenderer } from "@/components/TheoryRenderer";
import { Quiz } from "@/components/Quiz";
import { PracticeTaskBlock } from "@/components/PracticeTask";
import { NextStepButton } from "@/components/NextStepButton";
import { Callout } from "@/components/ui/callout";
import { BookOpen, Brain, Code2, CheckSquare } from "lucide-react";

export function LessonView({
  lesson,
  nextWeek,
}: {
  lesson: Lesson;
  nextWeek: { id: string; title: string } | null;
}) {
  const [tab, setTab] = useState<string>("theory");

  // Скроллим наверх при переключении вкладки
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tab]);

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value="theory" accentColor="theory">
          <BookOpen className="h-3.5 w-3.5" />
          Теория
          <span className="text-[10px] opacity-70 tabular-nums">
            {lesson.theory.length}
          </span>
        </TabsTrigger>
        <TabsTrigger value="quiz" accentColor="quiz">
          <Brain className="h-3.5 w-3.5" />
          Опросник
          <span className="text-[10px] opacity-70 tabular-nums">
            {lesson.quiz.length}
          </span>
        </TabsTrigger>
        <TabsTrigger value="practice" accentColor="practice">
          <Code2 className="h-3.5 w-3.5" />
          Практика
          <span className="text-[10px] opacity-70 tabular-nums">
            {lesson.practice.length}
          </span>
        </TabsTrigger>
        <TabsTrigger value="checkpoint" accentColor="checkpoint">
          <CheckSquare className="h-3.5 w-3.5" />
          Чекпоинт
        </TabsTrigger>
      </TabsList>

      <TabsContent value="theory">
        <TheoryRenderer sections={lesson.theory} lessonId={lesson.id} />
        <NextStepButton
          color="quiz"
          subtitle="Дальше"
          label="Перейти к опроснику"
          onClick={() => setTab("quiz")}
        />
      </TabsContent>

      <TabsContent value="quiz">
        <Quiz questions={lesson.quiz} lessonId={lesson.id} />
        <NextStepButton
          color="practice"
          subtitle="Дальше"
          label="Перейти к практике"
          onClick={() => setTab("practice")}
        />
      </TabsContent>

      <TabsContent value="practice">
        <div className="mb-4">
          <Callout variant="tip">
            Код запускается в браузере через Pyodide (Python в WebAssembly). Первый запуск ~10 сек — потом мгновенно. Задачи с пометкой «Локально» делаются на твоём компьютере.
          </Callout>
        </div>
        <div className="space-y-4">
          {lesson.practice.map((task, i) => (
            <PracticeTaskBlock
              key={task.id}
              task={task}
              index={i}
              total={lesson.practice.length}
              lessonId={lesson.id}
            />
          ))}
        </div>
        <NextStepButton
          color="checkpoint"
          subtitle="Дальше"
          label="Перейти к чекпоинту"
          onClick={() => setTab("checkpoint")}
        />
      </TabsContent>

      <TabsContent value="checkpoint">
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
          <div className="h-1 bg-gradient-to-r from-checkpoint to-orange-500" />
          <div className="p-6">
            <div className="mb-1 font-mono text-xs font-semibold uppercase tracking-wider text-checkpoint">
              Чекпоинт недели
            </div>
            <h2 className="mb-5 text-lg font-semibold tracking-tight">
              Что должно быть готово
            </h2>
            <ul className="space-y-2">
              {lesson.checkpoint.map((item, i) => (
                <li
                  key={i}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-surface-2/50 px-3.5 py-3 transition-colors hover:border-checkpoint/30 hover:bg-checkpoint/5"
                >
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-checkpoint/10 font-mono text-[10px] font-semibold tabular-nums text-checkpoint">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <Callout variant="info">
                Не двигайся к следующей неделе, пока не закрыл чеклист. Лучше потратить лишний день, чем накопить пробелы.
              </Callout>
            </div>
          </div>
        </div>

        {nextWeek ? (
          <NextStepButton
            color="primary"
            subtitle="Следующая неделя"
            label={nextWeek.title}
            href={`/week/${nextWeek.id}`}
          />
        ) : (
          <div className="mt-10 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-quiz/5 p-6 text-center shadow-soft">
            <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Конец курса
            </div>
            <div className="mt-2 text-lg font-semibold tracking-tight">
              Это была последняя неделя 🎉
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Заверши чекпоинт и опубликуй ретроспективу — ты прошёл весь roadmap.
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
