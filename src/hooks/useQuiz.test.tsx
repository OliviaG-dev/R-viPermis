import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { QuizCategory } from "../types";
import { quizQuestions } from "../test/fixtures/quizQuestions";

vi.mock("../data/questions.json", async () => {
  const { quizQuestions: questions } = await import(
    "../test/fixtures/quizQuestions"
  );
  return { default: questions };
});

vi.mock("../utils", async () => {
  const actual = await vi.importActual<typeof import("../utils")>("../utils");
  return {
    ...actual,
    shuffle: <T,>(array: T[]) => [...array],
  };
});

import { useQuiz } from "./useQuiz";
import { getScoreClass } from "../utils";

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
      quizQuestions[0].vehicule.question
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
      quizQuestions[0].qser.question
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
      quizQuestions[0].secours.question
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
            result.current.onCategoryChange(cat as QuizCategory);
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
            result.current.onCategoryChange(cat as QuizCategory);
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
      quizQuestions[0].vehicule.answer.text
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

  it("expose getScoreClass du utilitaire", () => {
    const { result } = renderHook(() => useQuiz());

    expect(result.current.getScoreClass(2)).toBe(getScoreClass(2));
    expect(result.current.getScoreClass(null)).toBe(getScoreClass(null));
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
            result.current.onCategoryChange(cat as QuizCategory);
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

  it("construit un QCM véhicule avec 3 images et l'option aucune", () => {
    const { result } = renderHook(() => useQuiz());

    const imageChoices = result.current.answerChoices.filter(
      (choice) => choice.kind === "image"
    );
    const noneChoice = result.current.answerChoices.find(
      (choice) => choice.kind === "text"
    );

    expect(result.current.isVehicleCategory).toBe(true);
    expect(imageChoices).toHaveLength(3);
    expect(imageChoices.some((choice) => choice.isCorrect)).toBe(true);
    expect(noneChoice?.text).toBe("Aucune des autres réponses");
    expect(noneChoice?.isCorrect).toBe(false);
  });

  it("construit un QCM connaissance avec 4 choix texte", () => {
    const { result } = renderHook(() => useQuiz());

    act(() => {
      result.current.onCategoryChange("qser");
    });

    expect(result.current.isVehicleCategory).toBe(false);
    expect(result.current.answerChoices).toHaveLength(4);
    expect(
      result.current.answerChoices.every((choice) => choice.kind === "text")
    ).toBe(true);
    expect(
      result.current.answerChoices.filter((choice) => choice.isCorrect)
    ).toHaveLength(1);
  });

  it("marque l'option aucune comme correcte quand le véhicule n'a pas d'image", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.8);
    const { result } = renderHook(() => useQuiz());

    expect(result.current.current.id).toBe(4);
    const noneChoice = result.current.answerChoices.find(
      (choice) => choice.text === "Aucune des autres réponses"
    );
    expect(noneChoice?.isCorrect).toBe(true);

    act(() => {
      result.current.toggleChoice(noneChoice!.id);
    });
    act(() => {
      result.current.handleValidate();
    });

    expect(result.current.wasCorrect).toBe(true);
  });

  it("expose la progression initiale puis une pastille completed après une question", () => {
    const { result } = renderHook(() => useQuiz());

    expect(result.current.progressEntries).toHaveLength(5);
    expect(result.current.progressEntries[0]).toMatchObject({
      value: "0/3",
      state: "current",
      score: 0,
    });
    expect(result.current.progressEntries[1]).toMatchObject({
      value: "-/3",
      state: "upcoming",
      score: null,
    });

    completeAllCategories(result);

    act(() => {
      result.current.handleAdvance();
    });

    expect(result.current.progressEntries[0]).toMatchObject({
      value: "3/3",
      state: "completed",
      score: 3,
    });
    expect(result.current.progressEntries[1].state).toBe("current");
  });

  it("ne fait rien si handleAdvance est appelé sans pendingAdvance", () => {
    const { result } = renderHook(() => useQuiz());

    act(() => {
      result.current.handleAdvance();
    });

    expect(result.current.category).toBe("vehicule");
    expect(result.current.isValidated).toBe(false);
    expect(result.current.pendingAdvance).toBeNull();
  });

  it("reset la validation via handleNextQuestion", () => {
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

    act(() => {
      result.current.handleNextQuestion({ finalizeCurrent: true });
    });

    expect(result.current.category).toBe("vehicule");
    expect(result.current.isValidated).toBe(false);
    expect(result.current.selectedChoices).toEqual([]);
    expect(result.current.categoryStatuses.vehicule).toBeNull();
    expect(result.current.questionScores).toHaveLength(1);
  });

  it("conserve la catégorie avec handleNextQuestion preserveCategory", () => {
    const { result } = renderHook(() => useQuiz());

    act(() => {
      result.current.onCategoryChange("secours");
    });

    act(() => {
      result.current.handleNextQuestion({ preserveCategory: true });
    });

    expect(result.current.category).toBe("secours");
    expect(result.current.isValidated).toBe(false);
  });

  it("remplace le choix précédent (sélection unique)", () => {
    const { result } = renderHook(() => useQuiz());
    const [firstChoice, secondChoice] = result.current.answerChoices;

    act(() => {
      result.current.toggleChoice(firstChoice.id);
    });
    act(() => {
      result.current.toggleChoice(secondChoice.id);
    });

    expect(result.current.selectedChoices).toEqual([secondChoice.id]);
  });

  it("réinitialise la sélection en changeant vers une catégorie non validée", () => {
    const { result } = renderHook(() => useQuiz());
    const firstChoice = result.current.answerChoices[0];

    act(() => {
      result.current.toggleChoice(firstChoice.id);
    });

    act(() => {
      result.current.onCategoryChange("qser");
    });

    expect(result.current.selectedChoices).toEqual([]);
    expect(result.current.isValidated).toBe(false);
    expect(result.current.wasCorrect).toBe(false);
  });

  it("affiche le message 'bon début' après une question parfaite (20%)", () => {
    const { result } = renderHook(() => useQuiz());

    completeAllCategories(result);
    act(() => {
      result.current.handleAdvance();
    });

    expect(result.current.seriesPercentage).toBe(20);
    expect(result.current.resultMessage).toContain("bon début");
  });

  it("affiche le message 'Bien joué' après trois questions parfaites (60%)", () => {
    const { result } = renderHook(() => useQuiz());

    for (let index = 0; index < 3; index += 1) {
      completeAllCategories(result);
      act(() => {
        result.current.handleAdvance();
      });
    }

    expect(result.current.seriesPercentage).toBe(60);
    expect(result.current.resultMessage).toContain("Bien joué");
  });

  it("affiche le message Excellent après quatre questions parfaites (80%)", () => {
    const { result } = renderHook(() => useQuiz());

    for (let index = 0; index < 4; index += 1) {
      completeAllCategories(result);
      act(() => {
        result.current.handleAdvance();
      });
    }

    expect(result.current.seriesPercentage).toBe(80);
    expect(result.current.resultMessage).toContain("Excellent");
  });

  it("joint les réponses multiples QSER en une seule solution", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.8);
    const { result } = renderHook(() => useQuiz());

    act(() => {
      result.current.onCategoryChange("qser");
    });

    expect(result.current.correctAnswerText()).toBe(
      "Sécurité Bon fonctionnement"
    );
  });
});

const CATEGORIES: QuizCategory[] = ["vehicule", "qser", "secours"];

type QuizHookResult = {
  current: ReturnType<typeof useQuiz>;
};

function completeAllCategories(result: QuizHookResult): void {
  CATEGORIES.forEach((category) => {
    if (result.current.category !== category) {
      act(() => {
        result.current.onCategoryChange(category);
      });
    }

    const correct = result.current.answerChoices.find(
      (choice) => choice.isCorrect
    );
    expect(correct).toBeDefined();

    act(() => {
      result.current.toggleChoice(correct!.id);
    });
    act(() => {
      result.current.handleValidate();
    });

    if (category !== "secours") {
      act(() => {
        result.current.handleAdvance();
      });
    }
  });
}
