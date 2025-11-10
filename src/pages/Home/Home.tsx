import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => (
  <div className="home">
    <h1>Bienvenue sur RéviPermis 🚗</h1>
    <p>Révise les 100 questions officielles du permis de conduire.</p>
    <Link to="/quiz" className="start-btn">
      Commencer
    </Link>
  </div>
);

export default Home;

