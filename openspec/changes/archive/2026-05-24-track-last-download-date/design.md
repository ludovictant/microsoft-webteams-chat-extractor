## Context

The extension provides a historical view of extracted conversations, but lacks metadata about when those conversations were last exported to a ZIP archive. To improve user organization, we will add a persistence mechanism for download events and expose this data in the side panel history list.

## Goals / Non-Goals

**Goals:**
- Persist the last download timestamp for each conversation in IndexedDB.
- Add a new "Last Download" column to the Side Panel history table.
- Implement sorting for the "Last Download" column.

**Non-Goals:**
- Tracking download history (only the *most recent* timestamp is stored).
- Tracking different formats (only the ZIP download triggers the update).

## Decisions

### 1. Database Method: `db.updateLastDownload(teamsId)`
- **Decision**: Add a dedicated method to `TeamsExtractorDB` to update the `lastDownloadTimestamp`.
- **Rationale**: Keeps the logic encapsulated. This method will be called inside the `DOWNLOAD_ZIP` message handler.

### 2. UI: Compact Table Column
- **Decision**: Adjust column widths in `sidepanel.html` to accommodate the 5th column ("Last Download").
- **Rationale**: The side panel is narrow. We may need to shorten labels or reduce padding to ensure it fits without horizontal scrolling.

### 3. Sorting Integration
- **Decision**: Extend the `handleHeaderClick` and `refreshHistoryList` logic in `sidepanel.js` to support the new `date_download` column.
- **Rationale**: Consistency with the existing sorting implementation.

## Risks / Trade-offs

- **[Risk] UI Overcrowding** → **Mitigation**: Use short date format or relative time (e.g., "2h ago") if full timestamps are too long for the side panel width. For now, we will stick to the existing date formatting helper for consistency.
- **[Risk] Race Condition in DB Update** → **Mitigation**: Use `await` for the DB update before sending the download response to ensure the UI refresh (if triggered) sees the new state.
