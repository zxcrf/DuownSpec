export type ScaffoldSourceId = 'bundled';

export interface ScaffoldCopyItem {
  source: ScaffoldSourceId;
  kind: 'file' | 'directory';
  from: string;
  to: string;
  required?: boolean;
}

export interface ScaffoldGeneratedFile {
  to: string;
  content: string;
}

export interface ScaffoldExclusionRules {
  exactPaths: readonly string[];
  pathPrefixes: readonly string[];
  fileNames: readonly string[];
}

export interface ModoScaffoldManifest {
  copyItems: readonly ScaffoldCopyItem[];
  generatedFiles: readonly ScaffoldGeneratedFile[];
  emptyDirs: readonly string[];
  exclusions: ScaffoldExclusionRules;
}

export interface ModoScaffoldSourceRoots {
  bundledRoot: string;
}

export interface AssembleModoScaffoldOptions {
  targetDir: string;
  sourceRoots: ModoScaffoldSourceRoots;
  overwrite?: boolean;
  manifest?: ModoScaffoldManifest;
}

export interface ModoScaffoldAssemblyResult {
  copiedFiles: string[];
  skippedFiles: string[];
  excludedFiles: string[];
  createdDirs: string[];
}
