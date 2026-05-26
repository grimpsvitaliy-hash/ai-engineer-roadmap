"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Brain, Code2, CheckSquare, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type StepColor = "theory" | "quiz" | "practice" | "checkpoint" | "primary";

const colorMap: Record<StepColor, { bar: string; bg: string; iconBg: string; icon: React.ReactNode }> = {
  theory: {
    bar: "from-theory to-blue-400",
    bg: "hover:border-theory/40 hover:shadow-[0_8px_24px_-12px_rgb(var(--cat-theory))]",
    iconBg: "bg-theory/10 text-theory group-hover:bg-theory group-hover:text-white",
    icon: <BookOpen className="h-4 w-4" />,
  },
  quiz: {
    bar: "from-quiz to-violet-400",
    bg: "hover:border-quiz/40 hover:shadow-[0_8px_24px_-12px_rgb(var(--cat-quiz))]",
    iconBg: "bg-quiz/10 text-quiz group-hover:bg-quiz group-hover:text-white",
    icon: <Brain className="h-4 w-4" />,
  },
  practice: {
    bar: "from-practice to-emerald-400",
    bg: "hover:border-practice/40 hover:shadow-[0_8px_24px_-12px_rgb(var(--cat-practice))]",
    iconBg: "bg-practice/10 text-practice group-hover:bg-practice group-hover:text-white",
    icon: <Code2 className="h-4 w-4" />,
  },
  checkpoint: {
    bar: "from-checkpoint to-amber-400",
    bg: "hover:border-checkpoint/40 hover:shadow-[0_8px_24px_-12px_rgb(var(--cat-checkpoint))]",
    iconBg: "bg-checkpoint/10 text-checkpoint group-hover:bg-checkpoint group-hover:text-white",
    icon: <CheckSquare className="h-4 w-4" />,
  },
  primary: {
    bar: "from-primary to-quiz",
    bg: "hover:border-primary/40 hover:shadow-[0_8px_24px_-12px_rgb(var(--primary))]",
    iconBg: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white",
    icon: <Sparkles className="h-4 w-4" />,
  },
};

interface CommonProps {
  label: string;
  subtitle?: string;
  color: StepColor;
}

interface ClickProps extends CommonProps {
  onClick: () => void;
  href?: never;
}

interface LinkProps extends CommonProps {
  href: string;
  onClick?: never;
}

export function NextStepButton(props: ClickProps | LinkProps) {
  const { label, subtitle, color } = props;
  const styles = colorMap[color];

  const inner = (
    <>
      <div className={cn("h-1 w-full bg-gradient-to-r", styles.bar)} />
      <div className="flex items-center gap-4 p-5">
        <div
          className={cn(
            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-colors",
            styles.iconBg,
          )}
        >
          {styles.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {subtitle ?? "Дальше"}
          </div>
          <div className="mt-0.5 text-base font-semibold leading-tight tracking-tight">
            {label}
          </div>
        </div>
        <ArrowRight className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
      </div>
    </>
  );

  const className = cn(
    "group mt-10 block overflow-hidden rounded-xl border border-border bg-surface shadow-soft transition-all",
    "hover:-translate-y-0.5",
    styles.bg,
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={className}>
        {inner}
      </Link>
    );
  }

  return (
    <button onClick={props.onClick} className={cn(className, "w-full text-left")}>
      {inner}
    </button>
  );
}
