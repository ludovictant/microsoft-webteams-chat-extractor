## Why

Currently, during the chat extraction process, the user only sees a simple count of messages collected. There is no feedback on "how far back" the scanner has reached in the history, nor is there any visual indication of progress relative to the requested time range. Providing more detailed feedback reduces user anxiety during long extractions and makes the extension feel more robust and professional.

## What Changes

- **Timestamp Reporting**: The content script will now report the timestamp of the oldest message collected so far back to the popup.
- **Dynamic Progress Display**: The popup will show a formatted date indicating the current "depth" of the extraction.
- **Progress Bar**: A visual progress bar will be added to the popup for time-limited extractions (e.g., "Last 7 days"), showing progress toward the target date.
- **Improved Status Text**: Refine the status messages to be more descriptive of the current state (initial sync, scrolling, finalizing).

## Capabilities

### New Capabilities
- `extraction-progress-visualization`: Real-time visualization of extraction progress, including date depth and percentage completion for limited ranges.

### Modified Capabilities
- (none)

## Impact

- `payload.js`: Update the `progress` message payload to include the oldest timestamp.
- `popup.js`: Update the message listener to calculate and display progress metrics.
- `popup.html`: Add elements for the progress bar and date depth display.
- `popup.css`: (Internal to popup.html) Add styles for the new progress bar and layout adjustments.
