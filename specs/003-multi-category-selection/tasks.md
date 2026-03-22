# Tasks: Multi-Category Selection for Questions

**Input**: Design documents from `/specs/003-multi-category-selection/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not requested in the feature specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No project setup needed — this feature modifies an existing codebase. Phase 1 is empty.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Data model migration and composable changes that MUST be complete before ANY user story UI work can begin.

**⚠️ CRITICAL**: The `useQuestions` composable owns the data shape. All user stories depend on `categories` being an array.

- [X] T001 Add `normalizeQuestion` function to `src/composables/useQuestions.js` that converts old `category` string field to `categories` array (if `category` is a string and `categories` is absent, set `categories: [category]` and delete `category`)
- [X] T002 Apply `normalizeQuestion` to all questions on read from localStorage in `src/composables/useQuestions.js` by mapping over the raw `questions.value` array after initialization
- [X] T003 Update `addQuestion` in `src/composables/useQuestions.js` to accept `categories` array parameter instead of single `category` string, validate that `categories` is a non-empty array and every value exists in `CATEGORIES`, and store `categories` on the question object
- [X] T004 Update `updateQuestion` in `src/composables/useQuestions.js` to accept `categories` array parameter instead of single `category` string, validate the array, and store `categories` on the question object
- [X] T005 Update `filteredQuestions` computed property in `src/composables/useQuestions.js` to change filter predicate from `q.category === activeFilter.value` to `q.categories.includes(activeFilter.value)`

**Checkpoint**: Composable now uses `categories` array throughout. All CRUD operations and filtering work with the new data model. Old localStorage data is normalized on read.

---

## Phase 3: User Story 1 - Assign Multiple Categories When Adding a Question (Priority: P1) 🎯 MVP

**Goal**: Replace the single-select category dropdown with toggle button pills in the add form. Users can select multiple categories.

**Independent Test**: Open add form → select two or more categories → save → verify all selected categories appear as badges on the question card.

### Implementation for User Story 1

- [X] T006 [US1] Replace `const category = ref('')` with `const categories = ref([])` in `src/components/QuestionForm.vue` and add a `toggleCategory(value)` function that adds/removes values from the array
- [X] T007 [US1] Update `validate()` in `src/components/QuestionForm.vue` to check `categories.value.length > 0` instead of `!category.value`, with error message "At least one category must be selected."
- [X] T008 [US1] Update `handleSubmit()` in `src/components/QuestionForm.vue` to emit `categories: [...categories.value]` instead of `category: category.value`, and reset `categories.value = []` after add
- [X] T009 [US1] Update `handleCancel()` in `src/components/QuestionForm.vue` to reset `categories.value = []` instead of `category.value = ''`
- [X] T010 [US1] Replace the `<select>` dropdown in `src/components/QuestionForm.vue` template with a `flex flex-wrap gap-2` container of `<button>` elements for each category from `CATEGORIES`, applying selected styling (category `badgeClass`) when `categories.includes(cat.value)` and unselected styling (`bg-gray-100 text-gray-500`) otherwise, with `@click.prevent="toggleCategory(cat.value)"` on each button
- [X] T011 [P] [US1] Update `src/components/QuestionCard.vue` to replace the single category `<span>` badge with a `v-for` loop over `question.categories`, rendering each as an individual badge with `getCategoryBadgeClass(cat)`, wrapped in a `flex flex-wrap gap-1` container
- [X] T012 [US1] Update `src/App.vue` empty filter message from `` `No questions in the '${activeFilter}' category.` `` to `` `No questions in the "${activeFilter}" category.` `` (minor — ensures consistency; no functional change needed since filter is still single-select)

**Checkpoint**: Users can add questions with multiple categories. Question cards show multiple badges. This is the MVP.

---

## Phase 4: User Story 2 - Edit Categories on an Existing Question (Priority: P1)

**Goal**: When editing a question, the toggle pills pre-select the question's current categories. Users can modify the selection and save.

**Independent Test**: Edit a question with two categories → add a third → save → verify three badges appear. Edit again → remove one → save → verify two badges appear.

### Implementation for User Story 2

- [X] T013 [US2] Update the `watch(() => props.question, ...)` in `src/components/QuestionForm.vue` to populate `categories.value` from the question — handle both `question.categories` (array) and legacy `question.category` (string) by normalizing to an array

**Checkpoint**: Edit form pre-populates category toggles. Editing categories works for both new-format and old-format questions.

---

## Phase 5: User Story 3 - Filter Questions by Category with Multi-Category Data (Priority: P2)

**Goal**: Filtering by a single category shows all questions that include that category in their `categories` array.

**Independent Test**: Add a question with categories ["Vue", "Frontend"] → filter by "Vue" → question appears → filter by "Frontend" → question still appears → filter by "Backend" → question is hidden.

### Implementation for User Story 3

- [X] T014 [US3] Verify that the filter predicate change in T005 (`q.categories.includes(activeFilter.value)`) correctly surfaces multi-category questions when any one of their categories matches the active filter — no additional code changes expected; this task is a validation step

**Checkpoint**: Filtering works correctly with multi-category data. No UI changes needed in `CategoryFilter.vue`.

---

## Phase 6: User Story 4 - Backward Compatibility with Existing Single-Category Questions (Priority: P2)

**Goal**: Existing questions stored in localStorage with old `category` string format display and function correctly without data loss.

**Independent Test**: Manually set localStorage with old-format data → load app → verify questions display with correct badge → edit one → verify categories pre-populate → save without changes → verify no data corruption.

### Implementation for User Story 4

- [X] T015 [US4] Verify that the `normalizeQuestion` function from T001-T002 correctly handles all edge cases: missing `categories` field with `category` string present, already-migrated data with `categories` array, and questions with both fields (prefer `categories` array) — no additional code changes expected; this task is a validation step

**Checkpoint**: Old data loads, displays, and saves correctly. No manual migration required.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [X] T016 Run `npm test` to verify all existing tests still pass after changes in `src/composables/useQuestions.js`, `src/components/QuestionForm.vue`, `src/components/QuestionCard.vue`, and `src/App.vue`
- [X] T017 Run `npm run build` to verify production build succeeds with no errors
- [X] T018 Run quickstart.md validation: start dev server with `npm run dev`, manually add a question with multiple categories, edit it, filter by category, and verify badges display correctly on mobile viewport (320px width)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Empty — no setup needed
- **Foundational (Phase 2)**: No phase dependencies — can start immediately. BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion
- **User Story 2 (Phase 4)**: Depends on Phase 3 (shares QuestionForm.vue state from US1)
- **User Story 3 (Phase 5)**: Depends on Phase 2 only (filter logic is in composable)
- **User Story 4 (Phase 6)**: Depends on Phase 2 only (migration logic is in composable)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational (Phase 2). MVP.
- **User Story 2 (P1)**: Depends on User Story 1 (Phase 3) — the form state (`categories ref`, `toggleCategory`) must exist before the edit watch can populate it.
- **User Story 3 (P2)**: Depends on Foundational (Phase 2) only — filter predicate change is already done in T005.
- **User Story 4 (P2)**: Depends on Foundational (Phase 2) only — migration logic is already done in T001-T002.

### Within Each User Story

- T006 → T007 → T008 → T009 → T010: Sequential — each builds on the form state changes
- T011: Parallel with T006-T010 (different file: QuestionCard.vue)
- T013: Sequential after T010 (same file, depends on `categories` ref existing)

### Parallel Opportunities

- T011 (QuestionCard.vue) can run in parallel with T006-T010 (QuestionForm.vue) — different files
- US3 (Phase 5) and US4 (Phase 6) can run in parallel with each other after Phase 2
- T016, T017, T018 are sequential (test → build → manual validation)

---

## Parallel Example: User Story 1

```text
# After Phase 2 (Foundational) is complete:

# Parallel batch 1 — different files:
Task T006-T010: QuestionForm.vue toggle pills (sequential within file)
Task T011:      QuestionCard.vue multi-badge rendering (parallel — different file)

# Sequential:
Task T012: App.vue empty message update (after form and card are done)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (T001-T005) — migrate data model
2. Complete Phase 3: User Story 1 (T006-T012) — add multi-category form + card display
3. **STOP and VALIDATE**: Add a question with multiple categories, verify badges appear
4. Deploy/demo if ready — this is a working MVP

### Incremental Delivery

1. Complete Foundational → Data model ready
2. Add User Story 1 → Multi-category add + display (MVP!)
3. Add User Story 2 → Multi-category edit works
4. Add User Story 3 → Filtering verified with multi-category data
5. Add User Story 4 → Backward compatibility verified
6. Complete Polish → Tests pass, build succeeds, manual validation done
7. Each story adds confidence without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Tests are NOT included — not requested in feature specification
- Commit after each task or logical group
- T014 and T015 are validation-only tasks (the actual code changes happen in Phase 2)
- Stop at any checkpoint to validate story independently
