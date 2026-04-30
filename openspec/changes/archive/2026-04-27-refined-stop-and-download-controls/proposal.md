## Why

The current user interface only provides a "Stop and Export" action during extraction. If a user realizes they are extracting the wrong chat or want to cancel the process entirely without waiting for a ZIP generation or asset cleanup, they have no direct way to "Abort" the process. Additionally, the "Download Archive (ZIP)" button remains active after a download is finished, which can lead to redundant downloads and user uncertainty about the state of the task.

## What Changes

- Add an **"Abort Extraction"** button to the `#status` panel in `popup.html`.
- This button will appear alongside "Stop and Export" and will terminate the process immediately, returning the extension to the `idle` state without generating an archive.
- Update `popup.js` to disable the `#downloadZipBtn` once the download has successfully completed, providing clear feedback that the action is done.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `extraction-lifecycle-management`: Add requirement for an immediate "Abort" (reset) action.
- `ui-simplification`: Add requirement for deactivating completion buttons after use.

## Impact

- `popup.html`: Addition of the `#abortExtractionBtn` and corresponding styling.
- `popup.js`: Logic to handle the abort signal and disable the download button after use.
- UX: More granular control over the extraction lifecycle and clearer state transitions.
