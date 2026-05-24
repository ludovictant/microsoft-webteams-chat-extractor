## Why

Currently, the conversation name is only updated in IndexedDB when a `CHUNK_READY` event occurs (i.e., when at least 10 messages are collected). If an incremental extraction ("Download recent messages") is triggered and finds zero new messages, the extraction stops immediately and the conversation name remains uninitialized or "Unknown Chat" in the database. Ensuring the name is updated at the very start of the extraction guarantees data integrity and a polished dashboard.

## What Changes

- **Early Upsert**: Move the `db.upsertConversation` call to the `START_EXTRACTION` message handler in `background.js`.
- **Immediate Sync**: This ensures that as soon as the user clicks a download button, the latest detected chat title is saved to the database, even if the crawl duration is zero.

## Capabilities

### Modified Capabilities
- `local-storage-management`: Update the `Real-time Message Persistence` requirement to specify that conversation metadata (including the name) SHALL be initialized or updated at the start of any extraction session.

## Impact

- `background.js`: Refactor `START_EXTRACTION` handler to perform an immediate database upsert.
