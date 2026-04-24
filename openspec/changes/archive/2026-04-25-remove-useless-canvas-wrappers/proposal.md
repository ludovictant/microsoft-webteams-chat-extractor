## Why

In the exported HTML, Microsoft Teams often includes `canvas` elements wrapped in `div` tags, typically used for rendering or layout purposes within the live app. These elements are useless in a static HTML export and can clutter the output, potentially interfering with the display of actual images or adding unnecessary vertical space.

## What Changes

- **Enhanced Cleaning Logic**: Update the `serializeMessage` function in `payload.js` to specifically target and remove `canvas` elements.
- **Wrapper Cleanup**: If a `canvas` is the only child of a `div`, that `div` should also be removed to avoid leaving empty structural artifacts in the exported HTML.

## Capabilities

### New Capabilities
- `cleaner-html-export`: Specifically targets and removes redundant UI artifacts like canvas elements and their wrappers.

### Modified Capabilities
- `pipeline-extraction`: Update the message serialization process to include more aggressive cleaning of useless DOM elements.

## Impact

- `payload.js`: The `serializeMessage` function will be modified to include the new cleaning logic.
