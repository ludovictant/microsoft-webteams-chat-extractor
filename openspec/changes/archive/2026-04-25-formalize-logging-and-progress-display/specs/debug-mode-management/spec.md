## ADDED Requirements

### Requirement: Unified Debug Logging
All extension components (popup, background script, and content script) SHALL use a unified `debugLog` function that encapsulates the check for the current Debug Mode state.

#### Scenario: Unified logging behavior
- **WHEN** any part of the extension needs to output diagnostic information
- **THEN** it SHALL call the local `debugLog` utility which only emits to the console if Debug Mode is ON.
