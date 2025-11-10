import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

interface PermisQuestion {
  id: number;
  name?: string;
  theme: string;
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

async function mergeSpecificQuestions() {
  try {
    const inputPath = path.join(projectRoot, "src", "data", "questions.json");
    const outputPath = path.join(projectRoot, "src", "data", "questions.json");

    console.log("📖 Lecture du fichier questions.json...");
    const fileContent = fs.readFileSync(inputPath, "utf-8");
    const questions: PermisQuestion[] = JSON.parse(fileContent);

    console.log(`📊 ${questions.length} questions trouvées`);

    // Trouver les questions 1 et 65
    const question1Index = questions.findIndex((q) => q.id === 1);
    const question65Index = questions.findIndex((q) => q.id === 65);

    if (question1Index === -1 || question65Index === -1) {
      console.error("❌ Les questions 1 et/ou 65 n'ont pas été trouvées");
      process.exit(1);
    }

    console.log("✅ Questions 1 et 65 trouvées");

    // Ajouter le champ name à la question 1
    questions[question1Index].name = "1 - 65";

    // Supprimer la question 65
    questions.splice(question65Index, 1);

    // Réorganiser les IDs de manière séquentielle
    const reorderedQuestions = questions.map((q, index) => ({
      ...q,
      id: index + 1,
    }));

    console.log(`\n📈 Résumé:`);
    console.log(`   - Questions originales: ${questions.length + 1}`);
    console.log(`   - Questions après fusion: ${reorderedQuestions.length}`);
    console.log(`   - Question fusionnée: ${reorderedQuestions[0].name} (ID: ${reorderedQuestions[0].id})`);

    // Sauvegarder le fichier
    fs.writeFileSync(outputPath, JSON.stringify(reorderedQuestions, null, 2), "utf-8");
    console.log(`\n✅ Fichier sauvegardé: ${outputPath}`);
  } catch (error) {
    console.error("❌ Erreur lors de la fusion des questions:", error);
    if (error instanceof Error) {
      console.error("Détails:", error.message);
      console.error("Stack:", error.stack);
    }
    process.exit(1);
  }
}

mergeSpecificQuestions();
