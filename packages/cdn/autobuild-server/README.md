# @grasdouble/cdn_autobuild-server

Auto-build server for serving static assets and microfrontends from the Lufa CDN infrastructure.

## Overview

This server automatically builds and serves microfrontend bundles on-demand, enabling:

- Dynamic microfrontend loading
- Version management and caching
- Import map generation
- Static asset serving with proper headers

## Features

- **On-demand building** - Build microfrontends as they are requested
- **Caching** - Intelligent caching to avoid redundant builds
- **Import maps** - Generate and serve import maps for shared dependencies
- **CORS handling** - Proper CORS headers for cross-origin requests
- **Health checks** - Monitoring endpoints for deployment

## Installation

```bash
pnpm add @grasdouble/cdn_autobuild-server
```

## Usage

```bash
# Development mode
pnpm cdn:autobuild-server:dev

# Build (ESM + CJS)
pnpm cdn:autobuild-server:build

# Production
pnpm cdn:autobuild-server:preview
```

## Configuration

Configuration is managed via environment variables:

```bash
PORT=3000
BUILD_CACHE_DIR=/tmp/cdn-cache
MAX_CACHE_AGE=3600
```

## API

- `GET /health` - Health check endpoint
- `GET /assets/:name/:version` - Serve built assets
- `GET /import-maps` - Generate import maps

## Development

```bash
# Lint
pnpm cdn:autobuild-server:lint

# Format
pnpm cdn:autobuild-server:prettier
```
