import { Command } from 'commander';
import { createRequire } from 'module';
import ora from 'ora';
import path from 'path';
import { promises as fs } from 'fs';
import { AI_TOOLS } from '../core/config.js';
import { UpdateCommand } from '../core/update.js';
import { ListCommand } from '../core/list.js';
import { ArchiveCommand } from '../core/archive.js';
import { ViewCommand } from '../core/view.js';
import { registerSpecCommand } from '../commands/spec.js';
import { ChangeCommand } from '../commands/change.js';
import { ValidateCommand } from '../commands/validate.js';
import { ShowCommand } from '../commands/show.js';
import { CompletionCommand } from '../commands/completion.js';
import { FeedbackCommand } from '../commands/feedback.js';
import { registerConfigCommand } from '../commands/config.js';
import { registerSchemaCommand } from '../commands/schema.js';
import {
  statusCommand,
  instructionsCommand,
  applyInstructionsCommand,
  templatesCommand,
  schemasCommand,
  newChangeCommand,
  DEFAULT_SCHEMA,
  type StatusOptions,
  type InstructionsOptions,
  type TemplatesOptions,
  type SchemasOptions,
  type NewChangeOptions,
} from '../commands/workflow/index.js';
import { maybeShowTelemetryNotice, trackCommand, shutdown } from '../telemetry/index.js';
import { CLI_COMMAND } from '../core/app-info.js';

const program = new Command();
const require = createRequire(import.meta.url);
const { version } = require('../../package.json');

/**
 * Get the full command path for nested commands.
 * For example: 'change show' -> 'change:show'
 */
function getCommandPath(command: Command): string {
  const names: string[] = [];
  let current: Command | null = command;

  while (current) {
    const name = current.name();
    // Skip the root command name
    if (name && name !== CLI_COMMAND) {
      names.unshift(name);
    }
    current = current.parent;
  }

  return names.join(':') || CLI_COMMAND;
}

function localizeHelpText(command: Command): void {
  command.helpOption('-h, --help', '显示帮助');
  command.helpCommand('help [command]', '查看指定命令的帮助');

  for (const subcommand of command.commands) {
    localizeHelpText(subcommand);
  }
}

program
  .name(CLI_COMMAND)
  .description('面向规格驱动开发的 AI 原生系统')
  .version(version, '-V, --version', '显示版本号');

// Global options
program.option('--no-color', '关闭彩色输出');

// Apply global flags and telemetry before any command runs
// Note: preAction receives (thisCommand, actionCommand) where:
// - thisCommand: the command where hook was added (root program)
// - actionCommand: the command actually being executed (subcommand)
program.hook('preAction', async (thisCommand, actionCommand) => {
  const opts = thisCommand.opts();
  if (opts.color === false) {
    process.env.NO_COLOR = '1';
  }

  // Show first-run telemetry notice (if not seen)
  await maybeShowTelemetryNotice();

  // Track command execution (use actionCommand to get the actual subcommand)
  const commandPath = getCommandPath(actionCommand);
  await trackCommand(commandPath, version);
});

// Shutdown telemetry after command completes
program.hook('postAction', async () => {
  await shutdown();
});

const availableToolIds = AI_TOOLS.filter((tool) => tool.skillsDir).map((tool) => tool.value);
const toolsOptionDescription = `以非交互方式配置 AI 工具。可使用 "all"、"none"，或传入逗号分隔的工具列表：${availableToolIds.join(', ')}`;

program
  .command('init [path]')
  .description('在当前项目中初始化 OpenSpec')
  .option('--tools <tools>', toolsOptionDescription)
  .option('--force', '自动清理旧版遗留文件，不再提示确认')
  .option('--profile <profile>', '覆盖全局 profile（core 或 custom）')
  .option('--scaffold', '初始化 MODO 空脚手架工程')
  .action(async (targetPath = '.', options?: { tools?: string; force?: boolean; profile?: string; scaffold?: boolean }) => {
    try {
      // Validate that the path is a valid directory
      const resolvedPath = path.resolve(targetPath);

      try {
        const stats = await fs.stat(resolvedPath);
        if (!stats.isDirectory()) {
          throw new Error(`路径 "${targetPath}" 不是目录`);
        }
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          // Directory doesn't exist, but we can create it
          console.log(`目录 "${targetPath}" 不存在，将自动创建。`);
        } else if (error.message && error.message.includes('not a directory')) {
          throw error;
        } else {
          throw new Error(`无法访问路径 "${targetPath}"：${error.message}`);
        }
      }

      const { InitCommand } = await import('../core/init.js');
      const initCommand = new InitCommand({
        tools: options?.tools,
        force: options?.force,
        profile: options?.profile,
        scaffold: options?.scaffold,
      });
      await initCommand.execute(targetPath);
    } catch (error) {
      console.log(); // Empty line for spacing
      ora().fail(`错误：${(error as Error).message}`);
      process.exit(1);
    }
  });

program
  .command('update [path]')
  .description('刷新 OpenSpec 生成的说明文件')
  .option('--force', '即使已是最新状态也强制刷新')
  .action(async (targetPath = '.', options?: { force?: boolean }) => {
    try {
      const resolvedPath = path.resolve(targetPath);
      const updateCommand = new UpdateCommand({ force: options?.force });
      await updateCommand.execute(resolvedPath);
    } catch (error) {
      console.log(); // Empty line for spacing
      ora().fail(`错误：${(error as Error).message}`);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('列出条目（默认列出 changes，可用 --specs 查看 specs）')
  .option('--specs', '列出 specs，而不是 changes')
  .option('--changes', '显式列出 changes（默认）')
  .option('--sort <order>', '排序方式："recent"（默认）或 "name"', 'recent')
  .option('--json', '以 JSON 输出（供程序调用）')
  .action(async (options?: { specs?: boolean; changes?: boolean; sort?: string; json?: boolean }) => {
    try {
      const listCommand = new ListCommand();
      const mode: 'changes' | 'specs' = options?.specs ? 'specs' : 'changes';
      const sort = options?.sort === 'name' ? 'name' : 'recent';
      await listCommand.execute('.', mode, { sort, json: options?.json });
    } catch (error) {
      console.log(); // Empty line for spacing
      ora().fail(`错误：${(error as Error).message}`);
      process.exit(1);
    }
  });

program
  .command('view')
  .description('打开 specs 与 changes 的交互看板')
  .action(async () => {
    try {
      const viewCommand = new ViewCommand();
      await viewCommand.execute('.');
    } catch (error) {
      console.log(); // Empty line for spacing
      ora().fail(`错误：${(error as Error).message}`);
      process.exit(1);
    }
  });

// Change command with subcommands
const changeCmd = program
  .command('change')
  .description('管理 OpenSpec 变更提案');

// Deprecation notice for noun-based commands
changeCmd.hook('preAction', () => {
  console.error('警告："dwsp change ..." 已废弃，建议改用动词优先的命令（例如 "dwsp list"、"dwsp validate --changes"）。');
});

changeCmd
  .command('show [change-name]')
  .description('以 JSON 或 Markdown 格式查看变更提案')
  .option('--json', '以 JSON 输出')
  .option('--deltas-only', '仅显示变更差异（仅限 JSON）')
  .option('--requirements-only', '--deltas-only 的兼容别名（已废弃）')
  .option('--no-interactive', '关闭交互提示')
  .action(async (changeName?: string, options?: { json?: boolean; requirementsOnly?: boolean; deltasOnly?: boolean; noInteractive?: boolean }) => {
    try {
      const changeCommand = new ChangeCommand();
      await changeCommand.show(changeName, options);
    } catch (error) {
      console.error(`错误：${(error as Error).message}`);
      process.exitCode = 1;
    }
  });

changeCmd
  .command('list')
  .description('列出所有进行中的变更（已废弃，请改用 "dwsp list"）')
  .option('--json', '以 JSON 输出')
  .option('--long', '显示编号、标题和数量')
  .action(async (options?: { json?: boolean; long?: boolean }) => {
    try {
      console.error('警告："dwsp change list" 已废弃，请改用 "dwsp list"。');
      const changeCommand = new ChangeCommand();
      await changeCommand.list(options);
    } catch (error) {
      console.error(`错误：${(error as Error).message}`);
      process.exitCode = 1;
    }
  });

changeCmd
  .command('validate [change-name]')
  .description('校验变更提案')
  .option('--strict', '启用严格校验模式')
  .option('--json', '以 JSON 输出校验结果')
  .option('--no-interactive', '关闭交互提示')
  .action(async (changeName?: string, options?: { strict?: boolean; json?: boolean; noInteractive?: boolean }) => {
    try {
      const changeCommand = new ChangeCommand();
      await changeCommand.validate(changeName, options);
      if (typeof process.exitCode === 'number' && process.exitCode !== 0) {
        process.exit(process.exitCode);
      }
    } catch (error) {
      console.error(`错误：${(error as Error).message}`);
      process.exitCode = 1;
    }
  });

program
  .command('archive [change-name]')
  .description('归档已完成的变更，并更新主 specs')
  .option('-y, --yes', '跳过确认提示')
  .option('--skip-specs', '跳过 spec 更新（适用于基础设施、工具或纯文档变更）')
  .option('--no-validate', '跳过校验（不推荐，需确认）')
  .action(async (changeName?: string, options?: { yes?: boolean; skipSpecs?: boolean; noValidate?: boolean; validate?: boolean }) => {
    try {
      const archiveCommand = new ArchiveCommand();
      await archiveCommand.execute(changeName, options);
    } catch (error) {
      console.log(); // Empty line for spacing
      ora().fail(`错误：${(error as Error).message}`);
      process.exit(1);
    }
  });

registerSpecCommand(program);
registerConfigCommand(program);
registerSchemaCommand(program);

// Top-level validate command
program
  .command('validate [item-name]')
  .description('校验 changes 和 specs')
  .option('--all', '校验所有 changes 和 specs')
  .option('--changes', '校验所有 changes')
  .option('--specs', '校验所有 specs')
  .option('--type <type>', '当名称有歧义时指定类型：change|spec')
  .option('--strict', '启用严格校验模式')
  .option('--json', '以 JSON 输出校验结果')
  .option('--concurrency <n>', '最大并发校验数（默认读取环境变量 OPENSPEC_CONCURRENCY 或使用 6）')
  .option('--no-interactive', '关闭交互提示')
  .action(async (itemName?: string, options?: { all?: boolean; changes?: boolean; specs?: boolean; type?: string; strict?: boolean; json?: boolean; noInteractive?: boolean; concurrency?: string }) => {
    try {
      const validateCommand = new ValidateCommand();
      await validateCommand.execute(itemName, options);
    } catch (error) {
      console.log();
      ora().fail(`错误：${(error as Error).message}`);
      process.exit(1);
    }
  });

// Top-level show command
program
  .command('show [item-name]')
  .description('查看 change 或 spec')
  .option('--json', '以 JSON 输出')
  .option('--type <type>', '当名称有歧义时指定类型：change|spec')
  .option('--no-interactive', '关闭交互提示')
  // change-only flags
  .option('--deltas-only', '仅显示差异（仅限 JSON，change）')
  .option('--requirements-only', '--deltas-only 的兼容别名（已废弃，change）')
  // spec-only flags
  .option('--requirements', '仅限 JSON：只显示 requirements（不含 scenarios）')
  .option('--no-scenarios', '仅限 JSON：排除 scenario 内容')
  .option('-r, --requirement <id>', '仅限 JSON：按 ID 显示指定 requirement（从 1 开始）')
  // allow unknown options to pass-through to underlying command implementation
  .allowUnknownOption(true)
  .action(async (itemName?: string, options?: { json?: boolean; type?: string; noInteractive?: boolean; [k: string]: any }) => {
    try {
      const showCommand = new ShowCommand();
      await showCommand.execute(itemName, options ?? {});
    } catch (error) {
      console.log();
      ora().fail(`错误：${(error as Error).message}`);
      process.exit(1);
    }
  });

// Feedback command
program
  .command('feedback <message>')
  .description('提交 OpenSpec 反馈')
  .option('--body <text>', '补充更详细的反馈内容')
  .action(async (message: string, options?: { body?: string }) => {
    try {
      const feedbackCommand = new FeedbackCommand();
      await feedbackCommand.execute(message, options);
    } catch (error) {
      console.log();
      ora().fail(`错误：${(error as Error).message}`);
      process.exit(1);
    }
  });

// Completion command with subcommands
const completionCmd = program
  .command('completion')
  .description('管理 DuowenSpec CLI 的 shell 补全');

completionCmd
  .command('generate [shell]')
  .description('为指定 shell 生成补全脚本（输出到 stdout）')
  .action(async (shell?: string) => {
    try {
      const completionCommand = new CompletionCommand();
      await completionCommand.generate({ shell });
    } catch (error) {
      console.log();
      ora().fail(`错误：${(error as Error).message}`);
      process.exit(1);
    }
  });

completionCmd
  .command('install [shell]')
  .description('为指定 shell 安装补全脚本')
  .option('--verbose', '显示更详细的安装输出')
  .action(async (shell?: string, options?: { verbose?: boolean }) => {
    try {
      const completionCommand = new CompletionCommand();
      await completionCommand.install({ shell, verbose: options?.verbose });
    } catch (error) {
      console.log();
      ora().fail(`错误：${(error as Error).message}`);
      process.exit(1);
    }
  });

completionCmd
  .command('uninstall [shell]')
  .description('卸载指定 shell 的补全脚本')
  .option('-y, --yes', '跳过确认提示')
  .action(async (shell?: string, options?: { yes?: boolean }) => {
    try {
      const completionCommand = new CompletionCommand();
      await completionCommand.uninstall({ shell, yes: options?.yes });
    } catch (error) {
      console.log();
      ora().fail(`错误：${(error as Error).message}`);
      process.exit(1);
    }
  });

// Hidden command for machine-readable completion data
program
  .command('__complete <type>', { hidden: true })
  .description('以机器可读格式输出补全数据（内部使用）')
  .action(async (type: string) => {
    try {
      const completionCommand = new CompletionCommand();
      await completionCommand.complete({ type });
    } catch (error) {
      // Silently fail for graceful shell completion experience
      process.exitCode = 1;
    }
  });

// ═══════════════════════════════════════════════════════════
// Workflow Commands (formerly experimental)
// ═══════════════════════════════════════════════════════════

// Status command
program
  .command('status')
  .description('显示变更的制品完成状态')
  .option('--change <id>', '要查看状态的 change 名称')
  .option('--schema <name>', '覆盖 schema（默认从 config.yaml 自动识别）')
  .option('--json', '以 JSON 输出')
  .action(async (options: StatusOptions) => {
    try {
      await statusCommand(options);
    } catch (error) {
      console.log();
      ora().fail(`错误：${(error as Error).message}`);
      process.exit(1);
    }
  });

// Instructions command
program
  .command('instructions [artifact]')
  .description('输出创建制品或执行任务所需的增强说明')
  .option('--change <id>', 'change 名称')
  .option('--schema <name>', '覆盖 schema（默认从 config.yaml 自动识别）')
  .option('--json', '以 JSON 输出')
  .action(async (artifactId: string | undefined, options: InstructionsOptions) => {
    try {
      // Special case: "apply" is not an artifact, but a command to get apply instructions
      if (artifactId === 'apply') {
        await applyInstructionsCommand(options);
      } else {
        await instructionsCommand(artifactId, options);
      }
    } catch (error) {
      console.log();
      ora().fail(`错误：${(error as Error).message}`);
      process.exit(1);
    }
  });

// Templates command
program
  .command('templates')
  .description('显示指定 schema 下各制品解析后的模板路径')
  .option('--schema <name>', `使用的 schema（默认：${DEFAULT_SCHEMA}）`)
  .option('--json', '以 JSON 输出制品 ID 到模板路径的映射')
  .action(async (options: TemplatesOptions) => {
    try {
      await templatesCommand(options);
    } catch (error) {
      console.log();
      ora().fail(`错误：${(error as Error).message}`);
      process.exit(1);
    }
  });

// Schemas command
program
  .command('schemas')
  .description('列出可用的工作流 schema 及说明')
  .option('--json', '以 JSON 输出（供代理使用）')
  .action(async (options: SchemasOptions) => {
    try {
      await schemasCommand(options);
    } catch (error) {
      console.log();
      ora().fail(`错误：${(error as Error).message}`);
      process.exit(1);
    }
  });

// New command group with change subcommand
const newCmd = program.command('new').description('创建新条目');

newCmd
  .command('change <name>')
  .description('创建新的 change 目录')
  .option('--description <text>', '写入 README.md 的描述')
  .option('--schema <name>', `使用的工作流 schema（默认：${DEFAULT_SCHEMA}）`)
  .action(async (name: string, options: NewChangeOptions) => {
    try {
      await newChangeCommand(name, options);
    } catch (error) {
      console.log();
      ora().fail(`错误：${(error as Error).message}`);
      process.exit(1);
    }
  });

localizeHelpText(program);

program.parse();
