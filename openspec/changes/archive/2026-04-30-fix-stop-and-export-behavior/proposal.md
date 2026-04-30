## Why

The "Stop and Export" button currently behaves incorrectly when clicked during an active extraction. Instead of allowing the extraction to finalize and proceed to the export (download) phase, it resets the application state to "idle", which mimics the "Abort Extraction" behavior. This results in the loss of collected data and a failure to provide the expected ZIP download.

## What Changes

- **Correct Stop Signal Handling**: Modify the `STOP_EXTRACTION` message handler in the background script to transition the status to `ready` or allow the payload to finalize, rather than resetting to `idle`.
- **Differentiate Stop from Abort**: Ensure that "Stop and Export" triggers the `FINISH_EXTRACTION` flow in `payload.js` (by signaling it to stop and then letting it flush), while "Abort Extraction" continues to use the `RESET_STATUS` flow.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `extraction-lifecycle-management`: Update to ensure that manual stop signals correctly lead to the completion/export state.

## Impact

- `background.js`: Update `STOP_EXTRACTION` handler logic.
- `payload.js`: Ensure `scrollAndExtract` sends `FINISH_EXTRACTION` even when stopped manually via signal.
