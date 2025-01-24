export function checkInvalidCustomTag(input: string): boolean {
  // Regular expression to match special characters except underscore
  const invalidSymbolsRegex = /[^\p{L}\p{N}_]/u;

  return invalidSymbolsRegex.test(input);
}
