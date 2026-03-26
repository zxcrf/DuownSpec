import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'path';
import os from 'os';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import {
  assembleModoScaffold,
  getDefaultModoScaffoldManifest,
} from '../../src/core/scaffold/index.js';
import type { ModoScaffoldSourceRoots } from '../../src/core/scaffold/index.js';

async function writeFile(filePath: string, content = ''): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf-8');
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

describe('modo scaffold helper', () => {
  let tempRoot: string;
  let sourceRoots: ModoScaffoldSourceRoots;
  let targetDir: string;

  beforeEach(async () => {
    tempRoot = path.join(os.tmpdir(), `openspec-scaffold-${randomUUID()}`);
    targetDir = path.join(tempRoot, 'target');

    sourceRoots = {
      bundledRoot: path.join(tempRoot, 'modo-scaffold'),
    };

    await fs.mkdir(sourceRoots.bundledRoot, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempRoot, { recursive: true, force: true });
  });

  it('assembles scaffold assets and generated files', async () => {
    await writeFile(path.join(sourceRoots.bundledRoot, 'package.json'), '{"name":"modo-next"}\n');
    await writeFile(path.join(sourceRoots.bundledRoot, '.b-end-adapter'), 'modo\n');
    await writeFile(path.join(sourceRoots.bundledRoot, 'next.config.ts'), 'export default {};\n');
    await writeFile(path.join(sourceRoots.bundledRoot, 'tsconfig.json'), '{"compilerOptions":{}}\n');
    await writeFile(path.join(sourceRoots.bundledRoot, 'postcss.config.mjs'), 'export default {};\n');
    await writeFile(path.join(sourceRoots.bundledRoot, 'components.json'), '{"style":"new-york"}\n');
    await writeFile(path.join(sourceRoots.bundledRoot, 'bunfig.toml'), '[install]\n');
    await writeFile(path.join(sourceRoots.bundledRoot, 'turbo.json'), '{"tasks":{}}\n');
    await writeFile(path.join(sourceRoots.bundledRoot, 'public', 'favicon.png'), 'fake');
    await writeFile(path.join(sourceRoots.bundledRoot, 'src', 'theme', 'modo-algorithm.ts'), 'export const modoAlgorithm = [];\n');
    await writeFile(path.join(sourceRoots.bundledRoot, 'src', 'theme', 'antd-theme-token.tsx'), 'export const modoThemeToken = {};\n');
    await writeFile(path.join(sourceRoots.bundledRoot, 'src', 'app', 'globals.css'), '@import "tailwindcss";\n');
    await writeFile(path.join(sourceRoots.bundledRoot, 'src', 'components', 'templates', 'login', 'page.tsx'), 'export default function Login() { return null; }\n');
    await writeFile(path.join(sourceRoots.bundledRoot, 'src', 'components', 'biz', 'modo-button', 'index.tsx'), 'export const ModoButton = () => null;\n');
    await writeFile(path.join(sourceRoots.bundledRoot, 'openspec', 'b-end', 'MANIFEST.md'), '# manifest\n');

    const result = await assembleModoScaffold({
      targetDir,
      sourceRoots,
    });

    expect(await pathExists(path.join(targetDir, 'package.json'))).toBe(true);
    expect(await pathExists(path.join(targetDir, '.b-end-adapter'))).toBe(true);
    expect(await pathExists(path.join(targetDir, 'AGENTS.md'))).toBe(false);
    expect(await pathExists(path.join(targetDir, '.prd', 'main.md'))).toBe(false);
    expect(await pathExists(path.join(targetDir, 'openspec', 'b-end', 'MANIFEST.md'))).toBe(true);

    expect(await pathExists(path.join(targetDir, 'src', 'theme', 'modo-algorithm.ts'))).toBe(true);
    expect(await pathExists(path.join(targetDir, 'src', 'theme', 'antd-theme-token.tsx'))).toBe(true);
    expect(await pathExists(path.join(targetDir, 'src', 'app', 'globals.css'))).toBe(true);
    expect(await pathExists(path.join(targetDir, 'src', 'components', 'templates', 'login', 'page.tsx'))).toBe(true);
    expect(await pathExists(path.join(targetDir, 'src', 'components', 'biz', 'modo-button', 'index.tsx'))).toBe(true);

    expect(await pathExists(path.join(targetDir, 'src', 'components', 'ModoThemeRegistry.tsx'))).toBe(true);
    expect(await pathExists(path.join(targetDir, 'src', 'app', 'layout.tsx'))).toBe(true);
    expect(await pathExists(path.join(targetDir, 'src', 'app', 'page.tsx'))).toBe(true);

    expect(await pathExists(path.join(targetDir, 'src', 'app', 'actions'))).toBe(true);
    expect(await pathExists(path.join(targetDir, 'src', 'app', 'api'))).toBe(true);
    expect(await pathExists(path.join(targetDir, 'src', 'db'))).toBe(true);
    expect(await pathExists(path.join(targetDir, 'src', 'types'))).toBe(true);

    expect(result.copiedFiles.length).toBeGreaterThan(0);
    expect(result.createdDirs).toContain('src/app/actions');
  });

  it('excludes banned files when copying a broad directory', async () => {
    await writeFile(path.join(sourceRoots.bundledRoot, 'src', 'db', 'schema.ts'), 'schema');
    await writeFile(path.join(sourceRoots.bundledRoot, 'src', 'proxy.ts'), 'proxy');
    await writeFile(path.join(sourceRoots.bundledRoot, 'src', 'app', 'actions', 'seed.ts'), 'seed');
    await writeFile(path.join(sourceRoots.bundledRoot, 'src', 'lib', 'auth', 'guard.ts'), 'guard');
    await writeFile(path.join(sourceRoots.bundledRoot, 'src', 'components', 'icons', 'icon.tsx'), 'icon');
    await writeFile(path.join(sourceRoots.bundledRoot, 'src', 'assets', 'icons', 'logo.svg'), '<svg />');
    await writeFile(path.join(sourceRoots.bundledRoot, 'src', 'safe', 'keep.ts'), 'keep');
    await writeFile(path.join(sourceRoots.bundledRoot, 'src', 'safe', '.DS_Store'), 'noise');

    const defaultManifest = getDefaultModoScaffoldManifest();

    const result = await assembleModoScaffold({
      targetDir,
      sourceRoots,
      manifest: {
        ...defaultManifest,
        copyItems: [
          {
            source: 'bundled',
            kind: 'directory',
            from: 'src',
            to: 'src',
            required: true,
          },
        ],
        generatedFiles: [],
        emptyDirs: [],
      },
    });

    expect(await pathExists(path.join(targetDir, 'src', 'safe', 'keep.ts'))).toBe(true);
    expect(await pathExists(path.join(targetDir, 'src', 'db', 'schema.ts'))).toBe(false);
    expect(await pathExists(path.join(targetDir, 'src', 'proxy.ts'))).toBe(false);
    expect(await pathExists(path.join(targetDir, 'src', 'app', 'actions', 'seed.ts'))).toBe(false);
    expect(await pathExists(path.join(targetDir, 'src', 'lib', 'auth', 'guard.ts'))).toBe(false);
    expect(await pathExists(path.join(targetDir, 'src', 'components', 'icons', 'icon.tsx'))).toBe(false);
    expect(await pathExists(path.join(targetDir, 'src', 'assets', 'icons', 'logo.svg'))).toBe(false);
    expect(await pathExists(path.join(targetDir, 'src', 'safe', '.DS_Store'))).toBe(false);

    expect(result.excludedFiles).toEqual(expect.arrayContaining([
      'src/db/schema.ts',
      'src/proxy.ts',
      'src/app/actions/seed.ts',
      'src/lib/auth/guard.ts',
      'src/components/icons/icon.tsx',
      'src/assets/icons/logo.svg',
      'src/safe/.DS_Store',
    ]));
  });

  it('throws when a required source entry is missing', async () => {
    await writeFile(path.join(sourceRoots.bundledRoot, 'next.config.ts'), 'export default {};\n');
    await writeFile(path.join(sourceRoots.bundledRoot, 'tsconfig.json'), '{}\n');
    await writeFile(path.join(sourceRoots.bundledRoot, 'postcss.config.mjs'), 'export default {};\n');

    await expect(assembleModoScaffold({ targetDir, sourceRoots })).rejects.toThrow(
      /Missing required scaffold source/
    );
  });

  it('skips existing files when overwrite is false', async () => {
    await writeFile(path.join(sourceRoots.bundledRoot, 'package.json'), '{"name":"modo-next"}\n');
    await writeFile(path.join(sourceRoots.bundledRoot, '.b-end-adapter'), 'modo\n');
    await writeFile(path.join(sourceRoots.bundledRoot, 'next.config.ts'), 'export default {};\n');
    await writeFile(path.join(sourceRoots.bundledRoot, 'tsconfig.json'), '{"compilerOptions":{}}\n');
    await writeFile(path.join(sourceRoots.bundledRoot, 'postcss.config.mjs'), 'export default {};\n');
    await writeFile(path.join(sourceRoots.bundledRoot, 'src', 'theme', 'modo-algorithm.ts'), 'export const modoAlgorithm = [];\n');
    await writeFile(path.join(sourceRoots.bundledRoot, 'src', 'theme', 'antd-theme-token.tsx'), 'export const modoThemeToken = {};\n');
    await writeFile(path.join(sourceRoots.bundledRoot, 'src', 'app', 'globals.css'), '@import "tailwindcss";\n');
    await writeFile(path.join(sourceRoots.bundledRoot, 'src', 'components', 'templates', 'login', 'page.tsx'), 'export default function Login() { return null; }\n');
    await writeFile(path.join(sourceRoots.bundledRoot, 'src', 'components', 'biz', 'modo-button', 'index.tsx'), 'export const ModoButton = () => null;\n');
    await writeFile(path.join(sourceRoots.bundledRoot, 'openspec', 'b-end', 'MANIFEST.md'), '# manifest\n');

    await writeFile(path.join(targetDir, 'package.json'), '{"name":"existing"}\n');

    const result = await assembleModoScaffold({ targetDir, sourceRoots, overwrite: false });

    const packageJson = await fs.readFile(path.join(targetDir, 'package.json'), 'utf-8');
    expect(packageJson).toContain('existing');
    expect(result.skippedFiles).toContain('package.json');
  });
});
