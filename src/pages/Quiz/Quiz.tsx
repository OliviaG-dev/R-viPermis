import { Link } from "react-router-dom";
import "./Quiz.css";

const Quiz = () => {
  return (
    <div className="quiz">
      <h1>Quiz du Permis 🚦</h1>
      <p>Page du quiz - À implémenter</p>
      <Link to="/" className="quiz-home-btn">
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default Quiz;

