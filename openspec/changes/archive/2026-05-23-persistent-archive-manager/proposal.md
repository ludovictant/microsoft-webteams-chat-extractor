## Why

Currently, the extension is a one-shot extraction tool. Users must re-extract entire chat histories to get the latest messages, and they cannot manage multiple conversations in a single place. Transitioning to a persistent local manager allows for incremental updates, local search, and long-term archiving of critical Teams conversations without redundant data fetching.

## What Changes

- **Persistent Storage**: Implement **IndexedDB** to store conversations, messages, and assets locally.
- **UI Overhaul**: **DELETE the current popup interface.** Replace it with a persistent **Side Panel** (`dashboard.html`) using the Chrome Side Panel API. This allows the manager to sit alongside the active Teams tab, ensuring reliable synchronization.
- **Conversation Onboarding**: A button to open a modal where users paste a Teams URL to begin tracking a conversation.
- **Incremental Extraction**: Update the crawler to stop when it encounters already-archived messages, fetching only new or updated content.
- **Data Management**: Add the ability to select and delete specific conversations or all stored data using a "Select All" checkbox system, including automated asset garbage collection.
- **Manual Multi-Export**: **REMOVE automatic ZIP generation.** The system will only export data when the user clicks the "Export" button on the dashboard. If multiple conversations are selected, the system will generate and download a separate ZIP file for each conversation using the established naming policy.
- **Enhanced Metadata**: Track message types (standard vs. meta/system) and reactions persistently.
- **Extraction Control & Concurrency**:
    - **Panel Lock**: While an extraction is active, the Side Panel UI is disabled (locked) except for a "Stop Current Extraction" button.
    - **Partial Stop Logic**: If "Stop" is clicked:
        - All messages already saved to IndexedDB are retained.
        - Stats (message count, oldest/newest date) are recalculated based on the new data.
        - **IMPORTANT**: The "Last Extraction Date" is **NOT** updated (it only updates on full completion).

## Capabilities

### New Capabilities
- `local-database-management`: An IndexedDB-based storage system with a schema supporting `Conversations`, `Messages`, and `Assets`.
- `incremental-extraction-logic`: Logic to perform "UPSERT" operations on messages and terminate crawling when historical parity is reached.
- `side-panel-interface`: A persistent sidebar UI replacing the popup/tab, allowing for side-by-side operation with Teams.
- `extraction-governance`: Logic to lock the Side Panel during active runs and handle "Partial Stop" states gracefully.
- `conversation-onboarding`: A modal-based system to add conversations via manual URL entry.
- `cascading-deletion`: Securely delete conversation data across multiple tables with garbage collection for orphaned images.

### Modified Capabilities
- `automated-download`: Update to allow exporting directly from the local database instead of only active sessions.

## Impact

- **Storage**: Requires the `unlimitedStorage` permission in `manifest.json`.
- **Architecture**: Move from RAM-based extraction data to transactional database operations in `background.js`.
- **Crawler**: `payload.js` must be able to receive "last known message" context to optimize scroll depth.
- **UI**: Significant shift from a small popup to a tab-based dashboard for management.

## Technical Appendix: Database Schema

### Table: Conversations
- `id` (String, PK): Teams chat/channel ID
- `name` (String): Conversation title
- `url` (String): Teams web URL
- `lastCrawled` (Timestamp)
- `oldestMessageDate` (Timestamp)
- `newestMessageDate` (Timestamp)

### Table: Messages
- `id` (String, PK): Message ID
- `conversationId` (String, Index): FK to Conversations
- `timestamp` (Number, Index): Unix TS
- `type` (String): 'message' | 'meta'
- `author` (String)
- `content` (String/HTML)
- `reactions` (Array): `[{emoji, count}]`
- `assetUrls` (Array): List of associated image URLs

### Table: Assets
- `url` (String, PK): Original source URL
- `blob` (Blob): Binary image data
- `localFilename` (String): Sanitized filename for export
