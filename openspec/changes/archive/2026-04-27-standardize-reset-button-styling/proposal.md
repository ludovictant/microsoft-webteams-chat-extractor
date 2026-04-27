## Why

The "Start New Extraction" button (the reset button) in the final extraction view has a visual appearance that diverges from the standard button design used elsewhere in the extension. It lacks a clear button-like structure (background, border, hover states), making it look more like a link or a plain text element. Standardizing its appearance is essential for maintaining UI consistency and providing clear affordance for the user's final action.

## What Changes

- Standardize the CSS styling for the "Start New Extraction" button in `popup.html`.
- Apply the consistent theme colors, padding, and border radius used for other primary buttons.
- Add hover and active states to match the interaction pattern of the extension.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `ui-simplification`: Add requirements for visual consistency of primary action buttons.

## Impact

- `popup.html`: CSS updates to the `#resetBtn` and potentially shared button classes.
- UX: Improved visual hierarchy and consistency at the end of the user workflow.
