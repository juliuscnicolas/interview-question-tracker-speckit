# Data Model: Multi-Category Selection for Questions

**Feature**: 003-multi-category-selection  
**Date**: 2026-03-22

## Entities

### Question

Represents a single interview question stored in the tracker.

| Field       | Type       | Required | Description                                              |
|-------------|------------|----------|----------------------------------------------------------|
| id          | string     | Yes      | Unique identifier (UUID v4)                              |
| text        | string     | Yes      | The interview question text (plain text, non-empty)      |
| categories  | string[]   | Yes      | One or more category values from the predefined set      |
| notes       | string     | No       | Optional answer/notes text (plain text)                  |
| createdAt   | string     | Yes      | ISO 8601 timestamp of when the question was created      |

**Validation Rules**:
- `text` must be a non-empty string after trimming and HTML stripping.
- `categories` must be an array with at least one element.
- Each element in `categories` must match a value from the `CATEGORIES` constant (`Frontend`, `Backend`, `Vue`, `React`, `.NET`, `Others`).
- `categories` may contain at most 6 elements (one per available category).
- No duplicate values in `categories`.

**State Transitions**: None — questions do not have lifecycle states.

**Migration from Previous Format**:
- Old format: `{ ..., category: "Frontend" }` (single string)
- New format: `{ ..., categories: ["Frontend"] }` (array of strings)
- Migration strategy: Normalize on read. If a question object has a `category` string field and no `categories` array, convert to `categories: [category]` and delete the `category` field.

### Category

A classification label drawn from a fixed set. Not stored as a separate entity — exists as a constant.

| Value     | Label     | Badge Style                        |
|-----------|-----------|------------------------------------|
| Frontend  | Frontend  | bg-blue-100 text-blue-800          |
| Backend   | Backend   | bg-green-100 text-green-800        |
| Vue       | Vue       | bg-emerald-100 text-emerald-800    |
| React     | React     | bg-cyan-100 text-cyan-800          |
| .NET      | .NET      | bg-purple-100 text-purple-800      |
| Others    | Others    | bg-gray-100 text-gray-800          |

**Relationships**:
- A Question has many Categories (1..6).
- A Category can be assigned to many Questions (0..N).
- This is a many-to-many relationship stored as an embedded array on the Question entity.

## Storage

**Mechanism**: Browser localStorage  
**Key**: `interview-questions`  
**Format**: JSON-serialized array of Question objects  
**Max Capacity**: Bounded by browser localStorage limit (~5–10 MB depending on browser)

### Example Data (New Format)

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "text": "What is the Vue 3 Composition API?",
    "categories": ["Vue", "Frontend"],
    "notes": "Explain ref, reactive, computed, watch...",
    "createdAt": "2026-03-22T10:30:00.000Z"
  },
  {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "text": "Explain dependency injection in .NET",
    "categories": ["Backend", ".NET"],
    "notes": "",
    "createdAt": "2026-03-22T09:15:00.000Z"
  }
]
```

### Example Data (Old Format — Pre-Migration)

```json
[
  {
    "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "text": "What is a closure in JavaScript?",
    "category": "Frontend",
    "notes": "",
    "createdAt": "2026-03-20T14:00:00.000Z"
  }
]
```

After normalization on read, this becomes:

```json
[
  {
    "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "text": "What is a closure in JavaScript?",
    "categories": ["Frontend"],
    "notes": "",
    "createdAt": "2026-03-20T14:00:00.000Z"
  }
]
```
