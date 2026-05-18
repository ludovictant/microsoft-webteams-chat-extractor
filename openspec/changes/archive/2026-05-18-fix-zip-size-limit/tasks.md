## 1. Background Refactor

- [x] 1.1 Update the `DOWNLOAD_ZIP` message handler in `background.js` to include the `chrome.downloads.download` call.
- [x] 1.2 Modify the `DOWNLOAD_ZIP` response to return `{ success: true, filename: finalFilename }` instead of the Base64 data.

## 2. Popup Refactor

- [x] 2.1 Update the `downloadZip()` function in `popup.js` to remove the local `chrome.downloads.download` call.
- [x] 2.2 Update the `DOWNLOAD_ZIP` response handler in `popup.js` to trigger the "Downloaded!" toast and reset button states upon receiving a success status from the background.

## 3. Verification

- [x] 3.1 Verify that a standard extraction (under 64MB) still triggers a successful download and displays the toast.
- [x] 3.2 Verify that a large extraction (over 64MB) no longer throws the "Message exceeded maximum allowed size" error and successfully triggers the download.
