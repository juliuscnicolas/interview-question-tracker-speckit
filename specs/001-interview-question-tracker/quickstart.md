# Quickstart: Interview Question Tracker

**Date**: 2026-03-17  
**Feature Branch**: `001-interview-question-tracker`

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ (bundled with Node.js)
- Git

## Setup

```bash
# Clone the repository
git clone https://github.com/<owner>/interview-question-tracker-speckit.git
cd interview-question-tracker-speckit

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/`.

## Build

```bash
# Production build (outputs to dist/)
npm run build

# Preview production build locally
npm run preview
```

## Test

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## Deploy

Deployment is automated via GitHub Actions. Pushing to the `main` branch triggers:

1. Install dependencies
2. Build with Vite
3. Deploy `dist/` to GitHub Pages

The live app will be available at `https://<owner>.github.io/interview-question-tracker-speckit/`.

### Manual deploy (if needed)

```bash
npm run build
# Then push dist/ contents to gh-pages branch
```

## Project Structure

```text
src/
├── components/          # Vue single-file components
│   ├── QuestionCard.vue     # Individual question display card
│   ├── QuestionForm.vue     # Add/Edit form (shared)
│   ├── QuestionList.vue     # Card list container
│   ├── CategoryFilter.vue   # Category filter bar
│   ├── ConfirmDialog.vue    # Delete confirmation modal
│   └── EmptyState.vue       # Empty state message
├── composables/         # Vue 3 composables (state logic)
│   ├── useQuestions.js      # CRUD operations + filtering
│   └── useLocalStorage.js   # localStorage sync wrapper
├── constants/           # Static data
│   └── categories.js        # Category definitions + colors
├── App.vue              # Root component (layout)
├── main.js              # App entry point
└── style.css            # Tailwind CSS imports + global styles
```

## Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run Vitest unit tests |
| `npm run test:watch` | Run tests in watch mode |
