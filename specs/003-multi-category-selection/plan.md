# Implementation Plan: Multi-Category Selection for Questions

**Branch**: `003-multi-category-selection` | **Date**: 2026-03-22 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-multi-category-selection/spec.md`

## Summary

Modify the Interview Question Tracker to support assigning multiple categories to a single question. The current data model stores a single `category` string per question; this will change to a `categories` array. The form UI will switch from a single-select dropdown to inline toggle buttons/pills. Filtering, display, and local storage persistence will be updated accordingly. Existing single-category data in local storage will be migrated transparently.

## Technical Context

**Language/Version**: JavaScript (ES2022+), Vue 3.5  
**Primary Dependencies**: Vue 3, Vite 5, Tailwind CSS 4, @vue/test-utils 2, Vitest 2  
**Storage**: Browser localStorage (via `useLocalStorage` composable)  
**Testing**: Vitest + happy-dom + @vue/test-utils  
**Target Platform**: Web (modern browsers), deployed to GitHub Pages  
**Project Type**: Single-page web application (Vue 3 SPA)  
**Performance Goals**: Instant UI response (<100ms for toggle/filter interactions)  
**Constraints**: All data client-side only; no server; offline-capable after initial load  
**Scale/Scope**: Single-user, ~6 fixed categories, unbounded question count

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution file is an unfilled template — no project-specific principles have been ratified. No gates to evaluate. Proceeding without constitution constraints.

## Project Structure

### Documentation (this feature)

```text
specs/003-multi-category-selection/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── App.vue                        # Main app — wires filter state, passes to composable
├── main.js                        # Entry point (no changes)
├── style.css                      # Global styles (no changes)
├── components/
│   ├── CategoryFilter.vue         # Filter bar — unchanged (single-select filter is kept)
│   ├── CategoryFilter.test.js     # Filter tests — unchanged
│   ├── EmptyState.vue             # Empty state display — no changes
│   ├── QuestionCard.vue           # Card display — render multiple badges
│   ├── QuestionCard.test.js       # Card tests — test multi-badge rendering
│   ├── QuestionForm.vue           # Add/edit form — replace dropdown with toggle pills
│   ├── QuestionForm.test.js       # Form tests — test multi-select, validation
│   ├── QuestionList.vue           # List wrapper — no changes
│   └── QuestionList.test.js       # List tests — no changes
├── composables/
│   ├── useLocalStorage.js         # Generic localStorage — no changes
│   ├── useLocalStorage.test.js    # localStorage tests — no changes
│   ├── useQuestions.js            # Question CRUD + filter — update model, filter logic, migration
│   └── useQuestions.test.js       # Questions tests — test migration, multi-category filter
└── constants/
    ├── categories.js              # Category definitions — no changes
    └── categories.test.js         # Category tests — no changes
```

**Structure Decision**: Existing single-project Vue SPA structure. All changes modify existing files; no new files or directories needed.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
