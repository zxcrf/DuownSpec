import { program } from 'commander';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { MarkdownParser } from '../core/parsers/markdown-parser.js';
import { Validator } from '../core/validation/validator.js';
import type { Spec } from '../core/schemas/index.js';
import { isInteractive } from '../utils/interactive.js';
import { getSpecIds } from '../utils/item-discovery.js';

const SPECS_DIR = 'openspec/specs';

interface ShowOptions {
  json?: boolean;
  // JSON-only filters (raw-first text has no filters)
  requirements?: boolean;
  scenarios?: boolean; // --no-scenarios sets this to false (JSON only)
  requirement?: string; // JSON only
  noInteractive?: boolean;
}

function parseSpecFromFile(specPath: string, specId: string): Spec {
  const content = readFileSync(specPath, 'utf-8');
  const parser = new MarkdownParser(content);
  return parser.parseSpec(specId);
}

function validateRequirementIndex(spec: Spec, requirementOpt?: string): number | undefined {
  if (!requirementOpt) return undefined;
  const index = Number.parseInt(requirementOpt, 10);
  if (!Number.isInteger(index) || index < 1 || index > spec.requirements.length) {
    throw new Error(`Requirement ${requirementOpt} not found`);
  }
  return index - 1; // convert to 0-based
}

function filterSpec(spec: Spec, options: ShowOptions): Spec {
  const requirementIndex = validateRequirementIndex(spec, options.requirement);
  const includeScenarios = options.scenarios !== false && !options.requirements;

  const filteredRequirements = (requirementIndex !== undefined
    ? [spec.requirements[requirementIndex]]
    : spec.requirements
  ).map(req => ({
    text: req.text,
    scenarios: includeScenarios ? req.scenarios : [],
  }));

  const metadata = spec.metadata ?? { version: '1.0.0', format: 'openspec' as const };

  return {
    name: spec.name,
    overview: spec.overview,
    requirements: filteredRequirements,
    metadata,
  };
}

/**
 * Print the raw markdown content for a spec file without any formatting.
 * Raw-first behavior ensures text mode is a passthrough for deterministic output.
 */
function printSpecTextRaw(specPath: string): void {
  const content = readFileSync(specPath, 'utf-8');
  console.log(content);
}

export class SpecCommand {
  private SPECS_DIR = 'openspec/specs';

  async show(specId?: string, options: ShowOptions = {}): Promise<void> {
    if (!specId) {
      const canPrompt = isInteractive(options);
      const specIds = await getSpecIds();
      if (canPrompt && specIds.length > 0) {
        const { select } = await import('@inquirer/prompts');
        specId = await select({
          message: '请选择要查看的 spec',
          choices: specIds.map(id => ({ name: id, value: id })),
        });
      } else {
        throw new Error('缺少必填参数 <spec-id>');
      }
    }

    const specPath = join(this.SPECS_DIR, specId, 'spec.md');
    if (!existsSync(specPath)) {
      throw new Error(`未找到 spec '${specId}'：openspec/specs/${specId}/spec.md`);
    }

    if (options.json) {
      if (options.requirements && options.requirement) {
        throw new Error('--requirements 和 --requirement 不能同时使用');
      }
      const parsed = parseSpecFromFile(specPath, specId);
      const filtered = filterSpec(parsed, options);
      const output = {
        id: specId,
        title: parsed.name,
        overview: parsed.overview,
        requirementCount: filtered.requirements.length,
        requirements: filtered.requirements,
        metadata: parsed.metadata ?? { version: '1.0.0', format: 'openspec' as const },
      };
      console.log(JSON.stringify(output, null, 2));
      return;
    }
    printSpecTextRaw(specPath);
  }
}

export function registerSpecCommand(rootProgram: typeof program) {
  const specCommand = rootProgram
    .command('spec')
    .description('管理和查看 OpenSpec specs');

  // Deprecation notice for noun-based commands
  specCommand.hook('preAction', () => {
    console.error('警告："dwsp spec ..." 已废弃，建议改用动词优先命令（如 "dwsp show"、"dwsp validate --specs"）。');
  });

  specCommand
    .command('show [spec-id]')
    .description('查看指定 spec')
    .option('--json', '以 JSON 输出')
    .option('--requirements', '仅限 JSON：只显示 requirements（不含 scenarios）')
    .option('--no-scenarios', '仅限 JSON：排除 scenario 内容')
    .option('-r, --requirement <id>', '仅限 JSON：按 ID 查看指定 requirement（从 1 开始）')
    .option('--no-interactive', '关闭交互提示')
    .action(async (specId: string | undefined, options: ShowOptions & { noInteractive?: boolean }) => {
      try {
        const cmd = new SpecCommand();
        await cmd.show(specId, options as any);
      } catch (error) {
        console.error(`错误：${error instanceof Error ? error.message : '未知错误'}`);
        process.exitCode = 1;
      }
    });

  specCommand
    .command('list')
    .description('列出所有可用 specs')
    .option('--json', '以 JSON 输出')
    .option('--long', '显示编号、标题和数量')
    .action((options: { json?: boolean; long?: boolean }) => {
      try {
        if (!existsSync(SPECS_DIR)) {
          console.log('未找到任何条目');
          return;
        }

        const specs = readdirSync(SPECS_DIR, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => {
            const specPath = join(SPECS_DIR, dirent.name, 'spec.md');
            if (existsSync(specPath)) {
              try {
                const spec = parseSpecFromFile(specPath, dirent.name);
                
                return {
                  id: dirent.name,
                  title: spec.name,
                  requirementCount: spec.requirements.length
                };
              } catch {
                return {
                  id: dirent.name,
                  title: dirent.name,
                  requirementCount: 0
                };
              }
            }
            return null;
          })
          .filter((spec): spec is { id: string; title: string; requirementCount: number } => spec !== null)
          .sort((a, b) => a.id.localeCompare(b.id));

        if (options.json) {
          console.log(JSON.stringify(specs, null, 2));
        } else {
          if (specs.length === 0) {
            console.log('未找到任何条目');
            return;
          }
          if (!options.long) {
            specs.forEach(spec => console.log(spec.id));
            return;
          }
          specs.forEach(spec => {
            console.log(`${spec.id}: ${spec.title} [requirements ${spec.requirementCount}]`);
          });
        }
      } catch (error) {
        console.error(`错误：${error instanceof Error ? error.message : '未知错误'}`);
        process.exitCode = 1;
      }
    });

  specCommand
    .command('validate [spec-id]')
    .description('校验 spec 结构')
    .option('--strict', '启用严格校验模式')
    .option('--json', '以 JSON 输出校验结果')
    .option('--no-interactive', '关闭交互提示')
    .action(async (specId: string | undefined, options: { strict?: boolean; json?: boolean; noInteractive?: boolean }) => {
      try {
        if (!specId) {
          const canPrompt = isInteractive(options);
          const specIds = await getSpecIds();
          if (canPrompt && specIds.length > 0) {
            const { select } = await import('@inquirer/prompts');
            specId = await select({
              message: '请选择要校验的 spec',
              choices: specIds.map(id => ({ name: id, value: id })),
            });
          } else {
            throw new Error('缺少必填参数 <spec-id>');
          }
        }

        const specPath = join(SPECS_DIR, specId, 'spec.md');
        
        if (!existsSync(specPath)) {
          throw new Error(`未找到 spec '${specId}'：openspec/specs/${specId}/spec.md`);
        }

        const validator = new Validator(options.strict);
        const report = await validator.validateSpec(specPath);

        if (options.json) {
          console.log(JSON.stringify(report, null, 2));
        } else {
          if (report.valid) {
            console.log(`spec '${specId}' 校验通过`);
          } else {
            console.error(`spec '${specId}' 存在问题`);
            report.issues.forEach(issue => {
              const label = issue.level === 'ERROR' ? '错误' : issue.level === 'WARNING' ? '警告' : issue.level;
              const prefix = issue.level === 'ERROR' ? '✗' : issue.level === 'WARNING' ? '⚠' : 'ℹ';
              console.error(`${prefix} [${label}] ${issue.path}: ${issue.message}`);
            });
          }
        }
        process.exitCode = report.valid ? 0 : 1;
      } catch (error) {
        console.error(`错误：${error instanceof Error ? error.message : '未知错误'}`);
        process.exitCode = 1;
      }
    });

  return specCommand;
}
