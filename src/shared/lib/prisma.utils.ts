import { Prisma } from "@prisma/client";

export const caseInsensitive = (value: string) =>
  Prisma.validator<Prisma.StringFilter>()({
    equals: value,
    mode: "insensitive",
  });
