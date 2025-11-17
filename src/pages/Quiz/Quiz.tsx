import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type SVGProps,
} from "react";
import { Link } from "react-router-dom";
import questionsData from "../../data/questions.json";
import "./Quiz.css";

type QuizCategory = "vehicule" | "qser" | "secours";

type VehicleAnswer = {
  text: string;
  image?: string;
};

type VehicleQuestion = {
  question: string;
  answer: VehicleAnswer;
};

type KnowledgeQuestion = {
  question: string;
  answer: string | string[];
  multiple: boolean;
};

type QuizQuestion = {
  id: number;
  name: string;
  theme: string;
  vehicule: VehicleQuestion;
  qser: KnowledgeQuestion;
  secours: KnowledgeQuestion;
};

type OptionChoice = {
  id: string;
  text?: string;
  imageSrc?: string;
  isCorrect: boolean;
  kind: "text" | "image";
};

type Stats = Record<
  QuizCategory,
  {
    asked: number;
    correct: number;
  }
>;

type CategoryStatus = "correct" | "incorrect" | null;

type PendingAdvance =
  | { type: "category"; target: QuizCategory }
  | { type: "question" }
  | { type: "result" }
  | null;

const categoryConfig: Record<
  QuizCategory,
  { label: string; subtitle: string; accent: string }
> = {
  vehicule: {
    label: "Vérifications véhicule",
    subtitle: "Commandes & contrôles en voiture",
    accent: "#2563eb",
  },
  qser: {
    label: "Sécurité routière",
    subtitle: "Connaissances théoriques",
    accent: "#db2777",
  },
  secours: {
    label: "Gestes de secours",
    subtitle: "Réactions en situation d'urgence",
    accent: "#059669",
  },
};

const categoryOrder: QuizCategory[] = ["vehicule", "qser", "secours"];

const TrafficLightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <rect
      x="10"
      y="4"
      width="12"
      height="24"
      rx="4"
      fill="url(#traffic-body)"
    />
    <circle cx="16" cy="10" r="3" fill="#f87171" />
    <circle cx="16" cy="16" r="3" fill="#fcd34d" />
    <circle cx="16" cy="22" r="3" fill="#34d399" />
    <defs>
      <linearGradient
        id="traffic-body"
        x1="10"
        y1="4"
        x2="22"
        y2="28"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#312e81" />
        <stop offset="1" stopColor="#1f2937" />
      </linearGradient>
    </defs>
  </svg>
);

const SuccessIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <circle cx="12" cy="12" r="10" fill="#22c55e" opacity="0.15" />
    <path
      d="M8 12.5l2.5 2.5L16 9"
      stroke="#16a34a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ErrorIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <circle cx="12" cy="12" r="10" fill="#f87171" opacity="0.15" />
    <path
      d="M9 9l6 6M15 9l-6 6"
      stroke="#dc2626"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path
      d="M5 12h14m0 0l-5-5m5 5l-5 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const createEmptyStatuses = (): Record<QuizCategory, CategoryStatus> => ({
  vehicule: null,
  qser: null,
  secours: null,
});

const Quiz = () => {
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

  const normalizeAnswer = (answer: string | string[]) => {
    if (!answer) {
      return "";
    }
    if (Array.isArray(answer)) {
      return answer.join(" ").replace(/\s+/g, " ").trim();
    }
    return answer.trim();
  };

  const extractAnswerTexts = useCallback(
    (question: QuizQuestion, selected: QuizCategory) => {
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

  const shuffle = <T,>(input: T[]): T[] => {
    const copy = [...input];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

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

  const toggleChoice = (choiceId: string) => {
    // Ne pas permettre de modifier les choix si la catégorie a déjà été validée
    if (categoryStatuses[category] !== null) {
      return;
    }
    setSelectedChoices((prev) =>
      prev.includes(choiceId)
        ? prev.filter((id) => id !== choiceId)
        : [...prev, choiceId]
    );
  };

  const evaluateSelection = (choices: OptionChoice[], selected: string[]) => {
    const correctIds = choices
      .filter((choice) => choice.isCorrect)
      .map((choice) => choice.id);
    if (!selected.length || !correctIds.length) {
      return false;
    }
    if (selected.length !== correctIds.length) {
      return false;
    }
    return correctIds.every((id) => selected.includes(id));
  };

  const handleValidate = () => {
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
  };

  const correctAnswerText = () => {
    if (isVehicleCategory) {
      return current.vehicule.answer.text;
    }
    const answerBlock =
      category === "qser" ? current.qser.answer : current.secours.answer;
    return Array.isArray(answerBlock) ? answerBlock.join(" ") : answerBlock;
  };

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

  const resetSeries = () => {
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
  };

  const getScoreClass = (score: number | null) => {
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
  };

  return (
    <div className="quiz">
      <div className="quiz-container">
        <header className="quiz-header">
          <div>
            <p className="quiz-eyebrow">Mode Quizz</p>
            <h1>
              <TrafficLightIcon className="heading-icon" />
              Quiz du permis
            </h1>
            <p className="quiz-subtitle">
              Choisis une catégorie, réponds à la question, valide ta réponse et
              passe à la suivante.
            </p>
            <div className="quiz-cta-row">
              <button
                type="button"
                className="random-btn"
                onClick={() =>
                  handleNextQuestion({
                    previousId: current.id,
                    preserveCategory: false,
                  })
                }
              >
                Questions aléatoires
              </button>
              <div className="quiz-progress">
                {progressEntries.map((entry, index) => (
                  <span
                    key={`progress-${index}`}
                    className={`progress-chip progress-chip--${
                      entry.state
                    }${getScoreClass(entry.score ?? null)}`}
                  >
                    {entry.value}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Link to="/" className="quiz-home-btn">
            Retour
          </Link>
        </header>

        {showResults && (
          <section className="series-result">
            <h2>Résultat de la série</h2>
            <p className="series-result-score">{seriesPercentage}%</p>
            <p className="series-result-message">{resultMessage}</p>
            <button
              type="button"
              className="action primary series-result-restart"
              onClick={resetSeries}
            >
              Commencer une autre série de questions
            </button>
          </section>
        )}

        <div className="category-tabs">
          {(Object.keys(categoryConfig) as QuizCategory[]).map((key) => (
            <button
              key={key}
              type="button"
              className={`category-tab${
                category === key ? " category-tab--active" : ""
              }${
                isValidated && category === key
                  ? wasCorrect
                    ? " category-tab--correct"
                    : " category-tab--incorrect"
                  : categoryStatuses[key] === "correct"
                  ? " category-tab--past-correct"
                  : categoryStatuses[key] === "incorrect"
                  ? " category-tab--past-incorrect"
                  : ""
              }`}
              onClick={() => onCategoryChange(key)}
            >
              <span className="category-label">
                {categoryConfig[key].label}
              </span>
              <span className="category-subtitle">
                {categoryConfig[key].subtitle}
              </span>
              <span className="category-stat">
                {stats[key].correct}/{stats[key].asked}
              </span>
            </button>
          ))}
        </div>

        <section className="question-card">
          <div className="question-meta">
            <span className="question-theme">{current.theme}</span>
            <span className="question-name">{current.name}</span>
          </div>
          <h2>{activeQuestion.question}</h2>
        </section>

        <section className="answer-panel">
          <div className="answer-options">
            {answerChoices.map((choice) => (
              <label
                key={choice.id}
                className={`option-item${
                  choice.kind === "image" ? " image-option" : ""
                }${
                  isValidated
                    ? choice.isCorrect
                      ? " correct"
                      : selectedChoices.includes(choice.id)
                      ? " wrong"
                      : ""
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedChoices.includes(choice.id)}
                  onChange={() => toggleChoice(choice.id)}
                  disabled={isValidated || categoryStatuses[category] !== null}
                />
                <div className="option-content">
                  {choice.kind === "image" && choice.imageSrc ? (
                    <div className="option-image-wrapper">
                      <img src={choice.imageSrc} alt="Proposition véhicule" />
                    </div>
                  ) : (
                    <span>{choice.text}</span>
                  )}
                </div>
              </label>
            ))}
          </div>
          {isValidated && (
            <div
              className={`validation-banner${
                wasCorrect ? " success" : " error"
              }`}
            >
              {wasCorrect ? (
                <>
                  <SuccessIcon className="banner-icon" />
                  <span>Bonne réponse</span>
                </>
              ) : (
                <>
                  <ErrorIcon className="banner-icon" />
                  <span>Réponse incorrecte, réessaie !</span>
                </>
              )}
            </div>
          )}
        </section>

        <div className="quiz-actions">
          <div className="self-eval">
            <button
              type="button"
              className="action success"
              onClick={handleValidate}
              disabled={!selectedChoices.length || isValidated}
            >
              Valider
            </button>
          </div>
          {isValidated && pendingAdvance && (
            <button
              type="button"
              className="action primary"
              onClick={() => {
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
              }}
            >
              <ArrowRightIcon className="arrow-icon" />
              {pendingAdvance.type === "category"
                ? `Continuer vers ${
                    categoryConfig[pendingAdvance.target].label
                  }`
                : pendingAdvance.type === "question"
                ? "Question suivante"
                : "Résultat"}
            </button>
          )}
        </div>

        {isValidated && (
          <section className="solution-panel">
            <h3>Solution</h3>
            <p>{correctAnswerText()}</p>
            {isVehicleCategory && current.vehicule.answer.image && (
              <img
                src={current.vehicule.answer.image}
                alt={`Illustration question ${current.name}`}
                className="solution-image"
              />
            )}
          </section>
        )}

        <footer className="quiz-footer">
          <p>
            Astuce : révise jusqu'à atteindre au moins 80% de bonnes réponses
            dans chaque catégorie.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Quiz;
