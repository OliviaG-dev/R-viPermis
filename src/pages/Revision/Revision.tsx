import { useState } from "react";
import { Link } from "react-router-dom";
import { questions } from "../../data/questions";
import "./Revision.css";

const getMobileThemeLabel = (theme: string) => {
  const normalizedTheme = theme.toLowerCase();
  if (normalizedTheme.includes("intérieur")) {
    return "Interne";
  }
  if (normalizedTheme.includes("extérieur")) {
    return "Externe";
  }
  return theme;
};

const Revision = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswers, setShowAnswers] = useState({
    vehicule: false,
    qser: false,
    secours: false,
  });

  const currentQuestion = questions[currentIndex];
  const mobileThemeLabel = getMobileThemeLabel(currentQuestion.theme);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? questions.length - 1 : prev - 1));
    setShowAnswers({ vehicule: false, qser: false, secours: false });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === questions.length - 1 ? 0 : prev + 1));
    setShowAnswers({ vehicule: false, qser: false, secours: false });
  };

  const goToRandom = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    setCurrentIndex(randomIndex);
    setShowAnswers({ vehicule: false, qser: false, secours: false });
  };

  const toggleAnswer = (section: "vehicule" | "qser" | "secours") => {
    setShowAnswers((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatAnswer = (answer: string | string[]): string => {
    if (Array.isArray(answer)) {
      return answer.join("\n");
    }
    return answer;
  };

  return (
    <div className="revision">
      <div className="revision-container">
        <header className="revision-header">
          <div className="revision-header-top">
            <Link to="/" className="back-link" aria-label="Retour à l'accueil">
              <svg
                className="back-arrow"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1>
              Révision du Permis{" "}
              <svg
                className="header-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5c0 .8.7 1.5 1.5 1.5h13c.8 0 1.5-.7 1.5-1.5v-15c0-.8-.7-1.5-1.5-1.5h-13C4.7 3 4 3.7 4 4.5v15z" />
                <path d="M8 8h8M8 12h8M8 16h6" />
                <path d="M6 3v18" strokeWidth="1.5" />
              </svg>
            </h1>
          </div>
          <div className="revision-counter">
            Question {currentIndex + 1} / {questions.length}
          </div>
        </header>

        <div className="revision-content">
          <div className="question-card">
            <div className="question-header">
              <span className="question-id">Question {currentQuestion.id}</span>
              <span className="question-theme">
                <span className="theme-label-desktop">
                  {currentQuestion.theme}
                </span>
                <span className="theme-label-mobile">{mobileThemeLabel}</span>
              </span>
            </div>

            <div className="question-sections">
              {/* Section Véhicule */}
              <section className="question-section">
                <h3 className="section-title">
                  <svg
                    className="section-icon section-icon-vehicule"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 17h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2z" />
                    <path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" />
                    <path d="M7 11h10" />
                    <path d="M9 8h6" />
                    <circle cx="7" cy="17" r="2" fill="#3b82f6" />
                    <circle cx="17" cy="17" r="2" fill="#3b82f6" />
                  </svg>
                  Véhicule
                </h3>
                <p className="section-question">
                  {currentQuestion.vehicule.question}
                </p>
                <div className="section-answer">
                  {!showAnswers.vehicule ? (
                    <button
                      className="reveal-btn"
                      onClick={() => toggleAnswer("vehicule")}
                    >
                      Afficher
                    </button>
                  ) : (
                    <>
                      <p>{currentQuestion.vehicule.answer.text}</p>
                      {currentQuestion.vehicule.answer.image && (
                        <img
                          src={currentQuestion.vehicule.answer.image}
                          alt="Illustration"
                          className="question-image"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      )}
                    </>
                  )}
                </div>
              </section>

              {/* Section QSER */}
              <section className="question-section">
                <h3 className="section-title">
                  <svg
                    className="section-icon section-icon-qser"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>
                  QSER
                </h3>
                <p className="section-question">
                  {currentQuestion.qser.question}
                </p>
                <div className="section-answer">
                  {!showAnswers.qser ? (
                    <button
                      className="reveal-btn"
                      onClick={() => toggleAnswer("qser")}
                    >
                      Afficher
                    </button>
                  ) : (
                    <pre className="answer-text">
                      {formatAnswer(currentQuestion.qser.answer)}
                    </pre>
                  )}
                </div>
              </section>

              {/* Section Secours */}
              <section className="question-section">
                <h3 className="section-title">
                  <svg
                    className="section-icon section-icon-secours"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v12M6 12h12" />
                  </svg>
                  Secours
                </h3>
                <p className="section-question">
                  {currentQuestion.secours.question}
                </p>
                <div className="section-answer">
                  {!showAnswers.secours ? (
                    <button
                      className="reveal-btn"
                      onClick={() => toggleAnswer("secours")}
                    >
                      Afficher
                    </button>
                  ) : (
                    <pre className="answer-text">
                      {formatAnswer(currentQuestion.secours.answer)}
                    </pre>
                  )}
                </div>
              </section>
            </div>
          </div>

          <div className="revision-navigation">
            <button
              onClick={goToPrevious}
              className="nav-btn nav-btn-prev"
              aria-label="Question précédente"
            >
              <svg
                className="nav-arrow-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span className="nav-btn-text">Précédent</span>
            </button>
            <button
              onClick={goToRandom}
              className="nav-btn nav-btn-random"
              aria-label="Question aléatoire"
            >
              <svg
                className="nav-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <circle cx="6.5" cy="6.5" r="1" fill="currentColor" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                <circle cx="6.5" cy="17.5" r="1" fill="currentColor" />
                <circle cx="17.5" cy="17.5" r="1" fill="currentColor" />
              </svg>
              <span className="nav-btn-text">Aléatoire</span>
            </button>
            <button
              onClick={goToNext}
              className="nav-btn nav-btn-next"
              aria-label="Question suivante"
            >
              <svg
                className="nav-arrow-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <span className="nav-btn-text">Suivant</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revision;
