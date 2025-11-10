import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => (
  <div className="home">
    <div className="home-content">
      <header className="home-header">
        <h1>RéviPermis</h1>
        <p className="home-subtitle">
          Préparez-vous efficacement pour l'examen du permis de conduire
        </p>
      </header>

      <div className="home-body">
        <p className="home-intro">
          Maîtrisez les <strong>100 questions officielles</strong> de l'examen
          du permis de conduire.
        </p>

        <div className="features">
          <div className="feature feature-1">
            <div className="feature-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8" cy="9" r="1.5" fill="#ef4444" />
                <circle cx="12" cy="9" r="1.5" fill="#f59e0b" />
                <circle cx="16" cy="9" r="1.5" fill="#10b981" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="17" x2="16" y2="17" />
              </svg>
            </div>
            <h3>Questions officielles</h3>
            <p>Banque officielle de l'examen</p>
          </div>

          <div className="feature feature-2">
            <div className="feature-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <h3>3 types de questions</h3>
            <p>Véhicule, QSER et premiers secours</p>
          </div>

          <div className="feature feature-3">
            <div className="feature-icon">
              <svg
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
            </div>
            <h3>Organisé par thèmes</h3>
            <p>Vérifications intérieures et extérieures</p>
          </div>
        </div>

        <div className="cta-section">
          <Link to="/quiz" className="start-btn">
            Commencer le quiz
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default Home;
