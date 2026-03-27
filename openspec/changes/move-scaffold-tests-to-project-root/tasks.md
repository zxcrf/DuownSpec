## 1. Scaffold Output Update

- [ ] 1.1 Locate scaffold template/path mapping that currently emits `src/tests/`.
- [ ] 1.2 Update scaffold generation so test files/directories are emitted under root `tests/`.
- [ ] 1.3 Remove or adjust any scaffold references that still point to `src/tests/`.

## 2. Verification and Regression Safety

- [ ] 2.1 Update or add initialization/scaffold tests to assert `tests/` exists at root.
- [ ] 2.2 Add assertion that `src/tests/` is not generated.
- [ ] 2.3 Run relevant test suite and confirm scaffolded output matches expected layout.
