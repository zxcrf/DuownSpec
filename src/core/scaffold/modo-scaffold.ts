import path from 'path';
import { promises as fs } from 'fs';
import { FileSystemUtils } from '../../utils/file-system.js';
import {
  getDefaultModoScaffoldManifest,
  resolveModoScaffoldSourceRoots,
} from './manifest.js';
import type {
  AssembleModoScaffoldOptions,
  ModoScaffoldAssemblyResult,
  ModoScaffoldManifest,
  ModoScaffoldSourceRoots,
  ScaffoldCopyItem,
  ScaffoldExclusionRules,
} from './types.js';

function normalizeRelativePath(input: string): string {
  const normalized = FileSystemUtils.toPosixPath(input).replace(/^\/+/, '');
  return normalized.replace(/\/$/, '');
}

function shouldExclude(relativePath: string, rules: ScaffoldExclusionRules): boolean {
  const normalized = normalizeRelativePath(relativePath);
  const fileName = path.posix.basename(normalized);

  if (rules.fileNames.includes(fileName)) {
    return true;
  }

  if (rules.exactPaths.includes(normalized)) {
    return true;
  }

  return rules.pathPrefixes.some((prefix) => normalized.startsWith(prefix));
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function resolveSourceRoot(
  sourceRoots: ModoScaffoldSourceRoots,
  source: ScaffoldCopyItem['source']
): string {
  if (source !== 'bundled') {
    throw new Error(`Unsupported scaffold source: ${source}`);
  }
  return sourceRoots.bundledRoot;
}

async function copyFile(
  fromPath: string,
  toPath: string,
  toRelativePath: string,
  overwrite: boolean,
  manifest: ModoScaffoldManifest,
  result: ModoScaffoldAssemblyResult
): Promise<void> {
  if (shouldExclude(toRelativePath, manifest.exclusions)) {
    result.excludedFiles.push(toRelativePath);
    return;
  }

  if (!overwrite && await pathExists(toPath)) {
    result.skippedFiles.push(toRelativePath);
    return;
  }

  await fs.mkdir(path.dirname(toPath), { recursive: true });
  await fs.copyFile(fromPath, toPath);
  result.copiedFiles.push(toRelativePath);
}

async function copyDirectoryRecursive(
  fromDir: string,
  toDir: string,
  toRelativeBase: string,
  overwrite: boolean,
  manifest: ModoScaffoldManifest,
  result: ModoScaffoldAssemblyResult
): Promise<void> {
  const entries = await fs.readdir(fromDir, { withFileTypes: true });

  for (const entry of entries) {
    const fromEntryPath = path.join(fromDir, entry.name);
    const toEntryPath = path.join(toDir, entry.name);
    const toRelativePath = normalizeRelativePath(path.posix.join(toRelativeBase, entry.name));

    if (entry.isDirectory()) {
      if (shouldExclude(toRelativePath, manifest.exclusions)) {
        result.excludedFiles.push(toRelativePath);
        continue;
      }

      await copyDirectoryRecursive(
        fromEntryPath,
        toEntryPath,
        toRelativePath,
        overwrite,
        manifest,
        result
      );
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    await copyFile(
      fromEntryPath,
      toEntryPath,
      toRelativePath,
      overwrite,
      manifest,
      result
    );
  }
}

async function copyItem(
  targetDir: string,
  sourceRoots: ModoScaffoldSourceRoots,
  copyItemDef: ScaffoldCopyItem,
  overwrite: boolean,
  manifest: ModoScaffoldManifest,
  result: ModoScaffoldAssemblyResult
): Promise<void> {
  const sourceRoot = resolveSourceRoot(sourceRoots, copyItemDef.source);
  const fromPath = path.join(sourceRoot, copyItemDef.from);
  const toPath = path.join(targetDir, copyItemDef.to);

  const exists = await pathExists(fromPath);
  if (!exists) {
    if (copyItemDef.required) {
      throw new Error(`Missing required scaffold source: ${fromPath}`);
    }
    return;
  }

  if (copyItemDef.kind === 'file') {
    await copyFile(
      fromPath,
      toPath,
      normalizeRelativePath(copyItemDef.to),
      overwrite,
      manifest,
      result
    );
    return;
  }

  await copyDirectoryRecursive(
    fromPath,
    toPath,
    normalizeRelativePath(copyItemDef.to),
    overwrite,
    manifest,
    result
  );
}

async function writeGeneratedFiles(
  targetDir: string,
  manifest: ModoScaffoldManifest,
  overwrite: boolean,
  result: ModoScaffoldAssemblyResult
): Promise<void> {
  for (const generated of manifest.generatedFiles) {
    const toRelativePath = normalizeRelativePath(generated.to);
    if (shouldExclude(toRelativePath, manifest.exclusions)) {
      result.excludedFiles.push(toRelativePath);
      continue;
    }

    const toPath = path.join(targetDir, generated.to);

    if (!overwrite && await pathExists(toPath)) {
      result.skippedFiles.push(toRelativePath);
      continue;
    }

    await fs.mkdir(path.dirname(toPath), { recursive: true });
    await fs.writeFile(toPath, generated.content, 'utf-8');
    result.copiedFiles.push(toRelativePath);
  }
}

async function createEmptyDirs(
  targetDir: string,
  dirs: readonly string[],
  result: ModoScaffoldAssemblyResult
): Promise<void> {
  for (const dir of dirs) {
    const normalized = normalizeRelativePath(dir);
    const fullPath = path.join(targetDir, dir);
    await fs.mkdir(fullPath, { recursive: true });
    result.createdDirs.push(normalized);
  }
}

export async function assembleModoScaffold(
  options: AssembleModoScaffoldOptions
): Promise<ModoScaffoldAssemblyResult> {
  const overwrite = options.overwrite ?? false;
  const manifest = options.manifest ?? getDefaultModoScaffoldManifest();

  const result: ModoScaffoldAssemblyResult = {
    copiedFiles: [],
    skippedFiles: [],
    excludedFiles: [],
    createdDirs: [],
  };

  await fs.mkdir(options.targetDir, { recursive: true });

  for (const copyItemDef of manifest.copyItems) {
    await copyItem(options.targetDir, options.sourceRoots, copyItemDef, overwrite, manifest, result);
  }

  await writeGeneratedFiles(options.targetDir, manifest, overwrite, result);
  await createEmptyDirs(options.targetDir, manifest.emptyDirs, result);

  result.copiedFiles = [...new Set(result.copiedFiles)].sort();
  result.skippedFiles = [...new Set(result.skippedFiles)].sort();
  result.excludedFiles = [...new Set(result.excludedFiles)].sort();
  result.createdDirs = [...new Set(result.createdDirs)].sort();

  return result;
}

export function createModoScaffoldOptions(
  targetDir: string,
  sourceRootOverrides: Partial<ModoScaffoldSourceRoots> = {}
): AssembleModoScaffoldOptions {
  return {
    targetDir,
    sourceRoots: resolveModoScaffoldSourceRoots(sourceRootOverrides),
  };
}
