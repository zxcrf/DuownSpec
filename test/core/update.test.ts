import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UpdateCommand, scanInstalledWorkflows } from '../../src/core/update.js';
import { InitCommand } from '../../src/core/init.js';
import { FileSystemUtils } from '../../src/utils/file-system.js';
import { DUOWENSPEC_MARKERS } from '../../src/core/config.js';
import type { GlobalConfig } from '../../src/core/global-config.js';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';
import { randomUUID } from 'crypto';

// Shared mutable mock config state
const mockState = {
  config: {
    featureFlags: {},
    profile: 'custom' as const,
    delivery: 'both' as const,
    workflows: ['propose', 'explore', 'apply', 'review', 'verify', 'document', 'archive'],
  } as GlobalConfig,
};

// Mock global config module to isolate tests from the machine's actual config
vi.mock('../../src/core/global-config.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/core/global-config.js')>();

  return {
    ...actual,
    getGlobalConfig: () => ({ ...mockState.config }),
    saveGlobalConfig: vi.fn(),
  };
});

// Helper to set mock config for tests
function setMockConfig(config: GlobalConfig) {
  mockState.config = config;
}

function resetMockConfig() {
  mockState.config = {
    featureFlags: {},
    profile: 'custom',
    delivery: 'both',
    workflows: ['propose', 'explore', 'apply', 'review', 'verify', 'document', 'archive'],
  };
}

describe('UpdateCommand', () => {
  let testDir: string;
  let updateCommand: UpdateCommand;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(async () => {
    originalEnv = { ...process.env };

    // Create a temporary test directory
    testDir = path.join(os.tmpdir(), `duowenspec-test-${randomUUID()}`);
    await fs.mkdir(testDir, { recursive: true });

    // Create duowenspec directory
    const duowenspecDir = path.join(testDir, 'duowenspec');
    await fs.mkdir(duowenspecDir, { recursive: true });

    updateCommand = new UpdateCommand();

    // Reset mock config to defaults
    resetMockConfig();

    // Clear all mocks before each test
    vi.restoreAllMocks();
  });

  afterEach(async () => {
    process.env = originalEnv;

    // Restore all mocks after each test
    vi.restoreAllMocks();

    // Clean up test directory
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('basic validation', () => {
    it('should throw error if duowenspec directory does not exist', async () => {
      // Remove duowenspec directory
      await fs.rm(path.join(testDir, 'duowenspec'), {
        recursive: true,
        force: true,
      });

      await expect(updateCommand.execute(testDir)).rejects.toThrow(
        "未找到 DuowenSpec 目录。请先运行 'dwsp init'。"
      );
    });

    it('should report no configured tools when none exist', async () => {
      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('未找到已配置的工具')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('skill updates', () => {
    it('should update skill files for configured Claude tool', async () => {
      // Set up a configured Claude tool by creating skill directories
      const skillsDir = path.join(testDir, '.claude', 'skills');
      const exploreSkillDir = path.join(skillsDir, 'dwsp-explore');
      await fs.mkdir(exploreSkillDir, { recursive: true });

      // Create an existing skill file
      const oldSkillContent = `---
name: dwsp-explore (old)
description: Old description
license: MIT
compatibility: Requires duowenspec CLI.
metadata:
  author: duowenspec
  version: "0.9"
---

Old instructions content
`;
      await fs.writeFile(
        path.join(exploreSkillDir, 'SKILL.md'),
        oldSkillContent
      );

      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      // Check skill file was updated
      const updatedSkill = await fs.readFile(
        path.join(exploreSkillDir, 'SKILL.md'),
        'utf-8'
      );
      expect(updatedSkill).toContain('name: dwsp-explore');
      expect(updatedSkill).not.toContain('Old instructions content');
      expect(updatedSkill).toContain('license: MIT');

      // Check console output
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('准备更新 1 个工具：claude')
      );

      consoleSpy.mockRestore();
    });

    it('should update enterprise-default skill files when tool is configured', async () => {
      // Set up a configured tool with one skill directory
      const skillsDir = path.join(testDir, '.claude', 'skills');

      // Create at least one skill to mark tool as configured
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md'),
        'old content'
      );

      await updateCommand.execute(testDir);

      const defaultSkillNames = [
        'dwsp-explore',
        'dwsp-apply-change',
        'dwsp-review-change',
        'dwsp-archive-change',
        'dwsp-propose',
        'dwsp-verify-change',
        'dwsp-document-change',
      ];

      for (const skillName of defaultSkillNames) {
        const skillFile = path.join(skillsDir, skillName, 'SKILL.md');
        const exists = await FileSystemUtils.fileExists(skillFile);
        expect(exists).toBe(true);

        const content = await fs.readFile(skillFile, 'utf-8');
        expect(content).toContain('---');
        expect(content).toContain('name:');
        expect(content).toContain('description:');
      }

      const nonDefaultSkillNames = [
        'dwsp-new-change',
        'dwsp-continue-change',
        'dwsp-ff-change',
        'dwsp-sync-specs',
        'dwsp-bulk-archive-change',
      ];

      for (const skillName of nonDefaultSkillNames) {
        const skillFile = path.join(skillsDir, skillName, 'SKILL.md');
        const exists = await FileSystemUtils.fileExists(skillFile);
        expect(exists).toBe(false);
      }
    });
  });

  describe('command updates', () => {
    it('should update opsx commands for configured Claude tool', async () => {
      // Set up a configured Claude tool
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md'),
        'old content'
      );

      await updateCommand.execute(testDir);

      // Check opsx command files were created
      const commandsDir = path.join(testDir, '.claude', 'commands', 'dwsp');
      const exploreCmd = path.join(commandsDir, 'explore.md');
      const exists = await FileSystemUtils.fileExists(exploreCmd);
      expect(exists).toBe(true);

      const content = await fs.readFile(exploreCmd, 'utf-8');
      expect(content).toContain('---');
      expect(content).toContain('name:');
      expect(content).toContain('description:');
      expect(content).toContain('category:');
      expect(content).toContain('tags:');
    });

    it('should update enterprise-default opsx commands when tool is configured', async () => {
      // Set up a configured tool
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md'),
        'old content'
      );

      await updateCommand.execute(testDir);

      const defaultCommandIds = ['explore', 'apply', 'review', 'archive', 'propose', 'verify', 'document'];
      const commandsDir = path.join(testDir, '.claude', 'commands', 'dwsp');
      for (const cmdId of defaultCommandIds) {
        const cmdFile = path.join(commandsDir, `${cmdId}.md`);
        const exists = await FileSystemUtils.fileExists(cmdFile);
        expect(exists).toBe(true);
      }

      const nonDefaultCommandIds = ['new', 'continue', 'ff', 'sync', 'bulk-archive'];
      for (const cmdId of nonDefaultCommandIds) {
        const cmdFile = path.join(commandsDir, `${cmdId}.md`);
        const exists = await FileSystemUtils.fileExists(cmdFile);
        expect(exists).toBe(false);
      }
    });
  });

  describe('multi-tool support', () => {
    it('should update multiple configured tools', async () => {
      // Set up Claude
      const claudeSkillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(claudeSkillsDir, 'dwsp-explore'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(claudeSkillsDir, 'dwsp-explore', 'SKILL.md'),
        'old'
      );

      // Set up Qoder
      const cursorSkillsDir = path.join(testDir, '.qoder', 'skills');
      await fs.mkdir(path.join(cursorSkillsDir, 'dwsp-explore'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(cursorSkillsDir, 'dwsp-explore', 'SKILL.md'),
        'old'
      );

      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      // Both tools should be updated
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('准备更新 2 个工具')
      );

      // Verify Claude skills updated
      const claudeSkill = await fs.readFile(
        path.join(claudeSkillsDir, 'dwsp-explore', 'SKILL.md'),
        'utf-8'
      );
      expect(claudeSkill).toContain('name: dwsp-explore');

      // Verify Qoder skills updated
      const cursorSkill = await fs.readFile(
        path.join(cursorSkillsDir, 'dwsp-explore', 'SKILL.md'),
        'utf-8'
      );
      expect(cursorSkill).toContain('name: dwsp-explore');

      consoleSpy.mockRestore();
    });

    it('should update CodeBuddy tool with correct command format', async () => {
      // Set up CodeBuddy
      const qwenSkillsDir = path.join(testDir, '.codebuddy', 'skills');
      await fs.mkdir(path.join(qwenSkillsDir, 'dwsp-explore'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(qwenSkillsDir, 'dwsp-explore', 'SKILL.md'),
        'old'
      );

      await updateCommand.execute(testDir);

      // Check CodeBuddy command format
      const qwenCmd = path.join(
        testDir,
        '.codebuddy',
        'commands',
        'dwsp',
        'explore.md'
      );
      const exists = await FileSystemUtils.fileExists(qwenCmd);
      expect(exists).toBe(true);

      const content = await fs.readFile(qwenCmd, 'utf-8');
      expect(content).toContain('description:');
      expect(content).toContain('argument-hint:');
    });

    it('should update OpenCode tool with correct command format', async () => {
      // Set up OpenCode
      const windsurfSkillsDir = path.join(testDir, '.opencode', 'skills');
      await fs.mkdir(path.join(windsurfSkillsDir, 'dwsp-explore'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(windsurfSkillsDir, 'dwsp-explore', 'SKILL.md'),
        'old'
      );

      await updateCommand.execute(testDir);

      // Check OpenCode command format
      const windsurfCmd = path.join(
        testDir,
        '.opencode',
        'commands',
        'dwsp-explore.md'
      );
      const exists = await FileSystemUtils.fileExists(windsurfCmd);
      expect(exists).toBe(true);

      const content = await fs.readFile(windsurfCmd, 'utf-8');
      expect(content).toContain('---');
      expect(content).toContain('description:');
    });
  });

  describe('error handling', () => {
    it('should handle tool update failures gracefully', async () => {
      // Set up a configured tool
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md'),
        'old'
      );

      // Mock writeFile to fail for skills
      const originalWriteFile = FileSystemUtils.writeFile.bind(FileSystemUtils);
      const writeSpy = vi
        .spyOn(FileSystemUtils, 'writeFile')
        .mockImplementation(async (filePath, content) => {
          if (filePath.includes('SKILL.md')) {
            throw new Error('EACCES: permission denied');
          }
          return originalWriteFile(filePath, content);
        });

      const consoleSpy = vi.spyOn(console, 'log');

      // Should not throw
      await updateCommand.execute(testDir);

      // Should report failure
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('失败')
      );

      writeSpy.mockRestore();
      consoleSpy.mockRestore();
    });

    it('should continue updating other tools when one fails', async () => {
      // Set up Claude and Qoder
      const claudeSkillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(claudeSkillsDir, 'dwsp-explore'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(claudeSkillsDir, 'dwsp-explore', 'SKILL.md'),
        'old'
      );

      const cursorSkillsDir = path.join(testDir, '.qoder', 'skills');
      await fs.mkdir(path.join(cursorSkillsDir, 'dwsp-explore'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(cursorSkillsDir, 'dwsp-explore', 'SKILL.md'),
        'old'
      );

      // Mock writeFile to fail only for Claude
      const originalWriteFile = FileSystemUtils.writeFile.bind(FileSystemUtils);
      const writeSpy = vi
        .spyOn(FileSystemUtils, 'writeFile')
        .mockImplementation(async (filePath, content) => {
          if (filePath.includes('.claude') && filePath.includes('SKILL.md')) {
            throw new Error('EACCES: permission denied');
          }
          return originalWriteFile(filePath, content);
        });

      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      // Qoder should still be updated - check the actual format from ora spinner
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('已更新：Qoder')
      );

      // Claude should be reported as failed
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('失败')
      );

      writeSpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  describe('tool detection', () => {
    it('should detect tool as configured only when skill file exists', async () => {
      // Create skills directory but no skill files
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(skillsDir, { recursive: true });

      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      // Should report no configured tools
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('未找到已配置的工具')
      );

      consoleSpy.mockRestore();
    });

    it('should detect tool when any single skill exists', async () => {
      // Create only one skill file
      const skillDir = path.join(
        testDir,
        '.claude',
        'skills',
        'dwsp-archive-change'
      );
      await fs.mkdir(skillDir, { recursive: true });
      await fs.writeFile(path.join(skillDir, 'SKILL.md'), 'old');

      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      // Should detect and update Claude
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('准备更新 1 个工具：claude')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('skill content validation', () => {
    it('should generate valid YAML frontmatter in skill files', async () => {
      // Set up a configured tool
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md'),
        'old'
      );

      await updateCommand.execute(testDir);

      const skillContent = await fs.readFile(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md'),
        'utf-8'
      );

      // Validate frontmatter structure
      expect(skillContent).toMatch(/^---\n/);
      expect(skillContent).toContain('name:');
      expect(skillContent).toContain('description:');
      expect(skillContent).toContain('license:');
      expect(skillContent).toContain('compatibility:');
      expect(skillContent).toContain('metadata:');
      expect(skillContent).toContain('author:');
      expect(skillContent).toContain('version:');
      expect(skillContent).toMatch(/---\n\n/);
    });

    it('should include proper instructions in skill files', async () => {
      // Set up a configured tool with apply-change skill (which is in core profile)
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-apply-change'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(skillsDir, 'dwsp-apply-change', 'SKILL.md'),
        'old'
      );

      await updateCommand.execute(testDir);

      const skillContent = await fs.readFile(
        path.join(skillsDir, 'dwsp-apply-change', 'SKILL.md'),
        'utf-8'
      );

      // Apply skill should contain implementation instructions
      expect(skillContent.toLowerCase()).toContain('task');
    });
  });

  describe('success output', () => {
    it('should display success message with tool name', async () => {
      // Set up a configured tool
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md'),
        'old'
      );

      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      // The success output uses "✓ Updated: <name>"
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('已更新：Claude Code')
      );

      consoleSpy.mockRestore();
    });

    it('should suggest IDE restart after update', async () => {
      // Set up a configured tool
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md'),
        'old'
      );

      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('请重启你的 IDE')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('smart update detection', () => {
    it('should show "up to date" message when skills have current version', async () => {
      // Initialize full core profile output so there is no profile/delivery drift.
      const initCommand = new InitCommand({ tools: 'claude', force: true });
      await initCommand.execute(testDir);

      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('已是最新状态')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('--force')
      );

      consoleSpy.mockRestore();
    });

    it('should detect update needed when generatedBy is missing', async () => {
      // Set up a configured tool without generatedBy
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md'),
        `---
name: dwsp-explore
metadata:
  author: duowenspec
  version: "1.0"
---

Legacy content without generatedBy
`
      );

      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      // Should show "unknown → version" in the update message
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('unknown')
      );

      consoleSpy.mockRestore();
    });

    it('should detect update needed when version differs', async () => {
      // Set up a configured tool with old version
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md'),
        `---
name: dwsp-explore
metadata:
  generatedBy: "0.1.0"
---

Old version content
`
      );

      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      // Should show version transition
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('0.1.0')
      );

      consoleSpy.mockRestore();
    });

    it('should embed generatedBy in updated skill files', async () => {
      // Set up a configured tool without generatedBy
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md'),
        'old content without version'
      );

      await updateCommand.execute(testDir);

      const updatedContent = await fs.readFile(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md'),
        'utf-8'
      );

      // Should contain generatedBy field
      expect(updatedContent).toMatch(/generatedBy:\s*["']\d+\.\d+\.\d+["']/);
    });
  });

  describe('--force flag', () => {
    it('should update when force is true even if up to date', async () => {
      // Set up a configured tool with current version
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), {
        recursive: true,
      });

      const { version } = await import('../../package.json');
      await fs.writeFile(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md'),
        `---
metadata:
  generatedBy: "${version}"
---
Content
`
      );

      const consoleSpy = vi.spyOn(console, 'log');

      // Create update command with force option
      const forceUpdateCommand = new UpdateCommand({ force: true });
      await forceUpdateCommand.execute(testDir);

      // Should show "Force updating" message
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('强制更新')
      );

      // Should show updated message
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('已更新：Claude Code')
      );

      consoleSpy.mockRestore();
    });

    it('should not show --force hint when force is used', async () => {
      // Set up a configured tool
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md'),
        'old content'
      );

      const consoleSpy = vi.spyOn(console, 'log');

      const forceUpdateCommand = new UpdateCommand({ force: true });
      await forceUpdateCommand.execute(testDir);

      // Get all console.log calls as strings
      const allCalls = consoleSpy.mock.calls.map(call =>
        call.map(arg => String(arg)).join(' ')
      );

      // Should not show "Use --force" since force was used
      const hasForceHint = allCalls.some(call => call.includes('如需强制重写文件'));
      expect(hasForceHint).toBe(false);

      consoleSpy.mockRestore();
    });

    it('should update all tools when force is used with mixed versions', async () => {
      // Set up Claude with current version
      const { version } = await import('../../package.json');
      const claudeSkillDir = path.join(testDir, '.claude', 'skills', 'dwsp-explore');
      await fs.mkdir(claudeSkillDir, { recursive: true });
      await fs.writeFile(
        path.join(claudeSkillDir, 'SKILL.md'),
        `---
metadata:
  generatedBy: "${version}"
---
`
      );

      // Set up Qoder with old version
      const cursorSkillDir = path.join(testDir, '.qoder', 'skills', 'dwsp-explore');
      await fs.mkdir(cursorSkillDir, { recursive: true });
      await fs.writeFile(
        path.join(cursorSkillDir, 'SKILL.md'),
        `---
metadata:
  generatedBy: "0.1.0"
---
`
      );

      const consoleSpy = vi.spyOn(console, 'log');

      const forceUpdateCommand = new UpdateCommand({ force: true });
      await forceUpdateCommand.execute(testDir);

      // Should show both tools being force updated
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('强制更新 2 个工具')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('version tracking', () => {
    it('should show version in success message', async () => {
      // Set up a configured tool
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md'),
        'old'
      );

      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      // Should show version in success message
      const { version } = await import('../../package.json');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(`（v${version}）`)
      );

      consoleSpy.mockRestore();
    });

    it('should only update tools that need updating', async () => {
      // Initialize both tools so Qoder is fully synced with profile/delivery.
      const initCommand = new InitCommand({ tools: 'claude,qoder', force: true });
      await initCommand.execute(testDir);

      // Make Claude stale to force a version update.
      const claudeSkillFile = path.join(testDir, '.claude', 'skills', 'dwsp-explore', 'SKILL.md');
      const claudeContent = await fs.readFile(claudeSkillFile, 'utf-8');
      await fs.writeFile(
        claudeSkillFile,
        claudeContent.replace(/generatedBy:\s*["'][^"']+["']/, 'generatedBy: "0.1.0"')
      );

      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      // Should show only Claude being updated
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('准备更新 1 个工具')
      );

      // Should mention Qoder is already up to date
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('已是最新：qoder')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('legacy cleanup', () => {
    it('should detect and auto-cleanup legacy files with --force flag', async () => {
      // Set up a configured tool
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md'),
        'old'
      );

      // Create legacy CLAUDE.md with DuowenSpec markers
      const legacyContent = `${DUOWENSPEC_MARKERS.start}
# DuowenSpec Instructions

These instructions are for AI assistants.
${DUOWENSPEC_MARKERS.end}
`;
      await fs.writeFile(path.join(testDir, 'CLAUDE.md'), legacyContent);

      const consoleSpy = vi.spyOn(console, 'log');

      // Create update command with force option
      const forceUpdateCommand = new UpdateCommand({ force: true });
      await forceUpdateCommand.execute(testDir);

      // Should show v1 upgrade message
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('正在升级到新版 DuowenSpec')
      );

      // Should show marker removal message (config files are never deleted, only have markers removed)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('已从 CLAUDE.md 中移除 DuowenSpec 标记')
      );

      // Config file should still exist (never deleted)
      const legacyExists = await FileSystemUtils.fileExists(
        path.join(testDir, 'CLAUDE.md')
      );
      expect(legacyExists).toBe(true);

      // File should have markers removed
      const content = await fs.readFile(path.join(testDir, 'CLAUDE.md'), 'utf-8');
      expect(content).not.toContain(DUOWENSPEC_MARKERS.start);
      expect(content).not.toContain(DUOWENSPEC_MARKERS.end);

      consoleSpy.mockRestore();
    });

    it('should warn but continue with update when legacy files found in non-interactive mode', async () => {
      // Set up a configured tool
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md'),
        'old'
      );

      // Create legacy CLAUDE.md with DuowenSpec markers
      const legacyContent = `${DUOWENSPEC_MARKERS.start}
# DuowenSpec Instructions
${DUOWENSPEC_MARKERS.end}
`;
      await fs.writeFile(path.join(testDir, 'CLAUDE.md'), legacyContent);

      const consoleSpy = vi.spyOn(console, 'log');

      // Run without --force in non-interactive mode (CI environment)
      await updateCommand.execute(testDir);

      // Should show v1 upgrade message
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('正在升级到新版 DuowenSpec')
      );

      // Should show warning about --force
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('可使用 --force 自动清理')
      );

      // Should continue with update
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('已更新：Claude Code')
      );

      // Legacy file should still exist (not cleaned up)
      const legacyExists = await FileSystemUtils.fileExists(
        path.join(testDir, 'CLAUDE.md')
      );
      expect(legacyExists).toBe(true);

      consoleSpy.mockRestore();
    });

    it('should cleanup legacy slash command directories with --force', async () => {
      // Set up a configured tool
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md'),
        'old'
      );

      // Create legacy slash command directory
      const legacyCommandDir = path.join(testDir, '.claude', 'commands', 'duowenspec');
      await fs.mkdir(legacyCommandDir, { recursive: true });
      await fs.writeFile(
        path.join(legacyCommandDir, 'old-command.md'),
        'old command'
      );

      const consoleSpy = vi.spyOn(console, 'log');

      // Create update command with force option
      const forceUpdateCommand = new UpdateCommand({ force: true });
      await forceUpdateCommand.execute(testDir);

      // Should show cleanup message for directory
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('已移除 .claude/commands/duowenspec/')
      );

      // Legacy directory should be deleted
      const legacyDirExists = await FileSystemUtils.directoryExists(legacyCommandDir);
      expect(legacyDirExists).toBe(false);

      consoleSpy.mockRestore();
    });

    it('should cleanup legacy duowenspec/AGENTS.md with --force', async () => {
      // Set up a configured tool
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md'),
        'old'
      );

      // Create legacy duowenspec/AGENTS.md
      await fs.writeFile(
        path.join(testDir, 'duowenspec', 'AGENTS.md'),
        '# Old AGENTS.md content'
      );

      const consoleSpy = vi.spyOn(console, 'log');

      // Create update command with force option
      const forceUpdateCommand = new UpdateCommand({ force: true });
      await forceUpdateCommand.execute(testDir);

      // Should show cleanup message
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('已移除 duowenspec/AGENTS.md')
      );

      // Legacy file should be deleted
      const legacyExists = await FileSystemUtils.fileExists(
        path.join(testDir, 'duowenspec', 'AGENTS.md')
      );
      expect(legacyExists).toBe(false);

      consoleSpy.mockRestore();
    });

    it('should not show legacy cleanup messages when no legacy files exist', async () => {
      // Set up a configured tool with no legacy files
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md'),
        'old'
      );

      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      // Should not show v1 upgrade message (no legacy files)
      const calls = consoleSpy.mock.calls.map(call =>
        call.map(arg => String(arg)).join(' ')
      );
      const hasLegacyMessage = calls.some(call =>
        call.includes('正在升级到新版 DuowenSpec')
      );
      expect(hasLegacyMessage).toBe(false);

      consoleSpy.mockRestore();
    });

    it('should remove DuowenSpec marker block from mixed content files', async () => {
      // Set up a configured tool
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), {
        recursive: true,
      });
      await fs.writeFile(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md'),
        'old'
      );

      // Create CLAUDE.md with mixed content (user content + DuowenSpec markers)
      const mixedContent = `# My Project

Some user-defined instructions here.

${DUOWENSPEC_MARKERS.start}
# DuowenSpec Instructions

These instructions are for AI assistants.
${DUOWENSPEC_MARKERS.end}

More user content after markers.
`;
      await fs.writeFile(path.join(testDir, 'CLAUDE.md'), mixedContent);

      const consoleSpy = vi.spyOn(console, 'log');

      // Create update command with force option
      const forceUpdateCommand = new UpdateCommand({ force: true });
      await forceUpdateCommand.execute(testDir);

      // Should show marker removal message
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('已从 CLAUDE.md 中移除 DuowenSpec 标记')
      );

      // File should still exist
      const fileExists = await FileSystemUtils.fileExists(
        path.join(testDir, 'CLAUDE.md')
      );
      expect(fileExists).toBe(true);

      // File should have markers removed but preserve user content
      const updatedContent = await fs.readFile(
        path.join(testDir, 'CLAUDE.md'),
        'utf-8'
      );
      expect(updatedContent).toContain('# My Project');
      expect(updatedContent).toContain('Some user-defined instructions here');
      expect(updatedContent).toContain('More user content after markers');
      expect(updatedContent).not.toContain(DUOWENSPEC_MARKERS.start);
      expect(updatedContent).not.toContain(DUOWENSPEC_MARKERS.end);

      consoleSpy.mockRestore();
    });
  });

  describe('legacy tool upgrade', () => {
    it('should upgrade legacy tools to new skills with --force', async () => {
      // Create legacy slash command directory (no skills exist yet)
      const legacyCommandDir = path.join(testDir, '.claude', 'commands', 'duowenspec');
      await fs.mkdir(legacyCommandDir, { recursive: true });
      await fs.writeFile(
        path.join(legacyCommandDir, 'proposal.md'),
        'old command content'
      );

      const consoleSpy = vi.spyOn(console, 'log');

      // Create update command with force option
      const forceUpdateCommand = new UpdateCommand({ force: true });
      await forceUpdateCommand.execute(testDir);

      // Should show detected tools message
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('从旧版遗留文件中识别到以下工具')
      );

      // Should show Claude Code being set up
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Claude Code')
      );

      // Should show getting started message for newly configured tools
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('开始使用')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('/dwsp:propose')
      );

      // Skills should be created
      const skillFile = path.join(testDir, '.claude', 'skills', 'dwsp-explore', 'SKILL.md');
      const skillExists = await FileSystemUtils.fileExists(skillFile);
      expect(skillExists).toBe(true);

      // Legacy directory should be deleted
      const legacyDirExists = await FileSystemUtils.directoryExists(legacyCommandDir);
      expect(legacyDirExists).toBe(false);

      consoleSpy.mockRestore();
    });

    it('should upgrade multiple legacy tools with --force', async () => {
      // Create legacy command directories for Claude and Qoder
      await fs.mkdir(path.join(testDir, '.claude', 'commands', 'duowenspec'), { recursive: true });
      await fs.writeFile(
        path.join(testDir, '.claude', 'commands', 'duowenspec', 'proposal.md'),
        'content'
      );

      await fs.mkdir(path.join(testDir, '.qoder', 'commands', 'duowenspec'), { recursive: true });
      await fs.writeFile(
        path.join(testDir, '.qoder', 'commands', 'duowenspec', 'proposal.md'),
        'content'
      );

      const consoleSpy = vi.spyOn(console, 'log');

      // Create update command with force option
      const forceUpdateCommand = new UpdateCommand({ force: true });
      await forceUpdateCommand.execute(testDir);

      // Should detect both tools
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('从旧版遗留文件中识别到以下工具')
      );

      // Both tools should have skills created
      const claudeSkillFile = path.join(testDir, '.claude', 'skills', 'dwsp-explore', 'SKILL.md');
      const cursorSkillFile = path.join(testDir, '.qoder', 'skills', 'dwsp-explore', 'SKILL.md');

      expect(await FileSystemUtils.fileExists(claudeSkillFile)).toBe(true);
      expect(await FileSystemUtils.fileExists(cursorSkillFile)).toBe(true);

      consoleSpy.mockRestore();
    });

    it('should not upgrade legacy tools already configured', async () => {
      // Set up a configured Claude tool with skills
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), { recursive: true });
      await fs.writeFile(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md'),
        'existing skill'
      );

      // Also create legacy directory (simulating partial upgrade)
      const legacyCommandDir = path.join(testDir, '.claude', 'commands', 'duowenspec');
      await fs.mkdir(legacyCommandDir, { recursive: true });
      await fs.writeFile(
        path.join(legacyCommandDir, 'proposal.md'),
        'old command'
      );

      const consoleSpy = vi.spyOn(console, 'log');

      // Create update command with force option
      const forceUpdateCommand = new UpdateCommand({ force: true });
      await forceUpdateCommand.execute(testDir);

      // Legacy cleanup should happen
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('已移除 .claude/commands/duowenspec/')
      );

      // Should NOT show "Tools detected from legacy artifacts" because claude is already configured
      const calls = consoleSpy.mock.calls.map(call =>
        call.map(arg => String(arg)).join(' ')
      );
      const hasDetectedMessage = calls.some(call =>
        call.includes('从旧版遗留文件中识别到以下工具')
      );
      expect(hasDetectedMessage).toBe(false);

      // Should update existing skills (not "Getting started" for newly configured)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('已更新：Claude Code')
      );

      consoleSpy.mockRestore();
    });

    it('should upgrade only unconfigured legacy tools when mixed', async () => {
      // Set up configured Claude tool with skills
      const claudeSkillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(claudeSkillsDir, 'dwsp-explore'), { recursive: true });
      await fs.writeFile(
        path.join(claudeSkillsDir, 'dwsp-explore', 'SKILL.md'),
        'existing skill'
      );

      // Create legacy commands for both Claude (configured) and Qoder (not configured)
      await fs.mkdir(path.join(testDir, '.claude', 'commands', 'duowenspec'), { recursive: true });
      await fs.writeFile(
        path.join(testDir, '.claude', 'commands', 'duowenspec', 'proposal.md'),
        'content'
      );

      await fs.mkdir(path.join(testDir, '.qoder', 'commands', 'duowenspec'), { recursive: true });
      await fs.writeFile(
        path.join(testDir, '.qoder', 'commands', 'duowenspec', 'proposal.md'),
        'content'
      );

      const consoleSpy = vi.spyOn(console, 'log');

      // Create update command with force option
      const forceUpdateCommand = new UpdateCommand({ force: true });
      await forceUpdateCommand.execute(testDir);

      // Should detect Qoder as a legacy tool to upgrade (but not Claude)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('从旧版遗留文件中识别到以下工具')
      );

      // Qoder skills should be created
      const cursorSkillFile = path.join(testDir, '.qoder', 'skills', 'dwsp-explore', 'SKILL.md');
      expect(await FileSystemUtils.fileExists(cursorSkillFile)).toBe(true);

      // Should show "Getting started" for newly configured Qoder
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('开始使用')
      );

      consoleSpy.mockRestore();
    });

    it('should not show getting started message when no new tools configured', async () => {
      // Set up a configured tool (no legacy artifacts)
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), { recursive: true });
      await fs.writeFile(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md'),
        'old skill'
      );

      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      // Should NOT show "Getting started" message
      const calls = consoleSpy.mock.calls.map(call =>
        call.map(arg => String(arg)).join(' ')
      );
      const hasGettingStarted = calls.some(call =>
        call.includes('开始使用')
      );
      expect(hasGettingStarted).toBe(false);

      consoleSpy.mockRestore();
    });

    it('should create only effective profile skills when upgrading legacy tools', async () => {
      // Create legacy command directory
      await fs.mkdir(path.join(testDir, '.claude', 'commands', 'duowenspec'), { recursive: true });
      await fs.writeFile(
        path.join(testDir, '.claude', 'commands', 'duowenspec', 'proposal.md'),
        'content'
      );

      // Create update command with force option
      const forceUpdateCommand = new UpdateCommand({ force: true });
      await forceUpdateCommand.execute(testDir);

      // Default profile is core, so only core workflows should be generated.
      const skillNames = [
        'dwsp-propose',
        'dwsp-explore',
        'dwsp-apply-change',
        'dwsp-archive-change',
      ];

      const skillsDir = path.join(testDir, '.claude', 'skills');
      for (const skillName of skillNames) {
        const skillFile = path.join(skillsDir, skillName, 'SKILL.md');
        const exists = await FileSystemUtils.fileExists(skillFile);
        expect(exists).toBe(true);
      }

      const nonCoreSkill = path.join(skillsDir, 'dwsp-new-change', 'SKILL.md');
      expect(await FileSystemUtils.fileExists(nonCoreSkill)).toBe(false);
    });

    it('should create commands when upgrading legacy tools', async () => {
      // Create legacy command directory
      await fs.mkdir(path.join(testDir, '.claude', 'commands', 'duowenspec'), { recursive: true });
      await fs.writeFile(
        path.join(testDir, '.claude', 'commands', 'duowenspec', 'proposal.md'),
        'content'
      );

      // Create update command with force option
      const forceUpdateCommand = new UpdateCommand({ force: true });
      await forceUpdateCommand.execute(testDir);

      // New opsx commands should be created
      const commandsDir = path.join(testDir, '.claude', 'commands', 'dwsp');
      const exploreCmd = path.join(commandsDir, 'explore.md');
      const exists = await FileSystemUtils.fileExists(exploreCmd);
      expect(exists).toBe(true);
    });

    it('should not inject non-profile workflows when upgrading legacy tools', async () => {
      setMockConfig({
        featureFlags: {},
        profile: 'custom',
        delivery: 'both',
        workflows: ['explore'],
      });

      await fs.mkdir(path.join(testDir, '.claude', 'commands', 'duowenspec'), { recursive: true });
      await fs.writeFile(
        path.join(testDir, '.claude', 'commands', 'duowenspec', 'proposal.md'),
        'content'
      );

      const forceUpdateCommand = new UpdateCommand({ force: true });
      await forceUpdateCommand.execute(testDir);

      const skillsDir = path.join(testDir, '.claude', 'skills');
      expect(await FileSystemUtils.fileExists(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md')
      )).toBe(true);
      expect(await FileSystemUtils.fileExists(
        path.join(skillsDir, 'dwsp-propose', 'SKILL.md')
      )).toBe(false);

      const commandsDir = path.join(testDir, '.claude', 'commands', 'dwsp');
      expect(await FileSystemUtils.fileExists(
        path.join(commandsDir, 'explore.md')
      )).toBe(true);
      expect(await FileSystemUtils.fileExists(
        path.join(commandsDir, 'propose.md')
      )).toBe(false);
    });
  });

  describe('profile-aware updates', () => {
    it('should generate only profile workflows when custom profile is set', async () => {
      // Set custom profile with only explore and new
      setMockConfig({
        featureFlags: {},
        profile: 'custom',
        delivery: 'both',
        workflows: ['explore', 'new'],
      });

      // Set up a configured tool
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), { recursive: true });
      await fs.writeFile(path.join(skillsDir, 'dwsp-explore', 'SKILL.md'), 'old');

      await updateCommand.execute(testDir);

      // Should create explore and new skills
      expect(await FileSystemUtils.fileExists(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md')
      )).toBe(true);
      expect(await FileSystemUtils.fileExists(
        path.join(skillsDir, 'dwsp-new-change', 'SKILL.md')
      )).toBe(true);

      // Should NOT create non-profile skills
      expect(await FileSystemUtils.fileExists(
        path.join(skillsDir, 'dwsp-apply-change', 'SKILL.md')
      )).toBe(false);
      expect(await FileSystemUtils.fileExists(
        path.join(skillsDir, 'dwsp-propose', 'SKILL.md')
      )).toBe(false);
    });

    it('should respect skills-only delivery setting', async () => {
      setMockConfig({
        featureFlags: {},
        profile: 'core',
        delivery: 'skills',
      });

      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), { recursive: true });
      await fs.writeFile(path.join(skillsDir, 'dwsp-explore', 'SKILL.md'), 'old');

      await updateCommand.execute(testDir);

      // Skills should be created
      expect(await FileSystemUtils.fileExists(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md')
      )).toBe(true);

      // Commands should NOT be created
      const commandsDir = path.join(testDir, '.claude', 'commands', 'dwsp');
      expect(await FileSystemUtils.fileExists(
        path.join(commandsDir, 'explore.md')
      )).toBe(false);
    });

    it('should respect commands-only delivery setting', async () => {
      setMockConfig({
        featureFlags: {},
        profile: 'core',
        delivery: 'commands',
      });

      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), { recursive: true });
      await fs.writeFile(path.join(skillsDir, 'dwsp-explore', 'SKILL.md'), 'old');

      await updateCommand.execute(testDir);

      // Commands should be created
      const commandsDir = path.join(testDir, '.claude', 'commands', 'dwsp');
      expect(await FileSystemUtils.fileExists(
        path.join(commandsDir, 'explore.md')
      )).toBe(true);

      // Skills should be removed for commands-only delivery
      expect(await FileSystemUtils.fileExists(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md')
      )).toBe(false);
    });

    it('should remove skills for configured tools without command adapters in commands-only delivery', async () => {
      setMockConfig({
        featureFlags: {},
        profile: 'core',
        delivery: 'commands',
      });

      const { AI_TOOLS } = await import('../../src/core/config.js');
      const { CommandAdapterRegistry } = await import('../../src/core/command-generation/index.js');
      const adapterlessTool = AI_TOOLS.find((tool) => tool.skillsDir && !CommandAdapterRegistry.get(tool.value));
      expect(adapterlessTool).toBeDefined();
      if (!adapterlessTool?.skillsDir) {
        return;
      }

      const skillsDir = path.join(testDir, adapterlessTool.skillsDir, 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), { recursive: true });
      await fs.writeFile(path.join(skillsDir, 'dwsp-explore', 'SKILL.md'), 'old');

      await expect(updateCommand.execute(testDir)).resolves.toBeUndefined();

      expect(await FileSystemUtils.fileExists(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md')
      )).toBe(false);
    });

    it('should apply config sync when templates are up to date', async () => {
      setMockConfig({
        featureFlags: {},
        profile: 'core',
        delivery: 'skills',
      });

      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), { recursive: true });
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8')) as { version: string };
      await fs.writeFile(
        path.join(skillsDir, 'dwsp-explore', 'SKILL.md'),
        `---
name: dwsp-explore
metadata:
  generatedBy: "${packageJson.version}"
---
content
`
      );

      const commandsDir = path.join(testDir, '.claude', 'commands', 'dwsp');
      await fs.mkdir(commandsDir, { recursive: true });
      await fs.writeFile(path.join(commandsDir, 'explore.md'), 'old command');

      await updateCommand.execute(testDir);

      // Command files should be removed due to delivery change, even though skill version is current
      expect(await FileSystemUtils.fileExists(
        path.join(commandsDir, 'explore.md')
      )).toBe(false);
    });

    it('should detect commands-only tool configuration', async () => {
      setMockConfig({
        featureFlags: {},
        profile: 'core',
        delivery: 'commands',
      });

      const commandsDir = path.join(testDir, '.claude', 'commands', 'dwsp');
      await fs.mkdir(commandsDir, { recursive: true });
      await fs.writeFile(path.join(commandsDir, 'explore.md'), 'existing command');

      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      // Should not short-circuit with "No configured tools found"
      const calls = consoleSpy.mock.calls.map(call =>
        call.map(arg => String(arg)).join(' ')
      );
      const hasNoConfiguredMessage = calls.some(call =>
        call.includes('未找到已配置的工具')
      );
      expect(hasNoConfiguredMessage).toBe(false);

      // Commands should be updated/generated for the core profile
      expect(await FileSystemUtils.fileExists(
        path.join(commandsDir, 'propose.md')
      )).toBe(true);

      consoleSpy.mockRestore();
    });

    it('should remove workflows outside profile during update sync', async () => {
      // Set core profile (propose, explore, apply, archive)
      setMockConfig({
        featureFlags: {},
        profile: 'core',
        delivery: 'both',
      });

      // Set up tool with extra workflows beyond core profile
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), { recursive: true });
      await fs.writeFile(path.join(skillsDir, 'dwsp-explore', 'SKILL.md'), 'old');

      // Add a non-core workflow
      await fs.mkdir(path.join(skillsDir, 'dwsp-new-change'), { recursive: true });
      await fs.writeFile(path.join(skillsDir, 'dwsp-new-change', 'SKILL.md'), 'old');
      const extraCommandFile = path.join(testDir, '.claude', 'commands', 'dwsp', 'new.md');
      await fs.mkdir(path.dirname(extraCommandFile), { recursive: true });
      await fs.writeFile(extraCommandFile, 'old');

      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      // Deselected workflow artifacts should be removed for both delivery surfaces.
      expect(await FileSystemUtils.fileExists(
        path.join(skillsDir, 'dwsp-new-change', 'SKILL.md')
      )).toBe(false);
      expect(await FileSystemUtils.fileExists(extraCommandFile)).toBe(false);

      // Should report deselected workflow cleanup.
      const calls = consoleSpy.mock.calls.map(call =>
        call.map(arg => String(arg)).join(' ')
      );
      const hasDeselectedRemovalNote = calls.some(call =>
        call.includes('未选中的')
      );
      expect(hasDeselectedRemovalNote).toBe(true);

      consoleSpy.mockRestore();
    });
  });

  describe('new tool detection', () => {
    it('should detect new tool directories not currently configured', async () => {
      // Set up a configured Claude tool
      const claudeSkillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(claudeSkillsDir, 'dwsp-explore'), { recursive: true });
      await fs.writeFile(path.join(claudeSkillsDir, 'dwsp-explore', 'SKILL.md'), 'old');

      // Create a Qoder directory (not configured — no skills)
      await fs.mkdir(path.join(testDir, '.qoder'), { recursive: true });

      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      // Should detect Qoder as a new tool
      const calls = consoleSpy.mock.calls.map(call =>
        call.map(arg => String(arg)).join(' ')
      );
      const hasNewToolMessage = calls.some(call =>
        call.includes("检测到新的工具目录：Qoder。请运行 'dwsp init' 把它加入配置。")
      );
      expect(hasNewToolMessage).toBe(true);

      consoleSpy.mockRestore();
    });

    it('should consolidate multiple new tools into one message', async () => {
      // Set up a configured Claude tool
      const claudeSkillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(claudeSkillsDir, 'dwsp-explore'), { recursive: true });
      await fs.writeFile(path.join(claudeSkillsDir, 'dwsp-explore', 'SKILL.md'), 'old');

      // Create two unconfigured tool directories
      await fs.mkdir(path.join(testDir, '.trae'), { recursive: true });
      await fs.mkdir(path.join(testDir, '.opencode'), { recursive: true });

      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      const calls = consoleSpy.mock.calls.map(call =>
        call.map(arg => String(arg)).join(' ')
      );

      const consolidatedCalls = calls.filter(call =>
        call.includes('检测到新的工具目录：')
      );
      expect(consolidatedCalls).toHaveLength(1);
      expect(consolidatedCalls[0]).toContain('Trae');
      expect(consolidatedCalls[0]).toContain('OpenCode');
      expect(consolidatedCalls[0]).toContain("请运行 'dwsp init' 把它们加入配置。");

      consoleSpy.mockRestore();
    });

    it('should not show new tool message when no new tools detected', async () => {
      // Set up a configured tool (only Claude, no other tool directories)
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), { recursive: true });
      await fs.writeFile(path.join(skillsDir, 'dwsp-explore', 'SKILL.md'), 'old');

      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      const calls = consoleSpy.mock.calls.map(call =>
        call.map(arg => String(arg)).join(' ')
      );
      const hasNewToolMessage = calls.some(call =>
        call.includes('检测到新的工具目录')
      );
      expect(hasNewToolMessage).toBe(false);

      consoleSpy.mockRestore();
    });
  });

  describe('scanInstalledWorkflows', () => {
    it('should detect installed workflows across tools', async () => {
      // Create skills for Claude
      const claudeSkillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(claudeSkillsDir, 'dwsp-explore'), { recursive: true });
      await fs.writeFile(path.join(claudeSkillsDir, 'dwsp-explore', 'SKILL.md'), 'content');
      await fs.mkdir(path.join(claudeSkillsDir, 'dwsp-apply-change'), { recursive: true });
      await fs.writeFile(path.join(claudeSkillsDir, 'dwsp-apply-change', 'SKILL.md'), 'content');

      const workflows = scanInstalledWorkflows(testDir, ['claude']);
      expect(workflows).toContain('explore');
      expect(workflows).toContain('apply');
      expect(workflows).not.toContain('propose');
    });

    it('should return union of workflows across multiple tools', async () => {
      // Claude has explore
      const claudeSkillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(claudeSkillsDir, 'dwsp-explore'), { recursive: true });
      await fs.writeFile(path.join(claudeSkillsDir, 'dwsp-explore', 'SKILL.md'), 'content');

      // Qoder has apply
      const cursorSkillsDir = path.join(testDir, '.qoder', 'skills');
      await fs.mkdir(path.join(cursorSkillsDir, 'dwsp-apply-change'), { recursive: true });
      await fs.writeFile(path.join(cursorSkillsDir, 'dwsp-apply-change', 'SKILL.md'), 'content');

      const workflows = scanInstalledWorkflows(testDir, ['claude', 'qoder']);
      expect(workflows).toContain('explore');
      expect(workflows).toContain('apply');
    });

    it('should only match workflows in ALL_WORKFLOWS', async () => {
      // Create a custom skill directory that doesn't match any workflow
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'my-custom-skill'), { recursive: true });
      await fs.writeFile(path.join(skillsDir, 'my-custom-skill', 'SKILL.md'), 'content');

      const workflows = scanInstalledWorkflows(testDir, ['claude']);
      expect(workflows).toHaveLength(0);
    });

    it('should return empty array when no tools have skills', async () => {
      const workflows = scanInstalledWorkflows(testDir, ['claude']);
      expect(workflows).toHaveLength(0);
    });

    it('should detect installed workflows from managed command files', async () => {
      const commandsDir = path.join(testDir, '.claude', 'commands', 'dwsp');
      await fs.mkdir(commandsDir, { recursive: true });
      await fs.writeFile(path.join(commandsDir, 'explore.md'), 'content');

      const workflows = scanInstalledWorkflows(testDir, ['claude']);
      expect(workflows).toContain('explore');
    });
  });

  describe('tools output', () => {
    it('should list affected tools in output', async () => {
      const skillsDir = path.join(testDir, '.claude', 'skills');
      await fs.mkdir(path.join(skillsDir, 'dwsp-explore'), { recursive: true });
      await fs.writeFile(path.join(skillsDir, 'dwsp-explore', 'SKILL.md'), 'old');

      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      const calls = consoleSpy.mock.calls.map(call =>
        call.map(arg => String(arg)).join(' ')
      );
      const hasToolsList = calls.some(call =>
        call.includes('涉及工具：') && call.includes('Claude Code')
      );
      expect(hasToolsList).toBe(true);

      consoleSpy.mockRestore();
    });
  });

  describe('scaffold instruction files', () => {
    it.skipIf(process.platform === 'win32')('should create AGENTS.md and CLAUDE.md for modo scaffold projects during update', async () => {
      const agentsContent = '# 脚手架说明\n\n请默认使用中文。\n';
      process.env.DUOWENSPEC_MODO_SCAFFOLD_ASSET_ROOT = await createFakeModoAgentsAssetRoot(testDir, agentsContent);

      await fs.writeFile(path.join(testDir, '.b-end-adapter'), 'modo\n', 'utf-8');
      await fs.mkdir(path.join(testDir, '.claude', 'skills', 'dwsp-explore'), { recursive: true });
      await fs.writeFile(path.join(testDir, '.claude', 'skills', 'dwsp-explore', 'SKILL.md'), 'old');

      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      expect(await fs.readFile(path.join(testDir, 'AGENTS.md'), 'utf-8')).toBe(agentsContent);
      expect((await fs.lstat(path.join(testDir, 'CLAUDE.md'))).isSymbolicLink()).toBe(true);
      expect(await fs.readlink(path.join(testDir, 'CLAUDE.md'))).toBe('AGENTS.md');
      expect(await FileSystemUtils.fileExists(path.join(testDir, '.claude', 'skills', 'dwsp-b-end-delivery', 'SKILL.md'))).toBe(true);
      expect(await FileSystemUtils.fileExists(path.join(testDir, '.claude', 'skills', 'dwsp-b-end-components', 'SKILL.md'))).toBe(true);
      expect(await FileSystemUtils.fileExists(path.join(testDir, '.claude', 'skills', 'dwsp-b-end-review', 'SKILL.md'))).toBe(true);

      const calls = consoleSpy.mock.calls.flat().map(String);
      expect(calls.some((entry) => entry.includes('脚手架说明文件：已创建 AGENTS.md，并建立 CLAUDE.md 软链'))).toBe(true);

      consoleSpy.mockRestore();
    });

    it('should preserve existing AGENTS.md for modo scaffold projects during update', async () => {
      process.env.DUOWENSPEC_MODO_SCAFFOLD_ASSET_ROOT = await createFakeModoAgentsAssetRoot(testDir, '# 新模板\n');

      await fs.writeFile(path.join(testDir, '.b-end-adapter'), 'modo\n', 'utf-8');
      await fs.writeFile(path.join(testDir, 'AGENTS.md'), '# 旧说明\n', 'utf-8');
      await fs.mkdir(path.join(testDir, '.claude', 'skills', 'dwsp-explore'), { recursive: true });
      await fs.writeFile(path.join(testDir, '.claude', 'skills', 'dwsp-explore', 'SKILL.md'), 'old');

      const consoleSpy = vi.spyOn(console, 'log');

      await updateCommand.execute(testDir);

      expect(await fs.readFile(path.join(testDir, 'AGENTS.md'), 'utf-8')).toBe('# 旧说明\n');
      await expect(fs.lstat(path.join(testDir, 'CLAUDE.md'))).rejects.toMatchObject({ code: 'ENOENT' });

      const calls = consoleSpy.mock.calls.flat().map(String);
      expect(calls.some((entry) => entry.includes('脚手架说明文件：已创建 AGENTS.md，并建立 CLAUDE.md 软链'))).toBe(false);

      consoleSpy.mockRestore();
    });
  });
});

async function createFakeModoAgentsAssetRoot(baseDir: string, agentsContent: string): Promise<string> {
  const root = path.join(baseDir, '__modo-scaffold-assets');
  await fs.mkdir(root, { recursive: true });
  await fs.writeFile(path.join(root, 'AGENTS.md'), agentsContent, 'utf-8');
  return root;
}
