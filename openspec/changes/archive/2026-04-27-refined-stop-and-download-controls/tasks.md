## 1. UI Implementation (popup.html)

- [x] 1.1 Add the `#abortExtractionBtn` element to the active extraction status panel.
- [x] 1.2 Apply consistent styling to the new button (using a more neutral style to differentiate from Stop).

## 2. Core Logic (popup.js)

- [x] 2.1 Implement the click listener for `#abortExtractionBtn` to send the existing `RESET_STATUS` signal (which handles stopping the tab and resetting background state).
- [x] 2.2 Update `updateUI` to manage the visibility of the abort button.
- [x] 2.3 Modify the `downloadZip` function to disable the `#downloadZipBtn` and change its text to "Downloaded!" upon success.

## 3. Verification

- [x] 3.1 Verify that clicking "Abort Extraction" returns the user to the initial selection screen immediately.
- [x] 3.2 Verify that the download button correctly deactivates and changes label after a successful ZIP download.
