## 1. UI and State Management (Popup)

- [x] 1.1 Add a "Settings" section with a "Debug Mode" toggle in `popup.html`.
- [x] 1.2 Implement logic in `popup.js` to read/write the debug state from `chrome.storage.session`.
- [x] 1.3 Update the styling of the toggle for better visibility when ON.

## 2. Background Script Updates

- [x] 2.1 Implement a `debugLog` utility in `background.js` that checks the current debug state.
- [x] 2.2 Update `background.js` to fetch the debug state from storage on initialization.
- [x] 2.3 Ensure the `debugMode` state is included in the message sent to `payload.js` during extraction.

## 3. Payload Script Updates

- [x] 3.1 Implement a `debugLog` utility in `payload.js`.
- [x] 3.2 Update the `extract` message handler in `payload.js` to receive and store the `debugMode` state.
- [x] 3.3 Modify the DOM cleaning logic in `payload.js` to conditionally preserve `debug-` attributes.
- [x] 3.4 Add `debugLog` calls to critical points in the extraction and image processing loop.

## 4. Verification

- [x] 4.1 Verify that the "Debug Mode" toggle persists after closing the popup.
- [x] 4.2 Confirm that `debug-` attributes are present in the HTML export when Debug Mode is ON.
- [x] 4.3 Confirm that `debug-` attributes are REMOVED when Debug Mode is OFF.
- [x] 4.4 Verify that verbose logs appear in the console only when Debug Mode is ON.
