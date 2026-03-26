/**
 * Static template strings for Bash completion scripts.
 * These are Bash-specific helper functions that never change.
 */

export const BASH_DYNAMIC_HELPERS = `# Dynamic completion helpers

_dwsp_complete_changes() {
  local changes
  changes=$(dwsp __complete changes 2>/dev/null | cut -f1)
  COMPREPLY=($(compgen -W "$changes" -- "$cur"))
}

_dwsp_complete_specs() {
  local specs
  specs=$(dwsp __complete specs 2>/dev/null | cut -f1)
  COMPREPLY=($(compgen -W "$specs" -- "$cur"))
}

_dwsp_complete_items() {
  local items
  items=$(dwsp __complete changes 2>/dev/null | cut -f1; dwsp __complete specs 2>/dev/null | cut -f1)
  COMPREPLY=($(compgen -W "$items" -- "$cur"))
}`;
