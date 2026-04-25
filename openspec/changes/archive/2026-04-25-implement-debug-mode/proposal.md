## Why

Currently, the extension automatically filters out `debug-` prefixed attributes from the HTML export, and there's no way for users to enable detailed logging if they encounter issues. Adding a "Debug Mode" toggle allows power users and developers to preserve internal debugging information and see more verbose logs when troubleshooting extraction problems.

## What Changes

- **UI**: Add a "Debug Mode" switch in the extension popup.
- **State Management**: Persist the debug mode setting in `chrome.storage.local`.
- **Extraction**:
  - If Debug Mode is **ON**: Keep all `debug-` prefixed attributes in the cloned HTML nodes.
  - If Debug Mode is **OFF** (default): Continue stripping `debug-` prefixed attributes.
- **Logging**:
  - If Debug Mode is **ON**: Enable verbose `console.log` statements throughout the extension (background and payload scripts).
  - If Debug Mode is **OFF**: Suppress non-essential logs.

## Capabilities

### New Capabilities
- `debug-mode-management`: Handles the toggle UI, persistence of the debug setting, and providing the debug state to other parts of the extension.

### Modified Capabilities
- `pipeline-extraction`: Update the extraction pipeline to conditionally filter `debug-` attributes based on the debug mode setting.

## Impact

- `popup.html` and `popup.js`: New UI element and storage logic.
- `payload.js`: Conditional attribute filtering and conditional logging.
- `background.js`: Conditional logging and propagating debug state.
