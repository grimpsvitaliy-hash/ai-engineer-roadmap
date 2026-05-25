import type { Roadmap, Month, Lesson } from "./types";
import { month01 } from "./month-01";
import { month02 } from "./month-02";
import { month03 } from "./month-03";
import { month04 } from "./month-04";
import { month05 } from "./month-05";
import { month06 } from "./month-06";

export const roadmap: Roadmap = {
  months: [month01, month02, month03, month04, month05, month06],
};

export function findMonth(id: string): Month | undefined {
  return roadmap.months.find((m) => m.id === id);
}

export function findLesson(weekId: string): { lesson: Lesson; month: Month } | undefined {
  for (const month of roadmap.months) {
    const lesson = month.weeks.find((w) => w.id === weekId);
    if (lesson) return { lesson, month };
  }
  return undefined;
}

export function getAllLessons(): { lesson: Lesson; month: Month }[] {
  const out: { lesson: Lesson; month: Month }[] = [];
  for (const m of roadmap.months) {
    for (const l of m.weeks) {
      out.push({ lesson: l, month: m });
    }
  }
  return out;
}
