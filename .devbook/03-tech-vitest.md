## Vitest

### Pourquoi ce choix

Le projet est déjà sur Vite. Vitest reprend la même config, le même transform, et évite une stack Jest parallèle (babel, jsdom à part, aliases dupliqués).

Objectif : tester la logique métier (`useQuiz`, `shuffle`, `calculateScore`) sans monter toute l’UI.

### Première mise en place

Packages : `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@vitest/coverage-v8`.

Config dans `vite.config.ts` (pas de `vitest.config.ts` séparé) :

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
    },
  },
});
```

`vitest.setup.ts` charge `@testing-library/jest-dom/vitest` pour les matchers DOM.

Scripts npm : `test` (`vitest run`), `test:watch`, `coverage`.

`tsconfig.node.json` inclut `vite.config.ts`, `vitest.setup.ts` et les fichiers `*.test.ts(x)`, avec `"types": ["node", "vitest/globals"]`.

### Usage dans ce projet

Deux fichiers, 18 tests :

- `src/utils/index.test.ts` — `shuffle` (copie, mêmes éléments) et `calculateScore` (arrondi).
- `src/hooks/useQuiz.test.tsx` — `renderHook` + `act` : init, validation, navigation catégories, série de 5, scores, garde-fous (valider sans choix, double validation).

Le JSON réel n’est pas chargé en test. `vi.mock("../data/questions.json")` fournit 2 questions factices. `shuffle` est mocké en identité pour des QCM déterministes :

```ts
vi.mock("../utils", async () => {
  const actual = await vi.importActual<typeof import("../utils")>("../utils");
  return {
    ...actual,
    shuffle: <T>(array: T[]) => [...array],
  };
});
```

La page `Quiz.tsx` reste présentationnelle : elle consomme le hook, elle n’est pas testée en composant.

### Pièges rencontrés

- **`defineConfig` depuis `vite`** : TypeScript refuse la clé `test` (`'test' does not exist in type 'UserConfigExport'`). `npm test` passe, `npm run build` (`tsc -b && vite build`) échoue. Correctif : importer `defineConfig` depuis `vitest/config`.
- **Hook + JSON + alea** : sans mock du JSON et de `shuffle`, les tests du QCM sont flaky (questions et distracteurs aléatoires).
- **`renderHook` et état** : les validations et navigations passent par `act(...)`. Oublier `act` fait échouer les assertions sur `isValidated` / `categoryStatuses`.
- **Couverture vs intention** : 91 % statements sur le hook, mais 75 % branches. Les chemins « déjà validé / QCM images / fin de série » restent les plus fragiles.

### Ce que j'ai retenu

- Tester le hook, pas la page, quand toute la règle métier est dans `useQuiz`.
- Mocker les frontières (données JSON, `shuffle`) pour des tests reproductibles.
- Aligner Vitest et le build TypeScript : la config test doit être typée, pas seulement « comprise » par Vitest.
- Ne pas lancer le coverage HTML (`coverage/`) dans git : c’est un artefact local.

### Ressources

- [Vitest — config](https://vitest.dev/config/)
- [Vitest + Vite `defineConfig`](https://vitest.dev/config/#using-vite-config)
- [Testing Library — `renderHook`](https://testing-library.com/docs/react-testing-library/api/#renderhook)
