# Tasks: Interview Question Tracker

**Input**: Design documents from `/specs/001-interview-question-tracker/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not requested in feature specification. No test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Scaffold Vue 3 + Vite + Tailwind CSS project and configure tooling

- [ ] T001 Scaffold Vue 3 project with Vite using create-vue in project root (package.json, vite.config.js, src/main.js, src/App.vue, index.html)
- [ ] T002 Install and configure Tailwind CSS 3 via @tailwindcss/vite plugin in vite.config.js and add Tailwind directives to src/style.css
- [ ] T003 [P] Configure Vite base path for GitHub Pages in vite.config.js (set base to repository name)
- [ ] T004 [P] Create project directory structure: src/components/, src/composables/, src/constants/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Constants and composables that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Define categories constant with values and Tailwind badge color mappings in src/constants/categories.js
- [ ] T006 Implement useLocalStorage composable with JSON get/set and reactive watch sync in src/composables/useLocalStorage.js
- [ ] T007 Implement useQuestions composable with reactive questions array, add/update/delete/filter methods using useLocalStorage in src/composables/useQuestions.js

**Checkpoint**: Foundation ready — all CRUD logic and persistence available for components

---

## Phase 3: User Story 1 — Add a New Interview Question (Priority: P1) 🎯 MVP + User Story 2 — View All Interview Questions (Priority: P1)

**Goal**: Users can add questions with text, category, and optional notes. All questions display in a card-based list sorted newest-first with category badges.

**Independent Test**: Open the app, add a question with text + category + optional notes, verify it appears as a card in the list with category badge and date.

### Implementation

- [ ] T008 [P] [US1] Create QuestionForm component with text input, category dropdown, optional notes textarea, validation, and save/cancel actions in src/components/QuestionForm.vue
- [ ] T009 [P] [US2] Create QuestionCard component displaying question text, category badge (colored per data-model), notes (if present), date added, and edit/delete action buttons in src/components/QuestionCard.vue
- [ ] T010 [P] [US2] Create EmptyState component with message and call-to-action when no questions exist in src/components/EmptyState.vue
- [ ] T011 [US2] Create QuestionList component that renders QuestionCard items sorted by createdAt descending, or EmptyState when empty, in src/components/QuestionList.vue
- [ ] T012 [US1] Wire App.vue to display header, inline QuestionForm (add mode) at top, and QuestionList below, connecting useQuestions composable in src/App.vue

**Checkpoint**: User Story 1 + 2 fully functional — users can add and view questions with persistence

---

## Phase 4: User Story 3 — Edit an Existing Question (Priority: P2)

**Goal**: Users can click edit on any question card, modify text/category/notes in a modal form, and save or cancel changes.

**Independent Test**: Add a question, click edit, change text and category, save, verify updated values appear on the card.

### Implementation

- [ ] T013 [US3] Add edit-mode support to QuestionForm component (accept existing question as prop, pre-fill fields, emit update event) in src/components/QuestionForm.vue
- [ ] T014 [US3] Create modal/overlay wrapper for edit form display in src/components/QuestionForm.vue or src/App.vue
- [ ] T015 [US3] Wire edit button in QuestionCard to open edit modal with selected question data, connect update handler to useQuestions.updateQuestion in src/App.vue

**Checkpoint**: User Story 3 complete — full add + view + edit workflow operational

---

## Phase 5: User Story 4 — Delete a Question (Priority: P2)

**Goal**: Users can delete a question with a confirmation dialog before permanent removal.

**Independent Test**: Add a question, click delete, confirm in dialog, verify question removed from list.

### Implementation

- [ ] T016 [P] [US4] Create ConfirmDialog component with message, confirm button, and cancel button in src/components/ConfirmDialog.vue
- [ ] T017 [US4] Wire delete button in QuestionCard to show ConfirmDialog, and connect confirm action to useQuestions.deleteQuestion in src/App.vue

**Checkpoint**: User Story 4 complete — full CRUD lifecycle operational

---

## Phase 6: User Story 6 — Data Persists Across Sessions (Priority: P2)

**Goal**: All question data (add, edit, delete) persists in localStorage and survives page refresh and browser restart.

**Independent Test**: Add questions, refresh the page, verify all questions still displayed with correct data. Edit/delete and refresh again.

### Implementation

- [ ] T018 [US6] Verify useLocalStorage composable correctly syncs all CRUD operations to localStorage key "interview-questions" — add error handling for localStorage full scenario in src/composables/useLocalStorage.js

**Checkpoint**: User Story 6 complete — data persistence verified for all operations

---

## Phase 7: User Story 5 — Filter Questions by Category (Priority: P3)

**Goal**: Users can filter the question list by category and clear filters to see all questions.

**Independent Test**: Add questions across multiple categories, select a category filter, verify only matching questions display. Select "All" to see everything again.

### Implementation

- [ ] T019 [P] [US5] Create CategoryFilter component with "All" option and one button/tab per category in src/components/CategoryFilter.vue
- [ ] T020 [US5] Wire CategoryFilter into App.vue above QuestionList, connect selected filter to useQuestions.filteredQuestions computed property in src/App.vue
- [ ] T021 [US5] Update EmptyState to show filter-specific message when no questions match active category filter in src/components/EmptyState.vue

**Checkpoint**: User Story 5 complete — category filtering with empty state feedback operational

---

## Phase 8: User Story 7 — Access the Application Online (Priority: P3)

**Goal**: Application is deployed to GitHub Pages via automated GitHub Actions workflow.

**Independent Test**: Navigate to the deployed URL, verify the application loads and all features work.

### Implementation

- [ ] T022 [US7] Create GitHub Actions workflow for automated build and deploy to GitHub Pages in .github/workflows/deploy.yml
- [ ] T023 [US7] Verify vite.config.js base path is correct for GitHub Pages deployment and add responsive meta viewport tag in index.html

**Checkpoint**: User Story 7 complete — app live and accessible via public URL

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Responsive design, edge cases, and final quality pass

- [ ] T024 [P] Add responsive Tailwind CSS classes to all components for mobile support (320px minimum) across src/components/
- [ ] T025 [P] Handle edge cases: long question text wrapping, plain text stripping on paste, localStorage full error display in src/components/QuestionForm.vue and src/composables/useLocalStorage.js
- [ ] T026 Run quickstart.md validation — verify npm install, npm run dev, npm run build all work correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories 1+2 (Phase 3)**: Depend on Foundational phase — P1 priority, implement together (shared components)
- **User Story 3 (Phase 4)**: Depends on Phase 3 (extends QuestionForm with edit mode)
- **User Story 4 (Phase 5)**: Depends on Phase 3 (extends QuestionCard with delete action)
- **User Story 6 (Phase 6)**: Depends on Phase 2 (verifies persistence composable works end-to-end)
- **User Story 5 (Phase 7)**: Depends on Phase 3 (filters the question list)
- **User Story 7 (Phase 8)**: Depends on Phase 1 (needs Vite config) — can run in parallel with story phases
- **Polish (Phase 9)**: Depends on all user story phases being complete

### User Story Dependencies

- **US1 + US2 (P1)**: Can start after Foundational — no dependencies on other stories
- **US3 (P2)**: Depends on US1 (extends QuestionForm) and US2 (extends QuestionCard)
- **US4 (P2)**: Depends on US2 (extends QuestionCard with delete button)
- **US6 (P2)**: Can start after Foundational — independent verification of persistence layer
- **US5 (P3)**: Depends on US2 (filters the QuestionList)
- **US7 (P3)**: Can start after Setup — independent deployment concern

### Parallel Opportunities

- T003 and T004 can run in parallel (Phase 1)
- T008, T009, T010 can run in parallel (Phase 3 — different component files)
- T016 can run in parallel with Phase 4 tasks (different file)
- T019 can run in parallel with other Phase 7 tasks (different file)
- T022 (deploy workflow) can start as early as Phase 1 completion
- T024 and T025 can run in parallel (Phase 9)

---

## Parallel Example: Phase 3 (User Story 1 + 2)

```
# Launch all independent components together:
Task T008: "Create QuestionForm in src/components/QuestionForm.vue"
Task T009: "Create QuestionCard in src/components/QuestionCard.vue"
Task T010: "Create EmptyState in src/components/EmptyState.vue"

# Then sequentially (depends on above):
Task T011: "Create QuestionList in src/components/QuestionList.vue"
Task T012: "Wire App.vue with QuestionForm + QuestionList"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup (scaffold + Tailwind)
2. Complete Phase 2: Foundational (categories, localStorage, useQuestions)
3. Complete Phase 3: User Stories 1 + 2 (add + view)
4. **STOP and VALIDATE**: Add questions, verify cards display with badges and dates
5. Deploy if ready (Phase 8 can run early)

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 + US2 → Add & view questions → **MVP!**
3. US3 → Edit questions → Deploy/Demo
4. US4 → Delete questions → Full CRUD → Deploy/Demo
5. US6 → Verify persistence → Confidence check
6. US5 → Category filtering → Enhanced UX → Deploy/Demo
7. US7 → GitHub Pages deployment → Public access
8. Polish → Responsive + edge cases → Final release
