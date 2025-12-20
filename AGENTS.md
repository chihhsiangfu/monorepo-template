# AGENTS.md

## Setup Commands

- **Install dependencies**: `pnpm install`
- **Start development server**: `pnpm dev`

## Code Style

- Ensure you follow the code style guidelines defined by Ultracite. Refer to [GEMINI.md](./GEMINI.md) for details.

## Project Structure

This project is a monorepo managed by **TurboRepo** and **pnpm**.

### Core Directories

- **`apps/`**: Contains the application source code.
  - **`web/`**: A Next.js application using Tailwind CSS and shadcn/ui components.
- **`packages/`**: Shared internal packages.
  - **`template-pkg/`**: A general-purpose TypeScript utility package (configured with `tsdown` and `vitest`).
  - **`template-pkg-ui/`**: A shared UI component library (configured with `tsdown`, `vitest`, and Tailwind CSS).

### Configuration Files

- **`package.json`**: Root dependency management.
- **`pnpm-workspace.yaml`**: Defines the workspace structure for pnpm.
- **`turbo.json`**: Configuration for TurboRepo's build pipelines and caching.
- **`biome.json`**: Configuration for Biome (formatting and linting).
- **`tsconfig.json`**: Base TypeScript configuration shared across the project.
