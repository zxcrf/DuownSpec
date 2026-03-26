export const ENTERPRISE_CAPABILITY_SKILLS = [
  {
    id: 'brainstorming',
    dirName: 'brainstorming',
    requiredWhen: [],
    installWhen: ['explore'],
  },
  {
    id: 'executing-plans',
    dirName: 'executing-plans',
    requiredWhen: ['apply'],
    installWhen: ['apply'],
  },
  {
    id: 'test-driven-development',
    dirName: 'test-driven-development',
    requiredWhen: [],
    installWhen: ['apply'],
  },
  {
    id: 'subagent-driven-development',
    dirName: 'subagent-driven-development',
    requiredWhen: [],
    installWhen: ['apply'],
  },
  {
    id: 'requesting-code-review',
    dirName: 'requesting-code-review',
    requiredWhen: ['review'],
    installWhen: ['review'],
  },
  {
    id: 'receiving-code-review',
    dirName: 'receiving-code-review',
    requiredWhen: ['review'],
    installWhen: ['review'],
  },
  {
    id: 'verification-before-completion',
    dirName: 'verification-before-completion',
    requiredWhen: ['verify'],
    installWhen: ['verify'],
  },
] as const;

export type EnterpriseCapabilitySkillId = (typeof ENTERPRISE_CAPABILITY_SKILLS)[number]['id'];
export type EnterpriseCapabilitySkillDirName = (typeof ENTERPRISE_CAPABILITY_SKILLS)[number]['dirName'];

export function getRequiredEnterpriseCapabilitySkills(
  workflows: readonly string[]
): readonly (typeof ENTERPRISE_CAPABILITY_SKILLS)[number][] {
  const workflowSet = new Set(workflows);

  return ENTERPRISE_CAPABILITY_SKILLS.filter((skill) =>
    skill.requiredWhen.some((workflowId) => workflowSet.has(workflowId))
  );
}

export function getBundledEnterpriseCapabilitySkills(
  workflows: readonly string[]
): readonly (typeof ENTERPRISE_CAPABILITY_SKILLS)[number][] {
  const workflowSet = new Set(workflows);

  return ENTERPRISE_CAPABILITY_SKILLS.filter((skill) =>
    skill.installWhen.some((workflowId) => workflowSet.has(workflowId))
  );
}

export function getAllEnterpriseCapabilitySkillDirNames(): EnterpriseCapabilitySkillDirName[] {
  return ENTERPRISE_CAPABILITY_SKILLS.map((skill) => skill.dirName);
}

export function getBundledEnterpriseCapabilitySkillDirNames(
  workflows: readonly string[]
): EnterpriseCapabilitySkillDirName[] {
  return getBundledEnterpriseCapabilitySkills(workflows).map((skill) => skill.dirName);
}

export function getRequiredEnterpriseCapabilitySkillDirNames(
  workflows: readonly string[]
): EnterpriseCapabilitySkillDirName[] {
  return getRequiredEnterpriseCapabilitySkills(workflows).map((skill) => skill.dirName);
}
