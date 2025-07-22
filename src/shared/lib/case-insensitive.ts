export const caseInsensitive = (str: string) => ({
  equals: str,
  mode: "insensitive" as const,
});
