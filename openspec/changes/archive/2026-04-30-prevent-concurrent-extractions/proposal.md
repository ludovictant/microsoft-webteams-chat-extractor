## Why

Multiple clicks on extraction triggers (e.g., double-clicking a time range button) can initiate concurrent extraction processes. This leads to duplicate messages, excessive DOM manipulation, and potential race conditions in the background state.

## What Changes

- **Extraction Locking**: Implement a state-aware check in the popup to prevent starting a new extraction if one is already in progress.
- **Visual Feedback**: Disable action buttons immediately upon click to prevent further interactions until the state transitions.
- **Concurrency Logging**: Add a standard console log (non-debug) when a concurrent extraction attempt is blocked.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `extraction-lifecycle-management`: Update to include concurrency prevention and state locking.

## Impact

- `popup.js`: Update event listeners and UI logic to handle extraction locking.
