## Context

The current `upsertConversation` logic, which updates the conversation name in IndexedDB, is only triggered within the `CHUNK_READY` event handler. This means a conversation's name is only updated if at least one message batch is processed. In incremental mode, it's possible to process zero new messages, leaving the name unupdated.

## Goals / Non-Goals

**Goals:**
- Guarantee that the conversation name is updated in IndexedDB at the start of every extraction.
- Ensure the update happens regardless of the number of messages crawled.

**Non-Goals:**
- Changing the `upsertConversation` method signature (it already handles merges correctly).
- Adding complex retry logic for DOM title extraction (we will use the title captured at the moment of the click).

## Decisions

- **Decision: Start-Time Upsert**
  - **Rationale**: The `START_EXTRACTION` message contains both the `teamsId` and the `title`. This is the earliest and most reliable time to ensure the database record is synchronized with the UI.
  - **Implementation**: In `background.js`, invoke `db.upsertConversation` immediately after initializing the `extractionData` object in the `START_EXTRACTION` case.

## Risks / Trade-offs

- **[Risk] Redundant database writes** → Mitigation: IndexedDB handles upserts efficiently. The benefit of consistent naming in the dashboard outweighs the negligible cost of one extra write per extraction session.
