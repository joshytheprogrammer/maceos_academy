# Copilot Instructions for maceos_academy

## Project Context
- **Framework**: Nuxt 4 (Vue 3 ecosystem).
- **Language**: JavaScript (`.ts` config files, Vue 3 Composition API).
- **Package Manager**: Bun is the preferred runner (detected `bun` terminal).

## Architecture & Data Flow
- **Entry Point**: `app/app.vue` defines the root application layout.
- **Directory Structure**:
  - `app/`: Contains the core application source code.
  - `public/`: Static assets served at the root path.
  - Root configuration: `nuxt.config.ts`, `tsconfig.json`.
- **Nuxt 4 Conventions**: 
  - Leverage Nuxt's auto-import system for composables and Vue APIs (no need to explicit import `ref`, `computed`, etc.).
  - Configuration is centralized in `defineNuxtConfig`.

## Development Workflow
- **Scripts** (Run via `bun`):
  - Start Dev Server: `bun run dev` (starts on http://localhost:3000) but assume it is already running
  - Build for Production: `bun run build` never do this. The user is local.
  - Type Check/Prepare: `bun run postinstall` (runs `nuxt prepare`)

## Coding Standards
- **Components**: Use `<script setup lang="ts">`.
- **Styling**: Single-file components (SFC) style blocks.
- **Navigation**: Use `<NuxtLink>` for internal routing.
- **State**: Use `useState` for server-friendly shared state across components.
