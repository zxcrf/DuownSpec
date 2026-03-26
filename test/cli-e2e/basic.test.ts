import { afterAll, describe, it, expect } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import { runCLI, cliProjectRoot } from '../helpers/run-cli.js';

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

const tempRoots: string[] = [];

async function prepareFixture(fixtureName: string): Promise<string> {
  const base = await fs.mkdtemp(path.join(tmpdir(), 'openspec-cli-e2e-'));
  tempRoots.push(base);
  const projectDir = path.join(base, 'project');
  await fs.mkdir(projectDir, { recursive: true });
  const fixtureDir = path.join(cliProjectRoot, 'test', 'fixtures', fixtureName);
  await fs.cp(fixtureDir, projectDir, { recursive: true });
  return projectDir;
}

async function createMockScaffoldSources(baseDir: string): Promise<{
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

afterAll(async () => {
  await Promise.all(tempRoots.map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe('openspec CLI e2e basics', () => {
  it('shows help output', async () => {
    const result = await runCLI(['--help']);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Usage: dwsp');
    expect(result.stderr).toBe('');

  });

  it('shows dynamic tool ids in init help', async () => {
    const result = await runCLI(['init', '--help']);
    expect(result.exitCode).toBe(0);

    const normalizedOutput = result.stdout.replace(/\s+/g, ' ').trim();
    expect(normalizedOutput).toContain('Use "all", "none", or a comma-separated list');
    for (const toolId of ['claude', 'opencode', 'trae', 'qoder', 'codebuddy', 'codex']) {
      expect(normalizedOutput).toContain(toolId);
    }
  });

  it('reports the package version', async () => {
    const pkgRaw = await fs.readFile(path.join(cliProjectRoot, 'package.json'), 'utf-8');
    const pkg = JSON.parse(pkgRaw);
    const result = await runCLI(['--version']);
    expect(result.exitCode).toBe(0);
    expect(result.stdout.trim()).toBe(pkg.version);
  });

  it('validates the tmp-init fixture with --all --json', async () => {
    const projectDir = await prepareFixture('tmp-init');
    const result = await runCLI(['validate', '--all', '--json'], { cwd: projectDir });
    expect(result.exitCode).toBe(0);
    const output = result.stdout.trim();
    expect(output).not.toBe('');
    const json = JSON.parse(output);
    expect(json.summary?.totals?.failed).toBe(0);
    expect(json.items.some((item: any) => item.id === 'c1' && item.type === 'change')).toBe(true);
  });

  it('returns an error for unknown items in the fixture', async () => {
    const projectDir = await prepareFixture('tmp-init');
    const result = await runCLI(['validate', 'does-not-exist'], { cwd: projectDir });
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Unknown item 'does-not-exist'");
  });

  describe('init command non-interactive options', () => {
    it('initializes with --tools all option', async () => {
      const projectDir = await prepareFixture('tmp-init');
      const emptyProjectDir = path.join(projectDir, '..', 'empty-project');
      await fs.mkdir(emptyProjectDir, { recursive: true });

      const codexHome = path.join(emptyProjectDir, '.codex');
      const result = await runCLI(['init', '--tools', 'all'], {
        cwd: emptyProjectDir,
        env: { CODEX_HOME: codexHome },
      });
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('DuowenSpec Setup Complete');

      // Check that skills were created for multiple tools
      const claudeSkillPath = path.join(emptyProjectDir, '.claude/skills/openspec-explore/SKILL.md');
      const opencodeSkillPath = path.join(emptyProjectDir, '.opencode/skills/openspec-explore/SKILL.md');
      expect(await fileExists(claudeSkillPath)).toBe(true);
      expect(await fileExists(opencodeSkillPath)).toBe(true);
    });

    it('initializes with --tools list option', async () => {
      const projectDir = await prepareFixture('tmp-init');
      const emptyProjectDir = path.join(projectDir, '..', 'empty-project');
      await fs.mkdir(emptyProjectDir, { recursive: true });

      const result = await runCLI(['init', '--tools', 'claude'], { cwd: emptyProjectDir });
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('DuowenSpec Setup Complete');
      expect(result.stdout).toContain('Claude Code');

      // New init creates skills, not CLAUDE.md
      const claudeSkillPath = path.join(emptyProjectDir, '.claude/skills/openspec-explore/SKILL.md');
      const opencodeSkillPath = path.join(emptyProjectDir, '.opencode/skills/openspec-explore/SKILL.md');
      const bundledCapabilitySkillPath = path.join(emptyProjectDir, '.claude/skills/executing-plans/SKILL.md');
      expect(await fileExists(claudeSkillPath)).toBe(true);
      expect(await fileExists(opencodeSkillPath)).toBe(false); // Not selected
      expect(await fileExists(bundledCapabilitySkillPath)).toBe(true);
    });

    it('initializes with --tools none option', async () => {
      const projectDir = await prepareFixture('tmp-init');
      const emptyProjectDir = path.join(projectDir, '..', 'empty-project');
      await fs.mkdir(emptyProjectDir, { recursive: true });

      const result = await runCLI(['init', '--tools', 'none'], { cwd: emptyProjectDir });
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('DuowenSpec Setup Complete');

      // With --tools none, no tool skills should be created
      const claudeSkillPath = path.join(emptyProjectDir, '.claude/skills/openspec-explore/SKILL.md');
      const opencodeSkillPath = path.join(emptyProjectDir, '.opencode/skills/openspec-explore/SKILL.md');

      expect(await fileExists(claudeSkillPath)).toBe(false);
      expect(await fileExists(opencodeSkillPath)).toBe(false);
    });

    it('initializes scaffold project with --scaffold and creates instruction link', async () => {
      const projectDir = await prepareFixture('tmp-init');
      const emptyProjectDir = path.join(projectDir, '..', 'scaffold-project');
      await fs.mkdir(emptyProjectDir, { recursive: true });

      const roots = await createMockScaffoldSources(path.join(emptyProjectDir, 'mock-scaffold-sources'));
      const result = await runCLI(['init', '--tools', 'none', '--scaffold'], {
        cwd: emptyProjectDir,
        env: {
          OPENSPEC_MODO_FRAME_ROOT: roots.modoFrameRoot,
          OPENSPEC_B_END_DESIGN_PRO_ROOT: roots.bEndDesignProRoot,
        },
      });

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain("unknown option '--scaffold'");
    });

    it('does not create CLAUDE.md when AGENTS.md already exists in scaffold init', async () => {
      const projectDir = await prepareFixture('tmp-init');
      const emptyProjectDir = path.join(projectDir, '..', 'scaffold-project-existing-agents');
      await fs.mkdir(emptyProjectDir, { recursive: true });
      await fs.writeFile(path.join(emptyProjectDir, 'AGENTS.md'), '# existing\n');

      const roots = await createMockScaffoldSources(path.join(emptyProjectDir, 'mock-scaffold-sources'));
      const result = await runCLI(['init', '--tools', 'none', '--scaffold'], {
        cwd: emptyProjectDir,
        env: {
          OPENSPEC_MODO_FRAME_ROOT: roots.modoFrameRoot,
          OPENSPEC_B_END_DESIGN_PRO_ROOT: roots.bEndDesignProRoot,
        },
      });

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain("unknown option '--scaffold'");
    });

    it('returns error for invalid tool names', async () => {
      const projectDir = await prepareFixture('tmp-init');
      const emptyProjectDir = path.join(projectDir, '..', 'empty-project');
      await fs.mkdir(emptyProjectDir, { recursive: true });

      const result = await runCLI(['init', '--tools', 'invalid-tool'], { cwd: emptyProjectDir });
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Invalid tool(s): invalid-tool');
      expect(result.stderr).toContain('Available values:');
    });

    it('returns error when combining reserved keywords with explicit ids', async () => {
      const projectDir = await prepareFixture('tmp-init');
      const emptyProjectDir = path.join(projectDir, '..', 'empty-project');
      await fs.mkdir(emptyProjectDir, { recursive: true });

      const result = await runCLI(['init', '--tools', 'all,claude'], { cwd: emptyProjectDir });
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Cannot combine reserved values "all" or "none" with specific tool IDs');
    });
  });
});
