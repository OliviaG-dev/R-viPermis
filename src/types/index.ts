// ============================================
// Types du Quiz
// ============================================

export type QuizCategory = "vehicule" | "qser" | "secours";

export type VehicleAnswer = {
  text: string;
  image?: string;
};

export type VehicleQuestion = {
  question: string;
  answer: VehicleAnswer;
};

export type KnowledgeQuestion = {
  question: string;
  answer: string | string[];
  multiple: boolean;
};

export type QuizQuestion = {
  id: number;
  name: string;
  theme: string;
  vehicule: VehicleQuestion;
  qser: KnowledgeQuestion;
  secours: KnowledgeQuestion;
};

export type OptionChoice = {
  id: string;
  text?: string;
  imageSrc?: string;
  isCorrect: boolean;
  kind: "text" | "image";
};

export type Stats = Record<
  QuizCategory,
  {
    asked: number;
    correct: number;
  }
>;

export type CategoryStatus = "correct" | "incorrect" | null;

export type PendingAdvance =
  | { type: "category"; target: QuizCategory }
  | { type: "question" }
  | { type: "result" }
  | null;

// ============================================
// Types legacy (pour compatibilité)
// ============================================

// Types pour les questions du quiz (legacy)
export interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
  explanation?: string;
}

// Types pour les résultats du quiz (legacy)
export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
}
