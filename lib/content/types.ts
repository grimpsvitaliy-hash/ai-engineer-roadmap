export type TheoryBlock =
  | { type: "text"; content: string }
  | { type: "code"; language: string; content: string; caption?: string }
  | { type: "callout"; variant: "info" | "warning" | "tip" | "danger"; title?: string; content: string }
  | { type: "resources"; items: { title: string; url: string; description?: string }[] };

export type TheorySection = {
  id: string;
  title: string;
  estimatedMinutes: number;
  blocks: TheoryBlock[];
};

export type QuizQuestion = {
  id: string;
  question: string;
  explanation: string;
  hint?: string;
} & (
  | {
      type: "single-choice";
      options: { id: string; text: string }[];
      correctOptionId: string;
    }
  | {
      type: "multiple-choice";
      options: { id: string; text: string }[];
      correctOptionIds: string[];
    }
  | {
      type: "text-input";
      correctAnswers: string[];
      caseSensitive?: boolean;
    }
);

export type PracticeTask = {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solutionCode?: string;
  language: "python" | "javascript";
  runnable: boolean;
  expectedOutput?: string;
  hints?: string[];
};

export type Lesson = {
  id: string;
  monthId: string;
  weekNumber: number;
  title: string;
  goal: string;
  estimatedHours: string;
  theory: TheorySection[];
  quiz: QuizQuestion[];
  practice: PracticeTask[];
  checkpoint: string[];
};

export type Month = {
  id: string;
  number: number;
  title: string;
  description: string;
  goal: string;
  mainArtifact: string;
  weeks: Lesson[];
  available: boolean;
};

export type Roadmap = {
  months: Month[];
};
