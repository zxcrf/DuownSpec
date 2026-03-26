import path from 'path';
import { promises as fs } from 'fs';
import { resolveModoScaffoldSourceRoots } from './manifest.js';
import type { ModoScaffoldSourceRoots } from './types.js';

export const MODO_ADAPTER_MARKER_FILE = '.b-end-adapter';
export const MODO_ADAPTER_MARKER = 'modo';
export const MODO_AGENTS_ASSET_PATH = 'AGENTS.md';

export async function readModoAgentsTemplate(
  sourceRootOverrides: Partial<ModoScaffoldSourceRoots> = {}
): Promise<string> {
  const { bundledRoot } = resolveModoScaffoldSourceRoots(sourceRootOverrides);
  return fs.readFile(path.join(bundledRoot, MODO_AGENTS_ASSET_PATH), 'utf-8');
}

export async function isModoScaffoldProject(projectPath: string): Promise<boolean> {
  const markerPath = path.join(projectPath, MODO_ADAPTER_MARKER_FILE);

  try {
    const markerContent = await fs.readFile(markerPath, 'utf-8');
    return markerContent.trim().toLowerCase() === MODO_ADAPTER_MARKER;
  } catch {
    return false;
  }
}
