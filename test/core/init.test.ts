import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { InitCommand } from '../../src/core/init.js';
import { saveGlobalConfig, getGlobalConfig } from '../../src/core/global-config.js';
import {
  ENTERPRISE_ALLOW_MISSING_CAPABILITIES,
  ENTERPRISE_EXCEPTIONS_HEADER,
} from '../../src/core/enterprise-capability-preflight.js';

const { confirmMock, showWelcomeScreenMock, searchableMultiSelectMock } = vi.hoisted(() => ({
  confirmMock: vi.fn(),
  showWelcomeScreenMock: vi.fn().mockResolvedValue(undefined),
  searchableMultiSelectMock: vi.fn(),
}));

vi.mock('@inquirer/prompts', () => ({
  confirm: confirmMock,
}));

vi.mock('../../src/ui/welcome-screen.js', () => ({
  showWelcomeScreen: showWelcomeScreenMock,
}));

vi.mock('../../src/prompts/searchable-multi-select.js', () => ({
  searchableMultiSelect: searchableMultiSelectMock,
}));

describe('InitCommand', () => {
  let testDir: string;
  let configTempDir: string;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(async () => {
    testDir = path.join(os.tmpdir(), `openspec-init-test-${Date.now()}`);
    await fs.mkdir(testDir, { recursive: true });
    originalEnv = { ...process.env };
    // Use a temp dir for global config to avoid reading real config
    configTempDir = path.join(os.tmpdir(), `openspec-config-init-${Date.now()}`);
    await fs.mkdir(configTempDir, { recursive: true });
    process.env.XDG_CONFIG_HOME = configTempDir;
    await writeEnterpriseException(testDir);

    // Mock console.log to suppress output during tests
    vi.spyOn(console, 'log').mockImplementation(() => { });
    confirmMock.mockReset();
    confirmMock.mockResolvedValue(true);
    showWelcomeScreenMock.mockClear();
    searchableMultiSelectMock.mockReset();
  });

  afterEach(async () => {
    process.env = originalEnv;
    await fs.rm(testDir, { recursive: true, force: true });
    await fs.rm(configTempDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  describe('execute with --tools flag', () => {
    it('should create DuowenSpec directory structure', async () => {
      const initCommand = new InitCommand({ tools: 'claude', force: true });

      await initCommand.execute(testDir);

      const openspecPath = path.join(testDir, 'openspec');
      expect(await directoryExists(openspecPath)).toBe(true);
      expect(await directoryExists(path.join(openspecPath, 'specs'))).toBe(true);
      expect(await directoryExists(path.join(openspecPath, 'changes'))).toBe(true);
      expect(await directoryExists(path.join(openspecPath, 'changes', 'archive'))).toBe(true);
    });

    it('should create config.yaml with default schema', async () => {
      const initCommand = new InitCommand({ tools: 'claude', force: true });

      await initCommand.execute(testDir);

      const configPath = path.join(testDir, 'openspec', 'config.yaml');
      expect(await fileExists(configPath)).toBe(true);

      const content = await fs.readFile(configPath, 'utf-8');
      expect(content).toContain('schema: spec-driven');
    });

    it('should create enterprise-default skills for Claude Code by default', async () => {
      const initCommand = new InitCommand({ tools: 'claude', force: true });

      await initCommand.execute(testDir);

      const defaultSkillNames = [
        'openspec-propose',
        'openspec-explore',
        'openspec-apply-change',
        'openspec-review-change',
        'openspec-verify-change',
        'openspec-document-change',
        'openspec-archive-change',
      ];

      for (const skillName of defaultSkillNames) {
        const skillFile = path.join(testDir, '.claude', 'skills', skillName, 'SKILL.md');
        expect(await fileExists(skillFile)).toBe(true);

        const content = await fs.readFile(skillFile, 'utf-8');
        expect(content).toContain('---');
        expect(content).toContain('name:');
        expect(content).toContain('description:');
      }

      const nonDefaultSkillNames = [
        'openspec-new-change',
        'openspec-continue-change',
        'openspec-ff-change',
        'openspec-sync-specs',
        'openspec-bulk-archive-change',
      ];

      for (const skillName of nonDefaultSkillNames) {
        const skillFile = path.join(testDir, '.claude', 'skills', skillName, 'SKILL.md');
        expect(await fileExists(skillFile)).toBe(false);
      }
    });

    it('should create enterprise-default commands for Claude Code by default', async () => {
      const initCommand = new InitCommand({ tools: 'claude', force: true });

      await initCommand.execute(testDir);

      const defaultCommandNames = [
        'dwsp/propose.md',
        'dwsp/explore.md',
        'dwsp/apply.md',
        'dwsp/review.md',
        'dwsp/verify.md',
        'dwsp/document.md',
        'dwsp/archive.md',
      ];

      for (const cmdName of defaultCommandNames) {
        const cmdFile = path.join(testDir, '.claude', 'commands', cmdName);
        expect(await fileExists(cmdFile)).toBe(true);
      }

      const nonDefaultCommandNames = [
        'dwsp/new.md',
        'dwsp/continue.md',
        'dwsp/ff.md',
        'dwsp/sync.md',
        'dwsp/bulk-archive.md',
      ];

      for (const cmdName of nonDefaultCommandNames) {
        const cmdFile = path.join(testDir, '.claude', 'commands', cmdName);
        expect(await fileExists(cmdFile)).toBe(false);
      }
    });

    it('should create skills in OpenCode skills directory', async () => {
      const initCommand = new InitCommand({ tools: 'opencode', force: true });

      await initCommand.execute(testDir);

      const skillFile = path.join(testDir, '.opencode', 'skills', 'openspec-explore', 'SKILL.md');
      expect(await fileExists(skillFile)).toBe(true);
    });

    it('should create skills in CodeBuddy skills directory', async () => {
      const initCommand = new InitCommand({ tools: 'codebuddy', force: true });

      await initCommand.execute(testDir);

      const skillFile = path.join(testDir, '.codebuddy', 'skills', 'openspec-explore', 'SKILL.md');
      expect(await fileExists(skillFile)).toBe(true);
    });

    it('should create skills for multiple tools at once', async () => {
      const initCommand = new InitCommand({ tools: 'claude,opencode', force: true });

      await initCommand.execute(testDir);

      const claudeSkill = path.join(testDir, '.claude', 'skills', 'openspec-explore', 'SKILL.md');
      const opencodeSkill = path.join(testDir, '.opencode', 'skills', 'openspec-explore', 'SKILL.md');

      expect(await fileExists(claudeSkill)).toBe(true);
      expect(await fileExists(opencodeSkill)).toBe(true);
    });

    it('should select all tools with --tools all option', async () => {
      const initCommand = new InitCommand({ tools: 'all', force: true });

      await initCommand.execute(testDir);

      // Check a few representative tools
      const claudeSkill = path.join(testDir, '.claude', 'skills', 'openspec-explore', 'SKILL.md');
      const opencodeSkill = path.join(testDir, '.opencode', 'skills', 'openspec-explore', 'SKILL.md');
      const codebuddySkill = path.join(testDir, '.codebuddy', 'skills', 'openspec-explore', 'SKILL.md');

      expect(await fileExists(claudeSkill)).toBe(true);
      expect(await fileExists(opencodeSkill)).toBe(true);
      expect(await fileExists(codebuddySkill)).toBe(true);
    });

    it('should skip tool configuration with --tools none option', async () => {
      const initCommand = new InitCommand({ tools: 'none', force: true });

      await initCommand.execute(testDir);

      // Should create DuowenSpec structure but no skills
      const openspecPath = path.join(testDir, 'openspec');
      expect(await directoryExists(openspecPath)).toBe(true);

      // No tool-specific directories should be created
      const claudeSkillsDir = path.join(testDir, '.claude', 'skills');
      expect(await directoryExists(claudeSkillsDir)).toBe(false);
    });

    it('should throw error for invalid tool names', async () => {
      const initCommand = new InitCommand({ tools: 'invalid-tool', force: true });

      await expect(initCommand.execute(testDir)).rejects.toThrow(/Invalid tool\(s\): invalid-tool/);
    });

    it('should handle comma-separated tool names with spaces', async () => {
      const initCommand = new InitCommand({ tools: 'claude, opencode', force: true });

      await initCommand.execute(testDir);

      const claudeSkill = path.join(testDir, '.claude', 'skills', 'openspec-explore', 'SKILL.md');
      const opencodeSkill = path.join(testDir, '.opencode', 'skills', 'openspec-explore', 'SKILL.md');

      expect(await fileExists(claudeSkill)).toBe(true);
      expect(await fileExists(opencodeSkill)).toBe(true);
    });

    it('should reject combining reserved keywords with explicit tool ids', async () => {
      const initCommand = new InitCommand({ tools: 'all,claude', force: true });

      await expect(initCommand.execute(testDir)).rejects.toThrow(
        /Cannot combine reserved values "all" or "none" with specific tool IDs/
      );
    });

    it('should not create config.yaml if it already exists', async () => {
      // Pre-create config.yaml
      const openspecDir = path.join(testDir, 'openspec');
      await fs.mkdir(openspecDir, { recursive: true });
      const configPath = path.join(openspecDir, 'config.yaml');
      const existingContent = 'schema: custom-schema\n';
      await fs.writeFile(configPath, existingContent);

      const initCommand = new InitCommand({ tools: 'claude', force: true });
      await initCommand.execute(testDir);

      const content = await fs.readFile(configPath, 'utf-8');
      expect(content).toBe(existingContent);
    });

    it('should handle non-existent target directory', async () => {
      const newDir = path.join(testDir, 'new-project');
      await writeEnterpriseException(newDir);
      const initCommand = new InitCommand({ tools: 'claude', force: true });

      await initCommand.execute(newDir);

      const openspecPath = path.join(newDir, 'openspec');
      expect(await directoryExists(openspecPath)).toBe(true);
    });

    it('should ignore unsupported scaffold option on the direct command class', async () => {
      await fs.rm(path.join(testDir, 'AGENTS.md'), { force: true });

      const initCommand = new InitCommand({
        tools: 'none',
        force: true,
        scaffold: true,
      } as any);
      await initCommand.execute(testDir);

      expect(await fileExists(path.join(testDir, 'openspec', 'config.yaml'))).toBe(true);
      expect(await fileExists(path.join(testDir, 'package.json'))).toBe(false);
      expect(await fileExists(path.join(testDir, 'CLAUDE.md'))).toBe(false);
    });

    it('should preserve AGENTS.md when unsupported scaffold option is ignored', async () => {
      await fs.writeFile(path.join(testDir, 'AGENTS.md'), '# Existing\n');

      const initCommand = new InitCommand({
        tools: 'none',
        force: true,
        scaffold: true,
      } as any);
      await initCommand.execute(testDir);

      expect(await fileExists(path.join(testDir, 'AGENTS.md'))).toBe(true);
      expect(await fileExists(path.join(testDir, 'CLAUDE.md'))).toBe(false);
      expect(await fileExists(path.join(testDir, 'openspec', 'config.yaml'))).toBe(true);
    });

    it('should work in extend mode (re-running init)', async () => {
      const initCommand1 = new InitCommand({ tools: 'claude', force: true });
      await initCommand1.execute(testDir);

      // Run init again with a different tool
      const initCommand2 = new InitCommand({ tools: 'opencode', force: true });
      await initCommand2.execute(testDir);

      // Both tools should have skills
      const claudeSkill = path.join(testDir, '.claude', 'skills', 'openspec-explore', 'SKILL.md');
      const opencodeSkill = path.join(testDir, '.opencode', 'skills', 'openspec-explore', 'SKILL.md');

      expect(await fileExists(claudeSkill)).toBe(true);
      expect(await fileExists(opencodeSkill)).toBe(true);
    });

    it('should refresh skills on re-run for the same tool', async () => {
      const initCommand1 = new InitCommand({ tools: 'claude', force: true });
      await initCommand1.execute(testDir);

      const skillFile = path.join(testDir, '.claude', 'skills', 'openspec-explore', 'SKILL.md');
      const originalContent = await fs.readFile(skillFile, 'utf-8');

      // Modify the file
      await fs.writeFile(skillFile, '# Modified content\n');

      // Run init again
      const initCommand2 = new InitCommand({ tools: 'claude', force: true });
      await initCommand2.execute(testDir);

      const newContent = await fs.readFile(skillFile, 'utf-8');
      expect(newContent).toBe(originalContent);
    });
  });

  describe('skill content validation', () => {
    it('should generate valid SKILL.md with YAML frontmatter', async () => {
      const initCommand = new InitCommand({ tools: 'claude', force: true });
      await initCommand.execute(testDir);

      const skillFile = path.join(testDir, '.claude', 'skills', 'openspec-explore', 'SKILL.md');
      const content = await fs.readFile(skillFile, 'utf-8');

      // Should have YAML frontmatter
      expect(content).toMatch(/^---\n/);
      expect(content).toContain('name: openspec-explore');
      expect(content).toContain('description:');
      expect(content).toContain('license:');
      expect(content).toContain('compatibility:');
      expect(content).toContain('metadata:');
      expect(content).toMatch(/---\n\n/); // End of frontmatter
    });

    it('should include explore mode instructions', async () => {
      const initCommand = new InitCommand({ tools: 'claude', force: true });
      await initCommand.execute(testDir);

      const skillFile = path.join(testDir, '.claude', 'skills', 'openspec-explore', 'SKILL.md');
      const content = await fs.readFile(skillFile, 'utf-8');

      expect(content).toContain('Enter explore mode');
      expect(content).toContain('thinking partner');
    });

    it('should include propose skill instructions', async () => {
      const initCommand = new InitCommand({ tools: 'claude', force: true });
      await initCommand.execute(testDir);

      const skillFile = path.join(testDir, '.claude', 'skills', 'openspec-propose', 'SKILL.md');
      const content = await fs.readFile(skillFile, 'utf-8');

      expect(content).toContain('name: openspec-propose');
    });

    it('should include apply-change skill instructions', async () => {
      const initCommand = new InitCommand({ tools: 'claude', force: true });
      await initCommand.execute(testDir);

      const skillFile = path.join(testDir, '.claude', 'skills', 'openspec-apply-change', 'SKILL.md');
      const content = await fs.readFile(skillFile, 'utf-8');

      expect(content).toContain('name: openspec-apply-change');
    });

    it('should embed generatedBy version in skill files', async () => {
      const initCommand = new InitCommand({ tools: 'claude', force: true });
      await initCommand.execute(testDir);

      const skillFile = path.join(testDir, '.claude', 'skills', 'openspec-explore', 'SKILL.md');
      const content = await fs.readFile(skillFile, 'utf-8');

      // Should contain generatedBy field with a version string
      expect(content).toMatch(/generatedBy:\s*["']?\d+\.\d+\.\d+["']?/);
    });
  });

  describe('command generation', () => {
    it('should generate Claude Code commands with correct format', async () => {
      const initCommand = new InitCommand({ tools: 'claude', force: true });
      await initCommand.execute(testDir);

      const cmdFile = path.join(testDir, '.claude', 'commands', 'dwsp', 'explore.md');
      const content = await fs.readFile(cmdFile, 'utf-8');

      // Claude commands use YAML frontmatter
      expect(content).toMatch(/^---\n/);
      expect(content).toContain('name:');
      expect(content).toContain('description:');
    });

    it('should generate OpenCode commands with correct format', async () => {
      const initCommand = new InitCommand({ tools: 'opencode', force: true });
      await initCommand.execute(testDir);

      const cmdFile = path.join(testDir, '.opencode', 'commands', 'dwsp-explore.md');
      expect(await fileExists(cmdFile)).toBe(true);

      const content = await fs.readFile(cmdFile, 'utf-8');
      expect(content).toMatch(/^---\n/);
    });
  });

  describe('error handling', () => {
    it('should provide helpful error for insufficient permissions', async () => {
      // Mock the permission check to fail
      const readOnlyDir = path.join(testDir, 'readonly');
      await fs.mkdir(readOnlyDir);

      const originalWriteFile = fs.writeFile;
      vi.spyOn(fs, 'writeFile').mockImplementation(
        async (filePath: any, ...args: any[]) => {
          if (
            typeof filePath === 'string' &&
            filePath.includes('.openspec-test-')
          ) {
            throw new Error('EACCES: permission denied');
          }
          return originalWriteFile.call(fs, filePath, ...args);
        }
      );

      const initCommand = new InitCommand({ tools: 'claude', force: true });
      await expect(initCommand.execute(readOnlyDir)).rejects.toThrow(/Insufficient permissions/);
    });

    it('should throw error in non-interactive mode without --tools flag and no detected tools', async () => {
      const initCommand = new InitCommand({ interactive: false });

      await expect(initCommand.execute(testDir)).rejects.toThrow(/No tools detected and no --tools flag/);
    });
  });

  describe('tool-specific adapters', () => {
    it('should generate CodeBuddy commands', async () => {
      const initCommand = new InitCommand({ tools: 'codebuddy', force: true });
      await initCommand.execute(testDir);

      const cmdFile = path.join(testDir, '.codebuddy', 'commands', 'dwsp', 'explore.md');
      expect(await fileExists(cmdFile)).toBe(true);

      const content = await fs.readFile(cmdFile, 'utf-8');
      expect(content).toContain('argument-hint:');
    });

    it('should generate Qoder command files', async () => {
      const initCommand = new InitCommand({ tools: 'qoder', force: true });
      await initCommand.execute(testDir);

      const cmdFile = path.join(testDir, '.qoder', 'commands', 'dwsp', 'explore.md');
      expect(await fileExists(cmdFile)).toBe(true);

      const content = await fs.readFile(cmdFile, 'utf-8');
      expect(content).toContain('name: DWSP: Explore');
      expect(content).toContain('category:');
    });

    it('should generate Codex prompts under CODEX_HOME', async () => {
      const codexHome = path.join(testDir, '.codex-home-prompts');
      process.env.CODEX_HOME = codexHome;

      const initCommand = new InitCommand({ tools: 'codex', force: true });
      await initCommand.execute(testDir);

      const cmdFile = path.join(codexHome, 'prompts', 'dwsp-explore.md');
      expect(await fileExists(cmdFile)).toBe(true);

      const content = await fs.readFile(cmdFile, 'utf-8');
      expect(content).toContain('argument-hint:');
    });

    it('should create Trae skills but skip command generation', async () => {
      const consoleSpy = vi.spyOn(console, 'log');

      const initCommand = new InitCommand({ tools: 'trae', force: true });
      await initCommand.execute(testDir);

      const skillFile = path.join(testDir, '.trae', 'skills', 'openspec-explore', 'SKILL.md');
      expect(await fileExists(skillFile)).toBe(true);

      const commandFile = path.join(testDir, '.trae', 'commands', 'dwsp', 'explore.md');
      expect(await fileExists(commandFile)).toBe(false);

      const allCalls = consoleSpy.mock.calls.map(call =>
        call.map(arg => String(arg)).join(' ')
      );
      const hasSkipMessage = allCalls.some(call =>
        call.includes('trae') && (call.includes('跳过') || call.includes('skipped'))
      );
      expect(hasSkipMessage).toBe(true);

      consoleSpy.mockRestore();
    });
  });
});

describe('InitCommand - profile and detection features', () => {
  let testDir: string;
  let configTempDir: string;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(async () => {
    testDir = path.join(os.tmpdir(), `openspec-init-profile-test-${Date.now()}`);
    await fs.mkdir(testDir, { recursive: true });
    originalEnv = { ...process.env };
    // Use a temp dir for global config to avoid polluting real config
    configTempDir = path.join(os.tmpdir(), `openspec-config-test-${Date.now()}`);
    await fs.mkdir(configTempDir, { recursive: true });
    process.env.XDG_CONFIG_HOME = configTempDir;
    await writeEnterpriseException(testDir);
    vi.spyOn(console, 'log').mockImplementation(() => {});
    confirmMock.mockReset();
    confirmMock.mockResolvedValue(true);
    showWelcomeScreenMock.mockClear();
    searchableMultiSelectMock.mockReset();
  });

  afterEach(async () => {
    process.env = originalEnv;
    await fs.rm(testDir, { recursive: true, force: true });
    await fs.rm(configTempDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it('should use --profile flag to override global config', async () => {
    // Set global config to custom profile
    saveGlobalConfig({
      featureFlags: {},
      profile: 'custom',
      delivery: 'both',
      workflows: ['explore', 'new', 'apply'],
    });

    // Override with --profile core
    const initCommand = new InitCommand({ tools: 'claude', force: true, profile: 'core' });
    await initCommand.execute(testDir);

    // Core profile skills should be created
    const proposeSkill = path.join(testDir, '.claude', 'skills', 'openspec-propose', 'SKILL.md');
    expect(await fileExists(proposeSkill)).toBe(true);

    // Non-core skills (from the custom profile) should NOT be created
    const newChangeSkill = path.join(testDir, '.claude', 'skills', 'openspec-new-change', 'SKILL.md');
    expect(await fileExists(newChangeSkill)).toBe(false);
  });

  it('should reject invalid --profile values', async () => {
    const initCommand = new InitCommand({
      tools: 'claude',
      force: true,
      profile: 'invalid-profile',
    });

    await expect(initCommand.execute(testDir)).rejects.toThrow(
      /Invalid profile "invalid-profile"/
    );
  });

  it('should use detected tools in non-interactive mode when no --tools flag', async () => {
    // Create a .claude directory to simulate detected tool
    await fs.mkdir(path.join(testDir, '.claude'), { recursive: true });

    const initCommand = new InitCommand({ interactive: false, force: true });
    await initCommand.execute(testDir);

    // Should have used claude (detected)
    const skillFile = path.join(testDir, '.claude', 'skills', 'openspec-explore', 'SKILL.md');
    expect(await fileExists(skillFile)).toBe(true);
  });

  it('should auto-cleanup legacy artifacts in non-interactive mode without --force', async () => {
    // Create legacy OpenCode command files (singular 'command' path)
    const legacyDir = path.join(testDir, '.opencode', 'command');
    await fs.mkdir(legacyDir, { recursive: true });
    await fs.writeFile(path.join(legacyDir, 'opsx-propose.md'), 'legacy content');

    // Run init in non-interactive mode without --force
    const initCommand = new InitCommand({ tools: 'opencode' });
    await initCommand.execute(testDir);

    // Legacy files should be cleaned up automatically
    expect(await fileExists(path.join(legacyDir, 'opsx-propose.md'))).toBe(false);

    // New commands should be at the correct plural path
    const newCommandsDir = path.join(testDir, '.opencode', 'commands');
    expect(await directoryExists(newCommandsDir)).toBe(true);
  });

  it('should preselect configured tools but not directory-detected tools in extend mode', async () => {
    // Simulate existing DuowenSpec project (extend mode).
    await fs.mkdir(path.join(testDir, 'openspec'), { recursive: true });

    // Configured with DuowenSpec
    const claudeSkillDir = path.join(testDir, '.claude', 'skills', 'openspec-explore');
    await fs.mkdir(claudeSkillDir, { recursive: true });
    await fs.writeFile(path.join(claudeSkillDir, 'SKILL.md'), 'configured');

    // Directory detected only (not configured with DuowenSpec)
    await fs.mkdir(path.join(testDir, '.qoder'), { recursive: true });

    searchableMultiSelectMock.mockResolvedValue(['claude']);

    const initCommand = new InitCommand({ force: true });
    vi.spyOn(initCommand as any, 'canPromptInteractively').mockReturnValue(true);

    await initCommand.execute(testDir);

    expect(searchableMultiSelectMock).toHaveBeenCalledTimes(1);
    const [{ choices }] = searchableMultiSelectMock.mock.calls[0] as [{ choices: Array<{ value: string; preSelected?: boolean; detected?: boolean }> }];

    const claude = choices.find((choice) => choice.value === 'claude');
    const qoder = choices.find((choice) => choice.value === 'qoder');

    expect(claude?.preSelected).toBe(true);
    expect(qoder?.preSelected).toBe(false);
    expect(qoder?.detected).toBe(true);
  });

  it('should preselect detected tools for first-time interactive setup', async () => {
    // First-time init: no openspec/ directory and no configured DuowenSpec skills.
    await fs.mkdir(path.join(testDir, '.qoder'), { recursive: true });

    searchableMultiSelectMock.mockResolvedValue(['qoder']);

    const initCommand = new InitCommand({ force: true });
    vi.spyOn(initCommand as any, 'canPromptInteractively').mockReturnValue(true);

    await initCommand.execute(testDir);

    expect(searchableMultiSelectMock).toHaveBeenCalledTimes(1);
    const [{ choices }] = searchableMultiSelectMock.mock.calls[0] as [{ choices: Array<{ value: string; preSelected?: boolean }> }];
    const qoder = choices.find((choice) => choice.value === 'qoder');

    expect(qoder?.preSelected).toBe(true);
  });

  it('should respect custom profile from global config', async () => {
    saveGlobalConfig({
      featureFlags: {},
      profile: 'custom',
      delivery: 'both',
      workflows: ['explore', 'new'],
    });

    const initCommand = new InitCommand({ tools: 'claude', force: true });
    await initCommand.execute(testDir);

    // Custom profile skills should be created
    const exploreSkill = path.join(testDir, '.claude', 'skills', 'openspec-explore', 'SKILL.md');
    const newChangeSkill = path.join(testDir, '.claude', 'skills', 'openspec-new-change', 'SKILL.md');
    expect(await fileExists(exploreSkill)).toBe(true);
    expect(await fileExists(newChangeSkill)).toBe(true);

    // Non-selected skills should NOT be created
    const proposeSkill = path.join(testDir, '.claude', 'skills', 'openspec-propose', 'SKILL.md');
    expect(await fileExists(proposeSkill)).toBe(false);
  });

  it('should migrate commands-only extend mode to custom profile without injecting propose', async () => {
    await fs.mkdir(path.join(testDir, 'openspec'), { recursive: true });
    await fs.mkdir(path.join(testDir, '.claude', 'commands', 'dwsp'), { recursive: true });
    await fs.writeFile(path.join(testDir, '.claude', 'commands', 'dwsp', 'explore.md'), '# explore\n');

    const initCommand = new InitCommand({ tools: 'claude', force: true });
    await initCommand.execute(testDir);

    const config = getGlobalConfig();
    expect(config.profile).toBe('custom');
    expect(config.delivery).toBe('commands');
    expect(config.workflows).toEqual(['explore']);

    const exploreCommand = path.join(testDir, '.claude', 'commands', 'dwsp', 'explore.md');
    const proposeCommand = path.join(testDir, '.claude', 'commands', 'dwsp', 'propose.md');
    expect(await fileExists(exploreCommand)).toBe(true);
    expect(await fileExists(proposeCommand)).toBe(false);

    const exploreSkill = path.join(testDir, '.claude', 'skills', 'openspec-explore', 'SKILL.md');
    const proposeSkill = path.join(testDir, '.claude', 'skills', 'openspec-propose', 'SKILL.md');
    expect(await fileExists(exploreSkill)).toBe(false);
    expect(await fileExists(proposeSkill)).toBe(false);
  });

  it('should not prompt for confirmation when applying custom profile in interactive init', async () => {
    saveGlobalConfig({
      featureFlags: {},
      profile: 'custom',
      delivery: 'both',
      workflows: ['explore', 'new'],
    });

    const initCommand = new InitCommand({ force: true });
    vi.spyOn(initCommand as any, 'canPromptInteractively').mockReturnValue(true);
    vi.spyOn(initCommand as any, 'getSelectedTools').mockResolvedValue(['claude']);

    await initCommand.execute(testDir);

    expect(showWelcomeScreenMock).toHaveBeenCalled();
    expect(confirmMock).not.toHaveBeenCalled();

    const exploreSkill = path.join(testDir, '.claude', 'skills', 'openspec-explore', 'SKILL.md');
    const newChangeSkill = path.join(testDir, '.claude', 'skills', 'openspec-new-change', 'SKILL.md');
    expect(await fileExists(exploreSkill)).toBe(true);
    expect(await fileExists(newChangeSkill)).toBe(true);

    const logCalls = (console.log as unknown as { mock: { calls: unknown[][] } }).mock.calls.flat().map(String);
    expect(logCalls.some((entry) => entry.includes('Applying custom profile'))).toBe(false);
  });

  it('should respect delivery=skills setting (no commands)', async () => {
    saveGlobalConfig({
      featureFlags: {},
      profile: 'custom',
      delivery: 'skills',
      workflows: ['propose', 'explore', 'apply', 'review', 'verify', 'document', 'archive'],
    });

    const initCommand = new InitCommand({ tools: 'claude', force: true });
    await initCommand.execute(testDir);

    // Skills should exist
    const skillFile = path.join(testDir, '.claude', 'skills', 'openspec-explore', 'SKILL.md');
    expect(await fileExists(skillFile)).toBe(true);

    // Commands should NOT exist
    const cmdFile = path.join(testDir, '.claude', 'commands', 'dwsp', 'explore.md');
    expect(await fileExists(cmdFile)).toBe(false);
  });

  it('should respect delivery=commands setting (no workflow skills)', async () => {
    saveGlobalConfig({
      featureFlags: {},
      profile: 'custom',
      delivery: 'commands',
      workflows: ['propose', 'explore', 'apply', 'review', 'verify', 'document', 'archive'],
    });

    const initCommand = new InitCommand({ tools: 'claude', force: true });
    await initCommand.execute(testDir);

    // Workflow skills should NOT exist
    const workflowSkillFile = path.join(testDir, '.claude', 'skills', 'openspec-explore', 'SKILL.md');
    expect(await fileExists(workflowSkillFile)).toBe(false);

    // Bundled enterprise capability skills should still exist
    const capabilitySkillFile = path.join(testDir, '.claude', 'skills', 'executing-plans', 'SKILL.md');
    expect(await fileExists(capabilitySkillFile)).toBe(true);

    // Commands should exist
    const cmdFile = path.join(testDir, '.claude', 'commands', 'dwsp', 'explore.md');
    expect(await fileExists(cmdFile)).toBe(true);
  });

  it('should remove commands on re-init when delivery changes to skills', async () => {
    saveGlobalConfig({
      featureFlags: {},
      profile: 'custom',
      delivery: 'both',
      workflows: ['propose', 'explore', 'apply', 'review', 'verify', 'document', 'archive'],
    });

    const initCommand1 = new InitCommand({ tools: 'claude', force: true });
    await initCommand1.execute(testDir);

    const cmdFile = path.join(testDir, '.claude', 'commands', 'dwsp', 'explore.md');
    expect(await fileExists(cmdFile)).toBe(true);

    saveGlobalConfig({
      featureFlags: {},
      profile: 'custom',
      delivery: 'skills',
      workflows: ['propose', 'explore', 'apply', 'review', 'verify', 'document', 'archive'],
    });

    const initCommand2 = new InitCommand({ tools: 'claude', force: true });
    await initCommand2.execute(testDir);

    expect(await fileExists(cmdFile)).toBe(false);

    const skillFile = path.join(testDir, '.claude', 'skills', 'openspec-explore', 'SKILL.md');
    expect(await fileExists(skillFile)).toBe(true);
    expect(await fileExists(path.join(testDir, '.claude', 'skills', 'executing-plans', 'SKILL.md'))).toBe(true);
  });

  describe('bundled enterprise capability skills', () => {
    it('should initialize strict enterprise mode without requiring preinstalled external skills', async () => {
      await fs.rm(path.join(testDir, 'AGENTS.md'), { force: true });

      const initCommand = new InitCommand({ tools: 'claude', force: true });
      await initCommand.execute(testDir);

      const capabilitySkills = [
        'brainstorming',
        'executing-plans',
        'test-driven-development',
        'subagent-driven-development',
        'requesting-code-review',
        'receiving-code-review',
        'verification-before-completion',
      ];

      for (const skillName of capabilitySkills) {
        const skillFile = path.join(testDir, '.claude', 'skills', skillName, 'SKILL.md');
        expect(await fileExists(skillFile)).toBe(true);
      }
    });

    it('should still install bundled capability skills when delivery is commands-only', async () => {
      await fs.rm(path.join(testDir, 'AGENTS.md'), { force: true });
      saveGlobalConfig({
        featureFlags: {},
        profile: 'custom',
        delivery: 'commands',
        workflows: ['propose', 'explore', 'apply', 'review', 'verify', 'document', 'archive'],
      });

      const initCommand = new InitCommand({ tools: 'claude', force: true });
      await initCommand.execute(testDir);

      expect(await fileExists(path.join(testDir, '.claude', 'skills', 'openspec-explore', 'SKILL.md'))).toBe(false);
      expect(await fileExists(path.join(testDir, '.claude', 'skills', 'brainstorming', 'SKILL.md'))).toBe(true);
      expect(await fileExists(path.join(testDir, '.claude', 'skills', 'executing-plans', 'SKILL.md'))).toBe(true);
      expect(await fileExists(path.join(testDir, '.claude', 'skills', 'test-driven-development', 'SKILL.md'))).toBe(true);
      expect(await fileExists(path.join(testDir, '.claude', 'skills', 'subagent-driven-development', 'SKILL.md'))).toBe(true);
      expect(await fileExists(path.join(testDir, '.claude', 'skills', 'verification-before-completion', 'SKILL.md'))).toBe(true);
      expect(await fileExists(path.join(testDir, '.claude', 'commands', 'dwsp', 'explore.md'))).toBe(true);
    });
  });
});

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

async function writeEnterpriseException(projectPath: string): Promise<void> {
  await fs.mkdir(projectPath, { recursive: true });
  await fs.writeFile(
    path.join(projectPath, 'AGENTS.md'),
    `## ${ENTERPRISE_EXCEPTIONS_HEADER}\n- ${ENTERPRISE_ALLOW_MISSING_CAPABILITIES}\n`
  );
}

async function createScaffoldSourceRoots(baseDir: string): Promise<{
  modoFrameRoot: string;
  bEndDesignProRoot: string;
}> {
  const modoFrameRoot = path.join(baseDir, 'modo-frame');
  const bEndDesignProRoot = path.join(baseDir, 'b-end-design-pro');

  await fs.mkdir(modoFrameRoot, { recursive: true });
  await fs.mkdir(bEndDesignProRoot, { recursive: true });

  await fs.writeFile(path.join(modoFrameRoot, 'next.config.ts'), 'export default {};\n');
  await fs.writeFile(path.join(modoFrameRoot, 'tsconfig.json'), '{"compilerOptions":{}}\n');
  await fs.writeFile(path.join(modoFrameRoot, 'postcss.config.mjs'), 'export default {};\n');

  await fs.mkdir(path.join(bEndDesignProRoot, 'assets', '.prd', 'modules'), { recursive: true });
  await fs.writeFile(path.join(bEndDesignProRoot, 'assets', 'package.json'), '{"name":"modo-next"}\n');
  await fs.writeFile(path.join(bEndDesignProRoot, 'assets', '.b-end-adapter'), 'modo\n');
  await fs.writeFile(path.join(bEndDesignProRoot, 'assets', 'AGENTS.md'), '# scaffold agents\n');
  await fs.writeFile(path.join(bEndDesignProRoot, 'assets', '.prd', 'main.md'), '# prd\n');
  await fs.writeFile(path.join(bEndDesignProRoot, 'assets', '.prd', 'modules', '_template.md'), '# module\n');

  await fs.mkdir(path.join(bEndDesignProRoot, 'adapters', 'modo', 'theme'), { recursive: true });
  await fs.mkdir(path.join(bEndDesignProRoot, 'adapters', 'modo', 'components'), { recursive: true });
  await fs.mkdir(path.join(bEndDesignProRoot, 'adapters', 'modo', 'templates', 'login'), { recursive: true });
  await fs.mkdir(path.join(bEndDesignProRoot, 'adapters', 'modo', 'biz_components', 'modo-button'), { recursive: true });

  await fs.writeFile(path.join(bEndDesignProRoot, 'adapters', 'modo', 'theme', 'modo-algorithm.ts'), 'export const modoAlgorithm = [];\n');
  await fs.writeFile(path.join(bEndDesignProRoot, 'adapters', 'modo', 'theme', 'antd-theme-token.tsx'), 'export const modoThemeToken = {};\n');
  await fs.writeFile(path.join(bEndDesignProRoot, 'adapters', 'modo', 'components', 'globals.css'), '@import "tailwindcss";\n');
  await fs.writeFile(path.join(bEndDesignProRoot, 'adapters', 'modo', 'templates', 'login', 'page.tsx'), 'export default function Login() { return null; }\n');
  await fs.writeFile(path.join(bEndDesignProRoot, 'adapters', 'modo', 'biz_components', 'modo-button', 'index.tsx'), 'export const ModoButton = () => null;\n');

  return { modoFrameRoot, bEndDesignProRoot };
}
