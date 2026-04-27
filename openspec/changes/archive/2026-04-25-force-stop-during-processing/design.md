## Context

The asset processing phase (converting Teams image URLs to base64 and then Blobs) is the final bottleneck in the extraction pipeline. While it ensures a self-contained archive, it can be time-consuming. Users may want to prioritize getting the text data over waiting for all images to download.

## Goals / Non-Goals

**Goals:**
- Provide an "escape hatch" during the processing phase.
- Ensure that clicking the button results in a valid, downloadable ZIP archive.
- Correctly update the UI labels to reflect the changed action.

**Non-Goals:**
- Allowing "Force Stop" to resume later (the remaining assets are simply ignored).

## Decisions

- **State Transition**: The background script will handle a `FORCE_STOP_PROCESSING` message by setting `extractionData.status = 'ready'`.
- **UI Responsiveness**: The popup's `updateUI` will conditionally set the `stopBtn` text based on the `data.status`.
- **Implicit Export**: Since the status becomes `ready`, the popup will automatically trigger the `downloadZip()` logic (if `autoDownloadTriggered` is false) just like it does upon natural completion.

## Risks / Trade-offs

- [Risk] → ZIP archive containing broken image links.
- [Mitigation] → The MDO and rendering logic already handle missing assets gracefully (they just won't be replaced by local paths if not in the Blob map). The HTML will show whatever placeholder/broken link was there, which is acceptable for a "forced" stop.
