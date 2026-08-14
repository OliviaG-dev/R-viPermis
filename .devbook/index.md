---
id: revipermis
name: RéviPermis
description: Quiz React pour réviser les 100 questions officielles du permis — extraction PDF, données JSON, Vitest.
technologies: [React, TypeScript, Vite, React Router, Vitest, pdf-parse]
newTechnologies: [pdf-parse, Vitest]
githubUrl: https://github.com/OliviaG-dev/R-viPermis
---

## Contexte

RéviPermis est une app de révision du permis de conduire français : 100 questions officielles (vérifications véhicule, QSER, premiers secours), en mode révision et en quiz QCM.

La stack UI (React, TypeScript, Vite, React Router) était déjà connue. Les deux apprentissages principaux étaient **pdf-parse** (transformer un PDF officiel en `questions.json`) et **Vitest** (tester le hook `useQuiz` et les utilitaires, avec une config Vite qui doit aussi passer `tsc -b`).

## Nouvelles technologies — vue d'ensemble

| Techno | Déjà connue ? | Rôle dans le projet |
|-----|---|---|
| React 19 | Oui | UI, lazy loading des pages Quiz et Révision |
| TypeScript | Oui | Typage des questions, du quiz et des scripts |
| Vite 7 | Oui | Dev server et build production |
| React Router 7 | Oui | Routes `/`, `/quiz`, `/revision` |
| pdf-parse | Non | Extraction du texte du PDF officiel |
| Vitest | Non | Tests unitaires du hook et des utils |

## Difficultés liées aux nouvelles technos

- **pdf-parse 1.x en ESM** : un `import` classique ne marche pas. Le script utilise `createRequire(import.meta.url)` pour charger le module CommonJS.
- **Texte PDF sale** : numéros de page, en-têtes `DSR/BRPCE`, dates. Il a fallu un nettoyage ligne par ligne (`cleanAndJoinLines`) et un fichier debug `scripts/pdf-text-debug.txt`.
- **Vitest + `tsc -b`** : `defineConfig` importé depuis `vite` ne connaît pas la clé `test`. Le build TypeScript échoue tant qu’on n’importe pas depuis `vitest/config`.

## Leçons apprises

- Garder les 100 questions dans `src/data/questions.json`, pas dans du TypeScript inline.
- Extraire la logique quiz dans `useQuiz` et tester le hook, pas la page.
- Pour Vitest dans un projet Vite, typer la config avec `vitest/config` dès le départ, sinon `npm run build` casse alors que `npm test` passe.

## Prochaines explorations

- CI GitHub Actions (lint + test + build) absente du repo pour l’instant.
- Couverture des branches du hook encore à 75 % : cas limites de navigation et de QCM images.
- Parser PDF : certaines réponses restent à « Réponse à compléter » et demandent une passe manuelle.
