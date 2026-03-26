import { describe, it, expect } from 'vitest';
import { transformToHyphenCommands } from '../../src/utils/command-references.js';

describe('transformToHyphenCommands', () => {
  describe('basic transformations', () => {
    it('should transform single command reference', () => {
      expect(transformToHyphenCommands('/dwsp:new')).toBe('/dwsp-new');
    });

    it('should transform multiple command references', () => {
      const input = '/dwsp:new and /dwsp:apply';
      const expected = '/dwsp-new and /dwsp-apply';
      expect(transformToHyphenCommands(input)).toBe(expected);
    });

    it('should transform command reference in context', () => {
      const input = 'Use /dwsp:apply to implement tasks';
      const expected = 'Use /dwsp-apply to implement tasks';
      expect(transformToHyphenCommands(input)).toBe(expected);
    });

    it('should handle backtick-quoted commands', () => {
      const input = 'Run `/dwsp:continue` to proceed';
      const expected = 'Run `/dwsp-continue` to proceed';
      expect(transformToHyphenCommands(input)).toBe(expected);
    });
  });

  describe('edge cases', () => {
    it('should return unchanged text with no command references', () => {
      const input = 'This is plain text without commands';
      expect(transformToHyphenCommands(input)).toBe(input);
    });

    it('should return empty string unchanged', () => {
      expect(transformToHyphenCommands('')).toBe('');
    });

    it('should not transform similar but non-matching patterns', () => {
      const input = '/ops:new opsx: /other:command';
      expect(transformToHyphenCommands(input)).toBe(input);
    });

    it('should handle multiple occurrences on same line', () => {
      const input = '/dwsp:new /dwsp:continue /dwsp:apply';
      const expected = '/dwsp-new /dwsp-continue /dwsp-apply';
      expect(transformToHyphenCommands(input)).toBe(expected);
    });
  });

  describe('multiline content', () => {
    it('should transform references across multiple lines', () => {
      const input = `Use /dwsp:new to start
Then /dwsp:continue to proceed
Finally /dwsp:apply to implement`;
      const expected = `Use /dwsp-new to start
Then /dwsp-continue to proceed
Finally /dwsp-apply to implement`;
      expect(transformToHyphenCommands(input)).toBe(expected);
    });
  });

  describe('all known commands', () => {
    const commands = [
      'new',
      'continue',
      'apply',
      'ff',
      'sync',
      'archive',
      'bulk-archive',
      'verify',
      'explore',
      'onboard',
    ];

    for (const cmd of commands) {
      it(`should transform /dwsp:${cmd}`, () => {
        expect(transformToHyphenCommands(`/dwsp:${cmd}`)).toBe(`/dwsp-${cmd}`);
      });
    }
  });
});
