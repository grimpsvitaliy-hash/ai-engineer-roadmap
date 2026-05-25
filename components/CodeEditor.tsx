"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const Monaco = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center rounded-lg border border-border bg-muted text-sm text-muted-foreground">
      Загружаем редактор...
    </div>
  ),
});

export function CodeEditor({
  value,
  onChange,
  language = "python",
  height = "300px",
  readOnly = false,
  className,
}: {
  value: string;
  onChange?: (v: string) => void;
  language?: "python" | "javascript" | "typescript" | "json";
  height?: string;
  readOnly?: boolean;
  className?: string;
}) {
  const [theme, setTheme] = useState<"vs-dark" | "vs">("vs-dark");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "vs-dark" : "vs");

    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains("dark");
      setTheme(dark ? "vs-dark" : "vs");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border", className)}>
      <Monaco
        height={height}
        defaultLanguage={language}
        language={language}
        value={value}
        theme={theme}
        onChange={(v) => onChange?.(v ?? "")}
        options={{
          readOnly,
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontFamily: "var(--font-mono), ui-monospace, Menlo, monospace",
          lineNumbers: "on",
          padding: { top: 12, bottom: 12 },
          automaticLayout: true,
          tabSize: 4,
          insertSpaces: true,
          wordWrap: "on",
        }}
      />
    </div>
  );
}
