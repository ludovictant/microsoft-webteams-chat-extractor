## Why

Currently, during the "Processing" phase (when the extension is downloading and converting images), the user only has the option to wait for completion or stop entirely (which currently might lead to an error or an incomplete state without export). If a chat has hundreds of images, this phase can take a significant amount of time. Users want the ability to "Force Stop" this processing phase and immediately receive a ZIP archive containing all messages and whatever images have been successfully processed so far.

## What Changes

- Update `popup.js` to change the "Stop Extraction" button text to "Force Stop and Export" during the `processing` state.
- Implement a new action `FORCE_STOP_PROCESSING` in `background.js` that transitions the state from `processing` to `ready` regardless of how many assets are remaining.
- Ensure the background script correctly handles the interruption of the asset download queue.
- Update `popup.js` to send this new signal when the button is clicked during processing.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `extraction-lifecycle-management`: Add requirements for forced termination and partial export during the processing phase.

## Impact

- `background.js`: State machine logic update for asset processing.
- `popup.js`: UI button text and action logic update.
- UX: Reduced waiting time for users who only care about text or partial image sets.
