## Context

To move beyond transient sessions, we are introducing a persistent local database using IndexedDB. This allows the extension to "remember" chats, avoid redundant asset downloads, and eventually support incremental updates.

## Goals / Non-Goals

**Goals:**
- Implement a 3-table IndexedDB schema (`conversations`, `messages`, `assets`).
- Ensure every message is uniquely identified and linked to its conversation.
- Persist data in real-time as chunks arrive in the background script.
- Provide a UI toggle to enable/disable this persistence.
- Use `Timestamp` suffix instead of `TS` for all time-related fields.

**Non-Goals:**
- Creating a local UI for viewing stored messages (this will be a separate change).
- Automatic synchronization between multiple devices.

## Decisions

- **Decision: "Write-as-you-crawl" vs "Write-on-completion"**
  - **Rationale**: Real-time writing protects data against page crashes or accidental panel closures during long crawls.
  - **Implementation**: The `CHUNK_READY` and `ASSET_READY` listeners in `background.js` will trigger DB write operations.

- **Decision: `teamsId` Extraction Strategy**
  - **Primary**: Extract from `[id^="chat-header-"]` attribute (e.g., `19:meeting_...@thread.v2`).
  - **Secondary**: Fallback to URL parsing (`/chat/19:...`).
  - **Tertiary**: Cleaned title as a unique slug.

- **Decision: Schema Design**
  - **Conversations**: `teamsId` (PK), `name`, `messageCount`, `oldestMessageTimestamp`, `newestMessageTimestamp`, `lastCrawlTimestamp`.
  - **Messages**: `id` (PK), `conversationId` (FK), `timestamp`, `author`, `type` ('true' | 'meta'), `contentHTML`, `reactions` (Array), `assetLinks` (Array).
  - **Assets**: `url` (PK), `content` (Blob), `sanitizedFilename`.

- **Decision: UI Integration**
  - **Location**: A toggle switch placed in the `#options` group in `sidepanel.html`.
  - **Persistence**: Preferences saved to `chrome.storage.local`.

## Risks / Trade-offs

- **[Risk] Storage Limits** → Mitigation: IndexedDB has generous limits (usually 80% of disk space), but we will monitor for quota errors.
- **[Risk] Schema Versioning** → Mitigation: Use standard IndexedDB versioning to handle future migrations.
- **[Risk] Duplicate Messages** → Mitigation: Use message `id` as the Primary Key in the `messages` table to ensure `put()` operations are idempotent.
