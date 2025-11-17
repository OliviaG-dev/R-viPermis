// Fonctions utilitaires

/**
 * Mélange un tableau de manière aléatoire (algorithme Fisher-Yates)
 * @param array - Le tableau à mélanger
 * @returns Une nouvelle copie du tableau mélangé
 */
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * @deprecated Utilisez shuffle() à la place. Cette fonction est conservée pour la compatibilité.
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  return shuffle(array);
};

export const calculateScore = (correct: number, total: number): number => {
  return Math.round((correct / total) * 100);
};
