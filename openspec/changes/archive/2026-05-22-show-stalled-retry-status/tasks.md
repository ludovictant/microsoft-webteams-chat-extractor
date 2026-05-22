## 1. Content Script (payload.js)

- [x] 1.1 Update the `PROGRESS` message in `scrollAndExtract` to include `noChangeCount` and `waitTime`.

## 2. Background Script (background.js)

- [x] 2.1 Update the `extractionData` object template to include `noChangeCount: 0` and `waitTime: 2500`.
- [x] 2.2 Update the `PROGRESS` message listener in `background.js` to store the new metadata.
- [x] 2.3 Ensure the `RESET_STATUS` handler resets these values to their defaults.

## 3. Side Panel UI (sidepanel.js)

- [x] 3.1 Update the `updateUI` function to check for `data.noChangeCount > 0`.
- [x] 3.2 Implement logic to display the retry status in `statusNudge` when the process is waiting.
- [x] 3.3 Ensure the nudge is cleared or updated correctly when the extraction resumes (`noChangeCount === 0`).

## 4. Verification

- [x] 4.1 Trigger an extraction and verify that when it slows down, the side panel shows the retry attempt and wait time.
- [x] 4.2 Verify that the message disappears once new content is found.
- [x] 4.3 Verify that the hard "Stalled" alert still appears after 15 attempts.
