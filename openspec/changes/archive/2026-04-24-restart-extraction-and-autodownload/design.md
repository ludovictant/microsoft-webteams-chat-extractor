## Context

The user current workflow requires manual intervention to download the ZIP once ready. Also, starting a new extraction after completion is not supported without a full extension reload.

## Goals / Non-Goals

**Goals:**
- Automatically trigger the ZIP download once image processing is complete.
- Provide a "Reset" path in the UI to allow starting a new extraction.
- Ensure the background script state is fully cleared when resetting or starting new work.

## Decisions

### 1. Automatic Download (Popup Logic)
A state variable `autoDownloadTriggered` will be added to `popup.js`. When the background script status reaches `'ready'`, the `updateUI` function will check this flag. If false, it will immediately trigger the `DOWNLOAD_ZIP` request and set the flag to true.

### 2. Reset Button (UI & Logic)
A new button will be added to the `finalActions` panel in `popup.html`.
- **Action**: Sends `RESET_STATUS` to `background.js`.
- **Transition**: `popup.js` will immediately call `pollStatus` (which will receive the 'idle' state) to show the initial options panel.

### 3. Background State Management
A new case `RESET_STATUS` will be added to the background message listener. It will re-initialize `extractionData` to the same idle state used at load time. This ensures no memory leaks or stale data from previous extractions.

## Risks / Trade-offs

- **[Risk]** Multiple downloads triggering if polling is fast.
- **[Mitigation]** The `autoDownloadTriggered` flag in the popup scope (persistent as long as the popup is open) ensures only one call is made. If the popup is closed and reopened, the 'ready' state will be detected again, but since the user might want to re-download in that case, it is acceptable.
