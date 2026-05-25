"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";
type Resolved = "light" | "dark";

const STORAGE_KEY = "theme";

function getSystemPref(): Resolved {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const resolved: Resolved = theme === "system" ? getSystemPref() : theme;
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.dataset.theme = resolved;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
    setTheme(saved);
    applyTheme(saved);

    // Реагируем на изменение системной темы, если выбрана "system"
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const current = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
      if (current === "system") applyTheme("system");
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  function setAndApply(next: Theme) {
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    applyTheme(next);
  }

  const options: { id: Theme; icon: React.ReactNode; label: string }[] = [
    { id: "light", icon: <Sun className="h-3.5 w-3.5" />, label: "Светлая тема" },
    { id: "system", icon: <Monitor className="h-3.5 w-3.5" />, label: "Системная тема" },
    { id: "dark", icon: <Moon className="h-3.5 w-3.5" />, label: "Тёмная тема" },
  ];

  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-surface p-0.5 shadow-soft"
      role="radiogroup"
      aria-label="Выбор темы"
    >
      {options.map((opt) => {
        const active = mounted && theme === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => setAndApply(opt.id)}
            role="radio"
            aria-checked={active}
            title={opt.label}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md transition-all",
              active
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
            )}
          >
            {opt.icon}
          </button>
        );
      })}
    </div>
  );
}
