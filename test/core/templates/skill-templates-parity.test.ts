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
  getExploreSkillTemplate: '5d8ec3a3bfa6bdf221419e1fec14b9211164201fb211911e6ea57b5785def0ef',
  getNewChangeSkillTemplate: 'a369059790c5da130e6966fe0f8cbf17a52e52039d4df3eeadb6b6699b4512e5',
  getContinueChangeSkillTemplate: '8390c2289eaf0ba6b054a1bbe76c4a59bc32135a1a75ccfc1d162ed6764bdad0',
  getApplyChangeSkillTemplate: 'e6e849bf398e8b351917f09b4ebf0d0dcba160e340e56883c3749f50404f6403',
  getReviewChangeSkillTemplate: '5e892416db8551f34cc73491b583924f69d84103b3996177c414a6f5a87daa3a',
  getFfChangeSkillTemplate: 'afcb5bbfcfb05392b13fbc7ed6d5d320e0385e98b1c24e6cec9cb76500423bca',
  getSyncSpecsSkillTemplate: '5e1fa88c3d8342b447536f5013768d8575226e4d4eb5892cfe85fb3f455b33d3',
  getOnboardSkillTemplate: 'a3c9d7ab442963cc4da341617be939d6aae3e791b0dd57578d233b1d957ab37f',
  getDocumentChangeSkillTemplate: 'e71248fe157aec2134634c256c3d022804d5cc2393f371116af52cd150e29b34',
  getOpsxExploreCommandTemplate: '2590c523b2a21be4086fe14c1b9e63b081548cffb606edd156a4564a02eaaeef',
  getOpsxNewCommandTemplate: '99aef91050d8c29369522d76681fe5137a21adccd4155ed492139d44d76823a5',
  getOpsxContinueCommandTemplate: '86353b2530fdae8fca1929eb5d993a20822c6af4b8b1cfffe0af89165becb429',
  getOpsxApplyCommandTemplate: '17c18a535e8a49bee5d3e8a1b87acea96c174754fa6c7384f2a592cca3daffad',
  getOpsxReviewCommandTemplate: '0e012d2a538840a6b325802d124d8ee07547853ece8a3ff0f618c7f8737ece4c',
  getOpsxFfCommandTemplate: '839eb553f26130289af6b2f2d97657c64f828315c6131501de32637bb217c223',
  getArchiveChangeSkillTemplate: '03843f7292e18ad250b477cb5b0580eb963b28220e933317e4d5ba3b7baf8ad5',
  getBulkArchiveChangeSkillTemplate: '942e7d19fa17fe1d66d7c9d3d6db34473ff91c77be11db5379ed907a774ab124',
  getOpsxSyncCommandTemplate: 'c42b149a0dc2507889dbb958bef485b2ab6f2fa70b5804e87312f825e463ca12',
  getVerifyChangeSkillTemplate: '422e79ad483d9ce2a097494b7229ab8901b48fb2aca981b1cfaed1645539f167',
  getOpsxArchiveCommandTemplate: '859ed951f32c56d8fe2eea65decdc15525df91b115ebeb1ea0b74ec47ed9a3b5',
  getOpsxOnboardCommandTemplate: '1eff1884b0d6afedb62e5ce2feb90cadf12fa2e16b3029561554c49bdf383323',
  getOpsxBulkArchiveCommandTemplate: 'ef06479aa8b7dc84183e501c677cb3f9e775ef164ffa88de413250a17672a604',
  getOpsxVerifyCommandTemplate: 'f04d994dcaea44f676c44f6d57a2eee2dfcc9f1caf49f633f0457ebdb83f3cf8',
  getOpsxDocumentCommandTemplate: '846274dd547c06b3f031552c3e3e5c9d71b600c1063c691d1675510af912e768',
  getOpsxProposeSkillTemplate: '241ac4e8d56fc3bbddc6bcd17fc8adfe9dd6094fead8713e67fae38d5bd6d656',
  getOpsxProposeCommandTemplate: '626777ae5604e759d40693220e0c1522f0076011f30bdd34c0c1be171c0f72bd',
  getFeedbackSkillTemplate: '25e25f1b268960989e4e5b920fa5c8f8b9ee3e675bddb4a3f9baf5b42f4c997f',
};

const EXPECTED_GENERATED_SKILL_CONTENT_HASHES: Record<string, string> = {
  'dwsp-explore': '42b5a620ffa9e90b5073cfaeca4b89079712a8c5926fe3dad1ae276111e1ad92',
  'dwsp-new-change': '3ff93a09cd5b061ae85594394c9a40db5530f683efc7881b78f2ed607ff7c803',
  'dwsp-continue-change': '7ca51094ac3f4a8a0d77bc843a1130db88c663962f635feffc98d808a8d5ab6c',
  'dwsp-apply-change': 'cb594b5c32fbd7e3e40ffbb08a355e411746ef43fd4636c84c384e51014c9299',
  'dwsp-review-change': '7f83dbb63edbb4c662df22cb00c597dce720ab1d17254bb61ab526f0772daa2d',
  'dwsp-ff-change': '85bf5d58bca4ba4756f0765393407e0b581ee28026d3b36e3b8fcd6a3249992d',
  'dwsp-sync-specs': 'f4b976e2a0649cbbaa56a46152acaf278a7e18cf828256d109324d9ad485a879',
  'dwsp-archive-change': 'd2876253eabe1905edbbcdf9732b06ee620a44b702ac3f09d887f86197c754c8',
  'dwsp-bulk-archive-change': 'f58263277af4e8a329f36fa2f59b9432d37b0dbacef3d13e64b1af8fe30a347f',
  'dwsp-verify-change': '6d6dae5c57878db44bcb498dafa442fb6dce209b1aa3795df6477a5caf5ced5a',
  'dwsp-document-change': 'c1d1a5b37f32bd22c5606967218755df789a68255bec3bc9957ef69b847e28fa',
  'dwsp-onboard': '076381540855c834c36be9482dfa7e4642b6dc5e2710e61c454508b264434a7a',
  'dwsp-propose': '3cea663e26bc07493f1a94586a788807fcc847c4fc00d614b8ae69b0e7f71e56',
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
      ['dwsp-explore', getExploreSkillTemplate],
      ['dwsp-new-change', getNewChangeSkillTemplate],
      ['dwsp-continue-change', getContinueChangeSkillTemplate],
      ['dwsp-apply-change', getApplyChangeSkillTemplate],
      ['dwsp-review-change', getReviewChangeSkillTemplate],
      ['dwsp-ff-change', getFfChangeSkillTemplate],
      ['dwsp-sync-specs', getSyncSpecsSkillTemplate],
      ['dwsp-archive-change', getArchiveChangeSkillTemplate],
      ['dwsp-bulk-archive-change', getBulkArchiveChangeSkillTemplate],
      ['dwsp-verify-change', getVerifyChangeSkillTemplate],
      ['dwsp-document-change', getDocumentChangeSkillTemplate],
      ['dwsp-onboard', getOnboardSkillTemplate],
      ['dwsp-propose', getOpsxProposeSkillTemplate],
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
