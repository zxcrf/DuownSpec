# Installation

## Prerequisites

- **Node.js 20.19.0 or higher** — Check your version: `node --version`

## Package Managers

### npm

```bash
npm install -g @duowen-ai/opsx@latest
```

### pnpm

```bash
pnpm add -g @duowen-ai/opsx@latest
```

### yarn

```bash
yarn global add @duowen-ai/opsx@latest
```

### bun

```bash
bun add -g @duowen-ai/opsx@latest
```

## Nix

Run OpenSpec directly without installation:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Or install to your profile:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Or add to your development environment in `flake.nix`:

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    openspec.url = "github:Fission-AI/OpenSpec";
  };

  outputs = { nixpkgs, openspec, ... }: {
    devShells.x86_64-linux.default = nixpkgs.legacyPackages.x86_64-linux.mkShell {
      buildInputs = [ openspec.packages.x86_64-linux.default ];
    };
  };
}
```

## Verify Installation

```bash
opsx --version
```

## Next Steps

After installing, initialize OpenSpec in your project:

```bash
cd your-project
opsx init
```

See [Getting Started](getting-started.md) for a full walkthrough.
