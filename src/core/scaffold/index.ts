export {
  getDefaultModoScaffoldManifest,
  resolveModoScaffoldSourceRoots,
} from './manifest.js';

export {
  isModoScaffoldProject,
  readModoAgentsTemplate,
} from './instruction-assets.js';

export {
  assembleModoScaffold,
  createModoScaffoldOptions,
} from './modo-scaffold.js';

export type {
  AssembleModoScaffoldOptions,
  ModoScaffoldAssemblyResult,
  ModoScaffoldManifest,
  ModoScaffoldSourceRoots,
  ScaffoldCopyItem,
  ScaffoldExclusionRules,
  ScaffoldGeneratedFile,
  ScaffoldSourceId,
} from './types.js';
