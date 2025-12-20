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
  - **`web/`**: A frontend application built with **Next.js 15+** and **React 19**.
    - **Styling**: Tailwind CSS 4.
    - **State Management**: Zustand (global state) & Nuqs (URL search params).
    - **Data Fetching**: TanStack Query.
    - **UI Components**: A local set of components in `src/components/ui`, influenced by Base UI.
  - **`server/`**: A backend API built with **Hono** running on Node.js.
- **`packages/`**: Shared internal packages.
  - **`template-pkg/`**: A general-purpose TypeScript utility package template (configured with `tsdown` and `vitest`).
  - **`template-pkg-ui/`**: A shared UI component library template (configured with `tsdown`, `vitest`, Radix UI, and Tailwind CSS 4).

### Configuration Files

- **`package.json`**: Root dependency management.
- **`pnpm-workspace.yaml`**: Defines the workspace structure (apps, packages) and manages dependency versions via `catalog:`.
- **`turbo.json`**: Configuration for TurboRepo's build pipelines and caching.
- **`biome.json`**: Configuration for Biome (formatting and linting).
- **`tsconfig.json`**: Base TypeScript configuration shared across the project.