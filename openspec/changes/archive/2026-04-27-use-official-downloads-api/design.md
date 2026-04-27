## Context

The extension currently uses a simulated link click to trigger downloads. This "hack" can confuse Chrome's internal handling of file types, leading to the automatic opening of ZIP files.

## Goals / Non-Goals

**Goals:**
- Use the official Chrome Downloads API.
- Prevent unwanted auto-opening of the ZIP file.

**Non-Goals:**
- Disabling the auto-download feature.

## Decisions

- **Use `chrome.downloads.download`**: This API is specifically designed for extensions and offers a `saveAs` option (which we set to `false`) to ensure the file is handled purely as a background download.
- **Maintain Auto-Trigger**: The existing `autoDownloadTriggered` logic in `updateUI` will be kept to ensure a seamless user experience.

## Risks / Trade-offs

- [Risk] → User might forget to click the download button.
- [Mitigation] → The completion screen clearly states "Ready!" and the "Download Archive (ZIP)" button remains the primary focal point of the UI.

## Failed Workarounds (Auto-Opening Issue)

Attempts to prevent Chrome from automatically opening the ZIP file via code have proven unsuccessful:
1.  **Switch to `chrome.downloads.download` API**: Even with the official API and `saveAs: false`, Chrome still follows local auto-open rules.
2.  **MIME-type Obfuscation**: Changing the data type from `application/zip` to `application/octet-stream` did not bypass the auto-open rule, suggesting Chrome prioritizes the `.zip` file extension over the reported MIME type.

**Conclusion**: Auto-opening is a browser-level preference (`chrome://settings/downloads`) that cannot be consistently overridden by extension code.
