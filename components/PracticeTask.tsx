"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { PracticeTask } from "@/lib/content/types";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { CodeEditor } from "@/components/CodeEditor";
import {
  Play,
  RotateCcw,
  Eye,
  EyeOff,
  Check,
  Lightbulb,
  Terminal,
  Loader2,
  MapPin,
} from "lucide-react";
import { extractInputPrompts, runPython, type RunResult } from "@/lib/pyodide";
import {
  getLessonProgress,
  markPracticeDone,
  unmarkPracticeDone,
} from "@/lib/progress";
import { cn } from "@/lib/utils";

function MD({ children }: { children: string }) {
  return (
    <div className="prose-custom">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}

export function PracticeTaskBlock({
  task,
  index,
  total,
  lessonId,
}: {
  task: PracticeTask;
  index: number;
  total: number;
  lessonId: string;
}) {
  const [code, setCode] = useState(task.starterCode);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [shownHints, setShownHints] = useState<number>(0);
  const [done, setDone] = useState(false);
  const [inputs, setInputs] = useState<string[]>([]);

  const prompts = useMemo(
    () => (task.runnable ? extractInputPrompts(code) : []),
    [code, task.runnable],
  );

  useEffect(() => {
    const p = getLessonProgress(lessonId);
    setDone(p.practiceCompleted.includes(task.id));
  }, [lessonId, task.id]);

  useEffect(() => {
    setInputs((prev) =>
      prompts.length === prev.length ? prev : prompts.map((_, i) => prev[i] ?? ""),
    );
  }, [prompts]);

  async function handleRun() {
    setRunning(true);
    setResult(null);
    try {
      const r = await runPython(code, { stdinLines: inputs });
      setResult(r);
    } catch (e) {
      setResult({ output: "", error: e instanceof Error ? e.message : String(e) });
    } finally {
      setRunning(false);
    }
  }

  function handleReset() {
    setCode(task.starterCode);
    setResult(null);
    setShowSolution(false);
    setShownHints(0);
  }

  function toggleDone() {
    if (done) {
      unmarkPracticeDone(lessonId, task.id);
      setDone(false);
    } else {
      markPracticeDone(lessonId, task.id);
      setDone(true);
    }
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-surface shadow-soft transition-all",
        done ? "border-success/30" : "border-border",
      )}
    >
      {/* Цветная полоска сверху */}
      <div
        className={cn(
          "h-1 w-full",
          done ? "bg-success" : task.runnable ? "bg-practice/40" : "bg-warning/40",
        )}
      />

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-muted-foreground">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            {!task.runnable && (
              <span className="inline-flex items-center gap-1 rounded-md border border-warning/30 bg-warning/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-warning">
                <MapPin className="h-2.5 w-2.5" /> Локально
              </span>
            )}
            {done && (
              <span className="inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                <Check className="h-3 w-3" /> Сделано
              </span>
            )}
          </div>
          <Button size="sm" variant={done ? "ghost" : "outline"} onClick={toggleDone}>
            {done ? "Отменить" : "Отметить сделанной"}
          </Button>
        </div>

        <h3 className="text-base font-semibold tracking-tight">{task.title}</h3>

        <MD>{task.description}</MD>

        <CodeEditor
          value={code}
          onChange={setCode}
          language={task.language}
          height="300px"
        />

        {task.runnable && prompts.length > 0 && (
          <div className="rounded-xl border border-border bg-surface-2/50 p-3.5">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Terminal className="h-3 w-3" />
              Ввод для input() ({prompts.length}):
            </div>
            <div className="space-y-1.5">
              {prompts.map((prompt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="min-w-0 flex-shrink-0 truncate text-[12px] text-muted-foreground">
                    {prompt || `Ввод ${i + 1}:`}
                  </span>
                  <input
                    type="text"
                    value={inputs[i] ?? ""}
                    onChange={(e) =>
                      setInputs((prev) => {
                        const next = [...prev];
                        next[i] = e.target.value;
                        return next;
                      })
                    }
                    className="flex-1 rounded-md border border-border bg-surface px-2 py-1 font-mono text-xs focus:border-practice focus:outline-none focus:ring-2 focus:ring-practice/20"
                    placeholder="значение"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {task.runnable && (
            <Button onClick={handleRun} disabled={running} variant="success">
              {running ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
              {running ? "Запускаем..." : "Запустить"}
            </Button>
          )}
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-3.5 w-3.5" />
            Сбросить
          </Button>
          {task.hints && task.hints.length > shownHints && (
            <Button variant="ghost" onClick={() => setShownHints((n) => n + 1)}>
              <Lightbulb className="h-3.5 w-3.5" />
              Подсказка {shownHints + 1} / {task.hints.length}
            </Button>
          )}
          {task.solutionCode && (
            <Button
              variant="ghost"
              onClick={() => setShowSolution((s) => !s)}
              className="ml-auto"
            >
              {showSolution ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
              {showSolution ? "Скрыть решение" : "Показать решение"}
            </Button>
          )}
        </div>

        {task.hints && shownHints > 0 && (
          <div className="space-y-2">
            {task.hints.slice(0, shownHints).map((h, i) => (
              <Callout key={i} variant="tip" title={`Подсказка ${i + 1}`}>
                {h}
              </Callout>
            ))}
          </div>
        )}

        {result && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
              <Terminal className="h-3 w-3" />
              Вывод
            </div>
            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
              <div className="border-b border-zinc-800/60 bg-zinc-900/50 px-3 py-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                </div>
              </div>
              <div className="p-3.5 font-mono text-[13px] leading-relaxed text-zinc-100">
                {result.output && (
                  <pre className="whitespace-pre-wrap">{result.output}</pre>
                )}
                {result.error && (
                  <pre className="whitespace-pre-wrap text-red-400">
                    {result.error}
                  </pre>
                )}
                {!result.output && !result.error && (
                  <span className="italic text-zinc-500">пусто</span>
                )}
              </div>
            </div>
          </div>
        )}

        {showSolution && task.solutionCode && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
              <Eye className="h-3 w-3" />
              Эталонное решение
            </div>
            <CodeEditor
              value={task.solutionCode}
              language={task.language}
              height="280px"
              readOnly
            />
            <Callout variant="warning">
              Сначала попробуй сам. Решение — для сравнения, а не для копирования.
            </Callout>
          </div>
        )}
      </div>
    </div>
  );
}
