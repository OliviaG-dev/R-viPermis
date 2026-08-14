import type { PermisQuestion } from "../../data/questions";

export const revisionQuestions: PermisQuestion[] = [
  {
    id: 10,
    theme: "Vérifications intérieures",
    vehicule: {
      question: "Où se trouve la commande des feux ?",
      answer: { text: "À gauche du volant", image: "/Img/Q01.png" },
    },
    qser: {
      question: "Pourquoi régler les feux ?",
      answer: "Pour ne pas éblouir",
      multiple: false,
    },
    secours: {
      question: "Quels numéros appeler ?",
      answer: ["15", "112"],
      multiple: true,
    },
  },
  {
    id: 20,
    theme: "Vérifications extérieures",
    vehicule: {
      question: "Comment vérifier les pneus ?",
      answer: { text: "Regarder les témoins", image: "" },
    },
    qser: {
      question: "Que signifie un feu orange ?",
      answer: "Arrêt sauf danger",
      multiple: false,
    },
    secours: {
      question: "Quel premier geste ?",
      answer: "Sécuriser la zone",
      multiple: false,
    },
  },
];
