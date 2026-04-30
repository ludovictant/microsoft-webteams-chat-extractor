## Why

Starting an extraction in one tab while another is already active can lead to state corruption, duplicate data in the background script, and a confusing user experience. While basic locking exists, it doesn't explicitly inform the user when they are attempting a concurrent extraction from a different tab.

## What Changes

- **Multi-Tab Detection**: Improve `background.js` to reject `START_EXTRACTION` if an extraction is already in progress, returning a specific error.
- **Specific User Feedback**: In `popup.js`, detect if the current tab is not the one running the extraction. Display a clear warning message: "An extraction is already running in another tab. Please wait for it to finish or stop it before starting a new one."
- **Status Sharing Awareness**: Update the UI to clearly indicate when it is showing the status of an extraction running in a *different* tab.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `extraction-lifecycle-management`: Extend to handle multi-tab concurrency and user notification.

## Impact

- `background.js`: Add check in `START_EXTRACTION` handler.
- `popup.js`: Update `updateUI` to compare current tab ID with active extraction tab ID and show appropriate messaging.
