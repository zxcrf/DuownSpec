import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { randomUUID } from 'crypto';
import {
  AGENTS_FILE_NAME,
  CLAUDE_FILE_NAME,
  syncProjectInstructionFiles,
} from '../../src/core/project-instruction-files.js';

describe('project instruction files', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = path.join(os.tmpdir(), `openspec-instruction-files-${randomUUID()}`);
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it.skipIf(process.platform === 'win32')('creates AGENTS.md and CLAUDE.md symlink when both are absent', async () => {
    const result = await syncProjectInstructionFiles(testDir, '# Agents\n');

    expect(result.status).toBe('created');
    expect(result.createdAgentsFile).toBe(true);
    expect(result.createdClaudeSymlink).toBe(true);

    const agentsPath = path.join(testDir, AGENTS_FILE_NAME);
    const claudePath = path.join(testDir, CLAUDE_FILE_NAME);

    expect(await fs.readFile(agentsPath, 'utf-8')).toBe('# Agents\n');

    const linkStats = await fs.lstat(claudePath);
    expect(linkStats.isSymbolicLink()).toBe(true);
    expect(await fs.readlink(claudePath)).toBe(AGENTS_FILE_NAME);
  });

  it('skips when AGENTS.md already exists', async () => {
    const agentsPath = path.join(testDir, AGENTS_FILE_NAME);
    await fs.writeFile(agentsPath, 'existing', 'utf-8');

    const result = await syncProjectInstructionFiles(testDir, 'new');

    expect(result.status).toBe('skipped');
    if (result.status === 'skipped') {
      expect(result.reason).toBe('agents-exists');
    }
    expect(await fs.readFile(agentsPath, 'utf-8')).toBe('existing');

    await expect(fs.lstat(path.join(testDir, CLAUDE_FILE_NAME))).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('skips when CLAUDE.md already exists as regular file', async () => {
    const claudePath = path.join(testDir, CLAUDE_FILE_NAME);
    await fs.writeFile(claudePath, 'existing', 'utf-8');

    const result = await syncProjectInstructionFiles(testDir, 'new');

    expect(result.status).toBe('skipped');
    if (result.status === 'skipped') {
      expect(result.reason).toBe('claude-exists');
    }

    await expect(fs.lstat(path.join(testDir, AGENTS_FILE_NAME))).rejects.toMatchObject({ code: 'ENOENT' });
    expect(await fs.readFile(claudePath, 'utf-8')).toBe('existing');
  });

  it.skipIf(process.platform === 'win32')('skips when CLAUDE.md exists as dangling symlink', async () => {
    const claudePath = path.join(testDir, CLAUDE_FILE_NAME);
    await fs.symlink('missing-target.md', claudePath, 'file');

    const result = await syncProjectInstructionFiles(testDir, 'new');

    expect(result.status).toBe('skipped');
    if (result.status === 'skipped') {
      expect(result.reason).toBe('claude-exists');
    }

    await expect(fs.lstat(path.join(testDir, AGENTS_FILE_NAME))).rejects.toMatchObject({ code: 'ENOENT' });
    const linkStats = await fs.lstat(claudePath);
    expect(linkStats.isSymbolicLink()).toBe(true);
  });

  it.skipIf(process.platform === 'win32')('skips when both AGENTS.md and CLAUDE.md exist', async () => {
    const agentsPath = path.join(testDir, AGENTS_FILE_NAME);
    const claudePath = path.join(testDir, CLAUDE_FILE_NAME);

    await fs.writeFile(agentsPath, 'existing-agents', 'utf-8');
    await fs.symlink(AGENTS_FILE_NAME, claudePath, 'file');

    const result = await syncProjectInstructionFiles(testDir, 'new');

    expect(result.status).toBe('skipped');
    if (result.status === 'skipped') {
      expect(result.reason).toBe('both-exist');
    }
    expect(await fs.readFile(agentsPath, 'utf-8')).toBe('existing-agents');
  });

  it('rolls back AGENTS.md and throws when symlink creation fails', async () => {
    const symlinkSpy = vi.spyOn(fs, 'symlink').mockRejectedValue(new Error('permission denied'));

    await expect(syncProjectInstructionFiles(testDir, 'new')).rejects.toThrow(
      'Failed to create CLAUDE.md symlink: permission denied'
    );

    expect(symlinkSpy).toHaveBeenCalledOnce();
    await expect(fs.lstat(path.join(testDir, AGENTS_FILE_NAME))).rejects.toMatchObject({ code: 'ENOENT' });
    await expect(fs.lstat(path.join(testDir, CLAUDE_FILE_NAME))).rejects.toMatchObject({ code: 'ENOENT' });
  });
});
