import { Command } from 'commander';
import { spawn, execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  getGlobalConfigPath,
  getGlobalConfig,
  saveGlobalConfig,
  GlobalConfig,
} from '../core/global-config.js';
import type { Profile, Delivery } from '../core/global-config.js';
import {
  getNestedValue,
  setNestedValue,
  deleteNestedValue,
  coerceValue,
  formatValueYaml,
  validateConfigKeyPath,
  validateConfig,
  DEFAULT_CONFIG,
} from '../core/config-schema.js';
import { CORE_WORKFLOWS, ALL_WORKFLOWS, getProfileWorkflows } from '../core/profiles.js';
import { DUOWENSPEC_DIR_NAME } from '../core/config.js';
import { hasProjectConfigDrift } from '../core/profile-sync-drift.js';

type ProfileAction = 'both' | 'delivery' | 'workflows' | 'keep';

interface ProfileState {
  profile: Profile;
  delivery: Delivery;
  workflows: string[];
}

interface ProfileStateDiff {
  hasChanges: boolean;
  lines: string[];
}

interface WorkflowPromptMeta {
  name: string;
  description: string;
}

const WORKFLOW_PROMPT_META: Record<string, WorkflowPromptMeta> = {
  propose: {
    name: '提出变更',
    description: '根据需求生成 proposal、design 和 tasks',
  },
  explore: {
    name: '探索方案',
    description: '在动手前先梳理问题和方向',
  },
  new: {
    name: '新建变更',
    description: '快速创建新的 change 骨架',
  },
  continue: {
    name: '继续变更',
    description: '继续处理已有 change',
  },
  apply: {
    name: '执行任务',
    description: '落实当前 change 中的任务',
  },
  review: {
    name: '审查变更',
    description: '在验证前检查已完成的实现',
  },
  ff: {
    name: '快速推进',
    description: '执行更快的实现流程',
  },
  sync: {
    name: '同步 specs',
    description: '同步 change 制品与 specs',
  },
  archive: {
    name: '归档变更',
    description: '完成并归档一个 change',
  },
  'bulk-archive': {
    name: '批量归档',
    description: '一次归档多个已完成的 change',
  },
  verify: {
    name: '验证变更',
    description: '对 change 执行验证检查',
  },
  document: {
    name: '补齐文档',
    description: '确认发布文档已经完整',
  },
  onboard: {
    name: '上手引导',
    description: 'DuowenSpec 引导式上手流程',
  },
};

function isPromptCancellationError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === 'ExitPromptError' || error.message.includes('force closed the prompt with SIGINT'))
  );
}

/**
 * Resolve the effective current profile state from global config defaults.
 */
export function resolveCurrentProfileState(config: GlobalConfig): ProfileState {
  const profile = config.profile || 'core';
  const delivery = config.delivery || 'both';
  const workflows = [
    ...getProfileWorkflows(profile, config.workflows ? [...config.workflows] : undefined),
  ];
  return { profile, delivery, workflows };
}

/**
 * Derive profile type from selected workflows.
 */
export function deriveProfileFromWorkflowSelection(selectedWorkflows: string[]): Profile {
  const isCoreMatch =
    selectedWorkflows.length === CORE_WORKFLOWS.length &&
    CORE_WORKFLOWS.every((w) => selectedWorkflows.includes(w));
  return isCoreMatch ? 'core' : 'custom';
}

/**
 * Format a compact workflow summary for the profile header.
 */
export function formatWorkflowSummary(workflows: readonly string[], profile: Profile): string {
  return `${workflows.length} selected (${profile})`;
}

function stableWorkflowOrder(workflows: readonly string[]): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];

  for (const workflow of ALL_WORKFLOWS) {
    if (workflows.includes(workflow) && !seen.has(workflow)) {
      ordered.push(workflow);
      seen.add(workflow);
    }
  }

  const extras = workflows.filter((w) => !ALL_WORKFLOWS.includes(w as (typeof ALL_WORKFLOWS)[number]));
  extras.sort();
  for (const extra of extras) {
    if (!seen.has(extra)) {
      ordered.push(extra);
      seen.add(extra);
    }
  }

  return ordered;
}

/**
 * Build a user-facing diff summary between two profile states.
 */
export function diffProfileState(before: ProfileState, after: ProfileState): ProfileStateDiff {
  const lines: string[] = [];

  if (before.delivery !== after.delivery) {
    lines.push(`delivery: ${before.delivery} -> ${after.delivery}`);
  }

  if (before.profile !== after.profile) {
    lines.push(`profile: ${before.profile} -> ${after.profile}`);
  }

  const beforeOrdered = stableWorkflowOrder(before.workflows);
  const afterOrdered = stableWorkflowOrder(after.workflows);
  const beforeSet = new Set(beforeOrdered);
  const afterSet = new Set(afterOrdered);

  const added = afterOrdered.filter((w) => !beforeSet.has(w));
  const removed = beforeOrdered.filter((w) => !afterSet.has(w));

  if (added.length > 0 || removed.length > 0) {
    const tokens: string[] = [];
    if (added.length > 0) {
      tokens.push(`added ${added.join(', ')}`);
    }
    if (removed.length > 0) {
      tokens.push(`removed ${removed.join(', ')}`);
    }
    lines.push(`workflows: ${tokens.join('; ')}`);
  }

  return {
    hasChanges: lines.length > 0,
    lines,
  };
}

function maybeWarnConfigDrift(
  projectDir: string,
  state: ProfileState,
  colorize: (message: string) => string
): void {
  const duowenspecDir = path.join(projectDir, DUOWENSPEC_DIR_NAME);
  if (!fs.existsSync(duowenspecDir)) {
    return;
  }
  if (!hasProjectConfigDrift(projectDir, state.workflows, state.delivery)) {
    return;
  }
  console.log(colorize('警告：当前项目尚未应用全局配置。请运行 `dwsp update` 进行同步。'));
}

/**
 * Register the config command and all its subcommands.
 *
 * @param program - The Commander program instance
 */
export function registerConfigCommand(program: Command): void {
  const configCmd = program
    .command('config')
    .description('查看和修改全局 DuowenSpec 配置')
    .option('--scope <scope>', '配置作用域（当前仅支持 "global"）')
    .hook('preAction', (thisCommand) => {
      const opts = thisCommand.opts();
      if (opts.scope && opts.scope !== 'global') {
        console.error('错误：暂未支持项目级配置');
        process.exit(1);
      }
    });

  // config path
  configCmd
    .command('path')
    .description('显示配置文件位置')
    .action(() => {
      console.log(getGlobalConfigPath());
    });

  // config list
  configCmd
    .command('list')
    .description('显示当前全部配置')
    .option('--json', '以 JSON 输出')
    .action((options: { json?: boolean }) => {
      const config = getGlobalConfig();

      if (options.json) {
        console.log(JSON.stringify(config, null, 2));
      } else {
        // Read raw config to determine which values are explicit vs defaults
        const configPath = getGlobalConfigPath();
        let rawConfig: Record<string, unknown> = {};
        try {
          if (fs.existsSync(configPath)) {
            rawConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
          }
        } catch {
          // If reading fails, treat all as defaults
        }

        console.log(formatValueYaml(config));

        // Annotate profile settings
        const profileSource = rawConfig.profile !== undefined ? '(显式设置)' : '(默认值)';
        const deliverySource = rawConfig.delivery !== undefined ? '(显式设置)' : '(默认值)';
        console.log(`\nProfile 设置：`);
        console.log(`  profile: ${config.profile} ${profileSource}`);
        console.log(`  delivery: ${config.delivery} ${deliverySource}`);
        if (config.profile === 'core') {
          console.log(`  workflows: ${CORE_WORKFLOWS.join(', ')} (来自 core profile)`);
        } else if (config.workflows && config.workflows.length > 0) {
          console.log(`  workflows: ${config.workflows.join(', ')} (显式设置)`);
        } else {
          console.log(`  workflows: （无）`);
        }
      }
    });

  // config get
  configCmd
    .command('get <key>')
    .description('读取指定配置值（原始输出，便于脚本使用）')
    .action((key: string) => {
      const config = getGlobalConfig();
      const value = getNestedValue(config as Record<string, unknown>, key);

      if (value === undefined) {
        process.exitCode = 1;
        return;
      }

      if (typeof value === 'object' && value !== null) {
        console.log(JSON.stringify(value));
      } else {
        console.log(String(value));
      }
    });

  // config set
  configCmd
    .command('set <key> <value>')
    .description('设置配置值（自动识别类型）')
    .option('--string', '强制按字符串保存')
    .option('--allow-unknown', '允许设置未知键')
    .action((key: string, value: string, options: { string?: boolean; allowUnknown?: boolean }) => {
      const allowUnknown = Boolean(options.allowUnknown);
      const keyValidation = validateConfigKeyPath(key);
      if (!keyValidation.valid && !allowUnknown) {
        const reason = keyValidation.reason ? ` ${keyValidation.reason}.` : '';
        console.error(`错误：无效配置键 "${key}"。${reason}`);
        console.error('可运行 "dwsp config list" 查看可用键。');
        console.error('如需跳过检查，可传入 --allow-unknown。');
        process.exitCode = 1;
        return;
      }

      const config = getGlobalConfig() as Record<string, unknown>;
      const coercedValue = coerceValue(value, options.string || false);

      // Create a copy to validate before saving
      const newConfig = JSON.parse(JSON.stringify(config));
      setNestedValue(newConfig, key, coercedValue);

      // Validate the new config
      const validation = validateConfig(newConfig);
      if (!validation.success) {
        console.error(`错误：配置无效 - ${validation.error}`);
        process.exitCode = 1;
        return;
      }

      // Apply changes and save
      setNestedValue(config, key, coercedValue);
      saveGlobalConfig(config as GlobalConfig);

      const displayValue =
        typeof coercedValue === 'string' ? `"${coercedValue}"` : String(coercedValue);
      console.log(`已设置 ${key} = ${displayValue}`);
    });

  // config unset
  configCmd
    .command('unset <key>')
    .description('移除配置键（恢复默认值）')
    .action((key: string) => {
      const config = getGlobalConfig() as Record<string, unknown>;
      const existed = deleteNestedValue(config, key);

      if (existed) {
        saveGlobalConfig(config as GlobalConfig);
        console.log(`已移除 ${key}（已恢复默认值）`);
      } else {
        console.log(`键 "${key}" 当前未设置`);
      }
    });

  // config reset
  configCmd
    .command('reset')
    .description('将配置重置为默认值')
    .option('--all', '重置全部配置（必填）')
    .option('-y, --yes', '跳过确认提示')
    .action(async (options: { all?: boolean; yes?: boolean }) => {
      if (!options.all) {
        console.error('错误：执行 reset 时必须传入 --all');
        console.error('用法：dwsp config reset --all [-y]');
        process.exitCode = 1;
        return;
      }

      if (!options.yes) {
        const { confirm } = await import('@inquirer/prompts');
        let confirmed: boolean;
        try {
          confirmed = await confirm({
            message: '确认将全部配置重置为默认值？',
            default: false,
          });
        } catch (error) {
          if (isPromptCancellationError(error)) {
            console.log('已取消重置。');
            process.exitCode = 130;
            return;
          }
          throw error;
        }

        if (!confirmed) {
          console.log('已取消重置。');
          return;
        }
      }

      saveGlobalConfig({ ...DEFAULT_CONFIG });
      console.log('配置已重置为默认值');
    });

  // config edit
  configCmd
    .command('edit')
    .description('用 $EDITOR 打开配置文件')
    .action(async () => {
      const editor = process.env.EDITOR || process.env.VISUAL;

      if (!editor) {
        console.error('错误：未配置编辑器');
        console.error('请设置 EDITOR 或 VISUAL 环境变量');
        console.error('例如：export EDITOR=vim');
        process.exitCode = 1;
        return;
      }

      const configPath = getGlobalConfigPath();

      // Ensure config file exists with defaults
      if (!fs.existsSync(configPath)) {
        saveGlobalConfig({ ...DEFAULT_CONFIG });
      }

      // Spawn editor and wait for it to close
      // Avoid shell parsing to correctly handle paths with spaces in both
      // the editor path and config path
      const child = spawn(editor, [configPath], {
        stdio: 'inherit',
        shell: false,
      });

      await new Promise<void>((resolve, reject) => {
        child.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Editor exited with code ${code}`));
          }
        });
        child.on('error', reject);
      });

      try {
        const rawConfig = fs.readFileSync(configPath, 'utf-8');
        const parsedConfig = JSON.parse(rawConfig);
        const validation = validateConfig(parsedConfig);

        if (!validation.success) {
          console.error(`错误：配置无效 - ${validation.error}`);
          process.exitCode = 1;
        }
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          console.error(`错误：未找到配置文件：${configPath}`);
        } else if (error instanceof SyntaxError) {
          console.error(`错误：${configPath} 中的 JSON 不合法`);
          console.error(error.message);
        } else {
          console.error(`错误：无法校验配置 - ${error instanceof Error ? error.message : String(error)}`);
        }
        process.exitCode = 1;
      }
    });

  // config profile [preset]
  configCmd
    .command('profile [preset]')
    .description('配置工作流 profile（可交互选择，也可用预设快捷方式）')
    .action(async (preset?: string) => {
      // Backward-compatible preset shortcut.
      if (preset === 'core') {
        const config = getGlobalConfig();
        config.profile = 'core';
        config.workflows = [...CORE_WORKFLOWS];
        // Preserve delivery setting
        saveGlobalConfig(config);
        console.log('配置已更新。请在项目中运行 `dwsp update` 使其生效。');
        return;
      }

      if (preset) {
        console.error(`错误：未知 profile 预设 "${preset}"。`);
        process.exitCode = 1;
        return;
      }

      // Non-interactive check
      if (!process.stdout.isTTY) {
        console.error('该命令需要交互模式。请直接运行 `dwsp config profile`，或改用文件/参数更新配置。');
        process.exitCode = 1;
        return;
      }

      // Interactive picker
      const { select, checkbox, confirm } = await import('@inquirer/prompts');
      const chalk = (await import('chalk')).default;

      try {
        const config = getGlobalConfig();
        const currentState = resolveCurrentProfileState(config);

        console.log(chalk.bold('\n当前 profile 设置'));
        console.log(`  Delivery: ${currentState.delivery}`);
        console.log(`  Workflows: ${formatWorkflowSummary(currentState.workflows, currentState.profile)}`);
        console.log(chalk.dim('  Delivery = 工作流安装到哪里（skills、commands 或两者都有）'));
        console.log(chalk.dim('  Workflows = 可用动作有哪些（propose、explore、apply 等）'));
        console.log();

        const action = await select<ProfileAction>({
          message: '你想调整哪一部分？',
          choices: [
            {
              value: 'both',
              name: '同时调整 Delivery 和 Workflows',
              description: '一起更新安装方式和可用动作',
            },
            {
              value: 'delivery',
              name: '只调整 Delivery',
              description: '修改工作流安装位置',
            },
            {
              value: 'workflows',
              name: '只调整 Workflows',
              description: '修改可用的工作流动作',
            },
            {
              value: 'keep',
              name: '保持不变并退出',
              description: '不修改配置，直接退出',
            },
          ],
        });

        if (action === 'keep') {
          console.log('配置未发生变化。');
          maybeWarnConfigDrift(process.cwd(), currentState, chalk.yellow);
          return;
        }

        const nextState: ProfileState = {
          profile: currentState.profile,
          delivery: currentState.delivery,
          workflows: [...currentState.workflows],
        };

        if (action === 'both' || action === 'delivery') {
          const deliveryChoices: { value: Delivery; name: string; description: string }[] = [
            {
              value: 'both' as Delivery,
              name: '同时安装 skills 和 commands',
              description: '把工作流同时装为 skills 和 slash commands',
            },
            {
              value: 'skills' as Delivery,
              name: '只安装 skills',
              description: '只把工作流装为 skills',
            },
            {
              value: 'commands' as Delivery,
              name: '只安装 commands',
              description: '只把工作流装为 slash commands',
            },
          ];
          for (const choice of deliveryChoices) {
            if (choice.value === currentState.delivery) {
              choice.name += ' [当前]';
            }
          }

          nextState.delivery = await select<Delivery>({
            message: 'Delivery 模式（工作流如何安装）：',
            choices: deliveryChoices,
            default: currentState.delivery,
          });
        }

        if (action === 'both' || action === 'workflows') {
          const formatWorkflowChoice = (workflow: string) => {
            const metadata = WORKFLOW_PROMPT_META[workflow] ?? {
              name: workflow,
              description: `Workflow: ${workflow}`,
            };
            return {
              value: workflow,
              name: metadata.name,
              description: metadata.description,
              short: metadata.name,
              checked: currentState.workflows.includes(workflow),
            };
          };

          const selectedWorkflows = await checkbox<string>({
            message: '请选择要启用的 workflows：',
            instructions: '空格切换，回车确认',
            pageSize: ALL_WORKFLOWS.length,
            theme: {
              icon: {
                checked: '[x]',
                unchecked: '[ ]',
              },
            },
            choices: ALL_WORKFLOWS.map(formatWorkflowChoice),
          });
          nextState.workflows = selectedWorkflows;
          nextState.profile = deriveProfileFromWorkflowSelection(selectedWorkflows);
        }

        const diff = diffProfileState(currentState, nextState);
        if (!diff.hasChanges) {
          console.log('配置未发生变化。');
          maybeWarnConfigDrift(process.cwd(), nextState, chalk.yellow);
          return;
        }

        console.log(chalk.bold('\n配置变更：'));
        for (const line of diff.lines) {
          console.log(`  ${line}`);
        }
        console.log();

        config.profile = nextState.profile;
        config.delivery = nextState.delivery;
        config.workflows = nextState.workflows;
        saveGlobalConfig(config);

        // Check if inside an DuowenSpec project
        const projectDir = process.cwd();
        const duowenspecDir = path.join(projectDir, DUOWENSPEC_DIR_NAME);
        if (fs.existsSync(duowenspecDir)) {
          const applyNow = await confirm({
            message: '现在就把改动应用到当前项目吗？',
            default: true,
          });

          if (applyNow) {
            try {
              execSync('npx dwsp update', { stdio: 'inherit', cwd: projectDir });
              console.log('其他项目请自行运行 `dwsp update` 使配置生效。');
            } catch {
              console.error('`dwsp update` 执行失败，请手动运行以应用 profile 改动。');
              process.exitCode = 1;
            }
            return;
          }
        }

        console.log('配置已更新。请在项目中运行 `dwsp update` 使其生效。');
      } catch (error) {
        if (isPromptCancellationError(error)) {
          console.log('已取消 profile 配置。');
          process.exitCode = 130;
          return;
        }
        throw error;
      }
    });
}
