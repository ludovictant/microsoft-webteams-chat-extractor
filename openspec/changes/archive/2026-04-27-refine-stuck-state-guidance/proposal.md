## Why

The current "Stuck" state message is somewhat alarming and implies an error, whereas in most cases (approx. 90%), the extraction stalls simply because it has reached the very beginning of the chat history. The user needs clear guidance to evaluate whether the extraction is truly stuck (due to slow loading) or simply finished, allowing them to make an informed decision to either manually nudge the scroll or finalize the export.

## What Changes

- Refine the text displayed in the `statusNudge` element during the `stuck` state in `popup.js`.
- Explain that stalling is often normal when the beginning of the chat is reached.
- Provide clear instructions for both scenarios:
    1.  If history remains: Manually scroll up or click "Resume Manually".
    2.  If finished: Click "Stop and Export".

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `extraction-lifecycle-management`: Update the requirement for user guidance during the "stuck" state.

## Impact

- `popup.js`: Update the `updateUI` function with more nuanced messaging for the `stuck` status.
- UX: Reduced user anxiety and clearer path to completion for long extractions.
