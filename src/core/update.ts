/**
 * Update Command
 *
 * Refreshes OpenSpec skills and commands for configured tools.
 * Supports profile-aware updates, delivery changes, migration, and smart update detection.
 */

import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import * as fs from 'fs';
import { createRequire } from 'module';
import { FileSystemUtils } from '../utils/file-system.js';
import { transformToHyphenCommands } from '../utils/command-references.js';
import { AI_TOOLS, OPENSPEC_DIR_NAME } from './config.js';
import {
  generateCommands,
  CommandAdapterRegistry,
} from './command-generation/index.js';
import {
  getToolVersionStatus,
  getSkillTemplates,
  getEnterpriseCapabilitySkillTemplates,
  getModoSupportSkillTemplates,
  MODO_SUPPORT_SKILL_DIRS,
  getCommandContents,
  generateSkillContent,
  getToolsWithSkillsDir,
  type ToolVersionStatus,
} from './shared/index.js';
import {
  detectLegacyArtifacts,
  cleanupLegacyArtifacts,
  formatCleanupSummary,
  formatDetectionSummary,
  getToolsFromLegacyArtifacts,
  type LegacyDetectionResult,
} from './legacy-cleanup.js';
import { isInteractive } from '../utils/interactive.js';
import { getGlobalConfig, type Delivery } from './global-config.js';
import { getProfileWorkflows, ALL_WORKFLOWS } from './profiles.js';
import { getAvailableTools } from './available-tools.js';
import {
  WORKFLOW_TO_SKILL_DIR,
  getCommandConfiguredTools,
  getConfiguredToolsForProfileSync,
  getToolsNeedingProfileSync,
} from './profile-sync-drift.js';
import {
  scanInstalledWorkflows as scanInstalledWorkflowsShared,
  migrateIfNeeded as migrateIfNeededShared,
} from './migration.js';
import { CLI_COMMAND } from './app-info.js';
import { assertEnterpriseCapabilitiesAvailable } from './enterprise-capability-preflight.js';
import { syncProjectInstructionFiles, type SyncProjectInstructionFilesResult } from './project-instruction-files.js';
import {
  getAllEnterpriseCapabilitySkillDirNames,
  getBundledEnterpriseCapabilitySkillDirNames,
} from './enterprise-capability-skills.js';
import { isModoScaffoldProject, readModoAgentsTemplate } from './scaffold/index.js';

const require = createRequire(import.meta.url);
const { version: OPENSPEC_VERSION } = require('../../package.json');

/**
 * Options for the update command.
 */
export interface UpdateCommandOptions {
  /** Force update even when tools are up to date */
  force?: boolean;
}

/**
 * Scans installed workflow artifacts (skills and managed commands) across all configured tools.
 * Returns the union of detected workflow IDs that match ALL_WORKFLOWS.
 *
 * Wrapper around the shared migration module's scanInstalledWorkflows that accepts tool IDs.
 */
export function scanInstalledWorkflows(projectPath: string, toolIds: string[]): string[] {
  const tools = toolIds
    .map((id) => AI_TOOLS.find((t) => t.value === id))
    .filter((t): t is NonNullable<typeof t> => t != null);
  return scanInstalledWorkflowsShared(projectPath, tools);
}

export class UpdateCommand {
  private readonly force: boolean;

  constructor(options: UpdateCommandOptions = {}) {
    this.force = options.force ?? false;
  }

  async execute(projectPath: string): Promise<void> {
    const resolvedProjectPath = path.resolve(projectPath);
    const openspecPath = path.join(resolvedProjectPath, OPENSPEC_DIR_NAME);

    // 1. Check dwsp directory exists
    if (!await FileSystemUtils.directoryExists(openspecPath)) {
      throw new Error("未找到 OpenSpec 目录。请先运行 'dwsp init'。");
    }

    // 2. Perform one-time migration if needed before any legacy upgrade generation.
    // Use detected tool directories to preserve existing opsx skills/commands.
    const detectedTools = getAvailableTools(resolvedProjectPath);
    migrateIfNeededShared(resolvedProjectPath, detectedTools);

    // 3. Read global config for profile/delivery
    const globalConfig = getGlobalConfig();
    const profile = globalConfig.profile ?? 'custom';
    const delivery: Delivery = globalConfig.delivery ?? 'both';
    const profileWorkflows = getProfileWorkflows(profile, globalConfig.workflows);
    const desiredWorkflows = profileWorkflows.filter((workflow): workflow is (typeof ALL_WORKFLOWS)[number] =>
      (ALL_WORKFLOWS as readonly string[]).includes(workflow)
    );
    const shouldGenerateSkills = delivery !== 'commands';
    const shouldGenerateCommands = delivery !== 'skills';
    const modoProject = await isModoScaffoldProject(resolvedProjectPath);

    // 4. Detect and handle legacy artifacts + upgrade legacy tools using effective config
    const newlyConfiguredTools = await this.handleLegacyCleanup(
      resolvedProjectPath,
      desiredWorkflows,
      delivery
    );

    // 5. Find configured tools
    const configuredTools = getConfiguredToolsForProfileSync(resolvedProjectPath);

    if (configuredTools.length === 0 && newlyConfiguredTools.length === 0) {
      const scaffoldInstructionStatus = await this.ensureScaffoldInstructionFiles(resolvedProjectPath);
      this.displayScaffoldInstructionMessage(scaffoldInstructionStatus);
      console.log(chalk.yellow('未找到已配置的工具。'));
      console.log(chalk.dim('请运行 "dwsp init" 完成工具初始化。'));
      return;
    }

    // 6. Check version status for all configured tools
    const commandConfiguredTools = getCommandConfiguredTools(resolvedProjectPath);
    const commandConfiguredSet = new Set(commandConfiguredTools);
    const toolStatuses = configuredTools.map((toolId) => {
      const status = getToolVersionStatus(resolvedProjectPath, toolId, OPENSPEC_VERSION);
      if (!status.configured && commandConfiguredSet.has(toolId)) {
        return { ...status, configured: true };
      }
      return status;
    });
    const statusByTool = new Map(toolStatuses.map((status) => [status.toolId, status] as const));

    // 7. Smart update detection
    const toolsNeedingVersionUpdate = toolStatuses
      .filter((s) => s.needsUpdate)
      .map((s) => s.toolId);
    const toolsNeedingConfigSync = getToolsNeedingProfileSync(
      resolvedProjectPath,
      desiredWorkflows,
      delivery,
      configuredTools
    );
    const toolsToUpdateSet = new Set<string>([
      ...toolsNeedingVersionUpdate,
      ...toolsNeedingConfigSync,
      ...(modoProject ? this.getToolsMissingModoSupportSkills(resolvedProjectPath, configuredTools) : []),
    ]);
    const toolsUpToDate = toolStatuses.filter((s) => !toolsToUpdateSet.has(s.toolId));

    if (!this.force && toolsToUpdateSet.size === 0) {
      // All tools are up to date
      this.displayUpToDateMessage(toolStatuses);
      const scaffoldInstructionStatus = await this.ensureScaffoldInstructionFiles(resolvedProjectPath);
      this.displayScaffoldInstructionMessage(scaffoldInstructionStatus);

      // Still check for new tool directories and extra workflows
      this.detectNewTools(resolvedProjectPath, configuredTools);
      this.displayExtraWorkflowsNote(resolvedProjectPath, configuredTools, desiredWorkflows);
      return;
    }

    assertEnterpriseCapabilitiesAvailable(desiredWorkflows);

    // 8. Display update plan
    if (this.force) {
      console.log(`强制更新 ${configuredTools.length} 个工具：${configuredTools.join(', ')}`);
    } else {
      this.displayUpdatePlan([...toolsToUpdateSet], statusByTool, toolsUpToDate);
    }
    console.log();

    // 9. Determine what to generate based on delivery
    const workflowSkillTemplates = shouldGenerateSkills ? getSkillTemplates(desiredWorkflows) : [];
    const capabilitySkillTemplates = getEnterpriseCapabilitySkillTemplates(desiredWorkflows);
    const modoSupportSkillTemplates = modoProject ? getModoSupportSkillTemplates() : [];
    const skillTemplates = [...workflowSkillTemplates, ...capabilitySkillTemplates, ...modoSupportSkillTemplates];
    const shouldGenerateAnySkills = skillTemplates.length > 0;
    const commandContents = shouldGenerateCommands ? getCommandContents(desiredWorkflows) : [];

    // 10. Update tools (all if force, otherwise only those needing update)
    const toolsToUpdate = this.force ? configuredTools : [...toolsToUpdateSet];
    const updatedTools: string[] = [];
    const failedTools: Array<{ name: string; error: string }> = [];
    let removedCommandCount = 0;
    let removedSkillCount = 0;
    let removedDeselectedCommandCount = 0;
    let removedDeselectedSkillCount = 0;

    for (const toolId of toolsToUpdate) {
      const tool = AI_TOOLS.find((t) => t.value === toolId);
      if (!tool?.skillsDir) continue;

      const spinner = ora(`正在更新 ${tool.name}...`).start();

      try {
        const skillsDir = path.join(resolvedProjectPath, tool.skillsDir, 'skills');

        // Generate workflow skills, enterprise capability skills, and any MODO support skills.
        if (shouldGenerateAnySkills) {
          for (const { template, dirName } of skillTemplates) {
            const skillDir = path.join(skillsDir, dirName);
            const skillFile = path.join(skillDir, 'SKILL.md');

            // Use hyphen-based command references for OpenCode
            const transformer = tool.value === 'opencode' ? transformToHyphenCommands : undefined;
            const skillContent = generateSkillContent(template, OPENSPEC_VERSION, transformer);
            await FileSystemUtils.writeFile(skillFile, skillContent);
          }

          if (shouldGenerateSkills) {
            removedDeselectedSkillCount += await this.removeUnselectedSkillDirs(skillsDir, desiredWorkflows);
          }
        }

        removedDeselectedSkillCount += await this.removeUnselectedCapabilitySkillDirs(skillsDir, desiredWorkflows);

        // Commands-only mode still keeps MODO support skills, but removes workflow skills.
        if (!shouldGenerateSkills) {
          removedSkillCount += await this.removeSkillDirs(skillsDir, modoProject);
        }

        // Generate commands if delivery includes commands
        if (shouldGenerateCommands) {
          const adapter = CommandAdapterRegistry.get(tool.value);
          if (adapter) {
            const generatedCommands = generateCommands(commandContents, adapter);

            for (const cmd of generatedCommands) {
              const commandFile = path.isAbsolute(cmd.path) ? cmd.path : path.join(resolvedProjectPath, cmd.path);
              await FileSystemUtils.writeFile(commandFile, cmd.fileContent);
            }

            removedDeselectedCommandCount += await this.removeUnselectedCommandFiles(
              resolvedProjectPath,
              toolId,
              desiredWorkflows
            );
          }
        }

        // Delete command files if delivery is skills-only
        if (!shouldGenerateCommands) {
          removedCommandCount += await this.removeCommandFiles(resolvedProjectPath, toolId);
        }

        spinner.succeed(`${tool.name} 已更新`);
        updatedTools.push(tool.name);
      } catch (error) {
        spinner.fail(`${tool.name} 更新失败`);
        failedTools.push({
          name: tool.name,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    const scaffoldInstructionStatus = await this.ensureScaffoldInstructionFiles(resolvedProjectPath);

    // 11. Summary
    console.log();
    if (updatedTools.length > 0) {
      console.log(chalk.green(`✓ 已更新：${updatedTools.join(', ')}（v${OPENSPEC_VERSION}）`));
    }
    if (failedTools.length > 0) {
      console.log(chalk.red(`✗ 失败：${failedTools.map(f => `${f.name}（${f.error}）`).join(', ')}`));
    }
    if (removedCommandCount > 0) {
      console.log(chalk.dim(`已移除 ${removedCommandCount} 个 prompt 文件（当前仅保留 skills）`));
    }
    if (removedSkillCount > 0) {
      console.log(chalk.dim(`已移除 ${removedSkillCount} 个 skill 目录（当前仅保留 prompts）`));
    }
    if (removedDeselectedCommandCount > 0) {
      console.log(chalk.dim(`已移除 ${removedDeselectedCommandCount} 个未选中的 prompt 文件`));
    }
    if (removedDeselectedSkillCount > 0) {
      console.log(chalk.dim(`已移除 ${removedDeselectedSkillCount} 个未选中的 skill 目录`));
    }
    this.displayScaffoldInstructionMessage(scaffoldInstructionStatus);

    // 12. Show onboarding message for newly configured tools from legacy upgrade
    if (newlyConfiguredTools.length > 0) {
      console.log();
      console.log(chalk.bold('开始使用：'));
      console.log(`  /${CLI_COMMAND}:propose   发起一份提案`);
      console.log(`  /${CLI_COMMAND}:apply     执行已确认的任务`);
      console.log(`  /${CLI_COMMAND}:review    进入审查检查点`);
      console.log(`  /${CLI_COMMAND}:verify    进入发布前验证`);
      console.log(`  /${CLI_COMMAND}:document  完成交付文档检查`);
      console.log();
      console.log(`了解更多：${chalk.cyan('https://github.com/Fission-AI/DuowenSpec')}`);
    }

    const configuredAndNewTools = [...new Set([...configuredTools, ...newlyConfiguredTools])];

    // 13. Detect new tool directories not currently configured
    this.detectNewTools(resolvedProjectPath, configuredAndNewTools);

    // 14. Display note about extra workflows not in profile
    this.displayExtraWorkflowsNote(resolvedProjectPath, configuredAndNewTools, desiredWorkflows);

    // 15. List affected tools
    if (updatedTools.length > 0) {
      const toolDisplayNames = updatedTools;
      console.log(chalk.dim(`涉及工具：${toolDisplayNames.join(', ')}`));
    }

    console.log();
    console.log(chalk.dim('请重启你的 IDE，让变更生效。'));
  }

  /**
   * Display message when all tools are up to date.
   */
  private displayUpToDateMessage(toolStatuses: ToolVersionStatus[]): void {
    const toolNames = toolStatuses.map((s) => s.toolId);
    console.log(chalk.green(`✓ ${toolStatuses.length} 个工具都已是最新状态（v${OPENSPEC_VERSION}）`));
    console.log(chalk.dim(`  工具：${toolNames.join(', ')}`));
    console.log();
    console.log(chalk.dim('如需强制重写文件，可使用 --force。'));
  }

  /**
   * Display the update plan showing which tools need updating.
   */
  private displayUpdatePlan(
    toolsToUpdate: string[],
    statusByTool: Map<string, ToolVersionStatus>,
    upToDate: ToolVersionStatus[]
  ): void {
    const updates = toolsToUpdate.map((toolId) => {
      const status = statusByTool.get(toolId);
      if (status?.needsUpdate) {
        const fromVersion = status.generatedByVersion ?? 'unknown';
        return `${status.toolId} (${fromVersion} → ${OPENSPEC_VERSION})`;
      }
      return `${toolId}（配置同步）`;
    });

    console.log(`准备更新 ${toolsToUpdate.length} 个工具：${updates.join(', ')}`);

    if (upToDate.length > 0) {
      const upToDateNames = upToDate.map((s) => s.toolId);
      console.log(chalk.dim(`已是最新：${upToDateNames.join(', ')}`));
    }
  }

  /**
   * Detects new tool directories that aren't currently configured and displays a hint.
   */
  private detectNewTools(projectPath: string, configuredTools: string[]): void {
    const availableTools = getAvailableTools(projectPath);
    const configuredSet = new Set(configuredTools);

    const newTools = availableTools.filter((t) => !configuredSet.has(t.value));

    if (newTools.length > 0) {
      const newToolNames = newTools.map((tool) => tool.name);
      const isSingleTool = newToolNames.length === 1;
      const pronoun = isSingleTool ? '它' : '它们';
      console.log();
      console.log(
        chalk.yellow(
          `检测到新的工具目录：${newToolNames.join(', ')}。请运行 'dwsp init' 把${pronoun}加入配置。`
        )
      );
    }
  }

  /**
   * Displays a note about extra workflows installed that aren't in the current profile.
   */
  private displayExtraWorkflowsNote(
    projectPath: string,
    configuredTools: string[],
    profileWorkflows: readonly string[]
  ): void {
    const installedWorkflows = scanInstalledWorkflows(projectPath, configuredTools);
    const profileSet = new Set(profileWorkflows);
    const extraWorkflows = installedWorkflows.filter((w) => !profileSet.has(w));

    if (extraWorkflows.length > 0) {
      console.log(chalk.dim(`提示：发现 ${extraWorkflows.length} 个不在当前 profile 中的额外工作流（可用 \`dwsp config profile\` 管理）`));
    }
  }

  /**
   * Removes skill directories for workflows when delivery changed to commands-only.
   * Returns the number of directories removed.
   */
  private async removeSkillDirs(skillsDir: string, _modoProject: boolean): Promise<number> {
    let removed = 0;

    for (const workflow of ALL_WORKFLOWS) {
      const dirName = WORKFLOW_TO_SKILL_DIR[workflow];
      if (!dirName) continue;

      const skillDir = path.join(skillsDir, dirName);
      try {
        if (fs.existsSync(skillDir)) {
          await fs.promises.rm(skillDir, { recursive: true, force: true });
          removed++;
        }
      } catch {
        // Ignore errors
      }
    }

    return removed;
  }

  private getToolsMissingModoSupportSkills(projectPath: string, configuredTools: string[]): string[] {
    const missing: string[] = [];

    for (const toolId of configuredTools) {
      const tool = AI_TOOLS.find((candidate) => candidate.value === toolId);
      if (!tool?.skillsDir) continue;

      const toolSkillsDir = path.join(projectPath, tool.skillsDir, 'skills');
      const isMissingAnySupportSkill = MODO_SUPPORT_SKILL_DIRS.some((dirName) =>
        !fs.existsSync(path.join(toolSkillsDir, dirName, 'SKILL.md'))
      );

      if (isMissingAnySupportSkill) {
        missing.push(toolId);
      }
    }

    return missing;
  }

  /**
   * Removes skill directories for workflows that are no longer selected in the active profile.
   * Returns the number of directories removed.
   */
  private async removeUnselectedSkillDirs(
    skillsDir: string,
    desiredWorkflows: readonly (typeof ALL_WORKFLOWS)[number][]
  ): Promise<number> {
    const desiredSet = new Set(desiredWorkflows);
    let removed = 0;

    for (const workflow of ALL_WORKFLOWS) {
      if (desiredSet.has(workflow)) continue;
      const dirName = WORKFLOW_TO_SKILL_DIR[workflow];
      if (!dirName) continue;

      const skillDir = path.join(skillsDir, dirName);
      try {
        if (fs.existsSync(skillDir)) {
          await fs.promises.rm(skillDir, { recursive: true, force: true });
          removed++;
        }
      } catch {
        // Ignore errors
      }
    }

    return removed;
  }

  private async removeUnselectedCapabilitySkillDirs(
    skillsDir: string,
    desiredWorkflows: readonly (typeof ALL_WORKFLOWS)[number][]
  ): Promise<number> {
    const desiredSet = new Set(getBundledEnterpriseCapabilitySkillDirNames(desiredWorkflows));
    let removed = 0;

    for (const dirName of getAllEnterpriseCapabilitySkillDirNames()) {
      if (desiredSet.has(dirName)) continue;
      const skillDir = path.join(skillsDir, dirName);
      try {
        if (fs.existsSync(skillDir)) {
          await fs.promises.rm(skillDir, { recursive: true, force: true });
          removed++;
        }
      } catch {
        // Ignore errors
      }
    }

    return removed;
  }

  /**
   * Removes command files for workflows when delivery changed to skills-only.
   * Returns the number of files removed.
   */
  private async removeCommandFiles(
    projectPath: string,
    toolId: string,
  ): Promise<number> {
    let removed = 0;

    const adapter = CommandAdapterRegistry.get(toolId);
    if (!adapter) return 0;

    for (const workflow of ALL_WORKFLOWS) {
      const cmdPath = adapter.getFilePath(workflow);
      const fullPath = path.isAbsolute(cmdPath) ? cmdPath : path.join(projectPath, cmdPath);

      try {
        if (fs.existsSync(fullPath)) {
          await fs.promises.unlink(fullPath);
          removed++;
        }
      } catch {
        // Ignore errors
      }
    }

    return removed;
  }

  /**
   * Removes command files for workflows that are no longer selected in the active profile.
   * Returns the number of files removed.
   */
  private async removeUnselectedCommandFiles(
    projectPath: string,
    toolId: string,
    desiredWorkflows: readonly (typeof ALL_WORKFLOWS)[number][]
  ): Promise<number> {
    let removed = 0;

    const adapter = CommandAdapterRegistry.get(toolId);
    if (!adapter) return 0;

    const desiredSet = new Set(desiredWorkflows);

    for (const workflow of ALL_WORKFLOWS) {
      if (desiredSet.has(workflow)) continue;
      const cmdPath = adapter.getFilePath(workflow);
      const fullPath = path.isAbsolute(cmdPath) ? cmdPath : path.join(projectPath, cmdPath);

      try {
        if (fs.existsSync(fullPath)) {
          await fs.promises.unlink(fullPath);
          removed++;
        }
      } catch {
        // Ignore errors
      }
    }

    return removed;
  }

  /**
   * Detect and handle legacy OpenSpec artifacts.
   * Unlike init, update warns but continues if legacy files found in non-interactive mode.
   * Returns array of tool IDs that were newly configured during legacy upgrade.
   */
  private async handleLegacyCleanup(
    projectPath: string,
    desiredWorkflows: readonly (typeof ALL_WORKFLOWS)[number][],
    delivery: Delivery
  ): Promise<string[]> {
    // Detect legacy artifacts
    const detection = await detectLegacyArtifacts(projectPath);

    if (!detection.hasLegacyArtifacts) {
      return []; // No legacy artifacts found
    }

    // Show what was detected
    console.log();
    console.log(formatDetectionSummary(detection));
    console.log();

    const canPrompt = isInteractive();

    if (this.force) {
      // --force flag: proceed with cleanup automatically
      await this.performLegacyCleanup(projectPath, detection);
      // Then upgrade legacy tools to new skills
      return this.upgradeLegacyTools(projectPath, detection, canPrompt, desiredWorkflows, delivery);
    }

    if (!canPrompt) {
      // Non-interactive mode without --force: warn and continue
      // (Unlike init, update doesn't abort - user may just want to update skills)
      console.log(chalk.yellow('⚠ 检测到旧版遗留文件。可使用 --force 自动清理，或切换到交互模式处理。'));
      console.log();
      return [];
    }

    // Interactive mode: prompt for confirmation
    const { confirm } = await import('@inquirer/prompts');
    const shouldCleanup = await confirm({
      message: '是否升级并清理旧版遗留文件？',
      default: true,
    });

    if (shouldCleanup) {
      await this.performLegacyCleanup(projectPath, detection);
      // Then upgrade legacy tools to new skills
      return this.upgradeLegacyTools(projectPath, detection, canPrompt, desiredWorkflows, delivery);
    } else {
      console.log(chalk.dim('已跳过旧版清理，继续刷新 skill 和 prompt。'));
      console.log();
      return [];
    }
  }

  /**
   * Perform cleanup of legacy artifacts.
   */
  private async performLegacyCleanup(projectPath: string, detection: LegacyDetectionResult): Promise<void> {
    const spinner = ora('正在清理旧版遗留文件...').start();

    const result = await cleanupLegacyArtifacts(projectPath, detection);

    spinner.succeed('旧版遗留文件已清理');

    const summary = formatCleanupSummary(result);
    if (summary) {
      console.log();
      console.log(summary);
    }

    console.log();
  }

  /**
   * Upgrade legacy tools to new skills system.
   * Returns array of tool IDs that were newly configured.
   */
  private async upgradeLegacyTools(
    projectPath: string,
    detection: LegacyDetectionResult,
    canPrompt: boolean,
    desiredWorkflows: readonly (typeof ALL_WORKFLOWS)[number][],
    delivery: Delivery
  ): Promise<string[]> {
    const modoProject = await isModoScaffoldProject(projectPath);
    // Get tools that had legacy artifacts
    const legacyTools = getToolsFromLegacyArtifacts(detection);

    if (legacyTools.length === 0) {
      return [];
    }

    // Get currently configured tools
    const configuredTools = getConfiguredToolsForProfileSync(projectPath);
    const configuredSet = new Set(configuredTools);

    // Filter to tools that aren't already configured
    const unconfiguredLegacyTools = legacyTools.filter((t) => !configuredSet.has(t));

    if (unconfiguredLegacyTools.length === 0) {
      return [];
    }

    // Get valid tools (those with skillsDir)
    const validToolIds = new Set(getToolsWithSkillsDir());
    const validUnconfiguredTools = unconfiguredLegacyTools.filter((t) => validToolIds.has(t));

    if (validUnconfiguredTools.length === 0) {
      return [];
    }

    // Show what tools were detected from legacy artifacts
    console.log(chalk.bold('从旧版遗留文件中识别到以下工具：'));
    for (const toolId of validUnconfiguredTools) {
      const tool = AI_TOOLS.find((t) => t.value === toolId);
      console.log(`  • ${tool?.name || toolId}`);
    }
    console.log();

    let selectedTools: string[];

    if (this.force || !canPrompt) {
      // Non-interactive with --force: auto-select detected tools
      selectedTools = validUnconfiguredTools;
      console.log(`将为以下工具补建技能文件：${selectedTools.join(', ')}`);
    } else {
      // Interactive mode: prompt for tool selection with detected tools pre-selected
      const { searchableMultiSelect } = await import('../prompts/searchable-multi-select.js');

      const sortedChoices = validUnconfiguredTools.map((toolId) => {
        const tool = AI_TOOLS.find((t) => t.value === toolId);
        return {
          name: tool?.name || toolId,
          value: toolId,
          configured: false,
          preSelected: true, // Pre-select all detected legacy tools
        };
      });

      selectedTools = await searchableMultiSelect({
        message: '请选择要迁移到新技能体系的工具：',
        pageSize: 15,
        choices: sortedChoices,
        validate: (_selected: string[]) => true, // Allow empty selection (user can skip)
      });

      if (selectedTools.length === 0) {
        console.log(chalk.dim('已跳过工具迁移。'));
        console.log();
        return [];
      }
    }

    // Create skills/commands for selected tools using effective profile+delivery.
    const newlyConfigured: string[] = [];
    const shouldGenerateSkills = delivery !== 'commands';
    const shouldGenerateCommands = delivery !== 'skills';
    const workflowSkillTemplates = shouldGenerateSkills ? getSkillTemplates(desiredWorkflows) : [];
    const capabilitySkillTemplates = getEnterpriseCapabilitySkillTemplates(desiredWorkflows);
    const modoSupportSkillTemplates = modoProject ? getModoSupportSkillTemplates() : [];
    const skillTemplates = [...workflowSkillTemplates, ...capabilitySkillTemplates, ...modoSupportSkillTemplates];
    const shouldGenerateAnySkills = skillTemplates.length > 0;
    const commandContents = shouldGenerateCommands ? getCommandContents(desiredWorkflows) : [];

    for (const toolId of selectedTools) {
      const tool = AI_TOOLS.find((t) => t.value === toolId);
      if (!tool?.skillsDir) continue;

      const spinner = ora(`正在配置 ${tool.name}...`).start();

      try {
        const skillsDir = path.join(projectPath, tool.skillsDir, 'skills');

        // Create workflow skills plus any MODO support skills.
        if (shouldGenerateAnySkills) {
          for (const { template, dirName } of skillTemplates) {
            const skillDir = path.join(skillsDir, dirName);
            const skillFile = path.join(skillDir, 'SKILL.md');

            // Use hyphen-based command references for OpenCode
            const transformer = tool.value === 'opencode' ? transformToHyphenCommands : undefined;
            const skillContent = generateSkillContent(template, OPENSPEC_VERSION, transformer);
            await FileSystemUtils.writeFile(skillFile, skillContent);
          }
        }

        // Create commands when delivery includes commands
        if (shouldGenerateCommands) {
          const adapter = CommandAdapterRegistry.get(tool.value);
          if (adapter) {
            const generatedCommands = generateCommands(commandContents, adapter);

            for (const cmd of generatedCommands) {
              const commandFile = path.isAbsolute(cmd.path) ? cmd.path : path.join(projectPath, cmd.path);
              await FileSystemUtils.writeFile(commandFile, cmd.fileContent);
            }
          }
        }

        spinner.succeed(`${tool.name} 配置完成`);
        newlyConfigured.push(toolId);
      } catch (error) {
        spinner.fail(`${tool.name} 配置失败`);
        console.log(chalk.red(`  ${error instanceof Error ? error.message : String(error)}`));
      }
    }

    if (newlyConfigured.length > 0) {
      console.log();
    }

    return newlyConfigured;
  }

  private async ensureScaffoldInstructionFiles(
    projectPath: string
  ): Promise<SyncProjectInstructionFilesResult | null> {
    if (!await isModoScaffoldProject(projectPath)) {
      return null;
    }

    const agentsContent = await readModoAgentsTemplate();
    return syncProjectInstructionFiles(projectPath, agentsContent);
  }

  private displayScaffoldInstructionMessage(
    status: SyncProjectInstructionFilesResult | null
  ): void {
    if (status?.status === 'created') {
      console.log('脚手架说明文件：已创建 AGENTS.md，并建立 CLAUDE.md 软链');
    }
  }
}
