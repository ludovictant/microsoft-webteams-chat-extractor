## Why

The current popup-based UI is transient and closes automatically whenever the user clicks outside of it. This makes it difficult for users to monitor progress or adjust settings while simultaneously interacting with the Microsoft Teams interface. Migrating to a Side Panel ensures that the extension's controls and progress indicators remain persistent and accessible throughout the entire extraction lifecycle.

## What Changes

- **UI Transition**: Replace the `default_popup` action with a persistent Side Panel.
- **Manifest Updates**: Addition of the `sidePanel` permission and configuration of the `side_panel` entry point.
- **Improved UX**: Users can now keep the extraction dashboard open while browsing different Teams chats or interacting with the page.
- **Lifecycle Management**: Background script logic will be updated to manage the side panel's state and opening behavior.

## Capabilities

### New Capabilities
- `side-panel-integration`: Core integration of the Chrome Side Panel API, including manifest configuration and background script handling.
- `persistent-state-sync`: Ensuring that the side panel UI correctly synchronizes with the background script's extraction state upon opening or tab changes.

### Modified Capabilities
- `ui-simplification`: Adjusting the UI layout to better suit the vertical orientation and persistent nature of a side panel.
- `extraction-progress-visualization`: Refining the progress bars and status messages for the side panel context.
- `extraction-lifecycle-management`: Updating the message passing and state management to account for side panel persistence.

## Impact

- **`manifest.json`**: Major configuration change to move from `action.default_popup` to `side_panel.default_path`.
- **`popup.html` / `popup.js`**: These files will be renamed to `sidepanel.html` and `sidepanel.js` (or similar) and refactored to work as a side panel.
- **`background.js`**: Will need to implement `chrome.sidePanel.setPanelBehavior` and handle icon clicks to open the panel.
- **User Experience**: The extension will no longer open a small overlay but a vertical panel on the side of the browser.
