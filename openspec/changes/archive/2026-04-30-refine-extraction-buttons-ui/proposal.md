## Why

The current extraction buttons have generic labels ("Last 7 days", etc.) that may not clearly communicate the resulting action (starting a download). Additionally, the UI contains redundant section titles ("Time range", "Settings") that clutter the interface and don't provide significant value.

## What Changes

- **Clearer Button Labels**: Update extraction buttons to explicitly state "Download" (e.g., "Download last 7 days").
- **Unified Button Styling**: Update the appearance of the extraction buttons to match the primary green action buttons (like "Start New Extraction").
- **UI Simplification**: Remove the "Time range" and "Settings" section labels to create a cleaner, more focused layout.
- **Enhanced Disclaimer**: Added a warning against using the tool simultaneously in multiple tabs or windows to prevent state corruption.
- **Rebranding**: Update the popup title to "MS Teams Chat Extractor" for better brand alignment.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `ui-simplification`: Update requirements to reflect the removal of section labels and the standardization of extraction trigger buttons.

## Impact

- `popup.html`: Update HTML structure and CSS styles.
