## Bilan — à réutiliser ailleurs

### Patterns à garder

- **Données hors du code** : gros jeu statique → `src/data/*.json` + types à part. Le parser PDF reste un script `scripts/`, jamais dans le bundle.
- **Hook = cerveau, page = vue** : `useQuiz` porte série, scores, verrouillage, QCM. `Quiz.tsx` n’appelle pas l’API et ne calcule pas le score.
- **Vitest collé à Vite** : un seul `vite.config.ts`, `defineConfig` depuis `vitest/config`, `jsdom` + Testing Library pour les hooks.

### À éviter la prochaine fois

- Importer `defineConfig` depuis `vite` dès qu’on ajoute un bloc `test` : le type casse `tsc -b`.
- Faire confiance au JSON généré par un PDF sans dump debug ni relecture des champs « à compléter ».
- Tester l’UI du quiz avant d’avoir figé l’aléa (`shuffle`, tirage de question).

### Suite possible sur ce repo

- Pipeline CI (install, lint, test, build) : aujourd’hui tout se lance à la main.
- Husky + lint-staged une fois la CI en place.
- Monter la couverture branches du hook (navigation déjà validée, QCM images véhicule).
