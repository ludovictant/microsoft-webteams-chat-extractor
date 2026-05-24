## Context

The conversation history table in the side panel currently defaults to sorting by the most recent crawl date. While functional, it lacks the flexibility to quickly locate conversations by name or identify those with the highest message volume.

## Goals / Non-Goals

**Goals:**
- Enable sorting for three key columns: Conversation Name, Message Quantity, and Last Crawl.
- Provide clear visual indicators for the current sort state.
- Ensure the sorting is performant on the client side for typical history sizes (hundreds of rows).

**Non-Goals:**
- Server-side sorting (everything is local).
- Sorting by "Message Range" (complex range comparison is out of scope for now).
- Multi-column sorting (e.g., sort by name THEN by date).

## Decisions

### 1. State Management in `sidepanel.js`
- **Decision**: Introduce `currentSortColumn` and `currentSortDirection` variables.
- **Rationale**: Keeps the sorting logic decoupled from the data fetching logic. The `refreshHistoryList` function will be updated to apply these parameters to the data array before rendering.

### 2. Header Interaction
- **Decision**: Wrap header text in clickable `span` or `button` elements and add data attributes (e.g., `data-sort="name"`).
- **Rationale**: standard HTML practice for table sorting.

### 3. CSS-Based Indicators
- **Decision**: Use pseudo-elements (`::after`) or small inline SVGs to display sort arrows.
- **Rationale**: Lightweight and easy to toggle via class changes on the header cells.

### 4. Sorting Logic
- **Decision**: Use `Array.prototype.sort()` with custom comparator functions for strings, numbers, and dates.
- **Rationale**: Native, fast, and sufficient for the data volume.

## Risks / Trade-offs

- **[Risk] Layout shifting** → **Mitigation**: Reserve space for the sort arrows in the table header CSS to prevent the column widths from jumping when an arrow appears.
- **[Risk] Conflicting UI with "Action" column** → **Mitigation**: The "Action" column (download) will remain non-sortable to avoid confusion.
