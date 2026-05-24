## Why

Users need to know when they last exported a specific conversation to avoid redundant downloads and to keep track of their local archive currency. Adding a "Last Download" column to the history list provides this visibility and allows for better organization of extracted data.

## What Changes

- **Database Schema Update**: Add a `lastDownloadTimestamp` field to the `conversations` object store in IndexedDB.
- **Background Logic**: Update the `DOWNLOAD_ZIP` message handler to record the current timestamp in the database whenever a download is successfully initiated.
- **UI Enhancement**: Add a new sortable "Last Download" column to the `#historyTable` in the side panel.
- **Formatting**: Reuse the existing date formatting helpers to display the download timestamp.

## Capabilities

### New Capabilities
- `track-download-history`: The system SHALL record and display the date and time of the most recent ZIP download for each conversation in the local storage history list.

### Modified Capabilities
- `sortable-dashboard-list`: The "Last Download" column SHALL be sortable in both ascending and descending order.

## Impact

- `background.js`: Update `TeamsExtractorDB` with a `updateLastDownload(teamsId)` method and integrate it into the `DOWNLOAD_ZIP` flow.
- `sidepanel.js`: Update `refreshHistoryList` to include the new column and implement sorting logic for it.
- `sidepanel.html`: Add the "Last Download" header to the history table and update CSS grid/table widths.
