## Why

When a user initiates an export from the conversation history, the system enters a resource-intensive state (fetching data from IndexedDB and generating a ZIP). Currently, only other download buttons in the list are disabled. To prevent accidental data corruption, concurrent operations (like starting a new extraction or clearing storage), and to provide a clearer status to the user, the entire interface should be locked until the export is complete.

## What Changes

- **Global UI Lock**: Implement a centralized mechanism to disable all interactive elements in the side panel when a historical export is in progress.
- **Affected Elements**:
  - All extraction trigger buttons (Recent, 30 days, All).
  - Footer actions ("Check for updates", "Delete local storage").
  - Settings switches ("Debug", "Stats sharing").
  - Table interactions (Column sorting).
- **Visual Feedback**: Ensure all locked elements provide clear visual feedback (reduced opacity, "not-allowed" cursor).

## Capabilities

### Modified Capabilities
- `historical-data-export`: The system SHALL disable the entire side panel UI during a historical export to prevent concurrent operations and state conflicts.
- `sortable-dashboard-list`: Sorting SHALL be disabled while an export is in progress.

## Impact

- `sidepanel.js`: Expansion of the `isExportingArchive` logic to affect more UI elements. Creation of a `toggleUILock(locked)` helper function.
- `sidepanel.html`: Minor CSS updates to handle the disabled state of links and table headers.
