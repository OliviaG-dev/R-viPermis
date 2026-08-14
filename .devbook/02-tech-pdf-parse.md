## pdf-parse

### Pourquoi ce choix

Les 100 questions viennent du PDF officiel `VERIFICATIONS EXAMEN PERMIS 2019.pdf`. Recopier à la main n’était pas tenable. `pdf-parse` extrait le texte brut côté Node, sans OCR (le PDF est textuel).

Alternative envisagée : parser le PDF dans le navigateur. Rejeté : le parsing est un script one-shot, pas une feature runtime. L’app consomme uniquement le JSON généré.

### Première mise en place

Dépendances : `pdf-parse` + `@types/pdf-parse` + `tsx` pour exécuter le script TypeScript.

Commande : `npm run parse-permis` (`tsx scripts/parse-permis.ts`).

Le script cherche le PDF dans plusieurs chemins (`scripts/` en priorité), écrit `src/data/questions.json`, et peut produire `scripts/pdf-text-debug.txt` pour inspecter le texte brut.

Doc officielle : [pdf-parse sur npm](https://www.npmjs.com/package/pdf-parse).

### Usage dans ce projet

Fichier principal : `scripts/parse-permis.ts`.

Flux réel :

1. `fs.readFileSync` lit le PDF.
2. `pdf-parse` renvoie `data.text`.
3. Le texte est découpé en lignes, puis scanné avec les marqueurs `VE` / `VI`, `QSER Réponse`, `1ers secours Réponse`.
4. `parseMultipleAnswers` détecte les listes à puces (`-` / `–`) et pose `multiple: true`.
5. Sortie : `src/data/questions.json`, importé par `src/data/questions.ts` et `src/hooks/useQuiz.ts`.

Import CJS forcé dans un projet `"type": "module"` :

```ts
const { createRequire } = await import("module");
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
const data = await pdfParse(file);
```

### Pièges rencontrés

- **ESM vs CommonJS** : `pdf-parse` 1.x n’est pas un export ESM propre. Sans `createRequire`, le script plante à l’import.
- **Layout PDF ≠ structure métier** : une question = 3 blocs (véhicule, QSER, secours). Le PDF les enchaîne avec des en-têtes bruités. Les filtres regex (`DSR/BRPCE`, `janvier 20xx`, numéros de page `3 er`) sont indispensables.
- **Réponses multiples** : un tiret dans une phrase n’est pas toujours une liste. `parseMultipleAnswers` est heuristique ; il faut relire le JSON après génération.
- **Trous d’extraction** : si un bloc manque, le script écrit « Réponse à compléter » plutôt que d’échouer. Ça évite un crash, mais ça impose une relecture manuelle.
- **`__dirname` en ESM** : `fileURLToPath(import.meta.url)` remplace `__dirname` CommonJS pour localiser le PDF.

### Ce que j'ai retenu

- Un parser PDF est un **outil de build de données**, pas une dépendance frontend.
- Toujours garder un dump texte (`pdf-text-debug.txt`) pour déboguer le regex sans relire le PDF.
- Séparer données (`src/data/*.json`) et types (`src/types/`, `src/data/questions.ts`).
- Prévoir une passe manuelle : un PDF officiel n’est jamais 100 % parseable de façon fiable.

### Ressources

- [pdf-parse (npm)](https://www.npmjs.com/package/pdf-parse)
- [scripts/README.md](../scripts/README.md) — usage du script et format JSON
- Node ESM : [`import.meta.url` + `createRequire`](https://nodejs.org/api/module.html#modulecreaterequirefilename)
