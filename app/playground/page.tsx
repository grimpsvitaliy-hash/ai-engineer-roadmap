"use client";

import { useEffect, useMemo, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { CodeEditor } from "@/components/CodeEditor";
import { Button } from "@/components/ui/button";
import { Play, Loader2, Terminal, Trash, Sparkles } from "lucide-react";
import { runPython, extractInputPrompts, type RunResult } from "@/lib/pyodide";

const DEFAULT_CODE = `# Свободная песочница Python
# Пиши код, нажимай "Запустить"

import math

def circle_area(radius: float) -> float:
    return math.pi * radius ** 2

for r in [1, 2, 3, 5]:
    print(f"r={r}: area={circle_area(r):.2f}")
`;

export default function PlaygroundPage() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [inputs, setInputs] = useState<string[]>([]);

  const prompts = useMemo(() => extractInputPrompts(code), [code]);

  useEffect(() => {
    setInputs((prev) =>
      prompts.length === prev.length ? prev : prompts.map((_, i) => prev[i] ?? ""),
    );
  }, [prompts]);

  async function run() {
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

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-6 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-practice/20 bg-practice/5 px-3 py-1 text-xs font-medium text-practice">
            <Sparkles className="h-3 w-3" />
            Python · Pyodide · WebAssembly
          </div>
          <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl">
            Свободная песочница
          </h1>
          <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Пиши и запускай Python прямо в браузере. Никаких установок — только код.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-5">
          <div className="space-y-3 lg:col-span-3">
            <CodeEditor value={code} onChange={setCode} height="480px" />

            {prompts.length > 0 && (
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
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={run} disabled={running} variant="success" size="lg">
                {running ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {running ? "Запускаем..." : "Запустить"}
              </Button>
              <Button variant="outline" size="lg" onClick={() => setCode("")}>
                <Trash className="h-3.5 w-3.5" />
                Очистить
              </Button>
            </div>
          </div>

          <div className="space-y-2 lg:col-span-2">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
              <Terminal className="h-3 w-3" />
              Вывод
            </div>
            <div className="min-h-[480px] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-soft">
              <div className="border-b border-zinc-800/60 bg-zinc-900/50 px-3 py-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                </div>
              </div>
              <div className="p-4 font-mono text-[13px] leading-relaxed text-zinc-100">
                {!result && !running && (
                  <div className="italic text-zinc-500">
                    Запусти код, чтобы увидеть результат.
                    <br />
                    <br />
                    Первый запуск медленный (~10 сек) — грузится Python-интерпретатор.
                    Дальше — мгновенно.
                  </div>
                )}
                {running && (
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Выполняется...
                  </div>
                )}
                {result && (
                  <>
                    {result.output && (
                      <pre className="whitespace-pre-wrap">{result.output}</pre>
                    )}
                    {result.error && (
                      <pre className="mt-2 whitespace-pre-wrap text-red-400">
                        {result.error}
                      </pre>
                    )}
                    {!result.output && !result.error && (
                      <span className="italic text-zinc-500">пусто</span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
