## Why

The current "Message Range" column in the dashboard only displays dates (YYYY-MM-DD). This provides a broad overview but lacks the precision needed to distinguish between multiple extractions performed on the same day or to see the exact time coverage of a session. Adding hour and minute information (hh:mm) will provide users with more detailed and useful history tracking.

## What Changes

- **Formatting Utility**: Update the date formatting logic used in the side panel to include time components.
- **Dashboard UI**: Refresh the "Message Range" column to display dates and times (e.g., `YYYY-MM-DD hh:mm`).

## Capabilities

### Modified Capabilities
- `ui-simplification`: Update the requirement for the real-time history dashboard to specify the detailed date-time format for the message range.

## Impact

- `sidepanel.js`: Modification of `formatDate` (or equivalent utility) and the `refreshHistoryList` rendering logic.
