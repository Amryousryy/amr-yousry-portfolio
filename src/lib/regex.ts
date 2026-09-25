/**
 * Regular-expression safety helpers.
 *
 * These functions exist to prevent user-controlled input from injecting
 * regex semantics into database / string queries (a ReDoS / regex-injection
 * surface). They are intentionally dependency-free and framework-agnostic.
 *
 * NOTE: ECMAScript's native `RegExp.escape` is a late-stage proposal that is
 * NOT available at this project's TypeScript target (ES2017) / Node runtime,
 * so we ship a small, battle-tested, fully-compatible escape implementation
 * here instead.
 */

const REGEX_META = /[.*+?^${}()|[\]\\]/g;

/**
 * Escapes every character with special meaning inside a regular-expression
 * pattern, so the returned string matches the input LITERALLY.
 *
 * Safe for: new RegExp(escapeRegExp(userInput)), <str>.match(escapeRegExp(...)),
 * MongoDB `$regex` fields, etc.
 */
export function escapeRegExp(input: string): string {
  return input.replace(REGEX_META, "\\$&");
}
