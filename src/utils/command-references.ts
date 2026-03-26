/**
 * Command Reference Utilities
 *
 * Utilities for transforming command references to tool-specific formats.
 */

/**
 * Transforms colon-based command references to hyphen-based format.
 * Converts `/dwsp:` patterns to `/dwsp-` for tools that use hyphen syntax.
 *
 * @param text - The text containing command references
 * @returns Text with command references transformed to hyphen format
 *
 * @example
 * transformToHyphenCommands('/dwsp:new') // returns '/dwsp-new'
 * transformToHyphenCommands('Use /dwsp:apply to implement') // returns 'Use /dwsp-apply to implement'
 */
export function transformToHyphenCommands(text: string): string {
  return text.replace(/\/dwsp:/g, '/dwsp-');
}
