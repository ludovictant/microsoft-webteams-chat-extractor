## 1. UI Refactoring

- [x] 1.1 Update `sidepanel.html` to group the local storage toggle and the history content into a single block.
- [x] 1.2 Remove the `collapsible` class and manual click functionality from the history header.

## 2. Dynamic Visibility Logic

- [x] 2.1 Update the `localStorageToggle` change listener in `sidepanel.js` to expand the history list when `checked` and collapse it when not.
- [x] 2.2 Ensure the `refreshHistoryList` function correctly handles the initial expansion state during side panel initialization.
- [x] 2.3 Verify that the `active` class and `max-height` are properly managed to maintain smooth CSS transitions.

## 3. Verification

- [x] 3.1 Verify that the history list is visible by default (since storage is ON by default).
- [x] 3.2 Confirm that switching the toggle to "Off" hides the list immediately.
- [x] 3.3 Confirm that switching the toggle to "On" shows the list and triggers a data refresh.
