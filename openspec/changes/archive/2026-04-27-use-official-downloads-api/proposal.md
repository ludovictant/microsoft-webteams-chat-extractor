## Why

Currently, when the extension finishes an extraction, it triggers a download by simulating a click on a temporary link. For some users, this causes Chrome to automatically **open** the ZIP file, which can be disruptive. We want to maintain the automatic download feature but ensure it only **saves** the file without opening it.

## What Changes

- Switch from the "anchor click" download method to the official **`chrome.downloads.download`** API.
- This provides better control over the download process and reduces the likelihood of triggering unwanted "auto-open" behaviors in the browser.
- The `autoDownloadTriggered` logic remains to ensure the download still happens automatically upon completion.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `automated-download`: Refine the requirement to specify the use of the Downloads API for safe file saving.

## Impact

- `popup.js`: Updated `downloadZip` to use `chrome.downloads.download`.
- UX: Files are saved automatically but are less likely to be opened automatically by Chrome.
