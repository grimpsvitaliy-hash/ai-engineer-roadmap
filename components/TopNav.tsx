import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SyncIndicator } from "@/components/SyncIndicator";
import { Sparkles } from "lucide-react";

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-quiz text-white shadow-soft transition-transform group-hover:scale-105">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="hidden sm:inline">
            AI Engineer
            <span className="font-normal text-muted-foreground"> · Roadmap</span>
          </span>
          <span className="sm:hidden">AI Engineer</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            План
          </Link>
          <Link
            href="/playground"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            Песочница
          </Link>
          <Link
            href="/settings"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            Настройки
          </Link>
          <div className="ml-2 flex items-center gap-1.5">
            <SyncIndicator />
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
