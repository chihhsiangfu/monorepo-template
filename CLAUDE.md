# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important

- Always follow **ultracite-code-standards** when working with code in this repository.
- Always use `pnpm check-types` to check for type errors after editing code.
- Always use `pnpm lint` to check for lint errors after editing code.
- Always use `pnpm test` to run tests after editing code.
- Always use `pnpm test:e2e` to run tests after editing code.

## DB Management

- Always use `pnpm local:db:reset` to reset the local database whenever you modify the database schema. This will generate the latest migration sql, delete the local database and recreate it with the latest schema, and seed the database with data you need for testing.

## Rules and Skills Structure

- **Rules** (`.claude/rules/`): Automatically loaded based on file paths. Source of truth for project conventions.
- **Skills** (`.claude/skills/`): Manually invoked for specific integrations.

## Available Rules

| Rule                         | Applies To | Description                 |
| ---------------------------- | ---------- | --------------------------- |
| **ultracite-code-standards** | All files  | code linting and formatting |

## Available Skills

| Skill                           | When to Use                              |
| ------------------------------- | ---------------------------------------- |
| **vercel-react-best-practices** | Developing React or Next.js applications |

## Project Structure

```
monorepo-template/
├── apps/
│   ├── server/          # Backend API server (Hono + Drizzle + Better Auth)
│   ├── web/             # Next.js frontend (port 3000)
│   └── web-with-auth/   # Next.js frontend with authentication (port 3001)
├── packages/
│   ├── better-auth-hook/  # @repo/better-auth-hook - Better Auth React hooks
│   ├── template-pkg/      # @repo/template-pkg - Template utility package
│   └── template-pkg-ui/   # @repo/template-pkg-ui - Template UI components
├── .claude/
│   ├── rules/           # Auto-loaded rules based on file paths
│   └── skills/          # Manually invoked skill sets
├── biome.json           # Biome linter/formatter config
├── turbo.json           # Turborepo build orchestration
└── pnpm-workspace.yaml  # pnpm workspace config
```
