const HORIZONTAL_WHITESPACE = /^[\t \u00a0\u1680\u2000-\u200a\u202f\u205f\u3000]$/u

export function normalizePracticeInputCharacter(
  inputCharacter: string,
  sourceCharacter: string
): string {
  if (HORIZONTAL_WHITESPACE.test(inputCharacter)) {
    return HORIZONTAL_WHITESPACE.test(sourceCharacter) ? sourceCharacter : ' '
  }

  return inputCharacter
}
