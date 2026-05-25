"use client";

import {
  exportProgress,
  importProgress,
  loadProgress,
  type Progress,
} from "@/lib/progress";

const CONFIG_KEY = "ai-engineer-roadmap-github-sync-v1";
const GIST_FILENAME = "ai-engineer-roadmap-progress.json";
const GIST_DESCRIPTION = "AI Engineer Roadmap — учебный прогресс";

const DEBOUNCE_MS = 8000; // дебаунс автосейва
const PERIODIC_PULL_MS = 5 * 60 * 1000; // каждые 5 минут проверять remote

// ====== Конфиг ======

export type SyncConfig = {
  token: string;
  gistId: string | null;
  lastPushAt: number;
  lastPullAt: number;
  enabled: boolean;
};

const EMPTY: SyncConfig = {
  token: "",
  gistId: null,
  lastPushAt: 0,
  lastPullAt: 0,
  enabled: false,
};

export function loadSyncConfig(): SyncConfig {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(CONFIG_KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return EMPTY;
  }
}

export function saveSyncConfig(cfg: SyncConfig): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
  window.dispatchEvent(new CustomEvent("sync-config-updated"));
}

export function clearSyncConfig(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CONFIG_KEY);
  window.dispatchEvent(new CustomEvent("sync-config-updated"));
}

// ====== GitHub API ======

type GhUser = { login: string; name?: string; avatar_url: string };
type GhGist = {
  id: string;
  html_url: string;
  files: Record<string, { filename: string; content?: string; raw_url?: string }>;
  updated_at: string;
};

const GH_HEADERS = (token: string) => ({
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export async function verifyToken(token: string): Promise<{ ok: true; user: GhUser } | { ok: false; error: string }> {
  try {
    const res = await fetch("https://api.github.com/user", { headers: GH_HEADERS(token) });
    if (res.status === 401) return { ok: false, error: "Токен недействителен (401)" };
    if (!res.ok) return { ok: false, error: `GitHub вернул ${res.status}` };
    const user = (await res.json()) as GhUser;
    // Проверим scope gist
    const scopes = res.headers.get("x-oauth-scopes") || "";
    if (!scopes.split(",").map((s) => s.trim()).includes("gist")) {
      return {
        ok: false,
        error: "У токена нет scope 'gist'. Создай новый токен и поставь только эту галочку.",
      };
    }
    return { ok: true, user };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Сеть недоступна" };
  }
}

async function createGist(token: string, content: string): Promise<string> {
  const res = await fetch("https://api.github.com/gists", {
    method: "POST",
    headers: GH_HEADERS(token),
    body: JSON.stringify({
      description: GIST_DESCRIPTION,
      public: false,
      files: {
        [GIST_FILENAME]: { content },
      },
    }),
  });
  if (!res.ok) throw new Error(`Не удалось создать gist: ${res.status}`);
  const gist = (await res.json()) as GhGist;
  return gist.id;
}

async function updateGist(token: string, gistId: string, content: string): Promise<void> {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: "PATCH",
    headers: GH_HEADERS(token),
    body: JSON.stringify({
      files: { [GIST_FILENAME]: { content } },
    }),
  });
  if (!res.ok) {
    if (res.status === 404)
      throw new Error("Gist не найден (404). Возможно был удалён. Переподключи синхронизацию.");
    throw new Error(`Не удалось обновить gist: ${res.status}`);
  }
}

async function fetchGist(
  token: string,
  gistId: string,
): Promise<{ content: string; updatedAt: string }> {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: GH_HEADERS(token),
    cache: "no-store",
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error("Gist не найден (404)");
    throw new Error(`Не удалось прочитать gist: ${res.status}`);
  }
  const gist = (await res.json()) as GhGist;
  const file = gist.files[GIST_FILENAME] ?? Object.values(gist.files)[0];
  if (!file || !file.content) throw new Error("В gist нет файла прогресса");
  return { content: file.content, updatedAt: gist.updated_at };
}

// ====== Высокоуровневые операции ======

export type SyncStatus =
  | { kind: "idle" }
  | { kind: "pushing" }
  | { kind: "pulling" }
  | { kind: "ok"; at: number; action: "push" | "pull" | "merge" }
  | { kind: "error"; message: string; at: number };

let listeners: ((s: SyncStatus) => void)[] = [];
let current: SyncStatus = { kind: "idle" };

export function subscribeSyncStatus(listener: (s: SyncStatus) => void): () => void {
  listeners.push(listener);
  listener(current);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function setStatus(s: SyncStatus): void {
  current = s;
  for (const l of listeners) l(s);
}

export function getSyncStatus(): SyncStatus {
  return current;
}

/** Pull → merge с локальным → push (если есть свежие локальные изменения) */
export async function syncNow(): Promise<void> {
  const cfg = loadSyncConfig();
  if (!cfg.enabled || !cfg.token) return;

  try {
    // Если ещё нет gist — создадим и запушим текущий
    if (!cfg.gistId) {
      setStatus({ kind: "pushing" });
      const local = exportProgress();
      const json = JSON.stringify(local, null, 2);
      const newId = await createGist(cfg.token, json);
      const now = Date.now();
      saveSyncConfig({ ...cfg, gistId: newId, lastPushAt: now, lastPullAt: now });
      setStatus({ kind: "ok", at: now, action: "push" });
      return;
    }

    // 1) Pull
    setStatus({ kind: "pulling" });
    const remote = await fetchGist(cfg.token, cfg.gistId);

    // 2) Merge с локальным (mergeProgress сделает heavy-lifting в importProgress)
    const mergeResult = importProgress(remote.content, "merge");
    if (!mergeResult.ok) {
      setStatus({
        kind: "error",
        message: `Не удалось распарсить remote: ${mergeResult.error}`,
        at: Date.now(),
      });
      return;
    }

    // 3) Push обновлённого merged-состояния — чтобы оба устройства имели одну версию
    setStatus({ kind: "pushing" });
    const after = exportProgress();
    const afterJson = JSON.stringify(after, null, 2);
    await updateGist(cfg.token, cfg.gistId, afterJson);

    const now = Date.now();
    saveSyncConfig({ ...cfg, lastPushAt: now, lastPullAt: now });
    setStatus({ kind: "ok", at: now, action: "merge" });
  } catch (e) {
    setStatus({
      kind: "error",
      message: e instanceof Error ? e.message : String(e),
      at: Date.now(),
    });
  }
}

/** Только push текущего состояния (используется в debounce и beforeunload) */
export async function pushNow(): Promise<void> {
  const cfg = loadSyncConfig();
  if (!cfg.enabled || !cfg.token) return;

  try {
    setStatus({ kind: "pushing" });
    const json = JSON.stringify(exportProgress(), null, 2);
    if (!cfg.gistId) {
      const newId = await createGist(cfg.token, json);
      const now = Date.now();
      saveSyncConfig({ ...cfg, gistId: newId, lastPushAt: now });
      setStatus({ kind: "ok", at: now, action: "push" });
      return;
    }
    await updateGist(cfg.token, cfg.gistId, json);
    const now = Date.now();
    saveSyncConfig({ ...cfg, lastPushAt: now });
    setStatus({ kind: "ok", at: now, action: "push" });
  } catch (e) {
    setStatus({
      kind: "error",
      message: e instanceof Error ? e.message : String(e),
      at: Date.now(),
    });
  }
}

/** Только pull (используется при первом коннекте и фокусе вкладки) */
export async function pullNow(): Promise<void> {
  const cfg = loadSyncConfig();
  if (!cfg.enabled || !cfg.token || !cfg.gistId) return;

  try {
    setStatus({ kind: "pulling" });
    const remote = await fetchGist(cfg.token, cfg.gistId);
    const result = importProgress(remote.content, "merge");
    if (!result.ok) {
      setStatus({ kind: "error", message: result.error, at: Date.now() });
      return;
    }
    const now = Date.now();
    saveSyncConfig({ ...cfg, lastPullAt: now });
    setStatus({ kind: "ok", at: now, action: "pull" });
  } catch (e) {
    setStatus({
      kind: "error",
      message: e instanceof Error ? e.message : String(e),
      at: Date.now(),
    });
  }
}

// ====== Менеджер автосинхронизации (singleton) ======

let started = false;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let periodicTimer: ReturnType<typeof setInterval> | null = null;
let unloadHandler: (() => void) | null = null;
let visibilityHandler: (() => void) | null = null;
let progressHandler: (() => void) | null = null;
let configHandler: (() => void) | null = null;

export function startAutoSync(): void {
  if (typeof window === "undefined" || started) return;
  started = true;

  // Дебаунс пуша после изменений
  progressHandler = () => {
    const cfg = loadSyncConfig();
    if (!cfg.enabled) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      void pushNow();
    }, DEBOUNCE_MS);
  };
  window.addEventListener("progress-updated", progressHandler);

  // При закрытии вкладки — попытаться синкнуть синхронно (best-effort)
  unloadHandler = () => {
    const cfg = loadSyncConfig();
    if (!cfg.enabled || !cfg.token || !cfg.gistId) return;

    // Используем sendBeacon — это единственный способ надёжно отправить запрос при unload
    const json = JSON.stringify(exportProgress());
    const body = JSON.stringify({ files: { [GIST_FILENAME]: { content: json } } });
    try {
      // К сожалению sendBeacon не поддерживает кастомные заголовки → нужен fallback на fetch keepalive
      fetch(`https://api.github.com/gists/${cfg.gistId}`, {
        method: "PATCH",
        headers: GH_HEADERS(cfg.token),
        body,
        keepalive: true,
      }).catch(() => {});
    } catch {}
  };
  window.addEventListener("beforeunload", unloadHandler);

  // При возврате во вкладку — pull
  visibilityHandler = () => {
    if (document.visibilityState === "visible") {
      const cfg = loadSyncConfig();
      if (cfg.enabled && cfg.gistId) void pullNow();
    }
  };
  document.addEventListener("visibilitychange", visibilityHandler);

  // Периодический pull
  periodicTimer = setInterval(() => {
    const cfg = loadSyncConfig();
    if (cfg.enabled && cfg.gistId && document.visibilityState === "visible") {
      void pullNow();
    }
  }, PERIODIC_PULL_MS);

  // При смене конфига (включили/выключили) — рестарт
  configHandler = () => {
    const cfg = loadSyncConfig();
    if (cfg.enabled && cfg.gistId) {
      void pullNow();
    }
  };
  window.addEventListener("sync-config-updated", configHandler);

  // Сразу при старте: если включён и есть gist — pull
  const cfg = loadSyncConfig();
  if (cfg.enabled && cfg.gistId) {
    void pullNow();
  }
}

export function stopAutoSync(): void {
  if (typeof window === "undefined") return;
  if (debounceTimer) clearTimeout(debounceTimer);
  if (periodicTimer) clearInterval(periodicTimer);
  if (progressHandler) window.removeEventListener("progress-updated", progressHandler);
  if (unloadHandler) window.removeEventListener("beforeunload", unloadHandler);
  if (visibilityHandler) document.removeEventListener("visibilitychange", visibilityHandler);
  if (configHandler) window.removeEventListener("sync-config-updated", configHandler);
  started = false;
}

// Удобные геттеры для UI
export function getCurrentProgress(): Progress {
  return loadProgress();
}
