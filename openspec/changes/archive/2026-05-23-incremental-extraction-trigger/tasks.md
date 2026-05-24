## 1. UI Implementation

- [x] 1.1 Add CSS for the tooltip container and visibility logic to `sidepanel.html`.
- [x] 1.2 Add the "Download recent messages" button inside a tooltip wrapper to the `#options` panel in `sidepanel.html`.
- [x] 1.3 Update `updateLocalStorageVisibility()` in `sidepanel.js` to enable/disable the new button and its tooltip based on the toggle state.

## 2. Extraction Logic

- [x] 2.1 Update the click handler in `sidepanel.js` to correctly capture `days = -1` for the "Download recent messages" button.
- [x] 2.2 Refactor the `scrollAndExtract` logic in `payload.js` (if necessary) or the background script listener to correctly interpret `-1` as incremental mode.
- [x] 2.3 Ensure the content script's `collectAndSend` terminates as soon as an existing message ID is encountered when in incremental mode.

## 3. Verification

- [x] 3.1 Verify that the button is disabled and shows the tooltip when "Local storage" is OFF.
- [x] 3.2 Verify that the button is enabled when "Local storage" is ON.
- [x] 3.3 Verify that clicking "Download recent messages" correctly stops the extraction once it reaches previously crawled messages.
