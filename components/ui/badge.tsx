import * as React from "react";
import { cn } from "@/lib/utils";

type Variant =
  | "default"
  | "outline"
  | "success"
  | "warning"
  | "danger"
  | "primary"
  | "theory"
  | "quiz"
  | "practice"
  | "checkpoint";

const variantStyles: Record<Variant, string> = {
  default: "bg-surface-2 text-muted-foreground border border-border",
  outline: "border border-border text-muted-foreground",
  success: "border border-success/30 text-success bg-success/10",
  warning: "border border-warning/30 text-warning bg-warning/10",
  danger: "border border-danger/30 text-danger bg-danger/10",
  primary: "bg-primary text-primary-foreground border border-primary",
  theory: "border border-theory/30 text-theory bg-theory/10",
  quiz: "border border-quiz/30 text-quiz bg-quiz/10",
  practice: "border border-practice/30 text-practice bg-practice/10",
  checkpoint: "border border-checkpoint/30 text-checkpoint bg-checkpoint/10",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium leading-tight",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
