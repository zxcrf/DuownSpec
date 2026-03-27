/**
 * Skill Generation Utilities
 *
 * Shared utilities for generating skill and command files.
 */

import {
  getExploreSkillTemplate,
  getNewChangeSkillTemplate,
  getContinueChangeSkillTemplate,
  getApplyChangeSkillTemplate,
  getReviewChangeSkillTemplate,
  getFfChangeSkillTemplate,
  getSyncSpecsSkillTemplate,
  getArchiveChangeSkillTemplate,
  getBulkArchiveChangeSkillTemplate,
  getVerifyChangeSkillTemplate,
  getDocumentChangeSkillTemplate,
  getOnboardSkillTemplate,
  getOpsxProposeSkillTemplate,
  getOpsxExploreCommandTemplate,
  getOpsxNewCommandTemplate,
  getOpsxContinueCommandTemplate,
  getOpsxApplyCommandTemplate,
  getOpsxReviewCommandTemplate,
  getOpsxFfCommandTemplate,
  getOpsxSyncCommandTemplate,
  getOpsxArchiveCommandTemplate,
  getOpsxBulkArchiveCommandTemplate,
  getOpsxVerifyCommandTemplate,
  getOpsxDocumentCommandTemplate,
  getOpsxOnboardCommandTemplate,
  getOpsxProposeCommandTemplate,
  getExecutingPlansSkillTemplate,
  getBrainstormingSkillTemplate,
  getTestDrivenDevelopmentSkillTemplate,
  getSubagentDrivenDevelopmentSkillTemplate,
  getRequestingCodeReviewSkillTemplate,
  getReceivingCodeReviewSkillTemplate,
  getVerificationBeforeCompletionSkillTemplate,
  type SkillTemplate,
} from '../templates/skill-templates.js';
import {
  getBEndDeliverySkillTemplate,
  getBEndComponentsSkillTemplate,
  getBEndReviewSkillTemplate,
} from '../templates/support/modo-b-end.js';
import type { CommandContent } from '../command-generation/index.js';
import { getBundledEnterpriseCapabilitySkills } from '../enterprise-capability-skills.js';

/**
 * Skill template with directory name and workflow ID mapping.
 */
export interface SkillTemplateEntry {
  template: SkillTemplate;
  dirName: string;
  workflowId: string;
}

/**
 * Command template with ID mapping.
 */
export interface CommandTemplateEntry {
  template: ReturnType<typeof getOpsxExploreCommandTemplate>;
  id: string;
}

export const MODO_SUPPORT_SKILL_DIRS = [
  'dwsp-b-end-delivery',
  'dwsp-b-end-components',
  'dwsp-b-end-review',
] as const;

/**
 * Gets skill templates with their directory names, optionally filtered by workflow IDs.
 *
 * @param workflowFilter - If provided, only return templates whose workflowId is in this array
 */
export function getSkillTemplates(workflowFilter?: readonly string[]): SkillTemplateEntry[] {
  const all: SkillTemplateEntry[] = [
    { template: getExploreSkillTemplate(), dirName: 'dwsp-explore', workflowId: 'explore' },
    { template: getNewChangeSkillTemplate(), dirName: 'dwsp-new-change', workflowId: 'new' },
    { template: getContinueChangeSkillTemplate(), dirName: 'dwsp-continue-change', workflowId: 'continue' },
    { template: getApplyChangeSkillTemplate(), dirName: 'dwsp-apply-change', workflowId: 'apply' },
    { template: getReviewChangeSkillTemplate(), dirName: 'dwsp-review-change', workflowId: 'review' },
    { template: getFfChangeSkillTemplate(), dirName: 'dwsp-ff-change', workflowId: 'ff' },
    { template: getSyncSpecsSkillTemplate(), dirName: 'dwsp-sync-specs', workflowId: 'sync' },
    { template: getArchiveChangeSkillTemplate(), dirName: 'dwsp-archive-change', workflowId: 'archive' },
    { template: getBulkArchiveChangeSkillTemplate(), dirName: 'dwsp-bulk-archive-change', workflowId: 'bulk-archive' },
    { template: getVerifyChangeSkillTemplate(), dirName: 'dwsp-verify-change', workflowId: 'verify' },
    { template: getDocumentChangeSkillTemplate(), dirName: 'dwsp-document-change', workflowId: 'document' },
    { template: getOnboardSkillTemplate(), dirName: 'dwsp-onboard', workflowId: 'onboard' },
    { template: getOpsxProposeSkillTemplate(), dirName: 'dwsp-propose', workflowId: 'propose' },
  ];

  if (!workflowFilter) return all;

  const filterSet = new Set(workflowFilter);
  return all.filter(entry => filterSet.has(entry.workflowId));
}

export function getModoSupportSkillTemplates(): SkillTemplateEntry[] {
  return [
    {
      template: getBEndDeliverySkillTemplate(),
      dirName: 'dwsp-b-end-delivery',
      workflowId: 'modo-support-delivery',
    },
    {
      template: getBEndComponentsSkillTemplate(),
      dirName: 'dwsp-b-end-components',
      workflowId: 'modo-support-components',
    },
    {
      template: getBEndReviewSkillTemplate(),
      dirName: 'dwsp-b-end-review',
      workflowId: 'modo-support-review',
    },
  ];
}

export function getEnterpriseCapabilitySkillTemplates(
  workflowFilter: readonly string[]
): SkillTemplateEntry[] {
  const templateById = new Map([
    ['dwsp-brainstorming', getBrainstormingSkillTemplate],
    ['dwsp-executing-plans', getExecutingPlansSkillTemplate],
    ['dwsp-test-driven-development', getTestDrivenDevelopmentSkillTemplate],
    ['dwsp-subagent-driven-development', getSubagentDrivenDevelopmentSkillTemplate],
    ['dwsp-requesting-code-review', getRequestingCodeReviewSkillTemplate],
    ['dwsp-receiving-code-review', getReceivingCodeReviewSkillTemplate],
    ['dwsp-verification-before-completion', getVerificationBeforeCompletionSkillTemplate],
  ] as const);

  return getBundledEnterpriseCapabilitySkills(workflowFilter).map((skill) => {
    const createTemplate = templateById.get(skill.id);

    if (!createTemplate) {
      throw new Error(`Missing bundled capability template for ${skill.id}`);
    }

    return {
      template: createTemplate(),
      dirName: skill.dirName,
      workflowId: skill.id,
    };
  });
}

/**
 * Gets command templates with their IDs, optionally filtered by workflow IDs.
 *
 * @param workflowFilter - If provided, only return templates whose id is in this array
 */
export function getCommandTemplates(workflowFilter?: readonly string[]): CommandTemplateEntry[] {
  const all: CommandTemplateEntry[] = [
    { template: getOpsxExploreCommandTemplate(), id: 'explore' },
    { template: getOpsxNewCommandTemplate(), id: 'new' },
    { template: getOpsxContinueCommandTemplate(), id: 'continue' },
    { template: getOpsxApplyCommandTemplate(), id: 'apply' },
    { template: getOpsxReviewCommandTemplate(), id: 'review' },
    { template: getOpsxFfCommandTemplate(), id: 'ff' },
    { template: getOpsxSyncCommandTemplate(), id: 'sync' },
    { template: getOpsxArchiveCommandTemplate(), id: 'archive' },
    { template: getOpsxBulkArchiveCommandTemplate(), id: 'bulk-archive' },
    { template: getOpsxVerifyCommandTemplate(), id: 'verify' },
    { template: getOpsxDocumentCommandTemplate(), id: 'document' },
    { template: getOpsxOnboardCommandTemplate(), id: 'onboard' },
    { template: getOpsxProposeCommandTemplate(), id: 'propose' },
  ];

  if (!workflowFilter) return all;

  const filterSet = new Set(workflowFilter);
  return all.filter(entry => filterSet.has(entry.id));
}

/**
 * Converts command templates to CommandContent array, optionally filtered by workflow IDs.
 *
 * @param workflowFilter - If provided, only return contents whose id is in this array
 */
export function getCommandContents(workflowFilter?: readonly string[]): CommandContent[] {
  const commandTemplates = getCommandTemplates(workflowFilter);
  return commandTemplates.map(({ template, id }) => ({
    id,
    name: template.name,
    description: template.description,
    category: template.category,
    tags: template.tags,
    body: template.content,
  }));
}

/**
 * Generates skill file content with YAML frontmatter.
 *
 * @param template - The skill template
 * @param generatedByVersion - The DuowenSpec version to embed in the file
 * @param transformInstructions - Optional callback to transform the instructions content
 */
export function generateSkillContent(
  template: SkillTemplate,
  generatedByVersion: string,
  transformInstructions?: (instructions: string) => string
): string {
  const instructions = transformInstructions
    ? transformInstructions(template.instructions)
    : template.instructions;

return `---
name: ${template.name}
description: ${template.description}
license: ${template.license || 'MIT'}
compatibility: ${template.compatibility || '需要安装 dwsp CLI。'}
metadata:
  author: ${template.metadata?.author || 'duowenspec'}
  version: "${template.metadata?.version || '1.0'}"
  generatedBy: "${generatedByVersion}"
---

${instructions}
`;
}
