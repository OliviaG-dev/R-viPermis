import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

interface VehiculeAnswer {
  text: string;
  image: string;
}

interface VehiculeQuestion {
  question: string;
  answer: VehiculeAnswer;
}

interface QserQuestion {
  question: string;
  answer: string | string[];
  multiple: boolean;
}

interface SecoursQuestion {
  question: string;
  answer: string | string[];
  multiple: boolean;
}

interface PermisQuestion {
  id: number;
  theme: string;
  vehicule: VehiculeQuestion;
  qser: QserQuestion;
  secours: SecoursQuestion;
  questionNumbers?: string; // Nouveau champ pour les numéros d'origine
}

// Fonction pour normaliser une chaîne (enlever espaces, caractères spéciaux, etc.)
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.,;:!?]/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Enlever les accents
}

// Fonction pour comparer deux questions et déterminer si elles sont identiques
function areQuestionsIdentical(q1: PermisQuestion, q2: PermisQuestion): boolean {
  // Comparer les questions véhicule
  const vehicule1 = normalizeString(q1.vehicule.question);
  const vehicule2 = normalizeString(q2.vehicule.question);
  if (vehicule1 !== vehicule2) return false;

  // Comparer les questions QSER
  const qser1 = normalizeString(q1.qser.question);
  const qser2 = normalizeString(q2.qser.question);
  if (qser1 !== qser2) return false;

  // Comparer les questions secours
  const secours1 = normalizeString(q1.secours.question);
  const secours2 = normalizeString(q2.secours.question);
  if (secours1 !== secours2) return false;

  return true;
}

// Fonction pour formater les numéros de questions
function formatQuestionNumbers(numbers: number[]): string {
  if (numbers.length === 1) {
    return numbers[0].toString();
  }
  numbers.sort((a, b) => a - b);
  return numbers.join(" - ");
}

async function mergeDuplicates() {
  try {
    const inputPath = path.join(projectRoot, "src", "data", "questions.json");
    const outputPath = path.join(projectRoot, "src", "data", "questions.json");

    console.log("📖 Lecture du fichier questions.json...");
    const fileContent = fs.readFileSync(inputPath, "utf-8");
    const questions: PermisQuestion[] = JSON.parse(fileContent);

    console.log(`📊 ${questions.length} questions trouvées`);

    // Trouver les doublons
    const merged: PermisQuestion[] = [];
    const processed = new Set<number>();
    const duplicates: Map<number, number[]> = new Map();

    for (let i = 0; i < questions.length; i++) {
      if (processed.has(i)) continue;

      const currentQuestion = questions[i];
      const duplicateIds = [currentQuestion.id];

      // Chercher les doublons
      for (let j = i + 1; j < questions.length; j++) {
        if (processed.has(j)) continue;

        if (areQuestionsIdentical(currentQuestion, questions[j])) {
          duplicateIds.push(questions[j].id);
          processed.add(j);
        }
      }

      // Créer la question fusionnée
      const mergedQuestion: PermisQuestion = {
        ...currentQuestion,
        id: merged.length + 1, // Nouvel ID séquentiel
        questionNumbers:
          duplicateIds.length > 1 ? formatQuestionNumbers(duplicateIds) : undefined,
      };

      merged.push(mergedQuestion);
      processed.add(i);

      if (duplicateIds.length > 1) {
        console.log(
          `✅ Questions fusionnées: ${formatQuestionNumbers(duplicateIds)} → Question ${merged.length}`
        );
        duplicates.set(merged.length, duplicateIds);
      }
    }

    console.log(`\n📈 Résumé:`);
    console.log(`   - Questions originales: ${questions.length}`);
    console.log(`   - Questions après fusion: ${merged.length}`);
    console.log(`   - Doublons fusionnés: ${questions.length - merged.length}`);

    // Sauvegarder le fichier
    fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2), "utf-8");
    console.log(`\n✅ Fichier sauvegardé: ${outputPath}`);
  } catch (error) {
    console.error("❌ Erreur lors de la fusion des doublons:", error);
    if (error instanceof Error) {
      console.error("Détails:", error.message);
      console.error("Stack:", error.stack);
    }
    process.exit(1);
  }
}

mergeDuplicates();

