# 🚗 RéviPermis

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white)
[![CI](https://github.com/OliviaG-dev/R-viPermis/actions/workflows/ci.yml/badge.svg)](https://github.com/OliviaG-dev/R-viPermis/actions/workflows/ci.yml)

> Un quiz interactif et amusant pour réviser les questions officielles du permis de conduire français

RéviPermis est une application web moderne développée avec React et TypeScript pour vous aider à réviser efficacement les 100 questions officielles de vérification technique du permis de conduire. L'application couvre les vérifications intérieures, les vérifications extérieures, les questions de sécurité routière (QSER) et les notions de premiers secours.

## ✨ Fonctionnalités

### Mode Révision

- 📚 **100 questions officielles** du permis de conduire
- 🎯 **3 types de questions** par thème :
  - Vérifications techniques (véhicule) avec images illustratives
  - Questions de sécurité routière (QSER)
  - Notions de premiers secours
- 📊 **Thèmes organisés** : Vérifications intérieures et extérieures
- ✅ **Réponses multiples** : Détection automatique des réponses à plusieurs points
- 🔄 **Navigation fluide** : Boutons précédent/suivant/aléatoire
- 👁️ **Réponses masquées** : Bouton "Afficher" pour révéler les réponses et tester vos connaissances
- 🖼️ **Images illustratives** : Support des images pour les vérifications techniques

### Mode Quiz

- ✅ **Quiz interactif avec QCM** : Questions à choix unique (radio buttons)
- 🎯 **Série de 5 questions** : Parcours complet avec progression visuelle
- 🚗 **Vérifications véhicule** : 3 images à choisir + option "Aucune des autres réponses"
- 📝 **Sécurité routière & Secours** : 4 choix textuels avec distracteurs de la même catégorie
- 🔄 **Navigation automatique** : Passage automatique entre les 3 catégories d'une même question
- 📊 **Pastilles de progression** : Code couleur selon le score (rouge/orange/jaune/vert)
- 📈 **Statistiques en temps réel** : Suivi des bonnes réponses par catégorie
- 🎉 **Résultats détaillés** : Affichage du pourcentage et message personnalisé en fin de série
- 🎲 **Questions aléatoires** : Bouton pour relancer une nouvelle série
- 🔒 **Réponses verrouillées** : Une fois validées, les réponses ne peuvent plus être modifiées

### Interface

- 🎨 **Design moderne et élégant** : Interface soignée avec animations fluides
- 📱 **Responsive** : Optimisé pour desktop et mobile avec adaptation automatique
- 🌙 **Mode sombre** : Support automatique du mode sombre (via `prefers-color-scheme`)
- 🎨 **Icônes SVG réutilisables** : Bibliothèque d'icônes centralisée dans `components/Icons/`
- ⚡ **Performance optimisée** : Code splitting et lazy loading des routes pour un chargement rapide
- 🎯 **Header unifié** : Structure cohérente entre Quiz et Révision avec logo et navigation

## 🛠️ Technologies utilisées

### Frontend

- **React 19.2.0** - Bibliothèque JavaScript pour construire des interfaces utilisateur
- **TypeScript 5.9.3** - Typage statique pour JavaScript
- **React Router DOM 7.9.5** - Navigation et routage dans l'application
- **Vite 7.2.2** - Outil de build moderne et rapide

### Outils de développement

- **ESLint** - Linter pour maintenir la qualité du code
- **TypeScript ESLint** - Règles de linting spécifiques à TypeScript
- **tsx** - Exécuteur TypeScript pour les scripts Node.js

### Tests

- **Vitest 4.0.14** - Framework de tests rapide et moderne
- **Testing Library** - Tests orientés comportement pour React
- **JSDOM** - Simulation du DOM pour les tests
- **@vitest/coverage-v8** - Rapport de couverture de code

### Scripts de parsing

- **pdf-parse 1.1.1** - Extraction de texte depuis les fichiers PDF
- **Node.js** - Environnement d'exécution pour les scripts

## 📁 Structure du projet

```
revipermis/
├── public/                 # Fichiers statiques
│   ├── Img/              # Images des questions (Q01-65.png, etc.)
│   └── logo.png          # Logo de l'application
├── scripts/                # Scripts Node.js
│   ├── parse-permis.ts    # Script de parsing du PDF
│   ├── README.md          # Documentation du script
│   └── VERIFICATIONS EXAMEN PERMIS 2019.pdf
├── src/
│   ├── assets/            # Assets de développement
│   ├── components/        # Composants réutilisables
│   │   └── Icons/        # Bibliothèque d'icônes SVG (TrafficLightIcon, SuccessIcon, etc.)
│   ├── pages/             # Pages principales
│   │   ├── Home/         # Page d'accueil
│   │   ├── Quiz/         # Page du quiz interactif avec QCM
│   │   └── Revision/      # Page de révision
│   ├── data/              # Données de l'application
│   │   ├── questions.json # Questions formatées (100 questions)
│   │   └── questions.ts   # Interfaces TypeScript et données
│   ├── hooks/             # Hooks personnalisés React
│   │   ├── useQuiz.ts    # Hook principal pour la logique du quiz
│   │   └── useQuiz.test.tsx
│   ├── test/              # Helpers et fixtures de tests uniquement
│   │   ├── renderWithRouter.tsx
│   │   └── fixtures/
│   ├── types/             # Interfaces et types TypeScript centralisés
│   │   └── index.ts       # Tous les types du projet (Quiz, Questions, etc.)
│   ├── utils/             # Fonctions utilitaires (prod)
│   │   ├── index.ts       # shuffle, calculateScore, getScoreClass
│   │   ├── revision.ts    # Helpers de la page Révision
│   │   ├── index.test.ts
│   │   └── revision.test.ts
│   ├── App.tsx            # Composant racine avec lazy loading des routes
│   ├── App.test.tsx       # Tests de routage
│   └── main.tsx           # Point d'entrée de l'application
├── vitest.setup.ts        # Configuration des tests
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🚀 Installation

### Prérequis

- **Node.js** >= 20.16.0 (ou >= 22.3.0)
- **npm** (inclus avec Node.js)

### Étapes d'installation

1. **Cloner le repository** (ou télécharger le projet)

```bash
git clone <url-du-repo>
cd revipermis
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Lancer l'application en mode développement**

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📝 Scripts disponibles

### Développement

```bash
npm run dev          # Lance le serveur de développement Vite
```

### Production

```bash
npm run build        # Compile l'application pour la production
npm run preview      # Prévisualise la version de production
```

### Qualité de code

```bash
npm run lint         # Vérifie le code avec ESLint
```

### Tests

```bash
npm run test         # Lance tous les tests une fois
npm run test:watch   # Lance les tests en mode watch (relance automatique)
npm run coverage     # Génère un rapport de couverture de code
```

### Parsing des questions

```bash
npm run parse-permis # Parse le PDF et génère questions.json
```

> 📖 Pour plus d'informations sur le script de parsing, consultez [scripts/README.md](scripts/README.md)

## 🎮 Utilisation

### Navigation

1. **Page d'accueil** : Présente le projet avec des boutons pour accéder à la révision ou au quiz

2. **Page Révision** : Mode révision interactif avec :

   - Navigation entre les questions (précédent, suivant, aléatoire)
   - Affichage des 3 sections par question (Véhicule, QSER, Secours)
   - Boutons "Afficher" pour révéler les réponses
   - Images illustratives pour les vérifications techniques
   - Compteur de progression (Question X / 100)

3. **Page Quiz** : Mode quiz interactif avec :
   - **Série de 5 questions** : Chaque série comprend 5 questions complètes (véhicule + sécurité routière + secours)
   - **Choix de catégorie** : Sélectionnez la catégorie à traiter (Véhicule, Sécurité routière, ou Secours)
   - **QCM interactif** :
     - Pour les vérifications véhicule : 3 images + option "Aucune des autres réponses"
     - Pour les autres catégories : 4 choix textuels avec boutons radio (sélection unique)
   - **Validation** : Cliquez sur "Valider" après avoir sélectionné votre réponse
   - **Réponses verrouillées** : Une fois validée, une catégorie ne peut plus être modifiée
   - **Navigation automatique** : Après validation, un bouton apparaît pour passer à la catégorie suivante
   - **Progression visuelle** : Pastilles colorées montrant votre score pour chaque question (0/3 à 3/3)
   - **Résultats** : En fin de série, affichage du pourcentage de réussite avec message personnalisé
   - **Nouvelle série** : Bouton "Questions aléatoires" pour commencer une nouvelle série

### Structure des questions

Chaque question contient :

```typescript
{
  id: number;
  theme: "Vérifications intérieures" | "Vérifications extérieures";
  vehicule: {
    question: string;
    answer: { text: string; image: string };
  };
  qser: {
    question: string;
    answer: string | string[];
    multiple: boolean;
  };
  secours: {
    question: string;
    answer: string | string[];
    multiple: boolean;
  };
}
```

## 📊 Données

Le projet contient **100 questions officielles** extraites du document "VERIFICATIONS EXAMEN PERMIS 2019.pdf". Les questions sont organisées en :

- **Vérifications intérieures** : Questions sur les équipements à l'intérieur du véhicule
- **Vérifications extérieures** : Questions sur les équipements à l'extérieur du véhicule
- **Questions QSER** : Questions de sécurité routière (avec support des réponses multiples)
- **Questions de premiers secours** : Notions élémentaires de secourisme (avec support des réponses multiples)

## 🎨 Styles

- Chaque page et composant a son propre fichier CSS
- Support du mode sombre automatique (via `prefers-color-scheme`)
- Design responsive et moderne avec optimisations mobile
- Interface adaptative selon la taille d'écran
- Animations et transitions fluides
- Background unifié : Dégradé violet identique sur toutes les pages (Home, Quiz, Révision)

## 🔧 Configuration

### TypeScript

Le projet utilise TypeScript avec une configuration stricte :

- `tsconfig.json` : Configuration principale
- `tsconfig.app.json` : Configuration pour le code de l'application
- `tsconfig.node.json` : Configuration pour les scripts Node.js

### Vite

Configuration Vite pour le développement et la production :

- Hot Module Replacement (HMR) activé
- Build optimisé pour la production
- Support des imports de fichiers JSON
- Assets statiques dans `public/` servis à la racine

### Images

Les images des questions sont stockées dans `public/Img/` et accessibles via les chemins `/Img/...` :

- Compatible avec tous les déploiements (Vercel, Netlify, etc.)
- Optimisées pour le web
- Support des formats PNG

## 🏗️ Architecture du code

### Organisation modulaire

Le projet suit une architecture modulaire et maintenable :

- **Types centralisés** (`src/types/index.ts`) : Tous les types TypeScript sont centralisés pour éviter la duplication
- **Hooks personnalisés** (`src/hooks/useQuiz.ts`) : Logique métier du quiz extraite dans un hook réutilisable
- **Composants réutilisables** (`src/components/Icons/`) : Bibliothèque d'icônes SVG centralisée
- **Utilitaires unifiés** (`src/utils/index.ts`) : Fonctions utilitaires partagées (shuffle, calculateScore, etc.)
- **Code splitting** : Lazy loading des routes pour optimiser le bundle initial
- **Séparation des responsabilités** : Logique métier séparée de la présentation
- **Tests complets** : Suite de tests avec 91% de couverture pour garantir la qualité du code

### Structure des composants

```
src/
├── components/Icons/      # Icônes SVG réutilisables
│   ├── TrafficLightIcon.tsx
│   ├── SuccessIcon.tsx
│   ├── ErrorIcon.tsx
│   ├── ArrowRightIcon.tsx
│   ├── ArrowLeftIcon.tsx
│   ├── RandomIcon.tsx
│   ├── BookIcon.tsx
│   ├── TargetIcon.tsx
│   ├── DocumentIcon.tsx
│   └── index.ts          # Export centralisé
├── hooks/
│   └── useQuiz.ts        # Hook principal avec toute la logique du quiz
├── types/
│   └── index.ts          # Types centralisés (QuizCategory, QuizQuestion, etc.)
└── utils/
    └── index.ts          # Fonctions utilitaires (shuffle, calculateScore)
```

## 🧪 Tests

Le projet inclut une suite de tests complète pour garantir la qualité et la fiabilité du code.

### Couverture de code

- **Statements (instructions)** : 91.09% ✅
- **Branches (conditions)** : 75% ✅
- **Functions (fonctions)** : 96.22% ✅
- **Lines (lignes)** : 91.33% ✅

### Tests disponibles

La suite couvre les utilitaires, le hook `useQuiz` et les pages React (Home, Quiz, Révision, routage App).

### Lancer les tests

```bash
# Lancer tous les tests
npm run test

# Mode watch (relance automatique pendant le développement)
npm run test:watch

# Voir la couverture de code
npm run coverage
```


## CI/CD

À chaque push sur `master`/`main` et sur chaque pull request, GitHub Actions exécute le workflow `.github/workflows/ci.yml` :

1. `npm ci`
2. `npm run lint`
3. `npm run test`
4. `npm run build`

## 📚 Documentation

- **README.md** (ce fichier) : Documentation générale du projet
- **scripts/README.md** : Documentation du script de parsing
- **src/types/index.ts** : Types TypeScript centralisés pour tout le projet
- **src/hooks/useQuiz.ts** : Documentation de la logique du quiz

## 🚀 Déploiement

### Vercel (Recommandé)

Le projet est prêt pour le déploiement sur Vercel :

1. **Connecter votre repository** à Vercel
2. **Configuration automatique** : Vercel détecte automatiquement Vite
3. **Build** : `npm run build` est exécuté automatiquement
4. **Images** : Les images dans `public/Img/` sont servies correctement

Les images sont optimisées et accessibles via les chemins `/Img/...` en production.

### Autres plateformes

Le projet peut également être déployé sur :

- **Netlify** : Configuration similaire à Vercel
- **GitHub Pages** : Nécessite une configuration spécifique pour le routing
- **Autres** : Toute plateforme supportant les applications React/Vite

## 🚧 Fonctionnalités à venir

- [ ] Timer pour les questions
- [ ] Mode révision par thème (filtrer par vérifications intérieures/extérieures)
- [ ] Mode examen (questions aléatoires avec score final et temps limité)
- [ ] Sauvegarde locale des résultats et historique
- [ ] Mode sombre/clair manuel (toggle)
- [ ] Recherche de questions par mot-clé
- [ ] Export des statistiques
- [ ] Partage des résultats

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

- Ouvrir une issue pour signaler un bug
- Proposer des améliorations
- Soumettre une pull request

## 📄 Licence

Ce projet est un projet personnel éducatif.

## 🙏 Remerciements

- Questions extraites du document officiel "VERIFICATIONS EXAMEN PERMIS 2019.pdf"
- Délégation à la Sécurité Routière - Sous-direction de l'Éducation Routière (DSR/BRPCE)

## 📞 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur le repository.

---

**Bon courage pour votre permis ! 🚗💨**
