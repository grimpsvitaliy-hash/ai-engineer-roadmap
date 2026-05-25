"use client";

const STORAGE_KEY = "ai-engineer-roadmap-progress-v1";

export type LessonProgress = {
  theorySectionsRead: string[];
  quizAnswers: Record<string, { selected: string | string[]; correct: boolean; timestamp: number }>;
  practiceCompleted: string[];
  lastVisited: number;
};

export type Progress = {
  lessons: Record<string, LessonProgress>;
  totalQuizCorrect: number;
  totalQuizAttempted: number;
  totalPracticeCompleted: number;
  streak: number;
  lastActiveDate: string;
};

const empty: Progress = {
  lessons: {},
  totalQuizCorrect: 0,
  totalQuizAttempted: 0,
  totalPracticeCompleted: 0,
  streak: 0,
  lastActiveDate: "",
};

function emptyLesson(): LessonProgress {
  return {
    theorySectionsRead: [],
    quizAnswers: {},
    practiceCompleted: [],
    lastVisited: Date.now(),
  };
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

function saveProgress(p: Progress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    window.dispatchEvent(new CustomEvent("progress-updated"));
  } catch {}
}

function ensureLesson(p: Progress, lessonId: string): LessonProgress {
  if (!p.lessons[lessonId]) {
    p.lessons[lessonId] = emptyLesson();
  }
  return p.lessons[lessonId];
}

function bumpStreak(p: Progress): void {
  const today = new Date().toISOString().slice(0, 10);
  if (p.lastActiveDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (p.lastActiveDate === yesterday) p.streak += 1;
  else p.streak = 1;
  p.lastActiveDate = today;
}

export function markTheoryRead(lessonId: string, sectionId: string): Progress {
  const p = loadProgress();
  const l = ensureLesson(p, lessonId);
  if (!l.theorySectionsRead.includes(sectionId)) {
    l.theorySectionsRead.push(sectionId);
  }
  l.lastVisited = Date.now();
  bumpStreak(p);
  saveProgress(p);
  return p;
}

export function recordQuizAnswer(
  lessonId: string,
  questionId: string,
  selected: string | string[],
  correct: boolean,
): Progress {
  const p = loadProgress();
  const l = ensureLesson(p, lessonId);
  const existing = l.quizAnswers[questionId];
  if (!existing) {
    p.totalQuizAttempted += 1;
    if (correct) p.totalQuizCorrect += 1;
  } else if (!existing.correct && correct) {
    p.totalQuizCorrect += 1;
  }
  l.quizAnswers[questionId] = { selected, correct, timestamp: Date.now() };
  l.lastVisited = Date.now();
  bumpStreak(p);
  saveProgress(p);
  return p;
}

export function markPracticeDone(lessonId: string, taskId: string): Progress {
  const p = loadProgress();
  const l = ensureLesson(p, lessonId);
  if (!l.practiceCompleted.includes(taskId)) {
    l.practiceCompleted.push(taskId);
    p.totalPracticeCompleted += 1;
  }
  l.lastVisited = Date.now();
  bumpStreak(p);
  saveProgress(p);
  return p;
}

export function unmarkPracticeDone(lessonId: string, taskId: string): Progress {
  const p = loadProgress();
  const l = ensureLesson(p, lessonId);
  const idx = l.practiceCompleted.indexOf(taskId);
  if (idx !== -1) {
    l.practiceCompleted.splice(idx, 1);
    p.totalPracticeCompleted = Math.max(0, p.totalPracticeCompleted - 1);
  }
  saveProgress(p);
  return p;
}

export function getLessonProgress(lessonId: string): LessonProgress {
  const p = loadProgress();
  return p.lessons[lessonId] || emptyLesson();
}

export function getLessonCompletionPercent(
  lessonId: string,
  totalTheory: number,
  totalQuiz: number,
  totalPractice: number,
): number {
  const lp = getLessonProgress(lessonId);
  const totalItems = totalTheory + totalQuiz + totalPractice;
  if (totalItems === 0) return 0;
  const doneTheory = lp.theorySectionsRead.length;
  const doneQuiz = Object.values(lp.quizAnswers).filter((a) => a.correct).length;
  const donePractice = lp.practiceCompleted.length;
  return Math.round(((doneTheory + doneQuiz + donePractice) / totalItems) * 100);
}

export function resetAllProgress(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("progress-updated"));
}

// ============================================================
// Экспорт / импорт прогресса для синхронизации между устройствами
// ============================================================

export type ExportedProgress = {
  app: "ai-engineer-roadmap";
  version: 1;
  exportedAt: string;
  progress: Progress;
};

export function exportProgress(): ExportedProgress {
  return {
    app: "ai-engineer-roadmap",
    version: 1,
    exportedAt: new Date().toISOString(),
    progress: loadProgress(),
  };
}

export function downloadProgress(): void {
  if (typeof window === "undefined") return;
  const data = exportProgress();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `ai-engineer-progress-${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export type ImportResult =
  | { ok: true; merged: boolean; stats: { lessons: number; quizCorrect: number; practice: number } }
  | { ok: false; error: string };

export function importProgress(
  raw: string,
  mode: "replace" | "merge" = "replace",
): ImportResult {
  if (typeof window === "undefined") return { ok: false, error: "Не в браузере" };

  let parsed: ExportedProgress;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: "Файл не является валидным JSON" };
  }

  if (parsed?.app !== "ai-engineer-roadmap") {
    return {
      ok: false,
      error: "Это не файл прогресса AI Engineer Roadmap (нет поля app=ai-engineer-roadmap)",
    };
  }

  if (typeof parsed.version !== "number") {
    return { ok: false, error: "Неизвестная версия файла" };
  }

  const incoming = parsed.progress;
  if (!incoming || typeof incoming !== "object") {
    return { ok: false, error: "В файле нет поля progress" };
  }

  let finalProgress: Progress;

  if (mode === "replace") {
    finalProgress = incoming;
  } else {
    const current = loadProgress();
    finalProgress = mergeProgress(current, incoming);
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(finalProgress));
    window.dispatchEvent(new CustomEvent("progress-updated"));
  } catch {
    return { ok: false, error: "Не удалось записать в localStorage" };
  }

  return {
    ok: true,
    merged: mode === "merge",
    stats: {
      lessons: Object.keys(finalProgress.lessons).length,
      quizCorrect: finalProgress.totalQuizCorrect,
      practice: finalProgress.totalPracticeCompleted,
    },
  };
}

function mergeProgress(a: Progress, b: Progress): Progress {
  const merged: Progress = {
    ...a,
    streak: Math.max(a.streak, b.streak),
    lastActiveDate:
      a.lastActiveDate > b.lastActiveDate ? a.lastActiveDate : b.lastActiveDate,
    lessons: { ...a.lessons },
  };

  // Объединяем уроки: для каждого урока берём максимум прогресса
  for (const lessonId of Object.keys(b.lessons)) {
    const aL = a.lessons[lessonId];
    const bL = b.lessons[lessonId];
    if (!aL) {
      merged.lessons[lessonId] = bL;
      continue;
    }
    merged.lessons[lessonId] = {
      theorySectionsRead: Array.from(
        new Set([...aL.theorySectionsRead, ...bL.theorySectionsRead]),
      ),
      practiceCompleted: Array.from(
        new Set([...aL.practiceCompleted, ...bL.practiceCompleted]),
      ),
      // Для квизов: оставляем правильные ответы, при конфликте берём правильный
      quizAnswers: (() => {
        const out = { ...aL.quizAnswers };
        for (const [qId, ans] of Object.entries(bL.quizAnswers)) {
          if (!out[qId] || (!out[qId].correct && ans.correct)) {
            out[qId] = ans;
          }
        }
        return out;
      })(),
      lastVisited: Math.max(aL.lastVisited, bL.lastVisited),
    };
  }

  // Пересчитываем агрегаты
  let totalQuizCorrect = 0;
  let totalQuizAttempted = 0;
  let totalPracticeCompleted = 0;
  for (const l of Object.values(merged.lessons)) {
    totalPracticeCompleted += l.practiceCompleted.length;
    for (const ans of Object.values(l.quizAnswers)) {
      totalQuizAttempted += 1;
      if (ans.correct) totalQuizCorrect += 1;
    }
  }
  merged.totalQuizCorrect = totalQuizCorrect;
  merged.totalQuizAttempted = totalQuizAttempted;
  merged.totalPracticeCompleted = totalPracticeCompleted;

  return merged;
}
