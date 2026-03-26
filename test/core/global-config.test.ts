import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

import {
  getGlobalConfigDir,
  getGlobalConfigPath,
  getGlobalConfig,
  saveGlobalConfig,
  GLOBAL_CONFIG_DIR_NAME,
  GLOBAL_CONFIG_FILE_NAME
} from '../../src/core/global-config.js';
import type { Profile, Delivery } from '../../src/core/global-config.js';

describe('global-config', () => {
  let tempDir: string;
  let originalEnv: NodeJS.ProcessEnv;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Create temp directory for tests
    tempDir = path.join(os.tmpdir(), `duowenspec-global-config-test-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });

    // Save original env
    originalEnv = { ...process.env };

    // Spy on console.error for warning tests
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore original env
    process.env = originalEnv;

    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  describe('constants', () => {
    it('should export correct directory name', () => {
      expect(GLOBAL_CONFIG_DIR_NAME).toBe('opsx');
    });

    it('should export correct file name', () => {
      expect(GLOBAL_CONFIG_FILE_NAME).toBe('config.json');
    });
  });

  describe('getGlobalConfigDir', () => {
    it('should use XDG_CONFIG_HOME when set', () => {
      process.env.XDG_CONFIG_HOME = tempDir;

      const result = getGlobalConfigDir();

      expect(result).toBe(path.join(tempDir, 'opsx'));
    });

    it('should fall back to ~/.config on Unix/macOS without XDG_CONFIG_HOME', () => {
      delete process.env.XDG_CONFIG_HOME;

      const result = getGlobalConfigDir();

      // On non-Windows, should use ~/.config/opsx
      if (os.platform() !== 'win32') {
        expect(result).toBe(path.join(os.homedir(), '.config', 'opsx'));
      }
    });

    it('should use APPDATA on Windows when XDG_CONFIG_HOME is not set', () => {
      // This test only makes sense conceptually - we can't change os.platform()
      // But we can verify the APPDATA logic by checking the code path
      if (os.platform() === 'win32') {
        delete process.env.XDG_CONFIG_HOME;
        const appData = process.env.APPDATA;
        if (appData) {
          const result = getGlobalConfigDir();
          expect(result).toBe(path.join(appData, 'opsx'));
        }
      }
    });
  });

  describe('getGlobalConfigPath', () => {
    it('should return path to config.json in config directory', () => {
      process.env.XDG_CONFIG_HOME = tempDir;

      const result = getGlobalConfigPath();

      expect(result).toBe(path.join(tempDir, 'opsx', 'config.json'));
    });
  });

  describe('getGlobalConfig', () => {
    it('should return defaults when config file does not exist', () => {
      process.env.XDG_CONFIG_HOME = tempDir;

      const config = getGlobalConfig();

      expect(config).toEqual({
        featureFlags: {},
        profile: 'custom',
        delivery: 'both',
        workflows: ['propose', 'explore', 'apply', 'review', 'verify', 'document', 'archive'],
      });
    });

    it('should not create directory when reading non-existent config', () => {
      process.env.XDG_CONFIG_HOME = tempDir;
      const configDir = path.join(tempDir, 'opsx');

      getGlobalConfig();

      expect(fs.existsSync(configDir)).toBe(false);
    });

    it('should load valid config from file', () => {
      process.env.XDG_CONFIG_HOME = tempDir;
      const configDir = path.join(tempDir, 'opsx');
      const configPath = path.join(configDir, 'config.json');

      fs.mkdirSync(configDir, { recursive: true });
      fs.writeFileSync(configPath, JSON.stringify({
        featureFlags: { testFlag: true, anotherFlag: false }
      }));

      const config = getGlobalConfig();

      expect(config.featureFlags).toEqual({ testFlag: true, anotherFlag: false });
    });

    it('should return defaults for invalid JSON', () => {
      process.env.XDG_CONFIG_HOME = tempDir;
      const configDir = path.join(tempDir, 'opsx');
      const configPath = path.join(configDir, 'config.json');

      fs.mkdirSync(configDir, { recursive: true });
      fs.writeFileSync(configPath, '{ invalid json }');

      const config = getGlobalConfig();

      expect(config).toEqual({
        featureFlags: {},
        profile: 'custom',
        delivery: 'both',
        workflows: ['propose', 'explore', 'apply', 'review', 'verify', 'document', 'archive'],
      });
    });

    it('should log warning for invalid JSON', () => {
      process.env.XDG_CONFIG_HOME = tempDir;
      const configDir = path.join(tempDir, 'opsx');
      const configPath = path.join(configDir, 'config.json');

      fs.mkdirSync(configDir, { recursive: true });
      fs.writeFileSync(configPath, '{ invalid json }');

      getGlobalConfig();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid JSON')
      );
    });

    it('should preserve unknown fields from config file', () => {
      process.env.XDG_CONFIG_HOME = tempDir;
      const configDir = path.join(tempDir, 'opsx');
      const configPath = path.join(configDir, 'config.json');

      fs.mkdirSync(configDir, { recursive: true });
      fs.writeFileSync(configPath, JSON.stringify({
        featureFlags: { x: true },
        unknownField: 'preserved',
        futureOption: 123
      }));

      const config = getGlobalConfig();

      expect((config as any).unknownField).toBe('preserved');
      expect((config as any).futureOption).toBe(123);
    });

    it('should merge loaded config with defaults', () => {
      process.env.XDG_CONFIG_HOME = tempDir;
      const configDir = path.join(tempDir, 'opsx');
      const configPath = path.join(configDir, 'config.json');

      // Config with only some fields
      fs.mkdirSync(configDir, { recursive: true });
      fs.writeFileSync(configPath, JSON.stringify({
        featureFlags: { customFlag: true }
      }));

      const config = getGlobalConfig();

      // Should have the custom flag
      expect(config.featureFlags?.customFlag).toBe(true);
    });

    describe('schema evolution', () => {
      it('should add default profile and delivery when loading old config without them', () => {
        process.env.XDG_CONFIG_HOME = tempDir;
        const configDir = path.join(tempDir, 'opsx');
        const configPath = path.join(configDir, 'config.json');

        // Simulate a pre-existing config that only has featureFlags
        fs.mkdirSync(configDir, { recursive: true });
        fs.writeFileSync(configPath, JSON.stringify({
          featureFlags: { existingFlag: true }
        }));

        const config = getGlobalConfig();

        expect(config.profile).toBe('custom');
        expect(config.delivery).toBe('both');
        expect(config.workflows).toEqual(['propose', 'explore', 'apply', 'review', 'verify', 'document', 'archive']);
        expect(config.featureFlags?.existingFlag).toBe(true);
      });

      it('should preserve explicit profile and delivery values from config', () => {
        process.env.XDG_CONFIG_HOME = tempDir;
        const configDir = path.join(tempDir, 'opsx');
        const configPath = path.join(configDir, 'config.json');

        fs.mkdirSync(configDir, { recursive: true });
        fs.writeFileSync(configPath, JSON.stringify({
          featureFlags: {},
          profile: 'custom',
          delivery: 'skills',
          workflows: ['propose', 'review']
        }));

        const config = getGlobalConfig();

        expect(config.profile).toBe('custom');
        expect(config.delivery).toBe('skills');
        expect(config.workflows).toEqual(['propose', 'review']);
      });

      it('should upgrade legacy custom default workflows to enterprise defaults', () => {
        process.env.XDG_CONFIG_HOME = tempDir;
        const configDir = path.join(tempDir, 'opsx');
        const configPath = path.join(configDir, 'config.json');

        fs.mkdirSync(configDir, { recursive: true });
        fs.writeFileSync(configPath, JSON.stringify({
          featureFlags: {},
          profile: 'custom',
          delivery: 'both',
          workflows: ['propose', 'explore', 'apply', 'archive']
        }));

        const config = getGlobalConfig();
        const persisted = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

        expect(config.profile).toBe('custom');
        expect(config.workflows).toEqual(['propose', 'explore', 'apply', 'review', 'verify', 'document', 'archive']);
        expect(persisted.workflows).toEqual(['propose', 'explore', 'apply', 'review', 'verify', 'document', 'archive']);
      });

      it('should preserve explicit custom workflow selections that differ from the legacy defaults', () => {
        process.env.XDG_CONFIG_HOME = tempDir;
        const configDir = path.join(tempDir, 'opsx');
        const configPath = path.join(configDir, 'config.json');

        fs.mkdirSync(configDir, { recursive: true });
        fs.writeFileSync(configPath, JSON.stringify({
          featureFlags: {},
          profile: 'custom',
          delivery: 'both',
          workflows: ['propose', 'explore', 'apply']
        }));

        const config = getGlobalConfig();
        const persisted = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

        expect(config.workflows).toEqual(['propose', 'explore', 'apply']);
        expect(persisted.workflows).toEqual(['propose', 'explore', 'apply']);
      });

      it('should round-trip new fields correctly', () => {
        process.env.XDG_CONFIG_HOME = tempDir;
        const originalConfig = {
          featureFlags: { flag1: true },
          profile: 'custom' as Profile,
          delivery: 'commands' as Delivery,
          workflows: ['propose']
        };

        saveGlobalConfig(originalConfig);
        const loadedConfig = getGlobalConfig();

        expect(loadedConfig.profile).toBe('custom');
        expect(loadedConfig.delivery).toBe('commands');
        expect(loadedConfig.workflows).toEqual(['propose']);
      });

      it('should default workflows to the enterprise workflow set when not in config', () => {
        process.env.XDG_CONFIG_HOME = tempDir;
        const configDir = path.join(tempDir, 'opsx');
        const configPath = path.join(configDir, 'config.json');

        fs.mkdirSync(configDir, { recursive: true });
        fs.writeFileSync(configPath, JSON.stringify({
          featureFlags: {},
          profile: 'core',
          delivery: 'both'
        }));

        const config = getGlobalConfig();

        expect(config.workflows).toEqual(['propose', 'explore', 'apply', 'review', 'verify', 'document', 'archive']);
      });
    });
  });

  describe('saveGlobalConfig', () => {
    it('should create directory if it does not exist', () => {
      process.env.XDG_CONFIG_HOME = tempDir;
      const configDir = path.join(tempDir, 'opsx');

      saveGlobalConfig({ featureFlags: { test: true } });

      expect(fs.existsSync(configDir)).toBe(true);
    });

    it('should write config to file', () => {
      process.env.XDG_CONFIG_HOME = tempDir;
      const configPath = path.join(tempDir, 'opsx', 'config.json');

      saveGlobalConfig({ featureFlags: { myFlag: true } });

      const content = fs.readFileSync(configPath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed.featureFlags.myFlag).toBe(true);
    });

    it('should overwrite existing config file', () => {
      process.env.XDG_CONFIG_HOME = tempDir;
      const configDir = path.join(tempDir, 'opsx');
      const configPath = path.join(configDir, 'config.json');

      // Create initial config
      fs.mkdirSync(configDir, { recursive: true });
      fs.writeFileSync(configPath, JSON.stringify({ featureFlags: { old: true } }));

      // Overwrite
      saveGlobalConfig({ featureFlags: { new: true } });

      const content = fs.readFileSync(configPath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed.featureFlags.new).toBe(true);
      expect(parsed.featureFlags.old).toBeUndefined();
    });

    it('should write formatted JSON with trailing newline', () => {
      process.env.XDG_CONFIG_HOME = tempDir;
      const configPath = path.join(tempDir, 'opsx', 'config.json');

      saveGlobalConfig({ featureFlags: {} });

      const content = fs.readFileSync(configPath, 'utf-8');
      expect(content).toContain('\n');
      expect(content.endsWith('\n')).toBe(true);
    });

    it('should round-trip config correctly', () => {
      process.env.XDG_CONFIG_HOME = tempDir;
      const originalConfig = {
        featureFlags: { flag1: true, flag2: false }
      };

      saveGlobalConfig(originalConfig);
      const loadedConfig = getGlobalConfig();

      expect(loadedConfig.featureFlags).toEqual(originalConfig.featureFlags);
    });
  });
});
