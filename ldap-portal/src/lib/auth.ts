export const parseBearer = (authorizaton: string): string | null => {
  const bearerText = "Bearer ";
  if (!authorizaton.startsWith(bearerText)) {
    return null;
  }

  const token = authorizaton.substring(bearerText.length, authorizaton.length);
  return token;
};
