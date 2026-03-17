# Data Model: Interview Question Tracker

**Date**: 2026-03-17  
**Feature Branch**: `001-interview-question-tracker`

## Entities

### Question

| Field       | Type     | Required | Description                                      |
|-------------|----------|----------|--------------------------------------------------|
| `id`        | `string` | Yes      | UUID v4 generated via `crypto.randomUUID()`      |
| `text`      | `string` | Yes      | The interview question text (plain text, trimmed) |
| `category`  | `string` | Yes      | One of the six predefined category values         |
| `notes`     | `string` | No       | Optional answer/notes text (plain text, trimmed)  |
| `createdAt` | `string` | Yes      | ISO 8601 timestamp of when the question was added |

**Validation Rules**:
- `text` must be non-empty after trimming whitespace
- `category` must be one of: `Frontend`, `Backend`, `Vue`, `React`, `.NET`, `Others`
- `notes` may be empty string or omitted
- `id` is auto-generated on creation, immutable
- `createdAt` is auto-set on creation, immutable
- HTML/rich text pasted into `text` or `notes` must be stripped to plain text

### Category (Enum)

| Value      | Display Label | Badge Color (Tailwind) |
|------------|---------------|------------------------|
| `Frontend` | Frontend      | `bg-blue-100 text-blue-800`     |
| `Backend`  | Backend       | `bg-green-100 text-green-800`   |
| `Vue`      | Vue           | `bg-emerald-100 text-emerald-800` |
| `React`    | React         | `bg-cyan-100 text-cyan-800`     |
| `.NET`     | .NET          | `bg-purple-100 text-purple-800` |
| `Others`   | Others        | `bg-gray-100 text-gray-800`     |

**Constraints**: Fixed set. Not user-configurable. A question belongs to exactly one category.

## Relationships

```text
Question *──1 Category
```

- Each Question has exactly one Category
- Categories are a fixed enum, not stored as separate entities
- No relationships between Questions

## State Transitions

Questions have no explicit state machine. The lifecycle is:

```text
Created → [Edited]* → Deleted
```

- **Created**: User fills form, passes validation → question added to list and localStorage
- **Edited**: User modifies text, category, or notes → question updated in list and localStorage (0 or more times)
- **Deleted**: User confirms deletion → question removed from list and localStorage (terminal)

## Storage Schema

Questions are stored in localStorage under a single key:

```json
{
  "key": "interview-questions",
  "value": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "text": "What is the virtual DOM?",
      "category": "Vue",
      "notes": "A lightweight JS representation of the real DOM...",
      "createdAt": "2026-03-17T10:30:00.000Z"
    }
  ]
}
```

- Serialized as JSON string via `JSON.stringify()`
- Deserialized via `JSON.parse()` on app load
- Full array replaced on every write (no partial updates)
- Default value on first load (key missing): empty array `[]`
