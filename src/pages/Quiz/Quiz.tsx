import { Link } from "react-router-dom";
import { useQuiz } from "../../hooks/useQuiz";
import type { QuizCategory } from "../../types";
import {
  TrafficLightIcon,
  SuccessIcon,
  ErrorIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "../../components/Icons";
import "./Quiz.css";

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

const Quiz = () => {
  const {
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
    showResults,
    seriesPercentage,
    resultMessage,
    isVehicleCategory,
    toggleChoice,
    handleValidate,
    handleNextQuestion,
    onCategoryChange,
    resetSeries,
    handleAdvance,
    correctAnswerText,
    getScoreClass,
  } = useQuiz();

  return (
    <div className="quiz">
      <div className="quiz-container">
        <header className="quiz-header">
          <div className="quiz-header-top">
            <Link to="/" className="back-link" aria-label="Retour à l'accueil">
              <ArrowLeftIcon className="back-arrow" />
            </Link>
            <h1>
              <img src="/logo.png" alt="RéviPermis" className="quiz-logo" />
              <span className="quiz-title-text">Quiz du permis</span>
              <TrafficLightIcon className="heading-icon" />
            </h1>
          </div>
          <div>
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
                  type="radio"
                  name={`quiz-choice-${category}`}
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
              onClick={handleAdvance}
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
