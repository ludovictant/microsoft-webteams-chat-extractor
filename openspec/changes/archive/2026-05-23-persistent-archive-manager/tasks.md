## 1. Foundation: Persistent Storage

- [x] 1.1 Add `unlimitedStorage` permission to `manifest.json`.
- [x] 1.2 Implement the IndexedDB initialization and schema in `background.js` (Stores: `Conversations`, `Messages`, `Assets`).
- [x] 1.3 Create a database utility wrapper for transactional CRUD operations (Get/Put/Delete).

## 2. Side Panel UI Development

- [x] 2.1 Create `dashboard.html` optimized for sidebar width (~400px).
- [x] 2.2 Implement the CSS for the side panel, including the "Panel Lock" overlay.
- [x] 2.3 Create `dashboard.js` to handle UI rendering, checkbox logic, and communication with the background script.
- [x] 2.4 Implement the "Add Teams conversation URL" modal in `dashboard.html`.

## 3. Core Logic: Side Panel & Lifecycle Management

- [x] 3.1 Update `manifest.json` to include the `sidePanel` permission and set `default_path`.
- [x] 3.2 Implement logic in `background.js` to open the side panel on icon click.
- [x] 3.3 Add message handlers to handle conversation onboarding (URL parsing).
- [x] 3.4 Implement the "Extraction Lock" logic to disable panel controls during active runs.

## 4. Enhanced Extraction: Incremental & Meta Support

- [x] 4.1 Update `payload.js` to accept a `stopTimestamp` parameter for incremental extraction.
- [x] 4.2 Implement the "UPSERT" logic in `background.js` to update existing messages and reactions.
- [x] 4.3 Update `payload.js` to explicitly categorize message types (`standard` vs `meta`).
- [x] 4.4 Refactor `background.js` to save extraction chunks directly to IndexedDB instead of RAM.

## 5. Data Management: Deletion & Export

- [x] 5.1 Implement the "Select All" and multi-delete logic in `dashboard.js`.
- [x] 5.2 Implement cascading deletion in `background.js` (Conversations -> Messages).
- [x] 5.3 Add the "Garbage Collection" logic to cleanup orphaned assets after deletion.
- [x] 5.4 Refactor the ZIP generation logic to support sequential generation of multiple ZIP files from IndexedDB data.

## 6. Cleanup & Verification

- [x] 6.1 Remove `popup.html` and `popup.js` from the codebase.
- [x] 6.2 Verify incremental extraction by running multiple updates on the same conversation.
- [x] 6.3 Verify bulk deletion and storage usage stats.
- [x] 6.4 Update `README.md` and `INSTALL.md` to reflect the new UI and storage architecture.
