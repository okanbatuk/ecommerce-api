import { customAlphabet } from "nanoid";
import { slugify } from "./slugify.util";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 6);

export const generateSlug = (name: string): string =>
  `${slugify(name)}-${nanoid()}`;
