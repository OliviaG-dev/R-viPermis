import { Link } from "react-router-dom";
import { DocumentIcon, TargetIcon, BookIcon } from "../../components/Icons";
import "./Home.css";

const Home = () => (
  <div className="home">
    <div className="home-content">
      <header className="home-header">
        <div className="home-title-container">
          <img src="/logo.png" alt="RéviPermis" className="home-logo" />
          <h1>RéviPermis</h1>
        </div>
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
              <DocumentIcon />
            </div>
            <h3>Questions officielles</h3>
            <p>Banque officielle de l'examen</p>
          </div>

          <div className="feature feature-2">
            <div className="feature-icon">
              <TargetIcon />
            </div>
            <h3>3 types de questions</h3>
            <p>Véhicule, QSER et premiers secours</p>
          </div>

          <div className="feature feature-3">
            <div className="feature-icon">
              <BookIcon />
            </div>
            <h3>Organisé par thèmes</h3>
            <p>Vérifications intérieures et extérieures</p>
          </div>
        </div>

        <div className="cta-section">
          <Link to="/revision" className="revision-btn">
            Réviser
          </Link>
          <Link to="/quiz" className="start-btn">
            Quiz
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default Home;
