## 1. Content Script Updates (payload.js)

- [x] 1.1 Update `scrollAndExtract` to calculate `currentOldest` in the scroll loop using `getOldestTimestamp`.
- [x] 1.2 Include `oldestTS: currentOldest ? currentOldest.getTime() : null` in the `progress` message payload.

## 2. Popup UI Updates (popup.html & CSS)

- [x] 2.1 Add `#progressBarContainer` and `#progressBar` elements to the `#status` div.
- [x] 2.2 Add `#dateDepth` element to the `#status` div.
- [x] 2.3 Add CSS styles for the progress bar (background, color, rounded corners).
- [x] 2.4 Add CSS animation for indeterminate progress mode.

## 3. Popup Logic Updates (popup.js)

- [x] 3.1 Store the `targetDays` globally when an extraction starts to use in progress calculations.
- [x] 3.2 Update the `progress` message listener to extract `oldestTS`.
- [x] 3.3 Implement the progress percentage calculation logic.
- [x] 3.4 Update `#progressBar` width and `#dateDepth` text in real-time.
- [x] 3.5 Reset progress elements when a new extraction starts or finishes.

## 4. Verification

- [x] 4.1 Verify progress bar correctly reflects completion for a 1-day range.
- [x] 4.2 Verify indeterminate mode works for "All history".
- [x] 4.3 Verify date depth formatting matches user locale.
