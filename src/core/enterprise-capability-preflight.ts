import { getBundledEnterpriseCapabilitySkills } from './enterprise-capability-skills.js';
import { getEnterpriseCapabilitySkillTemplates } from './shared/skill-generation.js';

export const ENTERPRISE_EXCEPTIONS_HEADER = 'Enterprise Workflow Exceptions';
export const ENTERPRISE_ALLOW_MISSING_CAPABILITIES = 'allow-missing-capabilities';

export function assertEnterpriseCapabilitiesAvailable(workflows: readonly string[]): void {
  const requiredSkills = getBundledEnterpriseCapabilitySkills(workflows);

  if (requiredSkills.length === 0) {
    return;
  }

  const bundledTemplates = new Set(
    getEnterpriseCapabilitySkillTemplates(workflows).map((entry) => entry.dirName)
  );
  const missingBundledSkills = requiredSkills
    .map((skill) => skill.dirName)
    .filter((dirName) => !bundledTemplates.has(dirName));

  if (missingBundledSkills.length > 0) {
    throw new Error(
      `opsx is missing bundled enterprise capability skills: ${missingBundledSkills.join(', ')}`
    );
  }
}
