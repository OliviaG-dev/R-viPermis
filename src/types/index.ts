// Types pour les questions du quiz
export interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
  explanation?: string;
}

// Types pour les résultats du quiz
export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
}

