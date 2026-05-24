## Context

The history table in `sidepanel.js` currently uses a `formatDate` helper that likely only outputs `YYYY-MM-DD`. This change involves extending that helper or creating a new one to include the time.

## Goals / Non-Goals

**Goals:**
- Update the "Message Range" column in the history table to include hours and minutes (`hh:mm`).
- Ensure the formatting is consistent and professional.

**Non-Goals:**
- Changing the "Last Crawl" format (which already uses `formatDateTime`).
- Adding seconds to the display (unnecessary for this use case).

## Decisions

- **Decision: Refactor `formatDate` to `formatDateTimeShort`**
  - **Rationale**: The existing `formatDate` name implies just the date. Creating a new helper (or adding an optional parameter) allows for explicit control over the level of detail.
  - **Implementation**: The new format will be `YYYY-MM-DD HH:mm`.

## Risks / Trade-offs

- **[Risk] Column overflow** → Mitigation: The "Message Range" column already has a wide allocation (35%). The addition of 6 characters (` HH:mm`) is small enough to fit within typical sidebar widths without wrapping, as the font size for this column is already reduced (9px).
