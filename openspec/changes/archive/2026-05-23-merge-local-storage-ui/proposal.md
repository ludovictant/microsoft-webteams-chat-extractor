## Why

The current Side Panel UI separates the "Local storage" toggle from the conversation history list, which can lead to visual clutter and a disjointed user experience. By merging these two components, we can create a more intuitive interface where the visibility of the history list is logically tied to the state of the storage feature itself.

## What Changes

- **UI Consolidation**: Merge the Local Storage switch block and the conversation list (history table) into a single visual block.
- **Dynamic Visibility**: The conversation list will automatically collapse when the "Local storage" toggle is "Off" and expand when it is "On".
- **Default State**: The "Local storage" toggle will remain "On" by default to encourage persistent data usage.
- **Improved Information Layout**: The "Info Box" (cartouche) describing the feature will be integrated into this new unified block.

## Capabilities

### Modified Capabilities
- `ui-simplification`: Update the `Unified Extraction Interface` and `Side Panel Responsive Layout` requirements to include the merged storage/history component and its conditional visibility behavior.

## Impact

- `sidepanel.html`: Restructuring the HTML to nest the history table within the storage toggle container.
- `sidepanel.js`: Updating event listeners to handle the expansion/collapsing of the list based on toggle changes.
- `sidepanel.css`: Adjusting styles to ensure the merged block remains responsive and visually consistent.
