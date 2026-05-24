## Context

The current export pipeline in `background.js` is tightly coupled to the `extractionData` global variable. This variable is transient and only holds data for the current active extraction session. To support exporting historical archives from IndexedDB, we must decouple the rendering logic from this global state and provide a way to hydrate the export pipeline from the database.

## Goals / Non-Goals

**Goals:**
- **Stateless Rendering**: Refactor all `render*` functions to be pure functions that take a standardized data object.
- **Archive Export**: Enable ZIP generation for any conversation stored in IndexedDB.
- **UI Accessibility**: Provide clear entry points for historical export in the side panel.

**Non-Goals:**
- **Bulk Export**: This design focuses on individual conversation exports. Multi-selection for bulk export remains out of scope for this phase.
- **Streaming Export**: We will load the requested conversation into memory for the duration of the ZIP generation rather than implementing a streaming cursor (to keep complexity low while using Option 2).

## Decisions

### 1. Unified `ExportData` Interface
- **Decision**: Define a standard object structure for the export pipeline.
- **Rationale**: This allows the same rendering code to handle both "live" data from a session and "historical" data from IndexedDB.
- **Structure**:
  ```javascript
  {
    title: string,
    messages: Array<MessageObject>,
    assets: Map<url, Blob>, // or Object
    authorToAvatarUrl: Map<author, url>
  }
  ```

### 2. Database Retrieval Helper: `db.getExportData(teamsId)`
- **Decision**: Add a new method to `TeamsExtractorDB` to consolidate data retrieval.
- **Rationale**: Exporting requires joining messages with their associated binary assets (images and avatars). A single method ensures efficient querying.
- **Implementation**:
  1. Fetch conversation metadata (title).
  2. Fetch all messages for the `teamsId`.
  3. Identify all asset URLs referenced in those messages and in the author mapping.
  4. Fetch all corresponding blobs from the `assets` store.

### 3. Side Panel History Table Update
- **Decision**: Add an "Actions" column to the `#historyTable` with a "Download" button.
- **Rationale**: This provides a familiar UX for managing local archives.
- **Implementation**: The button will send a `DOWNLOAD_ZIP` message with an optional `teamsId`. If `teamsId` is provided, the background script will use the database; otherwise, it uses the active session.

### 4. Refactoring `generateZip`
- **Decision**: Update `generateZip` to accept the `ExportData` object.
- **Rationale**: It currently assumes `extractionData` is the source.
- **Async Handling**: Since database retrieval is async, the ZIP generation flow will be fully awaited.

## Risks / Trade-offs

- **[Risk] Memory Spikes for Large Chats** → **Mitigation**: While we are loading the chat into memory for the export, IndexedDB reads are generally faster and more stable than maintaining thousands of DOM nodes. We will monitor performance for very large (10k+) message counts.
- **[Risk] Missing Assets** → **Mitigation**: If an asset is missing from IndexedDB (e.g., failed download), the export should skip it gracefully rather than crashing.
- **[Risk] UI Clutter** → **Mitigation**: Use a compact icon button (e.g., a "Download" icon) to keep the history table readable in the narrow side panel.
