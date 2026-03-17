# Research: Interview Question Tracker

**Date**: 2026-03-17  
**Feature Branch**: `001-interview-question-tracker`

## R1: Vue 3 + Vite + Tailwind CSS Project Setup

**Decision**: Use `create-vue` (official Vue scaffolding) with Vite, then add Tailwind CSS 3 via `@tailwindcss/vite`.

**Rationale**:
- `create-vue` is the official recommended way to scaffold Vue 3 projects with Vite
- Tailwind CSS 3 integrates natively with Vite via `@tailwindcss/vite` plugin
- No need for Vue Router (single-screen app) or Pinia (localStorage composable is sufficient)

**Alternatives considered**:
- Nuxt 3: Overkill for a static SPA with no routing or SSR needs
- Manual Vite setup: More work, same result as `create-vue`

## R2: GitHub Pages Deployment with GitHub Actions

**Decision**: Use the official `actions/deploy-pages` workflow with Vite's static build output.

**Rationale**:
- GitHub provides official `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages` actions
- Vite outputs to `dist/` by default, which can be uploaded directly
- `vite.config.js` needs `base` set to the repository name for correct asset paths on GitHub Pages

**Alternatives considered**:
- `gh-pages` npm package (manual push to branch): Adds a dependency and requires manual runs
- Netlify/Vercel: Different hosting target than specified

## R3: localStorage Persistence Pattern for Vue 3

**Decision**: Custom `useLocalStorage` composable using `reactive()` + `watch()` with JSON serialization.

**Rationale**:
- A simple composable wrapping `localStorage.getItem`/`setItem` with `JSON.parse`/`JSON.stringify` is sufficient
- `watch(deep: true)` on the reactive state auto-syncs changes to localStorage
- No need for VueUse or other libraries for this single use case

**Alternatives considered**:
- VueUse `useLocalStorage`: Adds a full library dependency for one composable
- Pinia with persistence plugin: Over-engineered for a flat list of questions

## R4: Unique ID Generation (Client-Side)

**Decision**: Use `crypto.randomUUID()` (native Web API).

**Rationale**:
- Available in all modern evergreen browsers (Chrome 92+, Firefox 95+, Edge 92+, Safari 15.4+)
- Generates RFC 4122 v4 UUIDs with no dependencies
- Matches the spec assumption of targeting modern browsers only

**Alternatives considered**:
- `uuid` npm package: Unnecessary dependency when native API exists
- Timestamp-based IDs: Risk of collision if multiple questions added in same millisecond
- Auto-increment counter: Fragile with localStorage (deletions create gaps, resets on clear)

## R5: Tailwind CSS Category Badge Colors

**Decision**: Map each category to a distinct Tailwind color class for visual differentiation.

**Rationale**:
- Six categories need visually distinct badges for quick scanning
- Tailwind's color palette provides enough contrast: blue (Frontend), green (Backend), emerald (Vue), cyan (React), purple (.NET), gray (Others)
- Defined as a constant map alongside category names

**Alternatives considered**:
- Single color for all badges: Poor UX, categories not scannable at a glance
- Custom CSS colors: Unnecessary when Tailwind palette is sufficient

## R6: Form UX Pattern (Add/Edit)

**Decision**: Inline form at the top of the page for adding, modal/overlay for editing.

**Rationale**:
- Add form at the top keeps the primary action visible and accessible (one-click to start)
- Edit uses a modal to avoid disrupting the question list scroll position
- Both share the same `QuestionForm` component with different props (mode: add vs edit)

**Alternatives considered**:
- Separate page/route for forms: Requires Vue Router, over-engineered for this scope
- Inline editing in cards: Complex UX for multi-field editing, harder to validate
