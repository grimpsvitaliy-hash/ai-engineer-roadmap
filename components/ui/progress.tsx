import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  indicatorClassName?: string;
  gradient?: boolean;
}

export function Progress({
  className,
  value,
  max = 100,
  indicatorClassName,
  gradient = true,
  ...props
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      className={cn(
        "relative h-1.5 w-full overflow-hidden rounded-full bg-surface-2",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full transition-all duration-500 ease-out",
          gradient
            ? "bg-gradient-to-r from-primary to-quiz"
            : "bg-primary",
          indicatorClassName,
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
