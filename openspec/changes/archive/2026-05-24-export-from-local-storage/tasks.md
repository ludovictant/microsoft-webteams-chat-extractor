## 1. Database Layer

- [x] 1.1 Add `getMessagesByConversation(teamsId)` to the `TeamsExtractorDB` class in `background.js` to retrieve all stored messages for a chat.
- [x] 1.2 Implement `getExportData(teamsId)` in `TeamsExtractorDB` to consolidate messages, blobs, and metadata into a single object for export.

## 2. Background Refactoring

- [x] 2.1 Refactor `renderHTML` in `background.js` to be a pure function accepting a data object.
- [x] 2.2 Refactor `renderMarkdown` in `background.js` to be a pure function accepting a data object.
- [x] 2.3 Refactor `renderCSV` in `background.js` to be a pure function accepting a data object.
- [x] 2.4 Refactor `renderJSON` in `background.js` to be a pure function accepting a data object.
- [x] 2.5 Refactor `generateZip` in `background.js` to accept a data object and handle file writing for images/avatars from the provided blobs.
- [x] 2.6 Update the `DOWNLOAD_ZIP` message listener to check for a `teamsId` in the request and fetch historical data if present.

## 3. UI Implementation

- [x] 3.1 Update the `#historyTable` header in `sidepanel.html` to include an "Actions" column (replacing or shrinking existing columns if necessary to fit the side panel width).
- [x] 3.2 Update `refreshHistoryList` in `sidepanel.js` to dynamically create a "Download" button for each conversation row.
- [x] 3.3 Add an event listener to the side panel to handle clicks on the new download buttons and send the `DOWNLOAD_ZIP` message with the corresponding `teamsId`.
- [x] 3.4 Implement global `isExporting` state in `sidepanel.js` to disable all archive download buttons during an active export.
- [x] 3.5 Update download button UI to show "generating..." state during ZIP creation for historical archives.

## 4. Testing & Validation

- [x] 4.1 Perform a "Download all messages" extraction and verify the final ZIP download is correct.
- [x] 4.2 Close and reopen the extension, then trigger an export from the "Local storage" history list for the previously extracted chat.
- [x] 4.3 Verify that historical exports correctly include all embedded images and author avatars.
