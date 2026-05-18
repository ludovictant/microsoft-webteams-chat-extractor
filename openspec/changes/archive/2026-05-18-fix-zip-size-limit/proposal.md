## Why

Chrome's internal messaging system (`chrome.runtime.sendMessage`) has a hard limit of 64 MiB. Currently, the extension generates a ZIP archive in the background script and sends it to the popup as a Base64 string. Large chat extractions with many images exceed this limit, causing the export to fail with a `TypeError`.

## What Changes

- **Download Architecture**: Move the `chrome.downloads.download` call from the popup script to the background script.
- **Messaging Flow**: The popup will now trigger the ZIP generation in the background, but the background script will handle the final download directly instead of sending the file data back to the popup.
- **Cleanup**: Remove large Base64 transfers from the `DOWNLOAD_ZIP` message response.

## Capabilities

### New Capabilities
- `background-triggered-download`: The ability for the Service Worker to initiate file downloads independently of the popup UI.

### Modified Capabilities
- `automated-download`: Update the requirement to ensure it works for large archives by bypassing the 64MB messaging bottleneck.

## Impact

- `background.js`: Will now require logic to call the Downloads API and manage filename generation entirely in the background.
- `popup.js`: Will be simplified to only trigger the process and listen for status updates (success/fail toast), rather than receiving the file data.
- User Experience: Large extractions (50MB+ of assets) will now successfully download instead of crashing.
