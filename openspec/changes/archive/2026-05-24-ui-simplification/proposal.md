## Why

The current UI of the side panel has become crowded with several time-range options and settings that may not be equally useful for all users. Simplification will improve clarity and ensure that the most common features are prominent while reducing cognitive load. Additionally, making local storage active by default encourages users to leverage persistence features from the start.

## What Changes

- **Label Update**: Rename the "Privacy" toggle in the footer to "Stats sharing" for better clarity on its purpose.
- **Button Consolidation**: Remove the "Download last 7 days" and "Download last 3 months" buttons from the extraction options.
- **Default Settings**: Change the default value of the "Local storage" toggle to "ON" for new installations or when preferences are reset.

## Capabilities

### Modified Capabilities
- `ui-simplification`: The system SHALL feature a streamlined side panel with consolidated extraction triggers and clearer labeling for telemetry settings.
- `local-storage-management`: The local storage feature SHALL be enabled by default.

## Impact

- `sidepanel.html`: Updates to labels, removal of buttons, and adjustment of the default checkbox state.
- `sidepanel.js`: Update the default logic for local storage initialization if it hasn't been set by the user.
- `background.js`: Ensure the default state in `extractionData` matches the UI.
