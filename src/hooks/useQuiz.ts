import { useCallback, useEffect, useMemo, useState } from "react";
import questionsData from "../data/questions.json";
import { shuffle } from "../utils";
import type {
  QuizCategory,
  QuizQuestion,
  OptionChoice,
  Stats,
  CategoryStatus,
  PendingAdvance,
} from "../types";

const categoryOrder: QuizCategory[] = ["vehicule", "qser", "secours"];

const createEmptyStatuses = (): Record<QuizCategory, CategoryStatus> => ({
  vehicule: null,
  qser: null,
  secours: null,
});

const normalizeAnswer = (answer: string | string[]): string => {
  if (!answer) {
    return "";
  }
  if (Array.isArray(answer)) {
    return answer.join(" ").replace(/\s+/g, " ").trim();
  }
  return answer.trim();
};

export const useQuiz = () => {
  const questions = useMemo(() => questionsData as QuizQuestion[], []);

  const [category, setCategory] = useState<QuizCategory>("vehicule");
  const [current, setCurrent] = useState<QuizQuestion>(() => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  });
  const [stats, setStats] = useState<Stats>({
    vehicule: { asked: 0, correct: 0 },
    qser: { asked: 0, correct: 0 },
    secours: { asked: 0, correct: 0 },
  });
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [isValidated, setIsValidated] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [pendingAdvance, setPendingAdvance] = useState<PendingAdvance>(null);
  const [categoryStatuses, setCategoryStatuses] = useState<
    Record<QuizCategory, CategoryStatus>
  >(createEmptyStatuses());
  const [lockedChoices, setLockedChoices] = useState<
    Record<QuizCategory, OptionChoice[] | null>
  >({
    vehicule: null,
    qser: null,
    secours: null,
  });
  const [validatedChoices, setValidatedChoices] = useState<
    Record<QuizCategory, string[]>
  >({
    vehicule: [],
    qser: [],
    secours: [],
  });
  const [questionScores, setQuestionScores] = useState<
    { correct: number; total: number }[]
  >([]);
  const [showResults, setShowResults] = useState(false);
  const maxQuestions = 5;
  const currentQuestionCorrect =
    Object.values(categoryStatuses).filter((status) => status === "correct")
      .length ?? 0;

  const finalizeCurrentQuestion = useCallback(() => {
    setQuestionScores((prev) => {
      if (prev.length >= maxQuestions) {
        return prev;
      }
      const nextEntry = { correct: currentQuestionCorrect, total: 3 };
      return [...prev, nextEntry];
    });
  }, [currentQuestionCorrect, maxQuestions]);

  const pickRandomQuestion = useCallback(
    (previousId?: number): QuizQuestion => {
      if (!questions.length) {
        return current;
      }
      let nextQuestion: QuizQuestion | null = null;
      let safety = 0;

      while (!nextQuestion && safety < 10) {
        const randomIndex = Math.floor(Math.random() * questions.length);
        const candidate = questions[randomIndex];
        if (candidate.id !== previousId) {
          nextQuestion = candidate;
        }
        safety += 1;
      }

      return nextQuestion ?? questions[0] ?? current;
    },
    [questions, current]
  );

  const handleNextQuestion = useCallback(
    (options?: {
      previousId?: number;
      preserveCategory?: boolean;
      finalizeCurrent?: boolean;
    }) => {
      if (options?.finalizeCurrent) {
        finalizeCurrentQuestion();
      }
      const next = pickRandomQuestion(options?.previousId ?? current.id);
      setCurrent(next);
      setSelectedChoices([]);
      setIsValidated(false);
      setWasCorrect(false);
      setPendingAdvance(null);
      setCategoryStatuses(createEmptyStatuses());
      setLockedChoices({
        vehicule: null,
        qser: null,
        secours: null,
      });
      setValidatedChoices({
        vehicule: [],
        qser: [],
        secours: [],
      });
      setShowResults(false);
      if (!options?.preserveCategory) {
        setCategory("vehicule");
      }
    },
    [current.id, pickRandomQuestion, finalizeCurrentQuestion]
  );

  const onCategoryChange = useCallback(
    (nextCategory: QuizCategory) => {
      setCategory(nextCategory);
      // Si la catégorie a déjà été validée, on restaure l'état validé et les choix
      if (categoryStatuses[nextCategory] !== null) {
        setIsValidated(true);
        setWasCorrect(categoryStatuses[nextCategory] === "correct");
        setSelectedChoices(validatedChoices[nextCategory] || []);
      } else {
        setSelectedChoices([]);
        setIsValidated(false);
        setWasCorrect(false);
        setLockedChoices((prev) => ({
          ...prev,
          [nextCategory]: null,
        }));
      }
      setPendingAdvance(null);
    },
    [categoryStatuses, validatedChoices]
  );

  const progressEntries = useMemo(() => {
    return Array.from({ length: maxQuestions }, (_, index) => {
      if (index < questionScores.length) {
        const score = questionScores[index].correct;
        return {
          value: `${score}/3`,
          state: "completed" as const,
          score,
        };
      }
      if (index === questionScores.length) {
        return {
          value: `${currentQuestionCorrect}/3`,
          state: "current" as const,
          score: currentQuestionCorrect,
        };
      }
      return { value: "-/3", state: "upcoming" as const, score: null };
    });
  }, [questionScores, currentQuestionCorrect, maxQuestions]);

  const isVehicleCategory = category === "vehicule";
  const activeQuestion = isVehicleCategory
    ? current.vehicule
    : category === "qser"
    ? current.qser
    : current.secours;

  const extractAnswerTexts = useCallback(
    (question: QuizQuestion, selected: QuizCategory): string[] => {
      if (selected === "vehicule") {
        const text = question.vehicule.answer.text?.trim();
        return text ? [text] : [];
      }
      const answerBlock =
        selected === "qser" ? question.qser.answer : question.secours.answer;
      if (Array.isArray(answerBlock)) {
        const content = normalizeAnswer(answerBlock);
        return content ? [content] : [];
      }
      return answerBlock ? [answerBlock.trim()] : [];
    },
    []
  );

  const buildVehicleChoices = useCallback(
    (question: QuizQuestion): OptionChoice[] => {
      const correctImage = question.vehicule.answer.image?.trim();
      const hasImage = Boolean(correctImage);

      const otherImages = questions
        .filter((q) => q.id !== question.id && q.vehicule.answer.image)
        .map((q) => ({
          src: q.vehicule.answer.image!.trim(),
        }))
        .filter((entry) => entry.src);

      const uniqueImages: { src: string; text?: string }[] = [];
      otherImages.forEach((entry) => {
        if (!uniqueImages.find((img) => img.src === entry.src)) {
          uniqueImages.push(entry);
        }
      });

      const imageChoices: OptionChoice[] = [];

      const addImageOption = (entry: { src: string }, isCorrect: boolean) => {
        imageChoices.push({
          id: `vehicule-image-${question.id}-${imageChoices.length}`,
          imageSrc: entry.src,
          isCorrect,
          kind: "image" as const,
        });
      };

      if (hasImage && correctImage) {
        addImageOption(
          {
            src: correctImage,
          },
          true
        );
      }

      const availableImages = uniqueImages.filter(
        (entry) => entry.src !== correctImage
      );

      while (imageChoices.length < 3 && availableImages.length > 0) {
        const index = Math.floor(Math.random() * availableImages.length);
        const entry = availableImages.splice(index, 1)[0];
        addImageOption(entry, false);
      }

      if (imageChoices.length < 3 && uniqueImages.length > 0) {
        let fallbackIndex = 0;
        while (imageChoices.length < 3 && fallbackIndex < uniqueImages.length) {
          const entry = uniqueImages[fallbackIndex % uniqueImages.length];
          if (entry.src !== correctImage) {
            addImageOption(entry, false);
          }
          fallbackIndex += 1;
        }
      }

      if (imageChoices.length < 3 && hasImage && correctImage) {
        while (imageChoices.length < 3) {
          addImageOption(
            {
              src: correctImage,
            },
            imageChoices.length === 0
          );
        }
      }

      while (imageChoices.length < 3) {
        const placeholder =
          uniqueImages[imageChoices.length % Math.max(uniqueImages.length, 1)];
        if (placeholder) {
          addImageOption(placeholder, false);
        } else {
          break;
        }
      }

      const noneOption: OptionChoice = {
        id: `vehicule-none-${question.id}`,
        text: "Aucune des autres réponses",
        isCorrect: !hasImage,
        kind: "text" as const,
      };

      return shuffle([...imageChoices.slice(0, 3), noneOption]);
    },
    [questions]
  );

  const buildKnowledgeChoices = useCallback(
    (
      question: QuizQuestion,
      selectedCategory: QuizCategory
    ): OptionChoice[] => {
      const correct = extractAnswerTexts(question, selectedCategory).filter(
        Boolean
      );

      const sameCategoryPool = questions
        .filter((q) => q.id !== question.id)
        .flatMap((q) => extractAnswerTexts(q, selectedCategory))
        .filter(Boolean);

      const uniqueDistractors = Array.from(new Set(sameCategoryPool));

      const targetTotal =
        correct.length >= 2 ? Math.min(correct.length + 2, 4) : 4;
      const neededFalse = Math.max(targetTotal - correct.length, 2);

      const randomFalse: string[] = [];
      const available = [...uniqueDistractors];

      while (randomFalse.length < neededFalse && available.length > 0) {
        const index = Math.floor(Math.random() * available.length);
        const candidate = available.splice(index, 1)[0];
        if (!correct.includes(candidate)) {
          randomFalse.push(candidate);
        }
      }

      if (randomFalse.length < neededFalse) {
        const fallbackPool = sameCategoryPool.filter(
          (text) => !correct.includes(text)
        );
        let fallbackIndex = 0;
        while (randomFalse.length < neededFalse && fallbackPool.length > 0) {
          const candidate = fallbackPool[fallbackIndex % fallbackPool.length];
          randomFalse.push(candidate);
          fallbackIndex += 1;
        }
      }

      const optionList: OptionChoice[] = [
        ...correct.map((text, idx) => ({
          id: `correct-${question.id}-${idx}`,
          text,
          isCorrect: true,
          kind: "text" as const,
        })),
        ...randomFalse.map((text, idx) => ({
          id: `false-${question.id}-${idx}`,
          text,
          isCorrect: false,
          kind: "text" as const,
        })),
      ];

      if (optionList.length < 3) {
        const fillerPool =
          randomFalse.length > 0
            ? randomFalse
            : sameCategoryPool.filter((text) => !correct.includes(text));
        let fillerIndex = 0;
        while (optionList.length < 3 && fillerPool.length > 0) {
          const text = fillerPool[fillerIndex % fillerPool.length];
          optionList.push({
            id: `fallback-${question.id}-${fillerIndex}`,
            text,
            isCorrect: false,
            kind: "text" as const,
          });
          fillerIndex += 1;
        }
      }

      const shuffled = shuffle(optionList);
      if (shuffled.length >= 4) {
        return shuffled.slice(0, 4);
      }
      if (shuffled.length === 3) {
        return shuffled;
      }
      return shuffled;
    },
    [questions, extractAnswerTexts]
  );

  const buildChoices = useCallback(
    (
      question: QuizQuestion,
      selectedCategory: QuizCategory
    ): OptionChoice[] => {
      if (selectedCategory === "vehicule") {
        return buildVehicleChoices(question);
      }
      return buildKnowledgeChoices(question, selectedCategory);
    },
    [buildKnowledgeChoices, buildVehicleChoices]
  );

  const answerChoices = useMemo(() => {
    const stored = lockedChoices[category];
    if (stored && categoryStatuses[category] !== null) {
      return stored;
    }
    return buildChoices(current, category);
  }, [buildChoices, current, category, lockedChoices, categoryStatuses]);

  useEffect(() => {
    if (categoryStatuses[category] !== null) {
      setSelectedChoices(validatedChoices[category] || []);
      setIsValidated(true);
      setWasCorrect(categoryStatuses[category] === "correct");
      return;
    }

    setSelectedChoices([]);
    setIsValidated(false);
    setWasCorrect(false);
  }, [answerChoices, category, categoryStatuses, validatedChoices]);

  const toggleChoice = useCallback(
    (choiceId: string) => {
      // Ne pas permettre de modifier les choix si la catégorie a déjà été validée
      if (categoryStatuses[category] !== null) {
        return;
      }
      // Ne permettre qu'une seule sélection
      setSelectedChoices((prev) => (prev.includes(choiceId) ? [] : [choiceId]));
    },
    [category, categoryStatuses]
  );

  const evaluateSelection = useCallback(
    (choices: OptionChoice[], selected: string[]): boolean => {
      if (!selected.length) {
        return false;
      }
      // Avec une seule sélection, on vérifie si le choix sélectionné est correct
      const selectedId = selected[0];
      const selectedChoice = choices.find((choice) => choice.id === selectedId);
      return selectedChoice ? selectedChoice.isCorrect : false;
    },
    []
  );

  const handleValidate = useCallback(() => {
    if (!selectedChoices.length || isValidated) {
      return;
    }
    const success = evaluateSelection(answerChoices, selectedChoices);
    setIsValidated(true);
    setWasCorrect(success);

    setStats((prev) => ({
      ...prev,
      [category]: {
        asked: prev[category].asked + 1,
        correct: prev[category].correct + (success ? 1 : 0),
      },
    }));
    setCategoryStatuses((prev) => ({
      ...prev,
      [category]: success ? "correct" : "incorrect",
    }));
    setLockedChoices((prev) => ({
      ...prev,
      [category]: answerChoices,
    }));
    // Stocker les choix validés pour cette catégorie
    setValidatedChoices((prev) => ({
      ...prev,
      [category]: [...selectedChoices],
    }));

    const currentIndex = categoryOrder.indexOf(category);
    const isLastCategory = currentIndex === categoryOrder.length - 1;
    const isLastQuestion = questionScores.length >= maxQuestions - 1;

    if (isLastCategory && isLastQuestion) {
      setPendingAdvance({ type: "result" });
    } else if (currentIndex >= 0 && currentIndex < categoryOrder.length - 1) {
      setPendingAdvance({
        type: "category",
        target: categoryOrder[currentIndex + 1],
      });
    } else {
      setPendingAdvance({ type: "question" });
    }
  }, [
    selectedChoices,
    isValidated,
    evaluateSelection,
    answerChoices,
    category,
    questionScores.length,
    maxQuestions,
  ]);

  const correctAnswerText = useCallback((): string => {
    if (isVehicleCategory) {
      return current.vehicule.answer.text;
    }
    const answerBlock =
      category === "qser" ? current.qser.answer : current.secours.answer;
    return Array.isArray(answerBlock) ? answerBlock.join(" ") : answerBlock;
  }, [isVehicleCategory, category, current]);

  const totalCorrectAll = useMemo(
    () => questionScores.reduce((sum, q) => sum + q.correct, 0),
    [questionScores]
  );

  const seriesPercentage = useMemo(() => {
    if (!questionScores.length) return 0;
    const maxScore = maxQuestions * 3;
    return Math.round((totalCorrectAll / maxScore) * 100);
  }, [totalCorrectAll, maxQuestions, questionScores.length]);

  const resultMessage = useMemo(() => {
    if (seriesPercentage >= 80) {
      return "Excellent ! Tu maîtrises très bien ces vérifications, sécurité routière et gestes de secours.";
    }
    if (seriesPercentage >= 50) {
      return "Bien joué ! Encore quelques séries et tu seras parfaitement à l'aise.";
    }
    if (seriesPercentage >= 20) {
      return "C'est un bon début. N'hésite pas à refaire une série pour renforcer tes connaissances.";
    }
    return "Pas de souci, c'est justement fait pour s'entraîner. Lance une nouvelle série et progresse à ton rythme.";
  }, [seriesPercentage]);

  const resetSeries = useCallback(() => {
    const next = pickRandomQuestion(current.id);
    setCurrent(next);
    setSelectedChoices([]);
    setIsValidated(false);
    setWasCorrect(false);
    setPendingAdvance(null);
    setCategoryStatuses(createEmptyStatuses());
    setLockedChoices({
      vehicule: null,
      qser: null,
      secours: null,
    });
    setValidatedChoices({
      vehicule: [],
      qser: [],
      secours: [],
    });
    setQuestionScores([]);
    setShowResults(false);
    setCategory("vehicule");
  }, [current.id, pickRandomQuestion]);

  const getScoreClass = useCallback((score: number | null): string => {
    if (score === null) {
      return "";
    }
    if (score <= 0) {
      return " progress-chip--score-0";
    }
    if (score === 1) {
      return " progress-chip--score-1";
    }
    if (score === 2) {
      return " progress-chip--score-2";
    }
    return " progress-chip--score-3";
  }, []);

  const handleAdvance = useCallback(() => {
    if (!pendingAdvance) return;

    if (pendingAdvance.type === "category") {
      onCategoryChange(pendingAdvance.target);
    } else if (pendingAdvance.type === "question") {
      handleNextQuestion({
        preserveCategory: false,
        finalizeCurrent: true,
      });
    } else if (pendingAdvance.type === "result") {
      finalizeCurrentQuestion();
      setShowResults(true);
      setPendingAdvance(null);
    }
  }, [
    pendingAdvance,
    onCategoryChange,
    handleNextQuestion,
    finalizeCurrentQuestion,
  ]);

  return {
    // State
    category,
    current,
    stats,
    selectedChoices,
    isValidated,
    wasCorrect,
    pendingAdvance,
    categoryStatuses,
    answerChoices,
    activeQuestion,
    progressEntries,
    questionScores,
    showResults,
    seriesPercentage,
    resultMessage,
    isVehicleCategory,

    // Actions
    toggleChoice,
    handleValidate,
    handleNextQuestion,
    onCategoryChange,
    resetSeries,
    handleAdvance,

    // Computed
    correctAnswerText,
    getScoreClass,
  };
};
