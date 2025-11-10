import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Chercher le PDF dans le même dossier que le script (scripts/) en priorité
const possiblePdfPaths = [
  path.join(__dirname, "VERIFICATIONS EXAMEN PERMIS 2019.pdf"), // Même dossier que le script
  path.join(__dirname, "VERIFICATIONS_EXAMEN_PERMIS_2019.pdf"), // Avec underscore
  path.join(projectRoot, "VERIFICATIONS_EXAMEN_PERMIS_2019.pdf"),
  path.join(
    projectRoot,
    "src",
    "utils",
    "VERIFICATIONS EXAMEN PERMIS 2019.pdf"
  ),
  path.join(projectRoot, "VERIFICATIONS EXAMEN PERMIS 2019.pdf"),
];

const pdfPath = possiblePdfPaths.find((p) => fs.existsSync(p));
const outputPath = path.join(projectRoot, "src", "data", "questions.json");

interface ParsedQuestion {
  id: number;
  theme: string;
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

// Fonction pour nettoyer et joindre les lignes
function cleanAndJoinLines(lines: string[]): string {
  return lines
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .filter((l) => !/^\d+$/.test(l)) // Enlever les numéros de page seuls
    .filter((l) => !l.match(/^er\s+janvier/i)) // Enlever les dates
    .filter((l) => !l.match(/DSR\/BRPCE/i)) // Enlever les headers
    .filter((l) => !l.match(/^janvier\s+\d{4}/i)) // Enlever les dates
    .filter((l) => !l.match(/^\d+\s+\d+\s+er$/)) // Enlever les numéros de page comme "3 1 er"
    .filter((l) => !l.match(/^\d+\s+er$/)) // Enlever les numéros de page comme "3 er"
    .join(" ")
    .replace(/\s+/g, " ") // Remplacer les espaces multiples par un seul espace
    .replace(/\s+\d+\s+\d+\s+er\s*/g, " ") // Enlever les patterns de pagination dans le texte
    .replace(/\s+\d+\s+er\s*/g, " ") // Enlever les patterns de pagination dans le texte
    .replace(/^\d+$/, "") // Enlever les lignes qui ne contiennent qu'un numéro
    .trim();
}

// Fonction pour détecter et séparer les réponses multiples
function parseMultipleAnswers(text: string): {
  answers: string | string[];
  multiple: boolean;
} {
  if (!text || text.length === 0) {
    return { answers: "", multiple: false };
  }

  const trimmedText = text.trim();

  // Détecter si la réponse contient des listes à puces (commençant par "-")
  // Pattern: "- " au début d'une phrase ou après un espace, ou "–" (tiret long)
  // On cherche aussi les patterns comme "Le 15" suivi de "– Le 112" etc.
  const hasBulletPoints = /(?:^|\s)[–-]\s+/.test(trimmedText);
  const hasNumberedList = /\d+[,\s]?\s*[–-]\s*[A-Z]/.test(trimmedText); // Pattern comme "15, – Le" ou "15 – Le"

  if (!hasBulletPoints && !hasNumberedList) {
    // Pas de liste à puces, retourner le texte tel quel
    return { answers: trimmedText, multiple: false };
  }

  // Séparer les réponses multiples
  const answers: string[] = [];

  // Nettoyer d'abord les tirets longs (–) et les remplacer par des tirets courts (-)
  let cleanedText = trimmedText.replace(/–/g, "-");

  // Diviser par les tirets précédés d'un espace ou en début de ligne
  // On cherche "- " ou " - " mais aussi les patterns comme "Le 15, – Le 112"
  // Amélioration: gérer les cas où il y a une virgule avant le tiret
  cleanedText = cleanedText.replace(/,\s*-\s+/g, " |SEP| "); // Séparer les cas avec virgule
  cleanedText = cleanedText.replace(/(?:^|\s)-\s+/g, " |SEP| "); // Séparer les cas normaux

  const parts = cleanedText
    .split("|SEP|")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // Filtrer les introductions qui ne sont pas des réponses (comme "Citez deux exemples.")
  const filteredParts = parts.filter((part) => {
    const lower = part.toLowerCase();
    // Enlever les phrases qui sont des instructions plutôt que des réponses
    if (lower.match(/^(citez|nommez|indiquez|dites|énumerez)/i)) {
      return false;
    }
    // Enlever les phrases qui sont des introductions vides
    if (
      part.match(/^(elles sont|il se compose|les|la|le)\s+:/i) &&
      part.length < 50
    ) {
      // Garder seulement si c'est une vraie réponse
      return part.length > 20;
    }
    return true;
  });

  // Si on a filtré toutes les parties, utiliser les parties originales
  const finalParts = filteredParts.length > 0 ? filteredParts : parts;

  for (const part of finalParts) {
    const cleaned = part.trim();
    // Nettoyer les espaces multiples et les caractères indésirables
    const normalized = cleaned
      .replace(/\s+/g, " ")
      .replace(/^\s*[–-]\s*/, "") // Enlever les tirets en début
      .trim();

    if (normalized.length > 0 && normalized.length > 3) {
      // Ignorer les réponses trop courtes
      // Enlever les points finaux si ce n'est pas une abréviation
      answers.push(normalized);
    }
  }

  // Si on n'a trouvé qu'une seule réponse après séparation, ce n'est pas vraiment multiple
  if (answers.length <= 1) {
    return { answers: trimmedText, multiple: false };
  }

  // Nettoyer les réponses pour enlever les doublons et les réponses vides
  const uniqueAnswers = answers
    .filter((a, index, self) => self.indexOf(a) === index) // Enlever les doublons
    .filter((a) => a.length > 5); // Garder seulement les réponses significatives

  if (uniqueAnswers.length <= 1) {
    return { answers: trimmedText, multiple: false };
  }

  return {
    answers: uniqueAnswers,
    multiple: true,
  };
}

// Fonction pour collecter les lignes jusqu'à un marqueur
function collectUntilMarker(
  lines: string[],
  startIndex: number,
  markers: string[]
): { text: string; endIndex: number } {
  const collected: string[] = [];
  let i = startIndex;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Vérifier si on a atteint un marqueur
    if (markers.some((marker) => line.startsWith(marker))) {
      break;
    }

    // Ignorer les lignes vides et les headers
    if (
      line.length > 0 &&
      !line.match(/^\d+$/) &&
      !line.match(/^er\s+janvier/i) &&
      !line.match(/DSR\/BRPCE/i) &&
      !line.match(/^janvier\s+\d{4}/i) &&
      !line.match(/^Banque\s*:/i) &&
      !line.match(/^Délégation/i) &&
      !line.match(/^Sous-direction/i) &&
      !line.match(/^BRPCE$/i)
    ) {
      collected.push(line);
    }

    i++;
  }

  return {
    text: cleanAndJoinLines(collected),
    endIndex: i,
  };
}

async function parsePermis() {
  try {
    // Vérifier si le fichier PDF existe
    if (!pdfPath) {
      console.error(
        `❌ Le fichier PDF n'existe pas. Emplacements recherchés :`
      );
      possiblePdfPaths.forEach((p) => console.error(`   - ${p}`));
      process.exit(1);
    }

    console.log(`📄 Fichier PDF trouvé : ${pdfPath}`);

    console.log("📖 Lecture du fichier PDF...");
    const file = fs.readFileSync(pdfPath);

    console.log("🔍 Parsing du PDF...");
    // Utiliser createRequire pour importer pdf-parse (version 1.x)
    const { createRequire } = await import("module");
    const require = createRequire(import.meta.url);
    const pdfParse = require("pdf-parse");

    const data = await pdfParse(file);
    if (!data || !data.text) {
      throw new Error("Impossible d'extraire le texte du PDF");
    }

    const lines = data.text.split("\n").map((l: string) => l.trim());

    const questions: ParsedQuestion[] = [];
    let id = 1;
    let i = 0;

    while (i < lines.length) {
      const line = lines[i].trim();

      // Détecter le début d'une nouvelle question (VE ou VI)
      if (line === "VE" || line === "VI" || line.match(/^(VE|VI)(\s|$)/)) {
        const theme =
          line.startsWith("VI") || line === "VI"
            ? "Vérifications intérieures"
            : "Vérifications extérieures";

        i++; // Passer à la ligne suivante

        // Trouver où commence "QSER Réponse" pour séparer question et réponse véhicule
        let qserIndex = -1;
        let secoursIndex = -1;
        let nextQuestionIndex = lines.length;

        for (let j = i; j < Math.min(i + 100, lines.length); j++) {
          const currentLine = lines[j].trim();
          if (currentLine.startsWith("QSER Réponse") && qserIndex === -1) {
            qserIndex = j;
          }
          if (
            currentLine.startsWith("1ers secours Réponse") &&
            secoursIndex === -1
          ) {
            secoursIndex = j;
          }
          if (
            (currentLine === "VE" ||
              currentLine === "VI" ||
              currentLine.match(/^(VE|VI)(\s|$)/)) &&
            j > i
          ) {
            nextQuestionIndex = j;
            break;
          }
        }

        // 1. Question et réponse véhicule
        let vehiculeQuestion = "";
        let vehiculeAnswer = "";

        if (qserIndex > -1) {
          // On a trouvé QSER, donc on peut séparer question et réponse
          // La question est généralement plus courte, la réponse plus longue
          // On va prendre les lignes jusqu'à QSER et essayer de deviner où est la séparation
          const vehiculeLines: string[] = [];
          for (let j = i; j < qserIndex; j++) {
            const l = lines[j].trim();
            if (l.length > 0 && !l.match(/^\d+$/) && !l.match(/DSR\/BRPCE/i)) {
              vehiculeLines.push(l);
            }
          }

          // Essayer de détecter où se termine la question et où commence la réponse
          // Souvent, la question se termine par un point d'interrogation ou est plus courte
          // Pour l'instant, on va prendre la première phrase comme question et le reste comme réponse
          if (vehiculeLines.length > 0) {
            // Chercher un point qui pourrait séparer question et réponse
            let questionEnd = -1;
            for (let k = 0; k < vehiculeLines.length; k++) {
              if (
                vehiculeLines[k].endsWith(".") ||
                vehiculeLines[k].endsWith("?")
              ) {
                // Vérifier si la ligne suivante commence par une majuscule (nouvelle phrase)
                if (k + 1 < vehiculeLines.length) {
                  const nextLine = vehiculeLines[k + 1];
                  if (
                    nextLine.length > 0 &&
                    nextLine[0] === nextLine[0].toUpperCase()
                  ) {
                    questionEnd = k;
                    break;
                  }
                }
              }
            }

            if (questionEnd > -1) {
              vehiculeQuestion = cleanAndJoinLines(
                vehiculeLines.slice(0, questionEnd + 1)
              );
              vehiculeAnswer = cleanAndJoinLines(
                vehiculeLines.slice(questionEnd + 1)
              );
            } else {
              // Si on ne trouve pas de séparation claire, prendre la première ligne comme question
              // et le reste comme réponse (ou vice versa selon le contexte)
              // Pour l'instant, on met tout dans la question
              vehiculeQuestion = cleanAndJoinLines(vehiculeLines);
            }
          }

          i = qserIndex;
        } else {
          // Pas de QSER trouvé, prendre tout jusqu'à la prochaine question
          const vehiculeData = collectUntilMarker(lines, i, ["VE", "VI"]);
          vehiculeQuestion = vehiculeData.text;
          i = vehiculeData.endIndex;
        }

        // 3. Question QSER
        let qserQuestion = "";
        let qserAnswer = "";
        if (qserIndex > -1 && i === qserIndex) {
          i++; // Passer "QSER Réponse"

          // Collecter les lignes jusqu'à "1ers secours Réponse" ou la prochaine question
          const qserEndIndex =
            secoursIndex > -1 ? secoursIndex : nextQuestionIndex;
          const qserLines: string[] = [];
          for (let j = i; j < qserEndIndex; j++) {
            const l = lines[j].trim();
            if (l.length > 0 && !l.match(/^\d+$/) && !l.match(/DSR\/BRPCE/i)) {
              qserLines.push(l);
            }
          }

          // Séparer question et réponse QSER
          // La question se termine souvent par un "?"
          if (qserLines.length > 0) {
            let qserQuestionEnd = -1;
            for (let k = 0; k < qserLines.length; k++) {
              if (qserLines[k].endsWith("?") || qserLines[k].endsWith(".")) {
                // Vérifier si c'est vraiment la fin de la question
                if (qserLines[k].endsWith("?")) {
                  qserQuestionEnd = k;
                  break;
                } else if (k + 1 < qserLines.length) {
                  const nextLine = qserLines[k + 1];
                  // Si la ligne suivante commence par une majuscule et n'est pas une question, c'est probablement la réponse
                  if (
                    nextLine.length > 0 &&
                    nextLine[0] === nextLine[0].toUpperCase() &&
                    !nextLine.endsWith("?")
                  ) {
                    qserQuestionEnd = k;
                    break;
                  }
                }
              }
            }

            if (qserQuestionEnd > -1) {
              qserQuestion = cleanAndJoinLines(
                qserLines.slice(0, qserQuestionEnd + 1)
              );
              qserAnswer = cleanAndJoinLines(
                qserLines.slice(qserQuestionEnd + 1)
              );
            } else {
              // Si pas de séparation claire, prendre la première phrase comme question
              qserQuestion = cleanAndJoinLines(
                qserLines.slice(0, Math.min(3, qserLines.length))
              );
              qserAnswer = cleanAndJoinLines(
                qserLines.slice(Math.min(3, qserLines.length))
              );
            }
          }

          i = qserEndIndex;
        }

        // 5. Question premiers secours
        let secoursQuestion = "";
        let secoursAnswer = "";
        if (secoursIndex > -1 && i === secoursIndex) {
          i++; // Passer "1ers secours Réponse"

          // Ignorer les numéros de question (01, 02, etc.)
          while (i < lines.length && /^\d{2}$/.test(lines[i].trim())) {
            i++;
          }

          // Collecter les lignes jusqu'à la prochaine question
          const secoursLines: string[] = [];
          for (let j = i; j < nextQuestionIndex; j++) {
            const l = lines[j].trim();
            if (
              l.length > 0 &&
              !l.match(/^\d+$/) &&
              !l.match(/DSR\/BRPCE/i) &&
              !l.match(/^er\s+janvier/i) &&
              !l.match(/^janvier\s+\d{4}/i)
            ) {
              secoursLines.push(l);
            }
          }

          // Séparer question et réponse premiers secours
          // La question se termine souvent par un "?"
          if (secoursLines.length > 0) {
            let secoursQuestionEnd = -1;
            for (let k = 0; k < secoursLines.length; k++) {
              if (
                secoursLines[k].endsWith("?") ||
                secoursLines[k].endsWith(".")
              ) {
                if (secoursLines[k].endsWith("?")) {
                  secoursQuestionEnd = k;
                  break;
                } else if (k + 1 < secoursLines.length) {
                  const nextLine = secoursLines[k + 1];
                  if (
                    nextLine.length > 0 &&
                    nextLine[0] === nextLine[0].toUpperCase() &&
                    !nextLine.endsWith("?")
                  ) {
                    secoursQuestionEnd = k;
                    break;
                  }
                }
              }
            }

            if (secoursQuestionEnd > -1) {
              secoursQuestion = cleanAndJoinLines(
                secoursLines.slice(0, secoursQuestionEnd + 1)
              );
              secoursAnswer = cleanAndJoinLines(
                secoursLines.slice(secoursQuestionEnd + 1)
              );
            } else {
              // Si pas de séparation claire, prendre les premières lignes comme question
              secoursQuestion = cleanAndJoinLines(
                secoursLines.slice(0, Math.min(5, secoursLines.length))
              );
              secoursAnswer = cleanAndJoinLines(
                secoursLines.slice(Math.min(5, secoursLines.length))
              );
            }
          }

          i = nextQuestionIndex;
        } else {
          // Pas de section secours, aller à la prochaine question
          i = nextQuestionIndex;
        }

        // Ajouter la question seulement si on a au moins une question véhicule
        if (vehiculeQuestion.length > 0) {
          questions.push({
            id: id++,
            theme,
            vehicule: {
              question: vehiculeQuestion,
              answer: {
                text:
                  vehiculeAnswer.length > 0
                    ? vehiculeAnswer
                    : "Réponse à compléter",
                image: "",
              },
            },
            qser: (() => {
              const qserParsed = parseMultipleAnswers(
                qserAnswer || "Réponse QSER à compléter"
              );
              return {
                question: qserQuestion || "Question QSER à compléter",
                answer: qserParsed.answers,
                multiple: qserParsed.multiple,
              };
            })(),
            secours: (() => {
              const secoursParsed = parseMultipleAnswers(
                secoursAnswer || "Réponse premiers secours à compléter"
              );
              return {
                question:
                  secoursQuestion || "Question premiers secours à compléter",
                answer: secoursParsed.answers,
                multiple: secoursParsed.multiple,
              };
            })(),
          });
        }
      } else {
        i++;
      }
    }

    // S'assurer que le dossier de destination existe
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2), "utf-8");
    console.log(`✅ ${outputPath} créé avec ${questions.length} entrées`);
  } catch (error) {
    console.error("❌ Erreur lors du parsing:", error);
    if (error instanceof Error) {
      console.error("Détails:", error.message);
      console.error("Stack:", error.stack);
    }
    process.exit(1);
  }
}

parsePermis();
