## 1. CSS Styling Updates

- [x] 1.1 Add `overflow-y: auto` to the `#localStorageContent` style in `sidepanel.html`.
- [x] 1.2 Set a fixed `max-height` (e.g., `400px`) for `#localStorageContent` in the CSS to constrain its growth.
- [x] 1.3 Add custom scrollbar styling to the CSS in `sidepanel.html` to match the extension's theme.

## 2. JavaScript Refactoring

- [x] 2.1 Update `updateLocalStorageVisibility` in `sidepanel.js` to remove the hardcoded `maxHeight = '500px'` assignment and favor the CSS-defined `max-height`.
- [x] 2.2 Update `refreshHistoryList` in `sidepanel.js` to remove the dynamic `maxHeight` adjustment based on `scrollHeight`.

## 3. Verification

- [x] 3.1 Verify that when "Local storage" is ON and many conversations are stored, the list is scrollable.
- [x] 3.2 Confirm that the side panel does not grow larger than the window height.
- [x] 3.3 Verify that the scrollbar is visually consistent with the dark theme.
