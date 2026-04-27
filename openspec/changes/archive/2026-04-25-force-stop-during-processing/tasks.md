## 1. UI Updates (popup.js)

- [x] 1.1 Update `updateUI` to change `stopBtn` text to "Force Stop and Export" when `data.status === 'processing'`.
- [x] 1.2 Update `updateUI` to revert `stopBtn` text to "Stop Extraction" for other states (like `extracting`).
- [x] 1.3 Update the `stopBtn` click listener to send `FORCE_STOP_PROCESSING` instead of `STOP_EXTRACTION` if the status is currently `processing`.

## 2. Backend Logic (background.js)

- [x] 2.1 Implement the `FORCE_STOP_PROCESSING` message handler in the `onMessage` listener.
- [x] 2.2 Transition `extractionData.status` to `ready` immediately upon receiving the signal.

## 3. Verification

- [x] 3.1 Verify that the button text changes correctly when the extraction moves from scrolling to processing.
- [x] 3.2 Verify that clicking the button during processing immediately triggers the "Ready!" state and the ZIP download.
- [x] 3.3 Confirm that the resulting ZIP contains all messages, even if some images are missing.
