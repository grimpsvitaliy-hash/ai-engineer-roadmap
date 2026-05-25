"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string;
  onChange: (v: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

export function Tabs({
  value,
  onValueChange,
  children,
  className,
}: {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <TabsContext.Provider value={{ value, onChange: onValueChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex w-full items-center gap-1 rounded-xl border border-border bg-surface p-1 shadow-soft",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  className,
  accentColor,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
  accentColor?: "theory" | "quiz" | "practice" | "checkpoint";
}) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("TabsTrigger must be used within Tabs");
  const active = ctx.value === value;

  const activeColorClass = {
    theory: "bg-theory/10 text-theory border-theory/20",
    quiz: "bg-quiz/10 text-quiz border-quiz/20",
    practice: "bg-practice/10 text-practice border-practice/20",
    checkpoint: "bg-checkpoint/10 text-checkpoint border-checkpoint/20",
  };

  return (
    <button
      onClick={() => ctx.onChange(value)}
      data-state={active ? "active" : "inactive"}
      className={cn(
        "inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all border border-transparent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        active
          ? accentColor
            ? activeColorClass[accentColor]
            : "bg-surface-2 text-foreground border-border"
          : "text-muted-foreground hover:text-foreground hover:bg-surface-2/60",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("TabsContent must be used within Tabs");
  if (ctx.value !== value) return null;
  return <div className={cn("mt-6 fade-in-up", className)}>{children}</div>;
}
