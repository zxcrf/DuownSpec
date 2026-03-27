export const ENTERPRISE_CAPABILITY_SKILLS = [
  {
    id: 'dwsp-brainstorming',
    dirName: 'dwsp-brainstorming',
    requiredWhen: [],
    installWhen: ['explore'],
  },
  {
    id: 'dwsp-executing-plans',
    dirName: 'dwsp-executing-plans',
    requiredWhen: ['apply'],
    installWhen: ['apply'],
  },
  {
    id: 'dwsp-test-driven-development',
    dirName: 'dwsp-test-driven-development',
    requiredWhen: [],
    installWhen: ['apply'],
  },
  {
    id: 'dwsp-subagent-driven-development',
    dirName: 'dwsp-subagent-driven-development',
    requiredWhen: [],
    installWhen: ['apply'],
  },
  {
    id: 'dwsp-requesting-code-review',
    dirName: 'dwsp-requesting-code-review',
    requiredWhen: ['review'],
    installWhen: ['review'],
  },
  {
    id: 'dwsp-receiving-code-review',
    dirName: 'dwsp-receiving-code-review',
    requiredWhen: ['review'],
    installWhen: ['review'],
  },
  {
    id: 'dwsp-verification-before-completion',
    dirName: 'dwsp-verification-before-completion',
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
