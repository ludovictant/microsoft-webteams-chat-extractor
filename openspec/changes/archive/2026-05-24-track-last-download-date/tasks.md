## 1. Database & Background Refactoring

- [x] 1.1 Add `updateLastDownload(teamsId)` method to `TeamsExtractorDB` in `background.js`.
- [x] 1.2 Call `db.updateLastDownload(teamsId)` in the `DOWNLOAD_ZIP` message handler ONLY for historical exports (when `teamsId` is present in the message).

## 2. Side Panel UI Implementation

- [x] 2.1 Update `sidepanel.html` to add the "Last Download" header to the history table.
- [x] 2.2 Update table header column widths in `sidepanel.html` to accommodate the 5th column.
- [x] 2.3 Refactor `refreshHistoryList` in `sidepanel.js` to create the "Last Download" cell for each row.
- [x] 2.4 Extend the sorting logic in `sidepanel.js` to support the new `date_download` column.

## 3. Validation

- [x] 3.1 Verify that downloading a conversation updates the "Last Download" column immediately (or after refresh).
- [x] 3.2 Verify that sorting by "Last Download" works correctly (ascending/descending).
- [x] 3.3 Verify that "Never" is displayed for conversations that haven't been downloaded yet.
