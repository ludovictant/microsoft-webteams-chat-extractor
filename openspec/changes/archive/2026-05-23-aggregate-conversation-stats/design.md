## Context

Currently, `background.js` manages conversation metadata (count, range) by updating fields in the `conversations` store during each `CHUNK_READY` event. This data is redundant because it is already present in the `messages` store. The side panel then reads these cached values to populate its history table.

## Goals / Non-Goals

**Goals:**
- Implement a compound index `[conversationId, timestamp]` for the `messages` store.
- Implement efficient aggregation functions (count, min, max) using IndexedDB cursors and keys.
- Remove redundant state management from the background script's extraction loop.
- Ensure the UI remains responsive by performing aggregate queries only when needed.

**Non-Goals:**
- Creating a separate view for individual messages (out of scope for this change).
- Full database migration or backup/restore functionality.

## Decisions

- **Decision: Increment IndexedDB version to 2**
  - **Rationale**: Adding a compound index requires an `onupgradeneeded` event.
  - **Alternatives**: Using a separate store for stats (would still have redundancy/sync issues).

- **Decision: Order-Optimized Cursor Querying**
  - **Rationale**: By using the compound index `[conversationId, timestamp]`, we can find the oldest message by opening a cursor with range `[id, 0]` to `[id, Infinity]` and taking the first result. The newest is found by using direction `prev`. This is $O(1)$ after initial index seeking.
  - **Count Method**: Use `IDBObjectStore.count()` or `IDBIndex.count()` with the conversation range. This is natively optimized in IndexedDB.

- **Decision: UI-side Aggregation**
  - **Rationale**: The side panel is the primary consumer of these stats. Calculating them when the history is refreshed keeps the background script lean and avoids unnecessary writes to the `conversations` store during extraction.

## Risks / Trade-offs

- **[Risk] Slower UI load time for many conversations** → Mitigation: Use parallel queries for each row and ensure the compound index is correctly utilized.
- **[Risk] Upgrade data loss** → Mitigation: Standard IndexedDB upgrade patterns will be used to preserve existing data while adding the new index.
- **[Risk] Redundant index overhead** → Mitigation: IndexedDB handles indices efficiently; the read performance gain for the dashboard outweighs the slight increase in write latency during extraction.
