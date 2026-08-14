export const getMobileThemeLabel = (theme: string): string => {
  if (!theme) {
    return "";
  }

  const normalizedTheme = theme.toLowerCase();
  if (normalizedTheme.includes("intérieur")) {
    return "Interne";
  }
  if (normalizedTheme.includes("extérieur")) {
    return "Externe";
  }
  return theme;
};

export const formatAnswer = (answer: string | string[]): string => {
  if (Array.isArray(answer)) {
    return answer.join("\n");
  }
  return answer;
};
