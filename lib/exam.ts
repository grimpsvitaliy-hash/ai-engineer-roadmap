import type { Month, QuizQuestion, PracticeTask } from "@/lib/content/types";
import { roadmap } from "@/lib/content";
import {
  isMonthExamPassed,
  getMonthExam,
  examLessonId,
  getLessonProgress,
  type ExamAttempt,
} from "@/lib/progress";

// Конфигурация экзамена — одинаковая для всех месяцев
export const EXAM_CONFIG = {
  questionCount: 7,
  practiceCount: 5,
  requiredQuizCorrect: 6,
  requiredPracticeDone: 4,
} as const;

/** Все quiz вопросы месяца с привязкой к weekId (для отладки) */
export function getMonthQuestionPool(month: Month): Array<{
  weekId: string;
  question: QuizQuestion;
}> {
  const out: Array<{ weekId: string; question: QuizQuestion }> = [];
  for (const week of month.weeks) {
    for (const q of week.quiz) {
      out.push({ weekId: week.id, question: q });
    }
  }
  return out;
}

/** Все runnable практики месяца — для экзамена берём только их */
export function getMonthPracticePool(month: Month): Array<{
  weekId: string;
  task: PracticeTask;
}> {
  const out: Array<{ weekId: string; task: PracticeTask }> = [];
  for (const week of month.weeks) {
    for (const t of week.practice) {
      if (t.runnable) {
        out.push({ weekId: week.id, task: t });
      }
    }
  }
  return out;
}

/** Псевдо-уникальный id: weekId#localId — чтобы избежать коллизий между неделями */
export function makeExamQuestionId(weekId: string, questionId: string): string {
  return `${weekId}#${questionId}`;
}

export function makeExamPracticeId(weekId: string, taskId: string): string {
  return `${weekId}#${taskId}`;
}

export function parseExamItemId(combined: string): { weekId: string; localId: string } | null {
  const idx = combined.indexOf("#");
  if (idx === -1) return null;
  return { weekId: combined.slice(0, idx), localId: combined.slice(idx + 1) };
}

/** Случайно выбрать N элементов */
function sampleN<T>(arr: T[], n: number): T[] {
  if (n >= arr.length) return [...arr];
  const copy = [...arr];
  // Fisher-Yates shuffle
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

export type ExamSelection = {
  questionIds: string[]; // массив examQuestionId (weekId#qId)
  practiceIds: string[]; // массив examPracticeId
};

/** Сгенерировать случайный экзамен */
export function generateExamSelection(month: Month): ExamSelection {
  const qPool = getMonthQuestionPool(month);
  const pPool = getMonthPracticePool(month);
  const qPicked = sampleN(qPool, EXAM_CONFIG.questionCount);
  const pPicked = sampleN(pPool, EXAM_CONFIG.practiceCount);
  return {
    questionIds: qPicked.map((q) => makeExamQuestionId(q.weekId, q.question.id)),
    practiceIds: pPicked.map((p) => makeExamPracticeId(p.weekId, p.task.id)),
  };
}

/** Резолвим examQuestionId обратно в QuizQuestion */
export function resolveExamQuestion(
  month: Month,
  examQuestionId: string,
): QuizQuestion | null {
  const parts = parseExamItemId(examQuestionId);
  if (!parts) return null;
  const week = month.weeks.find((w) => w.id === parts.weekId);
  if (!week) return null;
  return week.quiz.find((q) => q.id === parts.localId) ?? null;
}

export function resolveExamPractice(
  month: Month,
  examPracticeId: string,
): PracticeTask | null {
  const parts = parseExamItemId(examPracticeId);
  if (!parts) return null;
  const week = month.weeks.find((w) => w.id === parts.weekId);
  if (!week) return null;
  return week.practice.find((t) => t.id === parts.localId) ?? null;
}

/** Сколько правильных ответов и сделанных задач в текущей попытке экзамена */
export function evaluateExamState(monthId: string): {
  correctQuizCount: number;
  donePracticeCount: number;
  totalQuiz: number;
  totalPractice: number;
  wouldPass: boolean;
} {
  const exam = getMonthExam(monthId);
  if (!exam.current) {
    return {
      correctQuizCount: 0,
      donePracticeCount: 0,
      totalQuiz: 0,
      totalPractice: 0,
      wouldPass: false,
    };
  }

  const lessonProgress = getLessonProgress(examLessonId(monthId));
  const correctQuizCount = exam.current.questionIds.filter(
    (qid) => lessonProgress.quizAnswers[qid]?.correct,
  ).length;
  const donePracticeCount = exam.current.practiceIds.filter((pid) =>
    lessonProgress.practiceCompleted.includes(pid),
  ).length;

  const wouldPass =
    correctQuizCount >= EXAM_CONFIG.requiredQuizCorrect &&
    donePracticeCount >= EXAM_CONFIG.requiredPracticeDone;

  return {
    correctQuizCount,
    donePracticeCount,
    totalQuiz: exam.current.questionIds.length,
    totalPractice: exam.current.practiceIds.length,
    wouldPass,
  };
}

/** Закрепить текущую попытку как финальную */
export function buildExamAttempt(monthId: string): ExamAttempt | null {
  const exam = getMonthExam(monthId);
  if (!exam.current) return null;

  const lessonProgress = getLessonProgress(examLessonId(monthId));
  const { correctQuizCount, donePracticeCount, wouldPass } = evaluateExamState(monthId);

  const quizAnswersOnly: Record<string, { selected: string | string[]; correct: boolean }> = {};
  for (const qid of exam.current.questionIds) {
    const a = lessonProgress.quizAnswers[qid];
    if (a) quizAnswersOnly[qid] = { selected: a.selected, correct: a.correct };
  }
  const practiceCompletedOnly = exam.current.practiceIds.filter((pid) =>
    lessonProgress.practiceCompleted.includes(pid),
  );

  return {
    questionIds: exam.current.questionIds,
    practiceIds: exam.current.practiceIds,
    quizAnswers: quizAnswersOnly,
    practiceCompleted: practiceCompletedOnly,
    startedAt: exam.current.startedAt,
    finishedAt: Date.now(),
    correctQuizCount,
    donePracticeCount,
    passed: wouldPass,
  };
}

/** Можно ли открыть месяц — проверка предыдущего экзамена */
export function canAccessMonth(monthId: string): boolean {
  const month = roadmap.months.find((m) => m.id === monthId);
  if (!month) return false;
  // Месяц 1 — всегда доступен
  if (month.number === 1) return true;
  // Найдём предыдущий месяц
  const prevMonth = roadmap.months.find((m) => m.number === month.number - 1);
  if (!prevMonth) return true;
  return isMonthExamPassed(prevMonth.id);
}

/** Найти предыдущий месяц для конкретного — для сообщения о блокировке */
export function findPreviousMonth(monthId: string): Month | null {
  const month = roadmap.months.find((m) => m.id === monthId);
  if (!month || month.number === 1) return null;
  return roadmap.months.find((m) => m.number === month.number - 1) ?? null;
}

/** Найти следующий месяц — для перехода после успешного экзамена */
export function findNextMonth(monthId: string): Month | null {
  const month = roadmap.months.find((m) => m.id === monthId);
  if (!month) return null;
  return roadmap.months.find((m) => m.number === month.number + 1) ?? null;
}
