## ADDED Requirements

### Requirement: Interactive Stuck State Handling
The system SHALL detect when programmatic scrolling fails to load new messages and transition to a "stuck" state that requires user intervention.

#### Scenario: Transition to stuck state
- **WHEN** the extraction loop fails to detect new messages after a set number of attempts (e.g., 15)
- **THEN** the system SHALL transition to the `stuck` state and notify the background script.

### Requirement: Manual Scroll Prompt
The popup SHALL display a clear instruction to the user when the extraction enters the `stuck` state, directing them to manually scroll the Teams window.

#### Scenario: Display manual scroll prompt
- **WHEN** the extension status is `stuck`
- **THEN** the popup SHALL show a prominent message: "Stuck! Please manually scroll up in the Teams chat window to load more history."

### Requirement: Automatic Resumption from Stuck State
The system SHALL continuously poll for new messages while in the `stuck` state and automatically resume normal operation once content changes are detected.

#### Scenario: Resume after manual scroll
- **WHEN** the system is in the `stuck` state
- **AND** a change in the oldest message timestamp is detected (due to manual scrolling)
- **THEN** the system SHALL automatically revert to the `extracting` state and continue the process.
