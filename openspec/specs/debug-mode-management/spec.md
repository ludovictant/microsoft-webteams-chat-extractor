## ADDED Requirements

### Requirement: Debug Mode Toggle
The extension popup SHALL include a toggle switch that allows users to enable or disable "Debug Mode".

#### Scenario: User toggles Debug Mode ON
- **WHEN** the user clicks the Debug Mode toggle in the popup
- **THEN** the switch state SHALL change to ON.

### Requirement: Debug Mode Persistence
The Debug Mode state SHALL be persisted across extension sessions using local storage.

#### Scenario: Persist Debug Mode setting
- **WHEN** the user changes the Debug Mode setting
- **THEN** the value SHALL be saved in `chrome.storage.session`.

### Requirement: Debug Logging
When Debug Mode is ON, the system SHALL output verbose diagnostic logs to the browser console.

#### Scenario: Enable debug logs
- **WHEN** Debug Mode is ON
- **THEN** the extension SHALL output informative logs with a `[DEBUG]` prefix.

#### Scenario: Disable debug logs
- **WHEN** Debug Mode is OFF
- **THEN** the extension SHALL NOT output non-essential diagnostic logs.

### Requirement: Unified Debug Logging
All extension components (popup, background script, and content script) SHALL use a unified `debugLog` function that encapsulates the check for the current Debug Mode state.

#### Scenario: Unified logging behavior
- **WHEN** any part of the extension needs to output diagnostic information
- **THEN** it SHALL call the local `debugLog` utility which only emits to the console if Debug Mode is ON.
