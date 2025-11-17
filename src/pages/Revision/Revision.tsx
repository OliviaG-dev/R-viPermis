import { useState } from "react";
import { Link } from "react-router-dom";
import { questions } from "../../data/questions";
import {
  ArrowLeftIcon,
  BookIcon,
  RandomIcon,
  ArrowRightIcon,
} from "../../components/Icons";
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
              <ArrowLeftIcon className="back-arrow" />
            </Link>
            <h1>
              <img src="/logo.png" alt="RéviPermis" className="revision-logo" />
              <span className="revision-title-text">Révision du Permis</span>
              <BookIcon className="header-icon" />
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
              <ArrowLeftIcon className="nav-arrow-icon" />
              <span className="nav-btn-text">Précédent</span>
            </button>
            <button
              onClick={goToRandom}
              className="nav-btn nav-btn-random"
              aria-label="Question aléatoire"
            >
              <RandomIcon className="nav-icon" />
              <span className="nav-btn-text">Aléatoire</span>
            </button>
            <button
              onClick={goToNext}
              className="nav-btn nav-btn-next"
              aria-label="Question suivante"
            >
              <ArrowRightIcon className="nav-arrow-icon" />
              <span className="nav-btn-text">Suivant</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revision;
