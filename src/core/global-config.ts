import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { GLOBAL_NAMESPACE } from './app-info.js';
import { ENTERPRISE_DEFAULT_WORKFLOWS } from './profiles.js';

// Constants
export const GLOBAL_CONFIG_DIR_NAME = GLOBAL_NAMESPACE;
export const GLOBAL_CONFIG_FILE_NAME = 'config.json';
export const GLOBAL_DATA_DIR_NAME = GLOBAL_NAMESPACE;

// TypeScript types
export type Profile = 'core' | 'custom';
export type Delivery = 'both' | 'skills' | 'commands';

// TypeScript interfaces
export interface GlobalConfig {
  featureFlags?: Record<string, boolean>;
  profile?: Profile;
  delivery?: Delivery;
  workflows?: string[];
}

const DEFAULT_CONFIG: GlobalConfig = {
  featureFlags: {},
  profile: 'custom',
  delivery: 'both',
  workflows: [...ENTERPRISE_DEFAULT_WORKFLOWS],
};

const LEGACY_CUSTOM_DEFAULT_WORKFLOW_SETS = [
  ['propose', 'explore', 'apply', 'archive'],
  ['propose', 'explore', 'apply', 'archive', 'verify'],
] as const;

function matchesWorkflowSet(actual: unknown, expected: readonly string[]): actual is string[] {
  return (
    Array.isArray(actual) &&
    actual.length === expected.length &&
    expected.every((workflow) => actual.includes(workflow))
  );
}

function maybeUpgradeLegacyEnterpriseDefaults(
  parsed: Record<string, unknown>,
  merged: GlobalConfig,
  configPath: string
): void {
  const isLegacyCustomDefault =
    parsed.profile === 'custom' &&
    LEGACY_CUSTOM_DEFAULT_WORKFLOW_SETS.some((workflows) =>
      matchesWorkflowSet(parsed.workflows, workflows)
    );

  if (!isLegacyCustomDefault) {
    return;
  }

  merged.workflows = [...ENTERPRISE_DEFAULT_WORKFLOWS];

  try {
    fs.writeFileSync(
      configPath,
      JSON.stringify(
        {
          ...parsed,
          workflows: [...ENTERPRISE_DEFAULT_WORKFLOWS],
        },
        null,
        2
      ) + '\n',
      'utf-8'
    );
  } catch {
    // Keep the in-memory upgrade even if the persisted migration fails.
  }
}

/**
 * Gets the global configuration directory path following XDG Base Directory Specification.
 *
 * - All platforms: $XDG_CONFIG_HOME/openspec/ if XDG_CONFIG_HOME is set
 * - Unix/macOS fallback: ~/.config/openspec/
 * - Windows fallback: %APPDATA%/openspec/
 */
export function getGlobalConfigDir(): string {
  // XDG_CONFIG_HOME takes precedence on all platforms when explicitly set
  const xdgConfigHome = process.env.XDG_CONFIG_HOME;
  if (xdgConfigHome) {
    return path.join(xdgConfigHome, GLOBAL_CONFIG_DIR_NAME);
  }

  const platform = os.platform();

  if (platform === 'win32') {
    // Windows: use %APPDATA%
    const appData = process.env.APPDATA;
    if (appData) {
      return path.join(appData, GLOBAL_CONFIG_DIR_NAME);
    }
    // Fallback for Windows if APPDATA is not set
    return path.join(os.homedir(), 'AppData', 'Roaming', GLOBAL_CONFIG_DIR_NAME);
  }

  // Unix/macOS fallback: ~/.config
  return path.join(os.homedir(), '.config', GLOBAL_CONFIG_DIR_NAME);
}

/**
 * Gets the global data directory path following XDG Base Directory Specification.
 * Used for user data like schema overrides.
 *
 * - All platforms: $XDG_DATA_HOME/openspec/ if XDG_DATA_HOME is set
 * - Unix/macOS fallback: ~/.local/share/openspec/
 * - Windows fallback: %LOCALAPPDATA%/openspec/
 */
export function getGlobalDataDir(): string {
  // XDG_DATA_HOME takes precedence on all platforms when explicitly set
  const xdgDataHome = process.env.XDG_DATA_HOME;
  if (xdgDataHome) {
    return path.join(xdgDataHome, GLOBAL_DATA_DIR_NAME);
  }

  const platform = os.platform();

  if (platform === 'win32') {
    // Windows: use %LOCALAPPDATA%
    const localAppData = process.env.LOCALAPPDATA;
    if (localAppData) {
      return path.join(localAppData, GLOBAL_DATA_DIR_NAME);
    }
    // Fallback for Windows if LOCALAPPDATA is not set
    return path.join(os.homedir(), 'AppData', 'Local', GLOBAL_DATA_DIR_NAME);
  }

  // Unix/macOS fallback: ~/.local/share
  return path.join(os.homedir(), '.local', 'share', GLOBAL_DATA_DIR_NAME);
}

/**
 * Gets the path to the global config file.
 */
export function getGlobalConfigPath(): string {
  return path.join(getGlobalConfigDir(), GLOBAL_CONFIG_FILE_NAME);
}

/**
 * Loads the global configuration from disk.
 * Returns default configuration if file doesn't exist or is invalid.
 * Merges loaded config with defaults to ensure new fields are available.
 */
export function getGlobalConfig(): GlobalConfig {
  const configPath = getGlobalConfigPath();

  try {
    if (!fs.existsSync(configPath)) {
      return { ...DEFAULT_CONFIG };
    }

    const content = fs.readFileSync(configPath, 'utf-8');
    const parsed = JSON.parse(content) as Record<string, unknown>;

    // Merge with defaults (loaded values take precedence)
    const merged: GlobalConfig = {
      ...DEFAULT_CONFIG,
      ...parsed,
      // Deep merge featureFlags
      featureFlags: {
        ...DEFAULT_CONFIG.featureFlags,
        ...(parsed.featureFlags || {})
      }
    };

    // Schema evolution: apply defaults for new fields if not present in loaded config
    if (parsed.profile === undefined) {
      merged.profile = DEFAULT_CONFIG.profile;
    }
    if (parsed.delivery === undefined) {
      merged.delivery = DEFAULT_CONFIG.delivery;
    }

    maybeUpgradeLegacyEnterpriseDefaults(parsed, merged, configPath);

    return merged;
  } catch (error) {
    // Log warning for parse errors, but not for missing files
    if (error instanceof SyntaxError) {
      console.error(`Warning: Invalid JSON in ${configPath}, using defaults`);
    }
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * Saves the global configuration to disk.
 * Creates the config directory if it doesn't exist.
 */
export function saveGlobalConfig(config: GlobalConfig): void {
  const configDir = getGlobalConfigDir();
  const configPath = getGlobalConfigPath();

  // Create directory if it doesn't exist
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf-8');
}
