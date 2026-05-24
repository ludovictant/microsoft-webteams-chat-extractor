## Why

Currently, the export functionality is tied to the volatile, in-memory `extractionData` object in the background script. This means users can only export a chat transcript immediately after a manual extraction session. Conversations already stored in the local IndexedDB cannot be exported without performing a redundant re-extraction. This change enables users to export any archived conversation directly from the local storage dashboard.

## What Changes

- **Data-Driven Rendering**: Refactor the rendering functions (`renderHTML`, `renderMarkdown`, etc.) to accept a structured data object instead of reading from the global `extractionData` state.
- **IndexedDB Retrieval**: Implement a background utility to gather all messages and binary assets for a specific `teamsId` from IndexedDB and format them for the export pipeline.
- **Dashboard Integration**: Add an "Export" action to each conversation row in the side panel's local storage history list.
- **Unified Export Trigger**: Consolidate the `DOWNLOAD_ZIP` message handler to support both active session data and historical data retrieval.

## Capabilities

### New Capabilities
- `historical-data-export`: The system SHALL allow users to initiate a full ZIP export for any conversation stored in the local IndexedDB directly from the side panel history list.

### Modified Capabilities
- `multi-format-rendering`: Rendering functions SHALL be refactored to be pure, data-driven functions that accept a standardized conversation data object.
- `manual-download-control`: The manual download requirement is extended to support triggering exports for historical archives in addition to active sessions.

## Impact

- `background.js`: Significant refactoring of `render*` and `generateZip` functions. New message handlers for historical export.
- `sidepanel.js`: Logic to add export buttons to the history table and handle their click events.
- `sidepanel.html`: CSS and HTML updates for the new action buttons in the history table.
