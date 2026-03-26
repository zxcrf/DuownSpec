## Why

Users need a way to view and modify their global DuowenSpec settings without manually editing JSON files. The `global-config` spec provides the foundation, but there's no user-facing interface to interact with the config. A dedicated `duowenspec config` command provides discoverability and ease of use.

## What Changes

Add `duowenspec config` subcommand with the following operations:

```bash
duowenspec config path                          # Show config file location
duowenspec config list [--json]                 # Show all current settings
duowenspec config get <key>                     # Get a specific value (raw, scriptable)
duowenspec config set <key> <value> [--string]  # Set a value (auto-coerce types)
duowenspec config unset <key>                   # Remove a key (revert to default)
duowenspec config reset --all [-y]              # Reset everything to defaults
duowenspec config edit                          # Open config in $EDITOR
```

**Key design decisions:**
- **Key naming**: Use camelCase to match JSON structure (e.g., `featureFlags.someFlag`)
- **Nested keys**: Support dot notation for nested access
- **Type coercion**: Auto-detect types by default; `--string` flag forces string storage
- **Scriptable output**: `get` prints raw value only (no labels) for easy piping
- **Zod validation**: Use zod for config schema validation and type safety
- **Future-proofing**: Reserve `--scope global|project` flag for potential project-local config

**Example usage:**
```bash
$ duowenspec config path
/Users/me/.config/duowenspec/config.json

$ duowenspec config list
featureFlags: {}

$ duowenspec config set featureFlags.enableTelemetry false
Set featureFlags.enableTelemetry = false

$ duowenspec config get featureFlags.enableTelemetry
false

$ duowenspec config list --json
{
  "featureFlags": {}
}

$ duowenspec config unset featureFlags.enableTelemetry
Unset featureFlags.enableTelemetry (reverted to default)

$ duowenspec config edit
# Opens $EDITOR with config.json
```

## Impact

- Affected specs: New `cli-config` capability
- Affected code:
  - New `src/commands/config.ts`
  - New `src/core/config-schema.ts` (zod schema)
  - Update CLI entry point to register config command
- Dependencies: Requires `global-config` spec (already implemented)
