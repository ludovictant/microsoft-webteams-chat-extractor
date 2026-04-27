## Why

Users may inadvertently break the extraction process by switching conversations in the Teams window while the script is running. Additionally, when reaching the absolute beginning of a chat history, the script sometimes "rebounds" (repeats the same oldest messages) instead of stopping automatically. A clear disclaimer in the popup UI is needed to provide guidance on these behaviors.

## What Changes

- Add a dedicated disclaimer section in `popup.html` within the status/progress panel.
- Update `popup.js` to ensure the disclaimer is visible during the `extracting` and `stuck` states.
- Refine the disclaimer text to be clear and professional: 
  *   "Important: Do not switch conversations in the Teams window during extraction."
  *   "If the process restarts or gets stuck at the oldest message, click 'Stop and Export' to finalize."

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `ui-simplification`: Add requirements for informational disclaimers and user guidance during active extraction.

## Impact

- `popup.html`: New UI element for the disclaimer.
- `popup.js`: Visibility management for the disclaimer.
- UX: Improved user awareness and reduced confusion at the end of long extractions.
