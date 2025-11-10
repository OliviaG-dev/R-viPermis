# 🚗 RéviPermis

> Un quiz interactif et amusant pour réviser les questions officielles du permis de conduire français

RéviPermis est une application web moderne développée avec React et TypeScript pour vous aider à réviser efficacement les 100 questions officielles de vérification technique du permis de conduire. L'application couvre les vérifications intérieures, les vérifications extérieures, les questions de sécurité routière (QSER) et les notions de premiers secours.

## ✨ Fonctionnalités

- 📚 **100 questions officielles** du permis de conduire
- 🎯 **3 types de questions** par thème :
  - Vérifications techniques (véhicule)
  - Questions de sécurité routière (QSER)
  - Notions de premiers secours
- 📊 **Thèmes organisés** : Vérifications intérieures et extérieures
- ✅ **Réponses multiples** : Détection automatique des réponses à plusieurs points
- 🎨 **Interface moderne** et intuitive
- 📱 **Responsive** : Fonctionne sur desktop et mobile

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

### Scripts de parsing

- **pdf-parse 1.1.1** - Extraction de texte depuis les fichiers PDF
- **Node.js** - Environnement d'exécution pour les scripts

## 📁 Structure du projet

```
revipermis/
├── public/                 # Fichiers statiques (favicon, logo, etc.)
├── scripts/                # Scripts Node.js
│   ├── parse-permis.ts    # Script de parsing du PDF
│   ├── README.md          # Documentation du script
│   └── VERIFICATIONS EXAMEN PERMIS 2019.pdf
├── src/
│   ├── assets/            # Images, icônes, sons
│   ├── components/        # Composants réutilisables
│   ├── pages/             # Pages principales
│   │   ├── Home/         # Page d'accueil
│   │   └── Quiz/         # Page du quiz
│   ├── data/              # Données de l'application
│   │   ├── questions.json # Questions formatées (100 questions)
│   │   └── questions.ts   # Interfaces TypeScript et données
│   ├── hooks/             # Hooks personnalisés React
│   ├── types/             # Interfaces et types TypeScript
│   ├── utils/             # Fonctions utilitaires
│   ├── App.tsx            # Composant racine de l'application
│   └── main.tsx           # Point d'entrée de l'application
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

### Parsing des questions

```bash
npm run parse-permis # Parse le PDF et génère questions.json
```

> 📖 Pour plus d'informations sur le script de parsing, consultez [scripts/README.md](scripts/README.md)

## 🎮 Utilisation

### Navigation

1. **Page d'accueil** : Présente le projet et un bouton pour commencer le quiz
2. **Page Quiz** : Affiche les questions et permet de répondre (à implémenter)

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
- Support du mode sombre (via `prefers-color-scheme`)
- Design responsive et moderne

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

## 📚 Documentation

- **README.md** (ce fichier) : Documentation générale du projet
- **scripts/README.md** : Documentation du script de parsing
- **src/data/questions.ts** : Interfaces TypeScript pour les questions

## 🚧 Fonctionnalités à venir

- [ ] Implémentation complète de la page Quiz
- [ ] Système de score et de progression
- [ ] Timer pour les questions
- [ ] Mode révision (par thème)
- [ ] Mode examen (questions aléatoires)
- [ ] Statistiques de performance
- [ ] Sauvegarde locale des résultats
- [ ] Mode sombre/clair manuel
- [ ] Support des images pour les réponses

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
