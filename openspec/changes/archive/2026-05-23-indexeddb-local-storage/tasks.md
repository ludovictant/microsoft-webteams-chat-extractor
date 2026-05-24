## 1. UI Implementation

- [x] 1.1 Add "Local storage" toggle HTML and CSS to `sidepanel.html`.
- [x] 1.2 Implement toggle state persistence in `sidepanel.js` using `chrome.storage.local`.
- [x] 1.3 Ensure the `START_EXTRACTION` message includes the `localStorageEnabled` preference.

## 2. Content Script Enhancements (payload.js)

- [x] 2.1 Implement `getTeamsConversationId()` to extract unique `teamsId`.
- [x] 2.2 Update `serializeMessage()` to classify messages as "true" or "meta" type.
- [x] 2.3 Include `teamsId` in the `CHUNK_READY` payload sent to background.

## 3. Persistent Layer (background.js)

- [x] 3.1 Implement IndexedDB wrapper class/functions for `TeamsExtractorDB`.
- [x] 3.2 Update `CHUNK_READY` listener to upsert conversation metadata and save messages to DB if enabled.
- [x] 3.3 Update `ASSET_READY` listener to save blob data to the `assets` store if enabled.
- [x] 3.4 Ensure all time-related fields in DB use `Timestamp` suffix.

## 4. Verification

- [x] 4.1 Verify that the "Local storage" toggle works and its state is remembered.
- [x] 4.2 Verify that a crawling session correctly populates IndexedDB in the browser dev tools.
- [x] 4.3 Confirm that system messages are tagged as "meta" and user messages as "true".
- [x] 4.4 Verify that assets are correctly stored as Blobs in the DB.
