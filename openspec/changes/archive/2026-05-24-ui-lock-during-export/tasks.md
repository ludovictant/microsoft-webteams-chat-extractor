## 1. UI Preparation (HTML/CSS)

- [x] 1.1 Add `.ui-locked` CSS class and related rules (opacity, pointer-events) to `sidepanel.html`.

## 2. Logic Implementation (JavaScript)

- [x] 2.1 Implement `updateGlobalUILock()` in `sidepanel.js` to enable/disable all interactive elements based on `isExportingArchive`.
- [x] 2.2 Call `updateGlobalUILock()` when a historical export starts and when it finishes (success/error).
- [x] 2.3 Refactor `handleHeaderClick` to ignore clicks when `isExportingArchive` is true.
- [x] 2.4 Ensure the "Check for updates" link and "Delete local storage" button are correctly targeted by the lock.

## 3. Validation

- [x] 3.1 Trigger a historical export and verify that all extraction buttons are disabled.
- [x] 3.2 Verify that "Check for updates" and "Stats sharing" are non-interactive during export.
- [x] 3.3 Verify that clicking table headers does not trigger sorting during export.
- [x] 3.4 Ensure the UI returns to its normal interactive state after the export completes or fails.
