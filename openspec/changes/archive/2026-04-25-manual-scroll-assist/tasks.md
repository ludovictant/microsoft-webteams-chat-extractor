## 1. Core Logic (payload.js)

- [x] 1.1 Remove the `break` statement triggered when `noChangeCount` exceeds its threshold.
- [x] 1.2 Implement the `stuck` status trigger in `scrollAndExtract` when `noChangeCount` hits 15.
- [x] 1.3 Add logic to send `sendToBackground('STATUS_UPDATE', { status: 'stuck' })` and log a helpful instruction to the console.
- [x] 1.4 Update the recovery logic: reset counters and send `status: 'extracting'` as soon as `currentOldest` changes.
- [x] 1.5 Increase the `waitTime` to 5000ms while in the `stuck` state.

## 2. State Management (background.js)

- [x] 2.1 Add the `STATUS_UPDATE` case to the `chrome.runtime.onMessage` listener to update `extractionData.status`.

## 3. UI Enhancements (popup.js)

- [x] 3.1 Update the `updateUI` function to handle the `stuck` status.
- [x] 3.2 Display the prominent "Stuck! Please manually scroll..." message when the status is `stuck`.

## 4. Verification

- [x] 4.1 Verify that the popup transitions to "Stuck!" after a stall.
- [x] 4.2 Verify that manually scrolling in Teams causes the popup to automatically return to "extracting".
