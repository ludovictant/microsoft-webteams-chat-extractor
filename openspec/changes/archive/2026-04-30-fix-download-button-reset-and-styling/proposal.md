## Why

The current UI lacks consistent styling for disabled buttons, making it unclear to users when an action is unavailable. Additionally, the download button's state was not being properly reset when moving between extraction states, which could lead to a confusing user experience.

## What Changes

- **Improved Button Styling**: Added global CSS rules for `button:disabled` to provide clear visual feedback (greyed out, no-op cursor, reduced opacity).
- **Download Button Reset**: Implemented logic in `popup.js` to reset the download button's state (re-enabling it and restoring its original text/icon) when transitioning out of certain states.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `ui-simplification`: Updated to include consistent disabled state styling for all action buttons.

## Impact

- `popup.html`: Updated styles for disabled buttons.
- `popup.js`: Updated button reset logic.
