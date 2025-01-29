import { customAlphabet, nanoid } from "nanoid";

/**
 * Generate a random alias
 * @param length Length of the alias
 * @param characters Characters to use for the alias
 * @returns A random alias
 */
export function generateAlias(length: number = 6, characters?: string) {
  if (!characters) {
    return nanoid(length);
  } else {
    const nanoid = customAlphabet(characters, length);
    return nanoid();
  }
}
