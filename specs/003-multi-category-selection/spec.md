# Feature Specification: Multi-Category Selection for Questions

**Feature Branch**: `003-multi-category-selection`  
**Created**: 2026-03-22  
**Status**: Draft  
**Input**: User description: "add a feature, can select multiple category for a question"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Assign Multiple Categories When Adding a Question (Priority: P1)

A user is adding a new interview question that spans multiple topics (e.g., a question about Vue component lifecycle that also covers Frontend fundamentals). Instead of being forced to pick a single category, the user selects multiple relevant categories from the predefined list. The question is saved with all selected categories and appears in the list with multiple category badges.

**Why this priority**: This is the core of the feature — without multi-category selection during question creation, the feature delivers no value.

**Independent Test**: Can be fully tested by opening the add question form, selecting two or more categories, saving, and verifying all selected categories appear as badges on the question card.

**Acceptance Scenarios**:

1. **Given** the user opens the add question form, **When** they view the category selector, **Then** it allows selecting multiple categories from the predefined list (Frontend, Backend, Vue, React, .NET, Others).
2. **Given** the user is filling out the add question form, **When** they select "Vue" and "Frontend" as categories and save, **Then** the question is saved with both categories and displays both category badges in the list.
3. **Given** the user is filling out the add question form, **When** they attempt to save without selecting any category, **Then** a validation message indicates at least one category must be selected.
4. **Given** the user has selected multiple categories, **When** they deselect one of them before saving, **Then** only the remaining selected categories are saved with the question.

---

### User Story 2 - Edit Categories on an Existing Question (Priority: P1)

A user wants to update the categories assigned to an existing question — adding a new category, removing one, or changing the selection entirely. They open the edit form, modify the category selections, and save. The updated categories are reflected immediately.

**Why this priority**: Editing is essential to correct or refine category assignments, and must work correctly with the new multi-select behavior.

**Independent Test**: Can be tested by editing a question's categories (adding, removing, or changing), saving, and verifying the updated badges appear on the question card.

**Acceptance Scenarios**:

1. **Given** a question has categories "Frontend" and "Vue," **When** the user opens the edit form, **Then** both "Frontend" and "Vue" are pre-selected in the category selector.
2. **Given** the edit form is open with "Frontend" and "Vue" selected, **When** the user additionally selects "React" and saves, **Then** the question now displays badges for "Frontend," "Vue," and "React."
3. **Given** the edit form is open with multiple categories selected, **When** the user deselects all categories and attempts to save, **Then** a validation message indicates at least one category must be selected.
4. **Given** the edit form is open, **When** the user removes "Frontend" and saves, **Then** the question no longer displays the "Frontend" badge.

---

### User Story 3 - Filter Questions by Category with Multi-Category Data (Priority: P2)

A user wants to filter their question list by a specific category. When a category filter is applied, all questions that include that category in their assigned categories are shown — even if the question also belongs to other categories.

**Why this priority**: Filtering must work correctly with multi-category questions to maintain usability; however, the filtering mechanism itself already exists and simply needs to be compatible.

**Independent Test**: Can be tested by adding questions with multiple categories, applying a single-category filter, and verifying that all questions containing that category appear (regardless of other assigned categories).

**Acceptance Scenarios**:

1. **Given** a question is categorized as "Vue" and "Frontend," **When** the user filters by "Vue," **Then** the question appears in the filtered list.
2. **Given** a question is categorized as "Vue" and "Frontend," **When** the user filters by "Frontend," **Then** the question also appears in the filtered list.
3. **Given** a question is categorized as "Backend" only, **When** the user filters by "Vue," **Then** the question does not appear in the filtered list.
4. **Given** a category filter is active, **When** the user clears the filter, **Then** all questions are displayed regardless of their categories.

---

### User Story 4 - Backward Compatibility with Existing Single-Category Questions (Priority: P2)

A user who has existing questions saved with a single category opens the application after the update. Their existing questions continue to display correctly, each showing their original single category badge. No data loss or display issues occur.

**Why this priority**: Existing users must not lose data or experience broken behavior when the data model changes from single to multi-category.

**Independent Test**: Can be tested by loading the application with pre-existing single-category question data in local storage and verifying all questions display correctly with their original category badge.

**Acceptance Scenarios**:

1. **Given** old questions exist in local storage with a single category value, **When** the user opens the application, **Then** those questions display correctly with the original category shown as a badge.
2. **Given** an old question has a single category, **When** the user edits it, **Then** the category selector shows the original category pre-selected and the user can add more categories.
3. **Given** an old question has a single category, **When** the user saves it without changes via the edit form, **Then** the question data is preserved without corruption.

---

### Edge Cases

- What happens when a user selects all six categories for a single question? The system should accept it and display all six category badges on the question card.
- What happens when a user rapidly toggles categories on and off in the selector? The final saved state should reflect exactly which categories are selected at the moment of save.
- What happens when existing local storage data has the old single-category format (a string) and the new format expects multiple categories (a list)? The system should gracefully handle migration, treating the single value as a list of one.
- What happens when a question with multiple categories is displayed on a narrow mobile screen? Category badges should wrap to a new line rather than overflow or be truncated.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to select one or more categories from the predefined list (Frontend, Backend, Vue, React, .NET, Others) when creating a question.
- **FR-002**: System MUST allow users to select one or more categories from the predefined list when editing a question.
- **FR-003**: System MUST validate that at least one category is selected before saving a new or edited question.
- **FR-004**: System MUST display all assigned categories as individual badges on each question card.
- **FR-005**: System MUST persist multi-category selections in local storage so data survives page refreshes and browser restarts.
- **FR-006**: System MUST support filtering by a single category, showing all questions that include the selected category among their assigned categories.
- **FR-007**: System MUST gracefully handle existing question data that uses the old single-category format, treating it as a list containing one category without data loss.
- **FR-008**: System MUST allow users to deselect categories in the selector, as long as at least one remains selected at save time.
- **FR-009**: System MUST visually indicate which categories are currently selected in the multi-select category control.
- **FR-010**: System MUST wrap category badges on question cards when there is insufficient horizontal space, rather than overflowing or truncating.

### Key Entities

- **Question**: Represents a single interview question. Attributes include: unique identifier, question text, one or more categories, optional notes/answer text, and date added. A question must have at least one category but may have up to all six.
- **Category**: A classification label for a question. Fixed set of values: Frontend, Backend, Vue, React, .NET, Others. A question may belong to multiple categories simultaneously.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can select multiple categories for a question in under 10 seconds.
- **SC-002**: All assigned category badges are visible on each question card without any being hidden or cut off.
- **SC-003**: Filtering by any single category returns all questions that include that category, with 100% accuracy.
- **SC-004**: Existing single-category questions display and function correctly after the update with zero data loss.
- **SC-005**: Users can complete the add-question flow (text + multiple categories) in under 30 seconds.
- **SC-006**: The multi-category selector is usable on mobile devices with screen widths as narrow as 320px.

## Assumptions

- The predefined category list (Frontend, Backend, Vue, React, .NET, Others) remains unchanged; no new categories are being added as part of this feature.
- The existing category filter (single-category filter) continues to work as a single-select filter; multi-category filtering (e.g., "show questions that are both Vue AND Frontend") is not required at this stage.
- Backward compatibility with existing local storage data is handled by treating a single category string as a list of one — no manual data migration is required from users.
- The multi-category selector replaces the current single-select dropdown; both the add and edit forms are updated.
- No maximum limit on the number of categories per question beyond the natural limit of six (the total number of available categories).
