import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pdfPath = path.join(__dirname, "VERIFICATIONS EXAMEN PERMIS 2019.pdf");

async function debugPdf() {
  const { createRequire } = await import("module");
  const require = createRequire(import.meta.url);
  const pdfParse = require("pdf-parse");
  
  const file = fs.readFileSync(pdfPath);
  const data = await pdfParse(file);
  
  // Sauvegarder le texte brut pour analyse
  fs.writeFileSync(
    path.join(__dirname, "pdf-text-debug.txt"),
    data.text,
    "utf-8"
  );
  
  // Afficher les premières lignes
  const lines = data.text.split("\n").slice(0, 200);
  console.log("=== Premières 200 lignes du PDF ===");
  lines.forEach((line: string, index: number) => {
    if (line.trim()) {
      console.log(`${index}: ${line}`);
    }
  });
}

debugPdf();

