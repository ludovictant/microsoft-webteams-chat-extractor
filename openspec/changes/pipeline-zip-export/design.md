## Context

The extension is being refactored to handle "Archive-Scale" data (5,000+ messages). The current architecture fails because it attempts to build a single, massive Base64-encoded HTML string in the content script and send it to the popup. This design shifts to a decoupled, batch-based pipeline.

## Goals / Non-Goals

**Goals:**
- Eliminate memory crashes for large extractions.
- Exclusive support for a ZIP-based multi-format export.
- Implement background asset fetching to ensure persistence.
- Provide structured filenames for all exported assets.

**Non-Goals:**
- Supporting single-file HTML exports (all exports will be ZIP).
- Creating a separate database for messages (persistent state will be in Service Worker RAM/storage).

## Decisions

### 1. Data Model
Messages will be extracted into "Message Data Objects" (MDOs) in `payload.js`:
```javascript
{
  id: string,
  author: string,
  avatarUrl: string | null,
  timestamp: number,
  htmlContent: string, // Cleaned HTML, images replaced with placeholders
  images: Array<{ url: string, originalId: string }>
}
```

### 2. Pipeline Stages
1. **Extraction (`payload.js`)**: Scans DOM, creates MDOs. Sends a message `CHUNK_READY` to the Service Worker every 10 MDOs.
2. **Coordination (`background.js`)**:
   - Collects MDOs into a master list.
   - For every MDO, adds `avatarUrl` and `images` to a `FetchQueue`.
   - Fetches assets as `ArrayBuffer` (binary) in parallel (limit 5 at a time).
3. **Packaging (`background.js` + `JSZip`)**:
   - Builds `index.html` using a template.
   - Converts HTML to Markdown (`transcript.md`) and CSV (`transcript.csv`).
   - Writes all files and binary assets to the ZIP structure.

### 3. Asset Naming Convention
- **Avatars**: `images/avatar_[SanitizedName].png`
- **Message Images**: `images/msg_[YYYYmmDD.HHMMSS]_[MessageId]_[Index].png`
*Sanitization: Replace non-alphanumeric characters with underscores.*

### 4. Background Persistence
Since Service Workers can time out, the Content Script will send a periodic "Heartbeat" message every 10 seconds during extraction to keep the worker alive.

### 5. Multi-Format Generation
- **HTML**: Reuse existing Teams-like CSS. Reference images as `./images/...`.
- **Markdown**: Map common HTML tags (`<div>`, `<span>`, `<blockquote>`) to MD equivalents.
- **CSV**: Columns: `Timestamp`, `Author`, `Content` (stipped of all tags).

## Risks / Trade-offs

- **[Risk] Unzipping Overhead**: Users have to unzip to view.
  - **Mitigation**: This is the standard trade-off for high-fidelity data archiving.
- **[Risk] Library Size**: Including `jszip.min.js` increases extension package size by ~100KB.
  - **Mitigation**: Negligible impact on performance.
- **[Risk] Service Worker Death**: If Chrome kills the worker despite heartbeats.
  - **Mitigation**: Use `chrome.storage.local` to "checkpoint" extracted data if needed (V2 scope).
