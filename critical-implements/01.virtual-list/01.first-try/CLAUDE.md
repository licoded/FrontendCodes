# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite project focused on implementing virtual list functionality. The project is in its initial setup phase with minimal boilerplate code.

## Development Commands

- **Start development server**: `pnpm dev` or `npm run dev`
- **Build for production**: `pnpm build` or `npm run build`
- **Lint code**: `pnpm lint` or `npm run lint`
- **Preview production build**: `pnpm preview` or `npm run preview`

## Architecture

- **Framework**: React 19.1.0 with TypeScript
- **Build Tool**: Vite 6.3.5 with React plugin
- **Package Manager**: pnpm (based on pnpm-lock.yaml presence)
- **Linting**: ESLint with React hooks and React refresh plugins
- **Type Checking**: TypeScript 5.8.3 with separate configs for app and node

## Key Files

- `src/App.tsx`: Main application component (currently minimal placeholder)
- `src/main.tsx`: Application entry point using React 19's createRoot
- `src/index.css`: Global styles (currently empty)
- `vite.config.ts`: Basic Vite configuration with React plugin
- `tsconfig.json`: Root TypeScript config referencing app and node configs

## TypeScript Configuration

The project uses a modular TypeScript setup:
- `tsconfig.json`: Root config with references
- `tsconfig.app.json`: Application-specific config
- `tsconfig.node.json`: Node/build tool config

## Development Notes

- The project uses React 19 features and patterns
- ESLint is configured with modern flat config format
- Virtual list implementation is the primary focus but not yet implemented
- CSS/styling approach not yet established (index.css is empty)

## Git Commit Guidelines

- Commit changes promptly when:
  - Changes accumulate to a significant size
  - Starting new work with uncommitted changes
  - Requested by Claude Code
- Always commit modifications to CLAUDE.md separately from other changes
- Include clear, descriptive commit messages explaining the "why" of changes