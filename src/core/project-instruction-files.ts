import { promises as fs } from 'fs';
import path from 'path';

export const AGENTS_FILE_NAME = 'AGENTS.md';
export const CLAUDE_FILE_NAME = 'CLAUDE.md';

export type InstructionFileSkipReason = 'agents-exists' | 'claude-exists' | 'both-exist';

export type SyncProjectInstructionFilesResult =
  | {
    status: 'created';
    agentsPath: string;
    claudePath: string;
    createdAgentsFile: true;
    createdClaudeSymlink: true;
  }
  | {
    status: 'skipped';
    agentsPath: string;
    claudePath: string;
    reason: InstructionFileSkipReason;
    createdAgentsFile: false;
    createdClaudeSymlink: false;
  };

async function pathExistsWithoutFollowingSymlink(filePath: string): Promise<boolean> {
  try {
    await fs.lstat(filePath);
    return true;
  } catch (error: any) {
    if (error?.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

function resolveSkipReason(agentsExists: boolean, claudeExists: boolean): InstructionFileSkipReason {
  if (agentsExists && claudeExists) {
    return 'both-exist';
  }
  if (agentsExists) {
    return 'agents-exists';
  }
  return 'claude-exists';
}

/**
 * Creates scaffold instruction files only when both AGENTS.md and CLAUDE.md are absent.
 *
 * Behavior:
 * - If either AGENTS.md or CLAUDE.md already exists at project root, do nothing.
 * - If both are absent, write AGENTS.md and create CLAUDE.md as a symlink to AGENTS.md.
 */
export async function syncProjectInstructionFiles(
  projectRoot: string,
  agentsContent: string
): Promise<SyncProjectInstructionFilesResult> {
  const agentsPath = path.join(projectRoot, AGENTS_FILE_NAME);
  const claudePath = path.join(projectRoot, CLAUDE_FILE_NAME);

  const [agentsExists, claudeExists] = await Promise.all([
    pathExistsWithoutFollowingSymlink(agentsPath),
    pathExistsWithoutFollowingSymlink(claudePath),
  ]);

  if (agentsExists || claudeExists) {
    return {
      status: 'skipped',
      agentsPath,
      claudePath,
      reason: resolveSkipReason(agentsExists, claudeExists),
      createdAgentsFile: false,
      createdClaudeSymlink: false,
    };
  }

  await fs.writeFile(agentsPath, agentsContent, 'utf-8');

  try {
    // Use a relative link target so moved/cloned project roots preserve linkage.
    await fs.symlink(AGENTS_FILE_NAME, claudePath, 'file');
  } catch (error: any) {
    try {
      await fs.rm(agentsPath, { force: true });
    } catch {
      // Ignore cleanup failures and surface the root symlink error.
    }

    const message = error?.message ? String(error.message) : 'Unknown error';
    throw new Error(`Failed to create ${CLAUDE_FILE_NAME} symlink: ${message}`);
  }

  return {
    status: 'created',
    agentsPath,
    claudePath,
    createdAgentsFile: true,
    createdClaudeSymlink: true,
  };
}
