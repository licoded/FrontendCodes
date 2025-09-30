# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite application demonstrating scroll anchoring and lazy loading functionality. The project uses React 19, TypeScript, and includes a custom intersection observer implementation for lazy image loading.

## Development Commands

- **Start development server**: `npm run dev` or `pnpm dev`
- **Build for production**: `npm run build` or `pnpm build` (includes TypeScript compilation)
- **Run linter**: `npm run lint` or `pnpm lint`
- **Preview production build**: `npm run preview` or `pnpm preview`

Note: This project uses pnpm as the package manager (evidenced by pnpm-lock.yaml).

## Code Architecture

### Core Components

- **App.tsx**: Main application component that demonstrates scroll anchoring with MDN content blocks and a lazy-loaded image
- **LazyImg component** (`src/components/LazyImg.tsx`): Implements lazy loading with configurable preload distance and delay using intersection observer
- **MDN component** (`src/MDN.tsx`): Static content component containing Chinese documentation about scroll anchoring with embedded advertisement placeholders

### Utilities

- **useIntersectionObserver** (`src/utils/useIntersectionObserver.ts`): Custom hook wrapping the Intersection Observer API with cleanup functionality

### Key Features

1. **Lazy Image Loading**: Images load when they come within a configurable distance (default 200px) of the viewport
2. **Scroll Anchoring Demo**: The app demonstrates browser scroll anchoring behavior with multiple content blocks
3. **Configurable Preload**: LazyImg supports customizable preload distance and delay timing

## TypeScript Configuration

- Uses strict TypeScript settings with `strict: true`
- Configured for React JSX with `jsx: "react-jsx"`
- Targets ES2020 with DOM libraries
- Enforces unused variables/parameters checking

## Dependencies

- **React 19**: Latest React version
- **usehooks-ts**: TypeScript React hooks library (currently unused but available)
- **Vite**: Build tool and dev server
- **ESLint**: Configured with React hooks and refresh plugins

## Development Notes

- The project includes Chinese content in MDN.tsx for scroll anchoring documentation
- LazyImg uses a placeholder image from `res.lgdsunday.club`
- Default lazy loading behavior includes 200px preload distance with no delay
- The intersection observer implementation includes proper cleanup via the `stop()` method