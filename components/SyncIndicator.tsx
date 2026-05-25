"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  loadSyncConfig,
  startAutoSync,
  subscribeSyncStatus,
  syncNow,
  type SyncConfig,
  type SyncStatus,
} from "@/lib/github-sync";
import { Cloud, CloudOff, Check, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function formatAgo(ts: number): string {
  if (!ts) return "никогда";
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 5) return "только что";
  if (diff < 60) return `${diff} сек назад`;
  if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
  return new Date(ts).toLocaleDateString();
}

export function SyncIndicator() {
  const [cfg, setCfg] = useState<SyncConfig | null>(null);
  const [status, setStatus] = useState<SyncStatus>({ kind: "idle" });

  useEffect(() => {
    // Стартуем менеджер при первом монтировании
    startAutoSync();

    setCfg(loadSyncConfig());
    const cfgHandler = () => setCfg(loadSyncConfig());
    window.addEventListener("sync-config-updated", cfgHandler);
    const unsub = subscribeSyncStatus((s) => setStatus(s));

    return () => {
      window.removeEventListener("sync-config-updated", cfgHandler);
      unsub();
    };
  }, []);

  if (!cfg) return null;

  // Не подключено — показываем тусклое облачко-приглашение
  if (!cfg.enabled) {
    return (
      <Link
        href="/settings"
        title="Облачная синхронизация не настроена. Подключи GitHub Gist."
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/60 transition-colors hover:bg-surface-2 hover:text-foreground"
      >
        <CloudOff className="h-4 w-4" />
      </Link>
    );
  }

  // Подключено
  const visuals = (() => {
    switch (status.kind) {
      case "pushing":
      case "pulling":
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          color: "text-primary bg-primary/10",
          tip: status.kind === "pushing" ? "Отправляю изменения..." : "Скачиваю обновления...",
        };
      case "error":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          color: "text-danger bg-danger/10",
          tip: `Ошибка: ${status.message}`,
        };
      case "ok":
        return {
          icon: (
            <span className="relative inline-flex">
              <Cloud className="h-4 w-4" />
              <Check
                className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5"
                strokeWidth={4}
              />
            </span>
          ),
          color: "text-success bg-success/10",
          tip: `Синхронизировано ${formatAgo(status.at)}`,
        };
      default:
        return {
          icon: <Cloud className="h-4 w-4" />,
          color: "text-muted-foreground bg-surface-2",
          tip:
            cfg.lastPushAt || cfg.lastPullAt
              ? `Последняя синхронизация ${formatAgo(Math.max(cfg.lastPushAt, cfg.lastPullAt))}`
              : "Готово к синхронизации",
        };
    }
  })();

  return (
    <button
      onClick={() => void syncNow()}
      title={`${visuals.tip}. Клик — синхронизировать сейчас.`}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-105",
        visuals.color,
      )}
    >
      {visuals.icon}
    </button>
  );
}
