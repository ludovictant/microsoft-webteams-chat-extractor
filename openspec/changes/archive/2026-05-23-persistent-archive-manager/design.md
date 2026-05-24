## Context

The extension is transitioning from a stateless session-based tool to a persistent conversation manager. This requires moving data storage from volatile RAM in the Service Worker to a robust, local database. To solve synchronization issues with Teams' landing pages, the UI is pivoting to a Side Panel architecture, allowing the archive manager to operate side-by-side with the active Teams tab.

## Goals / Non-Goals

**Goals:**
- Provide a persistent local database using IndexedDB for conversations, messages, and assets.
- Replace the popup with a persistent **Side Panel**.
- Enable incremental updates to existing archives.
- Implement secure, bulk deletion with automatic garbage collection of unused assets.
- Support adding conversations via manual URL entry.
- **Manual Export**: Allow users to trigger ZIP exports for one or more conversations, resulting in separate ZIP files for each.

**Non-Goals:**
- Standalone full-page dashboard (deprecated in favor of Side Panel).
- **Automatic ZIP generation**: The system will no longer trigger a download immediately after a crawl completes.
- Cloud synchronization or server-side backups.
- Exporting to formats other than the existing ZIP (HTML, MD, CSV, JSON).
- Real-time "watching" of chat (active crawling is still user-initiated).

## Decisions

### 1. Storage: IndexedDB via Wrapper
- **Decision**: Use raw IndexedDB (or a lightweight Promise-based wrapper like `idb`) in `background.js`.
- **Rationale**: IndexedDB is the only browser storage capable of holding hundreds of megabytes of binary blobs (images) and structured text without hitting the 5MB/64MB limits of `chrome.storage` or messaging.
- **Alternatives**: `chrome.storage.local` (discarded due to 5MB default limit and JSON serialization overhead).

### 2. UI: Side Panel API
- **Decision**: Use the Chrome Side Panel API to host `dashboard.html`.
- **Rationale**: A side panel stays open as the user navigates different Teams chats, allowing for a "companion" experience. Most importantly, it allows the extension to act on the *active* warmed-up Teams tab rather than opening new ones.
- **Layout**: Optimize the table and action bar for a fixed-width sidebar (~400px). Use icons and tooltips to save horizontal space.
- **Alternatives**: Full-page tab (discarded due to new-tab sync friction).

### 3. Data Integrity: Partial Extraction Retainment
- **Decision**: On manual "Stop", commit all messages processed so far to the DB, but do not update the `lastCrawled` field in the `Conversations` table.
- **Rationale**: Ensures the user doesn't lose work if they have to interrupt a long extraction, while accurately reflecting that the most recent "full sync" is still the older date.

### 4. Image Reuse: Asset Global Map
- **Decision**: The `Assets` table will be keyed by the original Teams URL. 
- **Rationale**: Avatars are frequently repeated across chats. Storing them once globally saves significant disk space.
- **Garbage Collection**: Deletion logic will include a "ref-count" check. An asset is deleted only if no other message in the `Messages` table references its URL.

### 5. Extraction Flow: Incremental Parity
- **Decision**: `payload.js` will receive the `newestMessageTimestamp` from the DB. It will scroll up until it encounters a message older than this value.
- **Rationale**: Dramatically reduces extraction time for large, active chats by avoiding re-downloading thousands of historical messages.

### 6. Export: Sequential Multiple ZIPs
- **Decision**: When multiple conversations are selected for export, the background script will generate and trigger downloads sequentially.
- **Rationale**: Browser "Automatic Download" protections often block 5+ simultaneous download triggers. By processing them one-by-one (or in small batches), we ensure each file is successfully saved.
- **Filenaming**: Continue using the `Title_from_DATE_to_DATE.zip` format for consistency.

## Risks / Trade-offs

- **[Risk]** Database Corruption. → **Mitigation**: Implement a basic DB versioning and migration strategy. Use `try/catch` blocks for all transactions with user-facing error reporting.
- **[Risk]** Heavy disk usage (GBs of images). → **Mitigation**: Users are already downloading these as ZIPs. We are just moving the storage location. We will include a "Total Storage Used" stat in the dashboard.
- **[Risk]** VDI/Virtual Desktop environments clearing IndexedDB on logout. → **Mitigation**: This is an inherent browser limitation. We will add a note in the HELP section that archives may be lost in VDI environments and should be exported frequently.
