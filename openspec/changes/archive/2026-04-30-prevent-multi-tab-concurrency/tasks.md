## 1. Background Logic (background.js)

- [x] 1.1 Update `START_EXTRACTION` handler to reject requests if status is not `idle` and it's a different tab.

## 2. Popup UI (popup.js)

- [x] 2.1 Update `updateUI` to detect if the current tab is the active extraction tab.
- [x] 2.2 Implement "Another tab is busy" notification in `statusNudge`.
- [x] 2.3 Disable extraction trigger buttons if another tab is busy.

## 3. Verification

- [ ] 3.1 Start extraction in Tab A. Open popup in Tab B. Verify the warning message appears.
- [ ] 3.2 Verify buttons in Tab B are disabled.
- [ ] 3.3 Verify Tab B still shows the progress of Tab A's extraction.
