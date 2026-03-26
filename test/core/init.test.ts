import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { InitCommand } from '../../src/core/init.js';
import { saveGlobalConfig, getGlobalConfig } from '../../src/core/global-config.js';

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
    it('should create OpenSpec directory structure', async () => {
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

    it('should create skills in Qoder skills directory', async () => {
      const initCommand = new InitCommand({ tools: 'qoder', force: true });

      await initCommand.execute(testDir);

      const skillFile = path.join(testDir, '.qoder', 'skills', 'openspec-explore', 'SKILL.md');
      expect(await fileExists(skillFile)).toBe(true);
    });

    it('should create skills in OpenCode skills directory', async () => {
      const initCommand = new InitCommand({ tools: 'opencode', force: true });

      await initCommand.execute(testDir);

      const skillFile = path.join(testDir, '.opencode', 'skills', 'openspec-explore', 'SKILL.md');
      expect(await fileExists(skillFile)).toBe(true);
    });

    it('should create skills for multiple tools at once', async () => {
      const initCommand = new InitCommand({ tools: 'claude,qoder', force: true });

      await initCommand.execute(testDir);

      const claudeSkill = path.join(testDir, '.claude', 'skills', 'openspec-explore', 'SKILL.md');
      const cursorSkill = path.join(testDir, '.qoder', 'skills', 'openspec-explore', 'SKILL.md');

      expect(await fileExists(claudeSkill)).toBe(true);
      expect(await fileExists(cursorSkill)).toBe(true);
    });

    it('should select all tools with --tools all option', async () => {
      const initCommand = new InitCommand({ tools: 'all', force: true });

      await initCommand.execute(testDir);

      // Check a few representative tools
      const claudeSkill = path.join(testDir, '.claude', 'skills', 'openspec-explore', 'SKILL.md');
      const cursorSkill = path.join(testDir, '.qoder', 'skills', 'openspec-explore', 'SKILL.md');
      const windsurfSkill = path.join(testDir, '.opencode', 'skills', 'openspec-explore', 'SKILL.md');

      expect(await fileExists(claudeSkill)).toBe(true);
      expect(await fileExists(cursorSkill)).toBe(true);
      expect(await fileExists(windsurfSkill)).toBe(true);
    });

    it('should skip tool configuration with --tools none option', async () => {
      const initCommand = new InitCommand({ tools: 'none', force: true });

      await initCommand.execute(testDir);

      // Should create OpenSpec structure but no skills
      const openspecPath = path.join(testDir, 'openspec');
      expect(await directoryExists(openspecPath)).toBe(true);

      // No tool-specific directories should be created
      const claudeSkillsDir = path.join(testDir, '.claude', 'skills');
      expect(await directoryExists(claudeSkillsDir)).toBe(false);
    });

    it('should throw error for invalid tool names', async () => {
      const initCommand = new InitCommand({ tools: 'invalid-tool', force: true });

      await expect(initCommand.execute(testDir)).rejects.toThrow(/无效工具：invalid-tool/);
    });

    it('should handle comma-separated tool names with spaces', async () => {
      const initCommand = new InitCommand({ tools: 'claude, qoder', force: true });

      await initCommand.execute(testDir);

      const claudeSkill = path.join(testDir, '.claude', 'skills', 'openspec-explore', 'SKILL.md');
      const cursorSkill = path.join(testDir, '.qoder', 'skills', 'openspec-explore', 'SKILL.md');

      expect(await fileExists(claudeSkill)).toBe(true);
      expect(await fileExists(cursorSkill)).toBe(true);
    });

    it('should reject combining reserved keywords with explicit tool ids', async () => {
      const initCommand = new InitCommand({ tools: 'all,claude', force: true });

      await expect(initCommand.execute(testDir)).rejects.toThrow(
        /不能将 "all" 或 "none" 与具体工具 ID 混用/
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
      const initCommand = new InitCommand({ tools: 'claude', force: true });

      await initCommand.execute(newDir);

      const openspecPath = path.join(newDir, 'openspec');
      expect(await directoryExists(openspecPath)).toBe(true);
    });

    it('should work in extend mode (re-running init)', async () => {
      const initCommand1 = new InitCommand({ tools: 'claude', force: true });
      await initCommand1.execute(testDir);

      // Run init again with a different tool
      const initCommand2 = new InitCommand({ tools: 'qoder', force: true });
      await initCommand2.execute(testDir);

      // Both tools should have skills
      const claudeSkill = path.join(testDir, '.claude', 'skills', 'openspec-explore', 'SKILL.md');
      const cursorSkill = path.join(testDir, '.qoder', 'skills', 'openspec-explore', 'SKILL.md');

      expect(await fileExists(claudeSkill)).toBe(true);
      expect(await fileExists(cursorSkill)).toBe(true);
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

      expect(content).toContain('进入探索模式');
      expect(content).toContain('思考搭档');
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

    it('should generate Qoder commands with correct format', async () => {
      const initCommand = new InitCommand({ tools: 'qoder', force: true });
      await initCommand.execute(testDir);

      const cmdFile = path.join(testDir, '.qoder', 'commands', 'dwsp', 'explore.md');
      expect(await fileExists(cmdFile)).toBe(true);

      const content = await fs.readFile(cmdFile, 'utf-8');
      expect(content).toMatch(/^---\n/);
    });
  });

  describe('scaffold initialization', () => {
    it.skipIf(process.platform === 'win32')('should initialize modo scaffold and create instruction files', async () => {
      const { bundledRoot, agentsContent } = await createFakeModoScaffoldRoots(testDir);
      process.env.OPENSPEC_MODO_SCAFFOLD_ASSET_ROOT = bundledRoot;

      const initCommand = new InitCommand({ tools: 'claude', force: true, scaffold: true });
      await initCommand.execute(testDir);

      expect(await fileExists(path.join(testDir, '.b-end-adapter'))).toBe(true);
      expect(await fileExists(path.join(testDir, '.prd', 'main.md'))).toBe(false);
      expect(await fileExists(path.join(testDir, 'openspec', 'b-end', 'MANIFEST.md'))).toBe(true);
      expect(await fileExists(path.join(testDir, 'src', 'theme', 'modo-algorithm.ts'))).toBe(true);
      expect(await fileExists(path.join(testDir, 'src', 'components', 'biz', 'modo-button', 'index.tsx'))).toBe(true);
      expect(await fileExists(path.join(testDir, '.claude', 'skills', 'openspec-b-end-delivery', 'SKILL.md'))).toBe(true);
      expect(await fileExists(path.join(testDir, '.claude', 'skills', 'openspec-b-end-components', 'SKILL.md'))).toBe(true);
      expect(await fileExists(path.join(testDir, '.claude', 'skills', 'openspec-b-end-review', 'SKILL.md'))).toBe(true);

      const agentsPath = path.join(testDir, 'AGENTS.md');
      const claudePath = path.join(testDir, 'CLAUDE.md');

      expect(await fs.readFile(agentsPath, 'utf-8')).toBe(agentsContent);
      expect((await fs.lstat(claudePath)).isSymbolicLink()).toBe(true);
      expect(await fs.readlink(claudePath)).toBe('AGENTS.md');

      const logCalls = (console.log as unknown as { mock: { calls: unknown[][] } }).mock.calls.flat().map(String);
      expect(logCalls.some((entry) => entry.includes('脚手架：已初始化 MODO 空骨架'))).toBe(true);
      expect(logCalls.some((entry) => entry.includes('说明文件：已创建 AGENTS.md，并建立 CLAUDE.md 软链'))).toBe(true);
    });

    it('should preserve existing AGENTS.md when scaffolding', async () => {
      const { bundledRoot } = await createFakeModoScaffoldRoots(testDir);
      process.env.OPENSPEC_MODO_SCAFFOLD_ASSET_ROOT = bundledRoot;

      const existingAgentsContent = '# 已有说明\n';
      await fs.writeFile(path.join(testDir, 'AGENTS.md'), existingAgentsContent, 'utf-8');

      const initCommand = new InitCommand({ tools: 'claude', force: true, scaffold: true });
      await initCommand.execute(testDir);

      expect(await fs.readFile(path.join(testDir, 'AGENTS.md'), 'utf-8')).toBe(existingAgentsContent);
      expect(await fileExists(path.join(testDir, 'CLAUDE.md'))).toBe(false);

      const logCalls = (console.log as unknown as { mock: { calls: unknown[][] } }).mock.calls.flat().map(String);
      expect(logCalls.some((entry) => entry.includes('说明文件：已保留现有 AGENTS.md'))).toBe(true);
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
      await expect(initCommand.execute(readOnlyDir)).rejects.toThrow(/没有写入权限/);
    });

    it('should throw error in non-interactive mode without --tools flag and no detected tools', async () => {
      const initCommand = new InitCommand({ interactive: false });

      await expect(initCommand.execute(testDir)).rejects.toThrow(/未检测到可用工具/);
    });
  });

  describe('tool-specific adapters', () => {
    it('should generate Codex prompts in CODEX_HOME', async () => {
      process.env.CODEX_HOME = path.join(testDir, '.codex-home');

      const initCommand = new InitCommand({ tools: 'codex', force: true });
      await initCommand.execute(testDir);

      const cmdFile = path.join(process.env.CODEX_HOME, 'prompts', 'dwsp-explore.md');
      expect(await fileExists(cmdFile)).toBe(true);

      const content = await fs.readFile(cmdFile, 'utf-8');
      expect(content).toContain('description:');
      expect(content).toContain('argument-hint:');
    });

    it('should generate OpenCode commands', async () => {
      const initCommand = new InitCommand({ tools: 'opencode', force: true });
      await initCommand.execute(testDir);

      const cmdFile = path.join(testDir, '.opencode', 'commands', 'dwsp-explore.md');
      expect(await fileExists(cmdFile)).toBe(true);

      const content = await fs.readFile(cmdFile, 'utf-8');
      expect(content).toMatch(/^---\n/);
      expect(content).toContain('description:');
    });

    it('should generate CodeBuddy prompt files', async () => {
      const initCommand = new InitCommand({ tools: 'codebuddy', force: true });
      await initCommand.execute(testDir);

      const cmdFile = path.join(testDir, '.codebuddy', 'commands', 'dwsp', 'explore.md');
      expect(await fileExists(cmdFile)).toBe(true);

      const content = await fs.readFile(cmdFile, 'utf-8');
      expect(content).toContain('name: OPSX: Explore');
      expect(content).toContain('argument-hint: "[命令参数]"');
    });

    it('should not generate prompt files for Trae', async () => {
      const initCommand = new InitCommand({ tools: 'trae', force: true });
      await initCommand.execute(testDir);

      const skillFile = path.join(testDir, '.trae', 'skills', 'openspec-explore', 'SKILL.md');
      const cmdFile = path.join(testDir, '.trae', 'commands', 'dwsp', 'explore.md');
      expect(await fileExists(skillFile)).toBe(true);
      expect(await fileExists(cmdFile)).toBe(false);
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
      /无效的 profile：invalid-profile/
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
    // Simulate existing OpenSpec project (extend mode).
    await fs.mkdir(path.join(testDir, 'openspec'), { recursive: true });

    // Configured with OpenSpec
    const claudeSkillDir = path.join(testDir, '.claude', 'skills', 'openspec-explore');
    await fs.mkdir(claudeSkillDir, { recursive: true });
    await fs.writeFile(path.join(claudeSkillDir, 'SKILL.md'), 'configured');

    // Directory detected only (not configured with OpenSpec)
    await fs.mkdir(path.join(testDir, '.trae'), { recursive: true });

    searchableMultiSelectMock.mockResolvedValue(['claude']);

    const initCommand = new InitCommand({ force: true });
    vi.spyOn(initCommand as any, 'canPromptInteractively').mockReturnValue(true);

    await initCommand.execute(testDir);

    expect(searchableMultiSelectMock).toHaveBeenCalledTimes(1);
    const [{ choices }] = searchableMultiSelectMock.mock.calls[0] as [{ choices: Array<{ value: string; preSelected?: boolean; detected?: boolean }> }];

    const claude = choices.find((choice) => choice.value === 'claude');
    const githubCopilot = choices.find((choice) => choice.value === 'trae');

    expect(claude?.preSelected).toBe(true);
    expect(githubCopilot?.preSelected).toBe(false);
    expect(githubCopilot?.detected).toBe(true);
  });

  it('should preselect detected tools for first-time interactive setup', async () => {
    // First-time init: no openspec/ directory and no configured OpenSpec skills.
    await fs.mkdir(path.join(testDir, '.trae'), { recursive: true });

    searchableMultiSelectMock.mockResolvedValue(['trae']);

    const initCommand = new InitCommand({ force: true });
    vi.spyOn(initCommand as any, 'canPromptInteractively').mockReturnValue(true);

    await initCommand.execute(testDir);

    expect(searchableMultiSelectMock).toHaveBeenCalledTimes(1);
    const [{ choices }] = searchableMultiSelectMock.mock.calls[0] as [{ choices: Array<{ value: string; preSelected?: boolean }> }];
    const githubCopilot = choices.find((choice) => choice.value === 'trae');

    expect(githubCopilot?.preSelected).toBe(true);
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

  it('should respect delivery=commands setting (no skills)', async () => {
    saveGlobalConfig({
      featureFlags: {},
      profile: 'custom',
      delivery: 'commands',
      workflows: ['propose', 'explore', 'apply', 'review', 'verify', 'document', 'archive'],
    });

    const initCommand = new InitCommand({ tools: 'claude', force: true });
    await initCommand.execute(testDir);

    // Skills should NOT exist
    const skillFile = path.join(testDir, '.claude', 'skills', 'openspec-explore', 'SKILL.md');
    expect(await fileExists(skillFile)).toBe(false);

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

async function writeFixtureFile(filePath: string, content = ''): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf-8');
}

async function createFakeModoScaffoldRoots(baseDir: string): Promise<{
  bundledRoot: string;
  agentsContent: string;
}> {
  const bundledRoot = path.join(baseDir, '__scaffold-sources', 'modo-scaffold');
  const agentsContent = '# 项目协作说明\n\n默认使用中文。\n';

  await writeFixtureFile(path.join(bundledRoot, 'package.json'), '{"name":"modo-next"}\n');
  await writeFixtureFile(path.join(bundledRoot, '.b-end-adapter'), 'modo\n');
  await writeFixtureFile(path.join(bundledRoot, 'AGENTS.md'), agentsContent);
  await writeFixtureFile(path.join(bundledRoot, 'next.config.ts'), 'export default {};\n');
  await writeFixtureFile(path.join(bundledRoot, 'tsconfig.json'), '{"compilerOptions":{}}\n');
  await writeFixtureFile(path.join(bundledRoot, 'postcss.config.mjs'), 'export default {};\n');
  await writeFixtureFile(path.join(bundledRoot, 'components.json'), '{"style":"new-york"}\n');
  await writeFixtureFile(path.join(bundledRoot, 'src', 'theme', 'modo-algorithm.ts'), 'export const modoAlgorithm = [];\n');
  await writeFixtureFile(path.join(bundledRoot, 'src', 'theme', 'antd-theme-token.tsx'), 'export const modoThemeToken = {};\n');
  await writeFixtureFile(path.join(bundledRoot, 'src', 'app', 'globals.css'), '@import "tailwindcss";\n');
  await writeFixtureFile(path.join(bundledRoot, 'src', 'components', 'templates', 'login', 'page.tsx'), 'export default function Login() { return null; }\n');
  await writeFixtureFile(path.join(bundledRoot, 'src', 'components', 'biz', 'modo-button', 'index.tsx'), 'export const ModoButton = () => null;\n');
  await writeFixtureFile(path.join(bundledRoot, 'openspec', 'b-end', 'MANIFEST.md'), '# manifest\n');

  return {
    bundledRoot,
    agentsContent,
  };
}
