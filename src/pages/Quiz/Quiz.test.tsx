import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { QuizQuestion } from "../../types";
import { getScoreClass } from "../../utils";
import { quizQuestions } from "../../test/fixtures/quizQuestions";
import { renderWithRouter } from "../../test/renderWithRouter";

type QuizViewState = ReturnType<typeof import("../../hooks/useQuiz").useQuiz>;

const sampleQuestion: QuizQuestion = quizQuestions[0];

const { useQuizMock } = vi.hoisted(() => ({
  useQuizMock: vi.fn(),
}));

vi.mock("../../hooks/useQuiz", () => ({
  useQuiz: () => useQuizMock(),
}));

import Quiz from "./Quiz";

const createQuizState = (
  overrides: Partial<QuizViewState> = {}
): QuizViewState => ({
  category: "vehicule",
  current: sampleQuestion,
  stats: {
    vehicule: { asked: 0, correct: 0 },
    qser: { asked: 0, correct: 0 },
    secours: { asked: 0, correct: 0 },
  },
  selectedChoices: [],
  isValidated: false,
  wasCorrect: false,
  pendingAdvance: null,
  categoryStatuses: {
    vehicule: null,
    qser: null,
    secours: null,
  },
  answerChoices: [
    {
      id: "choice-correct",
      text: "À gauche du volant",
      isCorrect: true,
      kind: "text",
    },
    {
      id: "choice-wrong",
      text: "À droite du volant",
      isCorrect: false,
      kind: "text",
    },
  ],
  activeQuestion: sampleQuestion.vehicule,
  progressEntries: [
    { value: "0/3", state: "current", score: 0 },
    { value: "-/3", state: "upcoming", score: null },
  ],
  questionScores: [],
  showResults: false,
  seriesPercentage: 0,
  resultMessage: "Pas de souci, c'est justement fait pour s'entraîner.",
  isVehicleCategory: true,
  toggleChoice: vi.fn(),
  handleValidate: vi.fn(),
  onCategoryChange: vi.fn(),
  resetSeries: vi.fn(),
  handleAdvance: vi.fn(),
  handleNextQuestion: vi.fn(),
  correctAnswerText: () => sampleQuestion.vehicule.answer.text,
  getScoreClass,
  ...overrides,
});

describe("Quiz page", () => {
  beforeEach(() => {
    useQuizMock.mockReturnValue(createQuizState());
  });

  it("affiche le titre, la question et le lien retour", () => {
    renderWithRouter(<Quiz />);

    expect(
      screen.getByRole("heading", { name: /Quiz du permis/ })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Où se trouve la commande des feux ?")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Retour à l'accueil" })
    ).toHaveAttribute("href", "/");
  });

  it("applique les classes de score réelles sur les pastilles", () => {
    renderWithRouter(<Quiz />);

    expect(screen.getByText("0/3")).toHaveClass("progress-chip--score-0");
    expect(screen.getByText("-/3")).not.toHaveClass("progress-chip--score-0");
  });

  it("applique la classe correspondant au score d'une question terminée", () => {
    useQuizMock.mockReturnValue(
      createQuizState({
        progressEntries: [
          { value: "3/3", state: "completed", score: 3 },
          { value: "1/3", state: "current", score: 1 },
        ],
      })
    );
    renderWithRouter(<Quiz />);

    expect(screen.getByText("3/3")).toHaveClass("progress-chip--score-3");
    expect(screen.getByText("1/3")).toHaveClass("progress-chip--score-1");
  });

  it("désactive Valider tant qu'aucun choix n'est sélectionné", () => {
    renderWithRouter(<Quiz />);

    expect(screen.getByRole("button", { name: "Valider" })).toBeDisabled();
  });

  it("appelle toggleChoice au clic sur une option", async () => {
    const user = userEvent.setup();
    const toggleChoice = vi.fn();
    useQuizMock.mockReturnValue(createQuizState({ toggleChoice }));
    renderWithRouter(<Quiz />);

    await user.click(
      screen.getByRole("radio", { name: "À gauche du volant" })
    );

    expect(toggleChoice).toHaveBeenCalledWith("choice-correct");
  });

  it("autorise Valider après une sélection", async () => {
    const user = userEvent.setup();
    const handleValidate = vi.fn();
    useQuizMock.mockReturnValue(
      createQuizState({
        selectedChoices: ["choice-correct"],
        handleValidate,
      })
    );
    renderWithRouter(<Quiz />);

    const validateButton = screen.getByRole("button", { name: "Valider" });
    expect(validateButton).toBeEnabled();

    await user.click(validateButton);
    expect(handleValidate).toHaveBeenCalledTimes(1);
  });

  it("affiche la bannière de succès et la solution après une bonne réponse", () => {
    useQuizMock.mockReturnValue(
      createQuizState({
        selectedChoices: ["choice-correct"],
        isValidated: true,
        wasCorrect: true,
        pendingAdvance: { type: "category", target: "qser" },
        categoryStatuses: {
          vehicule: "correct",
          qser: null,
          secours: null,
        },
      })
    );
    renderWithRouter(<Quiz />);

    expect(screen.getByText("Bonne réponse")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Solution" })).toBeInTheDocument();
    expect(screen.getByAltText("Illustration question Q1")).toHaveAttribute(
      "src",
      "/Img/Q01.png"
    );
    expect(
      screen.getByRole("button", {
        name: /Continuer vers Sécurité routière/,
      })
    ).toBeInTheDocument();
  });

  it("affiche la bannière d'erreur après une mauvaise réponse", () => {
    useQuizMock.mockReturnValue(
      createQuizState({
        selectedChoices: ["choice-wrong"],
        isValidated: true,
        wasCorrect: false,
        pendingAdvance: { type: "category", target: "qser" },
      })
    );
    renderWithRouter(<Quiz />);

    expect(screen.getByText("Réponse incorrecte, réessaie !")).toBeInTheDocument();
  });

  it("change de catégorie via les onglets", async () => {
    const user = userEvent.setup();
    const onCategoryChange = vi.fn();
    useQuizMock.mockReturnValue(createQuizState({ onCategoryChange }));
    renderWithRouter(<Quiz />);

    await user.click(
      screen.getByRole("button", { name: /Sécurité routière/ })
    );

    expect(onCategoryChange).toHaveBeenCalledWith("qser");
  });

  it("relance une série via Nouvelle série", async () => {
    const user = userEvent.setup();
    const resetSeries = vi.fn();
    useQuizMock.mockReturnValue(createQuizState({ resetSeries }));
    renderWithRouter(<Quiz />);

    await user.click(screen.getByRole("button", { name: "Nouvelle série" }));
    expect(resetSeries).toHaveBeenCalledTimes(1);
  });

  it("affiche le résultat de série", async () => {
    const user = userEvent.setup();
    const resetSeries = vi.fn();
    useQuizMock.mockReturnValue(
      createQuizState({
        showResults: true,
        seriesPercentage: 80,
        resultMessage: "Excellent ! Tu maîtrises très bien ces vérifications.",
        resetSeries,
      })
    );
    renderWithRouter(<Quiz />);

    expect(
      screen.getByRole("heading", { name: "Résultat de la série" })
    ).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText(/Excellent/)).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Commencer une autre série de questions",
      })
    );
    expect(resetSeries).toHaveBeenCalledTimes(1);
  });

  it("propose Question suivante quand la question est terminée", () => {
    useQuizMock.mockReturnValue(
      createQuizState({
        isValidated: true,
        pendingAdvance: { type: "question" },
      })
    );
    renderWithRouter(<Quiz />);

    expect(
      screen.getByRole("button", { name: /Question suivante/ })
    ).toBeInTheDocument();
  });
});
