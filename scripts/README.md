# Script de parsing des questions du permis de conduire

Ce script permet d'extraire et de formater les questions du permis de conduire à partir d'un fichier PDF.

## 📋 Description

Le script `parse-permis.ts` analyse le fichier PDF `VERIFICATIONS EXAMEN PERMIS 2019.pdf` et extrait les questions de vérification technique (véhicule), les questions de sécurité routière (QSER) et les questions de premiers secours. Il génère un fichier JSON structuré avec toutes les données.

## 🚀 Utilisation

### Prérequis

- Node.js installé
- Les dépendances npm installées (`npm install`)

### Exécution

```bash
npm run parse-permis
```

Le script va :
1. Chercher le fichier PDF dans le dossier `scripts/`
2. Parser le contenu du PDF
3. Extraire les questions et réponses
4. Générer le fichier `src/data/questions.json`

## 📁 Structure des données générées

### Format d'une question

```typescript
{
  id: number;
  theme: "Vérifications intérieures" | "Vérifications extérieures";
  vehicule: {
    question: string;
    answer: {
      text: string;
      image: string;
    };
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

### Exemple de question

```json
{
  "id": 1,
  "theme": "Vérifications intérieures",
  "vehicule": {
    "question": "Montrez la commande De réglage de hauteur des feux.",
    "answer": {
      "text": "Dispositif situé en général à gauche du volant.",
      "image": ""
    }
  },
  "qser": {
    "question": "Pourquoi doit-on régler la hauteur des feux ?",
    "answer": "Pour ne pas éblouir les autres usagers.",
    "multiple": false
  },
  "secours": {
    "question": "Comment et pourquoi protéger une zone de danger en cas d'accident de la route ?",
    "answer": "En délimitant clairement et largement la zone de danger de façon visible pour protéger les victimes et éviter un sur-accident.",
    "multiple": false
  }
}
```

### Réponses multiples

Pour les questions QSER et secours, si la réponse contient des listes à puces (commençant par "-"), le script :
- Détecte automatiquement les réponses multiples
- Sépare les réponses en tableau
- Définit `multiple: true`

**Exemple avec réponses multiples :**

```json
{
  "qser": {
    "question": "Pourquoi est-il important de bien régler son volant ?",
    "answer": [
      "Le confort de conduite.",
      "L'accessibilité aux commandes.",
      "La visibilité du tableau de bord.",
      "L'efficacité des airbags."
    ],
    "multiple": true
  }
}
```

## 🔍 Fonctionnement du script

### 1. Lecture du PDF

Le script utilise la bibliothèque `pdf-parse` pour extraire le texte brut du PDF.

### 2. Parsing du texte

Le script analyse le texte ligne par ligne et cherche :
- Les marqueurs `VE` (Vérifications Extérieures) ou `VI` (Vérifications Intérieures)
- Les sections `QSER Réponse` pour les questions de sécurité routière
- Les sections `1ers secours Réponse` pour les questions de premiers secours

### 3. Extraction des données

Pour chaque question trouvée, le script :
- Extrait la question véhicule et sa réponse
- Extrait la question QSER et sa réponse (avec détection des réponses multiples)
- Extrait la question de premiers secours et sa réponse (avec détection des réponses multiples)

### 4. Nettoyage du texte

Le script nettoie automatiquement :
- Les numéros de page
- Les en-têtes (DSR/BRPCE, dates)
- Les espaces multiples
- Les artefacts de pagination

### 5. Génération du JSON

Le fichier JSON est généré dans `src/data/questions.json` avec un formatage lisible (indentation de 2 espaces).

## 🛠️ Fonctions principales

### `cleanAndJoinLines(lines: string[])`

Nettoie et joint les lignes de texte en supprimant :
- Les lignes vides
- Les numéros de page
- Les en-têtes
- Les dates
- Les espaces multiples

### `parseMultipleAnswers(text: string)`

Détecte et sépare les réponses multiples :
- Détecte les listes à puces (commençant par "-" ou "–")
- Sépare les réponses en tableau
- Filtre les instructions (comme "Citez deux exemples.")
- Retourne `{ answers: string | string[], multiple: boolean }`

### `collectUntilMarker(lines, startIndex, markers)`

Collecte les lignes jusqu'à atteindre un marqueur spécifique (comme "QSER Réponse", "1ers secours Réponse", etc.).

## 📝 Fichiers générés

- `src/data/questions.json` : Fichier JSON contenant toutes les questions formatées
- `scripts/pdf-text-debug.txt` : Texte brut extrait du PDF (pour debug)

## ⚙️ Configuration

### Emplacements du PDF

Le script cherche le PDF dans les emplacements suivants (dans l'ordre) :
1. `scripts/VERIFICATIONS EXAMEN PERMIS 2019.pdf`
2. `scripts/VERIFICATIONS_EXAMEN_PERMIS_2019.pdf`
3. Racine du projet
4. `src/utils/VERIFICATIONS EXAMEN PERMIS 2019.pdf`

### Fichier de sortie

Le fichier JSON est toujours généré dans : `src/data/questions.json`

## 🐛 Dépannage

### Le PDF n'est pas trouvé

Vérifiez que le fichier PDF est bien présent dans le dossier `scripts/` avec le nom exact :
- `VERIFICATIONS EXAMEN PERMIS 2019.pdf`

### Les questions ne sont pas bien extraites

1. Vérifiez le fichier `scripts/pdf-text-debug.txt` pour voir le texte brut extrait
2. Le script peut nécessiter des ajustements selon la structure exacte du PDF
3. Certaines questions peuvent nécessiter une vérification manuelle

### Erreurs de parsing

Si le script génère des erreurs :
1. Vérifiez que `pdf-parse` est bien installé : `npm install pdf-parse`
2. Vérifiez que `tsx` est bien installé : `npm install --save-dev tsx`
3. Vérifiez les logs dans la console pour plus de détails

## 📦 Dépendances

- `pdf-parse@1.1.1` : Bibliothèque pour parser les PDF
- `tsx` : Exécuteur TypeScript (devDependency)
- `@types/pdf-parse` : Types TypeScript pour pdf-parse (devDependency)

## 🔄 Régénérer les données

Pour régénérer le fichier `questions.json` après modification du PDF :

```bash
npm run parse-permis
```

Le fichier existant sera écrasé avec les nouvelles données.

## 📊 Statistiques

Le script extrait environ **100 questions** du PDF, chaque question contenant :
- 1 question véhicule
- 1 question QSER
- 1 question de premiers secours

## 🎯 Structure du PDF

Le PDF suit généralement cette structure :

```
VE ou VI
[Question véhicule]
[Réponse véhicule]

QSER Réponse
[Question QSER]
[Réponse QSER] (peut contenir des listes à puces)

1ers secours Réponse
[Numéro de question]
[Question premiers secours]
[Réponse premiers secours] (peut contenir des listes à puces)
```

## 💡 Notes

- Le script détecte automatiquement les réponses multiples en cherchant les tirets "-"
- Les réponses multiples sont stockées dans un tableau
- Le champ `multiple` indique si la réponse est une liste ou une réponse unique
- Certaines réponses peuvent contenir des artefacts (numéros de page) qui nécessitent un nettoyage manuel
- Les questions avec "Réponse à compléter" doivent être complétées manuellement

## 🔗 Fichiers liés

- `src/data/questions.ts` : Interfaces TypeScript pour les questions
- `src/data/questions.json` : Données générées par le script
- `scripts/parse-permis.ts` : Script principal
- `scripts/pdf-text-debug.txt` : Texte brut du PDF (debug)

