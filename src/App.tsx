import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';

// Lazy loading des routes pour réduire le bundle initial
const Quiz = lazy(() => import('./pages/Quiz/Quiz'));
const Revision = lazy(() => import('./pages/Revision/Revision'));

// Composant de chargement pour le Suspense
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh',
    fontSize: '1.2rem',
    color: '#667eea'
  }}>
    Chargement...
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/revision" element={<Revision />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
