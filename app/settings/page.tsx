"use client";

import { useRef, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { GitHubSync } from "@/components/GitHubSync";
import {
  Download,
  Upload,
  Trash2,
  Cloud,
  Github,
  HardDrive,
  Mail,
  Smartphone,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  downloadProgress,
  importProgress,
  resetAllProgress,
  type ImportResult,
} from "@/lib/progress";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importMode, setImportMode] = useState<"replace" | "merge">("merge");
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  async function handleImport(file: File) {
    setLoading(true);
    setImportResult(null);
    try {
      const text = await file.text();
      const result = importProgress(text, importMode);
      setImportResult(result);
    } catch (e) {
      setImportResult({
        ok: false,
        error: e instanceof Error ? e.message : "Не удалось прочитать файл",
      });
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function handleReset() {
    if (!resetConfirm) {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 4000);
      return;
    }
    resetAllProgress();
    setResetConfirm(false);
    setImportResult(null);
  }

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-10 space-y-3">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Настройки
          </div>
          <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl">
            Прогресс и синхронизация
          </h1>
          <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Прогресс хранится в твоём браузере (localStorage). Чтобы заниматься с нескольких устройств — экспортируй и импортируй его как JSON-файл.
          </p>
        </header>

        <div className="space-y-6">
          {/* GITHUB SYNC */}
          <GitHubSync />

          <div className="relative my-2 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              или вручную через файлы
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* DOWNLOAD */}
          <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
            <div className="h-1 bg-gradient-to-r from-theory to-primary" />
            <div className="space-y-4 p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-theory/10 text-theory">
                  <Download className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold tracking-tight">
                    Скачать прогресс
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Сохранит JSON-файл со всеми прочитанными разделами, ответами на квизы и закрытыми практиками.
                  </p>
                </div>
              </div>
              <Button onClick={downloadProgress}>
                <Download className="h-4 w-4" />
                Скачать ai-engineer-progress.json
              </Button>
            </div>
          </section>

          {/* UPLOAD */}
          <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
            <div className="h-1 bg-gradient-to-r from-practice to-success" />
            <div className="space-y-4 p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-practice/10 text-practice">
                  <Upload className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold tracking-tight">
                    Загрузить прогресс
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Восстановить прогресс из ранее скачанного JSON-файла.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Режим
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    onClick={() => setImportMode("merge")}
                    className={cn(
                      "rounded-xl border-2 p-3 text-left transition-all",
                      importMode === "merge"
                        ? "border-practice bg-practice/5"
                        : "border-border hover:border-border-strong",
                    )}
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      {importMode === "merge" && (
                        <Check className="h-4 w-4 text-practice" />
                      )}
                      Объединить (рекомендую)
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Берёт лучшее из обоих: правильные квизы, прочитанные разделы.
                      Ничего не теряется.
                    </div>
                  </button>
                  <button
                    onClick={() => setImportMode("replace")}
                    className={cn(
                      "rounded-xl border-2 p-3 text-left transition-all",
                      importMode === "replace"
                        ? "border-warning bg-warning/5"
                        : "border-border hover:border-border-strong",
                    )}
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      {importMode === "replace" && (
                        <Check className="h-4 w-4 text-warning" />
                      )}
                      Заменить
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Полностью заменит текущий прогресс на тот, что в файле. Несохранённое здесь — потеряется.
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImport(f);
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() => fileRef.current?.click()}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Выбрать JSON-файл
                </Button>
              </div>

              {importResult && (
                <Callout
                  variant={importResult.ok ? "tip" : "danger"}
                  title={importResult.ok ? "Импортировано" : "Ошибка"}
                >
                  {importResult.ok ? (
                    <div className="space-y-1">
                      <div>
                        Режим: <strong>{importResult.merged ? "объединение" : "замена"}</strong>
                      </div>
                      <div>
                        Уроков: <strong>{importResult.stats.lessons}</strong> · правильных
                        ответов: <strong>{importResult.stats.quizCorrect}</strong> · практик:{" "}
                        <strong>{importResult.stats.practice}</strong>
                      </div>
                    </div>
                  ) : (
                    importResult.error
                  )}
                </Callout>
              )}
            </div>
          </section>

          {/* SYNC RECIPES */}
          <section className="rounded-xl border border-border bg-surface p-6 shadow-soft">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Cloud className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  Как организовать синхронизацию
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Несколько рабочих сценариев — выбери удобный.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Recipe
                icon={<HardDrive className="h-4 w-4" />}
                title="Через облачный диск (проще всего)"
                color="theory"
              >
                Скачай JSON → положи в <strong>Dropbox / Google Drive / Яндекс.Диск</strong>.
                На другом устройстве открой приложение → Настройки → Загрузить → выбери файл из той же папки.
                Режим «Объединить» — безопаснее.
              </Recipe>

              <Recipe
                icon={<Mail className="h-4 w-4" />}
                title="Через email самому себе"
                color="quiz"
              >
                Скачал → отправил себе на почту → на другом устройстве открыл письмо, скачал файл, импортировал.
                Подходит если работаешь с 2-3 устройствами и не хочешь подключать облако.
              </Recipe>

              <Recipe
                icon={<Smartphone className="h-4 w-4" />}
                title="Через мессенджер (Telegram Saved Messages)"
                color="practice"
              >
                Telegram → «Избранное» (Saved Messages) → перетащи файл туда. На любом устройстве со своим аккаунтом скачаешь обратно.
              </Recipe>

              <Recipe
                icon={<Github className="h-4 w-4" />}
                title="Через GitHub Gist (для гиков)"
                color="checkpoint"
              >
                Создай <strong>приватный gist</strong> на gist.github.com → положи туда JSON → правь руками когда нужно синхронизироваться.
                Если захочешь автоматическую синхронизацию через GitHub API — напиши, добавлю кнопку «Sync to Gist».
              </Recipe>
            </div>
          </section>

          {/* RESET */}
          <section className="overflow-hidden rounded-xl border border-danger/20 bg-danger/[0.02] shadow-soft">
            <div className="space-y-3 p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold tracking-tight">
                    Опасная зона
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Полностью удалить весь прогресс на этом устройстве. Это нельзя отменить.
                  </p>
                </div>
              </div>
              <div>
                <Button variant="danger" onClick={handleReset}>
                  <Trash2 className="h-4 w-4" />
                  {resetConfirm ? "Точно? Нажми ещё раз" : "Сбросить весь прогресс"}
                </Button>
                {resetConfirm && (
                  <span className="ml-3 text-xs text-muted-foreground">
                    подтверждение действует 4 сек
                  </span>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function Recipe({
  icon,
  title,
  children,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  color: "theory" | "quiz" | "practice" | "checkpoint";
}) {
  const colorClass = {
    theory: "bg-theory/10 text-theory",
    quiz: "bg-quiz/10 text-quiz",
    practice: "bg-practice/10 text-practice",
    checkpoint: "bg-checkpoint/10 text-checkpoint",
  };
  return (
    <div className="rounded-xl border border-border bg-surface-2/40 p-4">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg",
            colorClass[color],
          )}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold leading-tight">{title}</div>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}
