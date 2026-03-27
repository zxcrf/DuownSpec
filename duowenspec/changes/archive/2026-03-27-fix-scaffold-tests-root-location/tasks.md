## 1. Scaffold Directory Mapping Adjustment

- [x] 1.1 Locate the scaffold mapping/template entry that currently emits `src/tests` during `duowenspec init --scaffold`.
- [x] 1.2 Update scaffold generation so tests are emitted under project-root `tests` and no generation path targets `src/tests`.
- [x] 1.3 Review related scaffold path handling to ensure path construction remains cross-platform (`path.join`/`path.resolve`-safe).

## 2. Verification and Regression Protection

- [x] 2.1 Add or update automated checks to assert root-level `tests` exists after scaffold init.
- [x] 2.2 Add or update automated checks to assert `src/tests` does not exist after scaffold init.
- [x] 2.3 Run focused init/scaffold tests on current environment and record outcomes.
- [x] 2.4 Add/confirm Windows verification coverage for this path-sensitive scaffold behavior.
