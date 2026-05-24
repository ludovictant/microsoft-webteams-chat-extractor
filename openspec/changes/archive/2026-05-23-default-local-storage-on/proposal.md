## Why

The "Local storage" feature is currently disabled by default, which means many users might miss out on the benefits of persistent chat history and faster incremental extractions. Enabling it by default ensures that users have their data saved locally unless they explicitly opt out.

## What Changes

- **Default State**: Update the initial state of the `localStorageEnabled` preference to `true`.
- **UI Interaction**: Ensure the checkbox in the side panel reflects this default state on first launch.
- **Storage Sync**: Initialize the `chrome.storage.local` value to `true` if it hasn't been set yet.

## Capabilities

### Modified Capabilities
- `ui-simplification`: Update the `Local storage toggle` scenario to specify a default "on" state.

## Impact

- `sidepanel.js`: Modification of initialization logic to set default toggle state.
- `background.js`: Modification of `extractionData` initialization to match the new default.
