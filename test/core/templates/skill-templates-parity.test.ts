import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import {
  type SkillTemplate,
  getApplyChangeSkillTemplate,
  getArchiveChangeSkillTemplate,
  getBulkArchiveChangeSkillTemplate,
  getContinueChangeSkillTemplate,
  getDocumentChangeSkillTemplate,
  getExploreSkillTemplate,
  getFeedbackSkillTemplate,
  getFfChangeSkillTemplate,
  getNewChangeSkillTemplate,
  getOnboardSkillTemplate,
  getOpsxApplyCommandTemplate,
  getOpsxArchiveCommandTemplate,
  getOpsxBulkArchiveCommandTemplate,
  getOpsxContinueCommandTemplate,
  getOpsxDocumentCommandTemplate,
  getOpsxExploreCommandTemplate,
  getOpsxFfCommandTemplate,
  getOpsxNewCommandTemplate,
  getOpsxOnboardCommandTemplate,
  getOpsxSyncCommandTemplate,
  getOpsxProposeCommandTemplate,
  getOpsxProposeSkillTemplate,
  getOpsxReviewCommandTemplate,
  getOpsxVerifyCommandTemplate,
  getReviewChangeSkillTemplate,
  getSyncSpecsSkillTemplate,
  getVerifyChangeSkillTemplate,
} from '../../../src/core/templates/skill-templates.js';
import { generateSkillContent } from '../../../src/core/shared/skill-generation.js';

const EXPECTED_FUNCTION_HASHES: Record<string, string> = {
  getExploreSkillTemplate: '791b731ad331d5630aa66ea62c359a0593ebd167f3d9f9391e155061c9dd9eda',
  getNewChangeSkillTemplate: 'dc152de7d3f60eded46bbf9f9108f321e496d129f0ee90aba3bd4ea1ec1dab07',
  getContinueChangeSkillTemplate: '341d1364b8a574209d9ad4619ac075739a3fccf8f98588376e46fceec5fab666',
  getApplyChangeSkillTemplate: '6c61ceea31bef69a09067359cea866824765a5758a61e0e89cccde80c370e94f',
  getReviewChangeSkillTemplate: 'f015cf9f66b49c64044db6e5348937c5b64dd3f7fb4d8b608078adc5e4476525',
  getFfChangeSkillTemplate: 'f0562d3233730c37a1bc089be0e167558db87307d2fc7937048c144e511b6b1f',
  getSyncSpecsSkillTemplate: 'fc7ac633bd6c8f1ff86d8bcfd8d3c27f8d3460c18e29b04dce9fc2b17ca5ebf3',
  getOnboardSkillTemplate: 'adff2a7328b73c2f25919e3889a4a0e6ced4c2302f9e0921c986d161a8d7f378',
  getDocumentChangeSkillTemplate: '4c1c14e34de43583fa6ec8e390426c36cb98eb742417f69629f8fb1f533ec348',
  getOpsxExploreCommandTemplate: '08a8ce1591ecde151731d5ff28a2ba8a6acbab566a5feb1c07fb58289c287db1',
  getOpsxNewCommandTemplate: 'c3f2b240d9cfee2cfd7190e0ff5a65638fd846ed820ff287bc695b592487feb6',
  getOpsxContinueCommandTemplate: '6534dadc388b98796191ade2e7cf2036c568e535517457366000d9a2a0ae2355',
  getOpsxApplyCommandTemplate: '7801d6c378454656b7343f74abf2547f1f1bbb206bacace90b6ffcabfd681292',
  getOpsxReviewCommandTemplate: 'b45db10186825a90659fc0e79d366bbadf7a7b79567bbc0b87b1e3d95ebe6a27',
  getOpsxFfCommandTemplate: '93b9a8df0bb53eabd669c44915dbb20f3b1e7e1f30f8eb61edb68d1b270ba030',
  getArchiveChangeSkillTemplate: '07c2d8c3a1ea7ffa3b011e696c5be9d0b1bb05e66096ac11b946026e46f6a7e3',
  getBulkArchiveChangeSkillTemplate: '95ffbb0d177afda00fa1ea652953f8ac9905e38346cb9f22ca8e02b16781e13e',
  getOpsxSyncCommandTemplate: 'c42b149a0dc2507889dbb958bef485b2ab6f2fa70b5804e87312f825e463ca12',
  getVerifyChangeSkillTemplate: '4a5e18ccf2378094157d1a96f6efe89eeeb555eeca549aa931d84fa9cf8c5ca6',
  getOpsxArchiveCommandTemplate: '64e1385c7c254c4764f5e0ad65ce3f87c983c886c294f7795e95114e60987de2',
  getOpsxOnboardCommandTemplate: '1eff1884b0d6afedb62e5ce2feb90cadf12fa2e16b3029561554c49bdf383323',
  getOpsxBulkArchiveCommandTemplate: 'fc1590b6d5cf5a74548cd977154fc2d91d76eeb6e509408a9abf4d9e4308f657',
  getOpsxVerifyCommandTemplate: 'f04d994dcaea44f676c44f6d57a2eee2dfcc9f1caf49f633f0457ebdb83f3cf8',
  getOpsxDocumentCommandTemplate: '846274dd547c06b3f031552c3e3e5c9d71b600c1063c691d1675510af912e768',
  getOpsxProposeSkillTemplate: 'f3ec83d69cb03b5dd90b056cd37d85dfd91e158f5bcb046eab08ce5d60a237e6',
  getOpsxProposeCommandTemplate: 'bdb241fe63f827dc41efc3a65f990a2e9cd8706e6ec8afdc7f7e92b3f7e007b8',
  getFeedbackSkillTemplate: '25e25f1b268960989e4e5b920fa5c8f8b9ee3e675bddb4a3f9baf5b42f4c997f',
};

const EXPECTED_GENERATED_SKILL_CONTENT_HASHES: Record<string, string> = {
  'duowenspec-explore': 'c1982f94ae75ee01d31df5c62e6cb9a911d9bde2ff2b1bc192f66d0c45e85a2a',
  'duowenspec-new-change': '347a2a1e66f2c54a07e33eea4d0fa5a39b898462f766aef696044d83f01acd82',
  'duowenspec-continue-change': '61ce1e2ab95cae054f9b9658076cc60f24981a03a6395fe5129006878c1ce6d8',
  'duowenspec-apply-change': '50091871b16f9f2c755197c32b971df5def9315757ca86a983dc12c23eee8e8f',
  'duowenspec-review-change': '107e4bb9860d0814be118ce3a515374147a25cc4b95900dd3c98626ce1ae3b4f',
  'duowenspec-ff-change': 'bcf197d911897a5b1b2221664eb8c8778c553384781144d5e73b5c631ddbd41a',
  'duowenspec-sync-specs': '3fed4b5770e4901dd333c7f1ab16a0f0787bee314f063510e68257f8db0d3d39',
  'duowenspec-archive-change': '93e7e3e7ce7859e64de160f95ccabf6bb1862a86c7538a1e826a4c78749e5c1b',
  'duowenspec-bulk-archive-change': '002dee3ab17f6095ce991e1c3dac5fffd98cefd92ba8fe1d75d2874b2bebfd2d',
  'duowenspec-verify-change': 'c938d0e203b3c215bd5d5702268292661158d5e5f29728d0143af7f9112a6451',
  'duowenspec-document-change': '7c410c51468eafe8cc6298a2e8fdfeeef46ef045d4dea4c9a45d0ab38b95dd47',
  'duowenspec-onboard': '1751178d4fc92eaa04a6857ea9671dff7cbf53d565933453b3960bc6a0a5e363',
  'duowenspec-propose': 'fcbd9c31e16f6db68df05b2418afc571a1def16fb3dc3de1a59db36012d974ab',
};

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`);

    return `{${entries.join(',')}}`;
  }

  return JSON.stringify(value);
}

function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

describe('skill templates split parity', () => {
  it('preserves all template function payloads exactly', () => {
    const functionFactories: Record<string, () => unknown> = {
      getExploreSkillTemplate,
      getNewChangeSkillTemplate,
      getContinueChangeSkillTemplate,
      getApplyChangeSkillTemplate,
      getReviewChangeSkillTemplate,
      getFfChangeSkillTemplate,
      getSyncSpecsSkillTemplate,
      getOnboardSkillTemplate,
      getDocumentChangeSkillTemplate,
      getOpsxExploreCommandTemplate,
      getOpsxNewCommandTemplate,
      getOpsxContinueCommandTemplate,
      getOpsxApplyCommandTemplate,
      getOpsxReviewCommandTemplate,
      getOpsxFfCommandTemplate,
      getArchiveChangeSkillTemplate,
      getBulkArchiveChangeSkillTemplate,
      getOpsxSyncCommandTemplate,
      getVerifyChangeSkillTemplate,
      getOpsxArchiveCommandTemplate,
      getOpsxOnboardCommandTemplate,
      getOpsxBulkArchiveCommandTemplate,
      getOpsxVerifyCommandTemplate,
      getOpsxDocumentCommandTemplate,
      getOpsxProposeSkillTemplate,
      getOpsxProposeCommandTemplate,
      getFeedbackSkillTemplate,
    };

    const actualHashes = Object.fromEntries(
      Object.entries(functionFactories).map(([name, fn]) => [name, hash(stableStringify(fn()))])
    );

    expect(actualHashes).toEqual(EXPECTED_FUNCTION_HASHES);
  });

  it('preserves generated skill file content exactly', () => {
    // Intentionally excludes getFeedbackSkillTemplate: skillFactories only models templates
    // deployed via generateSkillContent, while feedback is covered in function payload parity.
    const skillFactories: Array<[string, () => SkillTemplate]> = [
      ['duowenspec-explore', getExploreSkillTemplate],
      ['duowenspec-new-change', getNewChangeSkillTemplate],
      ['duowenspec-continue-change', getContinueChangeSkillTemplate],
      ['duowenspec-apply-change', getApplyChangeSkillTemplate],
      ['duowenspec-review-change', getReviewChangeSkillTemplate],
      ['duowenspec-ff-change', getFfChangeSkillTemplate],
      ['duowenspec-sync-specs', getSyncSpecsSkillTemplate],
      ['duowenspec-archive-change', getArchiveChangeSkillTemplate],
      ['duowenspec-bulk-archive-change', getBulkArchiveChangeSkillTemplate],
      ['duowenspec-verify-change', getVerifyChangeSkillTemplate],
      ['duowenspec-document-change', getDocumentChangeSkillTemplate],
      ['duowenspec-onboard', getOnboardSkillTemplate],
      ['duowenspec-propose', getOpsxProposeSkillTemplate],
    ];

    const actualHashes = Object.fromEntries(
      skillFactories.map(([dirName, createTemplate]) => [
        dirName,
        hash(generateSkillContent(createTemplate(), 'PARITY-BASELINE')),
      ])
    );

    expect(actualHashes).toEqual(EXPECTED_GENERATED_SKILL_CONTENT_HASHES);
  });
});
