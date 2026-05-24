## Why

Currently, the conversation history list in the side panel can grow indefinitely as more chats are crawled. Since the side panel has a limited width and users expect a compact interface, a long list can cause the entire side panel to exceed the browser window height. This forces users to scroll the entire panel, potentially hiding important headers or footer controls. Implementing a scrollable container for the conversation list ensures the side panel remains within the window bounds while keeping history accessible.

## What Changes

- **Constrained History List**: Implement a maximum height for the conversation history container.
- **Vertical Scrollbar**: Add a vertical scrollbar (slider) specifically for the history list when it exceeds the maximum allowed height.
- **Dynamic Layout Adjustment**: Ensure the overall side panel layout remains responsive and fits within the browser window.

## Capabilities

### Modified Capabilities
- `ui-simplification`: Update the `Side Panel Responsive Layout` requirement to include constraints on the history list height and the requirement for independent scrolling.

## Impact

- `sidepanel.html`: CSS adjustments for the history container.
- `sidepanel.js`: Modification of dynamic height calculation logic for `#localStorageContent`.
