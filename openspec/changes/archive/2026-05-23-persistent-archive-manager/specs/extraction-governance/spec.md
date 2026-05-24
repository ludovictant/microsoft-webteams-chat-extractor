## ADDED Requirements

### Requirement: Dashboard Extraction Lock
The dashboard SHALL disable management actions during an active extraction to prevent data collisions.

#### Scenario: Locked state during extraction
- **WHEN** an extraction is in progress
- **THEN** the conversation list checkboxes and management buttons SHALL be disabled.
- **AND** a prominent "Stop Current Extraction" button SHALL be visible.

### Requirement: Partial Stop Behavior
The system SHALL retain all successfully saved data if an extraction is manually stopped.

#### Scenario: Manual stop data retention
- **WHEN** the user clicks "Stop Current Extraction"
- **THEN** all messages already written to IndexedDB SHALL be preserved.
- **AND** the conversation's message count and date range SHALL be updated.
- **AND** the `lastCrawled` date SHALL NOT be updated.
