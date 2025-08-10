export const caseInsensitive = (str: string) => ({
  contains: str,
  mode: "insensitive" as const,
});
