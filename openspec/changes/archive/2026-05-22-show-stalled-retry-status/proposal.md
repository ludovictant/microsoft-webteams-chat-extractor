## Why

Currently, when the extraction process slows down or appears stuck while waiting for Teams to load older messages, the extension only provides feedback via the developer console. Users in the main UI see a static progress bar and may think the extension has crashed or stopped working, until the hard "Stalled" alert appears after 15 failed attempts. Providing real-time feedback about retry attempts and wait times directly in the side panel will improve user confidence and clarity.

## What Changes

- **Enhanced Progress Reporting**: The content script will now include retry counts and current wait times in its progress updates.
- **Dynamic Status Messages**: The side panel UI will display a specific message when a "waiting" state is detected (e.g., "It seems we are at the oldest message. Retrying in 3000ms (1/15 attempt)...").
- **Real-time Countdown**: The UI will reflect the countdown or the current attempt number to show that the extension is still active.

## Capabilities

### New Capabilities
- `stall-retry-visualization`: Logic to track and display extraction retry attempts and wait intervals in the UI.

### Modified Capabilities
- `extraction-progress-visualization`: Updating the progress reporting requirements to include retry and stall metadata.

## Impact

- **`payload.js`**: Update `PROGRESS` message payload to include `noChangeCount` and `waitTime`.
- **`background.js`**: Update `extractionData` structure to persist retry state and ensure it's broadcasted to the side panel.
- **`sidepanel.js`**: Update `updateUI` to handle and display the new retry information when `noChangeCount > 0`.
