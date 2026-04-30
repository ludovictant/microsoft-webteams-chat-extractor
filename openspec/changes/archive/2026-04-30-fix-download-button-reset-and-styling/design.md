## Context

The extension's UI uses several buttons that are enabled or disabled based on the extraction state. Previously, the "disabled" state was handled on a per-button basis or with inconsistent styles. Also, the download button's success state ("Downloaded!") was persistent until a full reload, which could be confusing if the user wanted to perform another action.

## Goals / Non-Goals

**Goals:**
- Provide a global, consistent style for all disabled buttons in the popup.
- Ensure the download button is reset to its original state when it's appropriate to allow a new download or action.

**Non-Goals:**
- Redesigning the entire popup UI.
- Changing the underlying extraction logic.

## Decisions

- **Global CSS for `button:disabled`**: Instead of adding classes to each button, we use a global CSS selector to ensure consistency and reduce code duplication.
- **Explicit Reset Logic**: In `popup.js`, we explicitly reset the `downloadZipBtn` innerHTML and disabled property when the UI updates to a state where downloading is again relevant or when resetting.

## Risks / Trade-offs

- **Specificity**: Using `!important` in CSS might override specific button styles if they were intended to be different. *Mitigation*: The current design uses a unified look for all buttons, so this is acceptable.
