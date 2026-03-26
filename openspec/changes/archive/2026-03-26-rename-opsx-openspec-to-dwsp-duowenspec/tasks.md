## 1. Rename Command Surface

- [x] 1.1 Update package/bin metadata so the primary executable command is `dwsp`
- [x] 1.2 Update CLI usage/help output to show `dwsp` as the primary command name
- [x] 1.3 Keep or remove legacy alias behavior explicitly and document the final decision

## 2. Rename Generated Workflow Keywords

- [x] 2.1 Update command-generation templates so core workflow commands use `/dwsp:*`
- [x] 2.2 Update tool-specific adapters/prompts so generated command files and references use `dwsp`
- [x] 2.3 Update init/update generated guidance to use `dwsp` keyword in next-step examples

## 3. Rename Core Product Keyword

- [x] 3.1 Replace user-facing core operation `openspec` references with `duowenspec` in init/update messaging
- [x] 3.2 Update docs/instruction templates in active command surfaces to use `duowenspec`
- [x] 3.3 Verify no mixed `opsx`/`openspec` keywords remain in core generated assets

## 4. Verification and Regression Safety

- [x] 4.1 Add/adjust tests for binary name, command generation, and init/update output keyword changes
- [x] 4.2 Add Windows-safe path assertions for renamed command outputs where relevant
- [x] 4.3 Run targeted test suites and confirm renamed surfaces work for clean init and update flows
- [x] 4.4 Validate change artifacts with `node bin/opsx.js validate rename-opsx-openspec-to-dwsp-duowenspec`
