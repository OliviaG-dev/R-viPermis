// Interfaces pour les questions du permis de conduire

export interface VehiculeAnswer {
  text: string;
  image: string;
}

export interface VehiculeQuestion {
  question: string;
  answer: VehiculeAnswer;
}

export interface QserQuestion {
  question: string;
  answer: string | string[];
  multiple: boolean;
}

export interface SecoursQuestion {
  question: string;
  answer: string | string[];
  multiple: boolean;
}

export interface PermisQuestion {
  id: number;
  theme: string;
  vehicule: VehiculeQuestion;
  qser: QserQuestion;
  secours: SecoursQuestion;
}

// Type pour le tableau de questions
export type Questions = PermisQuestion[];

// Import des questions depuis le fichier JSON
import questionsData from "./questions.json";

// Export des questions typées
export const questions: Questions = questionsData as Questions;
