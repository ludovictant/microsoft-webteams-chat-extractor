## 1. Logic Clean-up

- [x] 1.1 Remove `autoDownloadTriggered` variable and associated logic in `sidepanel.js`
- [x] 1.2 Remove the auto-trigger `downloadZip()` call from the `ready` state handler in `updateUI`

## 2. Button State Management

- [x] 2.1 Refactor `downloadZip()` in `sidepanel.js` to keep the button disabled upon success
- [x] 2.2 Update `downloadZip()` success callback to set button text to "Downloaded!" without re-enabling
- [x] 2.3 Ensure the button re-enables and restores its original icon/text only in the `RESET_STATUS` handler (Start New Extraction)

## 3. Verification

- [x] 3.1 Verify that the download NO LONGER starts automatically when extraction finishes
- [x] 3.2 Verify that clicking "Download" once disables the button permanently for that session
- [x] 3.3 Verify that clicking "Start New Extraction" restores the download button for the next run
