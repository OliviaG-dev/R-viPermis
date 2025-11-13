# 🚗 RéviPermis

> Un quiz interactif et amusant pour réviser les questions officielles du permis de conduire français

RéviPermis est une application web moderne développée avec React et TypeScript pour vous aider à réviser efficacement les 100 questions officielles de vérification technique du permis de conduire. L'application couvre les vérifications intérieures, les vérifications extérieures, les questions de sécurité routière (QSER) et les notions de premiers secours.

## ✨ Fonctionnalités

- 📚 **100 questions officielles** du permis de conduire
- 🎯 **3 types de questions** par thème :
  - Vérifications techniques (véhicule) avec images illustratives
  - Questions de sécurité routière (QSER)
  - Notions de premiers secours
- 📊 **Thèmes organisés** : Vérifications intérieures et extérieures
- ✅ **Réponses multiples** : Détection automatique des réponses à plusieurs points
- 🔄 **Mode révision** : Navigation entre les questions avec boutons précédent/suivant/aléatoire
- 👁️ **Réponses masquées** : Bouton "Afficher" pour révéler les réponses et tester vos connaissances
- 🖼️ **Images illustratives** : Support des images pour les vérifications techniques
- 🎨 **Interface moderne** et intuitive
- 📱 **Responsive** : Optimisé pour desktop et mobile avec adaptation automatique
- 🌙 **Mode sombre** : Support automatique du mode sombre (via `prefers-color-scheme`)

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
│   ├── pages/             # Pages principales
│   │   ├── Home/         # Page d'accueil
│   │   ├── Quiz/         # Page du quiz (à implémenter)
│   │   └── Revision/     # Page de révision (implémentée)
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

1. **Page d'accueil** : Présente le projet avec des boutons pour accéder à la révision ou au quiz
2. **Page Révision** : Mode révision interactif avec :
   - Navigation entre les questions (précédent, suivant, aléatoire)
   - Affichage des 3 sections par question (Véhicule, QSER, Secours)
   - Boutons "Afficher" pour révéler les réponses
   - Images illustratives pour les vérifications techniques
   - Compteur de progression (Question X / 100)
3. **Page Quiz** : Mode quiz interactif (à implémenter)

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

## 📚 Documentation

- **README.md** (ce fichier) : Documentation générale du projet
- **scripts/README.md** : Documentation du script de parsing
- **src/data/questions.ts** : Interfaces TypeScript pour les questions

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

- [ ] Implémentation complète de la page Quiz avec système de score
- [ ] Timer pour les questions
- [ ] Mode révision par thème (filtrer par vérifications intérieures/extérieures)
- [ ] Mode examen (questions aléatoires avec score final)
- [ ] Statistiques de performance et progression
- [ ] Sauvegarde locale des résultats et historique
- [ ] Mode sombre/clair manuel (toggle)
- [ ] Recherche de questions par mot-clé

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
