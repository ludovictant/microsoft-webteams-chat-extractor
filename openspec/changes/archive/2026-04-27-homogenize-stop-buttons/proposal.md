## Why

The current UI uses inconsistent labels for the stop-and-export action depending on the extraction phase ("Stop Extraction then Export", "Stop and Export", "Force Stop and Export"). This inconsistency can be confusing for users. Standardizing on a single, clear label improves the professional feel and usability of the extension.

## What Changes

- Update `popup.js` to use "Stop and Export" as the universal label for the primary action button during all active extraction states (`extracting`, `stuck`, `processing`).
- Update the operational disclaimer to refer to the standardized button name.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `ui-simplification`: Add requirements for consistent terminology across the user interface.

## Impact

- `popup.js`: Update button text assignment in `updateUI`.
- `popup.html`: Update disclaimer text to match the new button label.
- UX: Improved consistency and clarity.
