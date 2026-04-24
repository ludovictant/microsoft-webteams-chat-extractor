## 1. UI Updates (popup.html)

- [x] 1.1 Add a "Start New Extraction" button to the `#finalActions` div in `popup.html`.

## 2. Background Logic (background.js)

- [x] 2.1 Implement the `RESET_STATUS` message handler in `background.js` to re-initialize `extractionData`.

## 3. Popup Logic (popup.js)

- [x] 3.1 Implement the `autoDownloadTriggered` flag and logic in `updateUI` to automatically trigger download on 'ready' state.
- [x] 3.2 Reset the `autoDownloadTriggered` flag when starting a new extraction.
- [x] 3.3 Implement the reset button click listener to send `RESET_STATUS` to the background.
- [x] 3.4 Refactor the error state "Restart" button to also use the `RESET_STATUS` mechanism.

## 4. Verification

- [x] 4.1 Perform an extraction and verify that the ZIP download starts automatically when processing finishes.
- [x] 4.2 Verify that the "Start New Extraction" button appears and correctly returns the popup to the options panel.
- [x] 4.3 Verify that starting a second extraction immediately after the first works without issues or stale data.
