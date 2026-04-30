## 1. Background Logic (background.js)

- [x] 1.1 Update `STOP_EXTRACTION` handler to transition to `ready` (or `processing` if assets are pending) instead of `idle`.

## 2. Payload Verification (payload.js)

- [x] 2.1 Verify if `FINISH_EXTRACTION` is still needed when `STOP_EXTRACTION` is handled by background. (Likely not, as background transitions state immediately).

## 3. Verification

- [ ] 3.1 Start extraction, click "Stop and Export" while it's running. Verify it goes to the download screen.
- [ ] 3.2 Start extraction, click "Abort Extraction". Verify it returns to the options screen.
- [ ] 3.3 Enter `stuck` state, click "Stop and Export". Verify it goes to the download screen.
