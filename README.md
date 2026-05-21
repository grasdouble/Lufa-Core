<p align="center">
  <img src="./images/Lufa_Logo.png" alt="Lufa Logo" width="200" />
</p>

<h1 align="center">Lufa Core</h1>

<p align="center">
  A pnpm monorepo housing the shared infrastructure, tooling, and CDN services for the Lufa ecosystem.
</p>

<p align="center">
  <a href="https://github.com/grasdouble/Lufa-Core/blob/main/LICENSE.md">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" />
  </a>
  <img src="https://img.shields.io/badge/pnpm-11.1.2-orange" alt="pnpm version" />
  <img src="https://img.shields.io/badge/node-%3E%3D18-green" alt="Node version" />
</p>

---

## Overview

**Lufa Core** is the backbone of the Lufa ecosystem. It provides shared configurations, CDN infrastructure, and experimental POCs used across all Lufa projects.

## Repository Structure

```
Lufa-Core/
├── packages/
│   ├── cdn/                    # CDN infrastructure
│   │   └── autobuild-server/   # On-demand microfrontend build & serving
│   ├── config/                 # Shared tooling configurations
│   │   ├── eslint/             # ESLint shared config
│   │   ├── prettier/           # Prettier shared config
│   │   └── tsconfig/           # TypeScript shared config
│   └── poc/                    # Proof of Concept experiments
├── _docs/                      # Global documentation
├── scripts/                    # Utility scripts
└── images/                     # Project assets
```

## Packages

### CDN

| Package                                                               | Version                                                                                                                                                                                                          | Description                                                      |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [`@grasdouble/cdn_autobuild-server`](./packages/cdn/autobuild-server) | ![npm](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fgrasdouble%2FLufa-Core%2Fmain%2Fpackages%2Fcdn%2Fautobuild-server%2Fpackage.json&query=%24.version&label=version) | Self-fed CDN — builds and serves microfrontend bundles on demand |

### Config

| Package                                                          | Version                                                                                                                                                                                                     | Description                                                             |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [`@grasdouble/lufa_config_eslint`](./packages/config/eslint)     | ![npm](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fgrasdouble%2FLufa-Core%2Fmain%2Fpackages%2Fconfig%2Feslint%2Fpackage.json&query=%24.version&label=version)   | Shared ESLint configurations (basic, node, react)                       |
| [`@grasdouble/lufa_config_prettier`](./packages/config/prettier) | ![npm](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fgrasdouble%2FLufa-Core%2Fmain%2Fpackages%2Fconfig%2Fprettier%2Fpackage.json&query=%24.version&label=version) | Shared Prettier configuration                                           |
| [`@grasdouble/lufa_config_tsconfig`](./packages/config/tsconfig) | ![npm](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fgrasdouble%2FLufa-Core%2Fmain%2Fpackages%2Fconfig%2Ftsconfig%2Fpackage.json&query=%24.version&label=version) | Shared TypeScript configurations (base, node, react-app, react-library) |

### POC

Experimental implementations — not for production use. See [`_docs/POCs.md`](./_docs/POCs.md) for the full list.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) 11.x

### Installation

```bash
# Clone the repository
git clone https://github.com/grasdouble/Lufa-Core.git
cd Lufa-Core

# Install dependencies
pnpm install
```

## Development

### Common Commands

```bash
# Build all packages
pnpm all:build

# Type check all packages
pnpm all:typecheck

# Lint all packages
pnpm all:lint

# Run tests across all packages
pnpm all:test

# Format code (check)
pnpm all:prettier:check

# Format code (write)
pnpm all:prettier:write
```

### Dependency Management

```bash
# Check for outdated dependencies
pnpm deps:outdated

# Upgrade all dependencies
pnpm deps:upgrade

# Audit for vulnerabilities
pnpm deps:audit
```

### Cleanup

```bash
# Full cleanup (node_modules, dist, cache)
pnpm clean

# Clean only build artifacts
pnpm clean:lib

# Clean only caches
pnpm clean:cache
```

## Versioning & Releases

This project uses [Changesets](https://github.com/changesets/changesets) for versioning and publishing.

```bash
# Create a new changeset
pnpm changeset

# Version packages
pnpm changeset version

# Publish packages
pnpm changeset publish
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit your changes with a proper message (see commit conventions)
4. Push your branch and open a Pull Request

## License

MIT © [Grasdouble](https://github.com/grasdouble) — see [LICENSE.md](./LICENSE.md) for details.
