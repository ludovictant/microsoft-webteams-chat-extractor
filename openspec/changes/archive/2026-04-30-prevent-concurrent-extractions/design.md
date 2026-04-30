## Context

The extension current handles extraction requests by injecting `payload.js` and sending an `extract` message. If multiple buttons are clicked rapidly, multiple instances of the extraction loop can start on the same tab, or the background script's `extractionData` can be overwritten while an extraction is active.

## Goals / Non-Goals

**Goals:**
- Ensure only one extraction can be active at any time.
- Provide visual feedback by disabling buttons during the transition from `idle` to `extracting`.
- Log blocked attempts to the console.

**Non-Goals:**
- Queuing multiple extraction requests.
- Multi-tab concurrent extractions (currently limited by background script's single `extractionData` object).

## Decisions

- **Local Lock in Popup**: Introduce a `isProcessingRequest` boolean in `popup.js` to block multiple rapid clicks within the same popup session before the background status updates to `extracting`.
- **Status Check**: Verify the current background status before starting a new extraction. If status is not `idle`, block the start request.
- **Specific Console Logging**: Use `console.log` for blocking events to ensure they are visible even when debug mode is off.
- **Immediate Button Disabling**: Iterate through all buttons in `optionsDiv` and disable them as soon as a valid click is detected.

## Risks / Trade-offs

- **Deadlock**: If an extraction fails to start or update status, buttons might remain disabled. *Mitigation*: The `pollStatus` loop and `updateUI` logic will re-enable buttons if the state returns to `idle`.
