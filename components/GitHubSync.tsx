"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { cn } from "@/lib/utils";
import {
  Github,
  Loader2,
  Check,
  X,
  ExternalLink,
  Eye,
  EyeOff,
  RotateCw,
  Unlink,
  Cloud,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  clearSyncConfig,
  loadSyncConfig,
  pullNow,
  pushNow,
  saveSyncConfig,
  subscribeSyncStatus,
  syncNow,
  verifyToken,
  type SyncConfig,
  type SyncStatus,
} from "@/lib/github-sync";

function formatAgo(ts: number): string {
  if (!ts) return "никогда";
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 5) return "только что";
  if (diff < 60) return `${diff} сек назад`;
  if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
  return new Date(ts).toLocaleDateString();
}

export function GitHubSync() {
  const [cfg, setCfg] = useState<SyncConfig | null>(null);
  const [token, setToken] = useState("");
  const [gistIdInput, setGistIdInput] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ login: string; avatar_url: string } | null>(null);
  const [status, setStatus] = useState<SyncStatus>({ kind: "idle" });
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setCfg(loadSyncConfig());
    const handler = () => setCfg(loadSyncConfig());
    window.addEventListener("sync-config-updated", handler);
    const unsub = subscribeSyncStatus((s) => setStatus(s));
    return () => {
      window.removeEventListener("sync-config-updated", handler);
      unsub();
    };
  }, []);

  // Перерисовываем формат «X минут назад» каждую минуту
  const [, forceTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => forceTick((t) => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  async function handleConnect() {
    setVerifying(true);
    setError(null);
    setUser(null);
    try {
      const result = await verifyToken(token.trim());
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setUser({ login: result.user.login, avatar_url: result.user.avatar_url });
      const cleanGistId = gistIdInput.trim() || null;
      saveSyncConfig({
        token: token.trim(),
        gistId: cleanGistId,
        lastPushAt: 0,
        lastPullAt: 0,
        enabled: true,
      });
      setToken("");
      setGistIdInput("");
      // Сразу пробуем синк
      void syncNow();
    } finally {
      setVerifying(false);
    }
  }

  function handleDisconnect() {
    clearSyncConfig();
    setUser(null);
    setError(null);
  }

  if (!cfg) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 shadow-soft">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isConnected = cfg.enabled && cfg.token;

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
      <div className="h-1 bg-gradient-to-r from-zinc-800 via-quiz to-primary" />
      <div className="space-y-5 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white">
            <Github className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                Облачная синхронизация через GitHub
              </h2>
              {isConnected && (
                <span className="inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                  <Check className="h-3 w-3" /> Подключено
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Автоматическое сохранение прогресса в приватный GitHub Gist. Открыл на другом устройстве — оно само подтянет последнюю версию.
            </p>
          </div>
        </div>

        {!isConnected ? (
          <>
            <button
              onClick={() => setShowHelp((v) => !v)}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-surface-2/50 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
            >
              <span>Как получить Personal Access Token (1 минута)</span>
              {showHelp ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {showHelp && (
              <div className="space-y-3 rounded-xl border border-border bg-surface-2/40 p-4 text-sm">
                <ol className="ml-4 list-decimal space-y-2 text-foreground/85">
                  <li>
                    Открой{" "}
                    <a
                      href="https://github.com/settings/tokens/new?description=AI%20Engineer%20Roadmap&scopes=gist"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
                    >
                      github.com/settings/tokens
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <div className="text-xs text-muted-foreground">
                      Ссылка откроет форму создания токена с уже выбранным scope <code className="rounded bg-zinc-200 px-1 py-0.5 text-[11px] dark:bg-zinc-800">gist</code>.
                    </div>
                  </li>
                  <li>
                    <strong>Note</strong> — можно оставить «AI Engineer Roadmap».
                  </li>
                  <li>
                    <strong>Expiration</strong> — выбери срок (рекомендую <em>90 days</em> или <em>1 year</em>; <em>No expiration</em> — на свой риск).
                  </li>
                  <li>
                    <strong>Select scopes</strong> — должна быть выбрана <code className="rounded bg-zinc-200 px-1 py-0.5 text-[11px] dark:bg-zinc-800">gist</code> (и больше ничего).
                  </li>
                  <li>
                    Прокрути вниз → <strong>Generate token</strong> → <strong>скопируй</strong> токен (показывается только один раз!) → вставь в поле ниже.
                  </li>
                </ol>
                <Callout variant="info">
                  Токен хранится только в твоём браузере (localStorage). Если потерял токен или сменил девайс — создай новый, старый можно отозвать.
                </Callout>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Personal Access Token
                </label>
                <div className="relative">
                  <input
                    type={showToken ? "text" : "password"}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="ghp_... или github_pat_..."
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 pr-10 font-mono text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-surface-2"
                  >
                    {showToken ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Gist ID — опционально
                </label>
                <input
                  type="text"
                  value={gistIdInput}
                  onChange={(e) => setGistIdInput(e.target.value)}
                  placeholder="оставь пустым — создастся автоматически"
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="mt-1 text-xs text-muted-foreground">
                  Если у тебя уже есть gist с прогрессом (например, ты подключаешь второе устройство) — вставь его ID. Иначе создастся новый.
                </div>
              </div>

              {error && (
                <Callout variant="danger" title="Ошибка">
                  {error}
                </Callout>
              )}

              <Button onClick={handleConnect} disabled={!token.trim() || verifying}>
                {verifying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Github className="h-4 w-4" />
                )}
                {verifying ? "Проверяю..." : "Подключить"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-3 rounded-xl border border-border bg-surface-2/40 p-4">
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <Field label="Статус">
                  <StatusBadge status={status} />
                </Field>
                <Field label="Gist">
                  {cfg.gistId ? (
                    <a
                      href={`https://gist.github.com/${cfg.gistId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                    >
                      {cfg.gistId.slice(0, 12)}...
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">создаётся при первом сейве</span>
                  )}
                </Field>
                <Field label="Последний push">
                  <span className="text-foreground">{formatAgo(cfg.lastPushAt)}</span>
                </Field>
                <Field label="Последний pull">
                  <span className="text-foreground">{formatAgo(cfg.lastPullAt)}</span>
                </Field>
              </div>

              {status.kind === "error" && (
                <Callout variant="danger" title="Ошибка синхронизации">
                  {status.message}
                </Callout>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => void syncNow()}
                disabled={status.kind === "pushing" || status.kind === "pulling"}
              >
                {status.kind === "pushing" || status.kind === "pulling" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RotateCw className="h-4 w-4" />
                )}
                Синхронизировать сейчас
              </Button>
              <Button variant="outline" onClick={() => void pullNow()}>
                <Cloud className="h-3.5 w-3.5" /> Только скачать
              </Button>
              <Button variant="outline" onClick={() => void pushNow()}>
                <Cloud className="h-3.5 w-3.5 rotate-180" /> Только отправить
              </Button>
              <Button variant="ghost" onClick={handleDisconnect} className="ml-auto">
                <Unlink className="h-3.5 w-3.5" /> Отключить
              </Button>
            </div>

            <Callout variant="info" title="Как подключить второе устройство">
              На втором устройстве: открой <code className="rounded bg-zinc-200 px-1 py-0.5 text-[11px] dark:bg-zinc-800">Настройки</code> → раздел GitHub → введи тот же токен и{" "}
              <strong>Gist ID</strong> (можно скопировать сверху отсюда). Дальше синхронизация автоматическая.
            </Callout>
          </>
        )}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm">{children}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: SyncStatus }) {
  if (status.kind === "idle") {
    return <span className="text-muted-foreground">в ожидании</span>;
  }
  if (status.kind === "pushing") {
    return (
      <span className="inline-flex items-center gap-1.5 text-primary">
        <Loader2 className="h-3 w-3 animate-spin" /> отправляю...
      </span>
    );
  }
  if (status.kind === "pulling") {
    return (
      <span className="inline-flex items-center gap-1.5 text-primary">
        <Loader2 className="h-3 w-3 animate-spin" /> скачиваю...
      </span>
    );
  }
  if (status.kind === "ok") {
    return (
      <span className="inline-flex items-center gap-1.5 text-success">
        <Check className="h-3 w-3" /> синхронизировано
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-danger">
      <X className="h-3 w-3" /> ошибка
    </span>
  );
}
