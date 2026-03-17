# Feature Specification: Interview Question Tracker

**Feature Branch**: `001-interview-question-tracker`  
**Created**: 2026-03-17  
**Status**: Draft  
**Input**: User description: "Build a Vue 3 interview question tracker with CRUD operations, categories (Frontend, Backend, Vue, React, .NET, Others), stored in client state, and deploy it to GitHub Pages."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add a New Interview Question (Priority: P1)

A user preparing for interviews wants to add a new question to their tracker. They open the application, click an "Add Question" button, fill in the question text, select a category from the predefined list (Frontend, Backend, Vue, React, .NET, Others), and save it. The question immediately appears in their question list.

**Why this priority**: Adding questions is the core action—without it, the tracker has no content and provides no value.

**Independent Test**: Can be fully tested by opening the app, adding a question with a category, and verifying it appears in the list. Delivers the fundamental ability to capture interview questions.

**Acceptance Scenarios**:

1. **Given** the user is on the main page, **When** they click "Add Question," **Then** a form appears with fields for the question text and a category selector.
2. **Given** the add-question form is open, **When** the user enters question text, selects "Frontend" as the category, and clicks "Save," **Then** the question is added to the list and the form clears.
3. **Given** the add-question form is open, **When** the user attempts to save without entering question text, **Then** a validation message appears indicating the question text is required.
4. **Given** the add-question form is open, **When** the user attempts to save without selecting a category, **Then** a validation message appears indicating a category must be selected.

---

### User Story 2 - View All Interview Questions (Priority: P1)

A user wants to see all the interview questions they have saved. They open the application and see a list of all their questions, each displaying the question text, assigned category, and date added. The list is organized so questions are easy to scan.

**Why this priority**: Viewing questions is equally essential—users need to review what they've tracked to prepare effectively.

**Independent Test**: Can be tested by pre-populating questions and verifying all display correctly with their category labels and timestamps.

**Acceptance Scenarios**:

1. **Given** the user has previously added questions, **When** they open the application, **Then** all saved questions are displayed in a list showing question text, category, and date added.
2. **Given** no questions have been added, **When** the user opens the application, **Then** an empty state message is displayed encouraging the user to add their first question.
3. **Given** the user has questions across multiple categories, **When** they view the list, **Then** each question shows a visual indicator (label or badge) of its category.

---

### User Story 3 - Edit an Existing Question (Priority: P2)

A user realizes a question they previously added has a typo or should be in a different category. They find the question in the list, click an edit action, modify the question text or change the category, and save the update. The changes are reflected immediately.

**Why this priority**: Editing is the natural follow-up to adding—users frequently need to refine their entries after initial capture.

**Independent Test**: Can be tested by adding a question, editing its text and category, and verifying the updated values appear in the list.

**Acceptance Scenarios**:

1. **Given** a question exists in the list, **When** the user clicks the edit action for that question, **Then** a form pre-filled with the current question text and category appears.
2. **Given** the edit form is open, **When** the user changes the question text and clicks "Save," **Then** the updated text is reflected in the list.
3. **Given** the edit form is open, **When** the user changes the category and clicks "Save," **Then** the updated category is reflected in the list.
4. **Given** the edit form is open, **When** the user clicks "Cancel," **Then** no changes are saved and the form closes.

---

### User Story 4 - Delete a Question (Priority: P2)

A user decides a question is no longer relevant and wants to remove it. They find the question and click a delete action. After confirming the deletion, the question is permanently removed from the list.

**Why this priority**: Deletion completes the CRUD lifecycle and keeps the tracker clean, but is less frequently used than add/edit.

**Independent Test**: Can be tested by adding a question, deleting it, and verifying it no longer appears in the list.

**Acceptance Scenarios**:

1. **Given** a question exists in the list, **When** the user clicks the delete action, **Then** a confirmation prompt appears asking if they are sure.
2. **Given** the confirmation prompt is shown, **When** the user confirms deletion, **Then** the question is removed from the list and no longer appears.
3. **Given** the confirmation prompt is shown, **When** the user cancels, **Then** the question remains in the list unchanged.

---

### User Story 5 - Filter Questions by Category (Priority: P3)

A user preparing for a specific type of interview (e.g., Frontend) wants to see only questions in that category. They select a category filter and the list updates to show only matching questions. They can clear the filter to see all questions again.

**Why this priority**: Filtering enhances usability when the question list grows large, but the tracker is usable without it.

**Independent Test**: Can be tested by adding questions across multiple categories, applying a filter, and verifying only matching questions appear.

**Acceptance Scenarios**:

1. **Given** questions exist across multiple categories, **When** the user selects "Vue" from the category filter, **Then** only questions categorized as "Vue" are displayed.
2. **Given** a category filter is active, **When** the user clears the filter (selects "All"), **Then** all questions are displayed again.
3. **Given** a category filter is active for a category with no questions, **When** the user views the list, **Then** an empty state message indicates no questions exist in that category.

---

### User Story 6 - Data Persists Across Sessions (Priority: P2)

A user adds several questions, closes the browser, and returns later. All their previously added questions are still present. The data survives page refreshes and browser restarts.

**Why this priority**: Without persistence, all data is lost on refresh, making the tracker unreliable. This is critical for real-world usefulness.

**Independent Test**: Can be tested by adding questions, refreshing the page, and verifying all questions are still present with correct data.

**Acceptance Scenarios**:

1. **Given** the user has added questions, **When** they refresh the browser page, **Then** all previously added questions are still displayed.
2. **Given** the user has added questions, **When** they close and reopen the browser, **Then** all previously added questions are still displayed.
3. **Given** the user edits or deletes a question, **When** they refresh the page, **Then** the changes are preserved.

---

### User Story 7 - Access the Application Online (Priority: P3)

A user wants to access their interview question tracker from any device via a public URL. The application is hosted and accessible through a web browser without any installation or setup.

**Why this priority**: Deployment makes the application shareable and accessible, but is a distribution concern rather than core functionality.

**Independent Test**: Can be tested by navigating to the deployed URL and verifying the application loads and functions correctly.

**Acceptance Scenarios**:

1. **Given** the application is deployed, **When** a user navigates to the public URL, **Then** the application loads and is fully functional.
2. **Given** the application is deployed, **When** a user accesses it on a mobile device, **Then** the application is usable (responsive layout).

---

### Edge Cases

- What happens when the user adds a very long question text (500+ characters)? The application should accept it and display it with appropriate text wrapping or truncation.
- What happens when the browser's local storage is full? The application should display a user-friendly error indicating that storage is full and the question cannot be saved.
- What happens when the user clears their browser data? All questions are lost; the application shows the empty state. This is expected behavior for client-side storage.
- What happens when two browser tabs are open simultaneously? Changes in one tab may not reflect in the other until refresh. This is acceptable for a single-user client-side application.
- What happens when the user pastes formatted text (HTML/rich text) into the question field? The application should strip formatting and store plain text only.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create a new interview question with a text field and a category selection.
- **FR-002**: System MUST provide exactly six predefined categories: Frontend, Backend, Vue, React, .NET, and Others.
- **FR-003**: System MUST display all saved questions in a list showing question text, category, and date added.
- **FR-004**: System MUST allow users to edit the text and category of any existing question.
- **FR-005**: System MUST allow users to delete any existing question after a confirmation prompt.
- **FR-006**: System MUST persist all question data in the browser's local storage so data survives page refreshes and browser restarts.
- **FR-007**: System MUST validate that question text is not empty before saving.
- **FR-008**: System MUST validate that a category is selected before saving.
- **FR-009**: System MUST allow users to filter the question list by category.
- **FR-010**: System MUST allow users to clear filters and view all questions.
- **FR-011**: System MUST display an empty state message when no questions exist or no questions match the active filter.
- **FR-012**: System MUST be deployed and accessible via a public URL hosted on GitHub Pages.
- **FR-013**: System MUST be responsive and usable on both desktop and mobile screen sizes.
- **FR-014**: System MUST assign a unique identifier to each question to support edit and delete operations.
- **FR-015**: System MUST record the date each question was added and display it in the question list.

### Key Entities

- **Question**: Represents a single interview question. Attributes include: unique identifier, question text, category, and date added.
- **Category**: A classification label for a question. Fixed set of values: Frontend, Backend, Vue, React, .NET, Others. A question belongs to exactly one category.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add a new question (text + category) in under 30 seconds.
- **SC-002**: Users can find and edit any question in under 15 seconds.
- **SC-003**: Users can delete a question (including confirmation) in under 10 seconds.
- **SC-004**: All saved questions persist across page refreshes with 100% data integrity.
- **SC-005**: Filtering by any category returns accurate results instantly (under 1 second perceived delay).
- **SC-006**: The application loads and is interactive within 3 seconds on a standard connection.
- **SC-007**: The application is accessible via a public URL and functions correctly in modern browsers (Chrome, Firefox, Edge, Safari).
- **SC-008**: The application is usable on mobile devices with screen widths as narrow as 320px.

## Assumptions

- The application is single-user; no authentication or multi-user synchronization is required.
- Browser local storage is the persistence mechanism; no server-side database is needed.
- The six categories (Frontend, Backend, Vue, React, .NET, Others) are fixed and do not need to be user-configurable.
- The application targets modern evergreen browsers; legacy browser support (IE11) is not required.
- GitHub Pages is the deployment target, meaning the app must be a static site with no server-side rendering requirements.
- No search functionality beyond category filtering is required at this stage.
