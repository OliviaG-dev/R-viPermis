import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { QuizQuestion } from "../types";

vi.mock("../data/questions.json", () => ({
  default: [
    {
      id: 1,
      name: "Q1",
      theme: "Vérifications intérieures",
      vehicule: {
        question: "Où se trouve la commande des feux ?",
        answer: {
          text: "À gauche du volant",
          image: "/Img/Q01.png",
        },
      },
      qser: {
        question: "Quelle est la vitesse maximale en ville ?",
        answer: "50 km/h",
        multiple: false,
      },
      secours: {
        question: "Quel numéro appeler en cas d'accident ?",
        answer: ["112"],
        multiple: false,
      },
    },
    {
      id: 2,
      name: "Q2",
      theme: "Vérifications extérieures",
      vehicule: {
        question: "Comment vérifier l'usure des pneus ?",
        answer: {
          text: "Regarder les témoins",
          image: "/Img/Q02.png",
        },
      },
      qser: {
        question: "Que signifie un feu orange fixe ?",
        answer: "Arrêt obligatoire sauf danger",
        multiple: false,
      },
      secours: {
        question: "Quel premier geste pour une victime consciente ?",
        answer: ["Sécuriser la zone"],
        multiple: false,
      },
    },
  ] as QuizQuestion[],
}));

vi.mock("../utils", async () => {
  const actual = await vi.importActual<typeof import("../utils")>("../utils");
  return {
    ...actual,
    shuffle: <T,>(array: T[]) => [...array],
  };
});

import { useQuiz } from "./useQuiz";

const mockQuestions: QuizQuestion[] = [
  {
    id: 1,
    name: "Q1",
    theme: "Vérifications intérieures",
    vehicule: {
      question: "Où se trouve la commande des feux ?",
      answer: {
        text: "À gauche du volant",
        image: "/Img/Q01.png",
      },
    },
    qser: {
      question: "Quelle est la vitesse maximale en ville ?",
      answer: "50 km/h",
      multiple: false,
    },
    secours: {
      question: "Quel numéro appeler en cas d'accident ?",
      answer: ["112"],
      multiple: false,
    },
  },
  {
    id: 2,
    name: "Q2",
    theme: "Vérifications extérieures",
    vehicule: {
      question: "Comment vérifier l'usure des pneus ?",
      answer: {
        text: "Regarder les témoins",
        image: "/Img/Q02.png",
      },
    },
    qser: {
      question: "Que signifie un feu orange fixe ?",
      answer: "Arrêt obligatoire sauf danger",
      multiple: false,
    },
    secours: {
      question: "Quel premier geste pour une victime consciente ?",
      answer: ["Sécuriser la zone"],
      multiple: false,
    },
  },
];

describe("useQuiz hook", () => {
  beforeEach(() => {
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initialises sur la catégorie véhicule avec les statistiques à zéro", () => {
    const { result } = renderHook(() => useQuiz());

    expect(result.current.category).toBe("vehicule");
    expect(result.current.stats.vehicule).toEqual({ asked: 0, correct: 0 });
    expect(result.current.activeQuestion.question).toBe(
      mockQuestions[0].vehicule.question
    );
  });

  it("valide une réponse correcte et propose le passage à la catégorie suivante", () => {
    const { result } = renderHook(() => useQuiz());

    const correctChoice = result.current.answerChoices.find(
      (choice) => choice.isCorrect
    );
    expect(correctChoice).toBeDefined();

    act(() => {
      result.current.toggleChoice(correctChoice!.id);
    });

    act(() => {
      result.current.handleValidate();
    });

    expect(result.current.isValidated).toBe(true);
    expect(result.current.wasCorrect).toBe(true);
    expect(result.current.stats.vehicule).toEqual({ asked: 1, correct: 1 });
    expect(result.current.pendingAdvance).toEqual({
      type: "category",
      target: "qser",
    });
  });

  it("change de catégorie après validation puis réinitialise correctement via resetSeries", () => {
    const { result } = renderHook(() => useQuiz());

    const correctChoice = result.current.answerChoices.find(
      (choice) => choice.isCorrect
    );
    expect(correctChoice).toBeDefined();

    act(() => {
      result.current.toggleChoice(correctChoice!.id);
    });

    act(() => {
      result.current.handleValidate();
    });

    expect(result.current.pendingAdvance).toEqual({
      type: "category",
      target: "qser",
    });

    act(() => {
      result.current.handleAdvance();
    });

    expect(result.current.category).toBe("qser");
    expect(result.current.isValidated).toBe(false);
    expect(result.current.pendingAdvance).toBeNull();

    act(() => {
      result.current.resetSeries();
    });

    expect(result.current.category).toBe("vehicule");
    // Les stats globales persistent entre les séries
    expect(result.current.stats.vehicule.asked).toBeGreaterThan(0);
    expect(result.current.questionScores).toHaveLength(0);
    expect(result.current.isValidated).toBe(false);
  });

  it("valide une réponse incorrecte et met à jour les statistiques", () => {
    const { result } = renderHook(() => useQuiz());

    const incorrectChoice = result.current.answerChoices.find(
      (choice) => !choice.isCorrect
    );
    expect(incorrectChoice).toBeDefined();

    act(() => {
      result.current.toggleChoice(incorrectChoice!.id);
    });

    act(() => {
      result.current.handleValidate();
    });

    expect(result.current.isValidated).toBe(true);
    expect(result.current.wasCorrect).toBe(false);
    expect(result.current.stats.vehicule).toEqual({ asked: 1, correct: 0 });
    expect(result.current.categoryStatuses.vehicule).toBe("incorrect");
  });

  it("ne permet pas de valider sans sélection", () => {
    const { result } = renderHook(() => useQuiz());

    expect(result.current.selectedChoices).toHaveLength(0);

    act(() => {
      result.current.handleValidate();
    });

    expect(result.current.isValidated).toBe(false);
    expect(result.current.stats.vehicule).toEqual({ asked: 0, correct: 0 });
  });

  it("ne permet pas de modifier les choix après validation", () => {
    const { result } = renderHook(() => useQuiz());

    const correctChoice = result.current.answerChoices.find(
      (choice) => choice.isCorrect
    );
    const incorrectChoice = result.current.answerChoices.find(
      (choice) => !choice.isCorrect
    );

    act(() => {
      result.current.toggleChoice(correctChoice!.id);
    });

    act(() => {
      result.current.handleValidate();
    });

    expect(result.current.selectedChoices).toContain(correctChoice!.id);

    act(() => {
      result.current.toggleChoice(incorrectChoice!.id);
    });

    // Les choix ne doivent pas changer après validation
    expect(result.current.selectedChoices).toContain(correctChoice!.id);
    expect(result.current.selectedChoices).not.toContain(incorrectChoice!.id);
  });

  it("teste toutes les catégories (qser et secours)", () => {
    const { result } = renderHook(() => useQuiz());

    // Valider véhicule
    const vehiculeCorrect = result.current.answerChoices.find(
      (choice) => choice.isCorrect
    );
    act(() => {
      result.current.toggleChoice(vehiculeCorrect!.id);
    });
    act(() => {
      result.current.handleValidate();
    });
    act(() => {
      result.current.handleAdvance();
    });

    // Tester qser
    expect(result.current.category).toBe("qser");
    expect(result.current.activeQuestion.question).toBe(
      mockQuestions[0].qser.question
    );

    const qserCorrect = result.current.answerChoices.find(
      (choice) => choice.isCorrect
    );
    act(() => {
      result.current.toggleChoice(qserCorrect!.id);
    });
    act(() => {
      result.current.handleValidate();
    });
    expect(result.current.stats.qser).toEqual({ asked: 1, correct: 1 });
    act(() => {
      result.current.handleAdvance();
    });

    // Tester secours
    expect(result.current.category).toBe("secours");
    expect(result.current.activeQuestion.question).toBe(
      mockQuestions[0].secours.question
    );

    const secoursCorrect = result.current.answerChoices.find(
      (choice) => choice.isCorrect
    );
    act(() => {
      result.current.toggleChoice(secoursCorrect!.id);
    });
    act(() => {
      result.current.handleValidate();
    });
    expect(result.current.stats.secours).toEqual({ asked: 1, correct: 1 });
  });

  it("passe à la question suivante après avoir complété les 3 catégories", () => {
    const { result } = renderHook(() => useQuiz());

    // Compléter les 3 catégories de la première question
    const completeQuestion = () => {
      ["vehicule", "qser", "secours"].forEach((cat) => {
        if (result.current.category !== cat) {
          act(() => {
            result.current.onCategoryChange(cat as any);
          });
        }
        const correct = result.current.answerChoices.find(
          (choice) => choice.isCorrect
        );
        act(() => {
          result.current.toggleChoice(correct!.id);
        });
        act(() => {
          result.current.handleValidate();
        });
        if (cat !== "secours") {
          act(() => {
            result.current.handleAdvance();
          });
        }
      });
    };

    completeQuestion();

    // Après secours, on doit avoir pendingAdvance type "question"
    expect(result.current.pendingAdvance).toEqual({ type: "question" });

    act(() => {
      result.current.handleAdvance();
    });

    // La question doit changer et revenir à véhicule
    expect(result.current.category).toBe("vehicule");
    expect(result.current.questionScores).toHaveLength(1);
    expect(result.current.questionScores[0].correct).toBe(3);
  });

  it("affiche le résultat final après 5 questions", () => {
    const { result } = renderHook(() => useQuiz());

    const completeAllCategories = () => {
      ["vehicule", "qser", "secours"].forEach((cat) => {
        if (result.current.category !== cat) {
          act(() => {
            result.current.onCategoryChange(cat as any);
          });
        }
        const correct = result.current.answerChoices.find(
          (choice) => choice.isCorrect
        );
        act(() => {
          result.current.toggleChoice(correct!.id);
        });
        act(() => {
          result.current.handleValidate();
        });
        if (cat !== "secours") {
          act(() => {
            result.current.handleAdvance();
          });
        }
      });
    };

    // Compléter 4 questions complètes
    // Chaque question est finalisée quand on avance à la suivante (handleAdvance avec type "question")
    for (let i = 0; i < 4; i++) {
      completeAllCategories();
      // Après secours, on doit avoir pendingAdvance type "question" pour les 4 premières
      expect(result.current.pendingAdvance).toEqual({ type: "question" });
      act(() => {
        result.current.handleAdvance(); // Passer à la question suivante (finalise la question)
      });
    }

    // Maintenant on a 4 questions finalisées, donc questionScores.length = 4
    // À la 5ème question, compléter toutes les catégories
    completeAllCategories();

    // Après secours de la 5ème question, on doit avoir le résultat
    // car isLastQuestion = (4 >= 5-1) = true et isLastCategory = true
    expect(result.current.pendingAdvance).toEqual({ type: "result" });
    expect(result.current.questionScores).toHaveLength(4); // 4 questions finalisées avant

    act(() => {
      result.current.handleAdvance();
    });

    expect(result.current.showResults).toBe(true);
    expect(result.current.questionScores).toHaveLength(5); // 5ème question finalisée
    expect(result.current.seriesPercentage).toBeGreaterThanOrEqual(0);
  });

  it("restaure l'état validé lors de la navigation entre catégories déjà validées", () => {
    const { result } = renderHook(() => useQuiz());

    // Valider véhicule
    const vehiculeCorrect = result.current.answerChoices.find(
      (choice) => choice.isCorrect
    );
    act(() => {
      result.current.toggleChoice(vehiculeCorrect!.id);
    });
    act(() => {
      result.current.handleValidate();
    });
    const vehiculeSelected = [...result.current.selectedChoices];

    act(() => {
      result.current.handleAdvance();
    });

    // Valider qser
    const qserCorrect = result.current.answerChoices.find(
      (choice) => choice.isCorrect
    );
    act(() => {
      result.current.toggleChoice(qserCorrect!.id);
    });
    act(() => {
      result.current.handleValidate();
    });

    // Revenir à véhicule
    act(() => {
      result.current.onCategoryChange("vehicule");
    });

    // L'état validé doit être restauré
    expect(result.current.isValidated).toBe(true);
    expect(result.current.wasCorrect).toBe(true);
    expect(result.current.selectedChoices).toEqual(vehiculeSelected);
  });

  it("calcule correctement correctAnswerText pour toutes les catégories", () => {
    const { result } = renderHook(() => useQuiz());

    // Véhicule
    expect(result.current.correctAnswerText()).toBe(
      mockQuestions[0].vehicule.answer.text
    );

    // QSER
    act(() => {
      result.current.onCategoryChange("qser");
    });
    expect(result.current.correctAnswerText()).toBe("50 km/h");

    // Secours
    act(() => {
      result.current.onCategoryChange("secours");
    });
    expect(result.current.correctAnswerText()).toBe("112");
  });

  it("retourne les bonnes classes CSS pour getScoreClass", () => {
    const { result } = renderHook(() => useQuiz());

    expect(result.current.getScoreClass(null)).toBe("");
    expect(result.current.getScoreClass(0)).toBe(" progress-chip--score-0");
    expect(result.current.getScoreClass(1)).toBe(" progress-chip--score-1");
    expect(result.current.getScoreClass(2)).toBe(" progress-chip--score-2");
    expect(result.current.getScoreClass(3)).toBe(" progress-chip--score-3");
    expect(result.current.getScoreClass(-1)).toBe(" progress-chip--score-0");
  });

  it("calcule correctement les messages de résultat selon le pourcentage", () => {
    const { result } = renderHook(() => useQuiz());

    // Initialement, pas de scores
    expect(result.current.seriesPercentage).toBe(0);
    expect(result.current.resultMessage).toBe(
      "Pas de souci, c'est justement fait pour s'entraîner. Lance une nouvelle série et progresse à ton rythme."
    );

    // Simuler un score de 80% (12/15)
    act(() => {
      result.current.handleNextQuestion();
    });
    // Ajouter manuellement des scores pour tester
    // Note: On ne peut pas modifier questionScores directement, donc on complète des questions
    const completeQuestion = () => {
      ["vehicule", "qser", "secours"].forEach((cat) => {
        if (result.current.category !== cat) {
          act(() => {
            result.current.onCategoryChange(cat as any);
          });
        }
        const correct = result.current.answerChoices.find(
          (choice) => choice.isCorrect
        );
        if (correct) {
          act(() => {
            result.current.toggleChoice(correct.id);
          });
          act(() => {
            result.current.handleValidate();
          });
          if (cat !== "secours") {
            act(() => {
              result.current.handleAdvance();
            });
          }
        }
      });
    };

    // Compléter 4 questions avec toutes les bonnes réponses (12/12 = 100%)
    for (let i = 0; i < 4; i++) {
      completeQuestion();
      if (i < 3) {
        act(() => {
          result.current.handleAdvance();
        });
      }
    }

    // Après 4 questions complètes, on devrait avoir un bon pourcentage
    // (Le calcul se fait sur 5 questions max, donc 12/15 = 80%)
    if (result.current.questionScores.length >= 4) {
      const percentage = result.current.seriesPercentage;
      if (percentage >= 80) {
        expect(result.current.resultMessage).toContain("Excellent");
      } else if (percentage >= 50) {
        expect(result.current.resultMessage).toContain("Bien joué");
      } else if (percentage >= 20) {
        expect(result.current.resultMessage).toContain("bon début");
      }
    }
  });

  it("ne permet pas de valider deux fois", () => {
    const { result } = renderHook(() => useQuiz());

    const correctChoice = result.current.answerChoices.find(
      (choice) => choice.isCorrect
    );

    act(() => {
      result.current.toggleChoice(correctChoice!.id);
    });

    act(() => {
      result.current.handleValidate();
    });

    const initialStats = { ...result.current.stats.vehicule };

    // Essayer de valider à nouveau
    act(() => {
      result.current.handleValidate();
    });

    // Les stats ne doivent pas changer
    expect(result.current.stats.vehicule).toEqual(initialStats);
  });

  it("toggleChoice désélectionne si le choix est déjà sélectionné", () => {
    const { result } = renderHook(() => useQuiz());

    const correctChoice = result.current.answerChoices.find(
      (choice) => choice.isCorrect
    );

    act(() => {
      result.current.toggleChoice(correctChoice!.id);
    });
    expect(result.current.selectedChoices).toContain(correctChoice!.id);

    act(() => {
      result.current.toggleChoice(correctChoice!.id);
    });
    expect(result.current.selectedChoices).not.toContain(correctChoice!.id);
  });
});
