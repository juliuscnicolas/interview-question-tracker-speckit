# Research: Multi-Category Selection for Questions

**Feature**: 003-multi-category-selection  
**Date**: 2026-03-22

## Research Task 1: Toggle Buttons/Pills Multi-Select Pattern in Vue 3 + Tailwind

### Decision
Use a reactive `ref([])` array for selected categories. Render each category as a `<button>` styled as a pill with Tailwind classes. Toggle category membership in the array on click. Apply distinct Tailwind classes for selected vs. unselected states using each category's existing `badgeClass`.

### Rationale
- The existing `CATEGORIES` constant already defines per-category badge colors (`badgeClass`) — these can be reused for the selected state.
- A button-based toggle is natively accessible (focusable, keyboard-operable) without needing custom ARIA roles.
- Vue 3's reactivity with arrays (push/filter) works seamlessly — no special handling needed.
- Tailwind's conditional class binding (`:class`) maps cleanly to selected/unselected visual states.

### Alternatives Considered
- **Checkbox group**: Accessible by default but takes more vertical space and feels less modern. Rejected for UX density.
- **Multi-select dropdown with tags**: More complex to implement, hides options behind a click, and adds component weight. Rejected for a 6-item fixed list.
- **Third-party component library (e.g., Headless UI Listbox)**: Adds a dependency for a simple 6-item toggle. Rejected — not justified for this scope.

---

## Research Task 2: localStorage Data Migration (String → Array)

### Decision
Implement a normalize-on-read strategy: when reading question data from localStorage, check if `category` is a string and convert it to `categories: [category]` in-memory. Write back the normalized form on next save. No explicit migration script needed.

### Rationale
- The `useLocalStorage` composable already deserializes JSON on read and serializes on write. Adding a normalization step in `useQuestions` (at read time) is minimal and self-contained.
- This avoids a one-time migration script that users must run, and handles the transition transparently.
- Questions are written back to localStorage whenever any mutation occurs, so old-format data is naturally upgraded over time.
- The `useQuestions` composable owns the data shape — normalization belongs here, not in the generic localStorage composable.

### Alternatives Considered
- **One-time migration on app init**: Run a migration function that rewrites all localStorage data on first load. Works but adds startup cost and a "has migrated" flag. Rejected — normalize-on-read is simpler.
- **Dual-field support (keep `category` and add `categories`)**: Maintain backward compatibility by checking both fields everywhere. Rejected — doubles complexity across all consumers.
- **Version number in localStorage**: Store a schema version, run migrations on version mismatch. Rejected — over-engineered for a single-field change.

---

## Research Task 3: Filter Logic with Array Categories

### Decision
Keep the existing single-select filter behavior (`activeFilter` is a single string or null). Change the filter predicate from `q.category === activeFilter.value` to `q.categories.includes(activeFilter.value)`. This is a one-line change in the `filteredQuestions` computed property.

### Rationale
- The spec explicitly states: "The existing category filter continues to work as a single-select filter." No multi-filter behavior is required.
- `Array.prototype.includes()` is the idiomatic JavaScript check for membership in an array.
- The `CategoryFilter` component already emits a single string value — no changes needed there.
- Performance is negligible: `.includes()` on an array of at most 6 items.

### Alternatives Considered
- **Multi-select filter (filter by multiple categories simultaneously)**: Spec explicitly excludes this. Rejected.
- **Set-based comparison**: Converting categories to a `Set` for O(1) lookup. Rejected — with max 6 elements, `.includes()` is effectively O(1) and avoids unnecessary allocation.

---

## Research Task 4: Form State Management for Multi-Select

### Decision
Replace `const category = ref('')` with `const categories = ref([])` in `QuestionForm.vue`. Toggle categories in/out of the array via a `toggleCategory(value)` function. Validation checks `categories.value.length > 0`. Emit `categories` array instead of single `category`.

### Rationale
- Consistent with Vue 3 reactivity patterns — arrays are fully reactive in Vue 3.
- The toggle function is simple: if the value exists, filter it out; otherwise, push it in.
- Validation changes from falsy check to length check — minimal diff.
- The watch that populates form state for editing needs to handle both old format (`question.category` string) and new format (`question.categories` array).

### Alternatives Considered
- **Separate boolean ref per category**: `const isFrontendSelected = ref(false)`, etc. Rejected — doesn't scale and couples the form to the category list.
- **v-model with native multi-select**: HTML's `<select multiple>` is not applicable since we're using toggle buttons.

---

## Research Task 5: QuestionCard Badge Rendering

### Decision
Replace the single `<span>` badge with a `v-for` loop over `question.categories`. Each badge uses the existing `getCategoryBadgeClass()` helper. Wrap badges in a `flex flex-wrap gap-1` container to handle overflow on narrow screens.

### Rationale
- The `getCategoryBadgeClass()` function already maps a single category value to its badge classes — it works per-item in a loop with no changes.
- `flex-wrap` with `gap-1` ensures badges flow to new lines on mobile without overflow.
- The existing card layout uses `flex items-start justify-between` for the header row — badges should move to their own row beneath the question text to avoid cramping the layout when multiple badges are present.

### Alternatives Considered
- **Comma-separated text list**: Simpler but loses the visual badge styling that users expect. Rejected.
- **Truncate with "+N more" indicator**: Adds complexity and hides information. Rejected — with max 6 small badges, truncation isn't needed.
