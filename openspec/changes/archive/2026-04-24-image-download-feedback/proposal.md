## Why

After the message collection phase (scrolling and DOM scanning), the extension enters a processing phase where it fetches all message-related images (emojis, attachments, avatars) and converts them to Base64. This phase can take a significant amount of time if many images are present, but currently, the user receives no feedback other than a static "finalizing" state or a spinner. This leads to uncertainty about whether the process is stuck or still working.

## What Changes

- **Image Download Progress Tracking**: The processing logic will now track the total number of images to be fetched and the current progress.
- **Dynamic Processing Status**: The popup will display a clear status message indicating that it is currently "Processing images..." along with a counter (e.g., "5/25 images").
- **Progress Bar Reuse**: The visual progress bar will be updated during the image download phase to reflect the processing percentage.
- **Granular Error Reporting**: If specific images fail to download, the progress will continue, but the user will see a count of successes vs. failures if desired (optional).

## Capabilities

### New Capabilities
- `image-processing-feedback`: Provide real-time feedback during the image-to-base64 conversion phase.

### Modified Capabilities
- `extraction-progress-visualization`: Extend the existing progress bar and status text to support the processing phase.

## Impact

- `payload.js`: Update `buildTranscript` to calculate image counts and emit periodic progress updates during the `replaceImagesWithBase64` and avatar fetching steps.
- `popup.js`: Update the message listener to handle a new `processing` message type and update the UI accordingly.
