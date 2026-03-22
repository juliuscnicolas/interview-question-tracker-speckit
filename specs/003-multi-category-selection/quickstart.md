# Quickstart: Multi-Category Selection for Questions

**Feature**: 003-multi-category-selection  
**Date**: 2026-03-22

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
git checkout 003-multi-category-selection
npm install
```

## Development

```bash
npm run dev
```

Opens at `http://localhost:5173/interview-question-tracker-speckit/`

## Testing

```bash
# Run all tests once
npm test

# Watch mode
npm run test:watch
```

## Key Files to Modify

| File | Change Summary |
|------|----------------|
| `src/composables/useQuestions.js` | Data model: `category` → `categories[]`, migration logic, filter predicate |
| `src/composables/useQuestions.test.js` | Tests for migration, multi-category CRUD, filter with arrays |
| `src/components/QuestionForm.vue` | Replace `<select>` with toggle button pills, multi-select state |
| `src/components/QuestionForm.test.js` | Tests for multi-select toggle, validation (≥1 category) |
| `src/components/QuestionCard.vue` | Render multiple category badges with `v-for` |
| `src/components/QuestionCard.test.js` | Tests for multi-badge rendering |
| `src/App.vue` | Update empty message for filter context |

## Build & Deploy

```bash
npm run build     # Output to dist/
npm run preview   # Preview production build locally
```

Deployment to GitHub Pages is automated via GitHub Actions on push to `main`.
