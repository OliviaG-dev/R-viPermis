import type { QuizQuestion } from "../../types";

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    name: "Q1",
    theme: "Vérifications intérieures",
    vehicule: {
      question: "Où se trouve la commande des feux ?",
      answer: {
        text: "À gauche du volant",
        image: "/Img/Q01.png",
      },
    },
    qser: {
      question: "Quelle est la vitesse maximale en ville ?",
      answer: "50 km/h",
      multiple: false,
    },
    secours: {
      question: "Quel numéro appeler en cas d'accident ?",
      answer: ["112"],
      multiple: false,
    },
  },
  {
    id: 2,
    name: "Q2",
    theme: "Vérifications extérieures",
    vehicule: {
      question: "Comment vérifier l'usure des pneus ?",
      answer: {
        text: "Regarder les témoins",
        image: "/Img/Q02.png",
      },
    },
    qser: {
      question: "Que signifie un feu orange fixe ?",
      answer: "Arrêt obligatoire sauf danger",
      multiple: false,
    },
    secours: {
      question: "Quel premier geste pour une victime consciente ?",
      answer: ["Sécuriser la zone"],
      multiple: false,
    },
  },
  {
    id: 3,
    name: "Q3",
    theme: "Vérifications intérieures",
    vehicule: {
      question: "Où se trouve le frein à main ?",
      answer: {
        text: "Entre les sièges avant",
        image: "/Img/Q03.png",
      },
    },
    qser: {
      question: "Quelle est la vitesse sur autoroute ?",
      answer: "130 km/h",
      multiple: false,
    },
    secours: {
      question: "Que faire si la victime saigne ?",
      answer: "Comprimer la plaie",
      multiple: false,
    },
  },
  {
    id: 4,
    name: "Q4",
    theme: "Vérifications extérieures",
    vehicule: {
      question: "Montrez le réservoir de lave-glace.",
      answer: {
        text: "Sous le capot, bocal translucide.",
        image: "",
      },
    },
    qser: {
      question: "Pourquoi vérifier les niveaux ?",
      answer: ["Sécurité", "Bon fonctionnement"],
      multiple: true,
    },
    secours: {
      question: "Quel numéro pour les urgences en Europe ?",
      answer: "112",
      multiple: false,
    },
  },
];
