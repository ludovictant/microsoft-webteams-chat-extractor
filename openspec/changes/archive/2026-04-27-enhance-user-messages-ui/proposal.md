## Why

The user interface messages during critical states (like stalls or extraction resumes) can be further refined to be more concise and professional. Standardizing the terminology and formatting across the popup ensures a cohesive and trustworthy user experience.

## What Changes

- Update the "Stalled" message in `popup.js` to use more professional and direct language.
- Standardize the formatting of status nudges (stalled, resumed) for better readability.
- Refine the wording of the "Extraction resumed" message.
- Add a persistent instruction footer or section that is **always visible** (including idle state) to warn users:
    *   Do not change the conversation in the current Teams window.
    *   Do not minimize the Teams window (switching tabs is okay).
- Ensure consistent color usage for status alerts.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `ui-simplification`: Refine requirements for user-facing status messages.
- `extraction-lifecycle-management`: Refine the requirement for the "Stalled" state instruction.

## Impact

- `popup.js`: Refinement of string literals and HTML templates in `updateUI`.
- UX: Improved clarity and professional tone during long extractions.
