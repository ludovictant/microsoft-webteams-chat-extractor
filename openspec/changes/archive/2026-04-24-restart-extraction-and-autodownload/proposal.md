## Why

Currently, the user must manually click a "Download" button after waiting for the image processing to complete. Additionally, once an extraction is finished or downloaded, the popup remains in a "Ready" state without a clear path to start another extraction for a different time range or chat. Automating the download and providing a "Reset" flow improves efficiency and makes the extension more intuitive for repetitive tasks.

## What Changes

- **Automatic Download Trigger**: The background script will now signal the popup to initiate the ZIP download immediately upon reaching the 'ready' status.
- **Workflow Reset**: A "Start New Extraction" button will be added to the final screen, allowing the user to return to the initial options panel.
- **State Cleanup**: Ensure all background data (messages, assets, maps) are properly cleared when a reset is triggered or a new extraction starts.

## Capabilities

### New Capabilities
- `automated-download`: Automatically trigger the browser's download dialog as soon as the ZIP archive is prepared.
- `extraction-lifecycle-management`: Support for multiple extraction sessions within the same browser session without extension reloads.

### Modified Capabilities
- (none)

## Impact

- `popup.js`: Update the polling logic to automatically call the download routine and handle the transition back to the options panel.
- `background.js`: Ensure the 'ready' status is correctly communicated and that state reset logic is robust.
- `popup.html`: Add a "Start New" button to the `finalActions` div.
