# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important

- Always follow **ultracite-code-standards** when working with code in this repository.
- Always use `pnpm check-types` to check for type errors.

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
