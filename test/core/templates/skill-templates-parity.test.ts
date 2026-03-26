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
  getExploreSkillTemplate: '2e9a2e42e0e6f2cee15edb9ebd448aae0e485b29d07fd6438bae7a9924bf4312',
  getNewChangeSkillTemplate: 'aa8663dc14e0d90e78446e579a11d393ade817aaf409552d1407899a19d443ec',
  getContinueChangeSkillTemplate: 'c79f68e31e6d67927c1bc0193dadf50406cacceea11c46476a9b945290cfd360',
  getApplyChangeSkillTemplate: '54508eae4283270ae6ea9a505af9601f68d3a331c483246a2f1ff456f91804ba',
  getReviewChangeSkillTemplate: '60c22e4931e7cfc6e5c8c913aa6b4a6a046fd6aa747163b140d1393f65a793c0',
  getFfChangeSkillTemplate: '796b10e6c9cd69481bba070bd33d558179ad95a318d170755941e34106ca0e85',
  getSyncSpecsSkillTemplate: 'ffb33f6a54a86c515b0252ee2e0b67cdd8483c5a66396530191170ded86e441a',
  getOnboardSkillTemplate: '28d73642ca81cf79a072b443b5e6866e3a4086792983e1f6a2ee631fdb43238b',
  getDocumentChangeSkillTemplate: 'bda11db635bc03a6f3b4dca576a5d38cd7496e5090b1fdc75467bbdbbf1a5dca',
  getOpsxExploreCommandTemplate: '23e3fd0ca721ffb43301b5247e91dd5255ee6ef94404500621dc74ac6b44c52b',
  getOpsxNewCommandTemplate: 'b015ef80ab8886e74e142b5cea4e34a96affb2bff2dd5d7cccf63d5375477dca',
  getOpsxContinueCommandTemplate: '24fdc64101daa311ff35fc84c3ca7d69eeb7ea5779450a03670defd05306dd27',
  getOpsxApplyCommandTemplate: 'c794c58f7f0463e08d7e853d4fea6297b23bb37b6fe012a4289b74ff713700bf',
  getOpsxReviewCommandTemplate: '7e1169fd275e2f33eb81ffbfc881571641523e76db4eda78b1c30f5a000fc141',
  getOpsxFfCommandTemplate: 'a0a4f063755083d4ecc344ffa6f5b8369f18c3df17a545ff94305c8ed9de6c68',
  getArchiveChangeSkillTemplate: '5756fe437aa1811c0d06a959608d16814e41738709e6b37936cebae49bd43054',
  getBulkArchiveChangeSkillTemplate: '23368875a10bfa2e0d4b64c816c1ee2c3c5e1dd335debd97008023d59dffb561',
  getOpsxSyncCommandTemplate: '98800fac3f1650609dab938cc7df05ed13b971cd57914e6880dbd8dcfd27d43d',
  getVerifyChangeSkillTemplate: '39b7d0f9708bb55c246c891c8cb9b08e09f2d69390cf70df8c2fca7eabc27182',
  getOpsxArchiveCommandTemplate: '63b8b40ac7e41f4a16d0532c287a7d31ce7f9566c21c3c5806eae6498172ac5b',
  getOpsxOnboardCommandTemplate: '72fbb87abff512631952bea1cf58bb89ba0dae850e135c73c739e649133209e7',
  getOpsxBulkArchiveCommandTemplate: '4d1372f8b1cf38fdb48af4c0c4b228c1e403b2b191bf4374c8af869ad76007c9',
  getOpsxVerifyCommandTemplate: '8b5bb439ce23f78ababf9170ec582d2ddd874416a97c03bec3672f6794a30bbf',
  getOpsxDocumentCommandTemplate: '4f44fa25cdd468c4b1e3d1057566f7e42df78e7993d12866f6645996b015a393',
  getOpsxProposeSkillTemplate: '848a876ad44dd330aa2580c92ffbec10f2aa92ee49fa01f6fc44db3754c40adf',
  getOpsxProposeCommandTemplate: '7985a4c94c6431cd5b65a44b3a356f00f351ad92130d46b8b265cfdf3b1917b8',
  getFeedbackSkillTemplate: '52de29517f7cf6cf6174b35862df0e207c4a27b22f54978896e8bd761fe31640',
};

const EXPECTED_GENERATED_SKILL_CONTENT_HASHES: Record<string, string> = {
  'openspec-explore': 'c6d19113a4dd5761f65072bc60c6d8ab15c47790e04f099da2df2ac87681923e',
  'openspec-new-change': '6be8f1fccdf4c4d1abec646658ed2a3dac70352be761763ddf63b8eea57dbbb5',
  'openspec-continue-change': '899c373d506a8cbb6f5f47bd9dc0d4686ed191b6aaf9ae88299a83a00775021e',
  'openspec-apply-change': 'c99e33c4a9554fb815bce8e1ded1454f367b99a2f73c7e4a313ee3eabddf9b78',
  'openspec-review-change': 'e5497fef0179d698acb06deb313157489d6ca2a8f03650c7450ec69b0ff30193',
  'openspec-ff-change': 'c332c8cd28412f84e79bbb3c512320b54f4a349dca101051d91e94687e3f95ea',
  'openspec-sync-specs': 'ea993ec4fa02ada8ee3c79f2eeae2adb317e9210c429791817434c1b4611eb16',
  'openspec-archive-change': '3b70a8e0dd15716da9a25f251f822b4d7fe546cda3bca4c2aa520409d529fa4c',
  'openspec-bulk-archive-change': '38172f104259c6f84caa037158ccc6ae7ade2352a235e787c3a80a27cdec8e61',
  'openspec-verify-change': '12b0310f02cc70e78cd8a5c21c59248649ee62f1486c3ee2726fd2ba138de1e8',
  'openspec-document-change': 'c30bebb6531b9cbd710403fa5b3a4b96cd1e6156868732cc53db79994b59c5b8',
  'openspec-onboard': 'dae17d61af0d2e9589e65885a73c630017bdfd43e3eef899499460c5e257856b',
  'openspec-propose': '0473770cc94bbcd14596d654ed2a5f5ebc9eebd6098a1410841bd5043588aa05',
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
      ['openspec-explore', getExploreSkillTemplate],
      ['openspec-new-change', getNewChangeSkillTemplate],
      ['openspec-continue-change', getContinueChangeSkillTemplate],
      ['openspec-apply-change', getApplyChangeSkillTemplate],
      ['openspec-review-change', getReviewChangeSkillTemplate],
      ['openspec-ff-change', getFfChangeSkillTemplate],
      ['openspec-sync-specs', getSyncSpecsSkillTemplate],
      ['openspec-archive-change', getArchiveChangeSkillTemplate],
      ['openspec-bulk-archive-change', getBulkArchiveChangeSkillTemplate],
      ['openspec-verify-change', getVerifyChangeSkillTemplate],
      ['openspec-document-change', getDocumentChangeSkillTemplate],
      ['openspec-onboard', getOnboardSkillTemplate],
      ['openspec-propose', getOpsxProposeSkillTemplate],
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
