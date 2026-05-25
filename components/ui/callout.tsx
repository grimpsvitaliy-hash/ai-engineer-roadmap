import { cn } from "@/lib/utils";
import { Info, Lightbulb, AlertTriangle, AlertOctagon } from "lucide-react";

type Variant = "info" | "tip" | "warning" | "danger";

const styles: Record<
  Variant,
  { bg: string; border: string; iconBg: string; iconColor: string; titleColor: string; icon: React.ReactNode }
> = {
  info: {
    bg: "bg-primary/[0.04]",
    border: "border-primary/20",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    titleColor: "text-foreground",
    icon: <Info className="h-4 w-4" />,
  },
  tip: {
    bg: "bg-success/[0.04]",
    border: "border-success/20",
    iconBg: "bg-success/10",
    iconColor: "text-success",
    titleColor: "text-foreground",
    icon: <Lightbulb className="h-4 w-4" />,
  },
  warning: {
    bg: "bg-warning/[0.05]",
    border: "border-warning/30",
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    titleColor: "text-foreground",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  danger: {
    bg: "bg-danger/[0.05]",
    border: "border-danger/30",
    iconBg: "bg-danger/10",
    iconColor: "text-danger",
    titleColor: "text-foreground",
    icon: <AlertOctagon className="h-4 w-4" />,
  },
};

export function Callout({
  variant = "info",
  title,
  children,
  className,
}: {
  variant?: Variant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const s = styles[variant];
  return (
    <div
      className={cn(
        "my-4 flex gap-3 rounded-xl border p-4",
        s.bg,
        s.border,
        className,
      )}
    >
      <div
        className={cn(
          "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg",
          s.iconBg,
          s.iconColor,
        )}
      >
        {s.icon}
      </div>
      <div className="min-w-0 flex-1">
        {title && (
          <div className={cn("mb-1 text-sm font-semibold", s.titleColor)}>{title}</div>
        )}
        <div className="text-[13.5px] leading-relaxed text-foreground/85">{children}</div>
      </div>
    </div>
  );
}
