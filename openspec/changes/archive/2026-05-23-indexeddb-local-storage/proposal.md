## Why

Currently, the extension operates in a transient, session-based manner. All extracted messages are stored in memory and lost once the browser is closed or the extraction state is reset. By implementing IndexedDB local storage, users can build a persistent history of their Microsoft Teams conversations, enabling future capabilities like incremental crawling, historical search, and local offline viewing.

## What Changes

- **Persistent Storage UI**: A new "Local storage" toggle switch in the side panel options.
- **Relational Data Model**: Implementation of an IndexedDB database (`TeamsExtractorDB`) with tables for `conversations`, `messages`, and `assets`.
- **Unique Conversation Tracking**: Logic to extract the stable `teamsId` from the Teams DOM or URL to ensure session continuity.
- **Real-time Persistence**: "Write-as-you-crawl" logic that saves message chunks and assets to the local database as they are processed, ensuring data safety during long extractions.
- **Enhanced Metadata**: Classification of messages as "true" (user) or "meta" (system), and tracking of crawl history (last crawl date, message counts).

## Capabilities

### New Capabilities
- `local-storage-management`: Core IndexedDB orchestration, schema management, and data access patterns.
- `conversation-identity-extraction`: Robust logic to identify unique Teams conversation threads for indexing.
- `message-classification`: Logic to differentiate between user messages and system/meta messages during serialization.

### Modified Capabilities
- `ui-simplification`: Updated to include the new "Local storage" toggle in the options panel.
- `extraction-lifecycle-management`: Integrated with the persistence layer to ensure data is saved during the active crawl.

## Impact

- **`manifest.json`**: No new permissions required (IndexedDB is standard).
- **`sidepanel.html/js`**: New toggle switch and associated state persistence.
- **`background.js`**: Primary driver for IndexedDB operations and coordination of data flow from payload to DB.
- **`payload.js`**: Enhanced serialization to include message types and the unique `teamsId`.
