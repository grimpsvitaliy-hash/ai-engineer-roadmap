"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Lock, ArrowRight } from "lucide-react";
import { canAccessMonth, findPreviousMonth } from "@/lib/exam";
import { Button } from "@/components/ui/button";

export function MonthAccessGate({
  monthId,
  children,
}: {
  monthId: string;
  children: React.ReactNode;
}) {
  const [accessible, setAccessible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    function refresh() {
      setAccessible(canAccessMonth(monthId));
    }
    refresh();
    const handler = () => refresh();
    window.addEventListener("progress-updated", handler);
    return () => window.removeEventListener("progress-updated", handler);
  }, [monthId]);

  // До монтирования (SSR) — показываем контент по умолчанию, без блокировки.
  // Это ок: тут только информационные карточки недель, и блокировка приходит сразу
  // после первой проверки на клиенте.
  if (!mounted || accessible) return <>{children}</>;

  const prev = findPreviousMonth(monthId);

  return (
    <div className="overflow-hidden rounded-xl border border-warning/30 bg-gradient-to-br from-warning/5 to-surface shadow-soft">
      <div className="h-1 bg-gradient-to-r from-warning to-orange-400" />
      <div className="p-6 sm:p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-warning/15 text-warning">
          <Lock className="h-6 w-6" />
        </div>
        <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-warning">
          Месяц заблокирован
        </div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Сначала сдай экзамен предыдущего месяца
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Чтобы открыть этот месяц, нужно успешно сдать финальный экзамен{" "}
          {prev ? <strong>месяца {prev.number}: {prev.title}</strong> : "предыдущего месяца"}.
          Это гарантия что ты не пропустил важный материал.
        </p>
        {prev && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link href={`/exam/${prev.id}`}>
              <Button size="lg">
                К экзамену месяца {prev.number}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/month/${prev.id}`}>
              <Button size="lg" variant="outline">
                Вернуться к месяцу {prev.number}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
