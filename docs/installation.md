# Installation

## Prerequisites

- **Node.js 20.19.0 or higher** — Check your version: `node --version`

## Package Managers

### npm

```bash
npm install -g @duowen-ai/duowenspec@latest
```

### pnpm

```bash
pnpm add -g @duowen-ai/duowenspec@latest
```

### yarn

```bash
yarn global add @duowen-ai/duowenspec@latest
```

### bun

```bash
bun add -g @duowen-ai/duowenspec@latest
```

## Nix

Run DuowenSpec directly without installation:

```bash
nix run github:Fission-AI/DuowenSpec -- init
```

Or install to your profile:

```bash
nix profile install github:Fission-AI/DuowenSpec
```

Or add to your development environment in `flake.nix`:

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    duowenspec.url = "github:Fission-AI/DuowenSpec";
  };

  outputs = { nixpkgs, duowenspec, ... }: {
    devShells.x86_64-linux.default = nixpkgs.legacyPackages.x86_64-linux.mkShell {
      buildInputs = [ duowenspec.packages.x86_64-linux.default ];
    };
  };
}
```

## Verify Installation

```bash
dwsp --version
```

## Next Steps

After installing, initialize DuowenSpec in your project:

```bash
cd your-project
dwsp init
```

See [Getting Started](getting-started.md) for a full walkthrough.
